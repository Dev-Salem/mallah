"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, TrendingUp, Calendar, Target, ArrowRight, Loader2 } from "lucide-react";
import { useLocale } from "next-intl";
import { acceptRecommendationAction } from "../actions/onboarding-actions";
import { useRouter } from "@/lib/i18n/routing";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { AIRecommendationOutput } from "../services/ai-service";

interface Props {
    recommendation: AIRecommendationOutput & { id: string };
    userId: string;
}

export function RecommendationResult({ recommendation, userId }: Props) {
    const locale = useLocale();
    const router = useRouter();
    const [selectedPath, setSelectedPath] = React.useState<string>(recommendation.recommended_path_id);
    const [isAccepting, setIsAccepting] = React.useState(false);

    const handleAccept = async () => {
        setIsAccepting(true);
        const result = await acceptRecommendationAction(
            userId,
            recommendation.id,
            selectedPath as "frontend" | "fullstack" | "cybersecurity" | "datascience"
        );
        setIsAccepting(false);
        if (result.success) {
            router.push("/dashboard");
            return;
        }
        alert(result.error || "Failed to accept recommendation");
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-4xl mx-auto py-12 px-6 space-y-8"
            dir={locale === "ar" ? "rtl" : "ltr"}
        >
            <div className="text-center space-y-4">
                <Badge variant="outline" className="text-cyan-500 border-cyan-500/30 font-mono">
                    ANALYSIS_COMPLETE // CONFIDENCE_{recommendation.confidence_score}%
                </Badge>
                <h1 className="text-4xl font-serif text-slate-100">
                    Your Navigational Path: {recommendation.recommended_path_id.toUpperCase()}
                </h1>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto">{recommendation.explanation.summary}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm md:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-slate-100 flex items-center gap-2">
                            <TrendingUp className="text-cyan-500 w-5 h-5" />
                            Why this path?
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {recommendation.explanation.top_3_reasons.map((reason: string, i: number) => (
                            <div key={i} className="flex gap-4 items-start">
                                <div className="mt-1 bg-cyan-500/10 p-1 rounded-full shrink-0">
                                    <CheckCircle2 className="w-4 h-4 text-cyan-500" />
                                </div>
                                <p className="text-slate-300">{reason}</p>
                            </div>
                        ))}
                        <div className="mt-6 p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                            <h4 className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-widest font-mono">
                                Operational Preview
                            </h4>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                {recommendation.explanation.what_this_path_looks_like}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-slate-100 flex items-center gap-2 text-base">
                            <Calendar className="text-cyan-500 w-4 h-4" />
                            2-Week Starter Plan
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {recommendation.starter_plan_2_weeks.map((plan: any, i: number) => (
                            <div key={i} className="space-y-2">
                                <h4 className="text-xs font-mono text-cyan-500 uppercase tracking-widest">
                                    Week {plan.week}
                                </h4>
                                <ul className="space-y-2">
                                    {plan.actions.map((action: string, j: number) => (
                                        <li key={j} className="text-sm text-slate-400 flex items-center gap-2">
                                            <div className="w-1 h-1 bg-cyan-500 rounded-full shrink-0" />
                                            {action}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-cyan-950/20 border-cyan-500/20">
                    <CardHeader>
                        <CardTitle className="text-cyan-400 flex items-center gap-2 text-base">
                            <Target className="w-4 h-4" />
                            First Milestone: {recommendation.first_milestone.title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {recommendation.first_milestone.success_criteria.map((criteria: string, i: number) => (
                                <li key={i} className="text-sm text-slate-300 flex items-center gap-2">
                                    <div className="w-1 h-1 bg-cyan-400 rounded-full shrink-0" />
                                    {criteria}
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                {recommendation.alternatives?.length > 0 && (
                    <div className="space-y-4">
                        <h4 className="text-xs font-mono text-slate-500 uppercase tracking-widest">
                            Alternative Paths Considered
                        </h4>
                        <div className="space-y-2">
                            {recommendation.alternatives.map((alt: any, i: number) => (
                                <div key={i} className="p-3 bg-slate-900/20 border border-slate-800 rounded-lg text-sm">
                                    <span className="text-slate-200 font-medium">{alt.path_id.toUpperCase()}</span>
                                    <p className="text-slate-500 text-xs mt-1">{alt.why_it_was_close}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="flex flex-col items-center gap-4 pt-8">
                <div className="w-full max-w-sm">
                    <p className="text-xs text-slate-500 font-mono uppercase mb-2">Selected Path</p>
                    <Select value={selectedPath} onValueChange={setSelectedPath}>
                        <SelectTrigger className="bg-slate-900 border-slate-700 text-slate-200">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="frontend">Frontend</SelectItem>
                            <SelectItem value="fullstack">Fullstack</SelectItem>
                            <SelectItem value="cybersecurity">Cybersecurity</SelectItem>
                            <SelectItem value="datascience">Data Science</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Button
                    size="lg"
                    disabled={isAccepting}
                    onClick={handleAccept}
                    className="bg-cyan-600 hover:bg-cyan-500 text-white min-w-[200px] h-14 text-lg"
                >
                    {isAccepting ? (
                        <>
                            <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                            Accepting...
                        </>
                    ) : (
                        <>
                            Accept & Enter Command Center
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </>
                    )}
                </Button>
            </div>
        </motion.div>
    );
}
