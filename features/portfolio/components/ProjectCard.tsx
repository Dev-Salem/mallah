'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, Lock, Code2, User } from 'lucide-react';
import { Project } from '../types';
import { ProjectModal } from './ProjectModal';
import './projectCards.css';

interface ProjectCardProps {
    project: Project;
    viewMode: "private" | "public";
}

export function ProjectCard({ project, viewMode }: ProjectCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

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
                            <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground/60 px-4 text-center line-clamp-1">
                                {isRoadmap ? project.title : "User Added"}
                            </span>
                        </div>
                    )}

                    {/* Source Badge */}
                    <div className="absolute top-3 left-3">
                        <Badge variant="outline" className={`uppercase font-mono text-[9px] tracking-wider py-0 px-2 h-5 border-none ${isRoadmap ? 'bg-info/10 text-info' : 'bg-success/10 text-success'}`}>
                            {isRoadmap ? 'Roadmap' : 'External'}
                        </Badge>
                    </div>

                    {/* Status Dot */}
                    <div className="absolute top-3 right-3">
                        <div className={`w-2.5 h-2.5 rounded-full ${statusConfig.color} ${statusConfig.glow}`} />
                    </div>

                    {/* Private Ribbon */}
                    {viewMode === "private" && isPrivate && (
                        <div className="absolute bottom-0 left-0 right-0 bg-destructive/80 backdrop-blur-sm text-white text-[9px] font-mono uppercase tracking-widest py-1 text-center">
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
                            <Badge variant="outline" className={`uppercase font-mono text-[9px] h-4 px-1.5 ${getDifficultyStyles(project.difficulty)}`}>
                                {project.difficulty}
                            </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground/80 line-clamp-2 leading-relaxed">
                            {project.description}
                        </p>
                    </div>

                    {/* Tech Stack Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-auto">
                        {project.techStack.slice(0, 3).map(tech => (
                            <span key={tech} className="text-[9px] font-mono text-primary/70 bg-primary/5 px-1.5 py-0.5 rounded border border-primary/10">
                                {tech}
                            </span>
                        ))}
                        {project.techStack.length > 3 && (
                            <span className="text-[9px] font-mono text-muted-foreground/50 self-center">
                                +{project.techStack.length - 3}
                            </span>
                        )}
                    </div>

                    {/* Expand Hint */}
                    <div className="flex items-center justify-end gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                        <span className="text-[10px] font-mono uppercase tracking-tighter">expand</span>
                        <ArrowUpRight className="w-3 h-3" />
                    </div>
                </div>
            </div>

            <ProjectModal 
                project={project}
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                viewMode={viewMode}
            />
        </>
    );
}
