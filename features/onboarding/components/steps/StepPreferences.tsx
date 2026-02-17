"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Globe, MessageSquare } from "lucide-react";

interface StepPreferencesProps {
    initialLanguage: string | null;
    initialDetail: string | null;
    onSave: (aiLanguagePref: string, aiDetailLevel: string) => Promise<void>;
    onBack: () => void;
}

const LANGUAGE_OPTIONS = ["arabic", "english", "mix"] as const;
const DETAIL_OPTIONS = ["short", "balanced", "detailed"] as const;

export function StepPreferences({
    initialLanguage,
    initialDetail,
    onSave,
    onBack,
}: StepPreferencesProps) {
    const t = useTranslations("Onboarding");
    const [language, setLanguage] = useState(initialLanguage || "");
    const [detail, setDetail] = useState(initialDetail || "");
    const [loading, setLoading] = useState(false);

    const isValid = language && detail;

    async function handleSubmit() {
        if (!isValid) return;
        setLoading(true);
        try {
            await onSave(language, detail);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">
                    {t("step6Title")}
                </h2>
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                    {t("step6Subtitle")}
                </p>
            </div>

            {/* AI Language */}
            <div>
                <label className="block text-[10px] font-mono text-primary uppercase tracking-[0.3em] mb-4">
                    <Globe className="inline h-3 w-3 me-2" />
                    {t("aiLanguageLabel")}
                </label>
                <div className="grid grid-cols-3 gap-3">
                    {LANGUAGE_OPTIONS.map((value) => (
                        <button
                            key={value}
                            onClick={() => setLanguage(value)}
                            className={`
                p-4 border text-center transition-all duration-300 cursor-pointer
                ${language === value
                                    ? "border-primary bg-primary/10 glow-border"
                                    : "border-white/10 bg-white/5 hover:border-white/20"
                                }
              `}
                        >
                            <span className="block text-sm font-bold text-white uppercase tracking-wide">
                                {t(`lang_${value}`)}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* AI Detail Level */}
            <div>
                <label className="block text-[10px] font-mono text-primary uppercase tracking-[0.3em] mb-4">
                    <MessageSquare className="inline h-3 w-3 me-2" />
                    {t("aiDetailLabel")}
                </label>
                <div className="grid grid-cols-3 gap-3">
                    {DETAIL_OPTIONS.map((value) => (
                        <button
                            key={value}
                            onClick={() => setDetail(value)}
                            className={`
                p-4 border text-center transition-all duration-300 cursor-pointer
                ${detail === value
                                    ? "border-primary bg-primary/10 glow-border"
                                    : "border-white/10 bg-white/5 hover:border-white/20"
                                }
              `}
                        >
                            <span className="block text-sm font-bold text-white uppercase tracking-wide">
                                {t(`detail_${value}`)}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex gap-4">
                <Button
                    variant="outline"
                    onClick={onBack}
                    className="h-14 px-8 rounded-none border-white/10 hover:bg-white/5 text-white uppercase tracking-[0.2em] font-mono text-[11px] group"
                >
                    <ArrowLeft className="me-3 h-3 w-3 group-hover:-translate-x-1 transition-transform" />
                    {t("back")}
                </Button>
                <Button
                    onClick={handleSubmit}
                    disabled={!isValid || loading}
                    className="flex-1 h-14 rounded-none uppercase tracking-[0.2em] font-mono text-[11px] bg-primary hover:bg-primary/90 text-primary-foreground transition-all group"
                >
                    {t("next")}
                    <ArrowRight className="ms-3 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </Button>
            </div>
        </div>
    );
}
