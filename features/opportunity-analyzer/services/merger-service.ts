import { SCORE_WEIGHT_CV, SCORE_WEIGHT_MALLAH } from '../types';

export interface MergedSkill {
    name: string;
    level?: string;
    source: 'roadmap' | 'project' | 'manual' | 'cv';
    weight: number;
}

export const mergeProfileAndCVSkills = (
    mallahSkills: Array<{ skills?: { name: string }; level?: string; source?: string }>, 
    cvSkills: Array<{ skill_name: string; inferred_level: string }>
): MergedSkill[] => {
    const mergedMap = new Map<string, MergedSkill>();

    // 1. Add CV skills first at full weight
    cvSkills.forEach(cv => {
        const key = cv.skill_name.toLowerCase();
        mergedMap.set(key, {
            name: cv.skill_name,
            level: cv.inferred_level,
            source: 'cv',
            weight: SCORE_WEIGHT_CV
        });
    });

    // 2. Add Mallah skills, overwriting CV duplicates at full weight
    mallahSkills.forEach(m => {
        if (!m.skills?.name) return;
        
        const key = m.skills.name.toLowerCase();
        // Mallah verified skills override CV skills completely if they exist
        mergedMap.set(key, {
            name: m.skills.name,
            level: m.level,
            source: m.source as 'roadmap' | 'project' | 'manual',
            weight: SCORE_WEIGHT_MALLAH
        });
    });

    return Array.from(mergedMap.values());
};
