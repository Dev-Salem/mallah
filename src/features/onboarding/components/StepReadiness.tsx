import React from "react";
import { useTranslations } from "next-intl";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ConfidenceSnapshot } from "../types";

interface Props {
    value?: ConfidenceSnapshot;
    onChange: (value: ConfidenceSnapshot) => void;
}

export function StepReadiness({ value, onChange }: Props) {
    const t = useTranslations("Onboarding.Step6");

    const cv = value || {
        git: 'Never',
        cli: 'Never',
        programming: 'Never',
        apis: 'Never',
        db: 'Never',
        web: 'Never',
    };

    const handleUpdate = (key: keyof ConfidenceSnapshot, val: string) => {
        onChange({ ...cv, [key]: val as any });
    };

    const tools = [
        { key: "git", label: "Git / Version Control" },
        { key: "cli", label: "Command Line / Terminal" },
        { key: "programming", label: "Writing Small Programs" },
        { key: "apis", label: "Understanding APIs" },
        { key: "db", label: "Database Basics" },
        { key: "web", label: "Web Fundamentals (HTML/CSS)" },
    ];

    const levels: ('Never' | 'Tried' | 'Comfortable')[] = ['Never', 'Tried', 'Comfortable'];

    return (
        <div className="space-y-6 overflow-y-auto max-h-[450px] pr-2">
            <h2 className="text-xl font-medium text-slate-200">{t("question")}</h2>
            <div className="space-y-6">
                {tools.map((tool) => (
                    <div key={tool.key} className="space-y-3">
                        <Label className="text-slate-300 font-medium">{tool.label}</Label>
                        <RadioGroup
                            value={cv[tool.key as keyof ConfidenceSnapshot]}
                            onValueChange={(v) => handleUpdate(tool.key as keyof ConfidenceSnapshot, v)}
                            className="flex gap-4 md:gap-6"
                        >
                            {levels.map((l) => (
                                <Label
                                    key={l}
                                    htmlFor={`${tool.key}-${l}`}
                                    className={`flex items-center gap-2 cursor-pointer transition-colors group px-3 py-1.5 rounded-lg border
                                        ${cv[tool.key as keyof ConfidenceSnapshot] === l
                                            ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-400"
                                            : "border-transparent text-slate-400 hover:text-slate-300 hover:bg-slate-800/50"
                                        }`}
                                >
                                    <RadioGroupItem value={l} id={`${tool.key}-${l}`} className="border-cyan-500/50 text-cyan-500" />
                                    <span className="text-sm font-medium">{t(l)}</span>
                                </Label>
                            ))}
                        </RadioGroup>
                    </div>
                ))}
            </div>
        </div>
    );
}
