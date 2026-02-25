export type MissionType =
  | "CompleteOnboarding"
  | "ChooseNewPath"
  | "StartFirstProject"
  | "GetBackOnTrack"
  | "FinishStage"
  | "ContinueLearning";

export interface DashboardSummary {
  learner: {
    first_name: string | null;
    primary_goal: string | null;
    ai_language_pref: string | null;
    ai_detail_level: string | null;
    learning_velocity: string | null;
    weekly_hours_category: string | null;
    onboarding_completed: boolean;
  };
  path: {
    path_id: string | null;
    path_display_name: string | null;
    completion_percent: number | null;
  };
  stage: {
    current_stage_id: string | null;
    current_stage_title: string | null;
    stage_completion_percent: number | null;
    stage_completed_topics: number;
    stage_total_topics: number;
  };
  topics: {
    completed_topics: number;
    total_mandatory_topics: number;
    next_topic_id: string | null;
    next_topic_title: string | null;
    next_topic_estimated_time_min: number | null;
  };
  mission: {
    type: MissionType;
    title: string;
    description: string;
    cta_label: string;
    cta_target: string;
  };
  readiness: {
    unlocked_skills_count: number;
    completed_projects_count: number;
    resume_status: "not_created" | "in_progress" | "ready";
    ats_score: number | null;
  };
  pace: {
    streak_days: number;
    sessions_this_week: number;
    target_sessions_per_week: number;
    pace_status: "On Track" | "Behind" | "Ahead";
  };
  onboarding_banner: {
    show: boolean;
    starter_plan_2_weeks: Array<{ week: number; actions: string[] }>;
    first_milestone: string | null;
    cta_target: string | null;
  };
  forecast: {
    estimated_days_to_finish_stage: number | null;
    assumption_basis: string | null;
  } | null;
  ai_tip: {
    text: string;
  } | null;
}
