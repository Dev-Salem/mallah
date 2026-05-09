'use client';

import { useEffect, useState, useCallback } from 'react';
import { getJobListingsAction } from '../actions/job-feed-actions';
import { JobListing } from '../types';
import { JobCard } from './JobCard';
import { Loader2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface JobFeedProps {
    pathId: string;
    pathName: string;
    learnerSkills: string[];
    onAnalyzeJob: (job: JobListing) => void;
}

import { FeedHeader } from './FeedHeader';
import { FeedFilters } from './FeedFilters';
import { EmptyFeedState } from './EmptyFeedState';

export function JobFeed({ pathId, pathName, learnerSkills, onAnalyzeJob }: JobFeedProps) {
    const [jobs, setJobs] = useState<JobListing[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [seniority, setSeniority] = useState('All levels');
    const [sortBy, setSortBy] = useState<'Best Match' | 'Newest'>('Best Match');
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchJobs = useCallback(async (isInitial = false) => {
        if (isInitial) setLoading(true);
        else setIsRefreshing(true);
        
        try {
            const result = await getJobListingsAction(pathId, learnerSkills, sortBy, search, seniority);
            setJobs(result);
        } catch (error) {
            console.error("Failed to fetch jobs:", error);
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    }, [pathId, learnerSkills, sortBy, search, seniority]);

    useEffect(() => {
        const bounceTimer = setTimeout(() => {
            fetchJobs(jobs.length === 0);
        }, 300);
        return () => clearTimeout(bounceTimer);
    }, [fetchJobs]);

    return (
        <div className="relative min-h-[400px]">
            <FeedHeader pathName={pathName} />
            
            <FeedFilters 
                search={search}
                setSearch={setSearch}
                seniority={seniority}
                setSeniority={setSeniority}
                sortBy={sortBy}
                setSortBy={setSortBy}
            />

            <div className={`scanline relative ${isRefreshing ? 'opacity-50 pointer-events-none' : ''}`}>
                {loading ? (
                    <div className="flex justify-center p-12">
                        <Loader2 className="h-10 w-10 animate-spin text-primary/30" />
                    </div>
                ) : jobs.length === 0 ? (
                    <EmptyFeedState />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {jobs.map((job, index) => (
                            <div 
                                key={job.job_id} 
                                style={{ '--card-index': index } as React.CSSProperties}
                                className="job-card"
                            >
                                <JobCard
                                    job={job}
                                    onAnalyze={onAnalyzeJob}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
