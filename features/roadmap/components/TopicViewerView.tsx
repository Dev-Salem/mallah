'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Circle, Clock, FileText, FlaskConical, LayoutTemplate, PlayCircle, Tag } from 'lucide-react';
import { Topic, TopicResource } from '../types';
import { markTopicCompleteAction } from '../actions/topic-actions';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChatPanel } from '../../ai/components/ChatPanel';

export function TopicViewerView({ topic }: { topic: Topic }) {
    const t = useTranslations('TopicViewer');
    const locale = useLocale();
    const router = useRouter();
    const [isPending, startTransition] = React.useTransition();
    const [status, setStatus] = React.useState(topic.user_status);

    const handleMarkComplete = () => {
        startTransition(async () => {
            const res = await markTopicCompleteAction(topic.topic_id);
            if (res.success) {
                setStatus('completed');
                router.refresh();
            }
        });
    };

    const getIcon = () => {
        switch (topic.topic_type) {
            case 'lesson': return <PlayCircle className="w-6 h-6" />;
            case 'concept': return <FileText className="w-6 h-6" />;
            case 'lesson_lab': return <FlaskConical className="w-6 h-6" />;
            case 'project_milestone': return <LayoutTemplate className="w-6 h-6" />;
            default: return <Circle className="w-6 h-6" />;
        }
    };

    return (
        <div className="h-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 py-8 px-4">
            {/* LEFT CONTENT AREA */}
            <div className="flex-1 space-y-8">
                <div>
                    <Link
                        href={`/${locale}/dashboard/roadmap`}
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {t('backToRoadmap')}
                    </Link>

                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-primary/10 text-primary rounded-lg">
                                    {getIcon()}
                                </div>
                                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                                    <span>{t(`types.${topic.topic_type}`)}</span>
                                    <span>•</span>
                                    <span>{t('difficulty', { level: topic.difficulty_level })}</span>
                                </div>
                            </div>
                            <h1 className="text-3xl font-black tracking-tight">{topic.title}</h1>
                            <div className="flex items-center gap-2 mt-4 text-muted-foreground">
                                <Clock className="w-4 h-4" />
                                <span>{topic.estimated_time_min} {t('minutes')}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleMarkComplete}
                            disabled={isPending || status === 'completed'}
                            className={cn(
                                "flex items-center gap-2 px-5 py-2.5 rounded-full font-bold transition-all",
                                status === 'completed'
                                    ? "bg-green-500/20 text-green-500 border border-green-500/50 cursor-default"
                                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                            )}
                        >
                            <CheckCircle2 className="w-5 h-5" />
                            {status === 'completed' ? t('completed') : isPending ? t('saving') : t('markComplete')}
                        </button>
                    </div>
                </div>

                <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 rounded-xl bg-muted/50 p-1">
                        <TabsTrigger value="overview" className="rounded-lg">{t('overview')}</TabsTrigger>
                        <TabsTrigger value="resources" className="rounded-lg">{t('resources')} ({topic.resources?.length || 0})</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="mt-6">
                        <div className="prose prose-neutral dark:prose-invert max-w-none">
                            <p className="text-lg leading-relaxed text-muted-foreground">
                                {topic.summary || t('noSummary')}
                            </p>
                        </div>
                    </TabsContent>

                    <TabsContent value="resources" className="mt-6 space-y-4">
                        {topic.resources?.map((res, i) => (
                            <ResourceCard key={res.id || i} resource={res} t={t} />
                        ))}
                        {(!topic.resources || topic.resources.length === 0) && (
                            <p className="text-muted-foreground italic">{t('noResources')}</p>
                        )}
                    </TabsContent>
                </Tabs>
            </div>

            {/* RIGHT SIDEBAR - AI TUTOR */}
            {topic.topic_type.startsWith('project_') ? (
                <div className="w-full lg:w-96 rounded-2xl border bg-card flex flex-col p-6 sticky top-8 h-fit">
                    <h3 className="font-bold border-b pb-4 mb-4">{t('projectActions')}</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                        {t('projectExplanation')}
                    </p>
                    <button
                        onClick={handleMarkComplete}
                        disabled={isPending || status === 'completed'}
                        className={cn(
                            "w-full px-5 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2",
                            status === 'completed'
                                ? "bg-green-500/20 text-green-500 cursor-default"
                                : "bg-primary text-primary-foreground hover:bg-primary/90"
                        )}
                    >
                        <CheckCircle2 className="w-5 h-5" />
                        {status === 'completed' ? t('completed') : t('markComplete')}
                    </button>
                    {status === 'completed' && (
                        <p className="text-xs text-center mt-3 text-muted-foreground">
                            {t('nextStageUnlocked')}
                        </p>
                    )}
                </div>
            ) : (
                <ChatPanel
                    topicId={topic.topic_id}
                    topicTitle={topic.title}
                    topicSummary={topic.summary || ''}
                />
            )}
        </div>
    );
}

function ResourceCard({ resource, t }: { resource: TopicResource, t: any }) {
    return (
        <a
            href={resource.url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
        >
            <div className="p-4 rounded-xl border bg-card hover:bg-accent transition-colors flex items-start justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">
                            {resource.resource_type}
                        </span>
                        {resource.cost_type && resource.cost_type !== 'free' && (
                            <span className="text-xs font-medium text-amber-500 flex items-center gap-1 border border-amber-500/30 px-2 py-0.5 rounded">
                                <Tag className="w-3 h-3" /> {resource.cost_type}
                            </span>
                        )}
                        {resource.provider && (
                            <span className="text-xs text-muted-foreground">• {resource.provider}</span>
                        )}
                    </div>
                    <h4 className="font-semibold text-foreground group-hover:underline underline-offset-4 decoration-primary/50">
                        {resource.title}
                    </h4>
                </div>
            </div>
        </a>
    );
}
