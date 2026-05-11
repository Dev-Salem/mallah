'use server';

import { createClient } from '@/lib/supabase/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import { addManualSkillSchema, addExternalProjectSchema, updateBioSchema, updateExternalProjectSchema } from '../types';
import type { AddManualSkillInput, AddExternalProjectInput, UpdateBioInput, UpdateExternalProjectInput } from '../types';
import { updateProjectStatus, deleteExternalProject, updateExternalProject } from '../services/portfolio-service';

type ActionResult = { success: true } | { success: false; error: string };

// ─── Toggle skill visibility ───
export async function toggleSkillVisibilityAction(skillId: string, isPublic: boolean): Promise<ActionResult> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    const { error } = await supabase
        .from('user_skills')
        .update({ is_public: isPublic })
        .eq('user_id', user.id)
        .eq('skill_id', skillId);

    if (error) return { success: false, error: error.message };
    revalidatePath('/dashboard/portfolio');
    return { success: true };
}

// ─── Toggle project visibility ───
export async function toggleProjectVisibilityAction(projectId: string, isPublic: boolean): Promise<ActionResult> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    const { error } = await supabase
        .from('user_projects')
        .update({ is_public: isPublic })
        .eq('user_id', user.id)
        .eq('id', projectId);

    if (error) return { success: false, error: error.message };
    revalidatePath('/dashboard/portfolio');
    return { success: true };
}

// ─── Add manual skill ───
export async function addManualSkillAction(input: AddManualSkillInput): Promise<ActionResult> {
    const parsed = addManualSkillSchema.safeParse(input);
    if (!parsed.success) return { success: false, error: 'Invalid input' };

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    const admin = getSupabaseAdmin();
    let finalSkillId = parsed.data.skill_id;

    // 1. Handle Custom Skill Creation
    if (!finalSkillId && parsed.data.custom_name) {
        // Check if a skill with this name already exists (to avoid duplicate skills in catalog)
        const { data: existingSkill } = await admin
            .from('skills')
            .select('skill_id')
            .ilike('name', parsed.data.custom_name)
            .maybeSingle();

        if (existingSkill) {
            finalSkillId = existingSkill.skill_id;
        } else {
            // Create new unverified skill
            const { data: newSkill, error: skillErr } = await admin
                .from('skills')
                .insert({
                    skill_id: crypto.randomUUID(),
                    name: parsed.data.custom_name,
                    category: parsed.data.custom_category || 'Other',
                    is_verified: false
                })
                .select()
                .single();

            if (skillErr || !newSkill) {
                return { success: false, error: skillErr?.message || 'Failed to create custom skill' };
            }
            finalSkillId = newSkill.skill_id;
        }
    }

    if (!finalSkillId) return { success: false, error: 'No skill selected or defined' };

    // 2. Check for duplicates in user profile
    const { data: existing } = await supabase
        .from('user_skills')
        .select('skill_id')
        .eq('user_id', user.id)
        .eq('skill_id', finalSkillId)
        .maybeSingle();

    if (existing) return { success: false, error: 'You already have this skill in your expertise board.' };

    // 3. Link skill to user
    const { error } = await supabase
        .from('user_skills')
        .insert({
            user_id: user.id,
            skill_id: finalSkillId,
            level: parsed.data.level,
            source: 'manual',
            is_public: parsed.data.is_public ?? true,
        });

    if (error) return { success: false, error: error.message };
    
    revalidatePath('/dashboard/portfolio');
    revalidatePath('/portfolio', 'layout');
    return { success: true };
}

// ─── Delete manual skill ───
export async function deleteManualSkillAction(skillId: string): Promise<ActionResult> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    // Only manual skills can be deleted
    const { data: skill } = await supabase
        .from('user_skills')
        .select('source')
        .eq('user_id', user.id)
        .eq('skill_id', skillId)
        .maybeSingle();

    if (!skill || skill.source !== 'manual') {
        return { success: false, error: 'Only manually added skills can be deleted.' };
    }

    const { error } = await supabase
        .from('user_skills')
        .delete()
        .eq('user_id', user.id)
        .eq('skill_id', skillId);

    if (error) return { success: false, error: error.message };
    revalidatePath('/dashboard/portfolio');
    return { success: true };
}

// ─── Add external project ───
export async function addExternalProjectAction(input: AddExternalProjectInput): Promise<ActionResult> {
    try {
        const parsed = addExternalProjectSchema.safeParse(input);
        if (!parsed.success) {
            const errorMsg = parsed.error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
            return { success: false, error: `Invalid input: ${errorMsg}` };
        }

        const { data } = parsed;

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false, error: 'Unauthorized' };

        console.log(`[addExternalProjectAction] START for user: ${user.id}`);
        
        const admin = getSupabaseAdmin();

        // 1. Create project template
        console.log(`[addExternalProjectAction] Step 1: Creating project template...`);
        const { data: project, error: projErr } = await admin
            .from('projects')
            .insert({
                project_id: crypto.randomUUID(),
                title: data.title,
                description: data.description,
                difficulty_level: data.difficulty_level,
                source_type: 'user_custom',
                thumbnail_url: data.thumbnail_url,
                is_public_default: true,
                is_active: true,
            })
            .select()
            .single();

        if (projErr || !project) {
            console.error(`[addExternalProjectAction] Project Template Error:`, projErr);
            return { success: false, error: projErr?.message ?? 'Failed to create project template' };
        }
        console.log(`[addExternalProjectAction] Project created: ${project.project_id}`);

        // 2. Link skills if any
        if (data.skill_ids && data.skill_ids.length > 0) {
            console.log(`[addExternalProjectAction] Step 2: Linking ${data.skill_ids.length} skills...`);
            const { error: skillErr } = await admin
                .from('project_skills')
                .insert(data.skill_ids.map(sid => ({ project_id: project.project_id, skill_id: sid })));
            if (skillErr) console.warn(`[addExternalProjectAction] Skill Link Warning:`, skillErr);
        }

        // 3. Create user_projects row
        console.log(`[addExternalProjectAction] Step 3: Inserting user_projects row...`);
        const { error: upErr } = await admin
            .from('user_projects')
            .insert({
                user_id: user.id,
                project_id: project.project_id,
                status: data.status,
                is_public: true,
                github_url: data.github_url || null,
                demo_url: data.demo_url || null,
                thumbnail_url: data.thumbnail_url || null,
                tech_stack: data.tech_stack ?? [],
                completed_at: data.status === 'completed' ? new Date().toISOString() : null,
                started_at: (data.started_at && data.started_at.trim() !== '') ? data.started_at : null,
                bullets: data.bullets ?? [],
            });

        if (upErr) {
            console.error(`[addExternalProjectAction] User Project Error:`, upErr);
            return { success: false, error: upErr.message };
        }
        console.log(`[addExternalProjectAction] User Project inserted successfully`);

        // 4. If completed, unlock skills
        if (data.status === 'completed' && data.skill_ids && data.skill_ids.length > 0) {
            for (const skillId of data.skill_ids) {
                await admin
                    .from('user_skills')
                    .upsert({
                        user_id: user.id,
                        skill_id: skillId,
                        level: 'beginner',
                        source: 'project',
                        is_public: true,
                    }, { onConflict: 'user_id,skill_id' });
            }
        }

        revalidatePath('/dashboard/portfolio');
        revalidatePath('/portfolio', 'layout');
        console.log(`[addExternalProjectAction] SUCCESS`);
        return { success: true };
    } catch (e: any) {
        console.error(`[addExternalProjectAction] CRITICAL ERROR:`, e);
        return { success: false, error: e.message ?? 'An unexpected error occurred' };
    }
}

// ─── Update bio ───
export async function updateBioAction(input: UpdateBioInput): Promise<ActionResult> {
    const parsed = updateBioSchema.safeParse(input);
    if (!parsed.success) return { success: false, error: 'Invalid input' };

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    const { error } = await supabase
        .from('learners')
        .update({ bio: parsed.data.bio })
        .eq('user_id', user.id);

    if (error) return { success: false, error: error.message };
    revalidatePath('/dashboard/portfolio');
    revalidatePath('/portfolio', 'layout');
    return { success: true };
}

// ─── Delete project ───
export async function deleteProjectAction(projectId: string): Promise<ActionResult> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    const admin = getSupabaseAdmin();

    // 1. Get the template ID from user_projects record
    const { data: userProject } = await admin
        .from('user_projects')
        .select('project_id')
        .eq('id', projectId)
        .eq('user_id', user.id)
        .single();

    if (!userProject) return { success: false, error: 'Project not found' };
    const templateId = userProject.project_id;

    // 2. Verify ownership and that it's NOT a roadmap project
    const { data: project } = await admin
        .from('projects')
        .select('source_type')
        .eq('project_id', templateId)
        .single();

    if (!project || project.source_type === 'roadmap') {
        return { success: false, error: 'Cannot delete roadmap projects.' };
    }

    // 3. Delete user_projects link first
    const { error: upErr } = await admin
        .from('user_projects')
        .delete()
        .eq('user_id', user.id)
        .eq('id', projectId);

    if (upErr) return { success: false, error: upErr.message };

    // 4. Delete project_skills associations
    await admin
        .from('project_skills')
        .delete()
        .eq('project_id', templateId);

    // 5. Delete the project template itself
    const { error: pErr } = await admin
        .from('projects')
        .delete()
        .eq('project_id', templateId);

    if (pErr) return { success: false, error: pErr.message };

    revalidatePath('/dashboard/portfolio');
    revalidatePath('/portfolio', 'layout');
    return { success: true };
}
// ─── Update project status ───
export async function updateProjectStatusAction(projectId: string, status: 'available' | 'in_progress' | 'completed'): Promise<ActionResult> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    try {
        await updateProjectStatus(projectId, status);
        revalidatePath('/dashboard/portfolio');
        revalidatePath('/portfolio', 'layout');
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

// ─── Complete roadmap project ───
export async function completeRoadmapProjectAction(projectId: string, data: {
    githubUrl?: string;
    demoUrl?: string;
    personalNote?: string;
    thumbnailUrl?: string;
    techStack?: string[];
}): Promise<ActionResult> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    try {
        await updateProjectStatus(projectId, 'completed', {
            ...data,
            completed_at: new Date().toISOString()
        });
        revalidatePath('/dashboard/portfolio');
        revalidatePath('/portfolio', 'layout');
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

// ─── Update external project ───
export async function updateExternalProjectAction(input: UpdateExternalProjectInput): Promise<ActionResult> {
    const parsed = updateExternalProjectSchema.safeParse(input);
    if (!parsed.success) {
        const errorMsg = parsed.error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
        return { success: false, error: `Invalid input: ${errorMsg}` };
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    try {
        await updateExternalProject(parsed.data.projectId, {
            ...parsed.data,
            github_url: parsed.data.github_url || undefined,
            demo_url: parsed.data.demo_url || undefined,
            thumbnail_url: parsed.data.thumbnail_url || undefined,
            started_at: parsed.data.started_at || undefined,
        });

        revalidatePath('/dashboard/portfolio');
        revalidatePath('/portfolio', 'layout');
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}
