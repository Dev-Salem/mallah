'use client';

import { useLocale } from 'next-intl';
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

    return (
        <div className="relative border border-primary/20 bg-dashboard-card-bg p-6 lg:p-8 overflow-hidden group shadow-sm transition-all duration-500 hover:shadow-md hover:border-primary/30">
            {/* Background accent */}
            <div className="absolute top-4 end-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Crosshair className="w-24 h-24 text-primary" />
            </div>

            {/* Corner accents */}
            <div className="absolute top-0 start-0 w-10 h-10 border-s-2 border-t-2 border-primary/30" />
            <div className="absolute bottom-0 end-0 w-10 h-10 border-e-2 border-b-2 border-primary/30" />

            <div className="relative z-10">
                {/* Mission label */}
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_var(--primary)]" />
                    <span className={cn(
                        "text-[9px] font-mono text-primary uppercase font-bold",
                        !isArabic && "tracking-[0.3em]"
                    )}>
                        Today&apos;s Mission
                    </span>
                </div>

                {/* Title */}
                <h2 className={cn(
                    "text-xl lg:text-2xl font-black text-foreground uppercase mb-3 leading-tight",
                    !isArabic && "tracking-tight"
                )}>
                    {mission.title}
                </h2>

                {/* Description */}
                <p className="text-muted-foreground text-sm mb-4 max-w-xl leading-relaxed font-medium">
                    {mission.description}
                </p>

                {/* Estimated time - Tactical Pill */}
                {estimatedTime && (
                    <div className={cn(
                        "inline-flex items-center text-[10px] font-mono text-primary uppercase mb-6 px-2 py-0.5 bg-primary/5 border border-primary/10 font-bold",
                        !isArabic && "tracking-widest"
                    )}>
                        Est. {estimatedTime} min
                    </div>
                )}

                {!estimatedTime && <div className="mb-6" />}

                {/* CTA */}
                <Link href={mission.cta_target}>
                    <Button
                        size="lg"
                        className={cn(
                            "h-11 px-10 rounded-none uppercase font-mono text-xs font-black gap-2 group/btn shadow-lg shadow-primary/20",
                            !isArabic && "tracking-[0.15em]"
                        )}
                    >
                        {mission.cta_label}
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform rtl:rotate-180" />
                    </Button>
                </Link>

                {/* Context line */}
                {mission.context_line && (
                    <p className={cn(
                        "text-[10px] font-mono text-muted-foreground uppercase mt-6 opacity-60 font-bold",
                        !isArabic && "tracking-wide"
                    )}>
                        // {mission.context_line} //
                    </p>
                )}
            </div>
        </div>
    );
}
