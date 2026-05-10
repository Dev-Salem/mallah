"use server";

import { createClient } from '@/lib/supabase/server';


import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { analyzerService } from '../services/analyzer.service';
import { calculateOpportunityScore } from '../services/scoring';
import { 
    ExtractedCV, 
    OpportunityAnalysisResult 
} from '../types';

const MODEL = openai('gpt-4o');

export const parseCvAction = async (cvText: string): Promise<{ success: boolean; data?: ExtractedCV; error?: string }> => {
    try {
        const { object } = await generateObject({
            model: MODEL,
            maxRetries: 2,
            schema: z.object({
                extracted_skills: z.array(z.object({
                    skill_name: z.string(),
                    inferred_level: z.string()
                })),
                extracted_projects: z.array(z.object({
                    project_name: z.string(),
                    skills: z.array(z.string()),
                    summary: z.string().optional()
                })).default([]),
                experience_years: z.number(),
                previous_roles: z.array(z.string())
            }),
            system: "You are an expert technical recruiter analyzing a resume/CV.",
            prompt: `Parse this CV and extract:
- the key skills with their inferred level (beginner/intermediate/advanced)
- CV projects as an array of { project_name, skills, summary }
- total years of experience
- previous roles

Return strict JSON.\n\nCV Text:\n${cvText}`
        });

        return { success: true, data: object };
    } catch (e: unknown) {
        const err = e as Error;
        console.error("CV Parsing Error:", err);
        return { success: false, error: err.message || "Failed to parse CV" };
    }
}

export const analyzeJobAction = async (jobDescription: string, cvData: ExtractedCV | null): Promise<{ success: boolean; analysis?: OpportunityAnalysisResult; error?: string }> => {
    try {
        // 1. Fetch Learner Data
        const profileData = await analyzerService.getLearnerProfileData();
        const mallahSkills = profileData.skills || [];

        // 2. Parse JD
        const { object: jdData } = await generateObject({
            model: MODEL,
            maxRetries: 2,
            schema: z.object({
                job_title: z.string().nullable(),
                company_name: z.string().nullable(),
                seniority: z.enum(['Intern', 'Junior', 'Mid', 'Senior']).nullable(),
                employment_type: z.enum(['Full-time', 'Part-time', 'Contract', 'Remote']).nullable(),
                location: z.string().nullable(),
                required_skills: z.array(z.string()),
                preferred_skills: z.array(z.string()),
                responsibilities: z.array(z.string())
            }),
            system: "You are an expert technical recruiter extracting details from a job description.",
            prompt: `Extract the details from this job description:\n\n${jobDescription}`
        });

        // 3. Calculate weighted opportunity score
        const scoring = calculateOpportunityScore({
            requiredSkills: jdData.required_skills,
            preferredSkills: jdData.preferred_skills,
            mallahSkills,
            completedProjects: profileData.completedProjects || [],
            progress: profileData.progress || [],
            cvData,
            currentPathId: profileData.learnerProfile?.current_path_id
        });

        // 4. Generate Action Plan
        const { object: actionPlanResult } = await generateObject({
            model: MODEL,
            maxRetries: 2,
            schema: z.object({
                action_plan: z.array(z.object({
                    step_type: z.enum(['learn_topic', 'build_project', 'update_resume', 'apply_now']),
                    title: z.string(),
                    reason: z.string().nullable(),
                    link_target: z.string().nullable()
                }))
            }),
            system: `You are a career advisor. Create an actionable roadmap plan for a learner to land this job.
            Missing Required Skills: ${scoring.breakdown.missing.required.join(', ')}
            Missing Preferred Skills: ${scoring.breakdown.missing.preferred.join(', ')}
            Max 7 steps. Prioritize learning first, then building projects, then resume/applying.
            `,
            prompt: `Create the action plan based on the missing skills and the goal of getting this job: ${jdData.job_title || 'Software Engineer'}`
        });

        const analysisResult: OpportunityAnalysisResult = {
            match_score: scoring.score,
            job_title: jdData.job_title || null,
            company_name: jdData.company_name || null,
            location: jdData.location || null,
            seniority_level: jdData.seniority || null,
            raw_jd_text: jobDescription,
            extracted_skills: {
                required: jdData.required_skills,
                preferred: jdData.preferred_skills
            },
            skills_breakdown: scoring.breakdown,
            action_plan: actionPlanResult.action_plan,
            cv_skills_contributed: scoring.cvSkillsContributed,
            is_saved: false
        };

        return { success: true, analysis: analysisResult };
    } catch (error: unknown) {
        const err = error as Error;
        console.error("Opportunity Analysis Orchestration Error:", err);
        return { success: false, error: err.message || "Failed to analyze opportunity" };
    }
}

export const saveAnalysisAction = async (data: OpportunityAnalysisResult) => {
    return await analyzerService.saveAnalysis(data);
};

export const getSavedAnalysesAction = async () => {
    return await analyzerService.getSavedAnalyses();
};

export const deleteAnalysisAction = async (id: string) => {
    return await analyzerService.deleteAnalysis(id);
};


export const getSavedCVAction = async (): Promise<{ success: boolean; data?: ExtractedCV; fileName?: string; error?: string }> => {
    try {
        const data = await analyzerService.getCvUpload();
        if (data) {
            return { 
                success: true, 
                data: {
                    extracted_skills: data.extracted_skills as any,
                    extracted_projects: (data.cv_projects as any) ?? [],
                    experience_years: data.experience_years ?? 0,
                    previous_roles: data.previous_roles ?? []
                },
                fileName: data.file_name
            };
        }
        return { success: true };
    } catch (e: unknown) {
        const err = e as Error;
        console.error("Get Saved CV Error:", err);
        return { success: false, error: err.message || "Failed to fetch CV" };
    }
};

export const uploadCVAction = async (formData: FormData): Promise<{ success: boolean; data?: ExtractedCV; error?: string }> => {
    try {
        const file = formData.get('file') as File;
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: "Authentication required" };
        }

        if (!file) {
            return { success: false, error: "Missing file" };
        }

        // 1. Upload to Storage
        const filePath = `${user.id}/${Date.now()}_${file.name}`;
        const { error: uploadError } = await supabase.storage
            .from('cv-uploads')
            .upload(filePath, file);

        if (uploadError) {
            throw new Error(`Upload failed: ${uploadError.message}`);
        }

        // 2. Extract Text from PDF locally using pdf-parse
        let textContent = "";
        try {
            const arrayBuffer = await file.arrayBuffer();
            const { extractText } = await import('unpdf');
            const { text } = await extractText(new Uint8Array(arrayBuffer), { mergePages: true });
            textContent = text;
        } catch (parseError) {
            console.error("PDF Parsing failed:", parseError);
            throw new Error("Failed to extract text from PDF. Ensure the file is a valid PDF.");
        }

        // 3. Parse with OpenAI using our existing Server Action
        const parseResult = await parseCvAction(textContent);
        
        if (!parseResult.success || !parseResult.data) {
            throw new Error(`AI Parsing failed: ${parseResult.error}`);
        }

        // 4. Save to Database
        const { error: dbError } = await supabase
            .from('cv_uploads')
            .upsert(
                {
                    user_id: user.id,
                    file_name: file.name,
                    extracted_skills: parseResult.data.extracted_skills,
                    cv_projects: parseResult.data.extracted_projects,
                    experience_years: parseResult.data.experience_years,
                    previous_roles: parseResult.data.previous_roles,
                    uploaded_at: new Date().toISOString(),
                },
                { onConflict: 'user_id' }
            );

        if (dbError) {
            console.error("Failed to save CV to database:", dbError);
            // Non-fatal, we can still return the parsed data
        }

        return { 
            success: true, 
            data: parseResult.data 
        };

    } catch (e: unknown) {
        const err = e as Error;
        console.error("CV Upload Orchestration Error:", err);
        return { success: false, error: err.message || "Failed to upload CV" };
    }
};
