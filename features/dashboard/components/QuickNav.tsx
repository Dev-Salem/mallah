'use client';

import { useLocale } from 'next-intl';
import { cn } from '@/lib/utils';
import { Link } from '@/lib/i18n/routing';

export function QuickNav() {
    const locale = useLocale();
    const isArabic = locale === 'ar';

    const links = [
        { label: 'View Full Roadmap', href: '/dashboard/roadmap' },
        { label: 'Portfolio Hub', href: '/dashboard/skills' },
        { label: 'Resume Builder', href: '/dashboard/resume' },
        { label: 'Analyze Job Opportunity', href: '/dashboard/opportunities' },
    ];

    return (
        <div className="border-t border-white/5 pt-6 mt-2">
            <span className={cn(
                "text-[9px] font-mono text-muted-foreground/30 uppercase font-bold block mb-3",
                !isArabic && "tracking-[0.3em]"
            )}>
                Quick Navigation
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
