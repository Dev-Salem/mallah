'use client';

import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { JobFeed } from './JobFeed';
import { AnalyzerContainer } from './AnalyzerContainer';
import { JobListing } from '../types';
import { getLearnerPathAction, getLearnerSkillsAction } from '../actions/job-feed-actions';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { OpportunityAnalysisResult } from '../types';
import { SavedAnalysesTab } from './tabs/SavedAnalysesTab';

export function OpportunitiesClient() {
    const t = useTranslations('Dashboard.Opportunities');
    const [activeTab, setActiveTab] = useState('job-feed');
    const [prefilledJD, setPrefilledJD] = useState<string>('');
    const [prefilledAnalysis, setPrefilledAnalysis] = useState<OpportunityAnalysisResult | null>(null);
    const [pathInfo, setPathInfo] = useState<{ id: string; name: string } | null>(null);
    const [learnerSkills, setLearnerSkills] = useState<string[]>([]);
    const [loadingProfile, setLoadingProfile] = useState(true);

    useEffect(() => {
        async function fetchLearnerData() {
            try {
                const [path, skills] = await Promise.all([
                    getLearnerPathAction(),
                    getLearnerSkillsAction(),
                ]);
                setPathInfo(path);
                setLearnerSkills(skills);
            } catch (error) {
                console.error('Failed to fetch learner profile:', error);
            } finally {
                setLoadingProfile(false);
            }
        }
        fetchLearnerData();
    }, []);

    const handleAnalyzeJob = (job: JobListing) => {
        setPrefilledAnalysis(null);
        setPrefilledJD(job.description);
        setActiveTab('custom-analysis');
    };

    const handleViewSavedAnalysis = (analysis: OpportunityAnalysisResult) => {
        setPrefilledAnalysis(analysis);
        setActiveTab('custom-analysis');
    };

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-10 w-full justify-start h-12 border-b border-primary/10 rounded-none bg-transparent gap-2 px-0 overflow-x-auto overflow-y-hidden no-scrollbar flex-nowrap">
                <TabsTrigger 
                    value="job-feed" 
                    className="tactical-tab-trigger"
                >
                    {t('tabs.jobFeed')}
                </TabsTrigger>
                <TabsTrigger 
                    value="custom-analysis" 
                    className="tactical-tab-trigger"
                >
                    {t('tabs.analyzeARole')}
                </TabsTrigger>
                <TabsTrigger 
                    value="saved-analyses" 
                    className="tactical-tab-trigger"
                >
                    {t('tabs.savedAnalyses')}
                </TabsTrigger>
            </TabsList>

            <TabsContent value="job-feed" className="mt-0 outline-none">
                {loadingProfile ? (
                    <div className="flex justify-center p-12">
                        <Loader2 className="h-10 w-10 animate-spin text-primary/50" />
                    </div>
                ) : !pathInfo ? (
                    <div className="text-center p-12 text-muted-foreground border border-dashed rounded-xl bg-muted/5">
                        {t('jobFeed.empty.description')}
                    </div>
                ) : (
                    <JobFeed
                        pathId={pathInfo.id}
                        pathName={pathInfo.name}
                        learnerSkills={learnerSkills}
                        onAnalyzeJob={handleAnalyzeJob}
                    />
                )}
            </TabsContent>

            <TabsContent value="custom-analysis" className="mt-0 outline-none">
                <AnalyzerContainer initialJD={prefilledJD} initialAnalysis={prefilledAnalysis} />
            </TabsContent>

            <TabsContent value="saved-analyses" className="mt-0 outline-none">
                <div className="max-w-5xl mx-auto w-full pt-6">
                    <SavedAnalysesTab onViewAnalysis={handleViewSavedAnalysis} />
                </div>
            </TabsContent>
        </Tabs>
    );
}
