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
                <RadioGroup value={lang} onValueChange={(v) => onLangChange(v as AILanguagePref)} className="grid grid-cols-3 gap-3">
                    {langs.map((l) => (
                        <Label
                            key={l}
                            htmlFor={l}
                            className={`flex flex-col items-center gap-2 p-4 border rounded-xl cursor-pointer transition-all duration-300
                                ${lang === l
                                    ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                                    : "border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700 hover:bg-slate-800/40"
                                }`}
                        >
                            <RadioGroupItem value={l} id={l} className="border-cyan-500/50 text-cyan-500" />
                            <span className="text-sm font-medium">{t(l)}</span>
                        </Label>
                    ))}
                </RadioGroup>
            </div>

            <div className="space-y-4">
                <Label className="text-lg text-slate-300">{t("Detail")}</Label>
                <RadioGroup value={detail} onValueChange={(v) => onDetailChange(v as AIDetailLevel)} className="grid grid-cols-3 gap-3">
                    {details.map((d) => (
                        <Label
                            key={d}
                            htmlFor={d}
                            className={`flex flex-col items-center gap-2 p-4 border rounded-xl cursor-pointer transition-all duration-300
                                ${detail === d
                                    ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                                    : "border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700 hover:bg-slate-800/40"
                                }`}
                        >
                            <RadioGroupItem value={d} id={d} className="border-cyan-500/50 text-cyan-500" />
                            <span className="text-sm font-medium">{t(d)}</span>
                        </Label>
                    ))}
                </RadioGroup>
            </div>
        </div>
    );
}
