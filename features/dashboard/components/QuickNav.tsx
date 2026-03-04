'use client';

import { useLocale } from 'next-intl';
import { Map, Layers, FileText, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from '@/lib/i18n/routing';
import type { DashboardReadiness } from '../types';

interface QuickNavProps {
    readiness: DashboardReadiness;
}

export function QuickNav({ readiness }: QuickNavProps) {
    const locale = useLocale();
    const isArabic = locale === 'ar';
    const showResumeDot = readiness.resume_status === 'not_created' && readiness.unlocked_skills_count >= 5;

    const links = [
        { label: 'View Full Roadmap', icon: Map, href: '/dashboard/roadmap', dot: false },
        { label: 'Portfolio Hub', icon: Layers, href: '/dashboard/skills', dot: false },
        { label: 'Resume Builder', icon: FileText, href: '/dashboard/resume', dot: showResumeDot },
        { label: 'Opportunity Analyzer', icon: Briefcase, href: '/dashboard/opportunities', dot: false },
    ];

    return (
        <div>
            {/* Label */}
            <div className={cn(
                "text-[9px] font-mono text-muted-foreground/30 uppercase mb-3",
                !isArabic && "tracking-[0.2em]"
            )}>
                Quick Navigation
            </div>

            {/* Links */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                {links.map((link) => (
                    <Link
                        key={link.label}
                        href={link.href}
                        className="group flex items-center gap-2 px-3 py-2.5 text-muted-foreground/50 hover:text-white hover:bg-white/5 transition-all duration-200 border border-transparent hover:border-white/10"
                    >
                        <link.icon className="w-4 h-4 shrink-0 group-hover:text-primary transition-colors" />
                        <span className={cn(
                            "text-[10px] font-mono uppercase truncate",
                            !isArabic && "tracking-wide"
                        )}>
                            {link.label}
                        </span>
                        {link.dot && (
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                        )}
                    </Link>
                ))}
            </div>
        </div>
    );
}
