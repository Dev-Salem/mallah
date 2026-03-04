// @ts-nocheck
'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { useChat } from '@ai-sdk/react';
import { Send, Sparkles, Loader2, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getOrCreateChatSessionAction } from '../actions/chat-actions';
import type { ChatMessage } from '../types';
import { toast } from 'sonner';

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
    const [initError, setInitError] = React.useState<string | null>(null);
    const messagesEndRef = React.useRef<HTMLDivElement>(null);

    // Vercel AI SDK useChat
    const chat = useChat({
        api: '/api/chat',
    });
    const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = chat;

    console.log("[ChatPanel] useChat hooks keys:", Object.keys(chat));


    console.log("[ChatPanel] Render State:", {
        isInitializing,
        isLoading,
        initError,
        sessionId,
        hasInput: !!input?.trim()
    });

    // Initialize session on mount
    React.useEffect(() => {
        let isMounted = true;
        console.log("[ChatPanel] initSession effect triggered for topicId:", topicId);

        async function initSession() {
            setIsInitializing(true);
            setInitError(null);

            try {
                const res = await getOrCreateChatSessionAction(topicId, 'topic_tutor');
                console.log("[ChatPanel] getOrCreateChatSessionAction result:", res);

                if (isMounted) {
                    if (res.success) {
                        setSessionId(res.sessionId!);

                        // Hydrate messages - ensuring the format matches Vercel AI SDK expects
                        if (res.messages && res.messages.length > 0) {
                            setMessages(res.messages.map((m: ChatMessage) => ({
                                id: m.id,
                                role: m.role as "user" | "assistant" | "system",
                                content: m.content
                            })));
                        }
                    } else {
                        console.error('Failed to init session:', res.error);
                        setInitError(res.error || 'Failed to initialize session');
                    }
                    setIsInitializing(false);
                }
            } catch (err: any) {
                if (isMounted) {
                    console.error('Exception init session:', err);
                    setInitError(err.message || 'Error occurred');
                    setIsInitializing(false);
                }
            }
        }

        initSession();

        return () => { isMounted = false; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [topicId]); // Removed setMessages to avoid infinite loops

    // Auto-scroll to bottom of chat
    React.useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("[ChatPanel] handleFormSubmit clicked", { input, sessionId, isLoading });

        if (!input?.trim()) {
            toast.error("Please enter a question.");
            return;
        }
        if (!sessionId) {
            toast.error("Session not initialized. Please refresh.");
            return;
        }
        if (isLoading) return;

        try {
            handleSubmit(e, {
                options: {
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
                    }
                }
            });
        } catch (error) {
            console.error("[ChatPanel] Error in handleSubmit:", error);
            toast.error("Error sending message. Check console.");
        }
    };


    return (
        <div className="w-full lg:w-96 rounded-2xl border bg-card flex flex-col h-[600px] lg:h-auto overflow-hidden self-start sticky top-8">
            <div className="p-4 border-b bg-muted/30 relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 to-primary/20" />
                <h3 className="font-bold flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", initError ? "bg-destructive" : "bg-green-500 animate-pulse")}></div>
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
                ) : initError ? (
                    <div className="flex flex-col items-center justify-center h-full text-destructive p-4 text-center gap-2">
                        <Bot className="w-8 h-8 opacity-50" />
                        <p className="text-sm font-bold">AI Tutor Unavailable</p>
                        <p className="text-xs text-muted-foreground">{initError}. Please try refreshing.</p>
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
                        className="w-full border rounded-full pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-muted/30 transition-shadow disabled:opacity-50"
                        disabled={isInitializing || isLoading || !!initError || !sessionId}
                    />
                    <button
                        type="submit"
                        className={cn(
                            "absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full transition-all",
                            !input?.trim()
                                ? "bg-muted text-muted-foreground"
                                : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
                        )}
                    >
                        <Send className="w-4 h-4 rtl:-scale-x-100" />
                    </button>
                </form>
            </div>
        </div>
    );
}
