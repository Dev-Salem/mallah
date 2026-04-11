'use client';

import { useTheme } from 'next-themes';
import { useTranslations, useLocale } from 'next-intl';
import { Monitor, Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export function AppearanceSection() {
    const { theme, setTheme } = useTheme();
    const t = useTranslations('Settings.Appearance');
    const locale = useLocale();
    const isArabic = locale === 'ar';
    const [mounted, setMounted] = useState(false);

    // Avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const options = [
        { id: 'system', icon: Monitor, label: t('system') },
        { id: 'light', icon: Sun, label: t('light') },
        { id: 'dark', icon: Moon, label: t('dark') },
    ];

    return (
        <div className="border border-border bg-card p-6 lg:p-8 space-y-8">
            <div className="flex items-center gap-3">
                <Sun className="w-4 h-4 text-primary" />
                <h2 className={cn(
                    "text-sm font-bold text-foreground uppercase tracking-[0.15em]",
                    isArabic && "tracking-normal font-bold"
                )}>
                    {t('title')}
                </h2>
            </div>

            <div className="space-y-6">
                <p className="text-xs text-muted-foreground font-mono leading-relaxed max-w-md">
                    {t('subtitle')}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {options.map((opt) => {
                        const Icon = opt.icon;
                        const active = theme === opt.id;

                        return (
                            <button
                                key={opt.id}
                                onClick={() => setTheme(opt.id)}
                                className={cn(
                                    "relative flex flex-col items-center gap-4 p-6 border transition-all duration-300 group",
                                    active 
                                        ? "border-primary bg-primary/5 shadow-[0_0_15px_rgba(var(--primary),0.1)]" 
                                        : "border-border hover:border-border/80 bg-background/50"
                                )}
                            >
                                {/* Corner Accents (Tactical Look) */}
                                {active && (
                                    <>
                                        <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-primary" />
                                        <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-primary" />
                                        <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-primary" />
                                        <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-primary" />
                                    </>
                                )}

                                <div className={cn(
                                    "p-3 rounded-full transition-colors",
                                    active ? "text-primary bg-primary/10" : "text-muted-foreground bg-muted group-hover:bg-muted/80"
                                )}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                
                                <span className={cn(
                                    "text-[10px] font-mono uppercase tracking-widest",
                                    active ? "text-primary font-bold" : "text-muted-foreground"
                                )}>
                                    {opt.label}
                                </span>

                                {active && (
                                    <div className="absolute top-2 right-2">
                                        <div className="w-1 h-1 bg-primary rounded-full animate-pulse" />
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
