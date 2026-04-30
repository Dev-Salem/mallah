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
        <div className="border border-primary/10 bg-dashboard-card-bg p-5 lg:p-6 space-y-6 shadow-sm">
            {/* Section header */}
            <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className={cn(
                    "text-xs font-mono text-foreground uppercase font-black",
                    !isArabic && "tracking-[0.2em]"
                )}>
                    Performance Analysis
                </span>
            </div>

            {/* Path Progress Bar */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <span className={cn(
                        "text-xs font-mono text-foreground uppercase font-bold",
                        !isArabic && "tracking-wide"
                    )}>
                        Overall Path
                    </span>
                    <span className="text-xs font-mono text-muted-foreground font-bold">
                        {topics.completed_topics} / {topics.total_mandatory_topics} <span className="text-muted-foreground/60">LESSONS</span>
                    </span>
                </div>
                <div className="h-2 bg-muted/30 overflow-hidden border border-primary/5">
                    <div
                        className="h-full bg-primary transition-all duration-1000 ease-out shadow-[0_0_8px_var(--primary)] shadow-primary/20"
                        style={{ width: `${Math.max(path.completion_percent, 1)}%` }}
                    />
                </div>
            </div>

            {/* Stage Progress Bar */}
            <div className="pt-2 border-t border-primary/5">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-muted-foreground uppercase font-bold">
                        Current: <span className="text-foreground">{stage.current_stage_title}</span>
                    </span>
                    <span className="text-xs font-mono text-muted-foreground font-bold">
                        {stage.stage_completed_topics} / {stage.stage_total_topics} topics
                    </span>
                </div>
                <div className="h-1.5 bg-muted/30 overflow-hidden border border-primary/5">
                    <div
                        className="h-full bg-primary/60 transition-all duration-1000 ease-out"
                        style={{ width: `${Math.max(stage.stage_completion_percent, 1)}%` }}
                    />
                </div>
            </div>

            {/* Forecast Line */}
            {estimatedDays && estimatedDays > 0 && (
                <div className="flex items-center gap-2 pt-2 text-xs text-muted-foreground font-bold">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <p>
                        Completion Estimate: <span className="text-foreground font-black">{estimatedDays} days</span> at current velocity.
                    </p>
                </div>
            )}
        </div>
    );
}
