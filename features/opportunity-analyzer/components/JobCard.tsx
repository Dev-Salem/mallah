'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Landmark, MapPin, Briefcase, Zap, ExternalLink, Globe, Clock } from 'lucide-react';
import { JobListing } from '../types';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { formatDistanceToNow } from 'date-fns';

interface JobCardProps {
    job: JobListing;
    onAnalyze: (job: JobListing) => void;
}

export function JobCard({ job, onAnalyze }: JobCardProps) {
    const t = useTranslations('Dashboard.Opportunities');
    const [isHovered, setIsHovered] = useState(false);

    const matchScore = (job as any).matchScore || 0;
    
    return (
        <Card 
            className="group relative overflow-hidden bg-card/30 border-primary/10 hover:border-primary/40 transition-all duration-300 h-full flex flex-col"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="p-5 flex flex-col h-full gap-4">
                {/* Top Row: Badges */}
                <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-1.5">
                        <Badge variant="outline" className="bg-primary/5 text-[9px] font-mono tracking-wider border-primary/20 text-primary/80 px-1.5 py-0 uppercase">
                            {job.seniority || 'JUNIOR'}
                        </Badge>
                        {job.is_remote && (
                            <Badge variant="outline" className="bg-blue-500/5 text-[9px] font-mono tracking-wider border-blue-500/20 text-blue-500/80 px-1.5 py-0 uppercase">
                                <Globe className="h-2.5 w-2.5 mr-1" />
                                REMOTE
                            </Badge>
                        )}
                    </div>
                    {job.employment_type && (
                        <Badge variant="outline" className="bg-emerald-500/5 text-[9px] font-mono tracking-wider border-emerald-500/20 text-emerald-500/80 px-1.5 py-0 uppercase shrink-0">
                            <Briefcase className="h-2.5 w-2.5 mr-1" />
                            {job.employment_type}
                        </Badge>
                    )}
                </div>

                {/* Body: Title & Meta */}
                <div className="space-y-3 flex-grow">
                    <div className="space-y-1">
                        <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
                            {job.title}
                        </h3>
                        <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-mono mt-2 overflow-hidden">
                            <div className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-default min-w-0">
                                <Landmark className="h-3 w-3 opacity-70 shrink-0" />
                                <span className="truncate">{job.company}</span>
                            </div>
                            {job.location && (
                                <>
                                    <span className="opacity-30 shrink-0">•</span>
                                    <div className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-default min-w-0">
                                        <MapPin className="h-3 w-3 opacity-70 shrink-0" />
                                        <span className="truncate">{job.location}</span>
                                    </div>
                                </>
                            )}
                            <div className="flex items-center gap-1.5 opacity-70 ml-auto shrink-0 whitespace-nowrap bg-muted/30 px-1.5 py-0.5 rounded">
                                <Clock className="h-3 w-3" />
                                <span>{formatDistanceToNow(new Date(job.published_at), { addSuffix: true })}</span>
                            </div>
                        </div>
                    </div>

                    {/* Description Snippet */}
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed opacity-80 italic">
                        {job.description}
                    </p>

                    {/* Skills Preview */}
                    {job.required_skills && job.required_skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                            {job.required_skills.slice(0, 3).map((skill) => (
                                <span 
                                    key={skill} 
                                    className="text-[9px] px-1.5 py-0.5 rounded bg-muted/30 border border-border/50 text-muted-foreground font-mono uppercase tracking-tight"
                                >
                                    {skill}
                                </span>
                            ))}
                            {job.required_skills.length > 3 && (
                                <span className="text-[9px] text-muted-foreground/50 font-mono">
                                    +{job.required_skills.length - 3}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Match Section */}
                <div className="mt-2 space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono tracking-widest uppercase">
                        <span className="text-muted-foreground">Match Vector</span>
                        <span className="text-primary font-bold">{matchScore}%</span>
                    </div>
                    <div className="h-1 w-full bg-primary/5 rounded-full overflow-hidden border border-primary/5 relative">
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

                {/* Footer Actions */}
                <div className="flex gap-2 mt-2">
                    <Button 
                        variant="ghost" 
                        size="sm"
                        className="flex-1 border border-primary/5 bg-primary/5 hover:bg-primary hover:text-white transition-all group/btn font-mono text-[10px] tracking-widest uppercase"
                        onClick={() => onAnalyze(job)}
                    >
                        <Zap className="mr-2 h-3 w-3 group-hover/btn:animate-pulse" />
                        {t('jobFeed.analyzeButton')}
                    </Button>
                    {(job.apply_url || job.source_url) && (
                        <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-9 w-9 shrink-0 border-primary/10 hover:bg-primary/10 hover:text-primary transition-all"
                            asChild
                        >
                            <a href={job.apply_url || job.source_url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                        </Button>
                    )}
                </div>
            </div>
        </Card>
    );
}

