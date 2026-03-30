'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { LogOut, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { signOutAction } from '@/features/auth/actions/auth-actions';

export function LogoutSection() {
    const locale = useLocale();
    const isArabic = locale === 'ar';
    const [loggingOut, setLoggingOut] = useState(false);

    const handleLogout = async () => {
        setLoggingOut(true);
        await signOutAction();
    };

    return (
        <div className="border border-white/10 bg-white/[0.02] p-6 lg:p-8 mt-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <LogOut className="w-4 h-4 text-primary" />
                        <h2 className={cn("text-sm font-bold text-white uppercase", !isArabic && "tracking-[0.15em]")}>
                            Session
                        </h2>
                    </div>
                    <p className="text-[10px] text-muted-foreground/60 leading-relaxed max-w-md">
                        Sign out of your account on this device.
                    </p>
                </div>
                <Button variant="outline" onClick={handleLogout} disabled={loggingOut}
                    className={cn("h-9 px-5 rounded-none border-white/20 text-white hover:bg-white/10 hover:border-white/30 uppercase font-mono text-[10px] gap-2 shrink-0", !isArabic && "tracking-[0.1em]")}
                >
                    {loggingOut ? <Loader2 className="w-3 h-3 animate-spin" /> : <LogOut className="w-3 h-3" />} 
                    Sign Out
                </Button>
            </div>
        </div>
    );
}
