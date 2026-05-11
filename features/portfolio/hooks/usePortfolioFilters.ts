'use client';

import { useState, useCallback, useMemo } from 'react';
import type { PortfolioProject } from '../types';

export type PortfolioTab = 'all' | 'available' | 'in_progress' | 'completed';
export type ProjectTypeFilter = 'all' | 'roadmap' | 'external';
export type VisibilityFilter = 'all' | 'public' | 'private';

export function usePortfolioFilters(projects: PortfolioProject[], isOwner: boolean) {
  // 1. Local State for instant, non-navigational filtering
  const [activeTab, setActiveTab] = useState<PortfolioTab>('all');
  const [typeFilter, setTypeFilter] = useState<ProjectTypeFilter>('all');
  const [visibilityFilter, setVisibilityFilter] = useState<VisibilityFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 2. Local setter function
  const setFilter = useCallback((key: string, value: any) => {
    switch (key) {
      case 'tab':
        setActiveTab(value || 'all');
        break;
      case 'type':
        setTypeFilter(value || 'all');
        break;
      case 'visibility':
        setVisibilityFilter(value || 'all');
        break;
      case 'q':
        setSearchQuery(value || '');
        break;
    }
  }, []);

  // 3. Derived State: Counts
  const counts = useMemo(() => {
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

  // 4. Derived State: Filtered Projects
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

      // Search Query Filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = project.title.toLowerCase().includes(query);
        const matchesDesc = project.description?.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc) return false;
      }

      return true;
    });
  }, [projects, activeTab, typeFilter, visibilityFilter, isOwner, searchQuery]);

  return {
    activeTab,
    typeFilter,
    visibilityFilter,
    searchQuery,
    setFilter,
    setSearchQuery,
    filteredProjects,
    counts
  };
}
