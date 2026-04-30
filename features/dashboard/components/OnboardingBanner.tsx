'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { Sparkles, X, ArrowRight, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from '@/lib/i18n/routing';
import { Button } from '@/components/ui/button';
import type { OnboardingBanner as BannerData } from '../types';

interface OnboardingBannerProps {
    banner: BannerData;
}

const DISMISS_KEY = 'mallah_onboarding_banner_dismissed';

export function OnboardingBanner({ banner }: OnboardingBannerProps) {
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
        <div className="relative border border-primary/20 bg-primary/5 p-5 lg:p-6 overflow-hidden">
            {/* Dismiss button */}
            <button
                onClick={handleDismiss}
                className="absolute top-3 end-3 p-1 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Dismiss banner"
            >
                <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className={cn(
                    "text-xs font-mono text-primary uppercase font-bold",
                    !isArabic && "tracking-[0.2em]"
                )}>
                    Here&apos;s your personalized starter plan
                </span>
            </div>

            {/* 2-week plan checklist */}
            {banner.plan_2_weeks.length > 0 && (
                <ul className="space-y-2 mb-5">
                    {banner.plan_2_weeks.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="w-4 h-4 text-primary/50 mt-0.5 shrink-0" />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            )}

            {/* First milestone */}
            {banner.first_milestone && (
                <p className={cn(
                    "text-xs font-mono text-muted-foreground uppercase mb-5",
                    !isArabic && "tracking-wide"
                )}>
                    First milestone: <span className="text-white/70">{banner.first_milestone}</span>
                </p>
            )}

            {/* CTA */}
            <Link href="/dashboard/roadmap">
                <Button className={cn(
                    "h-10 px-6 rounded-none uppercase font-mono text-xs font-bold gap-2 group/btn",
                    !isArabic && "tracking-[0.15em]"
                )}>
                    Start My First Lesson
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform rtl:rotate-180" />
                </Button>
            </Link>
        </div>
    );
}
