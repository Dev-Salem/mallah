'use client';

import { useTranslations } from 'next-intl';

export function FeedHeader({ pathName }: { pathName: string }) {
    const t = useTranslations('Dashboard.Opportunities.jobFeed');
    
    return (
        <div className="flex items-center justify-between mb-6 px-1 py-2 border-y border-primary/10 bg-primary/5">
            <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-primary pulse-dot" />
                <span className="text-[10px] font-mono tracking-widest text-primary/80 uppercase">
                    {t('status.activePath', { pathName })}
                </span>
            </div>
            <div className="text-[10px] font-mono tracking-widest text-primary/60 uppercase">
                {t('status.refresh')}
            </div>
        </div>
    );
}
