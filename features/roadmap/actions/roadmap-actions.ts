'use server';

import { createClient } from '@/lib/supabase/server';
import { RoadmapService } from '../services/roadmap-service';
import { RoadmapData } from '../types';

export async function getRoadmapAction(): Promise<RoadmapData | null> {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        throw new Error('Unauthorized');
    }

    try {
        return await RoadmapService.getUserRoadmap(user.id);
    } catch (err) {
        console.error('Error in getRoadmapAction:', err);
        throw new Error('Failed to fetch roadmap data');
    }
}
