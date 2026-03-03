'use client';

import { useLocale, useTranslations } from 'next-intl';
import { FastForward, Play, ScanSearch } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DashboardLearner } from '../types';

interface ForecastLineProps {
    velocity: DashboardLearner['learning_velocity'];
    completionPercent: number;
}

export function ForecastLine({ velocity, completionPercent }: ForecastLineProps) {
    const locale = useLocale();
    const isArabic = locale === 'ar';
    const t = useTranslations('Dashboard.Widgets.Forecast');

    const Icon = velocity === 'fast' ? FastForward : velocity === 'normal' ? Play : ScanSearch;
    const velocityKey = velocity || 'normal';

    return (
        <div className="border border-white/10 p-6 mb-8 bg-[#0a0f12] relative overflow-hidden">
            {/* Grid pattern background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:12px_12px] opacity-30" />

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-primary/60" />
                        <span className={cn(
                            "text-[10px] font-mono text-primary/60 uppercase font-bold",
                            !isArabic && "tracking-[0.2em]"
                        )}>
                            {t('label')}
                        </span>
                    </div>

                    <div className={cn(
                        "text-[10px] font-mono text-muted-foreground uppercase border border-white/10 px-3 py-1 bg-black/40",
                        !isArabic && "tracking-widest"
                    )}>
                        {t('velocity', { velocity: t(`velocityModes.${velocityKey}`) })}
                    </div>
                </div>

                {/* The Forecast Segment Line */}
                <div className="relative h-2 w-full bg-white/5 border border-white/10 overflow-hidden mb-3">
                    <div
                        className="absolute top-0 left-0 h-full bg-primary transition-all duration-1000 ease-out rtl:right-0 rtl:left-auto"
                        style={{ width: `${Math.max(completionPercent, 2)}%` }} // Minimum 2% to show the bar
                    />

                    {/* Simulated pulse for projection */}
                    <div
                        className="absolute top-0 h-full w-20 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse delay-500 duration-2000 rtl:right-0 rtl:left-auto"
                        style={{ left: `${completionPercent}%` }}
                    />
                </div>

                <div className="flex justify-between items-center text-[9px] font-mono text-muted-foreground uppercase">
                    <span className={cn(!isArabic && "tracking-widest")}>Start</span>
                    <span className={cn(!isArabic && "tracking-[0.3em]")}>{completionPercent}%</span>
                    <span className={cn(!isArabic && "tracking-widest")}>Destination</span>
                </div>
            </div>
        </div>
    );
}
