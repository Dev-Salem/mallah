'use client';

import { useLocale } from 'next-intl';
import { cn } from '@/lib/utils';
import { GOAL_LABELS } from '../types';
import type { DashboardSummary } from '../types';

interface GreetingBarProps {
    learner: DashboardSummary['learner'];
    path: DashboardSummary['path'];
    stage: DashboardSummary['stage'];
    paceStatus: DashboardSummary['pace']['pace_status'];
}

export function GreetingBar({ learner, path, stage, paceStatus }: GreetingBarProps) {
    const locale = useLocale();
    const isArabic = locale === 'ar';
    const goalLabel = learner.primary_goal ? GOAL_LABELS[learner.primary_goal] ?? learner.primary_goal : '—';

    // Status badge
    const isPathCompleted = path.completion_percent >= 100;
    const badgeLabel = isPathCompleted
        ? 'Path Completed'
        : paceStatus === 'Behind'
            ? 'Slightly Behind'
            : 'On Track';
    
    // Improved contrast for Light Mode status badges
    const badgeColor = isPathCompleted
        ? 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20'
        : paceStatus === 'Behind'
            ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20'
            : 'bg-primary/10 text-primary border-primary/20';

    return (
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-2">
            <div>
                {/* Welcome line */}
                <h1 className={cn(
                    "text-2xl lg:text-4xl font-black text-foreground uppercase mb-2",
                    !isArabic && "tracking-tighter"
                )}>
                    Welcome back, <span className="text-primary">{learner.first_name}</span>
                </h1>

                {/* Context strip - Tactical Breadcrumbs */}
                <div className={cn(
                    "flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono text-muted-foreground uppercase",
                    !isArabic && "tracking-[0.12em]"
                )}>
                    <div className="flex items-center gap-1.5 font-bold">
                        <span className="opacity-50">Path:</span>
                        <span className="text-foreground">{path.path_display_name}</span>
                    </div>
                    <span className="opacity-20">·</span>
                    <div className="flex items-center gap-1.5 font-bold">
                        <span className="opacity-50">Stage:</span>
                        <span className="text-foreground">{stage.current_stage_title}</span>
                    </div>
                    <span className="opacity-20">·</span>
                    <div className="flex items-center gap-1.5 font-bold">
                        <span className="opacity-50">Goal:</span>
                        <span className="text-foreground">{goalLabel}</span>
                    </div>
                </div>
            </div>

            {/* Status badge */}
            <div className={cn(
                "text-xs font-mono uppercase font-black px-3 py-1.5 border shrink-0 self-start shadow-sm",
                badgeColor,
                !isArabic && "tracking-widest"
            )}>
                {badgeLabel}
            </div>
        </div>
    );
}
