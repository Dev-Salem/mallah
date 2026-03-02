"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { CONFIDENCE_STATEMENTS } from "../constants";
import type { ConfidenceItem, ConfidenceLevel } from "../types";
import { CONFIDENCE_LEVELS } from "../types";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

interface StepConfidenceProps {
    items: ConfidenceItem[];
    onSubmit: (items: ConfidenceItem[]) => void;
    onBack: () => void;
}

export default function StepConfidence({ items: initialItems, onSubmit, onBack }: StepConfidenceProps) {
    const t = useTranslations("Onboarding");
    const [items, setItems] = useState<ConfidenceItem[]>(initialItems);

    const setLevel = (key: string, level: ConfidenceLevel) => {
        setItems((prev) =>
            prev.map((item) => (item.key === key ? { ...item, level } : item))
        );
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-400">
            <div className="space-y-2">
                <p className="text-sm text-primary font-medium tracking-wide uppercase">
                    {t("stepLabel", { step: 5, total: 6 })}
                </p>
                <h2 className="text-2xl font-bold">{t("confidence.question")}</h2>
                <p className="text-muted-foreground text-sm">{t("confidence.hint")}</p>
            </div>

            <div className="space-y-4">
                {CONFIDENCE_STATEMENTS.map((stmt) => {
                    const currentLevel = items.find((i) => i.key === stmt.key)?.level || "never";
                    return (
                        <div key={stmt.key} className="glass rounded-xl p-4 space-y-3">
                            <p className="text-sm font-medium">
                                {t(`confidence.statements.${stmt.key}`)}
                            </p>
                            <div className="flex gap-2">
                                {CONFIDENCE_LEVELS.map((level) => (
                                    <button
                                        key={level}
                                        onClick={() => setLevel(stmt.key, level)}
                                        className={`
                      px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer
                      ${currentLevel === level
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                                            }
                    `}
                                    >
                                        {t(`confidence.levels.${level}`)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex justify-between">
                <Button variant="ghost" onClick={onBack} className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    {t("back")}
                </Button>
                <Button onClick={() => onSubmit(items)} className="glow-border">
                    {t("continue")}
                </Button>
            </div>
        </div>
    );
}
