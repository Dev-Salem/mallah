'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import type { PortfolioProject } from '../types';

export type PortfolioTab = 'all' | 'available' | 'in_progress' | 'completed';
export type ProjectTypeFilter = 'all' | 'roadmap' | 'external';
export type VisibilityFilter = 'all' | 'public' | 'private';

export function usePortfolioFilters(projects: PortfolioProject[], isOwner: boolean) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // 1. Read state from URL
  const activeTab = (searchParams.get('tab') as PortfolioTab) || 'all';
  const typeFilter = (searchParams.get('type') as ProjectTypeFilter) || 'all';
  const visibilityFilter = (searchParams.get('visibility') as VisibilityFilter) || 'all';

  // 2. Sync state to URL
  const setFilter = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'all' || !value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    // Using router.replace to avoid clogging history with filter changes
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, router, pathname]);

  // 3. Derived State: Counts
  // We compute counts based on the current TYPE and VISIBILITY filters, but showing counts across ALL TABS
  // However, spec says "live badge count", usually meaning the count of items that WOULD show up in that tab.
  const counts = useMemo(() => {
    // We only filter by type and visibility to get the counts for each tab
    const baseList = projects.filter(project => {
        // Type Filter
        if (typeFilter !== 'all') {
            const isRoadmap = project.source_type === 'roadmap';
            if (typeFilter === 'roadmap' && !isRoadmap) return false;
            if (typeFilter === 'external' && isRoadmap) return false;
        }
        // Visibility Filter (Owner only)
        if (isOwner && visibilityFilter !== 'all') {
            if (visibilityFilter === 'public' && !project.is_public) return false;
            if (visibilityFilter === 'private' && project.is_public) return false;
        }
        return true;
    });

    return {
      all: baseList.length,
      available: baseList.filter(p => p.status === 'available').length,
      in_progress: baseList.filter(p => p.status === 'in_progress').length,
      completed: baseList.filter(p => p.status === 'completed').length,
    };
  }, [projects, typeFilter, visibilityFilter, isOwner]);

  // 4. Derived State: Filtered Projects (The actual list to render)
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      // Tab Filter
      if (activeTab !== 'all' && project.status !== activeTab) return false;

      // Type Filter
      if (typeFilter !== 'all') {
        const isRoadmap = project.source_type === 'roadmap';
        if (typeFilter === 'roadmap' && !isRoadmap) return false;
        if (typeFilter === 'external' && isRoadmap) return false;
      }

      // Visibility Filter (Owner only)
      if (isOwner && visibilityFilter !== 'all') {
        if (visibilityFilter === 'public' && !project.is_public) return false;
        if (visibilityFilter === 'private' && project.is_public) return false;
      }

      return true;
    });
  }, [projects, activeTab, typeFilter, visibilityFilter, isOwner]);

  return {
    activeTab,
    typeFilter,
    visibilityFilter,
    setFilter,
    filteredProjects,
    counts
  };
}
