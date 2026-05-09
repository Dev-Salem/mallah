'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, MapPin, Briefcase, Zap, ExternalLink, Globe, Clock } from 'lucide-react';
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

    // Advanced Logic for Badges
    const isRemote = job.is_remote || job.title.toLowerCase().includes('remote');
    const isIntern = job.title.toLowerCase().includes('intern') || job.employment_type?.toLowerCase().includes('intern');
    
    // Seniority Label
    const seniorityLabel = isIntern ? 'INTERN' : (job.seniority?.toUpperCase() || 'JUNIOR');
    
    // Employment Type Label
    let employmentTypeLabel = 'FULL-TIME';
    if (isIntern) {
        employmentTypeLabel = isRemote ? 'REMOTE INTERN' : 'INTERNSHIP';
    } else {
        const hasFullTimeLabel = job.employment_type?.toUpperCase().includes('FULL');
        const hasFullTimeDesc = job.description?.toLowerCase().includes('full time') || job.description?.toLowerCase().includes('full-time');
        if (hasFullTimeLabel || hasFullTimeDesc || !job.employment_type) {
            employmentTypeLabel = 'FULL-TIME';
        } else {
            employmentTypeLabel = job.employment_type.toUpperCase();
        }
    }

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
                        {/* Seniority Badge */}
                        <Badge variant="outline" className="bg-primary/10 text-[10px] font-mono tracking-wider border-primary/20 text-primary/80 px-1.5 py-0 uppercase">
                            {seniorityLabel}
                        </Badge>
                        
                        {/* Remote Badge */}
                        {isRemote && (
                            <Badge variant="outline" className="bg-blue-500/10 text-[10px] font-mono tracking-wider border-blue-500/20 text-blue-500/80 px-1.5 py-0 uppercase">
                                <Globe className="h-3 w-3 mr-1" />
                                REMOTE
                            </Badge>
                        )}
                    </div>

                    {/* Employment Type Badge (Right Positioned) */}
                    <Badge variant="outline" className="bg-emerald-500/10 text-[10px] font-mono tracking-wider border-emerald-500/20 text-emerald-500/80 px-1.5 py-0 uppercase shrink-0">
                        <Briefcase className="h-3 w-3 mr-1" />
                        {employmentTypeLabel}
                    </Badge>
                </div>

                {/* Body: Title & Meta */}
                <div className="space-y-3 flex-grow">
                    <div className="space-y-1">
                        <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
                            {job.title}
                        </h3>
                        <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-mono mt-2 overflow-hidden">
                            <div className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-default min-w-0">
                                <Building2 className="h-3.5 w-3.5 opacity-70 shrink-0" />
                                <span className="truncate">{job.company}</span>
                            </div>
                            {job.location && (
                                <>
                                    <span className="opacity-30 shrink-0">•</span>
                                    <div className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-default min-w-0">
                                        <MapPin className="h-3.5 w-3.5 opacity-70 shrink-0" />
                                        <span className="truncate">{job.location}</span>
                                    </div>
                                </>
                            )}
                            <div className="flex items-center gap-1.5 opacity-70 ml-auto shrink-0 whitespace-nowrap bg-muted/30 px-1.5 py-0.5 rounded">
                                <Clock className="h-3.5 w-3.5" />
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

