'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Target, ArrowUpRight, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from '@/lib/i18n/routing';
import type { DashboardSummary } from '../types';

interface MarketIntelWidgetProps {
    summary: DashboardSummary;
}

export function MarketIntelWidget({ summary }: MarketIntelWidgetProps) {
    const t = useTranslations('Dashboard.Widgets.MarketIntel');
    const locale = useLocale();
    const isArabic = locale === 'ar';

    // Mock logic for roles based on path
    const pathId = summary.path.path_id || 'frontend';
    const baseMatch = summary.path.completion_percent || 0;

    const rolesByPath: Record<string, string[]> = {
        frontend: ['Junior Frontend Engineer', 'React Developer', 'UI Specialist'],
        fullstack: ['Junior Fullstack Developer', 'Javascript Engineer', 'Web Systems Trainee'],
        cybersecurity: ['Junior Security Analyst', 'SOC Level 1', 'Cyber Defense Technician'],
        datascience: ['Junior Data Analyst', 'Applied ML Associate', 'Data Insights Engineer'],
    };

    const roles = rolesByPath[pathId] || rolesByPath.frontend;

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 px-1 text-muted-foreground/60 uppercase text-[9px] font-mono font-bold tracking-widest">
                // {t('label')} //
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm">
                <div className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                            <Target className="w-3 h-3 text-primary" />
                            {t('targetRoles')}
                        </span>
                        <div className="h-[1px] flex-1 bg-white/5 mx-3" />
                    </div>

                    <div className="space-y-2">
                        {roles.map((role, idx) => {
                            // Variance in match score for realism
                            // We use idx to stagger the match scores slightly
                            const match = Math.min(98, Math.max(12, baseMatch + (idx * -8)));
                            return (
                                <div key={role} className="group relative flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all cursor-default">
                                    <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                                        <span className="text-[11px] font-bold text-white/80 group-hover:text-white transition-colors truncate">
                                            {role}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-primary/60 group-hover:bg-primary transition-all duration-500"
                                                    style={{ width: `${match}%` }}
                                                />
                                            </div>
                                            <span className="text-[8px] font-mono text-muted-foreground uppercase whitespace-nowrap">
                                                {t('matchScore', { score: Math.round(match) })}
                                            </span>
                                        </div>
                                    </div>
                                    <ArrowUpRight className="w-3 h-3 text-muted-foreground/30 group-hover:text-primary transition-all transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ml-2" />
                                </div>
                            );
                        })}
                    </div>

                    <Link
                        href="/dashboard/opportunities"
                        className="flex items-center justify-center gap-2 w-full py-2 text-[10px] font-mono font-bold uppercase text-muted-foreground hover:text-primary hover:bg-white/5 border border-white/5 hover:border-primary/20 rounded-lg transition-all"
                    >
                        <TrendingUp className="w-3.5 h-3.5" />
                        {t('viewAll')}
                    </Link>
                </div>
            </div>
        </div>
    );
}
