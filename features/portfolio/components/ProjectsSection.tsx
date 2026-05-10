'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProjectCardGrid } from './ProjectCardGrid';
import { AddExternalProjectDrawer } from './AddExternalProjectDrawer';
import { PortfolioProject, mapPortfolioProjectToProject } from '../types';

interface ProjectsSectionProps {
    projects: PortfolioProject[];
    catalog: { skill_id: string; name: string; category: string }[];
    isPublicView?: boolean;
    initialOpenProjectId?: string | null;
}

export function ProjectsSection({ projects, catalog, isPublicView = false, initialOpenProjectId = null }: ProjectsSectionProps) {
    const t = useTranslations('PortfolioHub.projects');
    const tTabs = useTranslations('PortfolioHub.tabs');
    const [isAddOpen, setIsAddOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    // Map the internal projects to the UI Project types
    const mappedProjects = projects.map(mapPortfolioProjectToProject);
    const viewMode = isPublicView ? "public" : "private";

    useEffect(() => {
        if (!initialOpenProjectId || isPublicView) return;
        router.replace(pathname, { scroll: false });
    }, [initialOpenProjectId, isPublicView, pathname, router]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold font-mono tracking-wider uppercase text-foreground">
                    {tTabs('projects')}
                </h2>

                {!isPublicView && (
                    <Button onClick={() => setIsAddOpen(true)} size="sm" className="gap-2 bg-primary hover:bg-primary/90 text-white font-mono text-xs tracking-tighter">
                        <Plus className="w-4 h-4" />
                        ADD EXTERNAL
                    </Button>
                )}
            </div>

            <ProjectCardGrid 
                projects={mappedProjects} 
                viewMode={viewMode} 
                initialOpenProjectId={initialOpenProjectId}
            />

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
