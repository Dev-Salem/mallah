import React from "react";
import { useTranslations } from "next-intl";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AILanguagePref, AIDetailLevel } from "../types";

interface Props {
    lang?: AILanguagePref;
    detail?: AIDetailLevel;
    onLangChange: (v: AILanguagePref) => void;
    onDetailChange: (v: AIDetailLevel) => void;
}

export function StepAIPrefs({ lang, detail, onLangChange, onDetailChange }: Props) {
    const t = useTranslations("Onboarding.Step7");

    const langs: AILanguagePref[] = ['AR', 'EN', 'MIX'];
    const details: AIDetailLevel[] = ['Short', 'Balanced', 'Detailed'];

    return (
        <div className="space-y-8">
            <h2 className="text-xl font-medium text-slate-200">{t("question")}</h2>

            <div className="space-y-4">
                <Label className="text-lg text-slate-300">{t("Language")}</Label>
                <RadioGroup value={lang} onValueChange={(v) => onLangChange(v as AILanguagePref)} className="grid grid-cols-3 gap-2">
                    {langs.map((l) => (
                        <div key={l} className="flex flex-col items-center p-3 border border-slate-800 rounded-lg hover:border-cyan-500/50 cursor-pointer">
                            <RadioGroupItem value={l} id={l} className="mb-2" />
                            <Label htmlFor={l} className="text-xs cursor-pointer">{t(l)}</Label>
                        </div>
                    ))}
                </RadioGroup>
            </div>

            <div className="space-y-4">
                <Label className="text-lg text-slate-300">{t("Detail")}</Label>
                <RadioGroup value={detail} onValueChange={(v) => onDetailChange(v as AIDetailLevel)} className="grid grid-cols-3 gap-2">
                    {details.map((d) => (
                        <div key={d} className="flex flex-col items-center p-3 border border-slate-800 rounded-lg hover:border-cyan-500/50 cursor-pointer">
                            <RadioGroupItem value={d} id={d} className="mb-2" />
                            <Label htmlFor={d} className="text-xs cursor-pointer">{t(d)}</Label>
                        </div>
                    ))}
                </RadioGroup>
            </div>
        </div>
    );
}
