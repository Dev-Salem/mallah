'use client';

import { useLocale } from 'next-intl';
import { Radar, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from '@/lib/i18n/routing';
import { Button } from '@/components/ui/button';
import type { OpportunityAnalyzer } from '../types';

interface OpportunityPromptProps {
    analyzer: OpportunityAnalyzer;
}

export function OpportunityPrompt({ analyzer }: OpportunityPromptProps) {
    const locale = useLocale();
    const isArabic = locale === 'ar';

    if (!analyzer.show_prompt) return null;

    const subtext = analyzer.analyses_count > 0
        ? `You've analyzed ${analyzer.analyses_count} job posting(s). Run another to track how your skills have grown.`
        : "Paste a job description and we'll show you exactly which skills you have and which you still need.";

    return (
        <div className="border border-white/10 bg-white/[0.02] p-6 mb-6 relative overflow-hidden group hover:border-white/15 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Radar className="w-4 h-4 text-primary/60" />
                        <span className={cn(
                            "text-[10px] font-mono text-primary/60 uppercase font-bold",
                            !isArabic && "tracking-[0.2em]"
                        )}>
                            Opportunity Analyzer
                        </span>
                    </div>
                    <h3 className={cn(
                        "text-sm font-bold text-white uppercase mb-1",
                        !isArabic && "tracking-wide"
                    )}>
                        See how ready you are for a real job
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed max-w-lg">
                        {subtext}
                    </p>
                </div>

                <Link href="/dashboard/opportunities" className="shrink-0">
                    <Button
                        variant="outline"
                        className={cn(
                            "h-9 px-5 rounded-none border-white/10 hover:bg-primary/10 hover:border-primary/20 text-[10px] font-mono uppercase gap-2 group/btn",
                            !isArabic && "tracking-[0.15em]"
                        )}
                    >
                        Analyze a Job Posting
                        <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform rtl:rotate-180" />
                    </Button>
                </Link>
            </div>
        </div>
    );
}
