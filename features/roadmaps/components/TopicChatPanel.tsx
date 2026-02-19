"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Bot, Send, X, MessageSquare, Loader2 } from "lucide-react";
import { sendTopicChatMessage } from "../actions/topic-chat-action";

interface TopicChatPanelProps {
    topicId: string;
}

interface ChatMessage {
    role: "user" | "assistant";
    content: string;
}

export function TopicChatPanel({ topicId }: TopicChatPanelProps) {
    const t = useTranslations("Dashboard");
    const locale = useLocale();
    const isArabic = locale === "ar";

    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    async function handleSend() {
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setInput("");
        setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
        setLoading(true);

        try {
            const result = await sendTopicChatMessage(topicId, userMessage, messages);
            if (result.reply) {
                setMessages((prev) => [
                    ...prev,
                    { role: "assistant", content: result.reply },
                ]);
            }
        } catch {
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: t("aiTutorError") },
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

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-50 h-14 w-14 bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center shadow-[0_0_30px_rgba(var(--primary),0.4)] transition-all hover:scale-105 cursor-pointer"
                title={t("aiTutorOpen")}
            >
                <MessageSquare className="h-6 w-6" />
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] h-[520px] flex flex-col border border-white/10 bg-black/95 backdrop-blur-xl shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-primary/10 border border-primary/20">
                        <Bot className="h-4 w-4 text-primary" />
                    </div>
                    <span className={`text-[10px] font-mono text-white uppercase ${!isArabic ? "tracking-widest" : ""}`}>
                        {t("aiTutorTitle")}
                    </span>
                </div>
                <button
                    onClick={() => setIsOpen(false)}
                    className="text-muted-foreground hover:text-white transition-colors cursor-pointer"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-3 opacity-50">
                        <Bot className="h-10 w-10 text-primary/30" />
                        <p className={`text-[10px] font-mono text-muted-foreground uppercase ${!isArabic ? "tracking-widest" : ""}`}>
                            {t("aiTutorWelcome")}
                        </p>
                    </div>
                )}

                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`max-w-[85%] px-3 py-2 text-sm ${msg.role === "user"
                                    ? "bg-primary/10 border border-primary/20 text-white"
                                    : "bg-white/5 border border-white/10 text-white/80"
                                }`}
                        >
                            <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="flex justify-start">
                        <div className="px-3 py-2 bg-white/5 border border-white/10">
                            <Loader2 className="h-4 w-4 text-primary animate-spin" />
                        </div>
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="border-t border-white/10 p-3 flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={t("aiTutorPlaceholder")}
                    className="flex-1 h-10 px-3 bg-white/5 border border-white/10 text-white text-sm font-mono focus:border-primary/40 focus:outline-none transition-colors placeholder:text-white/20"
                    disabled={loading}
                />
                <button
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                    className="h-10 w-10 flex items-center justify-center bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-30 transition-all cursor-pointer"
                >
                    <Send className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
