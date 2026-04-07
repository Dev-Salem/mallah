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
        <div className="grid grid-cols-1 gap-3">
            {tiles.map((tile) => (
                <Link
                    key={tile.label}
                    href={tile.href}
                    className={cn(
                        "block relative border p-4 transition-all duration-300 group bg-dashboard-card-bg shadow-sm hover:shadow-md hover:border-primary/20",
                        tile.warning
                            ? "border-amber-500/30 bg-amber-500/5 border-s-4 border-s-amber-500"
                            : "border-primary/10"
                    )}
                >
                    <div className="flex items-center gap-4">
                        <div className={cn(
                            "w-10 h-10 shrink-0 flex items-center justify-center border transition-colors",
                            tile.warning 
                                ? "bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400" 
                                : "bg-primary/5 border-primary/10 text-primary"
                        )}>
                            <tile.icon className="w-5 h-5" />
                        </div>

                        <div className="min-w-0 flex-1">
                            {/* Label */}
                            <div className={cn(
                                "text-[9px] font-mono text-muted-foreground uppercase mb-1 font-bold",
                                !isArabic && "tracking-[0.15em]"
                            )}>
                                {tile.label}
                            </div>

                            {/* Value */}
                            <div className={cn(
                                "text-lg font-black text-foreground uppercase mb-0.5",
                                !isArabic && "tracking-tighter"
                            )}>
                                {tile.value}
                            </div>

                            {/* Sub-label */}
                            <div className="text-[10px] text-muted-foreground font-medium leading-relaxed opacity-80">
                                {tile.subLabel}
                            </div>
                        </div>
                    </div>

                    {/* Hover indicator */}
                    <div className="absolute bottom-0 start-0 w-0 h-1 bg-primary group-hover:w-full transition-all duration-500" />
                </Link>
            ))}
        </div>
    );
}
