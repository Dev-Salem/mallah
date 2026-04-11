'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Bot, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { AI_LANG_OPTIONS, AI_DETAIL_OPTIONS } from '../types';
import { updateAIPrefsAction } from '../actions/settings-actions';

interface AIPrefsSectionProps {
    currentLang: string | null;
    currentDetail: string | null;
}

export function AIPrefsSection({ currentLang, currentDetail }: AIPrefsSectionProps) {
    const locale = useLocale();
    const isArabic = locale === 'ar';
    const t = useTranslations('Settings');
    const tl = useTranslations('Settings.Labels');
    const tm = useTranslations('Settings.Messages');
    const ta = useTranslations('Settings.Actions');
    const to = useTranslations('Settings.Options');
    const tp = useTranslations('Settings.Placeholders');

    const [lang, setLang] = useState(currentLang || '');
    const [detail, setDetail] = useState(currentDetail || '');
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSave = async () => {
        if (!lang || !detail) return;
        setSaving(true);
        setError('');
        setSuccess(false);
        const result = await updateAIPrefsAction({ ai_language_pref: lang, ai_detail_level: detail });
        setSaving(false);
        if (result.success) {
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } else {
            setError(result.error || tm('saveError'));
        }
    };

    return (
        <div className="border border-border bg-card p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-6">
                <Bot className="w-4 h-4 text-primary" />
                <h2 className={cn("text-sm font-bold text-foreground uppercase", !isArabic && "tracking-[0.15em]")}>
                    {t('AIPrefs.title')}
                </h2>
            </div>

            {success && (
                <div className="flex items-center gap-2 text-green-500 text-xs font-mono mb-4">
                    <CheckCircle className="w-3 h-3" /> {tm('saveSuccess')}
                </div>
            )}
            {error && (
                <div className="flex items-center gap-2 text-red-400 text-xs font-mono mb-4">
                    <AlertCircle className="w-3 h-3" /> {error}
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-6 max-w-lg">
                <div>
                    <label className={cn("text-[10px] font-mono text-muted-foreground uppercase block mb-2", !isArabic && "tracking-widest")}>
                        {tl('aiLanguage')}
                    </label>
                    <select value={lang} onChange={e => setLang(e.target.value)}
                        className="w-full h-10 px-3 bg-background border border-input text-foreground text-sm font-mono focus:border-primary/50 focus:outline-none appearance-none cursor-pointer"
                    >
                        <option value="">{tp('select')}</option>
                        {AI_LANG_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{to(opt.value)}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className={cn("text-[10px] font-mono text-muted-foreground uppercase block mb-2", !isArabic && "tracking-widest")}>
                        {tl('aiDetail')}
                    </label>
                    <select value={detail} onChange={e => setDetail(e.target.value)}
                        className="w-full h-10 px-3 bg-background border border-input text-foreground text-sm font-mono focus:border-primary/50 focus:outline-none appearance-none cursor-pointer"
                    >
                        <option value="">{tp('select')}</option>
                        {AI_DETAIL_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{to(opt.value)}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="mt-6 flex justify-end">
                <Button onClick={handleSave} disabled={saving || !lang || !detail}
                    className={cn("h-9 px-6 rounded-none uppercase font-mono text-[10px] gap-2", !isArabic && "tracking-[0.15em]")}
                >
                    {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                    {ta('saveChanges')}
                </Button>
            </div>
        </div>
    );
}
