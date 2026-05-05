'use client';

import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { Globe, Github, Eye, EyeOff, LayoutTemplate } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { toggleProjectVisibilityAction } from '../actions/portfolio-actions';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { PortfolioProject } from '../types';

interface ProjectCardProps {
    project: PortfolioProject;
    isPublicView?: boolean;
}

export function ProjectCard({ project, isPublicView = false }: ProjectCardProps) {
    const t = useTranslations('PortfolioHub.projects');

    // Format dates
    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return null;
        try {
            return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(new Date(dateStr));
        } catch {
            return dateStr;
        }
    };

    const startDate = formatDate(project.started_at);
    const completedDate = formatDate(project.completed_at) || t('statusInProgress');

    const handleTogglePublic = async (checked: boolean) => {
        const result = await toggleProjectVisibilityAction(project.project_id, checked);
        if (result.success) {
            toast.success(checked ? t('visibilityPublic') : t('visibilityPrivate'));
        } else {
            toast.error(result.error);
        }
    };

    return (
        <div className={`group relative flex gap-6 p-6 rounded-2xl border transition-all ${isPublicView ? 'bg-card' : 'bg-card hover:border-primary/30 hover:shadow-md'}`}>
            
            {/* Left: Thumbnail/Icon element */}
            <div className={`hidden sm:flex shrink-0 w-24 h-24 rounded-xl border border-border/50 bg-muted/20 items-center justify-center overflow-hidden relative ${!isPublicView && !project.is_public ? 'opacity-50' : ''}`}>
                {project.thumbnail_url ? (
                    <img src={project.thumbnail_url} alt={project.title} className="w-full h-full object-cover" />
                ) : (
                    <LayoutTemplate className="w-8 h-8 text-muted-foreground/30" />
                )}
                
                {/* Source Label */}
                <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-[2px] py-1 text-[8px] font-mono text-center border-t border-border/40 uppercase tracking-tighter text-muted-foreground">
                    {t(`sourceBadge.${project.source_type}` as any)}
                </div>
            </div>

            {/* Right: Content element */}
            <div className="flex-1 flex flex-col min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-xl text-foreground leading-tight">
                                {project.custom_name || project.title}
                            </h3>
                            {!isPublicView && !project.is_public && (
                                <Badge variant="secondary" className="bg-muted text-[10px] uppercase font-mono h-5">
                                    {t('privateBadge')}
                                </Badge>
                            )}
                        </div>
                        <div className="text-xs font-medium text-muted-foreground/80 mt-1 uppercase font-mono">
                            {startDate ? `${startDate} — ` : ''}{completedDate}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-start">
                        {!isPublicView && (
                            <div className="flex items-center gap-2 group/switch bg-muted/30 px-2 py-1 rounded-full border border-transparent hover:border-border/50 transition-colors">
                                {project.is_public ? <Eye className="w-3.5 h-3.5 text-muted-foreground" /> : <EyeOff className="w-3.5 h-3.5 text-muted-foreground/50" />}
                                <Switch
                                    checked={project.is_public}
                                    onCheckedChange={handleTogglePublic}
                                    className="scale-75 origin-right"
                                />
                            </div>
                        )}
                        <div className="flex gap-1.5 pt-0.5">
                            {project.github_url && (
                                <Button size="icon" variant="ghost" className="w-8 h-8 rounded-full bg-primary/5 hover:bg-primary/10 text-primary border border-primary/5 hover:border-primary/20" asChild>
                                    <a href={project.github_url} target="_blank" rel="noopener noreferrer" title={t('viewCode')}>
                                        <Github className="w-4 h-4" />
                                    </a>
                                </Button>
                            )}
                            {project.demo_url && (
                                <Button size="icon" variant="ghost" className="w-8 h-8 rounded-full bg-primary/5 hover:bg-primary/10 text-primary border border-primary/5 hover:border-primary/20" asChild>
                                    <a href={project.demo_url} target="_blank" rel="noopener noreferrer" title={t('viewDemo')}>
                                        <Globe className="w-4 h-4" />
                                    </a>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bullets/Description */}
                <div className="mb-4">
                    {project.bullets && project.bullets.length > 0 ? (
                        <ul className="space-y-2">
                            {project.bullets.map((bullet, idx) => (
                                <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                                    <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-primary/30 mt-1.5" />
                                    <span>{bullet}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-muted-foreground/80 leading-relaxed">
                            {project.custom_description || project.description || project.personal_note || t('noDescription')}
                        </p>
                    )}
                </div>

                {/* Tech Chips */}
                <div className="flex flex-wrap gap-2 mt-auto">
                    {project.tech_stack.map((tech: string, i: number) => (
                        <Badge 
                            key={i} 
                            variant="secondary" 
                            className="bg-primary/5 hover:bg-primary/10 text-primary/80 border-primary/10 text-[10px] font-medium py-0.5 px-2.5 rounded-md"
                        >
                            {tech}
                        </Badge>
                    ))}
                </div>
            </div>
        </div>
    );
}
