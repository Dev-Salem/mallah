'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProjectCard } from './ProjectCard';
import { AddExternalProjectDrawer } from './AddExternalProjectDrawer';
import type { PortfolioProject } from '../types';

interface ProjectsSectionProps {
    projects: PortfolioProject[];
    catalog: { skill_id: string; name: string; category: string }[];
    isPublicView?: boolean;
}

export function ProjectsSection({ projects, catalog, isPublicView = false }: ProjectsSectionProps) {
    const t = useTranslations('PortfolioHub.projects');
    const tTabs = useTranslations('PortfolioHub.tabs');
    const [isAddOpen, setIsAddOpen] = useState(false);

    // On private dashboard, show all projects (completed, in_progress)
    // For public profile, the service already filters to 'completed' & 'is_public'
    const filterProjects = isPublicView ? projects : projects;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold font-mono tracking-wider uppercase text-foreground">
                    {tTabs('projects')}
                </h2>

                {!isPublicView && (
                    <Button onClick={() => setIsAddOpen(true)} size="sm" className="gap-2">
                        <Plus className="w-4 h-4" />
                        {t('addExternal')}
                    </Button>
                )}
            </div>

            {filterProjects.length === 0 ? (
                <div className="text-center py-16 px-4 border border-dashed rounded-xl border-primary/20 bg-primary/5">
                    <p className="text-muted-foreground">{t('noProjectsMessage')}</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filterProjects.map(project => (
                        <ProjectCard key={project.project_id} project={project} isPublicView={isPublicView} />
                    ))}
                </div>
            )}

            {!isPublicView && (
                <AddExternalProjectDrawer
                    open={isAddOpen}
                    onOpenChange={setIsAddOpen}
                    catalog={catalog}
                />
            )}
        </div>
    );
}
