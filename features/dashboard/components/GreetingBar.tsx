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
    const badgeColor = isPathCompleted
        ? 'bg-green-500/15 text-green-400 border-green-500/30'
        : paceStatus === 'Behind'
            ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
            : 'bg-primary/15 text-primary border-primary/30';

    return (
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-2">
            <div>
                {/* Welcome line */}
                <h1 className={cn(
                    "text-2xl lg:text-4xl font-black text-white uppercase mb-2",
                    !isArabic && "tracking-tighter"
                )}>
                    Welcome back, <span className="text-primary">{learner.first_name}</span>
                </h1>

                {/* Context strip */}
                <div className={cn(
                    "flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-mono text-muted-foreground uppercase",
                    !isArabic && "tracking-[0.12em]"
                )}>
                    <span>
                        Path: <span className="text-white/70">{path.path_display_name}</span>
                    </span>
                    <span className="text-white/10">·</span>
                    <span>
                        Stage: <span className="text-white/70">{stage.current_stage_title}</span>
                    </span>
                    <span className="text-white/10">·</span>
                    <span>
                        Goal: <span className="text-white/70">{goalLabel}</span>
                    </span>
                </div>
            </div>

            {/* Status badge */}
            <div className={cn(
                "text-[10px] font-mono uppercase font-bold px-3 py-1.5 border shrink-0 self-start",
                badgeColor,
                !isArabic && "tracking-widest"
            )}>
                {badgeLabel}
            </div>
        </div>
    );
}
