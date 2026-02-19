"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { generateAIResponseWithHistory } from "@/lib/ai/openai";
import { buildCareerAdvisorSystemPrompt } from "@/lib/ai/prompts";

export async function createChatSession(title?: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    const { data: session, error } = await supabase
        .from("chat_sessions")
        .insert({
            user_id: user.id,
            title: title || "New Chat",
            updated_at: new Date().toISOString(),
        })
        .select()
        .single();

    if (error) return { error: error.message };
    revalidatePath("/dashboard/advisor");
    return { session };
}

export async function sendCareerMessage(sessionId: string, message: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    // Save user message
    await supabase.from("chat_messages").insert({
        session_id: sessionId,
        role: "user",
        content: message,
    });

    // Get chat history
    const { data: history } = await supabase
        .from("chat_messages")
        .select("role, content")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: true });

    // Get learner context
    const [learnerRes, skillsRes, projectsRes, progressRes] = await Promise.all([
        supabase
            .from("learners")
            .select("*, paths(name)")
            .eq("user_id", user.id)
            .single(),
        supabase
            .from("user_skills")
            .select("skills(name)")
            .eq("user_id", user.id),
        supabase
            .from("user_projects")
            .select("projects(title)")
            .eq("user_id", user.id)
            .eq("status", "Completed"),
        supabase
            .from("user_progress")
            .select("status")
            .eq("user_id", user.id),
    ]);

    const learner = learnerRes.data;
    const totalTopics = progressRes.data?.length || 0;
    const completedTopics = progressRes.data?.filter((p: any) => p.status === "Completed").length || 0;
    const progressPercent = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

    const systemPrompt = buildCareerAdvisorSystemPrompt({
        pathName: (learner?.paths as any)?.name || "Unknown",
        progressPercent,
        skillsList: (skillsRes.data || []).map((s: any) => s.skills?.name).filter(Boolean),
        projectsList: (projectsRes.data || []).map((p: any) => p.projects?.title).filter(Boolean),
        learnerBackground: learner?.background_type || "Student",
        primaryGoal: learner?.primary_goal || "FullTimeJob",
        aiLanguagePref: learner?.ai_language_pref || "EN",
        aiDetailLevel: learner?.ai_detail_level || "Balanced",
    });

    const chatMessages = (history || []).map((m: any) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
    }));

    const reply = await generateAIResponseWithHistory(systemPrompt, chatMessages, {
        temperature: 0.7,
        maxTokens: 1024,
    });

    // Save assistant reply
    await supabase.from("chat_messages").insert({
        session_id: sessionId,
        role: "assistant",
        content: reply,
    });

    // Update session timestamp
    await supabase
        .from("chat_sessions")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", sessionId);

    return { reply };
}
