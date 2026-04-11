'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { LogOut, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { signOutAction } from '@/features/auth/actions/auth-actions';

export function LogoutSection() {
    const locale = useLocale();
    const isArabic = locale === 'ar';
    const t = useTranslations('Settings.Session');
    const [loggingOut, setLoggingOut] = useState(false);

    const handleLogout = async () => {
        setLoggingOut(true);
        await signOutAction();
    };

    return (
        <div className="border border-border bg-card p-6 lg:p-8 mt-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <LogOut className="w-4 h-4 text-primary" />
                        <h2 className={cn("text-sm font-bold text-foreground uppercase", !isArabic && "tracking-[0.15em]")}>
                            {t('title')}
                        </h2>
                    </div>
                    <p className="text-[10px] text-muted-foreground/60 leading-relaxed max-w-md">
                        {t('signOutDesc')}
                    </p>
                </div>
                <Button variant="outline" onClick={handleLogout} disabled={loggingOut}
                    className={cn("h-9 px-5 rounded-none border-border text-foreground hover:bg-muted uppercase font-mono text-[10px] gap-2 shrink-0", !isArabic && "tracking-[0.1em]")}
                >
                    {loggingOut ? <Loader2 className="w-3 h-3 animate-spin" /> : <LogOut className="w-3 h-3" />} 
                    {t('signOut')}
                </Button>
            </div>
        </div>
    );
}
