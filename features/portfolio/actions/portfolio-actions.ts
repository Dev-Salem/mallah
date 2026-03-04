'use server';

import { createClient } from '@/lib/supabase/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import { addManualSkillSchema, addExternalProjectSchema, updateBioSchema } from '../types';
import type { AddManualSkillInput, AddExternalProjectInput, UpdateBioInput } from '../types';

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
        .eq('project_id', projectId);

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

    // Check for duplicates
    const { data: existing } = await supabase
        .from('user_skills')
        .select('skill_id')
        .eq('user_id', user.id)
        .eq('skill_id', parsed.data.skill_id)
        .maybeSingle();

    if (existing) return { success: false, error: 'You already have this skill.' };

    const { error } = await supabase
        .from('user_skills')
        .insert({
            user_id: user.id,
            skill_id: parsed.data.skill_id,
            level: parsed.data.level,
            source: 'manual',
            is_public: true,
        });

    if (error) return { success: false, error: error.message };
    revalidatePath('/dashboard/portfolio');
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
    const parsed = addExternalProjectSchema.safeParse(input);
    if (!parsed.success) return { success: false, error: 'Invalid input' };

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    const admin = getSupabaseAdmin();
    const data = parsed.data;

    // 1. Create project template
    const { data: project, error: projErr } = await admin
        .from('projects')
        .insert({
            title: data.title,
            description: data.description,
            difficulty_level: data.difficulty_level,
            source_type: 'user_custom',
            is_public_default: true,
        })
        .select('project_id')
        .single();

    if (projErr || !project) return { success: false, error: projErr?.message ?? 'Failed to create project' };

    // 2. Link skills if any
    if (data.skill_ids && data.skill_ids.length > 0) {
        await admin
            .from('project_skills')
            .insert(data.skill_ids.map(sid => ({ project_id: project.project_id, skill_id: sid })));
    }

    // 3. Create user_projects row
    const { error: upErr } = await admin
        .from('user_projects')
        .insert({
            user_id: user.id,
            project_id: project.project_id,
            status: data.status,
            is_public: true,
            github_url: data.github_url || null,
            demo_url: data.demo_url || null,
            tech_stack: data.tech_stack ?? [],
            completed_at: data.status === 'completed' ? new Date().toISOString() : null,
        });

    if (upErr) return { success: false, error: upErr.message };

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
    return { success: true };
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
    return { success: true };
}
