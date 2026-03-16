'use client';
import { OpportunityAnalysisResult } from '../types';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { OverviewTab } from './tabs/OverviewTab';
import { SkillsTab } from './tabs/SkillsTab';
import { PortfolioTab } from './tabs/PortfolioTab';
import { ActionPlanTab } from './tabs/ActionPlanTab';
import { SavedAnalysesTab } from './tabs/SavedAnalysesTab';
import { saveAnalysisAction } from '../actions/analyzer.action';
import { toast } from 'sonner';

interface ResultsScreenProps {
    result: OpportunityAnalysisResult;
    onNewAnalysis: () => void;
    onViewAnalysis: (analysis: OpportunityAnalysisResult) => void;
}

export function ResultsScreen({ result, onNewAnalysis, onViewAnalysis }: ResultsScreenProps) {

    const handleSave = async () => {
        try {
            await saveAnalysisAction({ ...result, is_saved: true });
            toast.success("Analysis saved successfully!");
        } catch {
            toast.error("Failed to save analysis.");
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex bg-card p-4 rounded-xl shadow-sm border items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">{result.job_title || 'Software Engineer'}</h2>
                    {result.seniority_level && <p className="text-muted-foreground">{result.seniority_level} Level</p>}
                </div>
                <div className="flex gap-4">
                    <Button onClick={onNewAnalysis} variant="ghost" className="hidden sm:inline-flex">New Analysis</Button>
                    <Button onClick={handleSave} variant="default">Save Analysis</Button>
                </div>
            </div>

            <Tabs defaultValue="overview" className="w-full">
                <TabsList className="flex w-full items-center justify-start h-auto p-1 bg-muted/50 rounded-lg overflow-x-auto inline-flex flex-nowrap snap-x">
                    <TabsTrigger value="overview" className="py-2.5 min-w-[100px] snap-center">Overview</TabsTrigger>
                    <TabsTrigger value="skills" className="py-2.5 min-w-[80px] snap-center">Skills</TabsTrigger>
                    <TabsTrigger value="portfolio" className="py-2.5 min-w-[80px] snap-center">Portfolio</TabsTrigger>
                    <TabsTrigger value="actionplan" className="py-2.5 min-w-[100px] snap-center">Action Plan</TabsTrigger>
                    <TabsTrigger value="saved" className="py-2.5 min-w-[80px] snap-center">Saved</TabsTrigger>
                </TabsList>

                <div className="mt-6">
                    <TabsContent value="overview"><OverviewTab result={result} /></TabsContent>
                    <TabsContent value="skills"><SkillsTab result={result} /></TabsContent>
                    <TabsContent value="portfolio"><PortfolioTab result={result} /></TabsContent>
                    <TabsContent value="actionplan"><ActionPlanTab result={result} /></TabsContent>
                    <TabsContent value="saved"><SavedAnalysesTab onViewAnalysis={onViewAnalysis} /></TabsContent>
                </div>
            </Tabs>
        </div>
    );
}
