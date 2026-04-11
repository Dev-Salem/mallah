'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Shield, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { changePasswordAction } from '../actions/settings-actions';

export function SecuritySection() {
    const locale = useLocale();
    const isArabic = locale === 'ar';
    const t = useTranslations('Settings');
    const tl = useTranslations('Settings.Labels');
    const tm = useTranslations('Settings.Messages');
    const ta = useTranslations('Settings.Actions');
    const tp = useTranslations('Settings.Placeholders');

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSave = async () => {
        setSaving(true);
        setError('');
        setSuccess(false);
        const result = await changePasswordAction({ new_password: newPassword, confirm_password: confirmPassword });
        setSaving(false);
        if (result.success) {
            setSuccess(true);
            setNewPassword('');
            setConfirmPassword('');
            setTimeout(() => setSuccess(false), 3000);
        } else {
            setError(result.error || tm('saveError'));
        }
    };

    return (
        <div className="border border-border bg-card p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-6">
                <Shield className="w-4 h-4 text-primary" />
                <h2 className={cn("text-sm font-bold text-foreground uppercase", !isArabic && "tracking-[0.15em]")}>
                    {t('Security.title')}
                </h2>
            </div>

            {success && (
                <div className="flex items-center gap-2 text-green-500 text-xs font-mono mb-4">
                    <CheckCircle className="w-3 h-3" /> {tm('passwordSuccess')}
                </div>
            )}
            {error && (
                <div className="flex items-center gap-2 text-red-400 text-xs font-mono mb-4">
                    <AlertCircle className="w-3 h-3" /> {error}
                </div>
            )}

            <div className="max-w-sm space-y-4">
                <div>
                    <label className={cn("text-[10px] font-mono text-muted-foreground uppercase block mb-2", !isArabic && "tracking-widest")}>
                        {tl('newPassword')}
                    </label>
                    <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                        placeholder={tp('passwordMin')}
                        className="w-full h-10 px-3 bg-background border border-input text-foreground text-sm font-mono focus:border-primary/50 focus:outline-none transition-colors placeholder:text-muted-foreground/30"
                    />
                </div>

                <div>
                    <label className={cn("text-[10px] font-mono text-muted-foreground uppercase block mb-2", !isArabic && "tracking-widest")}>
                        {tl('confirmPassword')}
                    </label>
                    <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                        className="w-full h-10 px-3 bg-background border border-input text-foreground text-sm font-mono focus:border-primary/50 focus:outline-none transition-colors"
                    />
                </div>
            </div>

            <div className="mt-6 flex justify-end">
                <Button onClick={handleSave} disabled={saving || !newPassword || !confirmPassword}
                    className={cn("h-9 px-6 rounded-none uppercase font-mono text-[10px] gap-2", !isArabic && "tracking-[0.15em]")}
                >
                    {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                    {ta('changePassword')}
                </Button>
            </div>
        </div>
    );
}
