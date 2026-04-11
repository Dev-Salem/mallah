'use client';

import { useTranslations } from 'next-intl';
import { Target } from 'lucide-react';

export function EmptyFeedState() {
    const t = useTranslations('Dashboard.Opportunities.jobFeed.empty');

    return (
        <div className="flex flex-col items-center justify-center p-16 border border-dashed rounded-xl bg-muted/5 border-primary/10 text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Target className="h-6 w-6 text-primary/40" />
            </div>
            <h3 className="text-sm font-mono tracking-[0.2em] uppercase text-primary mb-2">
                {t('title')}
            </h3>
            <p className="text-muted-foreground text-sm max-w-[280px]">
                {t('description')}
            </p>
        </div>
    );
}
