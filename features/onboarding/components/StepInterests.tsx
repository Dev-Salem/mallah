"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { INTEREST_SIGNALS } from "../constants";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useState } from "react";

interface StepInterestsProps {
    selected: string[];
    onSubmit: (vals: string[]) => void;
    onBack: () => void;
}

export default function StepInterests({ selected: initialSelected, onSubmit, onBack }: StepInterestsProps) {
    const t = useTranslations("Onboarding");
    const [selected, setSelected] = useState<string[]>(initialSelected);

    const toggle = (id: string) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
        );
    };

    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <p className="text-sm text-primary font-medium tracking-wide uppercase">
                    {t("stepLabel", { step: 4, total: 6 })}
                </p>
                <h2 className="text-2xl font-bold">{t("interests.question")}</h2>
                <p className="text-muted-foreground text-sm">{t("interests.hint")}</p>
            </div>

            <div className="space-y-3">
                {INTEREST_SIGNALS.map((signal) => (
                    <button
                        key={signal.id}
                        onClick={() => toggle(signal.id)}
                        className={`
              glass rounded-xl p-4 w-full text-start transition-all duration-200
              hover:glow-border cursor-pointer flex items-center gap-3
              ${selected.includes(signal.id) ? "glow-border bg-primary/5" : ""}
            `}
                    >
                        <div
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all shrink-0 ${selected.includes(signal.id)
                                    ? "bg-primary border-primary"
                                    : "border-muted-foreground/30"
                                }`}
                        >
                            {selected.includes(signal.id) && (
                                <Sparkles className="w-3 h-3 text-primary-foreground" />
                            )}
                        </div>
                        <span className="text-sm">
                            {t(`interests.signals.${signal.id}`)}
                        </span>
                    </button>
                ))}
            </div>

            <div className="flex justify-between">
                <Button variant="ghost" onClick={onBack} className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    {t("back")}
                </Button>
                <Button onClick={() => onSubmit(selected)} className="glow-border">
                    {t("continue")}
                </Button>
            </div>
        </div>
    );
}
