import { createClient } from "@/lib/supabase/server";
import type {
  CompleteTopicResult,
  NextTopic,
  RoadmapStage,
  RoadmapSummary,
  TopicPayload,
  TopicProgressStatus,
} from "../types";

type TopicRow = {
  id: string;
  stage_id: string;
  title: string;
  summary: string | null;
  estimated_time_min: number | null;
  difficulty_level: string | null;
  order_index: number;
  is_mandatory: boolean;
  status: TopicProgressStatus;
  stage_title: string;
  stage_order: number;
};

async function getActivePath(userId: string) {
  const supabase = await createClient();
  const { data: learner, error } = await supabase
    .from("learners")
    .select("current_path_id")
    .eq("user_id", userId)
    .single();

  if (error) throw error;
  if (!learner?.current_path_id) {
    throw new Error("No active learning path. Please finish onboarding.");
  }

  const { data: path, error: pathError } = await supabase
    .from("paths")
    .select("id, interest_key, name, is_active")
    .eq("id", learner.current_path_id)
    .single();

  if (pathError) throw pathError;
  if (!path?.is_active) {
    throw new Error("Current learning path is inactive.");
  }

  return path;
}

function computePercent(completedMandatory: number, totalMandatory: number): number | null {
  if (totalMandatory === 0) return null;
  return Math.round((completedMandatory / totalMandatory) * 100);
}

function resolveNextTopic(orderedTopics: TopicRow[]): NextTopic {
  for (const topic of orderedTopics) {
    if (topic.is_mandatory && topic.status !== "Completed") {
      return {
        next_topic_id: topic.id,
        next_topic_title: topic.title,
        next_stage_id: topic.stage_id,
        next_stage_title: topic.stage_title,
        next_topic_estimated_time_min: topic.estimated_time_min,
        is_path_complete: false,
      };
    }
  }

  return {
    next_topic_id: null,
    next_topic_title: null,
    next_stage_id: null,
    next_stage_title: null,
    next_topic_estimated_time_min: null,
    is_path_complete: true,
  };
}

export async function getRoadmapSummary(userId: string): Promise<RoadmapSummary> {
  const supabase = await createClient();
  const path = await getActivePath(userId);

  const { data: stages, error: stagesError } = await supabase
    .from("stages")
    .select("id, title, difficulty_level, order_index")
    .eq("path_id", path.id)
    .order("order_index", { ascending: true });
  if (stagesError) throw stagesError;

  if (!stages || stages.length === 0) {
    return {
      path: {
        path_id: path.id,
        path_key: path.interest_key,
        name: path.name,
        completion_percent: null,
        completed_topics: 0,
        total_mandatory_topics: 0,
      },
      stages: [],
      next_topic: {
        next_topic_id: null,
        next_topic_title: null,
        next_stage_id: null,
        next_stage_title: null,
        next_topic_estimated_time_min: null,
        is_path_complete: true,
      },
    };
  }

  const stageIds = stages.map((s) => s.id);
  const { data: topics, error: topicsError } = await supabase
    .from("topics")
    .select("id, stage_id, title, summary, estimated_time_min, difficulty_level, order_index, is_mandatory")
    .in("stage_id", stageIds)
    .order("order_index", { ascending: true });
  if (topicsError) throw topicsError;

  const topicIds = (topics ?? []).map((t) => t.id);
  const { data: progressRows, error: progressError } = topicIds.length
    ? await supabase
      .from("user_progress")
      .select("topic_id, status")
      .eq("user_id", userId)
      .in("topic_id", topicIds)
    : { data: [], error: null as unknown as Error | null };
  if (progressError) throw progressError;

  const progressMap = new Map((progressRows ?? []).map((p) => [p.topic_id, p.status as TopicProgressStatus]));
  const stageMeta = new Map(stages.map((s) => [s.id, s]));

  const orderedTopics: TopicRow[] = (topics ?? [])
    .map((t) => {
      const stage = stageMeta.get(t.stage_id);
      return {
        id: t.id,
        stage_id: t.stage_id,
        title: t.title,
        summary: t.summary,
        estimated_time_min: t.estimated_time_min,
        difficulty_level: t.difficulty_level,
        order_index: t.order_index,
        is_mandatory: t.is_mandatory,
        status: progressMap.get(t.id) ?? "NotStarted",
        stage_title: stage?.title ?? "Stage",
        stage_order: stage?.order_index ?? 0,
      };
    })
    .sort((a, b) => (a.stage_order !== b.stage_order ? a.stage_order - b.stage_order : a.order_index - b.order_index));

  const stageBuckets = new Map<string, TopicRow[]>();
  for (const topic of orderedTopics) {
    const bucket = stageBuckets.get(topic.stage_id) ?? [];
    bucket.push(topic);
    stageBuckets.set(topic.stage_id, bucket);
  }

  let totalMandatoryTopics = 0;
  let totalCompletedMandatoryTopics = 0;

  const roadmapStages: RoadmapStage[] = stages.map((stage) => {
    const stageTopics = stageBuckets.get(stage.id) ?? [];
    const mandatoryTopics = stageTopics.filter((topic) => topic.is_mandatory);
    const completedMandatory = mandatoryTopics.filter((topic) => topic.status === "Completed");

    totalMandatoryTopics += mandatoryTopics.length;
    totalCompletedMandatoryTopics += completedMandatory.length;

    return {
      stage_id: stage.id,
      path_id: path.id,
      title: stage.title,
      difficulty_level: stage.difficulty_level,
      order_index: stage.order_index,
      completion_percent: computePercent(completedMandatory.length, mandatoryTopics.length),
      completed_topics: completedMandatory.length,
      total_mandatory_topics: mandatoryTopics.length,
      topics: stageTopics.map((topic) => ({
        topic_id: topic.id,
        stage_id: topic.stage_id,
        title: topic.title,
        summary: topic.summary,
        estimated_time_min: topic.estimated_time_min,
        difficulty_level: topic.difficulty_level,
        order_index: topic.order_index,
        is_mandatory: topic.is_mandatory,
        status: topic.status,
      })),
    };
  });

  return {
    path: {
      path_id: path.id,
      path_key: path.interest_key,
      name: path.name,
      completion_percent: computePercent(totalCompletedMandatoryTopics, totalMandatoryTopics),
      completed_topics: totalCompletedMandatoryTopics,
      total_mandatory_topics: totalMandatoryTopics,
    },
    stages: roadmapStages,
    next_topic: resolveNextTopic(orderedTopics),
  };
}

async function validateTopicInActivePath(userId: string, topicId: string) {
  const supabase = await createClient();
  const path = await getActivePath(userId);

  const { data: topic, error } = await supabase
    .from("topics")
    .select("id, stage_id, title, summary, estimated_time_min, difficulty_level, is_mandatory")
    .eq("id", topicId)
    .single();
  if (error) throw error;

  const { data: stage, error: stageError } = await supabase
    .from("stages")
    .select("id, path_id")
    .eq("id", topic.stage_id)
    .single();
  if (stageError) throw stageError;

  if (stage.path_id !== path.id) {
    throw new Error("Topic is not part of active path.");
  }

  return { topic, stage, path };
}

export async function openTopic(userId: string, topicId: string): Promise<TopicPayload> {
  const supabase = await createClient();
  const { topic, stage, path } = await validateTopicInActivePath(userId, topicId);

  const now = new Date().toISOString();
  const { data: existing, error: progressSelectError } = await supabase
    .from("user_progress")
    .select("status")
    .eq("user_id", userId)
    .eq("topic_id", topicId)
    .maybeSingle();
  if (progressSelectError) throw progressSelectError;

  if (!existing) {
    const { error: insertError } = await supabase.from("user_progress").insert({
      user_id: userId,
      topic_id: topicId,
      status: "InProgress",
      last_accessed_at: now,
    });
    if (insertError) throw insertError;
  } else {
    const nextStatus = existing.status === "Completed" ? "Completed" : "InProgress";
    const { error: updateError } = await supabase
      .from("user_progress")
      .update({
        status: nextStatus,
        last_accessed_at: now,
      })
      .eq("user_id", userId)
      .eq("topic_id", topicId);
    if (updateError) throw updateError;
  }

  const { data: resources, error: resourcesError } = await supabase
    .from("topic_resources")
    .select("id, resource_type, title, content, url, order_index")
    .eq("topic_id", topicId)
    .order("order_index", { ascending: true });
  if (resourcesError) throw resourcesError;

  const { data: progress, error: statusError } = await supabase
    .from("user_progress")
    .select("status")
    .eq("user_id", userId)
    .eq("topic_id", topicId)
    .single();
  if (statusError) throw statusError;

  return {
    topic_id: topic.id,
    stage_id: stage.id,
    path_id: path.id,
    title: topic.title,
    summary: topic.summary,
    estimated_time_min: topic.estimated_time_min,
    difficulty_level: topic.difficulty_level,
    status: progress.status as TopicProgressStatus,
    resources: (resources ?? []).map((r) => ({
      id: r.id,
      resource_type: r.resource_type as "INTERNAL_TEXT" | "VIDEO" | "ARTICLE",
      title: r.title,
      content: r.content,
      url: r.url,
      order_index: r.order_index,
    })),
  };
}

export async function completeTopic(userId: string, topicId: string): Promise<CompleteTopicResult> {
  const supabase = await createClient();
  await validateTopicInActivePath(userId, topicId);
  const now = new Date().toISOString();

  const { error: progressError } = await supabase.from("user_progress").upsert(
    {
      user_id: userId,
      topic_id: topicId,
      status: "Completed",
      completed_at: now,
      last_accessed_at: now,
    },
    { onConflict: "user_id,topic_id" }
  );
  if (progressError) throw progressError;

  const { data: topicSkills, error: topicSkillsError } = await supabase
    .from("topic_skills")
    .select("skill_id")
    .eq("topic_id", topicId);
  if (topicSkillsError) throw topicSkillsError;

  for (const skill of topicSkills ?? []) {
    const { data: existingSkill, error: skillFetchError } = await supabase
      .from("user_skills")
      .select("level")
      .eq("user_id", userId)
      .eq("skill_id", skill.skill_id)
      .maybeSingle();
    if (skillFetchError) throw skillFetchError;

    if (!existingSkill) {
      const { error: insertSkillError } = await supabase.from("user_skills").insert({
        user_id: userId,
        skill_id: skill.skill_id,
        level: "Beginner",
        source: "Roadmap",
        acquired_at: now,
      });
      if (insertSkillError) throw insertSkillError;
      continue;
    }

    const nextLevel =
      existingSkill.level === "Beginner"
        ? "Intermediate"
        : existingSkill.level === "Intermediate"
          ? "Advanced"
          : "Advanced";

    const { error: updateSkillError } = await supabase
      .from("user_skills")
      .update({
        level: nextLevel,
        source: "Roadmap",
        acquired_at: now,
      })
      .eq("user_id", userId)
      .eq("skill_id", skill.skill_id);
    if (updateSkillError) throw updateSkillError;
  }

  const summary = await getRoadmapSummary(userId);
  return {
    topic_id: topicId,
    status: "Completed",
    completed_at: now,
    next_topic: summary.next_topic,
  };
}
