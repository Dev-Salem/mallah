import { createClient } from "@/lib/supabase/server";
import { getRoadmapSummary } from "@/features/roadmap/services/roadmap-service";
import type { DashboardSummary, MissionType } from "../types";

function buildMission(input: {
  onboardingCompleted: boolean;
  isPathComplete: boolean;
  completedProjectsCount: number;
  stageCompletionPercent: number | null;
  nextTopicId: string | null;
}): DashboardSummary["mission"] {
  const mission = (type: MissionType, title: string, description: string, cta_label: string, cta_target: string) => ({
    type,
    title,
    description,
    cta_label,
    cta_target,
  });

  if (!input.onboardingCompleted) {
    return mission(
      "CompleteOnboarding",
      "Complete onboarding",
      "Finalize your onboarding to unlock a personalized roadmap.",
      "Go to onboarding",
      "/onboarding"
    );
  }

  if (input.isPathComplete) {
    return mission(
      "ChooseNewPath",
      "Path complete",
      "You finished your mandatory topics. Choose your next path.",
      "View roadmap",
      "/dashboard/roadmap"
    );
  }

  if (input.completedProjectsCount === 0 && (input.stageCompletionPercent ?? 0) >= 80) {
    return mission(
      "StartFirstProject",
      "Start your first project",
      "You are close to finishing stage one. Start a project to build proof.",
      "Open skills hub",
      "/dashboard/skills"
    );
  }

  if ((input.stageCompletionPercent ?? 0) >= 80) {
    return mission(
      "FinishStage",
      "Finish current stage",
      "You're near the stage finish line. Complete the remaining mandatory topic(s).",
      "Continue stage",
      input.nextTopicId ? `/dashboard/roadmap/topic/${input.nextTopicId}` : "/dashboard/roadmap"
    );
  }

  return mission(
    "ContinueLearning",
    "Continue learning",
    "Keep momentum by completing your next roadmap topic.",
    "Continue",
    input.nextTopicId ? `/dashboard/roadmap/topic/${input.nextTopicId}` : "/dashboard/roadmap"
  );
}

export async function getDashboardSummary(userId: string): Promise<DashboardSummary> {
  const supabase = await createClient();

  const { data: learner, error: learnerError } = await supabase
    .from("learners")
    .select(
      "first_name,last_name,primary_goal,ai_language_pref,ai_detail_level,learning_velocity,weekly_hours_category,onboarding_completed,current_path_id"
    )
    .eq("user_id", userId)
    .single();
  if (learnerError) throw learnerError;

  let roadmap = null;
  if (learner?.current_path_id) {
    try {
      roadmap = await getRoadmapSummary(userId);
    } catch {
      roadmap = null;
    }
  }

  const completedTopics = roadmap?.path.completed_topics ?? 0;
  const totalMandatoryTopics = roadmap?.path.total_mandatory_topics ?? 0;
  const currentStage = roadmap?.stages[0] ?? null;
  const nextTopic = roadmap?.next_topic;

  const { count: unlockedSkillsCount } = await supabase
    .from("user_skills")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  const { count: completedProjectsCountRaw } = await supabase
    .from("user_projects")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("status", "Completed");
  const completedProjectsCount = completedProjectsCountRaw ?? 0;
  const resumeStatus: "not_created" | "in_progress" | "ready" = "not_created";

  const { data: latestRecommendation } = await supabase
    .from("ai_recommendations")
    .select("starter_plan_2_weeks, first_milestone")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const onboardingBannerShow = Boolean(learner?.onboarding_completed) && completedTopics === 0;
  const mission = buildMission({
    onboardingCompleted: Boolean(learner?.onboarding_completed),
    isPathComplete: Boolean(nextTopic?.is_path_complete),
    completedProjectsCount,
    stageCompletionPercent: currentStage?.completion_percent ?? null,
    nextTopicId: nextTopic?.next_topic_id ?? null,
  });

  const targetSessionsPerWeek = learner?.weekly_hours_category === "0-3" ? 2 : learner?.weekly_hours_category === "4-7" ? 3 : 4;
  const sessionsThisWeek = 0;
  const paceStatus = sessionsThisWeek >= targetSessionsPerWeek ? "On Track" : "Behind";

  return {
    learner: {
      first_name: learner?.first_name ?? null,
      primary_goal: learner?.primary_goal ?? null,
      ai_language_pref: learner?.ai_language_pref ?? null,
      ai_detail_level: learner?.ai_detail_level ?? null,
      learning_velocity: learner?.learning_velocity ?? null,
      weekly_hours_category: learner?.weekly_hours_category ?? null,
      onboarding_completed: Boolean(learner?.onboarding_completed),
    },
    path: {
      path_id: roadmap?.path.path_key ?? null,
      path_display_name: roadmap?.path.name ?? null,
      completion_percent: roadmap?.path.completion_percent ?? null,
    },
    stage: {
      current_stage_id: currentStage?.stage_id ?? null,
      current_stage_title: currentStage?.title ?? null,
      stage_completion_percent: currentStage?.completion_percent ?? null,
      stage_completed_topics: currentStage?.completed_topics ?? 0,
      stage_total_topics: currentStage?.total_mandatory_topics ?? 0,
    },
    topics: {
      completed_topics: completedTopics,
      total_mandatory_topics: totalMandatoryTopics,
      next_topic_id: nextTopic?.next_topic_id ?? null,
      next_topic_title: nextTopic?.next_topic_title ?? null,
      next_topic_estimated_time_min: nextTopic?.next_topic_estimated_time_min ?? null,
    },
    mission,
    readiness: {
      unlocked_skills_count: unlockedSkillsCount ?? 0,
      completed_projects_count: completedProjectsCount,
      resume_status: resumeStatus,
      ats_score: null,
    },
    pace: {
      streak_days: 0,
      sessions_this_week: sessionsThisWeek,
      target_sessions_per_week: targetSessionsPerWeek,
      pace_status: paceStatus,
    },
    onboarding_banner: {
      show: onboardingBannerShow,
      starter_plan_2_weeks: (latestRecommendation?.starter_plan_2_weeks as Array<{ week: number; actions: string[] }>) ?? [],
      first_milestone: (latestRecommendation?.first_milestone as { title?: string } | null)?.title ?? null,
      cta_target: nextTopic?.next_topic_id ? `/dashboard/roadmap/topic/${nextTopic.next_topic_id}` : "/dashboard/roadmap",
    },
    forecast: null,
    ai_tip: null,
  };
}
