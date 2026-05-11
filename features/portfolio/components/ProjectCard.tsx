'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, Lock, Code2, User, Play, CheckCircle2, RotateCcw } from 'lucide-react';
import { Project } from '../types';
import { ProjectModal } from './ProjectModal';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { updateProjectStatusAction } from '../actions/portfolio-actions';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import './projectCards.css';

interface ProjectCardProps {
    project: Project;
    viewMode: "private" | "public";
    initiallyOpen?: boolean;
    catalog: { skill_id: string; name: string; category: string }[];
}

export function ProjectCard({ project, viewMode, initiallyOpen = false, catalog }: ProjectCardProps) {
    const t = useTranslations('PortfolioHub.projects');
    const [isModalOpen, setIsModalOpen] = useState(initiallyOpen);
    const [isUpdating, setIsUpdating] = useState(false);
    const [showUnmarkConfirm, setShowUnmarkConfirm] = useState(false);
    const [showMarkCompleteConfirm, setShowMarkCompleteConfirm] = useState(false);

    useEffect(() => {
        if (initiallyOpen) {
            setIsModalOpen(true);
        }
    }, [initiallyOpen]);

    const isRoadmap = project.sourceType === "roadmap";
    const isPrivate = !project.isPublic;
    const isCompleted = project.status === "completed";

    // Status Dot Logic
    const getStatusConfig = () => {
        // Privacy state takes priority in the dot
        if (isPrivate && isCompleted) return { color: "bg-destructive", glow: "dot-glow-destructive" };
        
        switch (project.status) {
            case "completed": return { color: "bg-success", glow: "dot-glow-success" };
            case "in_progress": return { color: "bg-warning", glow: "dot-glow-warning animate-status-pulse" };
            case "available": return { color: "bg-muted", glow: "" };
            default: return { color: "bg-muted", glow: "" };
        }
    };

    const statusConfig = getStatusConfig();

    const handleStartProject = async (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsUpdating(true);
        try {
            const result = await updateProjectStatusAction(project.id, 'in_progress');
            if (result.success) {
                toast.success(t('statusUpdated'));
            } else {
                toast.error(result.error);
            }
        } finally {
            setIsUpdating(false);
        }
    };

    const handlePauseProject = async (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsUpdating(true);
        try {
            const result = await updateProjectStatusAction(project.id, 'available');
            if (result.success) {
                toast.success(t('statusUpdated'));
            } else {
                toast.error(result.error);
            }
        } finally {
            setIsUpdating(false);
        }
    };

    const handleUnmarkComplete = async () => {
        setIsUpdating(true);
        try {
            const result = await updateProjectStatusAction(project.id, 'available');
            if (result.success) {
                toast.success(t('statusUpdated'));
                setShowUnmarkConfirm(false);
            } else {
                toast.error(result.error);
            }
        } finally {
            setIsUpdating(false);
        }
    };

    const handleMarkCompleteExternal = async () => {
        setIsUpdating(true);
        try {
            const result = await updateProjectStatusAction(project.id, 'completed');
            if (result.success) {
                toast.success(t('statusUpdated'));
                setShowMarkCompleteConfirm(false);
            } else {
                toast.error(result.error);
            }
        } finally {
            setIsUpdating(false);
        }
    };

    const handleMarkCompleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isRoadmap) {
            setIsModalOpen(true);
        } else {
            setShowMarkCompleteConfirm(true);
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
        <>
            <div 
                onClick={() => setIsModalOpen(true)}
                className="group relative flex flex-col glass-projects rounded-xl overflow-hidden glow-border-projects cursor-pointer transition-all hover:-translate-y-1"
            >
                {/* HUD Corners */}
                <div className="hud-corner hud-corner-tl" />
                <div className="hud-corner hud-corner-tr" />
                <div className="hud-corner hud-corner-bl" />
                <div className="hud-corner hud-corner-br" />

                {/* Thumbnail Area */}
                <div className="relative w-full aspect-[16/10] bg-accent/10 border-b border-border/40 overflow-hidden">
                    {project.thumbnailUrl ? (
                        <img 
                            src={project.thumbnailUrl} 
                            alt={project.title} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center border border-primary/10">
                                {isRoadmap ? <Code2 className="w-6 h-6 text-primary/30" /> : <User className="w-6 h-6 text-primary/30" />}
                            </div>
                            <span className="font-mono text-xs uppercase tracking-tight text-muted-foreground/80 px-4 text-center line-clamp-1">
                                {isRoadmap ? project.title : "User Added"}
                            </span>
                        </div>
                    )}

                    {/* Source Badge */}
                    <div className="absolute top-3 left-3">
                        <Badge variant="outline" className={cn("uppercase font-mono text-xs tracking-tight py-0.5 px-2 h-6 border-none", isRoadmap ? 'bg-info/10 text-info' : 'bg-success/10 text-success')}>
                            {isRoadmap ? 'Roadmap' : 'External'}
                        </Badge>
                    </div>

                    {/* Status Dot */}
                    <div className="absolute top-3 right-3">
                        <div className={cn("w-2.5 h-2.5 rounded-full", statusConfig.color, statusConfig.glow)} />
                    </div>

                    {/* Private Ribbon */}
                    {viewMode === "private" && isPrivate && (
                        <div className="absolute bottom-0 left-0 right-0 bg-destructive/90 backdrop-blur-sm text-white text-xs font-mono uppercase tracking-tight py-1.5 text-center">
                            Private — Hidden from public portfolio
                        </div>
                    )}
                </div>

                {/* Content Area */}
                <div className="p-5 flex-1 flex flex-col gap-3">
                    <div className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                            <h3 className="font-bold text-base text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                                {project.title}
                            </h3>
                            <Badge variant="outline" className={cn("uppercase font-mono text-xs h-5 px-2", getDifficultyStyles(project.difficulty))}>
                                {project.difficulty}
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                            {project.description}
                        </p>
                    </div>

                    {/* Tech Stack Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-auto">
                        {project.techStack.slice(0, 3).map(tech => (
                            <span key={tech} className="text-xs font-mono text-primary/90 bg-primary/5 px-2 py-0.5 rounded border border-primary/10">
                                {tech}
                            </span>
                        ))}
                        {project.techStack.length > 3 && (
                            <span className="text-[9px] font-mono text-muted-foreground/50 self-center">
                                +{project.techStack.length - 3}
                            </span>
                        )}
                    </div>

                    {/* CTA Bar (Owner Only) */}
                    {viewMode === "private" && (
                        <div className="pt-2 border-t border-white/5 flex gap-2" onClick={(e) => e.stopPropagation()}>
                            {project.status === 'available' && (
                                <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="flex-1 h-8 font-mono text-xs uppercase tracking-tight gap-1.5 bg-primary/5 hover:bg-primary/10 border-primary/20 text-primary"
                                    onClick={handleStartProject}
                                    disabled={isUpdating}
                                >
                                    <Play className="w-3 h-3" />
                                    {t('actions.start')}
                                </Button>
                            )}

                            {project.status === 'in_progress' && (
                                <div className="flex flex-1 gap-2">
                                    <Button 
                                        size="sm" 
                                        className="flex-1 h-8 font-mono text-xs uppercase tracking-tight gap-1.5 bg-success hover:bg-success/90 text-white"
                                        onClick={handleMarkCompleteClick}
                                        disabled={isUpdating}
                                    >
                                        <CheckCircle2 className="w-3 h-3" />
                                        {t('actions.mark_complete')}
                                    </Button>
                                    <Button 
                                        size="sm" 
                                        variant="ghost"
                                        className="h-8 px-2 font-mono text-xs uppercase tracking-tight text-muted-foreground hover:text-foreground hover:bg-white/5 border border-white/5"
                                        onClick={handlePauseProject}
                                        disabled={isUpdating}
                                        title={t('actions.pause')}
                                    >
                                        <RotateCcw className="w-3 h-3" />
                                    </Button>
                                </div>
                            )}

                            {project.status === 'completed' && !isRoadmap && (
                                <Button 
                                    size="sm" 
                                    variant="ghost"
                                    className="flex-1 h-8 font-mono text-xs uppercase tracking-tight gap-1.5 text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent hover:border-white/10"
                                    onClick={() => setShowUnmarkConfirm(true)}
                                    disabled={isUpdating}
                                >
                                    <RotateCcw className="w-3 h-3" />
                                    {t('actions.unmark_complete')}
                                </Button>
                            )}

                            {/* View Details / Expand Hint if no main action */}
                            {project.status === 'completed' && isRoadmap && (
                                <div className="flex-1 flex items-center justify-end gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                                    <span className="text-xs font-mono uppercase tracking-tight">View Outcome</span>
                                    <ArrowUpRight className="w-3 h-3" />
                                </div>
                            )}
                        </div>
                    )}

                    {viewMode === "public" && (
                        <div className="flex items-center justify-end gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                            <span className="text-xs font-mono uppercase tracking-tight">expand</span>
                            <ArrowUpRight className="w-3 h-3" />
                        </div>
                    )}
                </div>
            </div>

            <AlertDialog open={showUnmarkConfirm} onOpenChange={setShowUnmarkConfirm}>
                <AlertDialogContent className="glass-projects border-white/10">
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('actions.confirm_unmark')}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t('actions.unmark_warning')}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-white/5 border-white/10">{t('actions.cancel')}</AlertDialogCancel>
                        <AlertDialogAction onClick={handleUnmarkComplete} className="bg-primary hover:bg-primary/90 text-white">
                            {t('actions.unmark_complete')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={showMarkCompleteConfirm} onOpenChange={setShowMarkCompleteConfirm}>
                <AlertDialogContent className="glass-projects border-white/10">
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('actions.confirm_mark_complete')}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t('submissionModal.description')}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-white/5 border-white/10">{t('actions.cancel')}</AlertDialogCancel>
                        <AlertDialogAction onClick={handleMarkCompleteExternal} className="bg-success hover:bg-success/90 text-white">
                            {t('actions.mark_complete')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <ProjectModal 
                project={project}
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                viewMode={viewMode}
                catalog={catalog}
            />
        </>
    );
}
