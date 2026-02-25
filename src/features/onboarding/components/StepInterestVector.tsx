import React from "react";
import { useTranslations } from "next-intl";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { InterestVector } from "../types";
import { Info } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

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

    const items: { key: keyof InterestVector; label: string; hint: string; example: string }[] = [
        { key: "frontend", label: t("Statement1"), hint: t("Statement1Hint"), example: t("Statement1Example") },
        { key: "fullstack", label: t("Statement2"), hint: t("Statement2Hint"), example: t("Statement2Example") },
        { key: "cybersecurity", label: t("Statement3"), hint: t("Statement3Hint"), example: t("Statement3Example") },
        { key: "datascience", label: t("Statement4"), hint: t("Statement4Hint"), example: t("Statement4Example") },
        { key: "debugging", label: t("Statement5"), hint: t("Statement5Hint"), example: t("Statement5Example") },
        { key: "experimenting", label: t("Statement6"), hint: t("Statement6Hint"), example: t("Statement6Example") },
    ];

    return (
        <div className="space-y-8">
            <h2 className="text-xl font-medium text-slate-200">{t("question")}</h2>
            <div className="space-y-6">
                {items.map((item) => (
                    <div key={item.key} className="space-y-3">
                        <div className="flex justify-between items-center group">
                            <div className="flex items-center gap-2">
                                <Label className="text-slate-300 text-sm leading-relaxed">{item.label}</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <button className="text-slate-500 hover:text-cyan-400 transition-colors focus:outline-none">
                                            <Info className="w-4 h-4" />
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-80 bg-slate-900 border-slate-800 text-slate-200 shadow-xl p-4 space-y-3 z-50">
                                        <div className="space-y-1">
                                            <h4 className="text-xs font-mono text-cyan-500 uppercase tracking-widest">Detail</h4>
                                            <p className="text-sm text-slate-300 leading-relaxed font-sans">{item.hint}</p>
                                        </div>
                                        <div className="space-y-1 pt-2 border-t border-slate-800">
                                            <h4 className="text-xs font-mono text-cyan-500 uppercase tracking-widest">Example</h4>
                                            <p className="text-sm text-slate-400 italic leading-relaxed font-sans">"{item.example}"</p>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <span className="text-xs font-mono text-cyan-500 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">{(initialValue[item.key] * 100).toFixed(0)}%</span>
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
