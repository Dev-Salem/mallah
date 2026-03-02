'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
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
            setDeleteError(result.error || 'Failed to delete account');
        }
    };

    return (
        <div className="border border-red-500/20 bg-red-500/[0.02] p-6 lg:p-8 mt-4">
            <div className="flex items-center gap-3 mb-6">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <h2 className={cn("text-sm font-bold text-red-400 uppercase", !isArabic && "tracking-[0.15em]")}>
                    Danger Zone
                </h2>
            </div>

            <div className="space-y-6">
                {/* Reset Onboarding */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-red-500/10">
                    <div>
                        <h3 className={cn("text-xs font-bold text-white uppercase mb-1", !isArabic && "tracking-wide")}>
                            Reset Onboarding
                        </h3>
                        <p className="text-[10px] text-muted-foreground/60 leading-relaxed max-w-md">
                            Clears your path, goals, and preferences. Progress and portfolio data are preserved.
                        </p>
                    </div>
                    <Button variant="outline" onClick={() => setShowResetDialog(true)}
                        className={cn("h-9 px-5 rounded-none border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/30 uppercase font-mono text-[10px] gap-2 shrink-0", !isArabic && "tracking-[0.1em]")}
                    >
                        <RotateCcw className="w-3 h-3" /> Reset Onboarding
                    </Button>
                </div>

                {/* Delete Account */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h3 className={cn("text-xs font-bold text-white uppercase mb-1", !isArabic && "tracking-wide")}>
                            Delete Account
                        </h3>
                        <p className="text-[10px] text-muted-foreground/60 leading-relaxed max-w-md">
                            Permanently deletes your account, progress, and all data. This cannot be undone.
                        </p>
                    </div>
                    <Button variant="outline" onClick={() => setShowDeleteDialog(true)}
                        className={cn("h-9 px-5 rounded-none border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/30 uppercase font-mono text-[10px] gap-2 shrink-0", !isArabic && "tracking-[0.1em]")}
                    >
                        <Trash2 className="w-3 h-3" /> Delete Account
                    </Button>
                </div>
            </div>

            {/* Reset Onboarding Dialog */}
            {showResetDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                    <div className="border border-white/10 bg-background p-8 max-w-md w-full mx-4">
                        <div className="flex items-center gap-2 mb-4">
                            <AlertTriangle className="w-5 h-5 text-amber-500" />
                            <h3 className={cn("text-sm font-bold text-white uppercase", !isArabic && "tracking-wide")}>
                                Reset Onboarding?
                            </h3>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                            This will reset your path selection, goals, and preferences. Your progress, projects, and portfolio are not deleted — but your roadmap will be re-scaffolded once you complete onboarding again. This cannot be undone.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <Button variant="outline" onClick={() => setShowResetDialog(false)}
                                className={cn("h-9 px-5 rounded-none border-white/10 uppercase font-mono text-[10px]", !isArabic && "tracking-[0.1em]")}
                            >
                                Cancel
                            </Button>
                            <Button onClick={handleResetOnboarding} disabled={resetting}
                                className={cn("h-9 px-5 rounded-none bg-amber-500 text-black hover:bg-amber-400 uppercase font-mono text-[10px] gap-2", !isArabic && "tracking-[0.1em]")}
                            >
                                {resetting ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                                Confirm Reset
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Account Dialog */}
            {showDeleteDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                    <div className="border border-red-500/20 bg-background p-8 max-w-md w-full mx-4">
                        <div className="flex items-center gap-2 mb-4">
                            <Trash2 className="w-5 h-5 text-red-400" />
                            <h3 className={cn("text-sm font-bold text-red-400 uppercase", !isArabic && "tracking-wide")}>
                                Delete Account?
                            </h3>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                            This will permanently delete your account, progress, and all data. This cannot be undone.
                        </p>
                        <div className="mb-6">
                            <label className={cn("text-[10px] font-mono text-muted-foreground uppercase block mb-2", !isArabic && "tracking-widest")}>
                                Type your email to confirm
                            </label>
                            <input type="email" value={confirmEmail} onChange={e => setConfirmEmail(e.target.value)}
                                placeholder={userEmail}
                                className="w-full h-10 px-3 bg-black/50 border border-red-500/20 text-white text-sm font-mono focus:border-red-500/50 focus:outline-none transition-colors placeholder:text-muted-foreground/20"
                            />
                            {deleteError && (
                                <p className="text-[9px] font-mono text-red-400 mt-1">{deleteError}</p>
                            )}
                        </div>
                        <div className="flex gap-3 justify-end">
                            <Button variant="outline" onClick={() => { setShowDeleteDialog(false); setConfirmEmail(''); setDeleteError(''); }}
                                className={cn("h-9 px-5 rounded-none border-white/10 uppercase font-mono text-[10px]", !isArabic && "tracking-[0.1em]")}
                            >
                                Cancel
                            </Button>
                            <Button onClick={handleDeleteAccount}
                                disabled={deleting || confirmEmail !== userEmail}
                                className={cn("h-9 px-5 rounded-none bg-red-500 text-white hover:bg-red-400 uppercase font-mono text-[10px] gap-2 disabled:opacity-30", !isArabic && "tracking-[0.1em]")}
                            >
                                {deleting ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                                Delete My Account
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
