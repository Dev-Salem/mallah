import React from "react";
import { useTranslations } from "next-intl";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { BackgroundType } from "../types";

interface Props {
    value?: BackgroundType;
    onChange: (value: BackgroundType) => void;
}

export function StepBackground({ value, onChange }: Props) {
    const t = useTranslations("Onboarding.Step1");

    const options: BackgroundType[] = ["Student", "FreshGraduate", "CareerShifter", "NoTechBackground"];

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-medium text-slate-200">{t("question")}</h2>
            <RadioGroup value={value} onValueChange={(v) => onChange(v as BackgroundType)} className="grid grid-cols-1 gap-4">
                {options.map((opt) => (
                    <div key={opt} className="flex items-center space-x-2 space-x-reverse">
                        <RadioGroupItem value={opt} id={opt} className="border-cyan-500 text-cyan-500" />
                        <Label htmlFor={opt} className="text-lg cursor-pointer text-slate-300 hover:text-cyan-400 transition-colors">
                            {t(opt)}
                        </Label>
                    </div>
                ))}
            </RadioGroup>
        </div>
    );
}
