'use server';

import { createClient } from '@/lib/supabase/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import type { PortfolioData, PortfolioProject, PortfolioSkill, PortfolioProfile } from '../types';

// ─── Private Portfolio (authenticated user) ───
export async function getPrivatePortfolio(): Promise<PortfolioData> {
    const supabase = await createClient();
    const admin = getSupabaseAdmin();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    // 1. Profile
    const { data: learner } = await supabase
        .from('learners')
        .select('user_id, first_name, last_name, bio, portfolio_slug, current_path_id, primary_goal')
        .eq('user_id', user.id)
        .single();

    if (!learner) throw new Error('Learner not found');

    // path name
    let pathName: string | null = null;
    if (learner.current_path_id) {
        const { data: path } = await supabase
            .from('paths')
            .select('name')
            .eq('path_id', learner.current_path_id)
            .single();
        pathName = path?.name ?? null;
    }

    // 2. Skills
    const { data: userSkillsRaw } = await supabase
        .from('user_skills')
        .select('skill_id, level, source, is_public')
        .eq('user_id', user.id);

    const skillIds = (userSkillsRaw ?? []).map(s => s.skill_id);
    let skillsMap: Record<string, { name: string; category: string }> = {};
    if (skillIds.length > 0) {
        const { data: skillsData } = await admin
            .from('skills')
            .select('skill_id, name, category')
            .in('skill_id', skillIds);
        for (const s of (skillsData ?? [])) {
            skillsMap[s.skill_id] = { name: s.name, category: s.category };
        }
    }

    // Get project_skills to link skills -> projects
    const { data: allProjectSkills } = await admin
        .from('project_skills')
        .select('project_id, skill_id');

    const skills: PortfolioSkill[] = (userSkillsRaw ?? []).map(us => ({
        skill_id: us.skill_id,
        name: skillsMap[us.skill_id]?.name ?? us.skill_id,
        category: skillsMap[us.skill_id]?.category ?? 'other',
        level: us.level as PortfolioSkill['level'],
        source: us.source as PortfolioSkill['source'],
        is_public: us.is_public ?? true,
        linked_projects: [],
    }));

    // 3. Projects
    const { data: userProjectsRaw } = await supabase
        .from('user_projects')
        .select('id, project_id, status, is_public, github_url, demo_url, personal_note, thumbnail_url, tech_stack, completed_at, started_at, bullets, custom_name, custom_description')
        .eq('user_id', user.id);

    const projectIds = (userProjectsRaw ?? []).map(p => p.project_id);
    let projectsMap: Record<string, { title: string; description: string | null; difficulty_level: string | null; thumbnail_url: string | null; source_type: string | null }> = {};
    if (projectIds.length > 0) {
        const { data: projectsData } = await admin
            .from('projects')
            .select('project_id, title, description, difficulty_level, thumbnail_url, source_type')
            .in('project_id', projectIds);
        for (const p of (projectsData ?? [])) {
            projectsMap[p.project_id] = {
                title: p.title,
                description: p.description,
                difficulty_level: p.difficulty_level,
                thumbnail_url: p.thumbnail_url,
                source_type: p.source_type,
            };
        }
    }

    // Map project_skills for each project
    const projectSkillsGrouped: Record<string, { skill_id: string; name: string; category: string }[]> = {};
    for (const ps of (allProjectSkills ?? [])) {
        if (!projectSkillsGrouped[ps.project_id]) projectSkillsGrouped[ps.project_id] = [];
        projectSkillsGrouped[ps.project_id].push({
            skill_id: ps.skill_id,
            name: skillsMap[ps.skill_id]?.name ?? ps.skill_id,
            category: skillsMap[ps.skill_id]?.category ?? 'other',
        });
    }

    const projects: PortfolioProject[] = (userProjectsRaw ?? []).map(up => {
        const template = projectsMap[up.project_id];
        return {
            id: up.id,
            project_id: up.project_id,
            title: template?.title ?? 'Unknown Project',
            description: template?.description ?? null,
            custom_name: up.custom_name,
            custom_description: up.custom_description,
            difficulty_level: (template?.difficulty_level as PortfolioProject['difficulty_level']) ?? null,
            source_type: (template?.source_type as 'roadmap' | 'user_custom') ?? 'roadmap',
            status: up.status as PortfolioProject['status'],
            is_public: up.is_public,
            github_url: up.github_url,
            demo_url: up.demo_url,
            personal_note: up.personal_note,
            thumbnail_url: up.thumbnail_url ?? template?.thumbnail_url ?? null,
            tech_stack: up.tech_stack ?? [],
            completed_at: up.completed_at,
            started_at: up.started_at,
            bullets: up.bullets ?? [],
            skills: projectSkillsGrouped[up.project_id] ?? [],
        };
    });

    // Also link skills back to projects
    for (const skill of skills) {
        const linkedProjectIds = (allProjectSkills ?? [])
            .filter(ps => ps.skill_id === skill.skill_id)
            .map(ps => ps.project_id);
        skill.linked_projects = projects
            .filter(p => linkedProjectIds.includes(p.project_id) && p.status === 'completed')
            .map(p => p.title);
    }

    const profile: PortfolioProfile = {
        user_id: learner.user_id,
        first_name: learner.first_name,
        last_name: learner.last_name,
        bio: learner.bio,
        portfolio_slug: learner.portfolio_slug,
        current_path_id: learner.current_path_id,
        path_name: pathName,
        primary_goal: learner.primary_goal,
        skills_count: skills.length,
        projects_completed_count: projects.filter(p => p.status === 'completed').length,
    };

    return { profile, skills, projects };
}

// ─── Public Portfolio (by slug) ───
export async function getPublicPortfolio(slug: string): Promise<PortfolioData | null> {
    const supabase = await createClient();
    const admin = getSupabaseAdmin();

    // 1. Find learner by slug
    const { data: learner } = await supabase
        .from('learners')
        .select('user_id, first_name, last_name, bio, portfolio_slug, current_path_id, primary_goal')
        .eq('portfolio_slug', slug)
        .single();

    if (!learner) return null;

    // path name
    let pathName: string | null = null;
    if (learner.current_path_id) {
        const { data: path } = await supabase
            .from('paths')
            .select('name')
            .eq('path_id', learner.current_path_id)
            .single();
        pathName = path?.name ?? null;
    }

    // 2. Skills (only public)
    const { data: userSkillsRaw } = await supabase
        .from('user_skills')
        .select('skill_id, level, source, is_public')
        .eq('user_id', learner.user_id)
        .eq('is_public', true);

    const skillIds = (userSkillsRaw ?? []).map(s => s.skill_id);
    let skillsMap: Record<string, { name: string; category: string }> = {};
    if (skillIds.length > 0) {
        const { data: skillsData } = await admin
            .from('skills')
            .select('skill_id, name, category')
            .in('skill_id', skillIds);
        for (const s of (skillsData ?? [])) {
            skillsMap[s.skill_id] = { name: s.name, category: s.category };
        }
    }

    const skills: PortfolioSkill[] = (userSkillsRaw ?? []).map(us => ({
        skill_id: us.skill_id,
        name: skillsMap[us.skill_id]?.name ?? us.skill_id,
        category: skillsMap[us.skill_id]?.category ?? 'other',
        level: us.level as PortfolioSkill['level'],
        source: us.source as PortfolioSkill['source'],
        is_public: true,
        linked_projects: [],
    }));

    // 3. Projects (only public + completed)
    const { data: userProjectsRaw } = await supabase
        .from('user_projects')
        .select('id, project_id, status, is_public, github_url, demo_url, personal_note, thumbnail_url, tech_stack, completed_at, started_at, bullets, custom_name, custom_description')
        .eq('user_id', learner.user_id)
        .eq('is_public', true)
        .eq('status', 'completed');

    const projectIds = (userProjectsRaw ?? []).map(p => p.project_id);
    let projectsMap: Record<string, { title: string; description: string | null; difficulty_level: string | null; thumbnail_url: string | null; source_type: string | null }> = {};
    if (projectIds.length > 0) {
        const { data: projectsData } = await admin
            .from('projects')
            .select('project_id, title, description, difficulty_level, thumbnail_url, source_type')
            .in('project_id', projectIds);
        for (const p of (projectsData ?? [])) {
            projectsMap[p.project_id] = {
                title: p.title,
                description: p.description,
                difficulty_level: p.difficulty_level,
                thumbnail_url: p.thumbnail_url,
                source_type: p.source_type,
            };
        }
    }

    // project skills
    const { data: allProjectSkills } = await admin
        .from('project_skills')
        .select('project_id, skill_id');

    const projectSkillsGrouped: Record<string, { skill_id: string; name: string; category: string }[]> = {};
    for (const ps of (allProjectSkills ?? [])) {
        if (!projectSkillsGrouped[ps.project_id]) projectSkillsGrouped[ps.project_id] = [];
        projectSkillsGrouped[ps.project_id].push({
            skill_id: ps.skill_id,
            name: skillsMap[ps.skill_id]?.name ?? ps.skill_id,
            category: skillsMap[ps.skill_id]?.category ?? 'other',
        });
    }

    const projects: PortfolioProject[] = (userProjectsRaw ?? []).map(up => {
        const template = projectsMap[up.project_id];
        return {
            id: up.id,
            project_id: up.project_id,
            title: template?.title ?? 'Unknown Project',
            description: template?.description ?? null,
            custom_name: up.custom_name,
            custom_description: up.custom_description,
            difficulty_level: (template?.difficulty_level as PortfolioProject['difficulty_level']) ?? null,
            source_type: (template?.source_type as 'roadmap' | 'user_custom') ?? 'roadmap',
            status: 'completed' as const,
            is_public: true,
            github_url: up.github_url,
            demo_url: up.demo_url,
            personal_note: up.personal_note,
            thumbnail_url: up.thumbnail_url ?? template?.thumbnail_url ?? null,
            tech_stack: up.tech_stack ?? [],
            completed_at: up.completed_at,
            started_at: up.started_at,
            bullets: up.bullets ?? [],
            skills: projectSkillsGrouped[up.project_id] ?? [],
        };
    });

    const profile: PortfolioProfile = {
        user_id: learner.user_id,
        first_name: learner.first_name,
        last_name: learner.last_name,
        bio: learner.bio,
        portfolio_slug: learner.portfolio_slug,
        current_path_id: learner.current_path_id,
        path_name: pathName,
        primary_goal: learner.primary_goal,
        skills_count: skills.length,
        projects_completed_count: projects.length,
    };

    return { profile, skills, projects };
}

// ─── Catalog skills for the "Add Project" picker ───
export async function getSkillsCatalog(): Promise<{ skill_id: string; name: string; category: string }[]> {
    const supabase = await createClient();
    const admin = getSupabaseAdmin();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return [];

    // Get learner's path
    const { data: learner } = await supabase
        .from('learners')
        .select('current_path_id')
        .eq('user_id', user.id)
        .single();

    if (learner?.current_path_id) {
        // Fetch skills linked to topics/projects in this path
        // 1. Get topics in this path
        const { data: topicSkills } = await admin
            .from('topic_skills')
            .select('skill_id, topics!inner(stage_id, stages!inner(path_id))')
            .eq('topics.stages.path_id', learner.current_path_id);

        // 2. Get projects in this path
        const { data: projectSkills } = await admin
            .from('project_skills')
            .select('skill_id, projects!inner(stage_id, stages!inner(path_id))')
            .eq('projects.stages.path_id', learner.current_path_id);

        const relevantSkillIds = new Set([
            ...(topicSkills ?? []).map(ts => ts.skill_id),
            ...(projectSkills ?? []).map(ps => ps.skill_id)
        ]);

        if (relevantSkillIds.size > 0) {
            const { data } = await admin
                .from('skills')
                .select('skill_id, name, category')
                .eq('is_verified', true)
                .in('skill_id', Array.from(relevantSkillIds))
                .order('name');
            if (data && data.length > 0) return data;
        }
    }

    // Fallback: all verified skills
    const { data } = await admin
        .from('skills')
        .select('skill_id, name, category')
        .eq('is_verified', true)
        .order('name');
    return data ?? [];
}

/**
 * Updates a project's status and optional fields.
 * Roadmap projects are irreversible once completed (handled at UI level).
 */
export async function updateProjectStatus(
  projectId: string,
  status: 'available' | 'in_progress' | 'completed',
  updates: Partial<PortfolioProject> = {}
) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    // Extract database-compatible fields from the update object
    const dbUpdates: any = {
        status
    };

    if (updates.github_url !== undefined) dbUpdates.github_url = updates.github_url;
    if (updates.demo_url !== undefined) dbUpdates.demo_url = updates.demo_url;
    if (updates.personal_note !== undefined) dbUpdates.personal_note = updates.personal_note;
    if (updates.thumbnail_url !== undefined) dbUpdates.thumbnail_url = updates.thumbnail_url;
    if (updates.tech_stack !== undefined) dbUpdates.tech_stack = updates.tech_stack;
    if (updates.is_public !== undefined) dbUpdates.is_public = updates.is_public;
    if (updates.custom_name !== undefined) dbUpdates.custom_name = updates.custom_name;
    if (updates.custom_description !== undefined) dbUpdates.custom_description = updates.custom_description;

    if (status === 'completed') {
        dbUpdates.completed_at = new Date().toISOString();
    } else if (status === 'in_progress' && !updates.started_at) {
        dbUpdates.started_at = new Date().toISOString();
    } else if (status === 'available') {
        // When reverting to available, we might want to clear some fields depending on logic
        dbUpdates.completed_at = null;
        // is_public must be false for available projects
        dbUpdates.is_public = false;
    }

    const { data, error } = await supabase
        .from('user_projects')
        .update(dbUpdates)
        .eq('id', projectId)
        .eq('user_id', user.id)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}

/**
 * Deletes an external (user_custom) project from the Portfolio Hub.
 * Roadmap projects cannot be deleted, only "removed from hub" if we added that, 
 * but for now we follow the spec: only external projects.
 */
export async function deleteExternalProject(projectId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    // Verify ownership and type
    const { data: project, error: fetchError } = await supabase
        .from('user_projects')
        .select('id, project_id')
        .eq('id', projectId)
        .eq('user_id', user.id)
        .single();

    if (fetchError || !project) throw new Error('Project not found');

    // Check source_type from the projects table
    const admin = getSupabaseAdmin();
    const { data: projectTemplate } = await admin
        .from('projects')
        .select('source_type')
        .eq('project_id', project.project_id)
        .single();

    if (projectTemplate?.source_type !== 'user_custom') {
        throw new Error('Only external projects can be deleted.');
    }

    const { error: deleteError } = await supabase
        .from('user_projects')
        .delete()
        .eq('id', projectId);

    if (deleteError) throw new Error(deleteError.message);
}

export async function updateExternalProject(
    projectId: string, // Record ID
    data: {
        title: string;
        description: string;
        difficulty_level: 'beginner' | 'intermediate' | 'advanced';
        github_url?: string;
        demo_url?: string;
        tech_stack: string[];
        thumbnail_url?: string;
        status: 'available' | 'in_progress' | 'completed';
        started_at?: string;
        bullets?: string[];
        skill_ids?: string[];
    }
) {
    const supabase = await createClient();
    const admin = getSupabaseAdmin();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    // 1. Get template ID
    const { data: up } = await admin
        .from('user_projects')
        .select('project_id')
        .eq('id', projectId)
        .eq('user_id', user.id)
        .single();

    if (!up) throw new Error('Project not found');
    const templateId = up.project_id;

    // 2. Update projects table
    const { error: pErr } = await admin
        .from('projects')
        .update({
            title: data.title,
            description: data.description,
            difficulty_level: data.difficulty_level,
            thumbnail_url: data.thumbnail_url,
            is_public: true // Custom projects are usually public templates
        })
        .eq('project_id', templateId);

    if (pErr) throw pErr;

    // 3. Update user_projects table
    const { error: upErr } = await admin
        .from('user_projects')
        .update({
            status: data.status,
            github_url: data.github_url,
            demo_url: data.demo_url,
            tech_stack: data.tech_stack,
            started_at: data.started_at,
            bullets: data.bullets,
            completed_at: data.status === 'completed' ? new Date().toISOString() : null
        })
        .eq('id', projectId);

    if (upErr) throw upErr;

    // 4. Sync skills
    if (data.skill_ids) {
        await admin
            .from('project_skills')
            .delete()
            .eq('project_id', templateId);

        if (data.skill_ids.length > 0) {
            const skillInserts = data.skill_ids.map(sid => ({
                project_id: templateId,
                skill_id: sid
            }));
            const { error: sErr } = await admin.from('project_skills').insert(skillInserts);
            if (sErr) throw sErr;
        }
    }

    return { success: true };
}

