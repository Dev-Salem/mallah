import React from "react";
import { useTranslations } from "next-intl";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { InterestVector } from "../types";

interface Props {
    value?: InterestVector;
    onChange: (value: InterestVector) => void;
}

export function StepInterestVector({ value, onChange }: Props) {
    const t = useTranslations("Onboarding.Step4");

    const initialValue = value || {
        frontend: 0.5,
        fullstack: 0.5,
        cybersecurity: 0.5,
        datascience: 0.5,
        debugging: 0.5,
        experimenting: 0.5,
    };

    const handleChange = (key: keyof InterestVector, val: number[]) => {
        onChange({ ...initialValue, [key]: val[0] });
    };

    const items: { key: keyof InterestVector; label: string }[] = [
        { key: "frontend", label: t("Statement1") },
        { key: "fullstack", label: t("Statement2") },
        { key: "cybersecurity", label: t("Statement3") },
        { key: "datascience", label: t("Statement4") },
        { key: "debugging", label: t("Statement5") },
        { key: "experimenting", label: t("Statement6") },
    ];

    return (
        <div className="space-y-8">
            <h2 className="text-xl font-medium text-slate-200">{t("question")}</h2>
            <div className="space-y-6">
                {items.map((item) => (
                    <div key={item.key} className="space-y-3">
                        <div className="flex justify-between items-center">
                            <Label className="text-slate-300 text-sm">{item.label}</Label>
                            <span className="text-xs font-mono text-cyan-500">{(initialValue[item.key] * 100).toFixed(0)}%</span>
                        </div>
                        <Slider
                            value={[initialValue[item.key]]}
                            max={1}
                            step={0.1}
                            onValueChange={(val) => handleChange(item.key, val)}
                            className="py-2"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
