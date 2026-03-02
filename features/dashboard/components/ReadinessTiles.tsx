'use client';

import { useLocale } from 'next-intl';
import { Cpu, FolderKanban, FileText, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from '@/lib/i18n/routing';
import type { DashboardReadiness } from '../types';

interface ReadinessTilesProps {
    readiness: DashboardReadiness;
}

export function ReadinessTiles({ readiness }: ReadinessTilesProps) {
    const locale = useLocale();
    const isArabic = locale === 'ar';

    const resumeDisplay = (() => {
        if (readiness.ats_score !== null) return `ATS: ${readiness.ats_score}/100`;
        switch (readiness.resume_status) {
            case 'in_progress': return 'In Progress';
            case 'ready': return 'Ready';
            default: return 'Not Started';
        }
    })();

    const portfolioDisplay = readiness.portfolio_has_public_items ? 'Live' : 'Not Public';

    const tiles = [
        {
            label: 'Skills Unlocked',
            value: String(readiness.unlocked_skills_count),
            icon: Cpu,
            href: '/dashboard/skills',
            warning: false,
        },
        {
            label: 'Projects Completed',
            value: String(readiness.completed_projects_count),
            icon: FolderKanban,
            href: '/dashboard/skills',
            warning: readiness.completed_projects_count === 0,
        },
        {
            label: 'Resume',
            value: resumeDisplay,
            icon: FileText,
            href: '/dashboard/resume',
            warning: readiness.resume_status === 'not_created',
        },
        {
            label: 'Portfolio',
            value: portfolioDisplay,
            icon: Globe,
            href: readiness.portfolio_has_public_items && readiness.portfolio_slug
                ? `/portfolio/${readiness.portfolio_slug}`
                : '/dashboard/skills',
            warning: !readiness.portfolio_has_public_items,
            external: readiness.portfolio_has_public_items,
        },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {tiles.map((tile) => (
                <Link
                    key={tile.label}
                    href={tile.href}
                    className={cn(
                        "relative border p-5 transition-all duration-300 group hover:bg-white/5",
                        tile.warning
                            ? "border-amber-500/20 bg-amber-500/5"
                            : "border-white/10 bg-white/[0.02]"
                    )}
                >
                    {/* Icon */}
                    <tile.icon className={cn(
                        "w-4 h-4 mb-3 transition-colors",
                        tile.warning ? "text-amber-500/60" : "text-primary/40 group-hover:text-primary"
                    )} />

                    {/* Value */}
                    <div className={cn(
                        "text-lg font-black text-white uppercase mb-1",
                        !isArabic && "tracking-tight"
                    )}>
                        {tile.value}
                    </div>

                    {/* Label */}
                    <div className={cn(
                        "text-[9px] font-mono text-muted-foreground/60 uppercase",
                        !isArabic && "tracking-[0.2em]"
                    )}>
                        {tile.label}
                    </div>

                    {/* Hover indicator */}
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-500" />
                </Link>
            ))}
        </div>
    );
}
