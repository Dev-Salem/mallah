'use client';

import { OpportunityAnalysisResult } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, AlertTriangle, XCircle, ArrowRight, Zap } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function ResultsTab({ result }: { result: OpportunityAnalysisResult }) {
    const t = useTranslations('Dashboard.Opportunities');
    const isApplyReady = result.match_score >= 80;

    const getScoreColor = (s: number) => {
        if (s < 35) return 'bg-red-500';
        if (s < 60) return 'bg-amber-500';
        if (s < 80) return 'bg-blue-500';
        return 'bg-emerald-500';
    };

    return (
        <div className="space-y-6">
            {/* High Level Match Summary */}
            <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-card to-muted/30">
                <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                        <div className="p-8 md:w-1/3 bg-background/50 flex flex-col items-center justify-center border-r">
                            <div className="relative w-32 h-32 mb-4">
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/20" />
                                    <circle 
                                        cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" 
                                        className={result.match_score >= 80 ? "text-emerald-500" : "text-blue-500"}
                                        strokeDasharray={`${result.match_score * 2.827} 282.7`} 
                                        strokeLinecap="round"
                                        style={{ transition: 'stroke-dasharray 1s ease-in-out' }}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center text-3xl font-black">
                                    {result.match_score}%
                                </div>
                            </div>
                            <Badge variant={isApplyReady ? "default" : "secondary"} className={isApplyReady ? "bg-emerald-500" : ""}>
                                {isApplyReady ? "Apply Ready" : "Building Skills"}
                            </Badge>
                        </div>
                        
                        <div className="p-8 flex-1 space-y-4">
                            <div>
                                <h3 className="text-xl font-bold mb-1">Match Potential Analysis</h3>
                                <p className="text-foreground/70 text-sm">
                                    Based on your Mallah profile and uploaded CV, you are a <strong>{result.match_score >= 80 ? "strong" : "developing"}</strong> candidate for this role.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-medium">
                                        <span>Required Skills</span>
                                        <span>{result.skills_breakdown.matched.length} / {result.skills_breakdown.matched.length + result.skills_breakdown.missing.required.length}</span>
                                    </div>
                                    <Progress value={(result.skills_breakdown.matched.length / Math.max(result.skills_breakdown.matched.length + result.skills_breakdown.missing.required.length, 1)) * 100} className="h-2" />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-medium">
                                        <span>CV Boost</span>
                                        <span className="text-blue-500">+{result.cv_skills_contributed} Skills</span>
                                    </div>
                                    <div className="h-2 bg-blue-500/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500" style={{ width: `${Math.min(result.cv_skills_contributed * 10, 100)}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Critical Missing Skills */}
                <Card className="border-red-500/10 dark:bg-red-500/5">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold flex items-center gap-2 text-red-500">
                            <AlertTriangle className="w-4 h-4" /> {t('results.gapsTitle')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-wrap gap-2 text-sm">
                            {result.skills_breakdown.missing.required.slice(0, 5).map((skill, i) => (
                                <Badge key={i} variant="outline" className="border-red-200 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400">
                                    {skill}
                                </Badge>
                            ))}
                            {result.skills_breakdown.missing.required.length > 5 && (
                                <span className="text-xs text-muted-foreground self-center">+{result.skills_breakdown.missing.required.length - 5} more</span>
                            )}
                        </div>
                        <p className="text-xs text-foreground/60">Focus on these to increase your match score above 80%.</p>
                    </CardContent>
                </Card>

                {/* Quick Win / Action Plan Entry */}
                <Card className="border-emerald-500/10 dark:bg-emerald-500/5">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold flex items-center gap-2 text-emerald-500">
                            <Zap className="w-4 h-4" /> {t('results.nextStepTitle')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {result.action_plan.length > 0 ? (
                            <div className="p-3 bg-emerald-500/10 rounded-lg flex items-center justify-between group cursor-pointer hover:bg-emerald-500/20 transition-colors">
                                <div className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-bold">{result.action_plan[0].title}</p>
                                        <p className="text-xs text-foreground/70 line-clamp-1">{result.action_plan[0].reason}</p>
                                    </div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-emerald-500 group-hover:translate-x-1 transition-transform" />
                            </div>
                        ) : (
                            <p className="text-sm italic text-muted-foreground">Ready to apply! Update your resume first.</p>
                        )}
                        <p className="text-xs text-foreground/60">See the full Action Plan tab for your customized roadmap.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
