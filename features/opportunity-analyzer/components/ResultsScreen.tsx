'use client';
import { OpportunityAnalysisResult } from '../types';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ResultsTab } from './tabs/ResultsTab';
import { OverviewTab } from './tabs/OverviewTab';
import { SkillsTab } from './tabs/SkillsTab';
import { ActionPlanTab } from './tabs/ActionPlanTab';
import { PortfolioTab } from './tabs/PortfolioTab';
import { SavedAnalysesTab } from './tabs/SavedAnalysesTab';
import { saveAnalysisAction } from '../actions/analyzer.action';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { useTranslations } from 'next-intl';

interface ResultsScreenProps {
    result: OpportunityAnalysisResult;
    onNewAnalysis: () => void;
}

export function ResultsScreen({ result, onNewAnalysis }: ResultsScreenProps) {
    const t = useTranslations('Dashboard.Opportunities');

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
            {/* Tactical Result Header */}
            <div className="relative group overflow-hidden bg-card/80 backdrop-blur-md p-6 rounded-2xl border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                {/* HUD Scanline Effect on Header */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.1)_50%)]" />
                
                <div className="relative z-10 flex-grow text-center md:text-left space-y-1">
                    <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                        <Badge variant="outline" className="bg-primary/5 text-[10px] font-mono tracking-widest border-primary/20 text-primary px-2 py-0 uppercase">
                            {t('results.status')}
                        </Badge>
                        {result.seniority_level && (
                            <Badge variant="outline" className="text-[10px] font-mono tracking-widest border-white/10 text-foreground/80 px-2 py-0 uppercase">
                                {t('results.level', { level: result.seniority_level })}
                            </Badge>
                        )}
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                        {result.job_title || 'Software Engineer'}
                    </h2>
                </div>

                <div className="relative z-10 flex flex-wrap justify-center gap-3">
                    <Button onClick={() => window.print()} variant="ghost" className="text-[10px] font-mono tracking-widest uppercase border border-primary/10 hover:border-primary/30 hover:bg-primary/5 transition-all h-9">
                        {t('results.export')}
                    </Button>
                    <Button onClick={onNewAnalysis} variant="ghost" className="text-[10px] font-mono tracking-widest uppercase border border-primary/10 hover:border-primary/30 hover:bg-primary/5 transition-all h-9">
                        {t('results.new')}
                    </Button>
                    <Button onClick={handleSave} className="text-[10px] font-mono tracking-widest uppercase bg-primary hover:bg-primary/90 text-white h-9 px-6 shadow-[0_0_20px_rgba(255,100,0,0.2)] hover:shadow-[0_0_25px_rgba(255,100,0,0.4)] transition-all">
                        {t('results.save')}
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="results" className="w-full">
                <TabsList className="flex w-full items-center justify-start h-12 p-0 bg-transparent rounded-none border-b border-primary/10 overflow-x-auto overflow-y-hidden inline-flex flex-nowrap snap-x no-scrollbar">
                    <TabsTrigger value="results" className="tactical-tab-trigger snap-center">{t('results.tabs.report')}</TabsTrigger>
                    <TabsTrigger value="overview" className="tactical-tab-trigger snap-center">{t('results.tabs.intel')}</TabsTrigger>
                    <TabsTrigger value="skills" className="tactical-tab-trigger snap-center">{t('results.tabs.skills')}</TabsTrigger>
                    <TabsTrigger value="actionplan" className="tactical-tab-trigger snap-center">{t('results.tabs.plan')}</TabsTrigger>
                    <TabsTrigger value="portfolio" className="tactical-tab-trigger snap-center">{t('results.tabs.portfolio')}</TabsTrigger>
                </TabsList>

                <div className="mt-8">
                    <TabsContent value="results"><ResultsTab result={result} /></TabsContent>
                    <TabsContent value="overview"><OverviewTab result={result} /></TabsContent>
                    <TabsContent value="skills"><SkillsTab result={result} /></TabsContent>
                    <TabsContent value="actionplan"><ActionPlanTab result={result} /></TabsContent>
                    <TabsContent value="portfolio"><PortfolioTab result={result} /></TabsContent>
                </div>
            </Tabs>
        </div>
    );
}
