'use client';
import { OpportunityAnalysisResult } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { getScoreLabel, getScoreTextColor, isApplyReady } from '../../services/scoring';

export function OverviewTab({ result }: { result: OpportunityAnalysisResult }) {
    const applyReady = isApplyReady(result.match_score);

    return (
        <div className="grid md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Job Snapshot</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Title</p>
                        <p className="font-semibold">{result.job_title || 'N/A'}</p>
                    </div>
                    {result.company_name && (
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Company</p>
                            <p>{result.company_name}</p>
                        </div>
                    )}
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Seniority & Type</p>
                        <p>{result.seniority_level || 'General'} Level</p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Match Score</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center space-y-6">
                    <div className="relative w-40 h-40 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="10" className="text-muted/20" />
                            <circle 
                                cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="10" 
                                className={getScoreTextColor(result.match_score)}
                                strokeDasharray={`${result.match_score * 2.827} 282.7`} 
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className={getScoreTextColor(result.match_score) + " text-4xl font-black"}>{result.match_score}%</span>
                        </div>
                    </div>
                    
                    <div className="text-center space-y-1">
                        <h3 className="font-bold text-xl">{getScoreLabel(result.match_score)}</h3>
                    </div>

                    {result.cv_skills_contributed > 0 && (
                        <div className="flex items-start gap-2 bg-blue-500/10 text-blue-600 p-3 rounded-lg text-sm w-full dark:text-blue-400">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <p>{result.cv_skills_contributed} skills from your CV contributed at full weight in this score.</p>
                        </div>
                    )}
                    {applyReady && (
                        <div className="flex items-start gap-2 bg-emerald-500/10 text-emerald-600 p-3 rounded-lg text-sm w-full font-bold dark:text-emerald-400">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <p>You are Apply Ready! You meet the core requirements for this role. Check the Action Plan to prepare your application.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
