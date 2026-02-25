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
                <RadioGroup value={iv.choice} onValueChange={(v) => onChange({ ...iv, choice: v as any })}>
                    {choices.map((c) => (
                        <div key={c} className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value={c} id={c} />
                            <Label htmlFor={c} className="cursor-pointer text-slate-300">{t(c.charAt(0).toUpperCase() + c.slice(1))}</Label>
                        </div>
                    ))}
                </RadioGroup>
            </div>

            <Separator className="bg-slate-800" />

            <div className="space-y-4">
                <h3 className="text-lg font-medium text-slate-200">Problem Style</h3>
                <RadioGroup value={iv.ambiguity} onValueChange={(v) => onChange({ ...iv, ambiguity: v as any })}>
                    {ambiguity.map((a) => (
                        <div key={a} className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value={a} id={a} />
                            <Label htmlFor={a} className="cursor-pointer text-slate-300">{t(a.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(''))}</Label>
                        </div>
                    ))}
                </RadioGroup>
            </div>

            <Separator className="bg-slate-800" />

            <div className="space-y-4">
                <h3 className="text-lg font-medium text-slate-200">{t("MathComfort")}</h3>
                <RadioGroup value={iv.math_comfort} onValueChange={(v) => onChange({ ...iv, math_comfort: v as any })} className="flex space-x-6 space-x-reverse">
                    {math.map((m) => (
                        <div key={m} className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value={m} id={m} />
                            <Label htmlFor={m} className="cursor-pointer text-slate-300">{m}</Label>
                        </div>
                    ))}
                </RadioGroup>
            </div>
        </div>
    );
}
