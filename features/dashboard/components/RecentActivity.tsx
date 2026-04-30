'use client';

import { useLocale } from 'next-intl';
import { Activity, BookCheck, FolderCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { RecentActivityItem } from '../types';

interface RecentActivityProps {
    items: RecentActivityItem[];
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
    topic_completed: BookCheck,
    project_completed: FolderCheck,
    resume_updated: Activity,
    analysis_saved: Activity,
};

function formatTimeAgo(timestamp: string): string {
    const diff = Date.now() - new Date(timestamp).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}

export function RecentActivity({ items }: RecentActivityProps) {
    const locale = useLocale();
    const isArabic = locale === 'ar';

    if (!items || items.length === 0) return null;

    return (
        <div>
            {/* Label */}
            <div className={cn(
                "text-xs font-mono text-foreground uppercase mb-3 font-bold",
                !isArabic && "tracking-[0.2em]"
            )}>
                Recent Activity
            </div>

            {/* Activity list */}
            <div className="space-y-1">
                {items.map((item, i) => {
                    const Icon = ICON_MAP[item.type] || Activity;
                    return (
                        <div
                            key={i}
                            className="flex items-center gap-3 px-3 py-2 text-foreground hover:bg-white/5 transition-colors border-l border-primary/10"
                        >
                            <Icon className="w-3.5 h-3.5 shrink-0 text-primary" />
                            <span className="text-xs font-medium truncate flex-1">{item.title}</span>
                            <span className={cn(
                                "text-[10px] font-mono text-muted-foreground font-bold shrink-0",
                                !isArabic && "tracking-wide"
                            )}>
                                {formatTimeAgo(item.timestamp)}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
