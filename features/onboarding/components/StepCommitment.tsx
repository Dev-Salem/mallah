"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import type { WeeklyHours } from "../types";
import { WEEKLY_HOURS } from "../types";
import { MILESTONE_WEEKS, VELOCITY_MAP } from "../constants";
import { Clock, ArrowLeft, Zap } from "lucide-react";
import { useState } from "react";

interface StepCommitmentProps {
    value?: WeeklyHours;
    onSelect: (val: WeeklyHours) => void;
    onBack: () => void;
}

export default function StepCommitment({ value, onSelect, onBack }: StepCommitmentProps) {
    const t = useTranslations("Onboarding");
    const [preview, setPreview] = useState<WeeklyHours | undefined>(value);

    const milestoneWeeks = preview ? MILESTONE_WEEKS[preview] : null;
    const velocity = preview ? VELOCITY_MAP[preview] : null;

    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <p className="text-sm text-primary font-medium tracking-wide uppercase">
                    {t("stepLabel", { step: 3, total: 6 })}
                </p>
                <h2 className="text-2xl font-bold">{t("commitment.question")}</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {WEEKLY_HOURS.map((hours) => (
                    <button
                        key={hours}
                        onClick={() => {
                            setPreview(hours);
                        }}
                        className={`
              glass rounded-xl p-5 text-start transition-all duration-200
              hover:glow-border hover:scale-[1.02] cursor-pointer
              ${preview === hours ? "glow-border bg-primary/5" : ""}
            `}
                    >
                        <div className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-primary" />
                            <span className="font-medium">{t(`commitment.options.${hours}`)}</span>
                        </div>
                    </button>
                ))}
            </div>

            {/* Live milestone preview */}
            {milestoneWeeks && velocity && (
                <div className="glass rounded-xl p-4 flex items-start gap-3">
                    <Zap className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <p className="text-sm text-muted-foreground">
                        {t("commitment.preview", { weeks: milestoneWeeks })}
                    </p>
                </div>
            )}

            <div className="flex justify-between">
                <Button variant="ghost" onClick={onBack} className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    {t("back")}
                </Button>
                {preview && (
                    <Button onClick={() => onSelect(preview)} className="glow-border">
                        {t("continue")}
                    </Button>
                )}
            </div>
        </div>
    );
}
