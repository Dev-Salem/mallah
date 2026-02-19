"use server";

import { createClient } from "@/lib/supabase/server";
import type { ChatSession, ChatMessage } from "../types";

export async function getUserSessions(userId: string): Promise<ChatSession[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("chat_sessions")
        .select("*")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
}

export async function getSessionMessages(sessionId: string): Promise<ChatMessage[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
}
