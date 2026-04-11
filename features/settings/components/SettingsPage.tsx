'use client';

import { useLocale, useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import type { ProfileData } from '../types';
import { ProfileSection } from './ProfileSection';
import { SecuritySection } from './SecuritySection';
import { LogoutSection } from './LogoutSection';
import { DangerZoneSection } from './DangerZoneSection';
import { LocaleSection } from './LocaleSection';

interface SettingsPageProps {
    profile: ProfileData;
}

export function SettingsPage({ profile }: SettingsPageProps) {
    const locale = useLocale();
    const isArabic = locale === 'ar';
    const t = useTranslations('Settings');

    return (
        <div className="max-w-3xl mx-auto px-4 lg:px-0">
            {/* Page header */}
            <div className="mb-10">
                <h1 className={cn(
                    "text-3xl lg:text-4xl font-black text-foreground uppercase mb-3",
                    !isArabic && "tracking-tighter"
                )}>
                    {t('title')}
                </h1>
                <p className={cn(
                    "text-[10px] sm:text-xs font-mono text-muted-foreground uppercase",
                    !isArabic && "tracking-[0.3em]"
                )}>
                    {t('subtitle')}
                </p>
            </div>

            {/* Sections */}
            <div className="space-y-6 mb-20">
                <ProfileSection profile={profile} />
                <LocaleSection />
                <SecuritySection />

                <LogoutSection />
                <DangerZoneSection userEmail={profile.user.email} />
            </div>
        </div>
    );
}
