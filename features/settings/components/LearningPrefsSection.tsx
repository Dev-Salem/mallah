'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { HOURS_OPTIONS } from '../types';
import { updateLearningPrefsAction } from '../actions/settings-actions';

interface LearningPrefsSectionProps {
    currentCategory: string | null;
    currentVelocity: string | null;
}

export function LearningPrefsSection({ currentCategory, currentVelocity }: LearningPrefsSectionProps) {
    const locale = useLocale();
    const isArabic = locale === 'ar';
    const t = useTranslations('Settings.LearningPrefs');

    const [category, setCategory] = useState(currentCategory || '');
    const [velocity, setVelocity] = useState(currentVelocity || '');
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSave = async () => {
        if (!category) return;
        setSaving(true);
        setError('');
        setSuccess(false);
        const result = await updateLearningPrefsAction({ weekly_hours_category: category });
        setSaving(false);
        if (result.success) {
            setVelocity(result.learning_velocity || velocity);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } else {
            setError(result.error || 'Failed to save');
        }
    };

    return (
        <div className="border border-border bg-card p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-6">
                <Clock className="w-4 h-4 text-primary" />
                <h2 className={cn("text-sm font-bold text-foreground uppercase", !isArabic && "tracking-[0.15em]")}>
                    {t('title')}
                </h2>
            </div>

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

            <div className="max-w-sm">
                <label className={cn("text-[10px] font-mono text-muted-foreground uppercase block mb-2", !isArabic && "tracking-widest")}>
                    Weekly Study Time
                </label>
                <select value={category} onChange={e => setCategory(e.target.value)}
                    className="w-full h-10 px-3 bg-background border border-input text-foreground text-sm font-mono focus:border-primary/50 focus:outline-none appearance-none cursor-pointer"
                >
                    <option value="">Select...</option>
                    {HOURS_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>

                {velocity && (
                    <p className={cn("text-[9px] font-mono text-primary/60 mt-2 uppercase", !isArabic && "tracking-widest")}>
                        Pace: {velocity}
                    </p>
                )}
            </div>

            <div className="mt-6 flex justify-end">
                <Button onClick={handleSave} disabled={saving || !category}
                    className={cn("h-9 px-6 rounded-none uppercase font-mono text-[10px] gap-2", !isArabic && "tracking-[0.15em]")}
                >
                    {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                    Save Changes
                </Button>
            </div>
        </div>
    );
}
