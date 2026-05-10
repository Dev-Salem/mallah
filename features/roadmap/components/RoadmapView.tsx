'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CertificateSuggestion, RoadmapData, Stage, Topic } from '../types';
import { Award, CheckCircle2, Circle, ExternalLink, Lock, PlayCircle, FileText, FlaskConical, LayoutTemplate, Trophy, Video, BookOpen, Clock, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocale } from 'next-intl';

interface RoadmapViewProps {
    roadmap: RoadmapData;
}

export function RoadmapView({ roadmap }: RoadmapViewProps) {
    const t = useTranslations('Roadmap');
    const locale = useLocale();

    // Constant stats per path as per spec
    const PATH_HEADER_STATS: Record<string, { totalStages: number; totalTopics: number }> = {
        frontend: { totalStages: 7, totalTopics: 45 },
        fullstack: { totalStages: 8, totalTopics: 49 },
        datascience: { totalStages: 8, totalTopics: 49 },
        cybersecurity: { totalStages: 8, totalTopics: 48 },
    };

    const pathId = roadmap.path_id as keyof typeof PATH_HEADER_STATS;
    const stats = PATH_HEADER_STATS[pathId] || PATH_HEADER_STATS.frontend;
    const certificateSuggestions = roadmap.certificateStage?.suggestions ?? [];

    // Calculate dynamic stats
    let completedTopics = 0;
    let currentActiveStageIndex = stats.totalStages;

    roadmap.stages.forEach((stage, idx) => {
        const stageTopicsCompleted = stage.topics.filter(t => t.user_status === 'completed').length;
        const projectCompleted = (stage.project?.user_status === 'completed' || stage.project?.user_status === 'waiting') ? 1 : 0;
        completedTopics += (stageTopicsCompleted + projectCompleted);

        // Find first non-completed stage (current active)
        const totalStageItems = stage.topics.length + (stage.project ? 1 : 0);
        if (stageTopicsCompleted + projectCompleted < totalStageItems && currentActiveStageIndex === stats.totalStages) {
            currentActiveStageIndex = idx + 1;
        }
    });

    const overallPct = Math.round((completedTopics / stats.totalTopics) * 100);
    const isCompleted = overallPct >= 100;

    return (
        <div className="w-full max-w-6xl py-8 px-4 md:px-10">
            {/* Header Card - Theme Aware & Accessible */}
            <div 
                className="relative overflow-hidden rounded-xl border p-[18px_24px] mb-6 shadow-xl bg-card border-border dark:border-primary/20 transition-colors duration-500"
                style={{ 
                    '--header-dark-bg': 'oklch(0.155 0.015 106)'
                } as any}
            >
                {/* Specific Dark Background Overlay to avoid blue tint */}
                <div className="absolute inset-0 z-[-1] opacity-0 dark:opacity-100 dark:bg-[var(--header-dark-bg)] transition-opacity" />
                {/* Top decorative accent line */}
                <div 
                    className="absolute top-0 left-0 right-0 h-[2px]"
                    style={{ background: 'linear-gradient(90deg, transparent, oklch(0.68 0.13 38.8), transparent)' }}
                />

                <div className="flex flex-col">
                    {/* Row 1 — Top Bar */}
                    <div className="flex items-center justify-between gap-4 mb-6">
                        {/* Path Tag Pill */}
                        <div 
                            className="px-[10px] py-[3.5px] rounded-[4px] border text-[11px] font-mono font-bold uppercase tracking-[0.2em]"
                            style={{ 
                                color: 'oklch(0.68 0.13 38.8)',
                                backgroundColor: 'oklch(0.68 0.13 38.8 / 0.1)',
                                borderColor: 'oklch(0.68 0.13 38.8 / 0.25)'
                            }}
                        >
                            {t(`path_display.${roadmap.path_id}`, { fallback: roadmap.path_id.toUpperCase() })}
                        </div>

                        {/* Status Indicator */}
                        <div 
                            className="flex items-center gap-[7px] text-[11px] font-mono font-bold uppercase tracking-[0.08em]"
                            style={{ 
                                color: isCompleted ? 'oklch(0.68 0.13 38.8)' : 'oklch(0.65 0.12 153)' 
                            }}
                        >
                            <span className={cn(
                                "flex h-[6px] w-[6px] rounded-full",
                                !isCompleted && "animate-header-pulse"
                            )} 
                            style={{ 
                                backgroundColor: isCompleted ? 'oklch(0.68 0.13 38.8)' : 'oklch(0.65 0.12 153)' 
                            }} />
                            {isCompleted ? 'COMPLETED' : t('active_status', { fallback: 'ACTIVE' })}
                        </div>
                    </div>

                    {/* Row 2 — Title */}
                    <div className="mb-[16px]">
                        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
                            {isCompleted ? t('you_mastered') : t('your_path_to')}{' '}
                            <span style={{ color: 'oklch(0.68 0.13 38.8)' }}>
                                {t(`path_destination.${roadmap.path_id}`, { fallback: roadmap.path_id })}
                            </span>
                        </h1>
                    </div>

                    {/* Row 3 — Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-[10px]">
                        {/* Card 1 — Overall Progress */}
                        <div className="rounded-[8px] border p-[12px_16px] flex flex-col gap-[6px] shadow-inner bg-muted/30 dark:bg-black/40 border-border dark:border-white/5 transition-colors">
                            <div className="flex items-baseline gap-1">
                                <span className="text-[20px] font-mono font-medium" style={{ color: 'oklch(0.68 0.13 38.8)' }}>
                                    {overallPct}%
                                </span>
                            </div>
                            <span className="text-[11px] font-bold tracking-[0.03em] uppercase opacity-70 text-muted-foreground">
                                {t('overall_progress_label')}
                            </span>
                        </div>

                        {/* Card 2 — Stages Active */}
                        <div className="rounded-[8px] border p-[12px_16px] flex flex-col gap-[6px] shadow-inner bg-muted/30 dark:bg-black/40 border-border dark:border-white/5 transition-colors">
                            <div className="flex items-baseline gap-1">
                                <span className="text-[20px] font-mono font-medium" style={{ color: 'oklch(0.68 0.13 38.8)' }}>
                                    {isCompleted ? stats.totalStages : currentActiveStageIndex}
                                </span>
                                <span className="text-[12px] font-mono font-bold opacity-40 text-muted-foreground">
                                    / {stats.totalStages}
                                </span>
                            </div>
                            <span className="text-[11px] font-bold tracking-[0.03em] uppercase opacity-70 text-muted-foreground">
                                {t('stages_active_label')}
                            </span>
                        </div>

                        {/* Card 3 — Topics Done */}
                        <div className="rounded-[8px] border p-[12px_16px] flex flex-col gap-[6px] shadow-inner bg-muted/30 dark:bg-black/40 border-border dark:border-white/5 transition-colors">
                            <div className="flex items-baseline gap-1">
                                <span className="text-[20px] font-mono font-medium" style={{ color: 'oklch(0.68 0.13 38.8)' }}>
                                    {completedTopics}
                                </span>
                                <span className="text-[12px] font-mono font-bold opacity-40 text-muted-foreground">
                                    / {stats.totalTopics}
                                </span>
                            </div>
                            <span className="text-[11px] font-bold tracking-[0.03em] uppercase opacity-70 text-muted-foreground">
                                {t('topics_done_label')}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scanline Divider */}
            <div className="w-full h-[1px] mb-8 opacity-30" 
                style={{ 
                    backgroundImage: 'repeating-linear-gradient(to right, oklch(0.68 0.13 38.8) 0, oklch(0.68 0.13 38.8) 4px, transparent 4px, transparent 8px)'
                }}
            />

            {/* Timeline Spine & Stages */}
            <div className="relative grid grid-cols-[40px_1fr] md:grid-cols-[50px_1fr] gap-3 md:gap-4 min-h-[400px]">
                {/* Vertical Spine Line */}
                <div className="absolute left-[19px] md:left-[24px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary via-primary/30 to-transparent opacity-20 dark:opacity-40" />

                <Accordion 
                    type="multiple" 
                    defaultValue={roadmap.stages
                        .filter(s => {
                            const stageTopicsCompleted = s.topics.filter(t => t.user_status === 'completed').length;
                            const projectCompleted = (s.project?.user_status === 'completed' || s.project?.user_status === 'waiting') ? 1 : 0;
                            const totalStageItems = s.topics.length + (s.project ? 1 : 0);
                            const isStageDone = (stageTopicsCompleted + projectCompleted) >= totalStageItems;
                            return s.is_unlocked && !isStageDone;
                        })
                        .slice(0, 1) // Only open the first incomplete stage
                        .map(s => s.stage_id)} 
                    className="contents"
                >
                    {roadmap.stages.map((stage, index) => {
                        const stageTopicsCompleted = stage.topics.filter(t => t.user_status === 'completed').length;
                        const projectCompleted = (stage.project?.user_status === 'completed' || stage.project?.user_status === 'waiting') ? 1 : 0;
                        const totalStageItems = stage.topics.length + (stage.project ? 1 : 0);
                        const isCompleted = (stageTopicsCompleted + projectCompleted) >= totalStageItems;
                        
                        const state = !stage.is_unlocked ? 'locked' : isCompleted ? 'completed' : 'current';

                        return (
                            <AccordionItem key={stage.stage_id} value={stage.stage_id} className="contents border-none">
                                {/* Timeline Node - Stage Number Circle */}
                                <div className="relative flex flex-col items-center pt-8">
                                    <div 
                                        className={cn(
                                            "z-20 flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full border-2 text-[10px] md:text-xs font-mono font-bold transition-all duration-700",
                                            state === 'completed' ? "bg-success border-success text-white shadow-[0_0_20px_rgba(34,197,94,0.4)]" :
                                            state === 'current' ? "bg-primary border-primary text-white shadow-[0_0_25px_rgba(249,115,22,0.5)] scale-110" :
                                            "bg-muted border-border text-muted-foreground opacity-60"
                                        )}
                                    >
                                        {String(index + 1).padStart(2, '0')}
                                    </div>
                                    {index === 0 && (
                                        <div className="absolute -top-1 text-[9px] font-mono text-primary/60 uppercase tracking-widest text-center">
                                            START
                                        </div>
                                    )}
                                </div>

                                {/* Stage Content Card */}
                                <div className="pb-16 group">
                                    <StageCard
                                        stage={stage}
                                        t={t}
                                        locale={locale}
                                        state={state}
                                        isFirst={index === 0}
                                    />
                                </div>
                            </AccordionItem>
                        );
                    })}
                </Accordion>

                {certificateSuggestions.length > 0 && (
                    <>
                        <div className="relative flex flex-col items-center pt-8">
                            <div className="z-20 flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full border-2 border-primary/40 bg-primary/10 text-primary shadow-[0_0_18px_rgba(249,115,22,0.2)]">
                                <Award className="h-4 w-4 md:h-5 md:w-5" />
                            </div>
                            <div className="absolute -bottom-7 text-[9px] font-mono text-primary/60 uppercase tracking-widest text-center">
                                NEXT
                            </div>
                        </div>

                        <div className="pb-16">
                            <CertificateStageCard suggestions={certificateSuggestions} t={t} />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

function StageCard({ stage, t, locale, state, isFirst }: { stage: Stage; t: ReturnType<typeof useTranslations>; locale: string; state: 'locked' | 'current' | 'completed', isFirst?: boolean }) {
    const stageTopicsCompleted = stage.topics.filter(t => t.user_status === 'completed').length;
    const projectCompleted = (stage.project?.user_status === 'completed' || stage.project?.user_status === 'waiting') ? 1 : 0;
    const totalStageItems = stage.topics.length + (stage.project ? 1 : 0);
    const progressPercent = totalStageItems > 0 ? ((stageTopicsCompleted + projectCompleted) / totalStageItems) * 100 : 0;

    return (
        <div
            className={cn(
                "relative flex flex-col gap-6 p-6 md:p-10 rounded-3xl border transition-all duration-700",
                state === 'current' ? "border-primary/40 shadow-[0_0_40px_rgba(249,115,22,0.08)] bg-card/60 backdrop-blur-xl" :
                state === 'completed' ? "border-success/20 bg-success/[0.03] dark:bg-success/[0.01]" :
                "border-border/40 bg-muted/40 opacity-70 cursor-not-allowed overflow-hidden"
            )}
        >
            {/* Glossy overlay for active stage */}
            {state === 'current' && (
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/[0.03] to-transparent pointer-events-none" />
            )}

            {/* Stage Header */}
            <AccordionTrigger className="hover:no-underline p-0 relative z-10 flex flex-col gap-6 items-stretch">
                <div className="flex items-center justify-between gap-6">
                    <div className="flex flex-col gap-2 text-left">
                        <div className="flex items-center gap-3">
                            <span className={cn(
                                "text-[10px] font-mono font-bold uppercase tracking-[0.2em]",
                                state === 'locked' ? "text-muted-foreground/60" : 
                                state === 'completed' ? "text-success/80" : "text-primary/80"
                            )}>
                                {state === 'locked' ? 'ENCRYPTED' : 
                                 state === 'completed' ? t('completed_stage').toUpperCase() : 
                                 t('current_stage').toUpperCase()} // {String(stage.order_index).padStart(2, '0')}
                            </span>
                            <div className={cn(
                                "text-[9px] px-2 py-0.5 rounded-md border uppercase font-mono font-bold tracking-widest",
                                stage.difficulty_level === 'beginner' ? "border-success/30 text-success bg-success/5" :
                                stage.difficulty_level === 'intermediate' ? "border-warning/30 text-warning bg-warning/5" :
                                "border-destructive/30 text-destructive bg-destructive/5"
                            )}>
                                {t(`difficulty.${stage.difficulty_level}`)}
                            </div>
                        </div>
                        <h3 className={cn(
                            "text-2xl md:text-3xl font-bold tracking-tight",
                            state === 'locked' && "text-muted-foreground/40"
                        )}>
                            {stage.title}
                        </h3>
                    </div>

                    {state === 'locked' ? (
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/50 border border-border text-muted-foreground/40">
                            <Lock className="w-6 h-6" />
                        </div>
                    ) : (
                        <div className="flex items-center gap-6">
                             <div className="text-right flex flex-col">
                                <span className={cn(
                                    "text-3xl font-mono font-bold leading-none tracking-tighter",
                                    state === 'completed' ? "text-success" : "text-primary"
                                )}>
                                    {Math.round(progressPercent)}%
                                </span>
                                <span className="text-[9px] text-muted-foreground/60 uppercase font-mono font-bold tracking-[0.1em] mt-2 text-center md:text-right">
                                    {state === 'completed' ? 'SYNCHRONIZED' : ''}
                                </span>
                             </div>
                        </div>
                    )}
                </div>

                {state !== 'locked' && (
                    <div className="w-full h-[3px] bg-muted/50 overflow-hidden rounded-full p-[0.5px] border border-white/[0.03]">
                        <div 
                            className={cn(
                                "h-full transition-all duration-1000 ease-out rounded-full shadow-[0_0_10px_currentColor]",
                                state === 'completed' ? "bg-success text-success" : "bg-primary text-primary"
                            )} 
                            style={{ width: `${progressPercent}%` }} 
                        />
                    </div>
                )}
            </AccordionTrigger>

            {/* Stage Content - Restricted if locked */}
            {state !== 'locked' ? (
                <AccordionContent className="relative z-10 flex flex-col gap-6 pt-6">
                    <div className="flex flex-col gap-3">
                        {stage.topics.map(topic => (
                            <TopicItem key={topic.topic_id} topic={topic} t={t} locale={locale} />
                        ))}
                    </div>
                    
                    {stage.project && (
                         <div className="mt-2">
                            <ProjectItem project={{ ...stage.project, stage_order: stage.order_index }} t={t} locale={locale} />
                         </div>
                    )}
                </AccordionContent>
            ) : (
                /* Unlock Notice Footer for Locked Stage */
                <div className="mt-4 pt-6 border-t border-border/20 flex items-center gap-3 text-muted-foreground/40 font-mono font-bold text-[10px] uppercase tracking-[0.15em]">
                    <Lock className="w-3.5 h-3.5" />
                    {t('unlock_notice', { stage: stage.order_index - 1 })}
                </div>
            )}
        </div>
    );
}

function CertificateStageCard({ suggestions, t }: { suggestions: CertificateSuggestion[]; t: ReturnType<typeof useTranslations> }) {
    return (
        <div className="relative flex flex-col gap-6 rounded-3xl border border-primary/20 bg-card/70 p-6 md:p-10 shadow-[0_0_30px_rgba(249,115,22,0.06)]">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/[0.04] via-transparent to-primary/[0.02] pointer-events-none rounded-3xl" />

            <div className="relative z-10 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <span className="rounded-md border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-primary/80">
                        {t('certificate_stage_label')}
                    </span>
                </div>

                <div className="flex flex-col gap-2">
                    <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                        {t('certificate_stage_title')}
                    </h3>
                    <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
                        {t('certificate_stage_description')}
                    </p>
                </div>
            </div>

            <div className="relative z-10 grid gap-4">
                {suggestions.map((suggestion) => (
                    <div
                        key={suggestion.id}
                        className="rounded-2xl border border-border/60 bg-background/80 p-5 transition-colors hover:border-primary/30"
                    >
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                            <div className="min-w-0 flex-1">
                                <div className="mb-3 flex flex-wrap items-center gap-2">
                                    <span className="rounded-md border border-primary/20 bg-primary/10 px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-[0.15em] text-primary/80">
                                        {suggestion.stageLabel}
                                    </span>
                                    {suggestion.afterText && (
                                        <span className="text-[11px] font-mono uppercase tracking-[0.08em] text-muted-foreground/70">
                                            {t('certificate_after', { after: suggestion.afterText })}
                                        </span>
                                    )}
                                </div>

                                <h4 className="text-lg font-bold tracking-tight text-foreground">
                                    {suggestion.title}
                                </h4>

                                <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                                    <span>{t('certificate_provider', { provider: suggestion.provider })}</span>
                                    {suggestion.costLabel && (
                                        <span>{t('certificate_cost', { cost: suggestion.costLabel })}</span>
                                    )}
                                </div>

                                {suggestion.costNote && (
                                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                                        {suggestion.costNote}
                                    </p>
                                )}

                                {suggestion.whyNow && (
                                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                                        <span className="font-semibold text-foreground">{t('certificate_why_now_label')} </span>
                                        {suggestion.whyNow}
                                    </p>
                                )}
                            </div>

                            <div className="md:pl-6">
                                <Link
                                    href={suggestion.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary px-4 py-2 text-xs font-mono font-bold uppercase tracking-[0.18em] text-white shadow-[0_8px_18px_rgba(249,115,22,0.22)] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_22px_rgba(249,115,22,0.3)]"
                                >
                                    {t('certificate_cta')}
                                    <ExternalLink className="h-3.5 w-3.5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function TopicItem({ topic, t, locale }: { topic: Topic, t: ReturnType<typeof useTranslations>, locale: string }) {
    const isCompleted = topic.user_status === 'completed';
    const isInProgress = topic.user_status === 'in_progress';
    const isNotStarted = topic.user_status === 'not_started' || !topic.user_status;

    return (
        <Link
            href={`/${locale}/dashboard/topic/${topic.topic_id}`}
            className="group relative flex flex-col md:flex-row items-start md:items-center gap-4 p-4 rounded-2xl border border-border/50 bg-card hover:border-primary/40 hover:bg-accent/5 transition-all duration-300 shadow-sm hover:shadow-md"
        >
            {/* Left: Icon & Title */}
            <div className="flex items-center gap-4 flex-grow min-w-0">
                <div className={cn(
                    "flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-500 relative",
                    isCompleted ? "bg-success/10 text-success" :
                    isInProgress ? "bg-primary/20 text-primary border border-primary/30 shadow-[0_0_20px_rgba(249,115,22,0.2)]" :
                    "bg-muted text-muted-foreground/60"
                )}>
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : 
                     topic.topic_type === 'lesson' ? <PlayCircle className={cn("w-5 h-5", isInProgress && "animate-pulse")} /> :
                     topic.topic_type === 'lesson_lab' ? <FlaskConical className={cn("w-5 h-5", isInProgress && "animate-pulse")} /> :
                     topic.topic_type.startsWith('project_') ? <LayoutTemplate className={cn("w-5 h-5", isInProgress && "animate-pulse")} /> :
                     <FileText className={cn("w-5 h-5", isInProgress && "animate-pulse")} />}
                    
                    {isInProgress && (
                        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full animate-ping" />
                    )}
                </div>

                <div className="flex flex-col gap-0.5">
                    <h4 className={cn(
                        "text-sm font-bold truncate transition-colors",
                        isCompleted ? "text-muted-foreground" : "text-foreground group-hover:text-primary"
                    )}>
                        {topic.title}
                    </h4>
                    <span className="text-[11px] text-muted-foreground font-mono font-bold uppercase tracking-wider">
                        {topic.estimated_time_text || `${topic.estimated_time_min} ${t('minutes')}`}
                    </span>
                </div>
            </div>

            {/* Middle: Skills Section (New Better Placement) */}
            <div className="flex flex-wrap items-center gap-2 md:px-6 md:border-x border-border/30 min-w-[150px] max-w-[280px]">
                {topic.skills && topic.skills.length > 0 && (
                     <div className="flex flex-col gap-2 w-full">
                        <span className="text-[10px] text-muted-foreground/50 font-mono font-bold uppercase tracking-[.15em] block">
                            ACQUIRED_SKILLS
                        </span>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                            {topic.skills.slice(0, 3).map((skill: any) => (
                                <span 
                                    key={skill.skill_id} 
                                    className={cn(
                                        "flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[10px] font-mono leading-none transition-all duration-300 shadow-sm",
                                        isCompleted ? "border-success/10 bg-success/[0.02] text-success/60" : 
                                        isInProgress ? "border-primary/50 bg-primary/20 text-primary shadow-[0_0_10px_rgba(249,115,22,0.1)]" :
                                        "border-primary/40 bg-primary/10 text-primary"
                                    )}
                                >
                                    <Zap className={cn("w-2.5 h-2.5", !isCompleted && "fill-current", isInProgress && "animate-pulse")} />
                                    {skill.name.toUpperCase()}
                                </span>
                            ))}
                        </div>
                     </div>
                )}
            </div>

            {/* Right: Status & Action */}
            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end mt-2 md:mt-0 flex-shrink-0">
                <div className={cn(
                    "px-2 py-0.5 rounded text-[11px] font-mono font-bold uppercase tracking-widest border relative overflow-hidden whitespace-nowrap flex-shrink-0",
                    isCompleted ? "bg-success/5 border-success/20 text-success/70" :
                    isInProgress ? "bg-primary/20 border-primary shadow-[0_0_15px_rgba(249,115,22,0.2)] text-primary" :
                    "bg-muted border-border text-muted-foreground/40"
                )}>
                    {isInProgress && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_2s_infinite]" />
                    )}
                    {isCompleted ? t('done') : isInProgress ? 'ACTIVE' : t('not_started_caps')}
                </div>

                <div className={cn(
                    "px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 min-w-[80px] text-center whitespace-nowrap flex-shrink-0",
                    isCompleted ? "bg-muted text-muted-foreground border border-border" :
                    isInProgress ? "bg-primary text-white border border-primary shadow-[0_2px_10px_rgba(249,115,22,0.2)]" :
                    "bg-background border border-border text-foreground group-hover:border-primary group-hover:text-primary group-active:scale-95"
                )}>
                    {isCompleted ? t('actions.review') : isInProgress ? t('actions.continue') : t('actions.start')}
                </div>
            </div>
        </Link>
    );
}

function ProjectItem({ project, t, locale }: { project: { user_status?: string, title?: string, description?: string | null, difficulty_level?: string, project_id: string, stage_order?: number }, t: ReturnType<typeof useTranslations>, locale: string }) {
    const isCompleted = project.user_status === 'completed';
    const isWaiting = project.user_status === 'waiting';
    const isInProgress = project.user_status === 'in_progress';

    return (
        <div className={cn(
            "relative overflow-hidden rounded-3xl border transition-all duration-700",
            isCompleted 
                ? "border-success/20 bg-success/[0.03]" 
                : isWaiting
                ? "border-warning/20 bg-warning/[0.03]"
                : "border-primary/30 bg-card shadow-[0_0_40px_rgba(249,115,22,0.05)]"
        )}>
            {/* Glossy top accent for current */}
            {(!isCompleted && !isWaiting) && (
                <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-80" />
            )}

            <div className="relative z-10 p-8 md:p-10 flex flex-col gap-8">
                <div className="flex flex-col md:flex-row items-start gap-8">
                    {/* Trophy Hub Icon - Square Box */}
                    <div className={cn(
                        isCompleted 
                            ? "border-success/30 bg-success/10 text-success shadow-[0_0_20px_rgba(34,197,94,0.1)]" 
                            : isWaiting
                            ? "border-warning/30 bg-warning/10 text-warning"
                            : "border-primary/30 bg-primary/10 text-primary shadow-[0_0_30px_rgba(249,115,22,0.15)]"
                    )}>
                        <Trophy className={cn("w-10 h-10", (!isCompleted && !isWaiting) && "animate-pulse")} />
                    </div>

                    <div className="flex-grow min-w-0">
                        <div className="flex flex-wrap items-center gap-4 mb-4">
                            <div className={cn(
                                "px-3 py-1 rounded-md text-[10px] font-mono font-bold tracking-[0.2em] border",
                                isCompleted ? 'COMPLETED // SYNCED' : isWaiting ? t('skipped_status').toUpperCase() : t('milestone_project').toUpperCase()
                            )}>
                                {isCompleted ? 'COMPLETED // SYNCED' : isWaiting ? t('skipped_status').toUpperCase() : t('milestone_project').toUpperCase()}
                            </div>
                            <div className="text-[10px] font-mono font-bold text-muted-foreground/60 uppercase tracking-[0.2em]">
                                {t('difficulty_label')}: {t(`difficulty.${project.difficulty_level}`)}
                            </div>
                        </div>

                        <h4 className="text-2xl md:text-3xl font-bold tracking-tight mb-3 uppercase italic decoration-primary/30 decoration-2 underline-offset-4">
                            {project.title}
                        </h4>
                        <p className="text-sm text-muted-foreground/80 leading-relaxed max-w-3xl">
                            {project.description}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-border/50">
                    <div className="flex items-center gap-3">
                         <span className={cn(
                             "text-[10px] font-mono font-bold uppercase tracking-[0.2em]",
                             isCompleted ? "text-success/60" : isWaiting ? "text-warning/60" : "text-primary/70"
                         )}>
                             ● {isWaiting ? t('waiting_notice') : t('gates_stage', { stage: (project.stage_order || 0) + 1 })}
                         </span>
                    </div>

                    <Link href={`/${locale}/dashboard/project/${project.project_id}`} className="w-full sm:w-auto">
                        <button className={cn(
                            "group relative w-full sm:w-auto px-10 py-4 rounded-2xl font-mono font-bold text-xs uppercase tracking-[0.2em] transition-all duration-300 overflow-hidden",
                            isCompleted 
                                ? "bg-transparent border border-success/30 text-success hover:bg-success hover:text-white" 
                                : isWaiting
                                ? "bg-transparent border border-warning/30 text-warning hover:bg-warning hover:text-white"
                                : "bg-primary text-white border border-primary shadow-[0_10px_20px_rgba(249,115,22,0.3)] hover:shadow-[0_15px_30px_rgba(249,115,22,0.5)] hover:-translate-y-1"
                        )}>
                            <span className="relative z-10">
                                {isCompleted ? t('actions.view_submission') : isWaiting ? t('actions.resume_project') : isInProgress ? t('actions.continue_project') : t('actions.start_project')}
                            </span>
                            {(!isCompleted && !isWaiting) && (
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1200ms]" />
                            )}
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

