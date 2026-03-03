'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Activity, Flame, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DashboardPace } from '../types';

interface PaceMomentumStripProps {
    pace: DashboardPace;
}

export function PaceMomentumStrip({ pace }: PaceMomentumStripProps) {
    const locale = useLocale();
    const isArabic = locale === 'ar';
    const t = useTranslations('Dashboard.Widgets.Pace');

    return (
        <div className="border border-white/10 bg-black/40 p-4 mb-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary/60" />
                <span className={cn(
                    "text-[10px] font-mono text-primary/60 uppercase font-bold",
                    !isArabic && "tracking-[0.2em]"
                )}>
                    {t('label')}
                </span>
            </div>

            <div className="flex items-center gap-6 divide-x divide-white/10 rtl:divide-x-reverse">
                {/* Streak */}
                <div className="flex items-center gap-3 px-4">
                    <div className={cn(
                        "p-2 rounded-full",
                        pace.streak_days > 0 ? "bg-orange-500/10 text-orange-400" : "bg-white/5 text-muted-foreground"
                    )}>
                        <Flame className="w-4 h-4" />
                    </div>
                    <div>
                        <div className={cn(
                            "text-xs font-mono uppercase",
                            pace.streak_days > 0 ? "text-orange-400 font-bold" : "text-muted-foreground",
                            !isArabic && "tracking-wide"
                        )}>
                            {t('streak', { days: pace.streak_days })}
                        </div>
                    </div>
                </div>

                {/* Sessions */}
                <div className="flex items-center gap-3 px-4">
                    <div className="p-2 rounded-full bg-blue-500/10 text-blue-400">
                        <Target className="w-4 h-4" />
                    </div>
                    <div>
                        <div className={cn(
                            "text-xs font-mono uppercase text-blue-400 font-bold",
                            !isArabic && "tracking-wide"
                        )}>
                            {t('sessions', { count: pace.sessions_this_week, target: pace.target_sessions_per_week })}
                        </div>
                    </div>
                </div>

                {/* Status */}
                <div className="px-4">
                    <div className={cn(
                        "text-xs font-mono uppercase px-3 py-1 rounded-full border",
                        pace.pace_status === "ahead" && "bg-green-500/10 border-green-500/30 text-green-400",
                        pace.pace_status === "on_track" && "bg-primary/10 border-primary/30 text-primary",
                        pace.pace_status === "slightly_behind" && "bg-amber-500/10 border-amber-500/30 text-amber-400",
                        pace.pace_status === "behind" && "bg-red-500/10 border-red-500/30 text-red-400",
                        !isArabic && "tracking-widest"
                    )}>
                        {t(`status.${pace.pace_status}`)}
                    </div>
                </div>
            </div>
        </div>
    );
}
