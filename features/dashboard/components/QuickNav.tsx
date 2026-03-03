'use client';

import { useLocale, useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { Link } from '@/lib/i18n/routing';

export function QuickNav() {
    const locale = useLocale();
    const isArabic = locale === 'ar';
    const t = useTranslations('Dashboard.Widgets.QuickNav');

    const links = [
        { label: t('viewRoadmap'), href: '/dashboard/roadmap' },
        { label: t('portfolioHub'), href: '/dashboard/skills' },
        { label: t('resumeBuilder'), href: '/dashboard/resume' },
        { label: t('analyzeJob'), href: '/dashboard/opportunities' },
    ];

    return (
        <div className="border-t border-white/5 pt-6 mt-2">
            <span className={cn(
                "text-[9px] font-mono text-muted-foreground/30 uppercase font-bold block mb-3",
                !isArabic && "tracking-[0.3em]"
            )}>
                {t('label')}
            </span>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
                {links.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                            "text-xs text-muted-foreground hover:text-primary transition-colors font-mono uppercase",
                            !isArabic && "tracking-wide"
                        )}
                    >
                        {link.label}
                    </Link>
                ))}
            </div>
        </div>
    );
}
