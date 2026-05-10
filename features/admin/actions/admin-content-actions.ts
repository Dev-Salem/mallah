'use server'

import { createClient } from '@/lib/supabase/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { logAdminEvent } from './audit-actions'
import { getCurrentAdmin } from './admin-auth-actions'
import { revalidatePath } from 'next/cache'
import type {
  AdminActionResult,
  AdminProject,
  AdminSkill,
  AdminPath,
  AdminStage,
  AdminTopic,
  AdminResource,
  AdminLearner,
  AdminLearnerDetail,
  AdminAuditLogEntry,
  PathOverview,
  ContentWarning,
  AdminUser,
  AdminPathWithFullContent,
  AdminStageWithTopics,
  AdminTopicWithResources,
} from '../types'

const ADMIN_BASE = 'admin'

// ─── Authorization Helper ───
async function requireAdmin(level: 'normal' | 'super' = 'normal') {
  const admin = await getCurrentAdmin()
  if (!admin) throw new Error('Unauthorized')
  if (level === 'super' && admin.adminLevel !== 'super') {
    throw new Error('Insufficient permissions')
  }
  return admin
}

// ─── Dashboard Data ───
export async function getDashboardStats() {
  const admin = await requireAdmin()
  const db = getSupabaseAdmin()

  // Total active learners
  const { count: totalLearners } = await db
    .from('learners')
    .select('*', { count: 'exact', head: true })

  // Active this week (distinct users with activity in last 7 days)
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const { count: activeThisWeek } = await db
    .from('user_progress')
    .select('user_id', { count: 'exact', head: true })
    .gte('last_accessed_at', weekAgo)

  // Topics completed last 30 days
  const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const { count: topicsCompleted } = await db
    .from('user_progress')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'completed')
    .gte('completed_at', monthAgo)

  // Pending skill reviews
  const { count: pendingSkills } = await db
    .from('skills')
    .select('*', { count: 'exact', head: true })
    .eq('is_verified', false)

  return {
    totalLearners: totalLearners || 0,
    activeThisWeek: activeThisWeek || 0,
    topicsCompletedLast30Days: topicsCompleted || 0,
    pendingSkillReviews: pendingSkills || 0,
  }
}

export async function getPathOverviews(): Promise<PathOverview[]> {
  const admin = await requireAdmin()
  const db = getSupabaseAdmin()

  // 1. Fetch paths
  const { data: paths } = await db.from('paths').select('path_id, name')
  if (!paths) return []

  // 2. Fetch all learner counts in bulk if possible, or parallelize
  // For simplicity and maximum compatibility, we'll use Promise.all which is already better than sequential
  // but we'll optimize the query to use head: true for speed.
  const overviews = await Promise.all(
    paths.map(async (p) => {
      const [learnersResult, activeResult] = await Promise.all([
        db.from('learners').select('*', { count: 'exact', head: true }).eq('current_path_id', p.path_id),
        db.from('learners').select('*', { count: 'exact', head: true })
          .eq('current_path_id', p.path_id)
          .gte('last_active_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      ])

      return {
        path_id: p.path_id,
        name: p.name,
        learner_count: learnersResult.count || 0,
        avg_completion: 0,
        active_this_week: activeResult.count || 0,
      } as PathOverview
    })
  )

  return overviews
}

export async function getContentWarnings(): Promise<ContentWarning[]> {
  const admin = await requireAdmin()
  const db = getSupabaseAdmin()
  const warnings: ContentWarning[] = []

  // Optimize: Use bulk fetching to avoid N+1 queries
  // 1. Fetch all parent-child relationships in bulk
  const [
    { data: paths },
    { data: allStages },
    { data: allTopics },
    { data: allResources }
  ] = await Promise.all([
    db.from('paths').select('path_id, name'),
    db.from('stages').select('stage_id, path_id, title'),
    db.from('topics').select('topic_id, stage_id, title'),
    db.from('resources').select('resource_id, topic_id')
  ])

  // 2. Identify missing stages for paths
  const pathIdsWithStages = new Set(allStages?.map(s => s.path_id) || [])
  for (const path of paths || []) {
    if (!pathIdsWithStages.has(path.path_id)) {
      warnings.push({
        type: 'path_no_stages',
        message: `Path "${path.name}" has no stages.`,
        entity_id: path.path_id,
        entity_type: 'path',
      })
    }
  }

  // 3. Identify missing topics for stages
  const stageIdsWithTopics = new Set(allTopics?.map(t => t.stage_id) || [])
  for (const stage of allStages || []) {
    if (!stageIdsWithTopics.has(stage.stage_id)) {
      warnings.push({
        type: 'stage_no_topics',
        message: `Stage "${stage.title}" has no topics.`,
        entity_id: stage.stage_id,
        entity_type: 'stage',
      })
    }
  }

  // 4. Identify missing resources for topics
  const topicIdsWithResources = new Set(allResources?.map(r => r.topic_id) || [])
  for (const topic of allTopics || []) {
    if (!topicIdsWithResources.has(topic.topic_id)) {
      warnings.push({
        type: 'topic_no_resources',
        message: `Topic "${topic.title}" has no resources.`,
        entity_id: topic.topic_id,
        entity_type: 'topic',
      })
    }
  }

  return warnings
}

export async function getRecentAuditEntries(limit: number = 10) {
  const db = getSupabaseAdmin()

  const { data } = await db
    .from('admin_audit_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  return data || []
}

// ─── Paths CRUD ───
export async function getAdminPaths() {
  const admin = await requireAdmin()
  const db = getSupabaseAdmin()

  const { data: paths } = await db
    .from('paths')
    .select('path_id, name, short_description, is_active')
    .order('name')

  if (!paths) return []

  return Promise.all(
    paths.map(async (p) => {
      const { count: stageCount } = await db
        .from('stages')
        .select('*', { count: 'exact', head: true })
        .eq('path_id', p.path_id)

      const { count: learnerCount } = await db
        .from('learners')
        .select('*', { count: 'exact', head: true })
        .eq('current_path_id', p.path_id)

      return {
        ...p,
        stage_count: stageCount || 0,
        learner_count: learnerCount || 0,
      }
    })
  )
}

export async function createPath(data: {
  name: string;
  short_description: string;
  path_id: string;
  is_active: boolean;
}): Promise<AdminActionResult> {
  const admin = await requireAdmin()
  const db = getSupabaseAdmin()

  const { error } = await db.from('paths').insert(data)
  if (error) return { success: false, error: error.message }

  await logAdminEvent(
    admin.userId,
    'path_created',
    `Admin ${admin.email} created Path: ${data.name} (slug: ${data.path_id})`,
    'path'
  )

  revalidatePath(`/${ADMIN_BASE}`)
  return { success: true }
}

export async function updatePath(
  pathId: string,
  data: { name?: string; short_description?: string; is_active?: boolean }
): Promise<AdminActionResult> {
  const admin = await requireAdmin()
  const db = getSupabaseAdmin()

  const { error } = await db.from('paths').update(data).eq('path_id', pathId)
  if (error) return { success: false, error: error.message }

  const changes = Object.keys(data).join(', ')
  await logAdminEvent(
    admin.userId,
    data.is_active === false ? 'path_deactivated' : 'path_edited',
    `Admin ${admin.email} edited Path: ${pathId} — updated ${changes}`,
    'path'
  )

  revalidatePath(`/${ADMIN_BASE}`)
  return { success: true }
}

// ─── Stages CRUD ───
export async function getStagesForPath(pathId: string) {
  const admin = await requireAdmin()
  const db = getSupabaseAdmin()

  const { data } = await db
    .from('stages')
    .select('stage_id, path_id, title, description, difficulty_level, order_index')
    .eq('path_id', pathId)
    .order('order_index')

  if (!data) return []

  return Promise.all(
    data.map(async (s) => {
      const { count: topicCount } = await db
        .from('topics')
        .select('*', { count: 'exact', head: true })
        .eq('stage_id', s.stage_id)

      return { ...s, topic_count: topicCount || 0, learner_count: 0 }
    })
  )
}

export async function createStage(data: {
  path_id: string;
  title: string;
  description?: string;
  difficulty_level?: string;
  order_index: number;
}): Promise<AdminActionResult> {
  const admin = await requireAdmin()
  const db = getSupabaseAdmin()

  const { error } = await db.from('stages').insert(data)
  if (error) return { success: false, error: error.message }

  await logAdminEvent(
    admin.userId,
    'stage_created',
    `Admin ${admin.email} created Stage: ${data.title} in path ${data.path_id} (order: ${data.order_index})`,
    'stage'
  )

  revalidatePath(`/${ADMIN_BASE}`)
  return { success: true }
}

export async function updateStage(
  stageId: string,
  data: { title?: string; description?: string; difficulty_level?: string; order_index?: number }
): Promise<AdminActionResult> {
  const admin = await requireAdmin()
  const db = getSupabaseAdmin()

  const { error } = await db.from('stages').update(data).eq('stage_id', stageId)
  if (error) return { success: false, error: error.message }

  await logAdminEvent(admin.userId, 'stage_edited', `Admin ${admin.email} edited Stage ${stageId}`, 'stage')

  revalidatePath(`/${ADMIN_BASE}`)
  return { success: true }
}

export async function deleteStage(stageId: string): Promise<AdminActionResult> {
  const admin = await requireAdmin('super')
  const db = getSupabaseAdmin()

  // Check for learner progress
  const { data: topics } = await db.from('topics').select('topic_id').eq('stage_id', stageId)
  if (topics && topics.length > 0) {
    const topicIds = topics.map((t) => t.topic_id)
    const { count } = await db
      .from('user_progress')
      .select('*', { count: 'exact', head: true })
      .in('topic_id', topicIds)
    if (count && count > 0) {
      return { success: false, error: `Cannot delete — ${count} learners have progress in this stage.` }
    }
  }

  const { error } = await db.from('stages').delete().eq('stage_id', stageId)
  if (error) return { success: false, error: error.message }

  await logAdminEvent(admin.userId, 'stage_deleted', `Admin ${admin.email} deleted Stage ${stageId}`, 'stage')

  revalidatePath(`/${ADMIN_BASE}`)
  return { success: true }
}

// ─── Topics CRUD ───
export async function getTopicsForStage(stageId: string) {
  const admin = await requireAdmin()
  const db = getSupabaseAdmin()

  const { data } = await db
    .from('topics')
    .select('*')
    .eq('stage_id', stageId)
    .order('order_index')

  return data || []
}

export async function createTopic(data: {
  stage_id: string;
  title: string;
  summary?: string;
  topic_type: string;
  estimated_time_min?: number;
  difficulty_level?: string;
  is_mandatory: boolean;
  order_index: number;
}): Promise<AdminActionResult> {
  const admin = await requireAdmin()
  const db = getSupabaseAdmin()

  const { data: created, error } = await db.from('topics').insert(data).select().single()
  if (error) return { success: false, error: error.message }

  await logAdminEvent(
    admin.userId,
    'topic_created',
    `Admin ${admin.email} created Topic: ${data.title}`,
    'topic',
    created?.topic_id
  )

  revalidatePath(`/${ADMIN_BASE}`)
  return { success: true, data: created }
}

export async function updateTopic(
  topicId: string,
  data: Record<string, unknown>
): Promise<AdminActionResult> {
  const admin = await requireAdmin()
  const db = getSupabaseAdmin()

  const { error } = await db.from('topics').update(data).eq('topic_id', topicId)
  if (error) return { success: false, error: error.message }

  await logAdminEvent(admin.userId, 'topic_edited', `Admin ${admin.email} edited Topic ${topicId}`, 'topic', topicId)

  revalidatePath(`/${ADMIN_BASE}`)
  return { success: true }
}

export async function deleteTopic(topicId: string): Promise<AdminActionResult> {
  const admin = await requireAdmin('super')
  const db = getSupabaseAdmin()

  const { count } = await db
    .from('user_progress')
    .select('*', { count: 'exact', head: true })
    .eq('topic_id', topicId)

  if (count && count > 0) {
    return { success: false, error: `Cannot delete — ${count} learners have accessed this topic.` }
  }

  const { error } = await db.from('topics').delete().eq('topic_id', topicId)
  if (error) return { success: false, error: error.message }

  await logAdminEvent(admin.userId, 'topic_deleted', `Admin ${admin.email} deleted Topic ${topicId}`, 'topic', topicId)

  revalidatePath(`/${ADMIN_BASE}`)
  return { success: true }
}

// ─── Full Content Fetch (for hierarchical view) ───
export async function getAdminPathsWithFullContent(): Promise<AdminPathWithFullContent[]> {
  const admin = await requireAdmin()
  const db = getSupabaseAdmin()

  // 1. Fetch all paths
  const { data: paths } = await db
    .from('paths')
    .select('path_id, name, short_description, is_active')
    .order('name')

  if (!paths) return []

  // 2. Fetch all stages, topics, and resources in parallel
  const [stagesRes, topicsRes, resourcesRes, learnerCountsData] = await Promise.all([
    db.from('stages').select('*').order('order_index'),
    db.from('topics').select('*').order('order_index'),
    db.from('topic_resources').select('*').order('order_index'),
    Promise.all(paths.map(async (p) => {
      const { count } = await db
        .from('learners')
        .select('*', { count: 'exact', head: true })
        .eq('current_path_id', p.path_id)
      return { path_id: p.path_id, learner_count: count || 0 }
    }))
  ])

  const stagesData = stagesRes.data || []
  const topicsData = topicsRes.data || []
  const resourcesData = resourcesRes.data || []

  const learnerCountMap = new Map(learnerCountsData.map(d => [d.path_id, d.learner_count]))

  // Build nested structure
  const stagesMap = new Map<string, AdminStageWithTopics>()
  const topicsMap = new Map<string, AdminTopicWithResources>()

  // Initialize topics with empty resources
  for (const topic of topicsData) {
    topicsMap.set(topic.topic_id, { ...topic, resources: [] })
  }

  // Add resources to topics
  for (const resource of resourcesData) {
    const topic = topicsMap.get(resource.topic_id)
    if (topic) {
      topic.resources.push(resource)
    }
  }

  // Initialize stages with topics
  for (const stage of stagesData) {
    stagesMap.set(stage.stage_id, {
      stage_id: stage.stage_id,
      path_id: stage.path_id,
      title: stage.title,
      description: stage.description,
      difficulty_level: stage.difficulty_level,
      order_index: stage.order_index,
      learner_count: 0,
      topics: [],
    })
  }

  // Group topics into stages
  for (const topic of topicsMap.values()) {
    const stage = stagesMap.get(topic.stage_id)
    if (stage) {
      stage.topics.push(topic)
    }
  }

  // Build final paths with nested stages
  return paths.map(p => {
    const pathStages = Array.from(stagesMap.values())
      .filter(s => s.path_id === p.path_id)
      .sort((a, b) => a.order_index - b.order_index)
    return {
      path_id: p.path_id,
      name: p.name,
      short_description: p.short_description || '',
      is_active: p.is_active,
      learner_count: learnerCountMap.get(p.path_id) || 0,
      stages: pathStages,
    }
  })
}

// ─── Stage Reordering ───
export async function reorderStage(stageId: string, newOrderIndex: number): Promise<AdminActionResult> {
  const admin = await requireAdmin()
  const db = getSupabaseAdmin()

  const { error } = await db.from('stages').update({ order_index: newOrderIndex }).eq('stage_id', stageId)
  if (error) return { success: false, error: error.message }

  await logAdminEvent(admin.userId, 'stage_reordered', `Admin ${admin.email} reordered Stage ${stageId} to index ${newOrderIndex}`, 'stage')

  revalidatePath(`/${ADMIN_BASE}`)
  return { success: true }
}

// ─── Topic Reordering ───
export async function reorderTopic(topicId: string, newOrderIndex: number): Promise<AdminActionResult> {
  const admin = await requireAdmin()
  const db = getSupabaseAdmin()

  const { error } = await db.from('topics').update({ order_index: newOrderIndex }).eq('topic_id', topicId)
  if (error) return { success: false, error: error.message }

  await logAdminEvent(admin.userId, 'topic_reordered', `Admin ${admin.email} reordered Topic ${topicId} to index ${newOrderIndex}`, 'topic')

  revalidatePath(`/${ADMIN_BASE}`)
  return { success: true }
}
export async function getResourcesForTopic(topicId: string) {
  const admin = await requireAdmin()
  const db = getSupabaseAdmin()

  const { data } = await db
    .from('topic_resources')
    .select('*')
    .eq('topic_id', topicId)
    .order('order_index')

  return data || []
}

export async function createResource(data: {
  topic_id: string;
  resource_type: string;
  title?: string;
  url?: string;
  content?: string;
  provider?: string;
  cost_type?: string;
  cost_note?: string;
  order_index: number;
}): Promise<AdminActionResult> {
  const admin = await requireAdmin()
  const db = getSupabaseAdmin()

  const { error } = await db.from('topic_resources').insert(data)
  if (error) return { success: false, error: error.message }

  await logAdminEvent(
    admin.userId,
    'resource_added',
    `Admin ${admin.email} added ${data.resource_type} resource to Topic ${data.topic_id}`,
    'resource'
  )

  revalidatePath(`/${ADMIN_BASE}`)
  return { success: true }
}

export async function deleteResource(resourceId: string): Promise<AdminActionResult> {
  const admin = await requireAdmin()
  const db = getSupabaseAdmin()

  const { error } = await db.from('topic_resources').delete().eq('resource_id', resourceId)
  if (error) return { success: false, error: error.message }

  await logAdminEvent(
    admin.userId,
    'resource_deleted',
    `Admin ${admin.email} deleted resource ${resourceId}`,
    'resource'
  )

  revalidatePath(`/${ADMIN_BASE}`)
  return { success: true }
}

export async function updateResource(
  resourceId: string,
  data: {
    resource_type?: string
    title?: string
    url?: string
    content?: string
    provider?: string
    cost_type?: string
    cost_note?: string
    order_index?: number
  }
): Promise<AdminActionResult> {
  const admin = await requireAdmin()
  const db = getSupabaseAdmin()

  const { error } = await db.from('topic_resources').update(data).eq('resource_id', resourceId)
  if (error) return { success: false, error: error.message }

  await logAdminEvent(
    admin.userId,
    'resource_edited',
    `Admin ${admin.email} edited resource ${resourceId}`,
    'resource'
  )

  revalidatePath(`/${ADMIN_BASE}`)
  return { success: true }
}

// ─── Skills CRUD ───
export async function getAdminSkills(filters?: { category?: string; verified?: boolean }): Promise<AdminSkill[]> {
  const admin = await requireAdmin()
  const db = getSupabaseAdmin()

  let query = db.from('skills').select('skill_id, name, category, is_verified')

  if (filters?.category) {
    query = query.eq('category', filters.category)
  }
  if (filters?.verified !== undefined) {
    query = query.eq('is_verified', filters.verified)
  }

  const { data: skills } = await query.order('name')
  if (!skills) return []

  return Promise.all(
    skills.map(async (s) => {
      const { count: topicCount } = await db
        .from('topic_skills')
        .select('*', { count: 'exact', head: true })
        .eq('skill_id', s.skill_id)

      const { count: projectCount } = await db
        .from('project_skills')
        .select('*', { count: 'exact', head: true })
        .eq('skill_id', s.skill_id)

      return {
        ...s,
        topic_count: topicCount || 0,
        project_count: projectCount || 0,
      } as AdminSkill
    })
  )
}

export async function verifySkill(skillId: string): Promise<AdminActionResult> {
  const admin = await requireAdmin()
  const db = getSupabaseAdmin()

  const { error } = await db.from('skills').update({ is_verified: true }).eq('skill_id', skillId)
  if (error) return { success: false, error: error.message }

  await logAdminEvent(admin.userId, 'skill_verified', `Admin ${admin.email} verified skill ${skillId}`, 'skill')

  revalidatePath(`/${ADMIN_BASE}`)
  return { success: true }
}

export async function rejectSkill(skillId: string): Promise<AdminActionResult> {
  const admin = await requireAdmin()
  const db = getSupabaseAdmin()

  const { error } = await db.from('skills').delete().eq('skill_id', skillId)
  if (error) return { success: false, error: error.message }

  await logAdminEvent(admin.userId, 'skill_rejected', `Admin ${admin.email} rejected skill ${skillId}`, 'skill')

  revalidatePath(`/${ADMIN_BASE}`)
  return { success: true }
}

export async function createSkill(data: {
  skill_id: string;
  name: string;
  category: string;
}): Promise<AdminActionResult> {
  const admin = await requireAdmin()
  const db = getSupabaseAdmin()

  const { error } = await db.from('skills').insert({ ...data, is_verified: true })
  if (error) {
    if (error.message.includes('duplicate') || error.message.includes('unique')) {
      return { success: false, error: `A skill named "${data.name}" already exists.` }
    }
    return { success: false, error: error.message }
  }

  await logAdminEvent(admin.userId, 'skill_created', `Admin ${admin.email} created skill: ${data.name} (${data.category})`, 'skill')

  revalidatePath(`/${ADMIN_BASE}`)
  return { success: true }
}

// ─── Projects CRUD ───
export async function getAdminProjects(): Promise<AdminProject[]> {
  const admin = await requireAdmin()
  const db = getSupabaseAdmin()

  const { data: projects } = await db
    .from('projects')
    .select('project_id, title, description, difficulty_level, stage_id, is_active, is_public_default, source_type')
    .order('title')

  if (!projects) return []

  return Promise.all(
    projects.map(async (p) => {
      const { count: skillCount } = await db
        .from('project_skills')
        .select('*', { count: 'exact', head: true })
        .eq('project_id', p.project_id)

      return {
        ...p,
        skill_count: skillCount || 0,
      } as AdminProject
    })
  )
}

export async function createProject(data: {
  title: string;
  description?: string;
  difficulty_level?: string;
  stage_id?: string;
  is_active: boolean;
  is_public_default: boolean;
}): Promise<AdminActionResult> {
  const admin = await requireAdmin()
  const db = getSupabaseAdmin()

  const { data: created, error } = await db.from('projects').insert({ ...data, source_type: 'roadmap' }).select().single()
  if (error) return { success: false, error: error.message }

  await logAdminEvent(admin.userId, 'project_created', `Admin ${admin.email} created Project: ${data.title}`, 'project', created?.project_id)

  revalidatePath(`/${ADMIN_BASE}`)
  return { success: true }
}

export async function updateProject(
  projectId: string,
  data: Record<string, unknown>
): Promise<AdminActionResult> {
  const admin = await requireAdmin()
  const db = getSupabaseAdmin()

  const { error } = await db.from('projects').update(data).eq('project_id', projectId)
  if (error) return { success: false, error: error.message }

  const eventType = data.is_active === false ? 'project_deactivated' : 'project_edited'
  await logAdminEvent(admin.userId, eventType, `Admin ${admin.email} updated Project ${projectId}`, 'project', projectId)

  revalidatePath(`/${ADMIN_BASE}`)
  return { success: true }
}

// ─── Learners (read-only + block/unblock) ───
export async function getAdminLearners(): Promise<AdminLearner[]> {
  const admin = await requireAdmin()
  const db = getSupabaseAdmin()

  const { data, error } = await db
    .from('learners')
    .select(`
      user_id,
      first_name,
      last_name,
      current_path_id,
      onboarding_completed,
      status,
      created_at,
      paths ( name )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[getAdminLearners] Error:', error)
    return []
  }

  if (!data) return []

  console.log(`[getAdminLearners] Found ${data.length} users in learners table`)


  return data.map((d: any) => ({
    user_id: d.user_id,
    first_name: d.first_name || '',
    last_name: d.last_name || '',
    email: d.email || '',
    current_path_id: d.current_path_id || null,
    path_name: d.paths?.name || null,
    onboarding_completed: !!d.onboarding_completed,
    status: d.status || 'unknown',
    created_at: d.created_at,
    progress_percent: 0,
    last_active: null,
  })) as AdminLearner[]
}

export async function blockLearner(userId: string): Promise<AdminActionResult> {
  const admin = await requireAdmin()
  const db = getSupabaseAdmin()

  const { error } = await db.from('learners').update({ status: 'blocked' }).eq('user_id', userId)
  if (error) return { success: false, error: error.message }

  await logAdminEvent(admin.userId, 'learner_blocked', `Admin ${admin.email} blocked learner ${userId}`, 'user', userId)

  revalidatePath(`/${ADMIN_BASE}`)
  return { success: true }
}

export async function unblockLearner(userId: string): Promise<AdminActionResult> {
  const admin = await requireAdmin()
  const db = getSupabaseAdmin()

  const { error } = await db.from('learners').update({ status: 'active' }).eq('user_id', userId)
  if (error) return { success: false, error: error.message }

  await logAdminEvent(admin.userId, 'learner_unblocked', `Admin ${admin.email} unblocked learner ${userId}`, 'user', userId)

  revalidatePath(`/${ADMIN_BASE}`)
  return { success: true }
}

export async function getAdminLearnerDetail(userId: string): Promise<AdminLearnerDetail | null> {
  await requireAdmin()
  const db = getSupabaseAdmin()

  const { data: learner } = await db
    .from('learners')
    .select('*, paths ( name )')
    .eq('user_id', userId)
    .single()

  if (!learner) return null

  const pathId = learner.current_path_id

  let topicProgress: any[] = []
  let projectProgress: any[] = []
  let topicsCompleted = 0
  let topicsTotal = 0
  let projectsCompleted = 0
  let projectsTotal = 0

  if (pathId) {
    const [{ data: stages }, { data: userTopics }, { data: userProjects }] = await Promise.all([
      db.from('stages').select('stage_id, title, order_index, topics ( topic_id, title, topic_type, order_index ), projects ( project_id, title, difficulty_level )').eq('path_id', pathId).order('order_index'),
      db.from('user_progress').select('topic_id, status, completed_at, last_accessed_at').eq('user_id', userId),
      db.from('user_projects').select('project_id, status, completed_at').eq('user_id', userId),
    ])

    const topicMap = new Map((userTopics || []).map(t => [t.topic_id, t]))
    const projectMap = new Map((userProjects || []).map(p => [p.project_id, p]))

    for (const stage of (stages || [])) {
      for (const topic of (stage.topics || [])) {
        topicsTotal++
        const ut = topicMap.get(topic.topic_id)
        const status = ut?.status || 'not_started'
        if (status === 'completed') topicsCompleted++
        topicProgress.push({
          topic_id: topic.topic_id,
          title: topic.title,
          topic_type: topic.topic_type,
          status,
          completed_at: ut?.completed_at || null,
          stage_title: stage.title,
          stage_order: stage.order_index,
        })
      }

      for (const proj of (stage.projects || [])) {
        projectsTotal++
        const up = projectMap.get(proj.project_id)
        const status = up?.status || 'available'
        if (status === 'completed' || status === 'waiting') projectsCompleted++
        projectProgress.push({
          project_id: proj.project_id,
          title: proj.title,
          difficulty_level: proj.difficulty_level,
          status,
          completed_at: up?.completed_at || null,
          stage_title: stage.title,
        })
      }
    }

    topicProgress.sort((a, b) => a.stage_order - b.stage_order)
  }

  const lastAccessed = (await db.from('user_progress').select('last_accessed_at').eq('user_id', userId).order('last_accessed_at', { ascending: false }).limit(1)).data?.[0]?.last_accessed_at || null

  return {
    user_id: learner.user_id,
    first_name: learner.first_name || '',
    last_name: learner.last_name || '',
    email: learner.email || '',
    current_path_id: learner.current_path_id || null,
    path_name: learner.paths?.name || null,
    onboarding_completed: !!learner.onboarding_completed,
    status: learner.status || 'unknown',
    created_at: learner.created_at,
    progress_percent: topicsTotal + projectsTotal > 0 ? Math.round(((topicsCompleted + projectsCompleted) / (topicsTotal + projectsTotal)) * 100) : 0,
    last_active: lastAccessed,
    bio: learner.bio || null,
    primary_goal: learner.primary_goal || null,
    weekly_hours_category: learner.weekly_hours_category || null,
    topics_completed: topicsCompleted,
    topics_total: topicsTotal,
    projects_completed: projectsCompleted,
    projects_total: projectsTotal,
    topic_progress: topicProgress,
    project_progress: projectProgress,
  }
}

// ─── Audit Log (super admin only) ───
export async function getAuditLog(page: number = 1, pageSize: number = 25) {
  const admin = await requireAdmin('super')
  const db = getSupabaseAdmin()

  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const { data, count } = await db
    .from('admin_audit_log')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  return { entries: data || [], total: count || 0 }
}

// ─── Settings: Admin Management (super admin only) ───
export async function getAdminAccounts() {
  const admin = await requireAdmin('super')
  const db = getSupabaseAdmin()

  const { data } = await db
    .from('admins')
    .select('user_id, display_name, admin_level, created_at')
    .order('created_at')

  if (!data) return []

  return data.map((d: any) => ({
    user_id: d.user_id,
    display_name: d.display_name || '',
    admin_level: d.admin_level,
    email: '', // Add email
    status: 'active', // Add status
    created_at: d.created_at,
  })) as AdminUser[]
}

export async function deactivateAdmin(targetUserId: string): Promise<AdminActionResult> {
  const admin = await requireAdmin('super')
  const db = getSupabaseAdmin()

  // Cannot deactivate yourself
  if (admin.userId === targetUserId) {
    return { success: false, error: 'Cannot deactivate your own account.' }
  }

  // Cannot deactivate last super admin
  const { data: superAdmins } = await db
    .from('admins')
    .select('user_id')
    .eq('admin_level', 'super')

  const { data: targetAdmin } = await db
    .from('admins')
    .select('admin_level')
    .eq('user_id', targetUserId)
    .single()

  if (targetAdmin?.admin_level === 'super' && superAdmins && superAdmins.length <= 1) {
    return { success: false, error: 'Cannot deactivate the last remaining super admin.' }
  }

  const { error } = await db
    .from('learners')
    .update({ status: 'blocked' })
    .eq('user_id', targetUserId)

  if (error) return { success: false, error: error.message }

  await logAdminEvent(
    admin.userId,
    'admin_deactivated',
    `Super admin ${admin.email} deactivated admin ${targetUserId}`,
    'admin',
    targetUserId
  )

  revalidatePath(`/${ADMIN_BASE}`)
  return { success: true }
}
