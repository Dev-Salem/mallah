"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { AIRecommendationResponse, PathId } from "../types";
import { PATH_IDS } from "../types";
import { PATH_CONTENT, getMatchLabel } from "../constants";
import { CheckCircle2, ArrowRight, Sparkles, Briefcase, Code2, Layers, Cpu, Info } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

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

    const radius = 60;
    const circumference = 2 * Math.PI * radius;

    if (recommendation && !showAllPaths) {
        const path = PATH_CONTENT[recommendation.recommended_path_id];
        const matchLabel = getMatchLabel(recommendation.match_score);
        const offset = circumference - (recommendation.match_score / 100) * circumference;

        return (
            <div className="w-full max-w-6xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row items-center gap-8 md:items-start text-center md:text-left">
                    <div className="relative shrink-0 w-40 h-40 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90">
                            <circle
                                cx="80"
                                cy="80"
                                r={radius}
                                className="stroke-muted fill-none"
                                strokeWidth="8"
                            />
                            <circle
                                cx="80"
                                cy="80"
                                r={radius}
                                className="stroke-primary fill-none"
                                strokeWidth="8"
                                strokeDasharray={circumference}
                                strokeDashoffset={offset}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl font-bold text-primary">{recommendation.match_score}%</span>
                            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold px-2 text-center leading-tight">
                                {matchLabel.label}
                            </span>
                        </div>
                    </div>

                    <div className="flex-1 space-y-4">
                        <div>
                            <Badge variant="outline" className="mb-2 text-primary border-primary/20 bg-primary/5 uppercase tracking-widest text-[10px]">
                                {t("recommendation.matchLabel")}
                            </Badge>
                            <h2 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                                {path.name}
                            </h2>
                            <p className="text-xl text-muted-foreground mt-2 font-medium">
                                {path.oneLiner}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-4 items-center justify-center md:justify-start">
                            <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground glass px-3 py-1.5 rounded-full border border-white/5">
                                <Cpu className="w-3.5 h-3.5" />
                                <span>Deterministic: {recommendation.base_score}%</span>
                            </div>
                            {recommendation.ai_adjustment !== 0 && (
                                <div className={cn(
                                    "flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-full border border-white/5",
                                    recommendation.ai_adjustment > 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-orange-500/10 text-orange-400"
                                )}>
                                    <Sparkles className="w-3.5 h-3.5" />
                                    <span>AI Logic: {recommendation.ai_adjustment > 0 ? "+" : ""}{recommendation.ai_adjustment}%</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                        <section className="glass p-6 rounded-2xl border border-white/5 space-y-4 relative overflow-hidden group">
                           <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                               <Sparkles className="w-16 h-16 text-primary" />
                           </div>
                            <div className="flex items-center gap-2 text-sm font-semibold text-primary uppercase tracking-wider">
                                <Info className="w-4 h-4" />
                                {t("recommendation.whyFits")}
                            </div>
                            <div className="space-y-4">
                                {recommendation.adjustment_reason && (
                                    <p className="text-sm font-medium italic text-muted-foreground leading-relaxed border-l-2 border-primary/20 pl-4 py-1">
                                        &quot;{recommendation.adjustment_reason}&quot;
                                    </p>
                                )}
                                <ul className="space-y-3">
                                    {recommendation.reasons.map((reason, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm">
                                            <div className="mt-1 p-0.5 rounded-full bg-primary/20">
                                                <CheckCircle2 className="w-3 h-3 text-primary shrink-0" />
                                            </div>
                                            <span className="text-foreground/90">{reason}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>

                        <section className="glass p-6 rounded-2xl border border-white/5 space-y-4">
                            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                <Layers className="w-4 h-4" />
                                {t("recommendation.projects")}
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                                {path.projects.map((proj, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] transition-colors">
                                        <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                                            0{i + 1}
                                        </div>
                                        <span className="text-sm font-medium">{proj.title}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    <div className="space-y-6">
                        <section className="glass p-6 rounded-2xl border border-white/5 space-y-4">
                            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                <Briefcase className="w-4 h-4" />
                                {t("recommendation.careers")}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {path.careers.map((career) => (
                                    <Badge key={career} variant="outline" className="text-xs px-3 py-1 bg-white/[0.02] border-white/10 hover:border-primary/40 transition-colors">
                                        {career}
                                    </Badge>
                                ))}
                            </div>
                        </section>

                        <section className="glass p-6 rounded-2xl border border-white/5 space-y-4">
                            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                <Code2 className="w-4 h-4" />
                                {t("recommendation.skills")}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {path.skills.map((skill) => (
                                    <Badge key={skill} variant="secondary" className="text-xs px-3 py-1 bg-primary/10 text-primary border-none">
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </section>

                        {recommendation.alternatives.length > 0 && (
                            <section className="glass p-6 rounded-2xl border border-white/5 space-y-4">
                                <div className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                    {t("recommendation.alternatives")}
                                </div>
                                <div className="space-y-4">
                                    {recommendation.alternatives.map((alt) => (
                                        <div key={alt.path_id} className="group cursor-help">
                                            <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground group-hover:text-foreground transition-colors">
                                                <div className="w-1 h-1 rounded-full bg-primary" />
                                                {PATH_CONTENT[alt.path_id as PathId]?.name}
                                            </div>
                                            <p className="text-[11px] text-muted-foreground mt-1 pl-3 leading-relaxed opacity-70">
                                                {alt.reason}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 pt-6">
                    <Button
                        size="lg"
                        className="flex-1 h-16 text-lg font-bold glow-border bg-primary hover:bg-primary/90 text-primary-foreground group"
                        onClick={() => handleAccept(recommendation.recommended_path_id)}
                        disabled={accepting}
                    >
                        {accepting && selectedPath === recommendation.recommended_path_id ? (
                            <span className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-current animate-ping" />
                                {t("recommendation.accepting")}
                            </span>
                        ) : (
                            <>
                                {t("recommendation.startButton")}
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        className="h-16 px-8 text-muted-foreground hover:text-foreground glass border-white/10"
                        onClick={() => setShowAllPaths(true)}
                        disabled={accepting}
                    >
                        {t("recommendation.chooseDifferent")}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
                <h2 className="text-3xl font-extrabold tracking-tight">{t("manual.title")}</h2>
                <p className="text-muted-foreground text-lg">{t("manual.subtitle")}</p>
                {error && (
                    <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive font-medium inline-block mx-auto">
                        {error}
                    </div>
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
                            className={cn(
                                "glass group relative flex flex-col md:flex-row md:items-center justify-between p-6 rounded-2xl text-start transition-all duration-300 border border-white/5 hover:border-primary/40",
                                accepting && selectedPath === pathId ? "glow-border ring-1 ring-primary/50" : ""
                            )}
                        >
                            <div className="space-y-2 flex-1">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-xl font-bold">{path.name}</h3>
                                    <div className="hidden md:block w-8 h-[1px] bg-white/10 group-hover:bg-primary transition-colors" />
                                </div>
                                <p className="text-sm text-muted-foreground font-medium">{path.oneLiner}</p>
                                <div className="flex flex-wrap gap-2 pt-1">
                                    {path.skills.slice(0, 4).map((skill) => (
                                        <Badge key={skill} variant="secondary" className="text-[10px] bg-white/5 hover:bg-white/10 transition-colors">
                                            {skill}
                                        </Badge>
                                    ))}
                                    {path.skills.length > 4 && (
                                        <span className="text-[10px] text-muted-foreground font-mono">+{path.skills.length - 4}</span>
                                    )}
                                </div>
                            </div>

                            <div className="mt-4 md:mt-0 flex items-center justify-end">
                                <div className="w-10 h-10 rounded-full bg-white/5 group-hover:bg-primary/20 flex items-center justify-center transition-all">
                                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            {recommendation && (
                <div className="flex justify-center pt-4">
                    <Button variant="ghost" className="text-muted-foreground hover:text-primary" onClick={() => setShowAllPaths(false)}>
                        <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                        {t("manual.backToRecommendation")}
                    </Button>
                </div>
            )}
        </div>
    );
}