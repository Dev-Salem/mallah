'use client';

import { ProjectCard } from "./ProjectCard";
import { Project } from "../types";
import { LayoutGrid, Lock } from "lucide-react";
import { useTranslations } from "next-intl";

interface ProjectCardGridProps {
    projects: Project[];
    viewMode: "private" | "public";
    initialOpenProjectId?: string | null;
    activeTab?: string;
    typeFilter?: string;
    visibilityFilter?: string;
    catalog: { skill_id: string; name: string; category: string }[];
}

export function ProjectCardGrid({ 
    projects, 
    viewMode, 
    initialOpenProjectId = null,
    activeTab = 'all',
    typeFilter = 'all',
    visibilityFilter = 'all',
    catalog
}: ProjectCardGridProps) {
    const t = useTranslations('PortfolioHub.projects');

    if (projects.length === 0) {
        let title = t('empty.all');
        let desc = t('empty.all_desc');

        if (viewMode === 'public') {
            title = t('accessRestricted');
            desc = t('publicEmptyState');
        } else {
            // Logic to pick the most relevant empty state based on priority: Tab > Type > Visibility
            if (activeTab !== 'all') {
                title = t(`empty.${activeTab}`);
                desc = t(`empty.${activeTab}_desc`);
            } else if (typeFilter !== 'all') {
                title = t(`empty.${typeFilter}`);
                desc = t(`empty.${typeFilter}_desc`);
            } else if (visibilityFilter !== 'all') {
                const visKey = visibilityFilter === 'public' ? 'public' : 'private';
                title = t(`empty.${visKey}`);
                desc = t(`empty.${visKey}_desc`);
            }
        }

        return (
            <div className="w-full py-20 px-6 border border-white/5 bg-muted/10 rounded-2xl flex flex-col items-center justify-center text-center gap-4">
                <div className="w-12 h-12 rounded-full bg-muted/20 flex items-center justify-center border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                    {viewMode === 'public' ? <Lock className="w-5 h-5 text-muted-foreground/60" /> : <LayoutGrid className="w-5 h-5 text-muted-foreground/60" />}
                </div>
                <div className="space-y-1">
                    <p className="font-mono text-sm uppercase tracking-widest text-foreground font-bold">
                        {title}
                    </p>
                    <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                        {desc}
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
                    catalog={catalog}
                />
            ))}
        </div>
    );
}
