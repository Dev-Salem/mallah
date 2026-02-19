"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Clock, Video, BookOpen, Wrench } from "lucide-react";

interface StepCommitmentProps {
    initialHours: string | null;
    initialStyle: string | null;
    onSave: (weeklyHours: string, learningStyle: string) => Promise<void>;
    onBack: () => void;
}

const HOURS_OPTIONS = [
    { value: "0-3", label: "0–3" },
    { value: "4-7", label: "4–7" },
    { value: "8-12", label: "8–12" },
    { value: "13+", label: "13+" },
] as const;

const STYLE_OPTIONS = [
    { value: "Video", icon: Video },
    { value: "Reading", icon: BookOpen },
    { value: "HandsOn", icon: Wrench },
] as const;

export function StepCommitment({ initialHours, initialStyle, onSave, onBack }: StepCommitmentProps) {
    const t = useTranslations("Onboarding");
    const [hours, setHours] = useState(initialHours || "");
    const [style, setStyle] = useState(initialStyle || "");
    const [loading, setLoading] = useState(false);

    const isValid = hours && style;

    async function handleSubmit() {
        if (!isValid) return;
        setLoading(true);
        try {
            await onSave(hours, style);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">
                    {t("step3Title")}
                </h2>
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                    {t("step3Subtitle")}
                </p>
            </div>

            {/* Weekly Hours */}
            <div>
                <label className="block text-[10px] font-mono text-primary uppercase tracking-[0.3em] mb-4">
                    <Clock className="inline h-3 w-3 me-2" />
                    {t("weeklyHoursLabel")}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {HOURS_OPTIONS.map(({ value, label }) => (
                        <button
                            key={value}
                            onClick={() => setHours(value)}
                            className={`
                p-4 border text-center transition-all duration-300 cursor-pointer
                ${hours === value
                                    ? "border-primary bg-primary/10 glow-border"
                                    : "border-white/10 bg-white/5 hover:border-white/20"
                                }
              `}
                        >
                            <span className="block text-lg font-black text-white">{label}</span>
                            <span className="text-[9px] font-mono text-muted-foreground uppercase">
                                {t("hoursPerWeek")}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Learning Style */}
            <div>
                <label className="block text-[10px] font-mono text-primary uppercase tracking-[0.3em] mb-4">
                    {t("learningStyleLabel")}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {STYLE_OPTIONS.map(({ value, icon: Icon }) => (
                        <button
                            key={value}
                            onClick={() => setStyle(value)}
                            className={`
                p-6 border text-center transition-all duration-300 cursor-pointer group
                ${style === value
                                    ? "border-primary bg-primary/10 glow-border"
                                    : "border-white/10 bg-white/5 hover:border-white/20"
                                }
              `}
                        >
                            <Icon className={`h-6 w-6 mx-auto mb-3 ${style === value ? "text-primary" : "text-white/40 group-hover:text-white/60"} transition-colors`} />
                            <span className="block text-sm font-bold text-white uppercase tracking-wide">
                                {t(`style_${value}`)}
                            </span>
                        </button>
                    ))}
                </div>
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
                    disabled={!isValid || loading}
                    className="flex-1 h-14 rounded-none uppercase tracking-[0.2em] font-mono text-[11px] bg-primary hover:bg-primary/90 text-primary-foreground transition-all group"
                >
                    {t("next")}
                    <ArrowRight className="ms-3 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </Button>
            </div>
        </div>
    );
}
