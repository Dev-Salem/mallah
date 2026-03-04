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

    // Format completed date
    const completedDate = project.completed_at
        ? new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(project.completed_at))
        : 'In Progress';

    const handleTogglePublic = async (checked: boolean) => {
        const result = await toggleProjectVisibilityAction(project.project_id, checked);
        if (result.success) {
            toast.success(checked ? 'Project is now public' : 'Project is now private');
        } else {
            toast.error(result.error);
        }
    };

    return (
        <div className={`flex flex-col rounded-xl overflow-hidden border transition-all ${isPublicView ? 'bg-card' : 'bg-card hover:border-primary/30'}`}>

            {/* Thumbnail area */}
            <div className="h-40 bg-muted/30 relative flex items-center justify-center border-b border-border/50 overflow-hidden">
                {project.thumbnail_url ? (
                    <img src={project.thumbnail_url} alt={project.title} className="w-full h-full object-cover" />
                ) : (
                    <LayoutTemplate className="w-10 h-10 text-muted-foreground/20" />
                )}

                {/* Visibility Overlay */}
                {!isPublicView && !project.is_public && (
                    <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center">
                        <div className="bg-background/90 px-3 py-1.5 rounded-full flex items-center gap-2 border shadow-sm">
                            <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="text-[10px] uppercase tracking-wider font-mono text-muted-foreground">Private</span>
                        </div>
                    </div>
                )}

                {/* Source Badge */}
                <Badge variant="secondary" className="absolute top-3 left-3 bg-background/90 backdrop-blur text-[10px] font-mono shadow-sm">
                    {t(`sourceBadge.${project.source_type}` as any)}
                </Badge>
            </div>

            <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start gap-4 mb-2">
                    <h3 className="font-bold text-lg text-foreground line-clamp-1">{project.title}</h3>

                    {!isPublicView && (
                        <div className="flex items-center gap-1.5 shrink-0" title={t('visibilityToggle')}>
                            {project.is_public ? <Eye className="w-3 h-3 text-muted-foreground" /> : <EyeOff className="w-3 h-3 text-muted-foreground/50" />}
                            <Switch
                                checked={project.is_public}
                                onCheckedChange={handleTogglePublic}
                                className="scale-75"
                            />
                        </div>
                    )}
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2 min-h-[40px]">
                    {project.description || project.personal_note || 'No description provided.'}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.tech_stack.slice(0, 4).map((tech: string, i: number) => (
                        <Badge key={i} variant="outline" className="text-[10px] text-muted-foreground border-border/50 bg-background">
                            {tech}
                        </Badge>
                    ))}
                    {project.tech_stack.length > 4 && (
                        <Badge variant="outline" className="text-[10px] text-muted-foreground border-border/50 bg-background">
                            +{project.tech_stack.length - 4}
                        </Badge>
                    )}
                </div>

                <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground/70 font-mono">
                        {completedDate}
                    </span>
                    <div className="flex gap-2">
                        {project.github_url && (
                            <Button size="icon" variant="ghost" className="w-8 h-8 rounded-full bg-primary/5 hover:bg-primary/10 text-primary" asChild>
                                <a href={project.github_url} target="_blank" rel="noopener noreferrer" title={t('viewCode')}>
                                    <Github className="w-4 h-4" />
                                </a>
                            </Button>
                        )}
                        {project.demo_url && (
                            <Button size="icon" variant="ghost" className="w-8 h-8 rounded-full bg-primary/5 hover:bg-primary/10 text-primary" asChild>
                                <a href={project.demo_url} target="_blank" rel="noopener noreferrer" title={t('viewDemo')}>
                                    <Globe className="w-4 h-4" />
                                </a>
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
