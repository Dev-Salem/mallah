'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { RoadmapData, Stage, Topic } from '../types';
import { CheckCircle2, Circle, Lock, PlayCircle, FileText, FlaskConical, LayoutTemplate, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocale } from 'next-intl';

interface RoadmapViewProps {
    roadmap: RoadmapData;
}

export function RoadmapView({ roadmap }: RoadmapViewProps) {
    const t = useTranslations('Roadmap');
    const locale = useLocale();
    const isRtl = locale === 'ar';

    return (
        <div className="w-full max-w-4xl mx-auto py-8">
            <div className="mb-10 text-center">
                <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4">
                    {t('title')}
                </h1>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                    {t('subtitle')}
                </p>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-4">
                {roadmap.stages.map((stage) => (
                    <StageCard key={stage.stage_id} stage={stage} isRtl={isRtl} t={t} locale={locale} />
                ))}
            </Accordion>
        </div>
    );
}

function StageCard({ stage, isRtl, t, locale }: { stage: Stage; isRtl: boolean; t: any; locale: string }) {
    const totalTopics = stage.topics.length + (stage.project ? 1 : 0);
    const completedTopics = stage.topics.filter(t => t.user_status === 'completed').length +
        (stage.project?.user_status === 'completed' ? 1 : 0);
    const progressPercent = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0;

    return (
        <AccordionItem
            value={stage.stage_id}
            disabled={!stage.is_unlocked}
            className={cn(
                "border rounded-xl px-6 py-2 overflow-hidden bg-card transition-all",
                !stage.is_unlocked && "opacity-75 bg-muted/30 grayscale-[0.3]"
            )}
        >
            <AccordionTrigger className="hover:no-underline py-4 group">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full text-left gap-4">
                    <div className="flex items-center gap-4">
                        <div className={cn(
                            "flex items-center justify-center w-12 h-12 rounded-full border-2",
                            stage.is_unlocked ? "border-primary text-primary" : "border-muted-foreground text-muted-foreground"
                        )}>
                            {stage.is_unlocked ? (
                                progressPercent === 100 ? <CheckCircle2 className="w-6 h-6" /> : <span className="font-bold text-lg">{stage.order_index}</span>
                            ) : (
                                <Lock className="w-5 h-5" />
                            )}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold tracking-tight">{stage.title}</h3>
                            <p className="text-sm text-muted-foreground capitalize">
                                {t('difficulty', { level: stage.difficulty_level })} • {totalTopics} {t('modules')}
                            </p>
                        </div>
                    </div>

                    {stage.is_unlocked && (
                        <div className="flex items-center gap-4 w-full sm:w-1/3">
                            <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
                                <Progress value={progressPercent} className="h-full bg-primary" />
                            </div>
                            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                                {Math.round(progressPercent)}%
                            </span>
                        </div>
                    )}
                </div>
            </AccordionTrigger>

            <AccordionContent className="pt-4 pb-6 border-t mt-2">
                <div className="space-y-3 pl-[3.25rem]">
                    {stage.topics.map(topic => (
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

function TopicItem({ topic, t, locale }: { topic: Topic, t: any, locale: string }) {
    const getIcon = () => {
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
            "flex items-center gap-4 p-3 rounded-lg border bg-background/50 transition-colors hover:bg-accent hover:border-accent",
            topic.user_status === 'completed' && "opacity-75"
        )}>
            <div className={cn(
                "flex-shrink-0",
                topic.user_status === 'completed' ? "text-primary" : "text-muted-foreground"
            )}>
                {topic.user_status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : getIcon()}
            </div>

            <div className="flex-grow min-w-0">
                <h4 className={cn("text-base font-semibold truncate", topic.user_status === 'completed' && "line-through text-muted-foreground")}>
                    {topic.title}
                </h4>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <span className="uppercase tracking-wider font-medium">{t(`types.${topic.topic_type}`)}</span>
                    <span>•</span>
                    <span>{topic.estimated_time_min} {t('minutes')}</span>
                </div>
            </div>

            <div>
                <Link href={`/${locale}/dashboard/topic/${topic.topic_id}`}>
                    <button className="text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground px-3 py-1.5 rounded-md transition-colors">
                        {topic.user_status === 'completed' ? t('review') : topic.user_status === 'in_progress' ? t('continue') : t('start')}
                    </button>
                </Link>
            </div>
        </div>
    );
}

function ProjectItem({ project, t, locale }: { project: any, t: any, locale: string }) {
    return (
        <div className="relative overflow-hidden rounded-xl border bg-gradient-to-br from-primary/5 to-transparent p-5">
            <div className="flex items-start gap-4">
                <div className="flex-shrink-0 bg-primary/10 p-3 rounded-lg">
                    <Trophy className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-grow">
                    <div className="mb-2 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider bg-background text-foreground">
                        {t('milestone_project')}
                    </div>
                    <h4 className="text-lg font-bold">{project.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {project.description}
                    </p>

                    <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground capitalize">
                            {t('difficulty', { level: project.difficulty_level })}
                        </span>
                        <Link href={`/${locale}/dashboard/project/${project.project_id}`}>
                            <button className="text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md transition-colors">
                                {project.user_status === 'completed' ? t('view_submission') : t('start_project')}
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
