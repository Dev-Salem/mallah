"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Bot, Send, Plus, Loader2, MessageSquare } from "lucide-react";
import { createChatSession, sendCareerMessage } from "../actions/chat-actions";
import type { ChatSession, ChatMessage } from "../types";
import { useRouter } from "next/navigation";

interface Props {
    sessions: ChatSession[];
    activeSessionId: string | null;
    initialMessages: ChatMessage[];
}

export function CareerAdvisorClient({ sessions, activeSessionId, initialMessages }: Props) {
    const t = useTranslations("CareerAdvisor");
    const locale = useLocale();
    const isArabic = locale === "ar";
    const router = useRouter();

    const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [creatingSession, setCreatingSession] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        setMessages(initialMessages);
    }, [initialMessages]);

    async function handleNewSession() {
        setCreatingSession(true);
        try {
            const result = await createChatSession();
            if ("session" in result && result.session) {
                router.push(`/${locale}/dashboard/advisor?session=${result.session.id}`);
                router.refresh();
            }
        } finally {
            setCreatingSession(false);
        }
    }

    async function handleSend() {
        if (!input.trim() || loading || !activeSessionId) return;

        const userMsg = input.trim();
        setInput("");

        const tempUserMsg: ChatMessage = {
            id: crypto.randomUUID(),
            session_id: activeSessionId,
            role: "user",
            content: userMsg,
            created_at: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, tempUserMsg]);
        setLoading(true);

        try {
            const result = await sendCareerMessage(activeSessionId, userMsg);
            if ("reply" in result && result.reply) {
                const assistantMsg: ChatMessage = {
                    id: crypto.randomUUID(),
                    session_id: activeSessionId,
                    role: "assistant",
                    content: result.reply,
                    created_at: new Date().toISOString(),
                };
                setMessages((prev) => [...prev, assistantMsg]);
            }
        } catch {
            // show error as message
            setMessages((prev) => [
                ...prev,
                {
                    id: crypto.randomUUID(),
                    session_id: activeSessionId,
                    role: "assistant",
                    content: t("errorMessage"),
                    created_at: new Date().toISOString(),
                },
            ]);
        } finally {
            setLoading(false);
        }
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }

    return (
        <div className="max-w-5xl mx-auto h-[calc(100vh-120px)] flex flex-col md:flex-row gap-4">
            {/* Sidebar — Sessions */}
            <div className="w-full md:w-64 flex-shrink-0 space-y-2">
                <button
                    onClick={handleNewSession}
                    disabled={creatingSession}
                    className="w-full h-10 border border-dashed border-white/20 text-[10px] font-mono text-muted-foreground hover:text-white hover:border-white/40 uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                    {creatingSession ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />}
                    {t("newChat")}
                </button>

                <div className="space-y-1 max-h-[400px] overflow-y-auto">
                    {sessions.map((s) => (
                        <a
                            key={s.id}
                            href={`/${locale}/dashboard/advisor?session=${s.id}`}
                            className={`block px-3 py-2 text-[10px] font-mono transition-all ${activeSessionId === s.id
                                    ? "bg-primary/10 border border-primary/20 text-primary"
                                    : "border border-transparent text-muted-foreground hover:text-white hover:bg-white/5"
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <MessageSquare className="h-3 w-3 flex-shrink-0" />
                                <span className="truncate">{s.title}</span>
                            </div>
                        </a>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 glass border-white/5 flex flex-col min-h-0">
                {/* Header */}
                <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3">
                    <div className="p-2 bg-primary/10 border border-primary/20">
                        <Bot className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h1 className={`text-sm font-bold text-white uppercase ${!isArabic ? "tracking-widest" : ""}`}>
                            {t("title")}
                        </h1>
                        <p className={`text-[9px] font-mono text-muted-foreground uppercase ${!isArabic ? "tracking-widest" : ""}`}>
                            {t("subtitle")}
                        </p>
                    </div>
                </div>

                {/* Messages */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
                    {!activeSessionId && (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-50">
                            <Bot className="h-16 w-16 text-primary/20" />
                            <p className={`text-[10px] font-mono text-muted-foreground uppercase ${!isArabic ? "tracking-widest" : ""}`}>
                                {t("startMessage")}
                            </p>
                        </div>
                    )}

                    {activeSessionId && messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-50">
                            <Bot className="h-16 w-16 text-primary/20" />
                            <p className={`text-[10px] font-mono text-muted-foreground uppercase ${!isArabic ? "tracking-widest" : ""}`}>
                                {t("welcomeMessage")}
                            </p>
                        </div>
                    )}

                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-[80%] px-4 py-3 ${msg.role === "user"
                                        ? "bg-primary/10 border border-primary/20 text-white"
                                        : "bg-white/5 border border-white/10 text-white/80"
                                    }`}
                            >
                                <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="flex justify-start">
                            <div className="px-4 py-3 bg-white/5 border border-white/10">
                                <Loader2 className="h-4 w-4 text-primary animate-spin" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Input */}
                {activeSessionId && (
                    <div className="border-t border-white/10 p-4 flex gap-3">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={t("inputPlaceholder")}
                            className="flex-1 h-12 px-4 bg-white/5 border border-white/10 text-white text-sm font-mono focus:border-primary/40 focus:outline-none transition-colors placeholder:text-white/20"
                            disabled={loading}
                        />
                        <button
                            onClick={handleSend}
                            disabled={loading || !input.trim()}
                            className="h-12 w-12 flex items-center justify-center bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-30 transition-all cursor-pointer"
                        >
                            <Send className="h-5 w-5" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
