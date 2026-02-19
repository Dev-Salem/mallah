"use server";

import { createClient } from "@/lib/supabase/server";
import { generateAIResponseWithHistory } from "@/lib/ai/openai";
import { buildTopicTutorSystemPrompt } from "@/lib/ai/prompts";

export async function sendTopicChatMessage(
    topicId: string,
    message: string,
    chatHistory: Array<{ role: "user" | "assistant"; content: string }>
) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    // Get topic + learner data in parallel
    const [topicRes, learnerRes] = await Promise.all([
        supabase
            .from("topics")
            .select(`
                id, title, description,
                stages!inner(id, title, paths!inner(id, name))
            `)
            .eq("id", topicId)
            .single(),
        supabase
            .from("learners")
            .select("background_type, ai_language_pref, ai_detail_level")
            .eq("user_id", user.id)
            .single(),
    ]);

    if (!topicRes.data) return { error: "Topic not found" };

    const topic = topicRes.data;
    const learner = learnerRes.data;
    const stage = topic.stages as any;
    const path = stage.paths as any;

    const systemPrompt = buildTopicTutorSystemPrompt({
        topicTitle: topic.title,
        topicSummary: topic.description || "",
        stageName: stage.title,
        pathName: path.name,
        relatedSkills: [],
        learnerBackground: learner?.background_type || "Student",
        aiLanguagePref: learner?.ai_language_pref || "EN",
        aiDetailLevel: learner?.ai_detail_level || "Balanced",
    });

    const response = await generateAIResponseWithHistory(
        systemPrompt,
        [...chatHistory, { role: "user", content: message }],
        { temperature: 0.7, maxTokens: 1024 }
    );

    return { reply: response };
}
