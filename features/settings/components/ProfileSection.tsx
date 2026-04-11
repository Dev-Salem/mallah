'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { User, CheckCircle, AlertCircle, Loader2, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { BACKGROUND_OPTIONS, GOAL_OPTIONS, HOURS_OPTIONS, AI_LANG_OPTIONS, AI_DETAIL_OPTIONS, deriveVelocity } from '../types';
import type { ProfileData } from '../types';
import { updateProfileAction, resendVerificationAction } from '../actions/settings-actions';

interface ProfileSectionProps {
    profile: ProfileData;
}

export function ProfileSection({ profile }: ProfileSectionProps) {
    const locale = useLocale();
    const isArabic = locale === 'ar';
    const t = useTranslations('Settings');
    const tl = useTranslations('Settings.Labels');
    const tm = useTranslations('Settings.Messages');
    const ta = useTranslations('Settings.Actions');
    const to = useTranslations('Settings.Options');
    const tp = useTranslations('Settings.Placeholders');
    const tpaths = useTranslations('Settings.Paths');

    const [firstName, setFirstName] = useState(profile.learner.first_name);
    const [lastName, setLastName] = useState(profile.learner.last_name);
    const [backgroundType, setBackgroundType] = useState(profile.learner.background_type || '');
    const [primaryGoal, setPrimaryGoal] = useState(profile.learner.primary_goal || '');
    const [weeklyHours, setWeeklyHours] = useState(profile.learner.weekly_hours_category || '');
    const [aiLanguage, setAiLanguage] = useState(profile.learner.ai_language_pref || '');
    const [aiDetail, setAiDetail] = useState(profile.learner.ai_detail_level || '');
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [resending, setResending] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(false);
    const [resendMsg, setResendMsg] = useState('');

    const handleSave = async () => {
        setSaving(true);
        setError('');
        setSuccess(false);
        const result = await updateProfileAction({
            first_name: firstName,
            last_name: lastName,
            background_type: backgroundType,
            primary_goal: primaryGoal,
            weekly_hours_category: weeklyHours,
            ai_language_pref: aiLanguage,
            ai_detail_level: aiDetail,
        });
        setSaving(false);
        if (result.success) {
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } else {
            setError(result.error || tm('saveError'));
        }
    };

    const handleResend = async () => {
        setResending(true);
        setResendMsg('');
        const result = await resendVerificationAction();
        setResending(false);
        if (result.success) {
            setResendMsg(tm('verificationSent'));
            setResendCooldown(true);
            setTimeout(() => setResendCooldown(false), 60000);
        } else {
            setResendMsg(result.error || tm('saveError'));
        }
    };

    return (
        <div className="border border-border bg-card p-6 lg:p-8 space-y-10">
            {/* Header */}
            <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-primary" />
                <h2 className={cn(
                    "text-sm font-bold text-foreground uppercase",
                    !isArabic && "tracking-[0.15em]"
                )}>
                    {t('Profile.title')}
                </h2>
            </div>

            {/* Success/Error Notifications */}
            <div className="space-y-2">
                {success && (
                    <div className="flex items-center gap-2 text-green-500 text-xs font-mono">
                        <CheckCircle className="w-3 h-3" /> {tm('saveSuccess')}
                    </div>
                )}
                {error && (
                    <div className="flex items-center gap-2 text-red-400 text-xs font-mono">
                        <AlertCircle className="w-3 h-3" /> {error}
                    </div>
                            {tl('weeklyCommitment')}
                        </label>
                        <select value={weeklyHours} onChange={e => setWeeklyHours(e.target.value)}
                            className="w-full h-10 px-3 bg-background border border-input text-foreground text-sm font-mono focus:border-primary/50 focus:outline-none appearance-none cursor-pointer"
                        >
                            <option value="">{tp('select')}</option>
                            {HOURS_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{to(opt.value)}</option>
                            ))}
                        </select>
                        {weeklyHours && (
                            <p className="text-[10px] font-mono text-muted-foreground mt-2 flex items-center gap-1.5">
                                <span className={cn(
                                    "w-1 h-1 rounded-full bg-primary animate-pulse"
                                )} />
                                {tl('pace', { velocity: to(deriveVelocity(weeklyHours)) })}
                            </p>
                        )}
                    </div>

                    {/* AI Language */}
                    <div className="md:row-start-2">
                        <label className={cn("text-[10px] font-mono text-muted-foreground uppercase block mb-2", !isArabic && "tracking-widest")}>
                            {tl('aiLanguage')}
                        </label>
                        <select value={aiLanguage} onChange={e => setAiLanguage(e.target.value)}
                            className="w-full h-10 px-3 bg-background border border-input text-foreground text-sm font-mono focus:border-primary/50 focus:outline-none appearance-none cursor-pointer"
                        >
                            <option value="">{tp('select')}</option>
                            {AI_LANG_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{to(opt.value)}</option>
                            ))}
                        </select>
                    </div>

                    {/* AI Detail */}
                    <div className="md:row-start-2">
                        <label className={cn("text-[10px] font-mono text-muted-foreground uppercase block mb-2", !isArabic && "tracking-widest")}>
                            {tl('aiDetail')}
                        </label>
                        <select value={aiDetail} onChange={e => setAiDetail(e.target.value)}
                            className="w-full h-10 px-3 bg-background border border-input text-foreground text-sm font-mono focus:border-primary/50 focus:outline-none appearance-none cursor-pointer"
                        >
                            <option value="">{tp('select')}</option>
                            {AI_DETAIL_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{to(opt.value)}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </section>

            {/* Save Button */}
            <div className="pt-6 flex justify-end border-t border-border/30">
                <Button onClick={handleSave} disabled={saving}
                    className={cn("h-10 px-8 rounded-none uppercase font-mono text-[11px] gap-2 transition-all active:scale-95", !isArabic && "tracking-[0.2em]")}
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    {ta('saveChanges')}
                </Button>
            </div>
        </div>
    );
}
