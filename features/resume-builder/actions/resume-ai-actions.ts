"use server";

import { generateAIResponse } from "@/lib/ai/openai";
import { buildResumeImprovePrompt, buildATSScorePrompt } from "@/lib/ai/prompts";
import { createClient } from "@/lib/supabase/server";

export async function improveResumeText(
    sectionType: string,
    originalText: string,
    resumeLanguage: string
) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    const { data: learner } = await supabase
        .from("learners")
        .select("current_path_id, paths(name)")
        .eq("user_id", user.id)
        .single();

    const pathName = (learner?.paths as any)?.name || "Unknown";

    const prompt = buildResumeImprovePrompt({
        sectionType,
        originalText,
        pathName,
        language: resumeLanguage,
    });

    const improved = await generateAIResponse(prompt, originalText, {
        temperature: 0.5,
        maxTokens: 1024,
    });

    return { improved };
}

export async function calculateATSScore(resumeId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    // Get resume with sections
    const { data: sections } = await supabase
        .from("resume_sections")
        .select("section_type, header, section_content")
        .eq("resume_id", resumeId)
        .order("sort_order", { ascending: true });

    if (!sections || sections.length === 0) return { error: "No sections found" };

    // Get learner's path for target role
    const { data: learner } = await supabase
        .from("learners")
        .select("current_path_id, paths(name)")
        .eq("user_id", user.id)
        .single();

    const targetRole = (learner?.paths as any)?.name || "Software Developer";

    // Build combined resume content
    const resumeContent = sections
        .map((s) => `[${s.section_type}]${s.header ? ` - ${s.header}` : ""}\n${s.section_content}`)
        .join("\n\n");

    const prompt = buildATSScorePrompt({ resumeContent, targetRole });
    const response = await generateAIResponse(prompt, "Score this resume", {
        temperature: 0.3,
        maxTokens: 512,
    });

    try {
        const parsed = JSON.parse(response);
        // Save score to DB
        await supabase
            .from("resumes")
            .update({ ats_score: parsed.score })
            .eq("id", resumeId);

        return { score: parsed.score, feedback: parsed.feedback };
    } catch {
        return { error: "Could not parse ATS score response" };
    }
}
