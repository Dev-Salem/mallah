'use server';

import { createClient } from '@/lib/supabase/server';
import { Project, UserProjectSubmission } from '../types';

export async function getProjectAction(projectId: string): Promise<(Project & { submission?: UserProjectSubmission }) | null> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('Unauthorized');
    }

    const { data: projectData, error } = await supabase
        .from('projects')
        .select(`
            *,
            project_skills (
                skills (*)
            )
        `)
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

    const mappedSkills = (projectData.project_skills || [])
        .map((ps: { skills: unknown }) => ps.skills)
        .filter(Boolean);

    // Remove the original relation to avoid leaking structure
    delete projectData.project_skills;

    return {
        ...projectData,
        skills: mappedSkills,
        user_status: progressData?.status || 'available',
        submission: progressData || undefined
    } as (Project & { submission?: UserProjectSubmission, skills?: unknown[] });
}

export async function submitProjectAction(
    projectId: string,
    data: {
        github_url?: string;
        demo_url?: string;
        personal_note?: string;
        public_portfolio?: boolean;
        thumbnail_url?: string;
        tech_stack_tags?: string[];
    }
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
            github_url: data.github_url || null,
            demo_url: data.demo_url || null,
            personal_note: data.personal_note || null,
            public_portfolio: data.public_portfolio || false,
            thumbnail_url: data.thumbnail_url || null,
            tech_stack_tags: data.tech_stack_tags || null,
            status: 'completed',
            updated_at: new Date().toISOString()
        }, { onConflict: 'user_id, project_id' });

    if (error) {
        console.error('Error submitting project:', error);
        return { success: false, error: error.message };
    }

    return { success: true };
}

export async function getProjectBreadcrumb(projectId: string): Promise<{ pathName: string; stageTitle: string } | null> {
    const supabase = await createClient();

    // Get project -> stage -> path
    const { data: projectData, error } = await supabase
        .from('projects')
        .select('stage_id')
        .eq('project_id', projectId)
        .single();

    if (error || !projectData) return null;

    const { data: stageData, error: stageError } = await supabase
        .from('stages')
        .select('title, path_id')
        .eq('stage_id', projectData.stage_id)
        .single();

    if (stageError || !stageData) return null;

    const { data: pathData, error: pathError } = await supabase
        .from('paths')
        .select('name')
        .eq('path_id', stageData.path_id)
        .single();

    if (pathError || !pathData) return null;

    return {
        pathName: pathData.name,
        stageTitle: stageData.title,
    };
}
