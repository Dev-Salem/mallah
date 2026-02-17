"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, List, Compass } from "lucide-react";
import type { Path, InterestScores } from "@/features/onboarding/types";

interface StepRecommendationProps {
    recommendedPath: Path | null;
    allPaths: Path[];
    onAccept: (pathId: string) => Promise<void>;
    onBack: () => void;
}

export function StepRecommendation({
    recommendedPath,
    allPaths,
    onAccept,
    onBack,
}: StepRecommendationProps) {
    const t = useTranslations("Onboarding");
    const locale = useLocale();
    const isArabic = locale === "ar";
    const [showAll, setShowAll] = useState(false);
    const [selectedPathId, setSelectedPathId] = useState<string>(
        recommendedPath?.id || ""
    );
    const [loading, setLoading] = useState(false);

    const displayPath = allPaths.find((p) => p.id === selectedPathId);

    async function handleAccept() {
        if (!selectedPathId) return;
        setLoading(true);
        try {
            await onAccept(selectedPathId);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-8">
            <div className="text-center">
                <div className="inline-block p-4 border border-primary/20 bg-primary/5 mb-6">
                    <Compass className="h-10 w-10 text-primary" />
                </div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">
                    {t("step7Title")}
                </h2>
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                    {t("step7Subtitle")}
                </p>
            </div>

            {/* Recommended Path Card */}
            {!showAll && displayPath && (
                <div className="glass border-primary/30 p-8 text-center glow-border">
                    <span className="text-[9px] font-mono text-primary uppercase tracking-[0.4em] mb-4 block">
                        {t("recommendedFor")}
                    </span>
                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">
                        {isArabic ? displayPath.name_ar : displayPath.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-8 max-w-md mx-auto">
                        {isArabic ? displayPath.description_ar : displayPath.description}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            onClick={handleAccept}
                            disabled={loading}
                            className="h-14 px-10 rounded-none uppercase tracking-[0.2em] font-mono text-[11px] bg-primary hover:bg-primary/90 text-primary-foreground transition-all group"
                        >
                            <Check className="me-3 h-4 w-4" />
                            {t("acceptRecommendation")}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setShowAll(true)}
                            className="h-14 px-8 rounded-none border-white/10 hover:bg-white/5 text-white uppercase tracking-[0.2em] font-mono text-[11px] group"
                        >
                            <List className="me-3 h-3 w-3" />
                            {t("chooseAnother")}
                        </Button>
                    </div>
                </div>
            )}

            {/* All Paths List */}
            {showAll && (
                <div className="space-y-3">
                    {allPaths.map((path) => (
                        <button
                            key={path.id}
                            onClick={() => setSelectedPathId(path.id)}
                            className={`
                w-full p-6 border text-start transition-all duration-300 cursor-pointer group
                ${selectedPathId === path.id
                                    ? "border-primary bg-primary/10 glow-border"
                                    : "border-white/10 bg-white/5 hover:border-white/20"
                                }
              `}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="block text-sm font-bold text-white uppercase tracking-wide">
                                        {isArabic ? path.name_ar : path.name}
                                    </span>
                                    <span className="block text-xs text-muted-foreground mt-1">
                                        {isArabic ? path.description_ar : path.description}
                                    </span>
                                </div>
                                {selectedPathId === path.id && (
                                    <Check className="h-5 w-5 text-primary shrink-0" />
                                )}
                            </div>
                        </button>
                    ))}

                    <Button
                        onClick={handleAccept}
                        disabled={!selectedPathId || loading}
                        className="w-full h-14 rounded-none uppercase tracking-[0.2em] font-mono text-[11px] bg-primary hover:bg-primary/90 text-primary-foreground transition-all group mt-4"
                    >
                        <Check className="me-3 h-4 w-4" />
                        {t("confirmSelection")}
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() => {
                            setShowAll(false);
                            setSelectedPathId(recommendedPath?.id || "");
                        }}
                        className="w-full h-12 rounded-none border-white/10 hover:bg-white/5 text-white uppercase tracking-[0.15em] font-mono text-[10px]"
                    >
                        {t("backToRecommendation")}
                    </Button>
                </div>
            )}

            <div className="pt-4">
                <Button
                    variant="outline"
                    onClick={onBack}
                    className="h-14 px-8 rounded-none border-white/10 hover:bg-white/5 text-white uppercase tracking-[0.2em] font-mono text-[11px] group"
                >
                    <ArrowLeft className="me-3 h-3 w-3 group-hover:-translate-x-1 transition-transform" />
                    {t("back")}
                </Button>
            </div>
        </div>
    );
}
