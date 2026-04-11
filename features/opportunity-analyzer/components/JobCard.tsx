import { JobListing } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { Progress } from '@/components/ui/progress';

interface JobCardProps {
    job: JobListing & { matchScore?: number };
    onAnalyze: (job: JobListing) => void;
    onSave: (job: JobListing) => void;
}

export function JobCard({ job, onAnalyze, onSave }: JobCardProps) {
    const score = job.matchScore || 0;
    
    // Determine progress color based on score
    let progressColor = 'bg-red-500'; // Default red for < 35%
    if (score >= 90) progressColor = 'bg-emerald-500';
    else if (score >= 75) progressColor = 'bg-green-500';
    else if (score >= 55) progressColor = 'bg-yellow-400';
    else if (score >= 35) progressColor = 'bg-amber-500';

    const getDaysUntilExpiry = (expiresAt: string) => {
        const diffTime = Math.abs(new Date(expiresAt).getTime() - new Date().getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    };

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex flex-col space-y-3">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-bold text-lg">{job.title}</h3>
                        <p className="text-sm text-muted-foreground">{job.company} · {job.location} · {job.seniority}</p>
                    </div>
                </div>

                <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                        <span>Match: {score}%</span>
                        <span className="text-muted-foreground text-xs">Expires in {getDaysUntilExpiry(job.expires_at)} days</span>
                    </div>
                    <Progress value={score} className={progressColor} />
                </div>

                <div className="flex justify-between items-center pt-2">
                    <Button size="sm" onClick={() => onAnalyze(job)}>Analyze →</Button>
                    <Button size="sm" variant="ghost" onClick={() => onSave(job)}>Save</Button>
                </div>
            </CardContent>
        </Card>
    );
}
