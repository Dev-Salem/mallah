import React from "react";
import { useTranslations } from "next-intl";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { WeeklyHoursCategory } from "../types";

interface Props {
    value?: WeeklyHoursCategory;
    onChange: (value: WeeklyHoursCategory) => void;
}

export function StepCommitment({ value, onChange }: Props) {
    const t = useTranslations("Onboarding.Step3");
    const options: WeeklyHoursCategory[] = ["0-3", "4-7", "8-12", "13+"];

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-medium text-slate-200">{t("question")}</h2>
            <RadioGroup value={value} onValueChange={(v) => onChange(v as WeeklyHoursCategory)} className="grid grid-cols-1 gap-4">
                {options.map((opt) => (
                    <Label
                        key={opt}
                        htmlFor={opt}
                        className={`flex items-center gap-6 p-5 border rounded-xl cursor-pointer transition-all duration-300 group
                            ${value === opt
                                ? "border-cyan-500/50 bg-cyan-500/10 shadow-[0_0_20px_rgba(6,182,212,0.1)]"
                                : "border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-800/40"
                            }`}
                    >
                        <RadioGroupItem value={opt} id={opt} className="border-cyan-500/50 text-cyan-500" />
                        <span className={`text-2xl font-mono transition-colors ${value === opt ? "text-cyan-400" : "text-slate-300 group-hover:text-slate-200"}`}>
                            {t("hours", { count: opt })}
                        </span>
                    </Label>
                ))}
            </RadioGroup>
        </div>
    );
}
