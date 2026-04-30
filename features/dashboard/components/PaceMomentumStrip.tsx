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
            case 'Ahead': return 'bg-success/15 text-success border-success/30';
            case 'On Track': return 'bg-info/15 text-info border-info/30';
            case 'Behind': return 'bg-warning/15 text-warning border-warning/30';
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
        <div className="border border-primary/20 bg-primary/5 p-4 space-y-5">
            {/* Streak Counter */}
        <div className="flex items-center gap-3">
                <div className="relative">
                    <Flame className={cn(
                        "w-8 h-8 shrink-0 transition-all duration-300",
                        isStreakActive 
                            ? "text-orange-500 drop-shadow-[0_0_12px_rgba(249,115,22,0.8)] animate-pulse scale-110" 
                            : "text-muted-foreground/30 border-orange-500/10"
                    )} />
                    {!isStreakActive && (
                        <Flame className="w-8 h-8 absolute inset-0 text-orange-500/5 blur-[1px]" />
                    )}
                    {isStreakActive && (
                        <div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full animate-pulse" />
                    )}
                </div>
                <div>
                    {isStreakActive ? (
                        <div className="flex flex-col">
                            <span className={cn(
                                "text-2xl font-black text-foreground leading-none",
                                !isArabic && "tracking-tighter"
                            )}>
                                {pace.streak_days}
                            </span>
                            <span className={cn(
                                "text-xs font-mono text-primary uppercase font-bold",
                                !isArabic && "tracking-widest"
                            )}>
                                Day Streak Active
                            </span>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            <span className={cn(
                                "text-sm font-bold text-muted-foreground/80",
                                !isArabic && "tracking-tight"
                            )}>
                                {isArabic ? "ابدأ سلسلة نشاطك" : "Start your streak"}
                            </span>
                            <span className={cn(
                                "text-xs font-mono text-muted-foreground/60 uppercase font-bold",
                                !isArabic && "tracking-wider"
                            )}>
                                {isArabic ? "لا يوجد نشاط مسجل اليوم" : "Ready for action"}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Weekly Sessions */}
            <div>
                <div className={cn(
                    "text-xs font-mono text-foreground uppercase mb-3 font-bold",
                    !isArabic && "tracking-[0.15em]"
                )}>
                    Weekly Progress
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
                                        : "bg-muted/20 border border-muted"
                                )} />
                                <span className="text-[10px] font-mono text-muted-foreground uppercase">
                                    {label}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Session count */}
                <div className="text-sm text-foreground font-medium mt-2">
                    {pace.sessions_this_week} of {pace.target_sessions_per_week} sessions completed
                </div>
            </div>

            {/* Pace Badge */}
            <div className="flex items-center gap-2">
                <Target className="w-3.5 h-3.5 text-muted-foreground" />
                <span className={cn(
                    "text-xs font-mono uppercase font-bold px-2.5 py-1 border",
                    paceColor,
                    !isArabic && "tracking-widest"
                )}>
                    {paceLabel}
                </span>
            </div>
        </div>
    );
}
