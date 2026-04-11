'use client';
import { OpportunityAnalysisResult } from '../../types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, FolderCode, FileText, Send, CheckCircle2 } from 'lucide-react';

export function ActionPlanTab({ result }: { result: OpportunityAnalysisResult }) {
    
    const getIcon = (type: string) => {
        switch (type) {
            case 'learn_topic': return <BookOpen className="w-5 h-5 text-indigo-500" />;
            case 'build_project': return <FolderCode className="w-5 h-5 text-blue-500" />;
            case 'update_resume': return <FileText className="w-5 h-5 text-emerald-500" />;
            case 'apply_now': return <Send className="w-5 h-5 text-purple-500" />;
            default: return <CheckCircle2 className="w-5 h-5" />;
        }
    };

    const getBadge = (type: string) => {
        switch (type) {
            case 'learn_topic': return <Badge variant="secondary" className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20">Learn</Badge>;
            case 'build_project': return <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20">Build</Badge>;
            case 'update_resume': return <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20">Resume</Badge>;
            case 'apply_now': return <Badge variant="secondary" className="bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-500/20">Action</Badge>;
            default: return null;
        }
    };

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold">Your 7-Step Roadmap</h3>
            
            <div className="relative space-y-4 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                {result.action_plan.map((step, i) => (
                    <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-muted text-muted-foreground shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                            {getIcon(step.step_type)}
                        </div>
                        
                        <Card className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] shadow-sm hover:shadow-md transition-all">
                            <CardContent className="p-5 flex flex-col gap-2">
                                <div className="flex justify-between items-start">
                                    <div className="font-semibold text-base">{step.title}</div>
                                    <div className="ml-2 shrink-0">{getBadge(step.step_type)}</div>
                                </div>
                                {step.reason && (
                                    <p className="text-sm text-foreground/80">{step.reason}</p>
                                )}
                                {step.link_target && step.step_type !== 'update_resume' && (
                                    <a href={step.link_target} target="_blank" rel="noopener noreferrer" className="mt-2 text-sm text-primary hover:underline font-medium inline-flex items-center gap-1">
                                        View Resource &rarr;
                                    </a>
                                )}
                                {step.step_type === 'update_resume' && (
                                    <a href={result.matchingResumeId ? `/dashboard/resume-builder/${result.matchingResumeId}` : `/dashboard/resume-builder`} className="mt-2 text-sm text-primary hover:underline font-medium inline-flex items-center gap-1">
                                        Open Resume Builder &rarr;
                                    </a>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    );
}
