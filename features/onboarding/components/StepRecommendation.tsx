"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { AIRecommendationResponse, PathId } from "../types";
import { PATH_IDS } from "../types";
import { PATH_CONTENT, getMatchLabel } from "../constants";
import { CheckCircle2, ArrowRight, Sparkles, Target, Book, Briefcase, Code2 } from "lucide-react";
import { useState } from "react";

interface StepRecommendationProps {
    recommendation: AIRecommendationResponse | null;
    isManualMode: boolean;
    error: string | null;
    onAccept: (pathId: PathId) => void;
}

export default function StepRecommendation({
    recommendation,
    isManualMode,
    error,
    onAccept,
}: StepRecommendationProps) {
    const t = useTranslations("Onboarding");
    const [showAllPaths, setShowAllPaths] = useState(isManualMode);
    const [accepting, setAccepting] = useState(false);
    const [selectedPath, setSelectedPath] = useState<PathId | null>(null);

    const handleAccept = async (pathId: PathId) => {
        setAccepting(true);
        setSelectedPath(pathId);
        await onAccept(pathId);
    };

    // AI recommendation view
    if (recommendation && !showAllPaths) {
        const path = PATH_CONTENT[recommendation.recommended_path_id];
        const matchLabel = getMatchLabel(recommendation.match_score);

        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Match score header */}
                <div className="text-center space-y-3">
                    <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2">
                        <Target className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">
                            {recommendation.match_score}% — {matchLabel}
                        </span>
                    </div>
                    <h2 className="text-2xl font-bold">{path.name}</h2>
                    <p className="text-muted-foreground">{path.oneLiner}</p>
                </div>

                {/* Why this fits you (AI-generated) */}
                <div className="glass rounded-xl p-5 space-y-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                        <Sparkles className="w-4 h-4" />
                        {t("recommendation.whyFits")}
                    </div>
                    <ul className="space-y-2">
                        {recommendation.reasons.map((reason, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                                <span>{reason}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* What you'll learn (pre-defined) */}
                <div className="glass rounded-xl p-5 space-y-3">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                        <Book className="w-4 h-4" />
                        {t("recommendation.whatYoullLearn")}
                    </div>
                    <p className="text-sm text-muted-foreground">{path.whatYoullLearn}</p>
                </div>

                {/* Skills */}
                <div className="glass rounded-xl p-5 space-y-3">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                        <Code2 className="w-4 h-4" />
                        {t("recommendation.skills")}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {path.skills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                                {skill}
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* Projects */}
                <div className="glass rounded-xl p-5 space-y-3">
                    <p className="text-sm font-semibold">{t("recommendation.projects")}</p>
                    <ol className="space-y-2 list-decimal list-inside">
                        {path.projects.map((proj) => (
                            <li key={proj} className="text-sm text-muted-foreground">{proj}</li>
                        ))}
                    </ol>
                </div>

                {/* Careers */}
                <div className="glass rounded-xl p-5 space-y-3">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                        <Briefcase className="w-4 h-4" />
                        {t("recommendation.careers")}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {path.careers.map((career) => (
                            <Badge key={career} variant="outline" className="text-xs">
                                {career}
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* Alternatives */}
                {recommendation.alternatives.length > 0 && (
                    <div className="glass rounded-xl p-5 space-y-3">
                        <p className="text-sm font-semibold">{t("recommendation.alternatives")}</p>
                        {recommendation.alternatives.map((alt) => (
                            <div key={alt.path_id} className="flex items-start gap-2 text-sm">
                                <ArrowRight className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                                <div>
                                    <span className="font-medium">
                                        {PATH_CONTENT[alt.path_id as PathId]?.name}
                                    </span>
                                    <span className="text-muted-foreground"> — {alt.reason}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button
                        size="lg"
                        className="flex-1 glow-border gap-2"
                        onClick={() => handleAccept(recommendation.recommended_path_id)}
                        disabled={accepting}
                    >
                        {accepting && selectedPath === recommendation.recommended_path_id ? (
                            <span className="animate-pulse">{t("recommendation.accepting")}</span>
                        ) : (
                            <>
                                {t("recommendation.startButton")}
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={() => setShowAllPaths(true)}
                        disabled={accepting}
                    >
                        {t("recommendation.chooseDifferent")}
                    </Button>
                </div>
            </div>
        );
    }

    // Manual path selection (AI failed or user chose different)
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">{t("manual.title")}</h2>
                <p className="text-muted-foreground text-sm">{t("manual.subtitle")}</p>
                {error && (
                    <p className="text-sm text-destructive">{error}</p>
                )}
            </div>

            <div className="grid grid-cols-1 gap-4">
                {PATH_IDS.map((pathId) => {
                    const path = PATH_CONTENT[pathId];
                    return (
                        <button
                            key={pathId}
                            onClick={() => handleAccept(pathId)}
                            disabled={accepting}
                            className={`
                glass rounded-xl p-5 text-start transition-all duration-200
                hover:glow-border cursor-pointer
                ${accepting && selectedPath === pathId ? "glow-border" : ""}
              `}
                        >
                            <h3 className="font-semibold">{path.name}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{path.oneLiner}</p>
                            <div className="flex flex-wrap gap-1 mt-3">
                                {path.skills.slice(0, 4).map((skill) => (
                                    <Badge key={skill} variant="secondary" className="text-xs">
                                        {skill}
                                    </Badge>
                                ))}
                                {path.skills.length > 4 && (
                                    <Badge variant="secondary" className="text-xs">
                                        +{path.skills.length - 4}
                                    </Badge>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>

            {recommendation && (
                <Button variant="ghost" onClick={() => setShowAllPaths(false)}>
                    {t("manual.backToRecommendation")}
                </Button>
            )}
        </div>
    );
}
