'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProjectCardGrid } from './ProjectCardGrid';
import { AddExternalProjectDrawer } from './AddExternalProjectDrawer';
import { PortfolioProject, mapPortfolioProjectToProject } from '../types';
import { usePortfolioFilters, PortfolioTab, ProjectTypeFilter, VisibilityFilter } from '../hooks/usePortfolioFilters';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Filter, Eye, Globe, Lock, ChevronDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

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
    const {
        activeTab,
        typeFilter,
        visibilityFilter,
        searchQuery,
        setFilter,
        setSearchQuery,
        filteredProjects,
        counts
    } = usePortfolioFilters(projects, !isPublicView);

    // Map the internal projects to the UI Project types
    const mappedProjects = filteredProjects.map(mapPortfolioProjectToProject);
    const viewMode = isPublicView ? "public" : "private";

    useEffect(() => {
        if (!initialOpenProjectId || isPublicView) return;
        router.replace(pathname, { scroll: false });
    }, [initialOpenProjectId, isPublicView, pathname, router]);

    const tabOptions: { id: PortfolioTab; label: string }[] = [
        { id: 'all', label: t('tabs.all') },
        { id: 'available', label: t('tabs.available') },
        { id: 'in_progress', label: t('tabs.in_progress') },
        { id: 'completed', label: t('tabs.completed') },
    ];

    const typeOptions: { id: ProjectTypeFilter; label: string }[] = [
        { id: 'all', label: t('filters.all_types') },
        { id: 'roadmap', label: t('filters.roadmap') },
        { id: 'external', label: t('filters.external') },
    ];

    return (
        <div className="space-y-8">
            {/* Header & Status Tabs */}
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold font-mono tracking-wider uppercase text-foreground">
                        {tTabs('projects')}
                    </h2>

                    {!isPublicView && (
                        <Button onClick={() => setIsAddOpen(true)} size="sm" className="gap-2 bg-primary hover:bg-primary/90 text-white font-mono text-sm tracking-tight">
                            <Plus className="w-4 h-4" />
                            {t('addExternal')}
                        </Button>
                    )}
                </div>

                {/* HUD Tabs Bar */}
                <Tabs value={activeTab} onValueChange={(v) => setFilter('tab', v)} className="w-full">
                    <TabsList className="bg-muted/30 p-1 h-auto flex flex-wrap gap-1 sm:gap-2 border border-white/5">
                        {tabOptions.map((tab) => (
                            <TabsTrigger
                                key={tab.id}
                                value={tab.id}
                                className={cn(
                                    "flex items-center gap-2 py-2 px-4 font-mono text-sm tracking-tight uppercase transition-all data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm",
                                    activeTab === tab.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {tab.label}
                                <Badge 
                                    variant="outline" 
                                    className={cn(
                                        "h-5 min-w-[20px] px-1 border-none bg-muted/50 text-xs",
                                        activeTab === tab.id ? "bg-primary/20 text-primary" : "text-muted-foreground"
                                    )}
                                >
                                    {counts[tab.id]}
                                </Badge>
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>
            </div>

            {/* Filter Controls (Owner Only) */}
            {!isPublicView && (
                <div className="flex flex-wrap items-center justify-between gap-4 py-2 border-y border-white/5">
                    <div className="flex flex-wrap items-center gap-6">
                        {/* Type Filter Chips */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-mono uppercase text-muted-foreground mr-2">{t('filters.type')}:</span>
                            <div className="flex bg-muted/20 p-1 rounded-md border border-white/5">
                                {typeOptions.map((opt) => (
                                    <button
                                        key={opt.id}
                                        onClick={() => setFilter('type', opt.id)}
                                        className={cn(
                                            "px-3 py-1 text-xs font-mono uppercase tracking-tight transition-all rounded-sm",
                                            typeFilter === opt.id 
                                                ? "bg-background text-primary shadow-sm" 
                                                : "text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Visibility Dropdown */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-mono uppercase text-muted-foreground mr-2">{t('filters.visibility')}:</span>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" className="h-8 border-white/5 bg-muted/20 font-mono text-xs gap-2 hover:bg-muted/40">
                                        {visibilityFilter === 'all' && <Globe className="w-3 h-3" />}
                                        {visibilityFilter === 'public' && <Eye className="w-3 h-3" />}
                                        {visibilityFilter === 'private' && <Lock className="w-3 h-3" />}
                                        {visibilityFilter === 'all' ? t('filters.all_visibility') : 
                                        visibilityFilter === 'public' ? t('filters.public_only') : 
                                        t('filters.private_only')}
                                        <ChevronDown className="w-3 h-3 opacity-50" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-background border-white/10 font-mono">
                                    <DropdownMenuLabel className="text-[10px] uppercase text-muted-foreground">{t('filters.visibility')}</DropdownMenuLabel>
                                    <DropdownMenuSeparator className="bg-white/5" />
                                    <DropdownMenuItem onClick={() => setFilter('visibility', 'all')} className="text-xs gap-2">
                                        <Globe className="w-3 h-3" /> {t('filters.all_visibility')}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setFilter('visibility', 'public')} className="text-xs gap-2">
                                        <Eye className="w-3 h-3" /> {t('filters.public_only')}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setFilter('visibility', 'private')} className="text-xs gap-2">
                                        <Lock className="w-3 h-3" /> {t('filters.private_only')}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    {/* Search Input - Local state search */}
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground opacity-50" />
                        <Input
                            placeholder={t('filters.searchPlaceholder')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 h-8 bg-muted/10 border-white/5 font-mono text-xs focus-visible:ring-primary/20 rounded-md"
                        />
                    </div>
                </div>
            )}

            <ProjectCardGrid 
                projects={mappedProjects} 
                viewMode={viewMode} 
                initialOpenProjectId={initialOpenProjectId}
                activeTab={activeTab}
                typeFilter={typeFilter}
                visibilityFilter={visibilityFilter}
                catalog={catalog}
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
