'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { Send, Loader2, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getOrCreateChatSessionAction } from '../actions/chat-actions';
import type { ChatMessage } from '../types';
import { toast } from 'sonner';

interface ChatPanelProps {
    topicId: string;
    topicTitle: string;
    topicSummary?: string;
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
    const [input, setInput] = React.useState('');
    const messagesEndRef = React.useRef<HTMLDivElement>(null);

    // Use a ref so the transport body function always reads the latest values
    const bodyRef = React.useRef({
        sessionId,
        context: { topicTitle, topicSummary, learnerBackground, readinessLevel, aiLanguagePref, aiDetailLevel }
    });
    React.useEffect(() => {
        bodyRef.current = {
            sessionId,
            context: { topicTitle, topicSummary, learnerBackground, readinessLevel, aiLanguagePref, aiDetailLevel }
        };
    }, [sessionId, topicTitle, topicSummary, learnerBackground, readinessLevel, aiLanguagePref, aiDetailLevel]);

    // Create transport ONCE with a function body — resolves to latest values on each request
    const transport = React.useMemo(() => new DefaultChatTransport({
        api: '/api/chat',
        body: () => bodyRef.current,
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }), []);

    // Vercel AI SDK v3 useChat — body is merged into every request by HttpChatTransport
    const { messages, sendMessage, status, setMessages, error } = useChat({
        transport,
    });

    const isBusy = status === 'submitted' || status === 'streaming';

    // Initialize session on mount
    React.useEffect(() => {
        let isMounted = true;

        async function initSession() {
            setIsInitializing(true);
            setInitError(null);

            try {
                const res = await getOrCreateChatSessionAction(topicId, 'topic_tutor');

                if (isMounted) {
                    if (res.success) {
                        setSessionId(res.sessionId!);

                        // Hydrate existing messages in SDK v3 UIMessage format (with parts array)
                        if (res.messages && res.messages.length > 0) {
                            setMessages(res.messages.map((m: ChatMessage) => ({
                                id: m.id,
                                role: m.role as 'user' | 'assistant' | 'system',
                                parts: [{ type: 'text' as const, text: m.content }],
                                createdAt: new Date(m.created_at),
                            })));
                        }
                    } else {
                        setInitError(res.error || 'Failed to initialize session');
                    }
                    setIsInitializing(false);
                }
            } catch (err: any) {
                if (isMounted) {
                    setInitError(err.message || 'Error occurred');
                    setIsInitializing(false);
                }
            }
        }

        initSession();

        return () => { isMounted = false; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [topicId]);

    // Auto-scroll to bottom of chat
    React.useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Show toast on API error
    React.useEffect(() => {
        if (error) {
            toast.error(error.message || t('aiTutorUnavailable'));
        }
    }, [error, t]);

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!input.trim()) return;
        if (!sessionId) {
            toast.error(t('aiTutorUnavailable'));
            return;
        }
        if (isBusy) return;

        sendMessage({ text: input });
        setInput('');
    };

    /**
     * Extracts displayable text from a message's parts array.
     * Falls back to empty string if parts are missing.
     */
    function getMessageText(m: (typeof messages)[number]): string {
        if (m.parts) {
            return m.parts
                .filter((p): p is Extract<typeof p, { type: 'text' }> => p.type === 'text')
                .map(p => p.text)
                .join('');
        }
        return '';
    }

    return (
        <div className="w-full lg:w-96 rounded-2xl border bg-card flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b bg-muted/30 relative shrink-0">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 to-primary/20" />
                <h3 className="font-bold flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", initError ? "bg-destructive" : "bg-green-500 animate-pulse")}></div>
                    {t('aiTutor')}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                    {t('aiTutorSubtitle')}
                </p>
            </div>

            <div className="flex-1 min-h-0 p-4 overflow-y-auto flex flex-col gap-4 bg-muted/10">
                {isInitializing ? (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                        <Loader2 className="w-5 h-5 animate-spin" />
                    </div>
                ) : initError ? (
                    <div className="flex flex-col items-center justify-center h-full text-destructive p-4 text-center gap-2">
                        <Bot className="w-8 h-8 opacity-50" />
                        <p className="text-sm font-bold">{t('aiTutorUnavailable')}</p>
                        <p className="text-xs text-muted-foreground">{initError}. {t('aiTutorUnavailableDesc')}</p>
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

                        {messages.map((m) => (
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
                                    <p className="whitespace-pre-wrap">{getMessageText(m)}</p>
                                </div>
                            </div>
                        ))}

                        {isBusy && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
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

            <div className="p-4 border-t bg-background shrink-0">
                <form
                    onSubmit={handleFormSubmit}
                    className="relative flex items-center"
                >
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={t('askQuestion')}
                        className="w-full border rounded-full pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-muted/30 transition-shadow disabled:opacity-50"
                        disabled={isInitializing || isBusy || !!initError || !sessionId}
                    />
                    <button
                        type="submit"
                        disabled={isInitializing || isBusy || !!initError || !sessionId || !input.trim()}
                        className={cn(
                            "absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full transition-all",
                            !input.trim()
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
