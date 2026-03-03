'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Crosshair, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from '@/lib/i18n/routing';
import { Button } from '@/components/ui/button';
import type { DashboardMission } from '../types';

interface MissionCardProps {
    mission: DashboardMission;
    estimatedTime?: number | null;
}

export function MissionCard({ mission, estimatedTime }: MissionCardProps) {
    const locale = useLocale();
    const isArabic = locale === 'ar';
    const t = useTranslations('Dashboard.Widgets');

    return (
        <div className="relative border border-primary/30 bg-gradient-to-br from-primary/10 via-transparent to-transparent p-8 lg:p-10 mb-8 overflow-hidden group">
            {/* Background crosshair accent */}
            <div className="absolute top-4 right-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Crosshair className="w-32 h-32 text-primary" />
            </div>

            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-12 h-12 border-l-2 border-t-2 border-primary/40" />
            <div className="absolute bottom-0 right-0 w-12 h-12 border-r-2 border-b-2 border-primary/40" />

            <div className="relative z-10">
                {/* Mission label */}
                <div className="flex items-center gap-2 mb-6">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_var(--primary)]" />
                    <span className={cn(
                        "text-[9px] font-mono text-primary uppercase font-bold",
                        !isArabic && "tracking-[0.4em]"
                    )}>
                        {t('todayMission')}
                    </span>
                </div>

                {/* Title */}
                <h2 className={cn(
                    "text-2xl lg:text-3xl font-black text-white uppercase mb-3",
                    !isArabic && "tracking-tight"
                )}>
                    {mission.title}
                </h2>

                {/* Description */}
                <p className="text-muted-foreground text-sm lg:text-base mb-2 max-w-2xl leading-relaxed">
                    {mission.description}
                </p>

                {/* Estimated time */}
                {estimatedTime && (
                    <p className={cn(
                        "text-[10px] font-mono text-primary/60 uppercase mb-6",
                        !isArabic && "tracking-widest"
                    )}>
                        {t('estMin', { time: estimatedTime })}
                    </p>
                )}

                {!estimatedTime && <div className="mb-6" />}

                {/* CTA */}
                <Link href={mission.cta_target}>
                    <Button
                        size="lg"
                        className={cn(
                            "h-12 px-10 rounded-none uppercase font-mono text-xs font-bold gap-3 group/btn",
                            !isArabic && "tracking-[0.2em]"
                        )}
                    >
                        {mission.cta_label}
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform rtl:rotate-180" />
                    </Button>
                </Link>
            </div>
        </div>
    );
}
