'use server';

import { createClient } from '@/lib/supabase/server';
import { Project } from '../types';

export interface UserProjectSubmission {
    user_project_id: string;
    submission_url: string | null;
    submission_notes: string | null;
    thumbnail_url: string | null;
    status: 'not_started' | 'in_progress' | 'completed';
    feedback: string | null;
    grade: number | null;
    updated_at: string;
}

export async function getProjectAction(projectId: string): Promise<(Project & { submission?: UserProjectSubmission }) | null> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('Unauthorized');
    }

    const { data: projectData, error } = await supabase
        .from('projects')
        .select('*')
        .eq('project_id', projectId)
        .single();

    if (error || !projectData) {
        console.error('Error fetching project:', error);
        return null;
    }

    // Get user submission progress
    const { data: progressData } = await supabase
        .from('user_projects')
        .select('*')
        .eq('user_id', user.id)
        .eq('project_id', projectId)
        .maybeSingle();

    return {
        ...projectData,
        user_status: progressData?.status || 'available',
        submission: progressData || undefined
    } as (Project & { submission?: UserProjectSubmission });
}

export async function submitProjectAction(
    projectId: string,
    data: { submission_url: string; submission_notes?: string }
): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: 'Unauthorized' };
    }

    const { error } = await supabase
        .from('user_projects')
        .upsert({
            user_id: user.id,
            project_id: projectId,
            submission_url: data.submission_url,
            submission_notes: data.submission_notes || null,
            status: 'completed',
            updated_at: new Date().toISOString()
        }, { onConflict: 'user_id, project_id' });

    if (error) {
        console.error('Error submitting project:', error);
        return { success: false, error: error.message };
    }

    return { success: true };
}
