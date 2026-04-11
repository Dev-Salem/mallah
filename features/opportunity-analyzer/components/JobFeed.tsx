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
    learnerSkills: string[];
    onAnalyzeJob: (job: JobListing) => void;
}

export function JobFeed({ pathId, learnerSkills, onAnalyzeJob }: JobFeedProps) {
    const [jobs, setJobs] = useState<JobListing[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [seniority, setSeniority] = useState('All levels');
    const [sortBy, setSortBy] = useState<'Best Match' | 'Newest'>('Best Match');

    const fetchJobs = useCallback(async () => {
        setLoading(true);
        try {
            const result = await getJobListingsAction(pathId, learnerSkills, sortBy, search, seniority);
            setJobs(result);
        } catch (error) {
            console.error("Failed to fetch jobs:", error);
        } finally {
            setLoading(false);
        }
    }, [pathId, learnerSkills, sortBy, search, seniority]);

    useEffect(() => {
        const bounceTimer = setTimeout(() => {
            fetchJobs();
        }, 300);
        return () => clearTimeout(bounceTimer);
    }, [fetchJobs]);

    return (
        <div className="space-y-4">
            <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search roles, skills..."
                        className="pl-8"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Select value={seniority} onValueChange={setSeniority}>
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Level" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All levels">All levels</SelectItem>
                        <SelectItem value="Intern">Intern</SelectItem>
                        <SelectItem value="Junior">Junior</SelectItem>
                        <SelectItem value="Mid">Mid</SelectItem>
                        <SelectItem value="Senior">Senior</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={(val: 'Best Match' | 'Newest') => setSortBy(val)}>
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Sort" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Best Match">Best Match</SelectItem>
                        <SelectItem value="Newest">Newest</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {loading ? (
                <div className="flex justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : jobs.length === 0 ? (
                <div className="text-center p-8 text-muted-foreground border rounded-lg bg-muted/10">
                    No jobs found matching your criteria. Try adjusting your filters.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {jobs.map((job) => (
                        <JobCard
                            key={job.job_id}
                            job={job}
                            onAnalyze={onAnalyzeJob}
                            onSave={() => { /* Handled saving later */ }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
