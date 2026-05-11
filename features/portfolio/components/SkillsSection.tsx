'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Eye, Globe, Lock, ChevronDown, Check, Search, Sparkles, Plus, LayoutGrid, ShieldCheck, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useSkillFilters } from '../hooks/useSkillFilters';
import type { PortfolioSkill } from '../types';
import { SkillCard } from './SkillCard';
import { AddExternalSkillDrawer } from './AddExternalSkillDrawer';

interface SkillsSectionProps {
    skills: PortfolioSkill[];
    catalog: { skill_id: string; name: string; category: string }[];
    isPublicView?: boolean;
}

export function SkillsSection({ skills, catalog, isPublicView = false }: SkillsSectionProps) {
    const t = useTranslations('PortfolioHub.skills');
    const tTabs = useTranslations('PortfolioHub.tabs');
    const [isAddOpen, setIsAddOpen] = useState(false);

    const {
        sourceFilter,
        visibilityFilter,
        selectedCategory,
        searchQuery,
        setFilter,
        setSearchQuery,
        filteredSkills,
        categoryStats,
        totalCountForSource
    } = useSkillFilters(skills);

    // Helper to format category names (e.g., FRAMEWORK_LIBRARY -> Framework Library)
    const formatCategory = (name: string) => {
        return name
            .split(/[_\s]+/)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    const sourceOptions = [
        { id: 'all', label: t('filters.all_sources') },
        { id: 'verified', label: t('filters.roadmap') },
        { id: 'manual', label: t('filters.manual') },
    ];

    return (
        <div className="space-y-8">
            {/* Header & Category Tabs (Primary Filter) */}
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold font-mono tracking-wider uppercase text-foreground">
                        {tTabs('skills')}
                    </h2>

                    {!isPublicView && (
                        <Button onClick={() => setIsAddOpen(true)} size="sm" className="gap-2 bg-primary hover:bg-primary/90 text-white font-mono text-sm tracking-tight">
                            <Plus className="w-4 h-4" />
                            {t('addSkill')}
                        </Button>
                    )}
                </div>

                {/* HUD Tabs Bar - Now for Categories with Horizontal Scroll */}
                <Tabs 
                    value={selectedCategory || 'all'} 
                    onValueChange={(v) => setFilter('category', v === 'all' ? null : v)} 
                    className="w-full"
                >
                    <TabsList className="bg-muted/30 p-1 h-auto flex flex-nowrap overflow-x-auto gap-1 sm:gap-2 border border-white/5 w-full justify-start no-scrollbar">
                        <style jsx global>{`
                            .no-scrollbar::-webkit-scrollbar { display: none; }
                            .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                        `}</style>
                        <TabsTrigger
                            value="all"
                            className={cn(
                                "flex items-center gap-2 py-2 px-4 font-mono text-sm tracking-tight uppercase transition-all data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm shrink-0",
                                !selectedCategory ? "text-primary" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {t('filters.all_categories')}
                            <Badge 
                                variant="outline" 
                                className={cn(
                                    "h-5 min-w-[20px] px-1 border-none bg-muted/50 text-xs",
                                    !selectedCategory ? "bg-primary/20 text-primary" : "text-muted-foreground"
                                )}
                            >
                                {skills.length}
                            </Badge>
                        </TabsTrigger>

                        {categoryStats.map(({ category, count }) => (
                            <TabsTrigger
                                key={category}
                                value={category}
                                className={cn(
                                    "flex items-center gap-2 py-2 px-4 font-mono text-sm tracking-tight uppercase transition-all data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm shrink-0",
                                    selectedCategory === category ? "text-primary" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {formatCategory(category)}
                                <Badge 
                                    variant="outline" 
                                    className={cn(
                                        "h-5 min-w-[20px] px-1 border-none bg-muted/50 text-xs",
                                        selectedCategory === category ? "bg-primary/20 text-primary" : "text-muted-foreground"
                                    )}
                                >
                                    {count}
                                </Badge>
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>
            </div>

            {/* Secondary Filter Row (Source & Visibility) */}
            <div className="flex flex-wrap items-center justify-between gap-6 py-3 border-y border-white/5">
                <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                    {/* Source Chips Filter */}
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-mono uppercase text-muted-foreground tracking-widest">{t('filters.source')}</span>
                        <div className="flex bg-muted/20 p-1 rounded-lg border border-white/5">
                            {sourceOptions.map((opt) => (
                                <button
                                    key={opt.id}
                                    onClick={() => setFilter('source', opt.id)}
                                    className={cn(
                                        "px-3 py-1.5 text-[10px] sm:text-xs font-mono uppercase tracking-tight transition-all rounded-md whitespace-nowrap",
                                        sourceFilter === opt.id 
                                            ? "bg-background text-primary shadow-sm" 
                                            : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Visibility Filter Dropdown */}
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-mono uppercase text-muted-foreground tracking-widest">{t('filters.visibility')}</span>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-9 border-white/5 bg-muted/20 font-mono text-xs gap-3 hover:bg-muted/40 min-w-[140px] justify-between rounded-lg">
                                    <div className="flex items-center gap-2">
                                        {visibilityFilter === 'all' && <Globe className="w-3.5 h-3.5 opacity-50" />}
                                        {visibilityFilter === 'public' && <Eye className="w-3.5 h-3.5 opacity-50 text-primary" />}
                                        {visibilityFilter === 'private' && <Lock className="w-3.5 h-3.5 opacity-50 text-orange-500" />}
                                        <span className="truncate">
                                            {visibilityFilter === 'all' ? t('filters.all_visibility') : 
                                             visibilityFilter === 'public' ? t('filters.public_only') : 
                                             t('filters.private_only')}
                                        </span>
                                    </div>
                                    <ChevronDown className="w-3.5 h-3.5 opacity-30" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="bg-background border-white/10 font-mono w-[180px] rounded-xl p-1.5">
                                <DropdownMenuLabel className="text-[9px] uppercase text-muted-foreground px-2 py-1.5 tracking-widest">{t('filters.visibility')}</DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-white/5 mx-1" />
                                <DropdownMenuItem onClick={() => setFilter('visibility', 'all')} className="text-xs gap-3 cursor-pointer rounded-md">
                                    <Globe className="w-3.5 h-3.5" />
                                    {t('filters.all_visibility')}
                                    {visibilityFilter === 'all' && <Check className="ml-auto w-3.5 h-3.5 text-primary" />}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setFilter('visibility', 'public')} className="text-xs gap-3 cursor-pointer rounded-md">
                                    <Eye className="w-3.5 h-3.5" />
                                    {t('filters.public_only')}
                                    {visibilityFilter === 'public' && <Check className="ml-auto w-3.5 h-3.5 text-primary" />}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setFilter('visibility', 'private')} className="text-xs gap-3 cursor-pointer rounded-md">
                                    <Lock className="w-3.5 h-3.5" />
                                    {t('filters.private_only')}
                                    {visibilityFilter === 'private' && <Check className="ml-auto w-3.5 h-3.5 text-primary" />}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Search Input - Integrated into the same HUD row */}
                <div className="relative w-full sm:w-72 ml-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground opacity-40" />
                    <Input
                        placeholder={t('filters.searchPlaceholder')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-9 bg-muted/10 border-white/5 font-mono text-xs focus-visible:ring-primary/20 rounded-lg placeholder:opacity-50"
                    />
                </div>
            </div>

            {/* Skills Grid */}
            {skills.length === 0 ? (
                <div className="relative group">
                    <div className="absolute inset-0 bg-primary/5 rounded-[2rem] blur-xl" />
                    <div className="relative flex flex-col items-center justify-center py-24 px-6 border-2 border-dashed border-primary/10 rounded-[2rem] bg-muted/5 text-center">
                        <div className="w-16 h-16 rounded-3xl bg-primary/5 flex items-center justify-center mb-4">
                            <Sparkles className="w-8 h-8 text-primary/20" />
                        </div>
                        <h3 className="text-lg font-bold text-primary mb-2">No skills discovered</h3>
                        <p className="text-sm text-muted-foreground max-w-sm">
                            {t('noSkillsMessage')}
                        </p>
                    </div>
                </div>
            ) : filteredSkills.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                        <Search className="w-6 h-6 text-muted-foreground/30" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
                        {t('noSearchMatch')}
                    </p>
                    <Button variant="ghost" onClick={() => {
                        setFilter('q', null);
                        setFilter('category', null);
                        setFilter('source', 'all');
                    }} className="text-xs font-bold text-primary">
                        Clear all filters
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredSkills.map(skill => (
                        <SkillCard key={skill.skill_id} skill={skill} isPublicView={isPublicView} />
                    ))}
                </div>
            )}

            {!isPublicView && (
                <AddExternalSkillDrawer
                    open={isAddOpen}
                    onOpenChange={setIsAddOpen}
                    catalog={catalog}
                    existingIds={skills.map(s => s.skill_id)}
                />
            )}
        </div>
    );
}

