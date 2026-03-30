"use server";

import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { analyzerService } from '../services/analyzer.service';
import { 
    ExtractedCV, 
    MatchScoreBreakdown, 
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
                experience_years: z.number(),
                previous_roles: z.array(z.string())
            }),
            system: "You are an expert technical recruiter analyzing a resume/CV.",
            prompt: `Parse this CV and extract the key skills with their inferred level (beginner/intermediate/advanced), total years of experience, and previous roles.\n\nCV Text:\n${cvText}`
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
                required_skills: z.array(z.string()),
                preferred_skills: z.array(z.string()),
                responsibilities: z.array(z.string())
            }),
            system: "You are an expert technical recruiter extracting details from a job description.",
            prompt: `Extract the details from this job description:\n\n${jobDescription}`
        });

        // 3. Merge Skills & Calculate Matches
        const breakdown: MatchScoreBreakdown = { matched: [], partial: [], missing: { required: [], preferred: [] } };
        let requiredMatchedCount = 0;
        let preferredMatchedCount = 0;
        let cvScoreContribution = 0;

        const checkSkillMatch = (skill: string, isRequired: boolean) => {
            const skillLower = skill.toLowerCase();
            const mallahMatch = mallahSkills.find(s => s.skills?.name.toLowerCase().includes(skillLower) || skillLower.includes(s.skills?.name?.toLowerCase() || ''));
            
            if (mallahMatch) {
                breakdown.matched.push({
                    skill_name: mallahMatch.skills?.name || skill,
                    source: mallahMatch.source as 'roadmap' | 'project' | 'manual' | 'cv',
                    is_verified: true,
                    current_level: mallahMatch.level,
                    weight: 1.0
                });
                if (isRequired) requiredMatchedCount += 1.0;
                else preferredMatchedCount += 1.0;
                return true;
            }

            if (cvData) {
                const cvMatch = cvData.extracted_skills.find(s => s.skill_name.toLowerCase().includes(skillLower) || skillLower.includes(s.skill_name.toLowerCase()));
                if (cvMatch) {
                    cvScoreContribution++;
                    breakdown.matched.push({
                        skill_name: cvMatch.skill_name,
                        source: 'cv',
                        is_verified: false,
                        current_level: cvMatch.inferred_level,
                        weight: 0.7
                    });
                    if (isRequired) requiredMatchedCount += 0.7;
                    else preferredMatchedCount += 0.7;
                    return true;
                }
            }
            
            return false;
        };

        jdData.required_skills.forEach(skill => {
            if (!checkSkillMatch(skill, true)) breakdown.missing.required.push(skill);
        });
        jdData.preferred_skills.forEach(skill => {
            if (!checkSkillMatch(skill, false)) breakdown.missing.preferred.push(skill);
        });

        // Calculate basic Match Score
        const reqCount = Math.max(jdData.required_skills.length, 1);
        const prefCount = Math.max(jdData.preferred_skills.length, 1);
        
        let score = ((requiredMatchedCount / reqCount) * 60) + ((preferredMatchedCount / prefCount) * 20) + 20; 
        score = Math.min(Math.round(score), 100);

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
            Missing Required Skills: ${breakdown.missing.required.join(', ')}
            Missing Preferred Skills: ${breakdown.missing.preferred.join(', ')}
            Max 7 steps. Prioritize learning first, then building projects, then resume/applying.
            `,
            prompt: `Create the action plan based on the missing skills and the goal of getting this job: ${jdData.job_title || 'Software Engineer'}`
        });

        const analysisResult: OpportunityAnalysisResult = {
            match_score: score,
            job_title: jdData.job_title || null,
            company_name: jdData.company_name || null,
            seniority_level: jdData.seniority || null,
            raw_jd_text: jobDescription,
            extracted_skills: {
                required: jdData.required_skills,
                preferred: jdData.preferred_skills
            },
            skills_breakdown: breakdown,
            action_plan: actionPlanResult.action_plan,
            cv_skills_contributed: cvScoreContribution,
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
