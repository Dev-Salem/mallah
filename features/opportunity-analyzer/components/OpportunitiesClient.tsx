'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { JobFeed } from './JobFeed';
import { AnalyzerContainer } from './AnalyzerContainer';
import { JobListing } from '../types';
import { useRouter } from 'next/navigation';

export function OpportunitiesClient() {
    const router = useRouter();

    const handleAnalyzeJob = (job: JobListing) => {
        // When a job is clicked in the feed, we can either:
        // 1. Switch to the 'custom' tab and pre-fill it (requires state management)
        // 2. Or just log it for now as a placeholder for full deep-analysis integration
        console.log("Analyzing job from feed:", job);
        // For now, let's just show a toast or message, or stay on the feed.
        // In a future update, this could populate the AnalyzerContainer's input.
    };

    return (
        <Tabs defaultValue="discover" className="w-full">
            <TabsList className="mb-4">
                <TabsTrigger value="discover">Discover Jobs</TabsTrigger>
                <TabsTrigger value="custom">Custom Analysis</TabsTrigger>
            </TabsList>
            <TabsContent value="discover">
                <div className="bg-card p-6 rounded-xl border shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Curated Job Feed</h2>
                    <JobFeed 
                        pathId="default-path" 
                        learnerSkills={[]} 
                        onAnalyzeJob={handleAnalyzeJob} 
                    />
                </div>
            </TabsContent>
            <TabsContent value="custom">
                <AnalyzerContainer />
            </TabsContent>
        </Tabs>
    );
}
