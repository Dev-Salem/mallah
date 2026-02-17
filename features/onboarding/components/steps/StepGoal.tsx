"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Building2, Laptop, Rocket } from "lucide-react";

interface StepGoalProps {
    initialValue: string | null;
    onSave: (primaryGoal: string) => Promise<void>;
    onBack: () => void;
}

const OPTIONS = [
    { value: "full_time_job", icon: Building2 },
    { value: "freelance", icon: Laptop },
    { value: "own_project", icon: Rocket },
] as const;

export function StepGoal({ initialValue, onSave, onBack }: StepGoalProps) {
    const t = useTranslations("Onboarding");
    const [selected, setSelected] = useState<string>(initialValue || "");
    const [loading, setLoading] = useState(false);

    async function handleSubmit() {
        if (!selected) return;
        setLoading(true);
        try {
            await onSave(selected);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">
                    {t("step5Title")}
                </h2>
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                    {t("step5Subtitle")}
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {OPTIONS.map(({ value, icon: Icon }) => (
                    <button
                        key={value}
                        onClick={() => setSelected(value)}
                        className={`
              relative p-8 border text-center transition-all duration-300 group cursor-pointer
              ${selected === value
                                ? "border-primary bg-primary/10 glow-border"
                                : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8"
                            }
            `}
                    >
                        <Icon className={`h-8 w-8 mx-auto mb-4 ${selected === value ? "text-primary" : "text-white/40 group-hover:text-white/60"} transition-colors`} />
                        <span className="block text-sm font-bold text-white uppercase tracking-wide">
                            {t(`goal_${value}`)}
                        </span>
                    </button>
                ))}
            </div>

            <div className="flex gap-4">
                <Button
                    variant="outline"
                    onClick={onBack}
                    className="h-14 px-8 rounded-none border-white/10 hover:bg-white/5 text-white uppercase tracking-[0.2em] font-mono text-[11px] group"
                >
                    <ArrowLeft className="me-3 h-3 w-3 group-hover:-translate-x-1 transition-transform" />
                    {t("back")}
                </Button>
                <Button
                    onClick={handleSubmit}
                    disabled={!selected || loading}
                    className="flex-1 h-14 rounded-none uppercase tracking-[0.2em] font-mono text-[11px] bg-primary hover:bg-primary/90 text-primary-foreground transition-all group"
                >
                    {t("next")}
                    <ArrowRight className="ms-3 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </Button>
            </div>
        </div>
    );
}
