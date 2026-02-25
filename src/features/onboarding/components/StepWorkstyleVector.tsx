import React from "react";
import { useTranslations } from "next-intl";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { WorkstyleVector } from "../types";
import { Separator } from "@/components/ui/separator";

interface Props {
    value?: WorkstyleVector;
    onChange: (value: WorkstyleVector) => void;
}

export function StepWorkstyleVector({ value, onChange }: Props) {
    const t = useTranslations("Onboarding.Step5");

    const iv = value || {
        choice: 'visual',
        ambiguity: 'moderate',
        math_comfort: 'Medium'
    };

    const choices: ('visual' | 'complete' | 'secure' | 'analyze')[] = ['visual', 'complete', 'secure', 'analyze'];
    const ambiguity: ('step-by-step' | 'moderate' | 'open-ended')[] = ['step-by-step', 'moderate', 'open-ended'];
    const math: ('Low' | 'Medium' | 'High')[] = ['Low', 'Medium', 'High'];

    return (
        <div className="space-y-8 overflow-y-auto max-h-[500px] pr-2">
            <div className="space-y-4">
                <h3 className="text-lg font-medium text-slate-200">{t("question")}</h3>
                <RadioGroup
                    value={iv.choice}
                    onValueChange={(v) => onChange({ ...iv, choice: v as any })}
                    className="grid grid-cols-2 gap-3"
                >
                    {choices.map((c) => (
                        <Label
                            key={c}
                            htmlFor={c}
                            className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all duration-300
                                ${iv.choice === c
                                    ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-400"
                                    : "border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700 hover:text-slate-300"
                                }`}
                        >
                            <RadioGroupItem value={c} id={c} className="border-cyan-500/50 text-cyan-500" />
                            <span className="text-sm font-medium">{t(c.charAt(0).toUpperCase() + c.slice(1))}</span>
                        </Label>
                    ))}
                </RadioGroup>
            </div>

            <Separator className="bg-slate-800" />

            <div className="space-y-4">
                <h3 className="text-lg font-medium text-slate-200">{t("ProblemStyle")}</h3>
                <RadioGroup
                    value={iv.ambiguity}
                    onValueChange={(v) => onChange({ ...iv, ambiguity: v as any })}
                    className="grid grid-cols-1 gap-3"
                >
                    {ambiguity.map((a) => (
                        <Label
                            key={a}
                            htmlFor={a}
                            className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all duration-300
                                ${iv.ambiguity === a
                                    ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-400 font-medium"
                                    : "border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700 hover:text-slate-300"
                                }`}
                        >
                            <RadioGroupItem value={a} id={a} className="border-cyan-500/50 text-cyan-500" />
                            <span>{t(a.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(''))}</span>
                        </Label>
                    ))}
                </RadioGroup>
            </div>

            <Separator className="bg-slate-800" />

            <div className="space-y-4">
                <h3 className="text-lg font-medium text-slate-200">{t("MathComfort")}</h3>
                <RadioGroup
                    value={iv.math_comfort}
                    onValueChange={(v) => onChange({ ...iv, math_comfort: v as any })}
                    className="flex gap-4"
                >
                    {math.map((m) => (
                        <Label
                            key={m}
                            htmlFor={m}
                            className={`flex flex-1 items-center justify-center gap-3 p-4 border rounded-xl cursor-pointer transition-all duration-300
                                ${iv.math_comfort === m
                                    ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-400 font-medium"
                                    : "border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700"
                                }`}
                        >
                            <RadioGroupItem value={m} id={m} className="border-cyan-500/50 text-cyan-500" />
                            <span>{t(m)}</span>
                        </Label>
                    ))}
                </RadioGroup>
            </div>
        </div>
    );
}
