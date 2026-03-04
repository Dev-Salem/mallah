'use client';

import { useLocale } from 'next-intl';
import { TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DashboardSummary } from '../types';

interface ProgressZoneProps {
    path: DashboardSummary['path'];
    stage: DashboardSummary['stage'];
    topics: DashboardSummary['topics'];
    velocity: DashboardSummary['learner']['learning_velocity'];
}

// Topics per week by velocity
const VELOCITY_TOPICS_PER_WEEK: Record<string, number> = {
    slow: 1.5,
    normal: 3.5,
    fast: 6,
};

export function ProgressZone({ path, stage, topics, velocity }: ProgressZoneProps) {
    const locale = useLocale();
    const isArabic = locale === 'ar';

    // Compute forecast days
    const remaining = topics.remaining_topics_in_stage;
    const topicsPerWeek = velocity ? VELOCITY_TOPICS_PER_WEEK[velocity] ?? 3.5 : null;
    const estimatedDays = topicsPerWeek && remaining > 0
        ? Math.ceil((remaining / topicsPerWeek) * 7)
        : null;

    return (
        <div className="border border-white/10 bg-white/[0.02] p-5 lg:p-6 space-y-5">
            {/* Section header */}
            <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary/40" />
                <span className={cn(
                    "text-[9px] font-mono text-muted-foreground/50 uppercase font-bold",
                    !isArabic && "tracking-[0.2em]"
                )}>
                    Progress
                </span>
            </div>

            {/* Path Progress Bar */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <span className={cn(
                        "text-[10px] font-mono text-white/70 uppercase",
                        !isArabic && "tracking-wide"
                    )}>
                        Path Progress
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground/50">
                        {topics.completed_topics} of {topics.total_mandatory_topics} lessons
                    </span>
                </div>
                <div className="h-2 bg-white/5 overflow-hidden">
                    <div
                        className="h-full bg-primary transition-all duration-1000 ease-out"
                        style={{ width: `${Math.max(path.completion_percent, 1)}%` }}
                    />
                </div>
            </div>

            {/* Stage Progress Bar */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-white/50">
                        {stage.current_stage_title}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground/40">
                        {stage.stage_completed_topics} of {stage.stage_total_topics} topics done
                    </span>
                </div>
                <div className="h-1.5 bg-white/5 overflow-hidden">
                    <div
                        className="h-full bg-primary/60 transition-all duration-1000 ease-out"
                        style={{ width: `${Math.max(stage.stage_completion_percent, 1)}%` }}
                    />
                </div>
            </div>

            {/* Forecast Line */}
            {estimatedDays && estimatedDays > 0 && (
                <p className="text-[10px] text-muted-foreground/40 text-end">
                    At your current pace, you&apos;ll finish this stage in ~{estimatedDays} days.
                </p>
            )}
        </div>
    );
}
