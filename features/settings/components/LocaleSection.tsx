'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Languages, CheckCircle, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { usePathname, useRouter } from '@/lib/i18n/routing';

export function LocaleSection() {
    const locale = useLocale();
    const pathname = usePathname();
    const router = useRouter();
    const isArabic = locale === 'ar';
    const t = useTranslations('Settings');
    const tl = useTranslations('Settings.Language');
    const lt = useTranslations('Settings.LanguageToggle');

    const handleLocaleChange = (newLocale: 'en' | 'ar') => {
        if (newLocale === locale) return;
        router.push(pathname, { locale: newLocale });
    };

    return (
        <div className="border border-border bg-card p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-6">
                <Languages className="w-4 h-4 text-primary" />
                <h2 className={cn(
                    "text-sm font-bold text-foreground uppercase",
                    !isArabic && "tracking-[0.15em]"
                )}>
                    {tl('title')}
                </h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 max-w-lg">
                <button
                    onClick={() => handleLocaleChange('en')}
                    className={cn(
                        "flex items-center justify-between p-4 border transition-all hover:bg-muted/50",
                        locale === 'en' 
                            ? "border-primary bg-primary/5 shadow-[0_0_15px_rgba(var(--primary),0.1)]" 
                            : "border-border bg-background"
                    )}
                >
                    <div className="flex items-center gap-3">
                        <Globe className={cn("w-4 h-4", locale === 'en' ? "text-primary" : "text-muted-foreground")} />
                        <div className="text-left">
                            <p className="text-sm font-bold text-foreground font-mono">{lt('english')}</p>
                        </div>
                    </div>
                    {locale === 'en' && <CheckCircle className="w-4 h-4 text-primary" />}
                </button>

                <button
                    onClick={() => handleLocaleChange('ar')}
                    className={cn(
                        "flex items-center justify-between p-4 border transition-all hover:bg-muted/50",
                        locale === 'ar' 
                            ? "border-primary bg-primary/5 shadow-[0_0_15px_rgba(var(--primary),0.1)]" 
                            : "border-border bg-background"
                    )}
                >
                    <div className="flex items-center gap-3">
                        <Globe className={cn("w-4 h-4", locale === 'ar' ? "text-primary" : "text-muted-foreground")} />
                        <div className={cn(isArabic ? "text-right" : "text-left")}>
                            <p className="text-sm font-bold text-foreground">{lt('arabic')}</p>
                        </div>
                    </div>
                    {locale === 'ar' && <CheckCircle className="w-4 h-4 text-primary" />}
                </button>
            </div>

            <p className="text-[10px] text-muted-foreground mt-4 leading-relaxed font-mono">
                {tl('subtitle')}
            </p>
        </div>
    );
}
