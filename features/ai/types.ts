import { z } from "zod";

export type Role = 'user' | 'assistant' | 'system';

export interface ChatMessage {
    id: string;
    session_id: string;
    role: Role;
    content: string;
    created_at: string;
}

export interface ChatSession {
    id: string;
    user_id: string;
    topic_id?: string | null;
    session_type: string;
    created_at: string;
}

export interface AITutorContext {
    topicId: string;
    topicTitle: string;
    topicSummary?: string;
    learnerBackground?: string;
    readinessLevel?: number;
    aiLanguagePref?: string;
    aiDetailLevel?: string;
}
