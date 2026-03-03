// @ts-nocheck
'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { useChat } from '@ai-sdk/react';
import { Send, Sparkles, Loader2, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getOrCreateChatSessionAction } from '../actions/chat-actions';
import type { ChatMessage } from '../types';

interface ChatPanelProps {
    topicId: string;
    topicTitle: string;
    topicSummary?: string;
    // For context injection
    learnerBackground?: string;
    readinessLevel?: number;
    aiLanguagePref?: string;
    aiDetailLevel?: string;
}

export function ChatPanel({
    topicId,
    topicTitle,
    topicSummary,
    learnerBackground,
    readinessLevel,
    aiLanguagePref,
    aiDetailLevel
}: ChatPanelProps) {
    const t = useTranslations('TopicViewer');

    const [sessionId, setSessionId] = React.useState<string | null>(null);
    const [isInitializing, setIsInitializing] = React.useState(true);
    const messagesEndRef = React.useRef<HTMLDivElement>(null);

    // Vercel AI SDK useChat
    const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
        api: '/api/chat',
        body: {
            sessionId,
            context: {
                topicTitle,
                topicSummary,
                learnerBackground,
                readinessLevel,
                aiLanguagePref,
                aiDetailLevel
            }
        },
    });

    // Initialize session on mount
    React.useEffect(() => {
        let isMounted = true;

        async function initSession() {
            setIsInitializing(true);
            const res = await getOrCreateChatSessionAction(topicId, 'topic_tutor');

            if (isMounted && res.success) {
                setSessionId(res.sessionId!);

                // Hydrate messages - ensuring the format matches Vercel AI SDK expects
                if (res.messages && res.messages.length > 0) {
                    setMessages(res.messages.map((m: ChatMessage) => ({
                        id: m.id,
                        role: m.role as "user" | "assistant" | "system",
                        content: m.content
                    })));
                }
            }
            if (isMounted) setIsInitializing(false);
        }

        initSession();

        return () => { isMounted = false; };
    }, [topicId, setMessages]);

    // Auto-scroll to bottom of chat
    React.useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!input.trim() || !sessionId || isLoading) return;
        handleSubmit(e);
    };

    return (
        <div className="w-full lg:w-96 rounded-2xl border bg-card flex flex-col h-[600px] lg:h-auto overflow-hidden self-start sticky top-8">
            <div className="p-4 border-b bg-muted/30 relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 to-primary/20" />
                <h3 className="font-bold flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    {t('aiTutor')}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                    {t('aiTutorSubtitle')}
                </p>
            </div>

            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 bg-muted/10">
                {isInitializing ? (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                        <Loader2 className="w-5 h-5 animate-spin" />
                    </div>
                ) : (
                    <>
                        {/* Initial system greeting */}
                        <div className="flex gap-3 animate-in fade-in slide-in-from-bottom-2">
                            <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">
                                <Bot className="w-4 h-4" />
                            </div>
                            <div className="bg-card border shadow-sm p-3 rounded-2xl rounded-tl-sm text-sm text-foreground max-w-[85%]">
                                <p>{t('aiGreeting', { topic: topicTitle })}</p>
                            </div>
                        </div>

                        {messages.map((m: any) => (
                            <div
                                key={m.id}
                                className={cn(
                                    "flex gap-3 animate-in fade-in",
                                    m.role === 'user' ? "flex-row-reverse" : "flex-row"
                                )}
                            >
                                <div className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                                    m.role === 'user'
                                        ? "bg-foreground text-background"
                                        : "bg-primary/20 text-primary"
                                )}>
                                    {m.role === 'user' ? <span className="text-xs font-bold">ME</span> : <Bot className="w-4 h-4" />}
                                </div>

                                <div className={cn(
                                    "p-3 rounded-2xl text-sm max-w-[85%] shadow-sm",
                                    m.role === 'user'
                                        ? "bg-foreground text-background rounded-tr-sm"
                                        : "bg-card border rounded-tl-sm text-foreground"
                                )}>
                                    <p className="whitespace-pre-wrap">{m.content}</p>
                                </div>
                            </div>
                        ))}

                        {isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
                            <div className="flex gap-3 animate-in fade-in">
                                <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">
                                    <Bot className="w-4 h-4" />
                                </div>
                                <div className="bg-card border shadow-sm p-3 rounded-2xl rounded-tl-sm text-sm text-foreground flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary/50 animate-bounce" />
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary/50 animate-bounce delay-75" />
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary/50 animate-bounce delay-150" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            <div className="p-4 border-t bg-background">
                <form
                    onSubmit={handleFormSubmit}
                    className="relative flex items-center"
                >
                    <input
                        type="text"
                        value={input}
                        onChange={handleInputChange}
                        placeholder={t('askQuestion')}
                        className="w-full border rounded-full pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-muted/30 transition-shadow"
                        disabled={isInitializing || isLoading}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isInitializing || isLoading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-opacity hover:bg-primary/90"
                    >
                        <Send className="w-4 h-4 rtl:-scale-x-100" />
                    </button>
                </form>
            </div>
        </div>
    );
}
