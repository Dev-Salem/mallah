'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Landmark, MapPin, Briefcase, Zap } from 'lucide-react';
import { JobListing } from '../types';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface JobCardProps {
    job: JobListing;
    onAnalyze: (job: JobListing) => void;
    onSave: (job: JobListing) => void;
}

export function JobCard({ job, onAnalyze, onSave }: JobCardProps) {
    const t = useTranslations('Dashboard.Opportunities');
    const [isHovered, setIsHovered] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const matchScore = (job as any).matchScore || 0;
    
    // Determine expiry strip color and urgency
    const getDaysUntilExpiry = (expiresAt: string) => {
        if (!expiresAt) return 30;
        const diffTime = new Date(expiresAt).getTime() - new Date().getTime();
        return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24))); 
    };

    const daysRemaining = getDaysUntilExpiry(job.expires_at);
    const isUrgent = daysRemaining <= 3;
    const stripColor = isUrgent ? 'bg-red-500' : daysRemaining <= 7 ? 'bg-amber-500' : 'bg-emerald-500';

    return (
        <Card 
            className="group relative overflow-hidden bg-card/30 border-primary/10 hover:border-primary/40 transition-all duration-300 h-full flex flex-col"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="p-5 flex flex-col h-full gap-4">
                {/* Top Row: Seniority & Save */}
                <div className="flex items-center justify-between">
                    <Badge variant="outline" className="bg-primary/5 text-[10px] font-mono tracking-wider border-primary/20 text-primary/80 px-2 py-0 uppercase">
                        {job.seniority || 'JUNIOR_LEVEL'}
                    </Badge>
                    <button 
                        onClick={() => {
                            setIsSaved(!isSaved);
                            onSave(job);
                        }}
                        className="text-muted-foreground hover:text-primary transition-all p-1"
                    >
                        <Heart 
                            className={cn(
                                "h-4 w-4 transition-all duration-300",
                                isSaved ? "fill-primary text-primary scale-110" : "fill-none scale-100",
                                isSaved && "animate-[heartBounce_0.3s_ease-out]"
                            )} 
                        />
                    </button>
                </div>

                {/* Body: Title & Meta */}
                <div className="space-y-1 flex-grow">
                    <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
                        {job.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground font-mono mt-2">
                        <div className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-default">
                            <Landmark className="h-3 w-3 opacity-70" />
                            <span className="truncate max-w-[120px]">{job.company}</span>
                        </div>
                        {job.location && (
                            <div className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-default">
                                <MapPin className="h-3 w-3 opacity-70" />
                                <span>{job.location}</span>
                            </div>
                        )}
                        {job.employment_type && (
                            <div className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-default">
                                <Briefcase className="h-3 w-3 opacity-70" />
                                <span>{job.employment_type}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Match Section */}
                <div className="mt-2 space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono tracking-widest uppercase">
                        <span className="text-muted-foreground">Match Vector</span>
                        <span className="text-primary font-bold">{matchScore}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-primary/5 rounded-full overflow-hidden border border-primary/5 relative">
                        <div 
                            className={cn(
                                "h-full bg-primary transition-all duration-1000 ease-out relative rounded-full",
                                isHovered && "animate-pulse-once"
                            )}
                            style={{ width: `${matchScore}%` }}
                        >
                            <div className="absolute inset-0 bg-white/10 animate-pulse" />
                        </div>
                    </div>
                </div>

                {/* Global Action Trigger (Analysis) */}
                <Button 
                    variant="ghost" 
                    size="sm"
                    className="mt-2 w-full border border-primary/5 bg-primary/5 hover:bg-primary hover:text-white transition-all group/btn font-mono text-[10px] tracking-widest uppercase"
                    onClick={() => onAnalyze(job)}
                >
                    <Zap className="mr-2 h-3 w-3 group-hover/btn:animate-pulse" />
                    {t('jobFeed.analyzeButton')}
                </Button>
            </div>
        </Card>
    );
}
