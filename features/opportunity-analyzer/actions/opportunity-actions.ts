"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { generateAIResponse } from "@/lib/ai/openai";
import { buildJobAnalysisPrompt, buildActionPlanPrompt } from "@/lib/ai/prompts";

export async function analyzeJobDescription(jobDescription: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    // 1. Parse the job description with AI
    const parsePrompt = buildJobAnalysisPrompt({ jobDescription });
    const parseResponse = await generateAIResponse(parsePrompt, jobDescription, {
        temperature: 0.3,
        maxTokens: 1024,
    });

    let parsed;
    try {
        parsed = JSON.parse(parseResponse);
    } catch {
        return { error: "Could not parse job description" };
    }

    // 2. Get user's skills to compute match
    const { data: userSkills } = await supabase
        .from("user_skills")
        .select("skills(name)")
        .eq("user_id", user.id);

    const userSkillNames = (userSkills || []).map((us: any) => us.skills?.name?.toLowerCase()).filter(Boolean);
    const allRequired = (parsed.required_skills || []) as string[];
    const allPreferred = (parsed.preferred_skills || []) as string[];

    const matchedSkills = allRequired.filter((s: string) =>
        userSkillNames.includes(s.toLowerCase())
    );
    const missingSkills = allRequired.filter((s: string) =>
        !userSkillNames.includes(s.toLowerCase())
    );

    const matchScore = allRequired.length > 0
        ? Math.round((matchedSkills.length / allRequired.length) * 100)
        : 0;

    // 3. Get learner info for action plan
    const { data: learner } = await supabase
        .from("learners")
        .select("current_path_id, ai_language_pref, paths(name)")
        .eq("user_id", user.id)
        .single();

    const pathName = (learner?.paths as any)?.name || "Unknown";
    const aiLang = learner?.ai_language_pref || "EN";

    // 4. Generate action plan
    const actionPlanPrompt = buildActionPlanPrompt({
        jobTitle: parsed.job_title || "Unknown",
        matchedSkills,
        missingSkills,
        pathName,
        aiLanguagePref: aiLang,
    });
    const actionPlan = await generateAIResponse(actionPlanPrompt, "Generate plan", {
        temperature: 0.6,
        maxTokens: 1024,
    });

    // 5. Save to DB
    const { data: analysis, error } = await supabase
        .from("opportunity_analyses")
        .insert({
            user_id: user.id,
            job_title: parsed.job_title || null,
            job_description: jobDescription,
            seniority: parsed.seniority || null,
            required_skills: allRequired,
            preferred_skills: allPreferred,
            matched_skills: matchedSkills,
            missing_skills: missingSkills,
            match_score: matchScore,
            action_plan: actionPlan,
        })
        .select()
        .single();

    if (error) return { error: error.message };

    revalidatePath("/dashboard/opportunities");
    return { analysis };
}
