'use client';

import { ProjectCard } from "./ProjectCard";
import { Project } from "../types";
import { LayoutGrid, Lock } from "lucide-react";
import { useTranslations } from "next-intl";

interface ProjectCardGridProps {
    projects: Project[];
    viewMode: "private" | "public";
    initialOpenProjectId?: string | null;
}

export function ProjectCardGrid({ projects, viewMode, initialOpenProjectId = null }: ProjectCardGridProps) {
    const t = useTranslations('PortfolioHub.projects');

    if (projects.length === 0) {
        return (
            <div className="w-full py-20 px-6 border-2 border-dashed border-primary/10 bg-primary/5 rounded-2xl flex flex-col items-center justify-center text-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                    {viewMode === 'public' ? <Lock className="w-6 h-6 text-primary/40" /> : <LayoutGrid className="w-6 h-6 text-primary/40" />}
                </div>
                <div className="space-y-1">
                    <p className="font-mono text-sm uppercase tracking-widest text-foreground font-bold">
                        {viewMode === 'public' ? t('accessRestricted') : t('systemReady')}
                    </p>
                    <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                        {viewMode === 'public' 
                            ? t('publicEmptyState')
                            : t('privateEmptyState')
                        }
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
                <ProjectCard 
                    key={project.id} 
                    project={project} 
                    viewMode={viewMode} 
                    initiallyOpen={project.id === initialOpenProjectId}
                />
            ))}
        </div>
    );
}
