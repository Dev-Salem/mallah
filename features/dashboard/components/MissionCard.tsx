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
        <div className="relative border border-primary/30 bg-gradient-to-br from-primary/10 via-transparent to-transparent p-6 lg:p-8 overflow-hidden group">
            {/* Background accent */}
            <div className="absolute top-4 end-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Crosshair className="w-24 h-24 text-primary" />
            </div>

            {/* Corner accents */}
            <div className="absolute top-0 start-0 w-10 h-10 border-s-2 border-t-2 border-primary/40" />
            <div className="absolute bottom-0 end-0 w-10 h-10 border-e-2 border-b-2 border-primary/40" />

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
                    "text-xl lg:text-2xl font-black text-foreground uppercase mb-2",
                    !isArabic && "tracking-tight"
                )}>
                    {mission.title}
                </h2>

                {/* Description */}
                <p className="text-muted-foreground text-sm mb-2 max-w-xl leading-relaxed">
                    {mission.description}
                </p>

                {/* Estimated time */}
                {estimatedTime && (
                    <p className={cn(
                        "text-[10px] font-mono text-primary/60 uppercase mb-5",
                        !isArabic && "tracking-widest"
                    )}>
                        Est. {estimatedTime} min
                    </p>
                )}

                {!estimatedTime && <div className="mb-5" />}

                {/* CTA */}
                <Link href={mission.cta_target}>
                    <Button
                        size="lg"
                        className={cn(
                            "h-11 px-8 rounded-none uppercase font-mono text-xs font-bold gap-2 group/btn",
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
                        "text-[10px] font-mono text-muted-foreground/50 uppercase mt-4",
                        !isArabic && "tracking-wide"
                    )}>
                        {mission.context_line}
                    </p>
                )}
            </div>
        </div>
    );
}
