'use client';

import { useLocale } from 'next-intl';
import { Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIMicroCoachProps {
    tip: string | null;
}

export function AIMicroCoach({ tip }: AIMicroCoachProps) {
    const locale = useLocale();
    const isArabic = locale === 'ar';

    if (!tip) return null;

    return (
        <div className="flex items-start gap-3 px-4 py-3 bg-primary/5 border-s-2 border-primary/20">
            <Lightbulb className="w-4 h-4 text-primary/50 shrink-0 mt-0.5" />
            <p className={cn(
                "text-xs text-muted-foreground leading-relaxed",
                !isArabic && "tracking-wide"
            )}>
                {tip}
            </p>
        </div>
    );
}
