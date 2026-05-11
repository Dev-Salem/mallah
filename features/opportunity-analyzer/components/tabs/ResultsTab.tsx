'use client';

import { OpportunityAnalysisResult } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, ArrowRight, CheckCircle2, Zap } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { getScoreLabel, getScoreTextColor, isApplyReady, isNonTechnicalRequirement } from '../../services/scoring';

function getMissingSkillName(skill: unknown): string {
    if (typeof skill === 'string') return skill;
    if (skill && typeof skill === 'object' && typeof (skill as { skill_name?: unknown }).skill_name === 'string') {
        return (skill as { skill_name: string }).skill_name;
    }
    return '';
}

function isValidActionStep(step: OpportunityAnalysisResult['action_plan'][number] | undefined): boolean {
    if (!step) return false;
    const combined = [step.title, step.reason].filter(Boolean).join(' ').trim();
    if (!combined) return false;
    return !isNonTechnicalRequirement(combined);
}

interface ResultsTabProps {
    result: OpportunityAnalysisResult;
    onSelectTab: (tab: string) => void;
}

export function ResultsTab({ result, onSelectTab }: ResultsTabProps) {
    const t = useTranslations('Dashboard.Opportunities');
    const applyReady = isApplyReady(result.match_score);
    const scoreLabel = getScoreLabel(result.match_score);
    const requiredFullMatches = result.skills_breakdown.matched.filter((skill) => skill.requirement_type === 'required').length;
    const requiredPartialMatches = result.skills_breakdown.partial.filter((skill) => skill.requirement_type === 'required').length;
    const requiredTotal = Math.max(result.extracted_skills.required.length, 1);
    const requiredCoverage = ((requiredFullMatches + (requiredPartialMatches * 0.5)) / requiredTotal) * 100;
    const cvUploaded = result.cv_uploaded ?? result.extracted_skills.metadata?.cv_uploaded ?? false;
    const cvExtractedSkillsCount = result.cv_extracted_skills_count ?? result.extracted_skills.metadata?.cv_extracted_skills_count ?? 0;
    const filteredMissingSkills = result.skills_breakdown.missing.required
        .map(getMissingSkillName)
        .filter((skill) => skill && !isNonTechnicalRequirement(skill))
        .slice(0, 5);
    const validNextStep = result.action_plan.find(isValidActionStep);

    return (
        <div className="space-y-6">
            <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-card to-muted/30">
                <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                        <div className="p-8 md:w-1/3 bg-background/50 flex flex-col items-center justify-center border-r">
                            <div className="relative w-32 h-32 mb-4">
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/20" />
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="45"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="8"
                                        className={getScoreTextColor(result.match_score)}
                                        strokeDasharray={`${result.match_score * 2.827} 282.7`}
                                        strokeLinecap="round"
                                        style={{ transition: 'stroke-dasharray 1s ease-in-out' }}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center text-3xl font-black">
                                    {result.match_score}%
                                </div>
                            </div>
                            <Badge variant={applyReady ? 'default' : 'secondary'} className={applyReady ? 'bg-emerald-500' : ''}>
                                {scoreLabel}
                            </Badge>
                        </div>

                        <div className="p-8 flex-1 space-y-4">
                            <div>
                                <h3 className="text-xl font-bold mb-1">Match Potential Analysis</h3>
                                <p className="text-foreground/70 text-sm">
                                    Based on your Mallah profile{cvUploaded ? ' and uploaded CV' : ''}, you are a <strong>{applyReady ? 'strong' : 'developing'}</strong> candidate for this role.
                                </p>
                            </div>

                            <div className={`grid gap-4 pt-2 ${cvUploaded ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-medium">
                                        <span>Required Skills</span>
                                        <span>{requiredFullMatches + (requiredPartialMatches * 0.5)} / {result.extracted_skills.required.length}</span>
                                    </div>
                                    <Progress value={requiredCoverage} className="h-2" />
                                </div>

                                {cvUploaded && (
                                    cvExtractedSkillsCount > 0 ? (
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs font-medium">
                                                <span>CV Coverage</span>
                                                <span className="text-blue-500">+{result.cv_skills_contributed} Skills</span>
                                            </div>
                                            <div className="h-2 bg-blue-500/10 rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-500" style={{ width: `${Math.min(result.cv_skills_contributed * 10, 100)}%` }}></div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-100">
                                            We couldn&apos;t extract skills from your CV. Try a more detailed CV or check the file format.
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-red-500/10 dark:bg-red-500/5">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold flex items-center gap-2 text-red-500">
                            <AlertTriangle className="w-4 h-4" /> {t('results.gapsTitle')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-wrap gap-2 text-sm">
                            {filteredMissingSkills.map((skill, i) => (
                                <Badge key={`${skill}-${i}`} variant="outline" className="border-red-200 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400">
                                    {skill}
                                </Badge>
                            ))}
                            {result.skills_breakdown.missing.required
                                .map(getMissingSkillName)
                                .filter((skill) => skill && !isNonTechnicalRequirement(skill)).length > 5 && (
                                <span className="text-xs text-muted-foreground self-center">
                                    +{result.skills_breakdown.missing.required
                                        .map(getMissingSkillName)
                                        .filter((skill) => skill && !isNonTechnicalRequirement(skill)).length - 5} more
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-foreground/60">Focus on these to increase your match score above 75%.</p>
                    </CardContent>
                </Card>

                <Card className="border-emerald-500/10 dark:bg-emerald-500/5">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold flex items-center gap-2 text-emerald-500">
                            <Zap className="w-4 h-4" /> {t('results.nextStepTitle')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {validNextStep ? (
                            <div className="space-y-3">
                                <div className="p-3 bg-emerald-500/10 rounded-lg flex items-center justify-between group">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-bold">{validNextStep.title}</p>
                                            <p className="text-xs text-foreground/70 line-clamp-2">{validNextStep.reason}</p>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-emerald-500 shrink-0" />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => onSelectTab('actionplan')}
                                    className="text-xs text-primary hover:text-primary/80 hover:underline"
                                >
                                    See the full Action Plan →
                                </button>
                            </div>
                        ) : (
                            <p className="text-sm italic text-muted-foreground">Ready to apply! Update your resume first.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
