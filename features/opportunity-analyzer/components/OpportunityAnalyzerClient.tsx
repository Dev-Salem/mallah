"use client";

import React, { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Radar, Search, Loader2, CheckCircle, XCircle, ArrowRight, Sparkles } from "lucide-react";
import { analyzeJobDescription } from "../actions/opportunity-actions";
import type { OpportunityAnalysis } from "../types";
import { useRouter } from "next/navigation";

interface Props {
    analyses: OpportunityAnalysis[];
}

export function OpportunityAnalyzerClient({ analyses }: Props) {
    const t = useTranslations("OpportunityAnalyzer");
    const locale = useLocale();
    const isArabic = locale === "ar";
    const router = useRouter();

    const [jobDesc, setJobDesc] = useState("");
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<OpportunityAnalysis | null>(null);
    const [error, setError] = useState<string | null>(null);

    async function handleAnalyze() {
        if (!jobDesc.trim()) return;
        setAnalyzing(true);
        setError(null);
        setResult(null);

        try {
            const res = await analyzeJobDescription(jobDesc.trim());
            if ("error" in res && res.error) {
                setError(res.error);
            } else if ("analysis" in res && res.analysis) {
                setResult(res.analysis);
                router.refresh();
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setAnalyzing(false);
        }
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h1 className={`text-3xl lg:text-4xl font-black text-white uppercase ${!isArabic ? "tracking-tighter" : ""} mb-2`}>
                    {t("title")}
                </h1>
                <p className={`text-[10px] font-mono text-muted-foreground uppercase ${!isArabic ? "tracking-[0.2em]" : ""}`}>
                    {t("subtitle")}
                </p>
            </div>

            {/* Input Area */}
            <div className="glass border-white/5 p-8 space-y-4">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 border border-primary/20">
                        <Search className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className={`text-white font-bold uppercase ${!isArabic ? "tracking-widest" : ""} text-sm`}>
                        {t("inputTitle")}
                    </h2>
                </div>
                <textarea
                    value={jobDesc}
                    onChange={(e) => setJobDesc(e.target.value)}
                    rows={8}
                    placeholder={t("inputPlaceholder")}
                    className="w-full p-4 bg-white/5 border border-white/10 text-white text-sm font-mono leading-relaxed focus:border-primary/40 focus:outline-none resize-y transition-colors placeholder:text-white/20"
                />
                <button
                    onClick={handleAnalyze}
                    disabled={analyzing || !jobDesc.trim()}
                    className="h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground uppercase tracking-[0.2em] font-mono text-[10px] flex items-center gap-2 disabled:opacity-30 transition-all cursor-pointer"
                >
                    {analyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                    {t("analyzeButton")}
                </button>
            </div>

            {/* Error */}
            {error && (
                <div className="p-4 border border-red-500/30 bg-red-500/10 text-red-400 text-sm font-mono">
                    {error}
                </div>
            )}

            {/* Result */}
            {result && <AnalysisResult analysis={result} t={t} isArabic={isArabic} />}

            {/* Past Analyses */}
            {analyses.length > 0 && !result && (
                <div className="space-y-4">
                    <h3 className={`text-sm font-bold text-white uppercase ${!isArabic ? "tracking-widest" : ""}`}>
                        {t("pastAnalyses")}
                    </h3>
                    {analyses.map((a) => (
                        <button
                            key={a.id}
                            onClick={() => setResult(a)}
                            className="w-full glass border-white/5 p-4 flex items-center justify-between hover:border-primary/20 transition-all text-left cursor-pointer"
                        >
                            <div>
                                <p className="text-white text-sm font-medium">{a.job_title || t("untitledJob")}</p>
                                <p className={`text-[10px] font-mono text-muted-foreground uppercase ${!isArabic ? "tracking-widest" : ""}`}>
                                    {t("matchScore")}: {a.match_score}%
                                </p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

function AnalysisResult({ analysis, t, isArabic }: { analysis: OpportunityAnalysis; t: any; isArabic: boolean }) {
    return (
        <div className="space-y-6">
            {/* Title & Score */}
            <div className="glass border-white/5 p-6 flex items-center justify-between">
                <div>
                    <h2 className={`text-xl font-bold text-white uppercase ${!isArabic ? "tracking-wider" : ""}`}>
                        {analysis.job_title || t("untitledJob")}
                    </h2>
                    {analysis.seniority && (
                        <span className={`text-[10px] font-mono text-primary uppercase ${!isArabic ? "tracking-widest" : ""}`}>
                            {analysis.seniority}
                        </span>
                    )}
                </div>
                <div className="text-right">
                    <span className={`text-[10px] font-mono text-muted-foreground uppercase ${!isArabic ? "tracking-widest" : ""}`}>
                        {t("matchScore")}
                    </span>
                    <div className={`text-3xl font-black ${(analysis.match_score || 0) >= 70 ? "text-green-400" :
                            (analysis.match_score || 0) >= 40 ? "text-amber-400" : "text-red-400"
                        }`}>
                        {analysis.match_score}%
                    </div>
                </div>
            </div>

            {/* Skills */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Matched */}
                <div className="glass border-white/5 p-4">
                    <h3 className={`text-[10px] font-mono text-green-400 uppercase ${!isArabic ? "tracking-widest" : ""} mb-3 flex items-center gap-2`}>
                        <CheckCircle className="h-3 w-3" />
                        {t("matchedSkills")}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {analysis.matched_skills?.map((s, i) => (
                            <span key={i} className="px-2 py-1 bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-mono">
                                {s}
                            </span>
                        ))}
                        {(!analysis.matched_skills || analysis.matched_skills.length === 0) && (
                            <span className="text-[10px] text-muted-foreground font-mono">{t("none")}</span>
                        )}
                    </div>
                </div>

                {/* Missing */}
                <div className="glass border-white/5 p-4">
                    <h3 className={`text-[10px] font-mono text-red-400 uppercase ${!isArabic ? "tracking-widest" : ""} mb-3 flex items-center gap-2`}>
                        <XCircle className="h-3 w-3" />
                        {t("missingSkills")}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {analysis.missing_skills?.map((s, i) => (
                            <span key={i} className="px-2 py-1 bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-mono">
                                {s}
                            </span>
                        ))}
                        {(!analysis.missing_skills || analysis.missing_skills.length === 0) && (
                            <span className="text-[10px] text-muted-foreground font-mono">{t("none")}</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Action Plan */}
            {analysis.action_plan && (
                <div className="glass border-white/5 p-6">
                    <h3 className={`text-sm font-bold text-white uppercase ${!isArabic ? "tracking-widest" : ""} mb-4 flex items-center gap-2`}>
                        <Sparkles className="h-4 w-4 text-primary" />
                        {t("actionPlan")}
                    </h3>
                    <div className="text-white/80 text-sm leading-relaxed font-light whitespace-pre-wrap">
                        {analysis.action_plan}
                    </div>
                </div>
            )}
        </div>
    );
}
