'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, CheckCircle2, Circle, Clock, FileText, FlaskConical, PlayCircle, BookOpen, Video, FileBadge, ExternalLink, Activity, ChevronRight } from 'lucide-react';
import { Topic, TopicResource } from '../types';
import { markTopicCompleteAction } from '../actions/topic-actions';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ChatPanel } from '../../ai/components/ChatPanel';

interface TopicViewerViewProps {
    topic: Topic;
    adjacentTopics: { previousTopicId: string | null; nextTopicId: string | null };
    breadcrumb: { pathName: string; stageTitle: string; topicPosition: number; totalTopicsInStage: number } | null;
}

export function TopicViewerView({ topic, adjacentTopics, breadcrumb }: TopicViewerViewProps) {
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
            default: return <Circle className="w-6 h-6" />;
        }
    };

    // Separate resources by type for rendering according to spec 6.1
    const internalTexts = topic.resources?.filter(r => r.resource_type === 'INTERNAL_TEXT') || [];
    const videos = topic.resources?.filter(r => r.resource_type === 'VIDEO') || [];
    const articles = topic.resources?.filter(r => r.resource_type === 'ARTICLE' || r.resource_type === 'DOCUMENTATION') || [];
    const certs = topic.resources?.filter(r => r.resource_type === 'CERT') || [];

    // Extract "Practical Output" from summary if it's a lab and has distinct formatting, 
    // or just rely on the fact that the summary represents it.
    // For now, if lesson_lab, we will style the summary/content distinctively.
    const isLab = topic.topic_type === 'lesson_lab';

    return (
        <div className="h-full w-full max-w-[1400px] mx-auto flex flex-col xl:flex-row gap-8 py-8 px-4 sm:px-6">
            {/* LEFT CONTENT AREA */}
            <div className="flex-1 space-y-8 min-w-0">
                {/* Header Bar */}
                <div>
                    <Link
                        href={`/${locale}/dashboard/roadmap`}
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 font-medium"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {t('backToRoadmap')}
                    </Link>

                    {/* Breadcrumb */}
                    {breadcrumb && (
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6 flex-wrap">
                            <span className="font-medium">{breadcrumb.pathName}</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                            <span className="font-medium">{breadcrumb.stageTitle}</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                            <span className="text-foreground font-semibold">{topic.title}</span>
                            <span className="ml-2 text-xs bg-muted px-2 py-0.5 rounded-full">
                                {t('topicPosition', { current: breadcrumb.topicPosition, total: breadcrumb.totalTopicsInStage })}
                            </span>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                                    {getIcon()}
                                </div>
                                <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                                    <Badge variant="secondary" className="bg-secondary/50 font-semibold">{t(`types.${topic.topic_type}`)}</Badge>
                                    <span>•</span>
                                    <span className={cn(
                                        topic.difficulty_level === 'beginner' && "text-success",
                                        topic.difficulty_level === 'intermediate' && "text-warning",
                                        topic.difficulty_level === 'advanced' && "text-destructive"
                                    )}>
                                        {t('difficulty', { level: topic.difficulty_level })}
                                    </span>
                                </div>
                            </div>

                            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">{topic.title}</h1>

                            <div className="flex flex-wrap items-center gap-4 text-muted-foreground font-medium">
                                <div className="flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-lg border">
                                    <Clock className="w-4 h-4" />
                                    <span>{topic.estimated_time_min} {t('minutes')}</span>
                                </div>

                                {topic.skills && topic.skills.length > 0 && (
                                    <div className="flex items-center gap-2">
                                        {topic.skills.map((skill: { skill_id: string, name: string }) => (
                                            <Badge key={skill.skill_id} variant="outline" className="text-xs bg-background">
                                                {skill.name}
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="bg-card border rounded-2xl overflow-hidden shadow-sm">
                    {/* Topic Summary */}
                    {(topic.summary || internalTexts.length > 0) && (
                        <div className="p-6 sm:p-8 border-b">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                {isLab ? <Activity className="w-5 h-5 text-primary" /> : <BookOpen className="w-5 h-5 text-primary" />}
                                {isLab ? t('practicalOutput') : t('overview')}
                            </h2>

                            <div className="prose prose-neutral dark:prose-invert max-w-none">
                                {topic.summary && (
                                    <p className={cn(
                                        "text-base sm:text-lg leading-relaxed text-foreground/90",
                                        isLab && "bg-primary/5 p-4 rounded-xl border border-primary/10 font-medium"
                                    )}>
                                        {topic.summary}
                                    </p>
                                )}

                                {internalTexts.map((text, i) => (
                                    <div key={text.id || i} className="mt-6 whitespace-pre-wrap text-muted-foreground/90 leading-relaxed">
                                        {text.content || text.title}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Resources Area */}
                    <div className="p-6 sm:p-8 bg-muted/10">
                        <h2 className="text-xl font-bold mb-6">{t('learningMaterials')}</h2>

                        {(videos.length === 0 && articles.length === 0 && certs.length === 0) ? (
                            <p className="text-muted-foreground italic text-center py-8">{t('noResources')}</p>
                        ) : (
                            <div className="space-y-8">
                                {/* Videos Section */}
                                {videos.length > 0 && (
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                            <Video className="w-4 h-4" /> {t('videoResources')}
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {videos.map((res, i) => (
                                                <ResourceVideoCard key={res.id || i} resource={res} />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Articles Section */}
                                {articles.length > 0 && (
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                            <FileText className="w-4 h-4" /> {t('readingMaterials')}
                                        </h3>
                                        <div className="grid grid-cols-1 gap-3">
                                            {articles.map((res, i) => (
                                                <ResourceArticleCard key={res.id || i} resource={res} />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Certifications Section */}
                                {certs.length > 0 && (
                                    <div className="space-y-4 pt-4 border-t border-dashed">
                                        <h3 className="text-sm font-bold text-warning uppercase tracking-wider flex items-center gap-2">
                                            <FileBadge className="w-4 h-4" /> {t('suggestedCertificates')}
                                        </h3>
                                        <div className="grid grid-cols-1 gap-3">
                                            {certs.map((res, i) => (
                                                <ResourceCertCard key={res.id || i} resource={res} />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Action Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-card border rounded-2xl shadow-sm">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        {adjacentTopics.previousTopicId && (
                            <Link
                                href={`/${locale}/dashboard/topic/${adjacentTopics.previousTopicId}`}
                                className="px-4 py-3 font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl transition-colors flex items-center gap-2"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                {t('previousTopic')}
                            </Link>
                        )}
                        <Link
                            href={`/${locale}/dashboard/roadmap`}
                            className="px-4 py-3 font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl transition-colors"
                        >
                            {t('backToRoadmap')}
                        </Link>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                        <button
                            onClick={handleMarkComplete}
                            disabled={isPending || status === 'completed'}
                            className={cn(
                                "px-8 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-sm",
                                status === 'completed'
                                    ? "bg-success/10 text-success border border-success/20 cursor-default"
                                    : "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md hover:-translate-y-0.5"
                            )}
                        >
                            {status === 'completed' ? (
                                <>
                                    <CheckCircle2 className="w-5 h-5" />
                                    {t('completed')}
                                </>
                            ) : isPending ? (
                                t('saving')
                            ) : (
                                t('markComplete')
                            )}
                        </button>

                        {status === 'completed' && adjacentTopics.nextTopicId && (
                            <Link
                                href={`/${locale}/dashboard/topic/${adjacentTopics.nextTopicId}`}
                                className="px-6 py-3 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all flex items-center gap-2 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                            >
                                {t('nextTopic')}
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* RIGHT SIDEBAR - AI TUTOR */}
            <div className="w-full xl:w-[400px] flex-shrink-0">
                <div className="sticky top-6 h-[calc(100vh-3rem)] max-h-[800px]">
                    <ChatPanel
                        topicId={topic.topic_id}
                        topicTitle={topic.title}
                        topicSummary={topic.summary || ''}
                    />
                </div>
            </div>
        </div>
    );
}

function ResourceVideoCard({ resource }: { resource: TopicResource }) {
    // Utility to extract youtube ID
    const getYouTubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const ytId = resource.url ? getYouTubeId(resource.url) : null;

    return (
        <a href={resource.url || '#'} target="_blank" rel="noopener noreferrer" className="block group">
            <div className="bg-background border rounded-xl overflow-hidden hover:border-primary/50 hover:shadow-md transition-all h-full flex flex-col">
                {ytId ? (
                    <div className="relative w-full pt-[56.25%] bg-muted">
                        <Image
                            src={`https://img.youtube.com/vi/${ytId}/sddefault.jpg`}
                            alt={resource.title || 'Video thumbnail'}
                            fill
                            className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-transparent transition-colors">
                            <div className="w-12 h-12 rounded-full bg-black/70 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                                <PlayCircle className="w-6 h-6 text-primary-foreground ml-1" />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="relative w-full pt-[40%] bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/5 transition-colors">
                        <Video className="w-10 h-10 opacity-50" />
                    </div>
                )}
                <div className="p-4 flex-grow flex flex-col justify-between">
                    <h4 className="font-bold text-foreground line-clamp-2 leading-tight mb-2 group-hover:text-primary transition-colors">
                        {resource.title}
                    </h4>
                    <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider">
                        {resource.provider || 'Video Resource'} <ExternalLink className="w-3 h-3" />
                    </span>
                </div>
            </div>
        </a>
    );
}

function ResourceArticleCard({ resource }: { resource: TopicResource }) {
    return (
        <a href={resource.url || '#'} target="_blank" rel="noopener noreferrer" className="block group">
            <div className="bg-background border rounded-xl p-4 sm:p-5 hover:border-primary/50 hover:shadow-md transition-all flex items-center justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="p-2 sm:p-2.5 bg-muted rounded-lg text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
                        <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors truncate">
                            {resource.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            <span>{resource.provider || 'Article'}</span>
                        </div>
                    </div>
                </div>
                <div className="shrink-0 text-muted-foreground group-hover:text-primary transition-colors">
                    <ExternalLink className="w-5 h-5" />
                </div>
            </div>
        </a>
    );
}

function ResourceCertCard({ resource }: { resource: TopicResource }) {
    return (
        <a href={resource.url || '#'} target="_blank" rel="noopener noreferrer" className="block group">
            <div className="bg-info/5 border border-info/20 rounded-xl p-4 sm:p-5 hover:border-info/40 hover:shadow-md transition-all flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="p-2.5 bg-info/10 text-info rounded-lg shrink-0">
                        <FileBadge className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-foreground mb-1 group-hover:underline underline-offset-2 truncate">
                            {resource.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            <span>{resource.provider || 'Certification'}</span>
                        </div>
                    </div>
                </div>
                <div className="shrink-0 text-muted-foreground group-hover:text-primary transition-colors">
                    <ExternalLink className="w-5 h-5" />
                </div>
            </div>
        </a>
    );
}
