'use client';

import { useLocale } from 'next-intl';
import { Flame, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DashboardPace } from '../types';

interface PaceMomentumStripProps {
    pace: DashboardPace;
}

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export function PaceMomentumStrip({ pace }: PaceMomentumStripProps) {
    const locale = useLocale();
    const isArabic = locale === 'ar';

    const isStreakActive = pace.streak_days > 0;

    // Pace badge styling
    const paceColor = (() => {
        switch (pace.pace_status) {
            case 'Ahead': return 'bg-green-500/15 text-green-400 border-green-500/30';
            case 'On Track': return 'bg-sky-500/15 text-sky-400 border-sky-500/30';
            case 'Behind': return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
        }
    })();

    const paceLabel = (() => {
        switch (pace.pace_status) {
            case 'Ahead': return 'Ahead of pace';
            case 'On Track': return 'On track';
            case 'Behind': return 'Behind pace';
        }
    })();

    return (
        <div className="border border-white/10 bg-white/[0.02] p-4 space-y-5">
            {/* Streak Counter */}
            <div className="flex items-center gap-3">
                <Flame className={cn(
                    "w-7 h-7 shrink-0 transition-colors",
                    isStreakActive ? "text-orange-400" : "text-white/10"
                )} />
                <div>
                    {isStreakActive ? (
                        <>
                            <span className={cn(
                                "text-xl font-black text-white",
                                !isArabic && "tracking-tight"
                            )}>
                                {pace.streak_days}
                            </span>
                            <span className={cn(
                                "text-[10px] font-mono text-muted-foreground/50 uppercase ms-2",
                                !isArabic && "tracking-wide"
                            )}>
                                day streak
                            </span>
                        </>
                    ) : (
                        <span className={cn(
                            "text-xs text-muted-foreground/40",
                            !isArabic && "tracking-wide"
                        )}>
                            Start your streak today
                        </span>
                    )}
                </div>
            </div>

            {/* Weekly Sessions */}
            <div>
                <div className={cn(
                    "text-[9px] font-mono text-muted-foreground/40 uppercase mb-2",
                    !isArabic && "tracking-[0.15em]"
                )}>
                    This week
                </div>

                {/* Day dots */}
                <div className="flex items-center gap-2 mb-1.5">
                    {DAY_LABELS.map((label, index) => {
                        const isActive = pace.active_days_this_week.includes(index);
                        return (
                            <div key={index} className="flex flex-col items-center gap-1">
                                <div className={cn(
                                    "w-4 h-4 rounded-full transition-all duration-500",
                                    isActive
                                        ? "bg-primary shadow-[0_0_6px_var(--primary)]"
                                        : "bg-white/5 border border-white/10"
                                )} />
                                <span className="text-[7px] font-mono text-muted-foreground/30 uppercase">
                                    {label}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Session count */}
                <div className="text-[10px] text-muted-foreground/40">
                    {pace.sessions_this_week} of {pace.target_sessions_per_week} sessions
                </div>
            </div>

            {/* Pace Badge */}
            <div className="flex items-center gap-2">
                <Target className="w-3.5 h-3.5 text-muted-foreground/30" />
                <span className={cn(
                    "text-[10px] font-mono uppercase font-bold px-2.5 py-1 border",
                    paceColor,
                    !isArabic && "tracking-widest"
                )}>
                    {paceLabel}
                </span>
            </div>
        </div>
    );
}
