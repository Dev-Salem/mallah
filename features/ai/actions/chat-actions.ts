"use server";

import { createClient } from "@/lib/supabase/server";
import type { ChatSession, ChatMessage } from "../types";

export async function getOrCreateChatSessionAction(
    topicId: string,
    sessionType: 'topic_tutor' = 'topic_tutor'
): Promise<{ success: true; sessionId: string; messages: ChatMessage[] } | { success: false; error: string }> {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return { success: false, error: "Not authenticated" };
        }

        // 1. Try to find existing session
        let { data: session, error: findError } = await supabase
            .from('chat_sessions')
            .select('*')
            .eq('user_id', user.id)
            .eq('topic_id', topicId)
            .eq('session_type', sessionType)
            .maybeSingle();

        if (findError) {
            console.error("Error finding chat session:", findError);
            return { success: false, error: findError.message };
        }

        let sessionId: string;
        let messages: ChatMessage[] = [];

        if (session) {
            sessionId = session.id;
            // 2. Fetch existing messages if session exists
            const { data: existingMsgs, error: msgsError } = await supabase
                .from('chat_messages')
                .select('*')
                .eq('session_id', sessionId)
                .order('created_at', { ascending: true });

            if (!msgsError && existingMsgs) {
                messages = existingMsgs as ChatMessage[];
            }
        } else {
            // 3. Create new session
            const { data: newSession, error: createError } = await supabase
                .from('chat_sessions')
                .insert({
                    user_id: user.id,
                    topic_id: topicId,
                    session_type: sessionType
                })
                .select('*')
                .single();

            if (createError || !newSession) {
                console.error("Error creating chat session:", createError);
                return { success: false, error: "Failed to create session" };
            }

            sessionId = newSession.id;
        }

        return {
            success: true,
            sessionId,
            messages
        };
    } catch (e: any) {
        console.error("getOrCreateChatSessionAction exception:", e);
        return { success: false, error: e.message || "Unknown error" };
    }
}
