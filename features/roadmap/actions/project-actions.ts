'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { Project, UserProjectSubmission } from '../types';
import { EvaluationService } from '../services/evaluation-service';

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

    // Get user submission progress with latest review
    const { data: progressData } = await supabase
        .from('user_projects')
        .select(`
            *,
            project_reviews (
                *
            )
        `)
        .eq('user_id', user.id)
        .eq('project_id', projectId)
        .maybeSingle();

    const mappedSkills = (projectData.project_skills || [])
        .map((ps: { skills: unknown }) => ps.skills)
        .filter(Boolean);

    // Remove the original relation to avoid leaking structure
    delete projectData.project_skills;

    // Get the latest review if it exists
    const reviews = (progressData as any)?.project_reviews || [];
    const latestReview = reviews.length > 0 
        ? reviews.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0] 
        : null;

    return {
        ...projectData,
        skills: mappedSkills,
        user_status: progressData?.status || 'available',
        submission: progressData ? {
            ...progressData,
            latest_review: latestReview
        } : undefined
    } as (Project & { submission?: UserProjectSubmission, skills?: unknown[] });
}


export async function evaluateProjectAction(projectId: string): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: 'Unauthorized' };

    // 1. Get project and submission data
    const { data: project } = await supabase.from('projects').select('*').eq('project_id', projectId).single();
    const { data: submission } = await supabase.from('user_projects').select('*').eq('user_id', user.id).eq('project_id', projectId).single();

    if (!project || !submission || !submission.github_url) {
        return { success: false, error: 'Incomplete project or submission data' };
    }

    try {
        // 2. Set status to pending
        await supabase.from('user_projects').update({ review_status: 'pending' }).eq('id', submission.id);

        // 3. Call AI Service
        const evaluation = await EvaluationService.evaluateProject(project as Project, submission);

        // 4. Save review
        const { error: reviewError } = await supabase.from('project_reviews').insert({
            user_project_id: submission.id,
            overall_verdict: evaluation.overall_verdict,
            score: evaluation.score,
            score_total: 100,
            strengths: evaluation.strengths,
            improvements: evaluation.improvements,
            requirements_results: evaluation.requirements_results,
            recommended_topics: evaluation.recommended_topics,
            stretch_score: evaluation.stretch_score,
            submission_number: 1 // TODO: Increment if multiple submissions
        });

        if (reviewError) throw reviewError;

        // 5. Update user project status
        await supabase.from('user_projects').update({ 
            review_status: 'complete',
            grade: evaluation.score,
            status: 'completed'
        }).eq('id', submission.id);

        revalidatePath('/dashboard/roadmap');
        revalidatePath(`/dashboard/project/${projectId}`);
        return { success: true };
    } catch (error: any) {
        console.error('Evaluation Action Error:', error);
        await supabase.from('user_projects').update({ review_status: 'failed' }).eq('id', submission.id);
        return { success: false, error: error.message };
    }
}

export async function submitProjectAction(
    projectId: string,
    data: {
        github_url?: string;
        demo_url?: string;
        personal_note?: string;
        public_portfolio?: boolean;
        thumbnail_url?: string;
        tech_tags?: string[];
    }
): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: 'Unauthorized' };
    }

    const { data: submission, error } = await supabase
        .from('user_projects')
        .upsert({
            user_id: user.id,
            project_id: projectId,
            github_url: data.github_url || null,
            demo_url: data.demo_url || null,
            personal_note: data.personal_note || null,
            is_public: data.public_portfolio || false,
            thumbnail_url: data.thumbnail_url || null,
            tech_tags: data.tech_tags || null,
            status: 'completed',
            completed_at: new Date().toISOString(),
            review_status: data.github_url ? 'pending' : 'none'
        }, { onConflict: 'user_id, project_id' })
        .select()
        .single();

    if (error) {
        console.error('Error submitting project:', error);
        return { success: false, error: error.message };
    }

    // Trigger AI evaluation if GitHub URL is provided
    if (data.github_url) {
        // We trigger it asynchronously to not block the submission response
        evaluateProjectAction(projectId).catch(err => console.error('Delayed evaluation failed:', err));
    }

    // 2. Skill acquisition
    const { data: projectSkills } = await supabase
        .from('project_skills')
        .select('skill_id')
        .eq('project_id', projectId);

    if (projectSkills && projectSkills.length > 0) {
        const skillIds = projectSkills.map(ps => ps.skill_id);
        const { data: existingSkills } = await supabase
            .from('user_skills')
            .select('skill_id, level')
            .eq('user_id', user.id)
            .in('skill_id', skillIds);
            
        const existingSkillMap = new Map(existingSkills?.map(s => [s.skill_id, s.level]) || []);
        
        const finalSkillUpserts = projectSkills.map(ps => {
            const currentLevel = existingSkillMap.get(ps.skill_id);
            let nextLevel = 'beginner';
            if (currentLevel === 'beginner') nextLevel = 'intermediate';
            if (currentLevel === 'intermediate' || currentLevel === 'advanced') nextLevel = currentLevel;
            
            return {
                user_id: user.id,
                skill_id: ps.skill_id,
                level: currentLevel ? nextLevel : 'beginner',
                source: 'project',
                last_updated_at: new Date().toISOString()
            };
        });

        await supabase.from('user_skills').upsert(finalSkillUpserts, { onConflict: 'user_id, skill_id' });
    }

    // 3. Stage unlock logic
    const { data: currentProject } = await supabase
        .from('projects')
        .select('stage_id')
        .eq('project_id', projectId)
        .single();
        
    if (currentProject?.stage_id) {
        const { data: currentStage } = await supabase
            .from('stages')
            .select('path_id, order_index')
            .eq('stage_id', currentProject.stage_id)
            .single();
            
        if (currentStage) {
            const { data: nextStage } = await supabase
                .from('stages')
                .select('stage_id')
                .eq('path_id', currentStage.path_id)
                .gt('order_index', currentStage.order_index)
                .order('order_index', { ascending: true })
                .limit(1)
                .single();
                
            if (nextStage) {
                const { data: nextProjects } = await supabase
                    .from('projects')
                    .select('project_id, is_public_default')
                    .eq('stage_id', nextStage.stage_id);
                    
                if (nextProjects && nextProjects.length > 0) {
                    const nextProjectInserts = nextProjects.map(p => ({
                        user_id: user.id,
                        project_id: p.project_id,
                        status: 'available',
                        is_public: p.is_public_default !== false,
                        created_at: new Date().toISOString()
                    }));
                    
                    await supabase.from('user_projects').upsert(nextProjectInserts, { onConflict: 'user_id, project_id' });
                }
            }
        }
    }

    revalidatePath('/dashboard/roadmap');
    return { success: true };
}

export async function skipProjectAction(projectId: string): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: 'Unauthorized' };
    }

    // Get project default visibility to satisfy NOT NULL constraint
    const { data: project } = await supabase
        .from('projects')
        .select('is_public_default')
        .eq('project_id', projectId)
        .single();

    const { error } = await supabase
        .from('user_projects')
        .upsert({
            user_id: user.id,
            project_id: projectId,
            status: 'waiting',
            is_public: project?.is_public_default ?? true,
            skipped: true,
            skipped_at: new Date().toISOString()
        }, { onConflict: 'user_id, project_id' });

    if (error) {
        console.error('Error skipping project:', error);
        return { success: false, error: error.message };
    }

    // Trigger stage unlock logic
    const { data: currentProject } = await supabase
        .from('projects')
        .select('stage_id')
        .eq('project_id', projectId)
        .single();
        
    if (currentProject?.stage_id) {
        const { data: currentStage } = await supabase
            .from('stages')
            .select('path_id, order_index')
            .eq('stage_id', currentProject.stage_id)
            .single();
            
        if (currentStage) {
            const { data: nextStage } = await supabase
                .from('stages')
                .select('stage_id')
                .eq('path_id', currentStage.path_id)
                .gt('order_index', currentStage.order_index)
                .order('order_index', { ascending: true })
                .limit(1)
                .single();
                
            if (nextStage) {
                const { data: nextProjects } = await supabase
                    .from('projects')
                    .select('project_id, is_public_default')
                    .eq('stage_id', nextStage.stage_id);
                    
                if (nextProjects && nextProjects.length > 0) {
                    const nextProjectInserts = nextProjects.map(p => ({
                        user_id: user.id,
                        project_id: p.project_id,
                        status: 'available',
                        is_public: p.is_public_default !== false,
                        created_at: new Date().toISOString()
                    }));
                    
                    await supabase.from('user_projects').upsert(nextProjectInserts, { onConflict: 'user_id, project_id' });
                }
            }
        }
    }

    revalidatePath('/dashboard/roadmap');
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
