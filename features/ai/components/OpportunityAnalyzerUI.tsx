'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Loader2, Briefcase, Target, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { analyzeOpportunityAction } from '../../ai/actions/analyzer-actions';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

export function OpportunityAnalyzerUI() {
    const t = useTranslations('Dashboard.Opportunities');
    const [jobDescription, setJobDescription] = React.useState('');
    const [isAnalyzing, setIsAnalyzing] = React.useState(false);
    const [result, setResult] = React.useState<any>(null);
    const [error, setError] = React.useState<string | null>(null);

    const handleAnalyze = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!jobDescription.trim()) return;

        setIsAnalyzing(true);
        setError(null);

        const res = await analyzeOpportunityAction(jobDescription);

        if (res.success && res.analysis) {
            setResult(res.analysis);
        } else {
            setError(res.error || t('errorFallback'));
        }

        setIsAnalyzing(false);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-4">
                <h2 className="text-3xl font-black flex items-center gap-3">
                    <Target className="w-8 h-8 text-primary" />
                    {t('pageTitle')}
                </h2>
                <p className="text-muted-foreground">
                    {t('pageDescription')}
                </p>
            </div>

            <form onSubmit={handleAnalyze} className="space-y-4 bg-card border rounded-2xl p-6 shadow-sm">
                <div>
                    <label htmlFor="jd" className="block text-sm font-medium mb-2 border-b pb-2">
                        <Briefcase className="w-4 h-4 inline-block mr-2" />
                        {t('pasteJobLabel')}
                    </label>
                    <textarea
                        id="jd"
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder={t('pasteJobPlaceholder')}
                        className="w-full h-48 sm:h-64 p-4 border rounded-xl bg-background text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    />
                </div>

                <div className="flex justify-end">
                    <Button
                        type="submit"
                        disabled={isAnalyzing || !jobDescription.trim()}
                        className="gap-2 px-8 py-6 rounded-full font-bold text-base w-full sm:w-auto"
                    >
                        {isAnalyzing ? (
                            <><Loader2 className="w-5 h-5 animate-spin" /> {t('analyzing')}</>
                        ) : (
                            <><Target className="w-5 h-5" /> {t('analyzeButton')}</>
                        )}
                    </Button>
                </div>

                {error && (
                    <div className="p-4 bg-destructive/10 text-destructive text-sm rounded-lg flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <p>{error}</p>
                    </div>
                )}
            </form>

            {result && (
                <div className="animate-in slide-in-from-bottom-4 fade-in duration-500 space-y-8">
                    {/* Top Stats Card */}
                    <div className="bg-card border rounded-2xl p-8 text-center relative overflow-hidden shadow-lg">
                        <div className="absolute inset-0 bg-primary/5" />
                        <div className="relative z-10 flex flex-col items-center gap-4">
                            <h3 className="text-xl font-bold uppercase tracking-wider text-muted-foreground">
                                {t('matchScoreLabel')}
                            </h3>
                            <div className="text-7xl font-black text-primary">
                                {result.match_score}%
                            </div>
                            <div className="w-full max-w-md mx-auto mt-4">
                                <Progress value={result.match_score} className="h-3" />
                            </div>
                            <p className="mt-6 text-lg max-w-2xl text-foreground font-medium">
                                {result.summary}
                            </p>
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                        {/* Fulfilled Skills */}
                        <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-6">
                            <h4 className="font-bold flex items-center gap-2 pb-4 border-b">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                {t('fulfilledSkills')}
                            </h4>
                            <ul className="space-y-3">
                                {result.fulfilled_skills?.length > 0 ? (
                                    result.fulfilled_skills.map((skill: string, i: number) => (
                                        <li key={i} className="flex items-start gap-3 text-sm">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                                            <span>{skill}</span>
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-sm text-muted-foreground italic">{t('noFulfilledSkills')}</li>
                                )}
                            </ul>
                        </div>

                        {/* Missing Skills */}
                        <div className="bg-card border border-amber-500/20 rounded-2xl p-6 shadow-sm space-y-6">
                            <h4 className="font-bold flex items-center gap-2 pb-4 border-b">
                                <AlertCircle className="w-5 h-5 text-amber-500" />
                                {t('missingSkills')}
                            </h4>
                            <ul className="space-y-3">
                                {result.missing_skills?.length > 0 ? (
                                    result.missing_skills.map((skill: string, i: number) => (
                                        <li key={i} className="flex items-start gap-3 text-sm">
                                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                                            <span className="font-medium">{skill}</span>
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-sm text-muted-foreground italic">{t('noMissingSkills')}</li>
                                )}
                            </ul>

                            {result.missing_skills?.length > 0 && (
                                <div className="mt-6 pt-6 border-t border-amber-500/10 text-sm">
                                    <p className="text-muted-foreground mb-4">
                                        {t('missingSkillsCallToAction')}
                                    </p>
                                    <Button variant="outline" className="w-full gap-2 border-amber-500/20 hover:bg-amber-500/10 text-amber-600 dark:text-amber-400">
                                        {t('suggestLearningPath')} <ArrowRight className="w-4 h-4 rtl:-scale-x-100" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
