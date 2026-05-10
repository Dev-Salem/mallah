"use server";

import { createClient } from '@/lib/supabase/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';


import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { analyzerService } from '../services/analyzer.service';
import { calculateOpportunityScore, enrichMissingSkillsWithRoadmap, getCoveredSkillsForProject, sanitizeExtractedSkills } from '../services/scoring';
import { 
    ExtractedCV, 
    OpportunityAnalysisResult,
    PortfolioSyncData,
    PortfolioSyncRelevantProject,
    PortfolioSyncSuggestion,
} from '../types';

const MODEL = openai('gpt-4o');

const portfolioSyncRequestSchema = z.object({
    job_title: z.string().nullable().optional(),
    required_skills: z.array(z.string()),
    missing_required_skills: z.array(z.string()),
});

const addPortfolioSyncProjectSchema = z.object({
    suggestion_type: z.enum(['catalog', 'generated']),
    project_id: z.string().nullable().optional(),
    title: z.string().min(1).max(200),
    description: z.string().max(2000).default(''),
    effort_level: z.enum(['Beginner', 'Intermediate']),
    covered_skills: z.array(z.string()).default([]),
});

const cvExtractionSchema = z.object({
    extracted_skills: z.array(z.object({
        skill_name: z.string(),
        inferred_level: z.string()
    })),
    extracted_projects: z.array(z.object({
        project_name: z.string(),
        skills: z.array(z.string()),
        summary: z.string()
    })),
    experience_years: z.number(),
    previous_roles: z.array(z.string())
});

function normalizeWhitespace(text: string): string {
    return text
        .replace(/\u0000/g, ' ')
        .replace(/\r/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .replace(/[ \t]{2,}/g, ' ')
        .trim();
}

function validateExtractedText(text: string): string | null {
    const normalized = normalizeWhitespace(text);
    const wordCount = normalized.split(/\s+/).filter(Boolean).length;
    const alphaChars = (normalized.match(/[A-Za-z\u0600-\u06FF]/g) || []).length;

    if (wordCount < 40 || alphaChars < 150) {
        return 'We could not extract enough readable text from this CV. Please upload a text-based PDF, not a scanned image.';
    }

    return null;
}

function dedupeStrings(values: string[]): string[] {
    const seen = new Set<string>();
    const output: string[] = [];

    for (const value of values) {
        const cleaned = value.trim();
        if (!cleaned) continue;
        const key = cleaned.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        output.push(cleaned);
    }

    return output;
}

function pickProjectMeta<T>(value: T | T[] | null | undefined): T | null {
    if (Array.isArray(value)) return value[0] ?? null;
    return value ?? null;
}

function extractLinkedSkillNames(
    entries: Array<{
        skills?: { name?: string | null } | Array<{ name?: string | null } | null> | null;
    } | null | undefined> | null | undefined
): string[] {
    return dedupeStrings(
        (entries ?? [])
            .flatMap((entry) => {
                const skills = entry?.skills;
                if (Array.isArray(skills)) {
                    return skills.map((skill) => skill?.name ?? '');
                }

                return skills?.name ? [skills.name] : [];
            })
            .filter(Boolean)
    );
}

type LightweightProjectMeta = {
    project_skills?: Array<{
        skills?: { name?: string | null } | Array<{ name?: string | null } | null> | null;
    } | null> | null;
};

function buildExistingProjectSkillList(project: {
    tech_stack?: string[] | null;
    projects?: LightweightProjectMeta | LightweightProjectMeta[] | null;
}): string[] {
    const projectMeta = pickProjectMeta(project.projects);
    return dedupeStrings([
        ...extractLinkedSkillNames(projectMeta?.project_skills),
        ...(project.tech_stack ?? []),
    ]);
}

function buildCatalogProjectSkillList(project: {
    recommended_tech?: string[] | null;
    project_skills?: LightweightProjectMeta['project_skills'];
}): string[] {
    return dedupeStrings([
        ...extractLinkedSkillNames(project.project_skills),
        ...(project.recommended_tech ?? []),
    ]);
}

function normalizeDifficultyToEffort(value?: string | null): 'Beginner' | 'Intermediate' {
    const normalized = (value ?? '').trim().toLowerCase();
    if (normalized === 'beginner') return 'Beginner';
    return 'Intermediate';
}

function sortSuggestionsByCoverage<T extends { covered_skills: string[]; effort_level?: string }>(items: T[]): T[] {
    const effortRank = (value?: string) => value === 'Beginner' ? 0 : 1;

    return [...items].sort((a, b) => {
        if (b.covered_skills.length !== a.covered_skills.length) {
            return b.covered_skills.length - a.covered_skills.length;
        }

        return effortRank(a.effort_level) - effortRank(b.effort_level);
    });
}

function coerceSkillNames(items: unknown): string[] {
    if (!Array.isArray(items)) return [];
    return sanitizeExtractedSkills(items.filter((item): item is string => typeof item === 'string'));
}

async function generateAiPortfolioSuggestions(params: {
    jobTitle: string | null | undefined;
    requiredSkills: string[];
    missingRequiredSkills: string[];
    existingProjectTitles: string[];
}): Promise<PortfolioSyncSuggestion[]> {
    const { object } = await generateObject({
        model: MODEL,
        maxRetries: 2,
        schema: z.object({
            projects: z.array(z.object({
                title: z.string(),
                covered_skills: z.array(z.string()),
                effort_level: z.enum(['Beginner', 'Intermediate']),
                reason: z.string(),
                description: z.string(),
            })).min(1).max(3),
        }),
        system: `You are a portfolio strategist helping a learner become competitive for a technical role.
Return specific named portfolio projects only.

Rules:
- Every title must name a concrete project, not a vague task.
- Prefer projects that cover multiple missing required skills when possible.
- effort_level must be Beginner or Intermediate only.
- covered_skills must be chosen from the learner's missing required skills list.
- reason must be one sentence explaining why this project matters for this exact job.
- description must be one short sentence describing what the project is.`,
        prompt: `Target job: ${params.jobTitle || 'This role'}
Required skills: ${params.requiredSkills.join(', ') || 'None listed'}
Missing required skills: ${params.missingRequiredSkills.join(', ') || 'None'}
Avoid duplicating these existing project titles: ${params.existingProjectTitles.join(', ') || 'None'}

Generate 1 to 3 project ideas that would strengthen the learner's portfolio for this job.`
    });

    return sortSuggestionsByCoverage(
        object.projects.map((project, index) => {
            const coveredSkills = dedupeStrings(
                project.covered_skills.filter((skill) =>
                    params.missingRequiredSkills.some((missingSkill) => missingSkill.toLowerCase() === skill.toLowerCase())
                )
            );

            return {
                suggestion_id: `generated-${index + 1}`,
                suggestion_type: 'generated' as const,
                project_id: null,
                title: project.title.trim(),
                covered_skills: coveredSkills.length > 0 ? coveredSkills : params.missingRequiredSkills.slice(0, 2),
                effort_level: project.effort_level,
                reason: project.reason.trim(),
                description: project.description.trim(),
            };
        }).filter((project) => project.title.length > 0)
    );
}

function mapRelevantExistingProjects(requiredSkills: string[], sourceData: Awaited<ReturnType<typeof analyzerService.getPortfolioSyncSourceData>>): PortfolioSyncRelevantProject[] {
    const learnerProjects = sourceData.completedProjects
        .map((project, index) => {
            const meta = pickProjectMeta(project.projects);
            const coveredSkills = getCoveredSkillsForProject(requiredSkills, buildExistingProjectSkillList(project));
            if (coveredSkills.length < 2) return null;

            const sourceLabel = meta?.source_type === 'roadmap' ? 'Mallah Roadmap' : 'Portfolio Hub';

            return {
                id: project.project_id?.trim() || `existing-${index}`,
                title: meta?.title?.trim() || 'Untitled Project',
                covered_skills: coveredSkills,
                source_label: sourceLabel,
                source_type: meta?.source_type === 'roadmap' ? 'roadmap' : 'portfolio',
                project_url: project.demo_url || project.github_url || null,
            } satisfies PortfolioSyncRelevantProject;
        })
        .filter(Boolean) as PortfolioSyncRelevantProject[];

    const cvProjects = sourceData.cvProjects
        .map((project, index) => {
            const title = project?.project_name?.trim() || '';
            if (!title) return null;

            const coveredSkills = getCoveredSkillsForProject(requiredSkills, project.skills ?? []);
            if (coveredSkills.length < 2) return null;

            return {
                id: `cv-${index}`,
                title,
                covered_skills: coveredSkills,
                source_label: 'From CV',
                source_type: 'cv',
                project_url: null,
            } satisfies PortfolioSyncRelevantProject;
        })
        .filter(Boolean) as PortfolioSyncRelevantProject[];

    return [...learnerProjects, ...cvProjects];
}

function normalizeCvData(data: ExtractedCV): ExtractedCV {
    return {
        extracted_skills: dedupeStrings(
            data.extracted_skills.map((skill) => skill.skill_name)
        ).map((skillName) => {
            const original = data.extracted_skills.find((skill) => skill.skill_name.trim().toLowerCase() === skillName.toLowerCase());
            return {
                skill_name: skillName,
                inferred_level: original?.inferred_level?.trim().toLowerCase() || 'intermediate'
            };
        }),
        extracted_projects: data.extracted_projects
            .map((project) => ({
                project_name: project.project_name.trim(),
                skills: dedupeStrings(project.skills),
                summary: project.summary?.trim() || undefined
            }))
            .filter((project) => project.project_name.length > 0),
        experience_years: Math.max(0, Math.round((data.experience_years || 0) * 10) / 10),
        previous_roles: dedupeStrings(data.previous_roles)
    };
}

function isCvExtractionEmpty(data: ExtractedCV): boolean {
    return (
        data.extracted_skills.length === 0 &&
        data.extracted_projects.length === 0 &&
        data.previous_roles.length === 0 &&
        data.experience_years === 0
    );
}

export const parseCvAction = async (cvText: string): Promise<{ success: boolean; data?: ExtractedCV; error?: string }> => {
    try {
        const normalizedCvText = normalizeWhitespace(cvText);
        const textValidationError = validateExtractedText(normalizedCvText);

        if (textValidationError) {
            return { success: false, error: textValidationError };
        }

        const { object } = await generateObject({
            model: MODEL,
            maxRetries: 2,
            schema: cvExtractionSchema,
            system: `You are an expert technical recruiter analyzing a resume/CV.
Extract all useful information needed for job matching.

Rules:
- Return strict JSON only.
- extracted_skills: include technical skills actually evidenced in the CV, not soft skills.
- inferred_level must be beginner, intermediate, or advanced.
- extracted_projects: include named projects, freelance/client work, capstones, and substantial portfolio work.
- For each extracted project, always include:
  - project_name as a string
  - skills as an array, use [] if none are clear
  - summary as a string, use "" if no summary is available
- previous_roles: include role titles only, not company names.
- experience_years: estimate total relevant experience as a number.
- If something is missing, return [] or 0 or "" instead of guessing wildly.`,
            prompt: `Parse this CV and extract:
- the key skills with their inferred level (beginner/intermediate/advanced)
- CV projects as an array of { project_name, skills, summary }
- total years of experience
- previous roles

Return strict JSON.\n\nCV Text:\n${normalizedCvText}`
        });

        const normalizedData = normalizeCvData(object);

        if (isCvExtractionEmpty(normalizedData)) {
            return {
                success: false,
                error: 'We extracted text from the CV, but could not identify enough structured information. Please upload a clearer PDF.'
            };
        }

        return { success: true, data: normalizedData };
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
            system: "You are an expert technical recruiter extracting details from a job description. Extract only actual skills into required_skills and preferred_skills. Degrees, certifications, and credentials are not skills and must be excluded.",
            prompt: `Extract the details from this job description:\n\n${jobDescription}`
        });

        const requiredSkills = sanitizeExtractedSkills(jdData.required_skills);
        const preferredSkills = sanitizeExtractedSkills(jdData.preferred_skills);

        // 3. Calculate weighted opportunity score
        const scoring = calculateOpportunityScore({
            requiredSkills,
            preferredSkills,
            mallahSkills,
            completedProjects: profileData.completedProjects || [],
            progress: profileData.progress || [],
            cvData,
            currentPathId: profileData.learnerProfile?.current_path_id
        });

        const roadmapTopics = (profileData.roadmapTopics || []).map((topic: any) => {
            const stage = Array.isArray(topic.stages) ? topic.stages[0] : topic.stages;
            return {
                topic_id: topic.topic_id,
                topic_title: topic.title,
                stage_title: stage?.title ?? 'Current Path',
                stage_order_index: stage?.order_index ?? 0,
                linked_skills: (topic.topic_skills || [])
                    .flatMap((entry: any) => {
                        const skills = Array.isArray(entry.skills) ? entry.skills : [entry.skills];
                        return skills.filter(Boolean).map((skill: any) => skill.name).filter(Boolean);
                    })
            };
        });

        const enrichedBreakdown = {
            ...scoring.breakdown,
            missing: {
                required: enrichMissingSkillsWithRoadmap(scoring.breakdown.missing.required, roadmapTopics),
                preferred: enrichMissingSkillsWithRoadmap(scoring.breakdown.missing.preferred, roadmapTopics)
            }
        };

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
            Missing Required Skills: ${enrichedBreakdown.missing.required.map((skill) => skill.skill_name).join(', ')}
            Missing Preferred Skills: ${enrichedBreakdown.missing.preferred.map((skill) => skill.skill_name).join(', ')}
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
                required: requiredSkills,
                preferred: preferredSkills
            },
            skills_breakdown: enrichedBreakdown,
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

export const getPortfolioSyncAction = async (
    input: z.infer<typeof portfolioSyncRequestSchema>
): Promise<{ success: boolean; data?: PortfolioSyncData; error?: string }> => {
    try {
        const parsed = portfolioSyncRequestSchema.safeParse(input);
        if (!parsed.success) {
            return { success: false, error: 'Invalid portfolio sync request.' };
        }

        const requiredSkills = sanitizeExtractedSkills(parsed.data.required_skills);
        const missingRequiredSkills = sanitizeExtractedSkills(parsed.data.missing_required_skills);
        const sourceData = await analyzerService.getPortfolioSyncSourceData();

        const existingRelevantProjects = mapRelevantExistingProjects(requiredSkills, sourceData);
        const existingTotalCount =
            sourceData.completedProjects.length +
            sourceData.cvProjects.filter((project) => project?.project_name?.trim()).length;

        let buildSuggestions: PortfolioSyncSuggestion[] = [];

        if (missingRequiredSkills.length > 0) {
            const minimumCatalogCoverage = Math.min(2, missingRequiredSkills.length);
            const excludedProjectIds = new Set(sourceData.existingUserProjectIds);

            const rawCatalogSuggestions = sourceData.catalogProjects
                .filter((project) => project.project_id && !excludedProjectIds.has(project.project_id))
                .map((project) => {
                    const coveredSkills = getCoveredSkillsForProject(
                        missingRequiredSkills,
                        buildCatalogProjectSkillList(project)
                    );

                    if (coveredSkills.length < minimumCatalogCoverage) return null;

                    return {
                        suggestion_id: `catalog-${project.project_id}`,
                        suggestion_type: 'catalog' as const,
                        project_id: project.project_id,
                        title: project.title?.trim() || 'Untitled Project',
                        covered_skills: coveredSkills,
                        effort_level: normalizeDifficultyToEffort(project.difficulty_level),
                        reason: `This project helps prove ${coveredSkills.join(', ')} for ${parsed.data.job_title || 'this role'}.`,
                        description: project.description?.trim() || 'A platform project aligned with the skills this job is still missing.',
                    } satisfies PortfolioSyncSuggestion;
                })
                .filter(Boolean) as PortfolioSyncSuggestion[];

            const catalogSuggestions = sortSuggestionsByCoverage(rawCatalogSuggestions).slice(0, 4);

            buildSuggestions = catalogSuggestions;

            if (buildSuggestions.length === 0) {
                buildSuggestions = await generateAiPortfolioSuggestions({
                    jobTitle: parsed.data.job_title,
                    requiredSkills,
                    missingRequiredSkills,
                    existingProjectTitles: existingRelevantProjects.map((project) => project.title),
                });
            }
        }

        return {
            success: true,
            data: {
                existing_total_count: existingTotalCount,
                existing_relevant_projects: existingRelevantProjects,
                build_suggestions: buildSuggestions,
            },
        };
    } catch (e: unknown) {
        const err = e as Error;
        console.error("Portfolio Sync Error:", err);
        return { success: false, error: err.message || 'Failed to load portfolio sync data.' };
    }
};

export const addPortfolioSyncProjectAction = async (
    input: z.infer<typeof addPortfolioSyncProjectSchema>
): Promise<{ success: boolean; already_exists?: boolean; error?: string }> => {
    try {
        const parsed = addPortfolioSyncProjectSchema.safeParse(input);
        if (!parsed.success) {
            return { success: false, error: 'Invalid project suggestion.' };
        }

        const supabase = await createClient();
        const admin = getSupabaseAdmin();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: 'Authentication required.' };
        }

        if (parsed.data.suggestion_type === 'catalog') {
            if (!parsed.data.project_id) {
                return { success: false, error: 'Missing catalog project id.' };
            }

            const { data: existingProject, error: existingError } = await supabase
                .from('user_projects')
                .select('project_id')
                .eq('user_id', user.id)
                .eq('project_id', parsed.data.project_id)
                .maybeSingle();

            if (existingError && existingError.code !== 'PGRST116') {
                throw existingError;
            }

            if (existingProject) {
                return { success: true, already_exists: true };
            }

            const { error: insertError } = await admin
                .from('user_projects')
                .insert({
                    user_id: user.id,
                    project_id: parsed.data.project_id,
                    status: 'available',
                    is_public: true,
                    tech_stack: parsed.data.covered_skills,
                });

            if (insertError) throw insertError;
        } else {
            const { data: verifiedSkills, error: skillsError } = await admin
                .from('skills')
                .select('skill_id, name')
                .eq('is_verified', true);

            if (skillsError) throw skillsError;

            const requestedSkills = coerceSkillNames(parsed.data.covered_skills);
            const skillIds = (verifiedSkills ?? [])
                .filter((skill) => requestedSkills.some((requested) => requested.toLowerCase() === skill.name.toLowerCase()))
                .map((skill) => skill.skill_id);

            const projectId = crypto.randomUUID();
            const { error: projectError } = await admin
                .from('projects')
                .insert({
                    project_id: projectId,
                    title: parsed.data.title,
                    description: parsed.data.description || parsed.data.title,
                    difficulty_level: parsed.data.effort_level.toLowerCase(),
                    recommended_tech: requestedSkills,
                    source_type: 'user_custom',
                    is_public_default: true,
                    is_active: true,
                });

            if (projectError) throw projectError;

            if (skillIds.length > 0) {
                const { error: projectSkillsError } = await admin
                    .from('project_skills')
                    .insert(skillIds.map((skillId) => ({ project_id: projectId, skill_id: skillId })));

                if (projectSkillsError) throw projectSkillsError;
            }

            const { error: userProjectError } = await admin
                .from('user_projects')
                .insert({
                    user_id: user.id,
                    project_id: projectId,
                    status: 'available',
                    is_public: true,
                    tech_stack: requestedSkills,
                });

            if (userProjectError) throw userProjectError;
        }

        revalidatePath('/dashboard/portfolio');
        revalidatePath('/portfolio', 'layout');
        return { success: true };
    } catch (e: unknown) {
        const err = e as Error;
        console.error("Add Portfolio Sync Project Error:", err);
        return { success: false, error: err.message || 'Failed to add project to portfolio plan.' };
    }
};

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

        const lowerName = file.name.toLowerCase();
        const isPdf = file.type === 'application/pdf' || lowerName.endsWith('.pdf');

        if (!isPdf) {
            return { success: false, error: "Only PDF CV uploads are supported right now." };
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

        const textValidationError = validateExtractedText(textContent);
        if (textValidationError) {
            return { success: false, error: textValidationError };
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
