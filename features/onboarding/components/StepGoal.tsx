"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import type { PrimaryGoal } from "../types";
import { PRIMARY_GOALS } from "../types";
import { Building2, Laptop, Rocket, Search, ArrowLeft } from "lucide-react";

interface StepGoalProps {
    value?: PrimaryGoal;
    onSelect: (val: PrimaryGoal) => void;
    onBack: () => void;
}

const ICONS: Record<PrimaryGoal, React.ReactNode> = {
    job: <Building2 className="w-6 h-6" />,
    freelance: <Laptop className="w-6 h-6" />,
    startup: <Rocket className="w-6 h-6" />,
    exploring: <Search className="w-6 h-6" />,
};

export default function StepGoal({ value, onSelect, onBack }: StepGoalProps) {
    const t = useTranslations("Onboarding");

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-400">
            <div className="space-y-2">
                <p className="text-sm text-primary font-medium tracking-wide uppercase">
                    {t("stepLabel", { step: 2, total: 6 })}
                </p>
                <h2 className="text-2xl font-bold">{t("goal.question")}</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {PRIMARY_GOALS.map((goal) => (
                    <button
                        key={goal}
                        onClick={() => onSelect(goal)}
                        className={`
              glass rounded-xl p-5 text-start transition-all duration-200
              hover:glow-border hover:scale-[1.02] cursor-pointer
              ${value === goal ? "glow-border bg-primary/5" : ""}
            `}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                {ICONS[goal]}
                            </div>
                            <span className="font-medium">{t(`goal.options.${goal}`)}</span>
                        </div>
                    </button>
                ))}
            </div>

            <Button variant="ghost" onClick={onBack} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                {t("back")}
            </Button>
        </div>
    );
}
