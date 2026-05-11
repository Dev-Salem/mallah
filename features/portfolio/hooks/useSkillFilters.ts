'use client';

import { useState, useCallback, useMemo } from 'react';
import type { PortfolioSkill } from '../types';

export type SkillSourceFilter = 'all' | 'verified' | 'manual';
export type SkillVisibilityFilter = 'all' | 'public' | 'private';

export function useSkillFilters(skills: PortfolioSkill[]) {
    // 1. Use Local State instead of URL params for a "simpler" experience
    const [sourceFilter, setSourceFilter] = useState<SkillSourceFilter>('all');
    const [visibilityFilter, setVisibilityFilter] = useState<SkillVisibilityFilter>('all');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // 2. Local setter function
    const setFilter = useCallback((key: string, value: any) => {
        switch (key) {
            case 'source':
                setSourceFilter(value || 'all');
                break;
            case 'visibility':
                setVisibilityFilter(value || 'all');
                break;
            case 'category':
                setSelectedCategory(value);
                break;
            case 'q':
                setSearchQuery(value || '');
                break;
        }
    }, []);

    // 3. Derived State: Category Counts
    const categoryStats = useMemo(() => {
        const counts: Record<string, number> = {};
        
        skills.forEach(s => {
            const isVerified = s.source === 'roadmap' || s.source === 'project';
            const matchesSource = sourceFilter === 'all' || 
                                 (sourceFilter === 'verified' && isVerified) ||
                                 (sourceFilter === 'manual' && s.source === 'manual');
            
            const matchesVisibility = visibilityFilter === 'all' ||
                                     (visibilityFilter === 'public' && s.is_public) ||
                                     (visibilityFilter === 'private' && !s.is_public);

            if (matchesSource && matchesVisibility) {
                counts[s.category] = (counts[s.category] || 0) + 1;
            }
        });

        return Object.entries(counts)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([category, count]) => ({ category, count }));
    }, [skills, sourceFilter, visibilityFilter]);

    const totalCountForSource = useMemo(() => {
        return skills.filter(s => {
            const isVerified = s.source === 'roadmap' || s.source === 'project';
            const matchesSource = sourceFilter === 'all' || 
                                 (sourceFilter === 'verified' && isVerified) ||
                                 (sourceFilter === 'manual' && s.source === 'manual');
            
            const matchesVisibility = visibilityFilter === 'all' ||
                                     (visibilityFilter === 'public' && s.is_public) ||
                                     (visibilityFilter === 'private' && !s.is_public);

            return matchesSource && matchesVisibility;
        }).length;
    }, [skills, sourceFilter, visibilityFilter]);

    // 4. Derived State: Filtered Skills
    const filteredSkills = useMemo(() => {
        return skills.filter(s => {
            const isVerified = s.source === 'roadmap' || s.source === 'project';
            
            const matchesSource = sourceFilter === 'all' || 
                                 (sourceFilter === 'verified' && isVerified) ||
                                 (sourceFilter === 'manual' && s.source === 'manual');
            
            const matchesVisibility = visibilityFilter === 'all' ||
                                     (visibilityFilter === 'public' && s.is_public) ||
                                     (visibilityFilter === 'private' && !s.is_public);
            
            const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                 s.category.toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchesCategory = !selectedCategory || s.category === selectedCategory;
            
            return matchesSource && matchesVisibility && matchesSearch && matchesCategory;
        });
    }, [skills, sourceFilter, visibilityFilter, searchQuery, selectedCategory]);

    return {
        sourceFilter,
        visibilityFilter,
        selectedCategory,
        searchQuery,
        setFilter,
        setSearchQuery,
        filteredSkills,
        categoryStats,
        totalCountForSource
    };
}

