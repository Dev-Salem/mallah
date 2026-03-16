'use client';
import { OpportunityAnalysisResult } from '../../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FolderCode, Target } from 'lucide-react';

export function PortfolioTab({ result }: { result: OpportunityAnalysisResult }) {
    
    // In a real app, you would fetch user's actual projects from Mallah.
    // Here we show what the AI thinks they should build based on the action plan.
    const projectSteps = result.action_plan.filter(p => p.step_type === 'build_project');

    return (
        <div className="space-y-6">
            <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                <div className="flex gap-3 items-center text-primary">
                    <FolderCode className="w-5 h-5" />
                    <h3 className="font-semibold">Portfolio Recommendations</h3>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                    Based on the missing skills for {result.job_title || 'this role'}, here are the projects you should build to showcase your ability.
                </p>
            </div>

            {projectSteps.length === 0 ? (
                <Card>
                    <CardContent className="py-10 text-center text-muted-foreground">
                        No specific project building steps required. You have a strong portfolio match!
                    </CardContent>
                </Card>
            ) : (
                <div className="grid md:grid-cols-2 gap-4">
                    {projectSteps.map((step, i) => (
                        <Card key={i} className="bg-card">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base flex gap-2 items-start">
                                    <Target className="w-4 h-4 mt-1 shrink-0 text-blue-500" />
                                    {step.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {step.reason && (
                                    <CardDescription>{step.reason}</CardDescription>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
