'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { User, CheckCircle, AlertCircle, Loader2, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { BACKGROUND_OPTIONS, GOAL_OPTIONS } from '../types';
import type { ProfileData } from '../types';
import { updateProfileAction, resendVerificationAction } from '../actions/settings-actions';

interface ProfileSectionProps {
    profile: ProfileData;
}

export function ProfileSection({ profile }: ProfileSectionProps) {
    const locale = useLocale();
    const isArabic = locale === 'ar';

    const [firstName, setFirstName] = useState(profile.learner.first_name);
    const [lastName, setLastName] = useState(profile.learner.last_name);
    const [backgroundType, setBackgroundType] = useState(profile.learner.background_type || '');
    const [primaryGoal, setPrimaryGoal] = useState(profile.learner.primary_goal || '');
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
        });
        setSaving(false);
        if (result.success) {
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } else {
            setError(result.error || 'Failed to save');
        }
    };

    const handleResend = async () => {
        setResending(true);
        setResendMsg('');
        const result = await resendVerificationAction();
        setResending(false);
        if (result.success) {
            setResendMsg('Verification email sent.');
            setResendCooldown(true);
            setTimeout(() => setResendCooldown(false), 60000);
        } else {
            setResendMsg(result.error || 'Failed to send');
        }
    };

    return (
        <div className="border border-white/10 bg-white/[0.02] p-6 lg:p-8">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <User className="w-4 h-4 text-primary" />
                <h2 className={cn(
                    "text-sm font-bold text-white uppercase",
                    !isArabic && "tracking-[0.15em]"
                )}>
                    Profile
                </h2>
            </div>

            {/* Success/Error */}
            {success && (
                <div className="flex items-center gap-2 text-green-500 text-xs font-mono mb-4">
                    <CheckCircle className="w-3 h-3" /> Saved successfully.
                </div>
            )}
            {error && (
                <div className="flex items-center gap-2 text-red-400 text-xs font-mono mb-4">
                    <AlertCircle className="w-3 h-3" /> {error}
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                    <label className={cn("text-[10px] font-mono text-muted-foreground uppercase block mb-2", !isArabic && "tracking-widest")}>
                        First Name
                    </label>
                    <input value={firstName} onChange={e => setFirstName(e.target.value)}
                        className="w-full h-10 px-3 bg-black/50 border border-white/10 text-white text-sm font-mono focus:border-primary/50 focus:outline-none transition-colors"
                    />
                </div>

                {/* Last Name */}
                <div>
                    <label className={cn("text-[10px] font-mono text-muted-foreground uppercase block mb-2", !isArabic && "tracking-widest")}>
                        Last Name
                    </label>
                    <input value={lastName} onChange={e => setLastName(e.target.value)}
                        className="w-full h-10 px-3 bg-black/50 border border-white/10 text-white text-sm font-mono focus:border-primary/50 focus:outline-none transition-colors"
                    />
                </div>

                {/* Email (read-only) */}
                <div>
                    <label className={cn("text-[10px] font-mono text-muted-foreground uppercase block mb-2", !isArabic && "tracking-widest")}>
                        Email
                    </label>
                    <div className="flex items-center gap-2">
                        <input value={profile.user.email} disabled
                            className="flex-1 h-10 px-3 bg-black/30 border border-white/5 text-muted-foreground text-sm font-mono cursor-not-allowed"
                        />
                        {profile.user.email_verified ? (
                            <span className="flex items-center gap-1 text-[9px] font-mono text-green-500 uppercase shrink-0">
                                <CheckCircle className="w-3 h-3" /> Verified
                            </span>
                        ) : (
                            <div className="flex items-center gap-2 shrink-0">
                                <span className="flex items-center gap-1 text-[9px] font-mono text-amber-500 uppercase">
                                    <AlertCircle className="w-3 h-3" /> Unverified
                                </span>
                                <button onClick={handleResend} disabled={resending || resendCooldown}
                                    className="text-[9px] font-mono text-primary underline hover:text-primary/80 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                                >
                                    {resending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                                    Resend
                                </button>
                            </div>
                        )}
                    </div>
                    {resendMsg && <p className="text-[9px] font-mono text-primary/60 mt-1">{resendMsg}</p>}
                    <p className="text-[9px] font-mono text-muted-foreground/40 mt-1">Contact support to change your email.</p>
                </div>

                {/* Current Path (read-only) */}
                <div>
                    <label className={cn("text-[10px] font-mono text-muted-foreground uppercase block mb-2", !isArabic && "tracking-widest")}>
                        Current Path
                    </label>
                    <input value={profile.learner.current_path_display_name} disabled
                        className="w-full h-10 px-3 bg-black/30 border border-white/5 text-muted-foreground text-sm font-mono cursor-not-allowed"
                    />
                    <p className="text-[9px] font-mono text-muted-foreground/40 mt-1">Want to change your path? Contact support.</p>
                </div>

                {/* Background Type */}
                <div>
                    <label className={cn("text-[10px] font-mono text-muted-foreground uppercase block mb-2", !isArabic && "tracking-widest")}>
                        Background
                    </label>
                    <select value={backgroundType} onChange={e => setBackgroundType(e.target.value)}
                        className="w-full h-10 px-3 bg-black/50 border border-white/10 text-white text-sm font-mono focus:border-primary/50 focus:outline-none appearance-none cursor-pointer"
                    >
                        <option value="">Select...</option>
                        {BACKGROUND_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>

                {/* Primary Goal */}
                <div>
                    <label className={cn("text-[10px] font-mono text-muted-foreground uppercase block mb-2", !isArabic && "tracking-widest")}>
                        Primary Goal
                    </label>
                    <select value={primaryGoal} onChange={e => setPrimaryGoal(e.target.value)}
                        className="w-full h-10 px-3 bg-black/50 border border-white/10 text-white text-sm font-mono focus:border-primary/50 focus:outline-none appearance-none cursor-pointer"
                    >
                        <option value="">Select...</option>
                        {GOAL_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Save Button */}
            <div className="mt-6 flex justify-end">
                <Button onClick={handleSave} disabled={saving}
                    className={cn("h-9 px-6 rounded-none uppercase font-mono text-[10px] gap-2", !isArabic && "tracking-[0.15em]")}
                >
                    {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                    Save Changes
                </Button>
            </div>
        </div>
    );
}
