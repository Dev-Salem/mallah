'use client';

import { useLocale } from 'next-intl';
import { cn } from '@/lib/utils';
import type { ProfileData } from '../types';
import { ProfileSection } from './ProfileSection';
import { LearningPrefsSection } from './LearningPrefsSection';
import { AIPrefsSection } from './AIPrefsSection';
import { SecuritySection } from './SecuritySection';
import { LogoutSection } from './LogoutSection';
import { DangerZoneSection } from './DangerZoneSection';

interface SettingsPageProps {
    profile: ProfileData;
}

export function SettingsPage({ profile }: SettingsPageProps) {
    const locale = useLocale();
    const isArabic = locale === 'ar';

    return (
        <div className="max-w-3xl mx-auto">
            {/* Page header */}
            <div className="mb-10">
                <h1 className={cn(
                    "text-3xl lg:text-4xl font-black text-white uppercase mb-3",
                    !isArabic && "tracking-tighter"
                )}>
                    Settings
                </h1>
                <p className={cn(
                    "text-[10px] font-mono text-muted-foreground/50 uppercase",
                    !isArabic && "tracking-[0.3em]"
                )}>
                    Manage your profile, preferences, and account
                </p>
            </div>

            {/* Sections */}
            <div className="space-y-6">
                <ProfileSection profile={profile} />
                <LearningPrefsSection
                    currentCategory={profile.learner.weekly_hours_category}
                    currentVelocity={profile.learner.learning_velocity}
                />
                <AIPrefsSection
                    currentLang={profile.learner.ai_language_pref}
                    currentDetail={profile.learner.ai_detail_level}
                />
                <SecuritySection />
                <LogoutSection />
                <DangerZoneSection userEmail={profile.user.email} />
            </div>
        </div>
    );
}
