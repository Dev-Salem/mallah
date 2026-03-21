'use client';

import { useLocale } from 'next-intl';
import { Cpu, FolderKanban, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from '@/lib/i18n/routing';
import type { DashboardReadiness } from '../types';

interface ReadinessTilesProps {
    readiness: DashboardReadiness;
}

export function ReadinessTiles({ readiness }: ReadinessTilesProps) {
    const locale = useLocale();
    const isArabic = locale === 'ar';

    // Resume primary value and sub-label
    const resumeValue = (() => {
        if (readiness.ats_score !== null) return `ATS: ${readiness.ats_score}/100`;
        switch (readiness.resume_status) {
            case 'in_progress': return 'In Progress';
            case 'ready': return 'Ready';
            default: return 'Not Started';
        }
    })();

    const resumeSubLabel = (() => {
        if (readiness.ats_score !== null) {
            return readiness.ats_score >= 75 ? 'Great score' : readiness.ats_score >= 50 ? 'Room to improve' : 'Needs work';
        }
        switch (readiness.resume_status) {
            case 'in_progress':
                return readiness.resume_last_updated_days_ago !== null
                    ? `Last updated: ${readiness.resume_last_updated_days_ago} days ago`
                    : 'Keep building it';
            case 'ready': return 'Looking good — keep it updated';
            default: return 'Build yours to apply for jobs';
        }
    })();

    const tiles = [
        {
            label: 'Skills Unlocked',
            value: String(readiness.unlocked_skills_count),
            subLabel: readiness.roadmap_skills_count > 0 || readiness.manual_skills_count > 0
                ? `${readiness.roadmap_skills_count} from roadmap · ${readiness.manual_skills_count} added manually`
                : 'Complete topics to unlock skills',
            icon: Cpu,
            href: '/dashboard/skills',
            warning: false,
        },
        {
            label: 'Projects Completed',
            value: String(readiness.completed_projects_count),
            subLabel: `${readiness.available_projects_count} available to start`,
            icon: FolderKanban,
            href: '/dashboard/skills',
            warning: readiness.completed_projects_count === 0,
        },
        {
            label: 'Resume',
            value: resumeValue,
            subLabel: resumeSubLabel,
            icon: FileText,
            href: '/dashboard/resume-builder',
            warning: false,
        },
    ];

    return (
        <div className="space-y-3">
            {tiles.map((tile) => (
                <Link
                    key={tile.label}
                    href={tile.href}
                    className={cn(
                        "block relative border p-4 transition-all duration-300 group hover:bg-white/5",
                        tile.warning
                            ? "border-amber-500/20 bg-amber-500/5 border-s-2 border-s-amber-500/40"
                            : "border-white/10 bg-white/[0.02]"
                    )}
                >
                    <div className="flex items-start gap-3">
                        <tile.icon className={cn(
                            "w-4 h-4 shrink-0 mt-0.5 transition-colors",
                            tile.warning ? "text-amber-500/60" : "text-primary/40 group-hover:text-primary"
                        )} />

                        <div className="min-w-0 flex-1">
                            {/* Label */}
                            <div className={cn(
                                "text-[9px] font-mono text-muted-foreground/50 uppercase mb-1",
                                !isArabic && "tracking-[0.15em]"
                            )}>
                                {tile.label}
                            </div>

                            {/* Value */}
                            <div className={cn(
                                "text-base font-black text-white uppercase mb-0.5",
                                !isArabic && "tracking-tight"
                            )}>
                                {tile.value}
                            </div>

                            {/* Sub-label */}
                            <div className="text-[10px] text-muted-foreground/40 leading-relaxed">
                                {tile.subLabel}
                            </div>
                        </div>
                    </div>

                    {/* Hover indicator */}
                    <div className="absolute bottom-0 start-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-500" />
                </Link>
            ))}
        </div>
    );
}
