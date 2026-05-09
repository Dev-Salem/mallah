"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import type { AILanguage, AIDetailLevel } from "../types";
import { AI_LANGUAGES, AI_DETAIL_LEVELS } from "../types";
import { ArrowLeft, Languages, MessageSquare } from "lucide-react";
import { useState } from "react";

interface StepPreferencesProps {
    language?: AILanguage;
    detail?: AIDetailLevel;
    onSubmit: (lang: AILanguage, detail: AIDetailLevel) => void;
    onBack: () => void;
}

export default function StepPreferences({ language, detail, onSubmit, onBack }: StepPreferencesProps) {
    const t = useTranslations("Onboarding");
    const [lang, setLang] = useState<AILanguage | undefined>(language);
    const [detailLevel, setDetailLevel] = useState<AIDetailLevel | undefined>(detail);

    const canSubmit = lang && detailLevel;

    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <p className="text-sm text-primary font-medium tracking-wide uppercase">
                    {t("stepLabel", { step: 6, total: 6 })}
                </p>
                <h2 className="text-2xl font-bold">{t("preferences.title")}</h2>
            </div>

            {/* Language preference */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Languages className="w-4 h-4" />
                    {t("preferences.languageQuestion")}
                </div>
                <div className="flex gap-3">
                    {AI_LANGUAGES.map((l) => (
                        <button
                            key={l}
                            onClick={() => setLang(l)}
                            className={`
                glass rounded-xl px-5 py-3 transition-all duration-200
                hover:glow-border cursor-pointer text-sm font-medium
                ${lang === l ? "glow-border bg-primary/5" : ""}
              `}
                        >
                            {t(`preferences.languages.${l}`)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Detail level */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <MessageSquare className="w-4 h-4" />
                    {t("preferences.detailQuestion")}
                </div>
                <div className="flex gap-3">
                    {AI_DETAIL_LEVELS.map((d) => (
                        <button
                            key={d}
                            onClick={() => setDetailLevel(d)}
                            className={`
                glass rounded-xl px-5 py-3 transition-all duration-200
                hover:glow-border cursor-pointer text-sm font-medium
                ${detailLevel === d ? "glow-border bg-primary/5" : ""}
              `}
                        >
                            {t(`preferences.details.${d}`)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex justify-between">
                <Button variant="ghost" onClick={onBack} className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    {t("back")}
                </Button>
                {canSubmit && (
                    <Button
                        onClick={() => onSubmit(lang, detailLevel)}
                        className="glow-border"
                    >
                        {t("preferences.submit")}
                    </Button>
                )}
            </div>
        </div>
    );
}
