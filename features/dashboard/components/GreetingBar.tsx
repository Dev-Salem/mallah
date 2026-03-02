'use client';

import { useLocale } from 'next-intl';
import { Terminal as TerminalIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GOAL_LABELS } from '../types';
import type { DashboardSummary } from '../types';

interface GreetingBarProps {
    learner: DashboardSummary['learner'];
    path: DashboardSummary['path'];
    stage: DashboardSummary['stage'];
}

export function GreetingBar({ learner, path, stage }: GreetingBarProps) {
    const locale = useLocale();
    const isArabic = locale === 'ar';
    const goalLabel = learner.primary_goal ? GOAL_LABELS[learner.primary_goal] ?? learner.primary_goal : '—';

    return (
        <div className="mb-10">
            {/* Welcome line */}
            <h1 className={cn(
                "text-3xl lg:text-5xl font-black text-white uppercase mb-3",
                !isArabic && "tracking-tighter"
            )}>
                Welcome back, <span className="text-primary">{learner.first_name}</span>
            </h1>

            {/* Context strip */}
            <div className={cn(
                "flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] font-mono text-muted-foreground uppercase",
                !isArabic && "tracking-[0.15em]"
            )}>
                <span className="flex items-center gap-2">
                    <TerminalIcon className="h-3 w-3 text-primary/40" />
                    Path: <span className="text-white/80">{path.path_display_name}</span>
                </span>
                <span className="text-white/10">·</span>
                <span>
                    Stage: <span className="text-white/80">{stage.current_stage_title}</span>
                </span>
                <span className="text-white/10">·</span>
                <span>
                    Goal: <span className="text-white/80">{goalLabel}</span>
                </span>
            </div>
        </div>
    );
}
