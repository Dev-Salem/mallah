"use server";

import { createClient } from "@/lib/supabase/server";
import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

export const analyzeOpportunityAction = async (jobDescription: string) => {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return { success: false, error: "Not authenticated" };
        }

        // Fetch learner's current skills
        const { data: userSkillsData } = await supabase
            .from('user_skills')
            .select(`
                level,
                skills (
                    name,
                    category
                )
            `)
            .eq('user_id', user.id);

        const userSkillsList = userSkillsData?.map(s => {
            const skill = s.skills as any;
            return `${skill.name} (${s.level}) - ${skill.category}`;
        }) || [];

        // Determine what skills are required for the job using AI
        const { object } = await generateObject({
            model: openai('gpt-4o'),
            schema: z.object({
                match_score: z.number().min(0).max(100).describe('A score from 0-100 indicating how well the learner matches the job description based on their current skills.'),
                fulfilled_skills: z.array(z.string()).describe('List of skills mentioned in the job description that the learner currently posesses.'),
                missing_skills: z.array(z.string()).describe('List of skills mentioned in the job description that the learner is missing.'),
                summary: z.string().describe('A short, encouraging 2-sentence summary of their fit for the role.'),
            }),
            system: `You are an expert technical recruiter and career advisor. You will evaluate a learner's current skillset against a job description.
            
Learner's current skills:
${userSkillsList.length > 0 ? userSkillsList.join('\n') : "The learner currently has no registered skills."}

Instructions:
1. Extract the key technical and soft skills required by the job description.
2. Compare them against the learner's current skills.
3. Calculate a realistic match score from 0 to 100. Be honest but encouraging.
4. Return a structured JSON response categorizing fulfilled vs missing skills.
`,
            prompt: `Job Description to analyze:\n\n${jobDescription}`,
        });

        // Update the analyses count in learners
        await supabase.rpc('increment_opportunity_analyses_count', { user_uuid: user.id });

        return {
            success: true,
            analysis: object
        };

    } catch (e: any) {
        console.error("Opportunity analysis error:", e);
        return { success: false, error: e.message || "Unknown error" };
    }
}
