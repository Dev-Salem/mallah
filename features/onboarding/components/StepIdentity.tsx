"use client";

import { useTranslations } from "next-intl";
import type { BackgroundType } from "../types";
import { BACKGROUND_TYPES } from "../types";
import { GraduationCap, Briefcase, RefreshCw, HelpCircle } from "lucide-react";

interface StepIdentityProps {
    value?: BackgroundType;
    onSelect: (val: BackgroundType) => void;
}

const ICONS: Record<BackgroundType, React.ReactNode> = {
    student: <GraduationCap className="w-6 h-6" />,
    fresh_grad: <Briefcase className="w-6 h-6" />,
    career_shifter: <RefreshCw className="w-6 h-6" />,
    no_tech: <HelpCircle className="w-6 h-6" />,
};

export default function StepIdentity({ value, onSelect }: StepIdentityProps) {
    const t = useTranslations("Onboarding");

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-400">
            <div className="space-y-2">
                <p className="text-sm text-primary font-medium tracking-wide uppercase">
                    {t("stepLabel", { step: 1, total: 6 })}
                </p>
                <h2 className="text-2xl font-bold">{t("identity.question")}</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {BACKGROUND_TYPES.map((type) => (
                    <button
                        key={type}
                        onClick={() => onSelect(type)}
                        className={`
              glass rounded-xl p-5 text-start transition-all duration-200
              hover:glow-border hover:scale-[1.02] cursor-pointer
              ${value === type ? "glow-border bg-primary/5" : ""}
            `}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                {ICONS[type]}
                            </div>
                            <span className="font-medium">{t(`identity.options.${type}`)}</span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
