"use server";

import { createClient } from "@/lib/supabase/server";

export async function getRoadmapData(pathId: string, userId: string) {
    const supabase = await createClient();

    // 1. Fetch Path
    const { data: path } = await supabase
        .from("paths")
        .select("*")
        .eq("id", pathId)
        .single();

    if (!path) return { error: "Path not found" };

    // 2. Fetch Stages+Topics and User Progress in parallel
    const [stagesRes, progressRes] = await Promise.all([
        supabase
            .from("stages")
            .select(`
                *,
                topics (*)
            `)
            .eq("path_id", pathId)
            .order("order_index", { ascending: true }),
        supabase
            .from("user_progress")
            .select("*")
            .eq("user_id", userId)
    ]);

    const { data: stages } = stagesRes;
    const { data: progress } = progressRes;

    const progressMap = new Map();
    progress?.forEach(p => {
        progressMap.set(p.topic_id, p.status);
    });

    // 4. Transform stages to include progress
    const stagesWithProgress = stages?.map(stage => {
        const stageTopics = (stage.topics as any[]) || [];
        stageTopics.sort((a, b) => a.order_index - b.order_index);

        const completedCount = stageTopics.filter(t => progressMap.get(t.id) === 'Completed').length;
        const totalCount = stageTopics.length;
        const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

        return {
            ...stage,
            topics: stageTopics.map(t => ({
                ...t,
                status: progressMap.get(t.id) || 'NotStarted'
            })),
            stats: {
                completedCount,
                totalCount,
                percent
            }
        };
    }) || [];

    // 5. Calculate overall progress
    const totalTopics = stagesWithProgress.reduce((acc, s) => acc + s.stats.totalCount, 0);
    const completedTopics = stagesWithProgress.reduce((acc, s) => acc + s.stats.completedCount, 0);
    const overallPercent = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

    return {
        path,
        stages: stagesWithProgress,
        stats: {
            totalTopics,
            completedTopics,
            overallPercent
        }
    };
}

export async function getTopicData(topicId: string, userId: string) {
    const supabase = await createClient();

    const { data: topic } = await supabase
        .from("topics")
        .select(`
            *,
            stages!inner(id, title, path_id, paths!inner(id, name)),
            topic_resources(*)
        `)
        .eq("id", topicId)
        .order('order_index', { foreignTable: 'topic_resources', ascending: true })
        .single();

    if (!topic) return { error: "Topic not found" };

    const { data: progress } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", userId)
        .eq("topic_id", topicId)
        .maybeSingle();

    return {
        topic,
        progress: progress || null
    };
}

export async function updateTopicProgress(topicId: string, userId: string, status: 'InProgress' | 'Completed') {
    const supabase = await createClient();

    const now = new Date().toISOString();
    const { error } = await supabase
        .from("user_progress")
        .upsert({
            user_id: userId,
            topic_id: topicId,
            status,
            last_accessed_at: now,
            ...(status === 'Completed' ? { completed_at: now } : {})
        }, {
            onConflict: 'user_id,topic_id'
        });

    if (error) throw new Error(error.message);

    // Auto-unlock skills when completing a topic
    if (status === 'Completed') {
        await unlockSkillsForTopic(topicId, userId);
    }

    return { success: true };
}

export async function getNextTopic(topicId: string, userId: string): Promise<{ nextTopicId: string | null }> {
    const supabase = await createClient();

    // Get current topic with stage info
    const { data: currentTopic } = await supabase
        .from("topics")
        .select("id, order_index, stage_id, stages!inner(id, order_index, path_id)")
        .eq("id", topicId)
        .single();

    if (!currentTopic) return { nextTopicId: null };

    const stageData = currentTopic.stages as any;

    // Try next topic in same stage
    const { data: nextInStage } = await supabase
        .from("topics")
        .select("id")
        .eq("stage_id", currentTopic.stage_id)
        .gt("order_index", currentTopic.order_index)
        .order("order_index", { ascending: true })
        .limit(1)
        .maybeSingle();

    if (nextInStage) return { nextTopicId: nextInStage.id };

    // Try first topic of next stage
    const { data: nextStage } = await supabase
        .from("stages")
        .select("id")
        .eq("path_id", stageData.path_id)
        .gt("order_index", stageData.order_index)
        .order("order_index", { ascending: true })
        .limit(1)
        .maybeSingle();

    if (!nextStage) return { nextTopicId: null };

    const { data: firstTopicInNextStage } = await supabase
        .from("topics")
        .select("id")
        .eq("stage_id", nextStage.id)
        .order("order_index", { ascending: true })
        .limit(1)
        .maybeSingle();

    return { nextTopicId: firstTopicInNextStage?.id || null };
}

async function unlockSkillsForTopic(topicId: string, userId: string) {
    const supabase = await createClient();

    // Get skills linked to this topic
    const { data: topicSkills } = await supabase
        .from("topic_skills")
        .select("skill_id")
        .eq("topic_id", topicId);

    if (!topicSkills || topicSkills.length === 0) return;

    const now = new Date().toISOString();

    // Upsert each skill into user_skills
    for (const ts of topicSkills) {
        await supabase
            .from("user_skills")
            .upsert({
                user_id: userId,
                skill_id: ts.skill_id,
                unlocked_at: now,
            }, {
                onConflict: 'user_id,skill_id'
            });
    }
}

