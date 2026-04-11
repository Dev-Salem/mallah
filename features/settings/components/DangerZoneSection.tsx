'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { AlertTriangle, RotateCcw, Trash2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { resetOnboardingAction, deleteAccountAction } from '../actions/settings-actions';

interface DangerZoneSectionProps {
    userEmail: string;
}

export function DangerZoneSection({ userEmail }: DangerZoneSectionProps) {
    const locale = useLocale();
    const isArabic = locale === 'ar';
    const t = useTranslations('Settings');
    const ta = useTranslations('Settings.Actions');
    const tm = useTranslations('Settings.Messages');
    const tp = useTranslations('Settings.Placeholders');
    const td = useTranslations('Settings.DangerZone');
    const router = useRouter();

    // Reset Onboarding state
    const [showResetDialog, setShowResetDialog] = useState(false);
    const [resetting, setResetting] = useState(false);

    // Delete Account state
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [confirmEmail, setConfirmEmail] = useState('');
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState('');

    const handleResetOnboarding = async () => {
        setResetting(true);
        const result = await resetOnboardingAction();
        setResetting(false);
        if (result.success) {
            router.push(`/${locale}/onboarding`);
        }
    };

    const handleDeleteAccount = async () => {
        setDeleting(true);
        setDeleteError('');
        const result = await deleteAccountAction({ confirm_email: confirmEmail });
        setDeleting(false);
        if (result.success) {
            router.push(`/${locale}/login`);
        } else {
            setDeleteError(result.error || tm('saveError'));
        }
    };

    return (
        <div className="border border-destructive/20 bg-destructive/[0.02] p-6 lg:p-8 mt-4">
            <div className="flex items-center gap-3 mb-6">
                <AlertTriangle className="w-4 h-4 text-destructive" />
                <h2 className={cn("text-sm font-bold text-destructive uppercase", !isArabic && "tracking-[0.15em]")}>
                    {td('title')}
                </h2>
            </div>

            <div className="space-y-6">
                {/* Reset Onboarding */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-destructive/10">
                    <div>
                        <h3 className={cn("text-xs font-bold text-foreground uppercase mb-1", !isArabic && "tracking-wide")}>
                            {td('ResetOnboarding.title')}
                        </h3>
                        <p className="text-[10px] text-muted-foreground/60 leading-relaxed max-w-md">
                            {td('ResetOnboarding.subtitle')}
                        </p>
                    </div>
                    <Button variant="outline" onClick={() => setShowResetDialog(true)}
                        className={cn("h-9 px-5 rounded-none border-destructive/20 text-destructive hover:bg-destructive/10 hover:border-destructive/30 uppercase font-mono text-[10px] gap-2 shrink-0", !isArabic && "tracking-[0.1em]")}
                    >
                        <RotateCcw className="w-3 h-3" /> {ta('resetOnboarding')}
                    </Button>
                </div>

                {/* Delete Account */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h3 className={cn("text-xs font-bold text-foreground uppercase mb-1", !isArabic && "tracking-wide")}>
                            {td('DeleteAccount.title')}
                        </h3>
                        <p className="text-[10px] text-muted-foreground/60 leading-relaxed max-w-md">
                            {td('DeleteAccount.subtitle')}
                        </p>
                    </div>
                    <Button variant="outline" onClick={() => setShowDeleteDialog(true)}
                        className={cn("h-9 px-5 rounded-none border-destructive/20 text-destructive hover:bg-destructive/10 hover:border-destructive/30 uppercase font-mono text-[10px] gap-2 shrink-0", !isArabic && "tracking-[0.1em]")}
                    >
                        <Trash2 className="w-3 h-3" /> {ta('deleteAccount')}
                    </Button>
                </div>
            </div>

            {/* Reset Onboarding Dialog */}
            {showResetDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                    <div className="border border-border bg-card p-8 max-w-md w-full mx-4 shadow-2xl">
                        <div className="flex items-center gap-2 mb-4">
                            <AlertTriangle className="w-5 h-5 text-amber-500" />
                            <h3 className={cn("text-sm font-bold text-foreground uppercase", !isArabic && "tracking-wide")}>
                                {tm('confirmResetTitle')}
                            </h3>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                            {tm('confirmResetDesc')}
                        </p>
                        <div className="flex gap-3 justify-end">
                            <Button variant="outline" onClick={() => setShowResetDialog(false)}
                                className={cn("h-9 px-5 rounded-none border-border uppercase font-mono text-[10px]", !isArabic && "tracking-[0.1em]")}
                            >
                                {ta('cancel')}
                            </Button>
                            <Button onClick={handleResetOnboarding} disabled={resetting}
                                className={cn("h-9 px-5 rounded-none bg-warning text-warning-foreground hover:bg-warning/90 uppercase font-mono text-[10px] gap-2", !isArabic && "tracking-[0.1em]")}
                            >
                                {resetting ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                                {ta('confirmResetAction')}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Account Dialog */}
            {showDeleteDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                    <div className="border border-destructive/20 bg-card p-8 max-w-md w-full mx-4 shadow-2xl">
                        <div className="flex items-center gap-2 mb-4">
                            <Trash2 className="w-5 h-5 text-red-400" />
                            <h3 className={cn("text-sm font-bold text-red-400 uppercase", !isArabic && "tracking-wide")}>
                                {tm('confirmDeleteTitle')}
                            </h3>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                            {tm('confirmDeleteDesc')}
                        </p>
                        <div className="mb-6">
                            <label className={cn("text-[10px] font-mono text-muted-foreground uppercase block mb-2", !isArabic && "tracking-widest")}>
                                {tm('confirmEmailLabel')}
                            </label>
                            <input type="email" value={confirmEmail} onChange={e => setConfirmEmail(e.target.value)}
                                placeholder={userEmail}
                                className="w-full h-10 px-3 bg-background border border-destructive/20 text-foreground text-sm font-mono focus:border-destructive focus:outline-none transition-colors placeholder:text-muted-foreground/30"
                            />
                            {deleteError && (
                                <p className="text-[9px] font-mono text-red-400 mt-1">{deleteError}</p>
                            )}
                        </div>
                        <div className="flex gap-3 justify-end">
                            <Button variant="outline" onClick={() => { setShowDeleteDialog(false); setConfirmEmail(''); setDeleteError(''); }}
                                className={cn("h-9 px-5 rounded-none border-border uppercase font-mono text-[10px]", !isArabic && "tracking-[0.1em]")}
                            >
                                {ta('cancel')}
                            </Button>
                            <Button onClick={handleDeleteAccount}
                                disabled={deleting || confirmEmail !== userEmail}
                                className={cn("h-9 px-5 rounded-none bg-destructive text-destructive-foreground hover:bg-destructive/90 uppercase font-mono text-[10px] gap-2 disabled:opacity-30", !isArabic && "tracking-[0.1em]")}
                            >
                                {deleting ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                                {ta('confirmDeleteAction')}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
