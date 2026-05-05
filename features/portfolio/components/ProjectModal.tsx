'use client';

import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, Globe, Calendar, Trash2, CheckCircle2, Lock, Unlock } from "lucide-react";
import { Project, RoadmapProject, ExternalProject } from "../types";
import { useTranslations } from "next-intl";
import { toggleProjectVisibilityAction, deleteProjectAction } from "../actions/portfolio-actions";
import { toast } from "sonner";
import { useState } from "react";

interface ProjectModalProps {
    project: Project;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    viewMode: "private" | "public";
}

export function ProjectModal({ project, open, onOpenChange, viewMode }: ProjectModalProps) {
    const t = useTranslations('PortfolioHub.projects');
    const [isUpdating, setIsUpdating] = useState(false);

    const isRoadmap = project.sourceType === "roadmap";
    const isPrivate = !project.isPublic;

    const handleToggleVisibility = async () => {
        setIsUpdating(true);
        try {
            const result = await toggleProjectVisibilityAction(project.id, !project.isPublic);
            if (result.success) {
                toast.success(!project.isPublic ? t('visibilityPublic') : t('visibilityPrivate'));
            } else {
                toast.error(result.error);
            }
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm(t('confirmDelete' as any || 'Are you sure you want to delete this project?'))) return;
        setIsUpdating(true);
        try {
            const result = await deleteProjectAction(project.id);
            if (result.success) {
                toast.success(t('projectDeleted' as any || 'Project deleted successfully.'));
                onOpenChange(false);
            } else {
                toast.error(result.error);
            }
        } finally {
            setIsUpdating(false);
        }
    };

    // Helper to get skill color based on category
    const getSkillColor = (category: string) => {
        switch (category) {
            case "fundamentals": return "bg-info/10 text-info border-info/20";
            case "language": return "bg-primary/10 text-primary border-primary/20";
            case "framework_library": return "bg-success/10 text-success border-success/20";
            case "tool": return "bg-warning/10 text-warning border-warning/20";
            case "platform_service": return "bg-info/10 text-info border-info/20";
            default: return "bg-muted text-muted-foreground border-border";
        }
    };

    const getDifficultyStyles = (level: string) => {
        switch (level) {
            case "beginner": return "bg-success/12 text-success border-success/30";
            case "intermediate": return "bg-warning/12 text-warning border-warning/30";
            case "advanced": return "bg-destructive/12 text-[oklch(0.70_0.18_25)] border-destructive/30";
            default: return "";
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl glass-projects p-0 overflow-hidden border-none shadow-2xl">
                {/* Thumbnail Header */}
                <div className="relative w-full aspect-video bg-muted/20">
                    {project.thumbnailUrl ? (
                        <img src={project.thumbnailUrl} alt={project.title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-accent/20 gap-4">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                                {isRoadmap ? <Lock className="w-8 h-8 text-primary/40" /> : <Unlock className="w-8 h-8 text-primary/40" />}
                            </div>
                            <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
                                {isRoadmap ? project.title : "User Added Project"}
                            </span>
                        </div>
                    )}

                    {/* Privacy Banner */}
                    {isPrivate && (
                        <div className="absolute bottom-0 left-0 right-0 bg-destructive/90 text-white py-1.5 px-4 text-[10px] font-mono uppercase tracking-widest flex items-center gap-2 backdrop-blur-sm">
                            <Lock className="w-3 h-3" />
                            {t('privateNotice')}
                        </div>
                    )}
                </div>

                <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto">
                    {/* Header Info */}
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                                <Badge variant="outline" className={`uppercase font-mono text-[10px] tracking-wider ${isRoadmap ? 'text-info border-info/30 bg-info/5' : 'text-success border-success/30 bg-success/5'}`}>
                                    {isRoadmap ? t('sourceBadge.roadmap' as any) : t('sourceBadge.user_custom' as any)}
                                </Badge>
                                <Badge variant="outline" className={`uppercase font-mono text-[10px] tracking-wider ${getDifficultyStyles(project.difficulty)}`}>
                                    {project.difficulty}
                                </Badge>
                                <Badge variant="outline" className={`uppercase font-mono text-[10px] tracking-wider ${project.status === 'completed' ? 'text-success border-success/30 bg-success/5' : 'text-warning border-warning/30 bg-warning/5'}`}>
                                    {project.status === 'completed' ? t('statusCompleted' as any) : t('statusInProgress' as any)}
                                </Badge>
                            </div>
                            <DialogTitle className="text-3xl font-bold tracking-tight text-foreground">
                                {project.title}
                            </DialogTitle>
                            {project.completedAt && (
                                <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {t('completedDateLabel' as any || 'Completed')}: {new Date(project.completedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                            {project.githubUrl && (
                                <Button size="sm" variant="outline" className="gap-2 font-mono text-xs border-primary/20 hover:bg-primary/5" asChild>
                                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                                        <Github className="w-4 h-4" /> GITHUB
                                    </a>
                                </Button>
                            )}
                            {project.demoUrl && (
                                <Button size="sm" className="gap-2 font-mono text-xs bg-primary hover:bg-primary/90 text-white" asChild>
                                    <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                                        <Globe className="w-4 h-4" /> LIVE DEMO
                                    </a>
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-1">{t('technicalOverview')}</h4>
                        <p className="text-sm leading-relaxed text-muted-foreground/90">
                            {project.description}
                        </p>
                    </div>

                    {/* Roadmap Only: Personal Note */}
                    {isRoadmap && (project as RoadmapProject).personalNote && (
                        <div className="space-y-3">
                            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-primary/60 border-b border-primary/10 pb-1">{t('personalNoteLabel')}</h4>
                            <div className="p-4 rounded-r-lg bg-primary/5 border-l-2 border-primary/40 italic text-sm text-foreground/90 leading-relaxed">
                                "{(project as RoadmapProject).personalNote}"
                            </div>
                        </div>
                    )}

                    {/* Tech Stack & Skills */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-1">{t('techStack')}</h4>
                            <div className="flex flex-wrap gap-2">
                                {project.techStack.length > 0 ? project.techStack.map(tech => (
                                    <Badge key={tech} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/15 border-transparent text-[10px] font-mono">
                                        {tech}
                                    </Badge>
                                )) : (
                                    <span className="text-xs text-muted-foreground italic font-mono">{t('noStack' as any || 'No stack specified')}</span>
                                )}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-1">{t('formalSkills')}</h4>
                            <div className="flex flex-wrap gap-2">
                                {project.skills.length > 0 ? project.skills.map(skill => (
                                    <Badge key={skill.name} variant="outline" className={`text-[10px] font-mono uppercase ${getSkillColor(skill.category)}`}>
                                        {skill.name}
                                    </Badge>
                                )) : (
                                    <span className="text-xs text-muted-foreground italic font-mono">{t('noSkills' as any || 'No skills linked')}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Private Controls Section */}
                    {viewMode === "private" && (
                        <div className="pt-6 mt-6 border-t border-border/40 flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className={`gap-2 font-mono text-[10px] tracking-wider uppercase transition-colors ${isPrivate ? 'text-success hover:bg-success/10' : 'text-destructive hover:bg-destructive/10'}`}
                                    onClick={handleToggleVisibility}
                                    disabled={isUpdating}
                                >
                                    {isPrivate ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                                    {isPrivate ? t('setPublic') : t('setPrivate')}
                                </Button>
                                
                                {!isRoadmap && (
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="gap-2 font-mono text-[10px] tracking-wider uppercase text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                        onClick={handleDelete}
                                        disabled={isUpdating}
                                    >
                                        <Trash2 className="w-3.5 h-3.5" /> {t('deleteProject')}
                                    </Button>
                                )}
                            </div>

                            {isRoadmap && project.status !== 'completed' && (
                                <Button size="sm" className="gap-2 font-mono text-xs bg-success hover:bg-success/90 text-white shadow-[0_0_10px_rgba(var(--success),0.2)]">
                                    <CheckCircle2 className="w-4 h-4" /> {t('markAsComplete')}
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
