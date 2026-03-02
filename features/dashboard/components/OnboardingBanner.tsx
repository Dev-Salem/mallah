'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { Sparkles, X, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from '@/lib/i18n/routing';
import { Button } from '@/components/ui/button';
import type { OnboardingBanner as BannerData } from '../types';

interface OnboardingBannerProps {
    banner: BannerData;
    pathDisplayName: string;
}

const DISMISS_KEY = 'mallah_onboarding_banner_dismissed';

export function OnboardingBanner({ banner, pathDisplayName }: OnboardingBannerProps) {
    const locale = useLocale();
    const isArabic = locale === 'ar';
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setDismissed(localStorage.getItem(DISMISS_KEY) === 'true');
        }
    }, []);

    if (!banner.show || dismissed) return null;

    const handleDismiss = () => {
        localStorage.setItem(DISMISS_KEY, 'true');
        setDismissed(true);
    };

    return (
        <div className="relative border border-primary/20 bg-primary/5 p-6 lg:p-8 mb-8 overflow-hidden group">
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-primary/30" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-primary/30" />

            {/* Dismiss button */}
            <button
                onClick={handleDismiss}
                className="absolute top-3 right-3 p-1.5 text-muted-foreground/40 hover:text-white transition-colors"
                aria-label="Dismiss banner"
            >
                <X className="w-4 h-4" />
            </button>

            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className={cn(
                        "text-[10px] font-mono text-primary uppercase font-bold",
                        !isArabic && "tracking-[0.3em]"
                    )}>
                        Here&apos;s your learning path
                    </span>
                </div>

                {/* Match score */}
                <div className="mb-4">
                    <span className="text-2xl font-black text-white">{banner.match_score}%</span>
                    <span className={cn(
                        "text-sm text-muted-foreground ms-2",
                        !isArabic && "tracking-wide"
                    )}>
                        match for {pathDisplayName}
                    </span>
                </div>

                {/* Reasons */}
                {banner.match_reasons.length > 0 && (
                    <ul className="space-y-2 mb-6">
                        {banner.match_reasons.map((reason, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <div className="w-1 h-1 rounded-full bg-primary mt-2 shrink-0" />
                                {reason}
                            </li>
                        ))}
                    </ul>
                )}

                {/* CTA */}
                <Link href="/dashboard/roadmap">
                    <Button className={cn(
                        "h-11 px-8 rounded-none uppercase font-mono text-[11px] font-bold gap-2 group/btn",
                        !isArabic && "tracking-[0.15em]"
                    )}>
                        Start My First Lesson
                        <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform rtl:rotate-180" />
                    </Button>
                </Link>
            </div>
        </div>
    );
}
