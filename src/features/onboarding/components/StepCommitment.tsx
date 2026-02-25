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
            <RadioGroup value={value} onValueChange={(v) => onChange(v as WeeklyHoursCategory)} className="grid grid-cols-1 gap-6">
                {options.map((opt) => (
                    <div key={opt} className="flex items-center space-x-4 space-x-reverse p-4 border border-slate-800 rounded-lg hover:border-cyan-500/50 transition-all bg-slate-800/20">
                        <RadioGroupItem value={opt} id={opt} className="border-cyan-500 text-cyan-500" />
                        <Label htmlFor={opt} className="text-xl font-mono cursor-pointer text-slate-200">
                            {opt} {t("hours")}
                        </Label>
                    </div>
                ))}
            </RadioGroup>
        </div>
    );
}
