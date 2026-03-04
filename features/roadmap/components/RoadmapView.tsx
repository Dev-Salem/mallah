'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { RoadmapData, Stage, Topic } from '../types';
import { CheckCircle2, Circle, Lock, PlayCircle, FileText, FlaskConical, LayoutTemplate, Trophy, Video, BookOpen, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocale } from 'next-intl';

interface RoadmapViewProps {
    roadmap: RoadmapData;
}

export function RoadmapView({ roadmap }: RoadmapViewProps) {
    const t = useTranslations('Roadmap');
    const locale = useLocale();

    // Calculate overall progress
    let totalTopics = 0;
    let completedTopics = 0;
    let totalStagesCompleted = 0;

    roadmap.stages.forEach(stage => {
        const stageTopicsCount = stage.topics.length + (stage.project ? 1 : 0);
        totalTopics += stageTopicsCount;

        let stageCompletedCount = stage.topics.filter(t => t.user_status === 'completed').length;
        if (stage.project?.user_status === 'completed') {
            stageCompletedCount++;
        }
        completedTopics += stageCompletedCount;

        if (stageCompletedCount === stageTopicsCount && stageTopicsCount > 0) {
            totalStagesCompleted++;
        }
    });

    const overallProgress = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0;

    return (
        <div className="w-full max-w-4xl mx-auto py-8">
            <div className="mb-10 text-center">
                <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4">
                    {t('title')}
                </h1>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg mb-6">
                    {t('subtitle')}
                </p>

                {/* Overall Progress Section */}
                <div className="bg-card border rounded-xl p-6 text-left max-w-2xl mx-auto shadow-sm">
                    <div className="flex justify-between items-end mb-2">
                        <div>
                            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">{t('overall_progress')}</p>
                            <h2 className="text-2xl font-bold">{Math.round(overallProgress)}%</h2>
                        </div>
                        <div className="text-right flex flex-col gap-1 items-end">
                            <Badge variant="secondary" className="font-medium">
                                {totalStagesCompleted} / {roadmap.stages.length} {t('stages_completed')}
                            </Badge>
                            <Badge variant="outline" className="font-medium text-muted-foreground">
                                {completedTopics} / {totalTopics} {t('topics_completed')}
                            </Badge>
                        </div>
                    </div>
                    <Progress value={overallProgress} className="h-3 bg-secondary" />
                </div>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-4">
                {roadmap.stages.map((stage) => {
                    // Check if current stage is the active one
                    const isCompleted = !stage.topics.some(t => t.user_status !== 'completed') &&
                        (!stage.project || stage.project.user_status === 'completed');

                    return (
                        <StageCard
                            key={stage.stage_id}
                            stage={stage}
                            t={t}
                            locale={locale}
                            state={!stage.is_unlocked ? 'locked' : isCompleted ? 'completed' : 'current'}
                        />
                    );
                })}
            </Accordion>
        </div>
    );
}

function StageCard({ stage, t, locale, state }: { stage: Stage; t: ReturnType<typeof useTranslations>; locale: string; state: 'locked' | 'current' | 'completed' }) {
    const totalTopics = stage.topics.length + (stage.project ? 1 : 0);
    const completedTopics = stage.topics.filter(t => t.user_status === 'completed').length +
        (stage.project?.user_status === 'completed' ? 1 : 0);
    const progressPercent = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0;

    return (
        <AccordionItem
            value={stage.stage_id}
            disabled={state === 'locked'}
            className={cn(
                "border rounded-xl px-2 sm:px-6 py-2 overflow-hidden bg-card transition-all",
                state === 'locked' && "opacity-70 bg-muted/20 grayscale-[0.2]",
                state === 'current' && "border-primary/50 ring-1 ring-primary/10 shadow-sm"
            )}
        >
            <AccordionTrigger className="hover:no-underline py-4 group">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full text-left gap-4">
                    <div className="flex items-start gap-4 flex-1 pr-4">
                        <div className={cn(
                            "flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full border-2 mt-1 md:mt-0",
                            state === 'completed' ? "border-primary text-primary bg-primary/10" :
                                state === 'current' ? "border-primary text-primary" :
                                    "border-muted bg-muted text-muted-foreground"
                        )}>
                            {state === 'completed' ? <CheckCircle2 className="w-6 h-6" /> :
                                state === 'locked' ? <Lock className="w-5 h-5" /> :
                                    <span className="font-bold text-lg">{stage.order_index}</span>}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <h3 className="text-xl font-bold tracking-tight">{stage.title}</h3>
                                {state === 'current' && <Badge variant="default" className="ml-2 text-[10px] uppercase tracking-wider">{t('current_stage')}</Badge>}
                                {state === 'completed' && <Badge variant="secondary" className="ml-2 text-[10px] uppercase tracking-wider">{t('completed')}</Badge>}
                                {state === 'locked' && <Badge variant="outline" className="ml-2 text-[10px] uppercase tracking-wider text-muted-foreground">{t('locked')}</Badge>}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground capitalize flex-wrap">
                                <span className={cn(
                                    "font-medium",
                                    stage.difficulty_level === 'beginner' && "text-success",
                                    stage.difficulty_level === 'intermediate' && "text-warning",
                                    stage.difficulty_level === 'advanced' && "text-destructive"
                                )}>
                                    {t(`difficulty.${stage.difficulty_level}`, { fallback: stage.difficulty_level })}
                                </span>
                                <span>•</span>
                                <span>{totalTopics} {t('modules')}</span>
                            </div>
                        </div>
                    </div>

                    {state !== 'locked' && (
                        <div className="flex items-center gap-4 w-full md:w-1/4 pt-2 md:pt-0 border-t md:border-none">
                            <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
                                <Progress value={progressPercent} className="h-full bg-primary" />
                            </div>
                            <span className="text-sm font-bold text-foreground whitespace-nowrap w-10 text-right">
                                {Math.round(progressPercent)}%
                            </span>
                        </div>
                    )}
                </div>
            </AccordionTrigger>

            <AccordionContent className="pt-4 pb-6 border-t mt-2">
                <div className="space-y-3 md:pl-[3.25rem]">
                    {stage.topics.filter(t => !t.topic_type.startsWith('project_')).map(topic => (
                        <TopicItem key={topic.topic_id} topic={topic} t={t} locale={locale} />
                    ))}

                    {stage.project && (
                        <div className="mt-6 pt-6 border-t border-dashed">
                            <ProjectItem project={stage.project} t={t} locale={locale} />
                        </div>
                    )}
                </div>
            </AccordionContent>
        </AccordionItem>
    );
}

function TopicItem({ topic, t, locale }: { topic: Topic, t: ReturnType<typeof useTranslations>, locale: string }) {
    // Determine primary resource type
    const hasVideo = topic.resources?.some(r => r.resource_type === 'VIDEO');
    const hasArticle = topic.resources?.some(r => r.resource_type === 'ARTICLE' || r.resource_type === 'INTERNAL_TEXT');

    const getIcon = () => {
        if (topic.user_status === 'completed') return <CheckCircle2 className="w-5 h-5" />;
        if (hasVideo && topic.topic_type === 'lesson') return <Video className="w-5 h-5" />;
        if (hasArticle && topic.topic_type === 'lesson') return <BookOpen className="w-5 h-5" />;

        switch (topic.topic_type) {
            case 'lesson': return <PlayCircle className="w-5 h-5" />;
            case 'concept': return <FileText className="w-5 h-5" />;
            case 'lesson_lab': return <FlaskConical className="w-5 h-5" />;
            case 'project_milestone': return <LayoutTemplate className="w-5 h-5" />;
            default: return <Circle className="w-5 h-5" />;
        }
    };

    return (
        <div className={cn(
            "group flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-lg border bg-background hover:border-primary/50 hover:shadow-sm transition-all relative overflow-hidden",
            topic.user_status === 'completed' && "opacity-80 bg-muted/10 border-muted"
        )}>
            {/* Status indicator bar on the left edge */}
            <div className={cn(
                "absolute left-0 top-0 bottom-0 w-1",
                topic.user_status === 'completed' ? "bg-primary/50" :
                    topic.user_status === 'in_progress' ? "bg-info" : "bg-transparent group-hover:bg-primary/20"
            )} />

            <div className={cn(
                "flex-shrink-0 flex items-center gap-3",
                topic.user_status === 'completed' ? "text-primary" :
                    topic.user_status === 'in_progress' ? "text-info" : "text-muted-foreground"
            )}>
                {getIcon()}
            </div>

            <div className="flex-grow min-w-0 flex flex-col gap-1.5">
                <div className="flex items-start justify-between gap-4">
                    <h4 className={cn("text-base font-bold", topic.user_status === 'completed' && "text-muted-foreground")}>
                        {topic.title}
                    </h4>

                    {/* Status Badge */}
                    <div className="hidden sm:block">
                        {topic.user_status === 'completed' ? (
                            <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 uppercase text-[10px] tracking-wider">{t('status.completed')}</Badge>
                        ) : topic.user_status === 'in_progress' ? (
                            <Badge variant="secondary" className="text-info bg-info/15 uppercase text-[10px] tracking-wider">{t('status.in_progress')}</Badge>
                        ) : (
                            <Badge variant="outline" className="text-muted-foreground uppercase text-[10px] tracking-wider">{t('status.not_started')}</Badge>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1 font-medium bg-secondary/50 px-2 py-0.5 rounded uppercase tracking-wider">
                        {t(`types.${topic.topic_type}`)}
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {topic.estimated_time_min} {t('minutes')}
                    </span>

                    {/* Skills Tags */}
                    {topic.skills && topic.skills.length > 0 && (
                        <div className="flex items-center gap-1.5 ml-1 border-l pl-3 border-border">
                            {topic.skills.slice(0, 2).map((skill: { skill_id: string, name: string }) => (
                                <span key={skill.skill_id} className="text-xs text-muted-foreground/80 truncate max-w-[120px]">
                                    {skill.name}
                                </span>
                            ))}
                            {topic.skills.length > 2 && <span className="text-xs text-muted-foreground/60">+{topic.skills.length - 2}</span>}
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-2 sm:mt-0 flex shrink-0 sm:items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
                {/* Mobile Status Badge */}
                <div className="sm:hidden self-center">
                    {topic.user_status === 'completed' ? (
                        <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 uppercase text-[10px] tracking-wider">{t('status.completed')}</Badge>
                    ) : topic.user_status === 'in_progress' ? (
                        <Badge variant="secondary" className="text-info bg-info/15 uppercase text-[10px] tracking-wider">{t('status.in_progress')}</Badge>
                    ) : null}
                </div>

                <Link href={`/${locale}/dashboard/topic/${topic.topic_id}`}>
                    <button className={cn(
                        "text-sm font-semibold border rounded-lg transition-all px-4 py-2",
                        topic.user_status === 'completed' ? "bg-background border-input text-foreground hover:bg-accent" :
                            topic.user_status === 'in_progress' ? "bg-primary text-primary-foreground hover:bg-primary/90 border-transparent shadow-sm" :
                                "bg-background border-border hover:border-primary hover:text-primary"
                    )}>
                        {topic.user_status === 'completed' ? t('actions.review') :
                            topic.user_status === 'in_progress' ? t('actions.continue') :
                                t('actions.start')}
                    </button>
                </Link>
            </div>
        </div>
    );
}

function ProjectItem({ project, t, locale }: { project: { user_status?: string, title?: string, description?: string | null, difficulty_level?: string, project_id: string }, t: ReturnType<typeof useTranslations>, locale: string }) {
    return (
        <div className={cn(
            "relative overflow-hidden rounded-xl border p-1",
            project.user_status === 'completed' ? "bg-muted/30 border-muted" : "bg-gradient-to-r from-primary via-primary/80 to-primary/50 p-[1px]"
        )}>
            <div className="absolute inset-0 bg-background/95 backdrop-blur-3xl rounded-xl z-0" />

            <div className="relative z-10 flex flex-col sm:flex-row items-start gap-4 p-5 rounded-[10px]">
                <div className={cn(
                    "flex-shrink-0 p-4 rounded-xl",
                    project.user_status === 'completed' ? "bg-muted/50 text-muted-foreground" : "bg-primary/10 text-primary"
                )}>
                    <Trophy className="w-8 h-8" />
                </div>

                <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                        <Badge variant="default" className={cn(
                            "uppercase tracking-wider text-[10px]",
                            project.user_status === 'completed' ? "bg-muted text-muted-foreground" : ""
                        )}>
                            {t('milestone_project')}
                        </Badge>
                        {project.user_status === 'completed' && (
                            <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 uppercase text-[10px] tracking-wider">
                                {t('status.completed')}
                            </Badge>
                        )}
                        {project.user_status === 'in_progress' && (
                            <Badge variant="secondary" className="text-info bg-info/15 uppercase text-[10px] tracking-wider">
                                {t('status.in_progress')}
                            </Badge>
                        )}
                    </div>

                    <h4 className="text-xl font-black tracking-tight">{project.title}</h4>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed max-w-2xl">
                        {project.description}
                    </p>

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t pt-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="font-medium uppercase tracking-wider text-[11px] text-foreground">
                                {t('difficulty_label')}:
                            </span>
                            <span className={cn(
                                "capitalize font-semibold",
                                project.difficulty_level === 'beginner' && "text-success",
                                project.difficulty_level === 'intermediate' && "text-warning",
                                project.difficulty_level === 'advanced' && "text-destructive"
                            )}>
                                {t(`difficulty.${project.difficulty_level}`, { fallback: project.difficulty_level || '' })}
                            </span>
                        </div>

                        <Link href={`/${locale}/dashboard/project/${project.project_id}`} className="w-full sm:w-auto">
                            <button className={cn(
                                "w-full sm:w-auto text-sm font-bold px-6 py-2.5 rounded-lg transition-all shadow-sm",
                                project.user_status === 'completed' ? "border bg-background hover:bg-muted text-foreground" :
                                    "bg-primary text-primary-foreground hover:bg-primary/95 hover:shadow-md hover:-translate-y-0.5"
                            )}>
                                {project.user_status === 'completed' ? t('actions.view_submission') :
                                    project.user_status === 'in_progress' ? t('actions.continue_project') :
                                        t('actions.start_project')}
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

