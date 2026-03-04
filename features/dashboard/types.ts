// ─── Dashboard Summary Types ───
// Matches the API contract from dashboard spec v3 Section 15

export interface DashboardSummary {
    learner: DashboardLearner;
    path: DashboardPath;
    stage: DashboardStage;
    topics: DashboardTopics;
    mission: DashboardMission;
    readiness: DashboardReadiness;
    pace: DashboardPace;
    onboarding_banner: OnboardingBanner;
    ai_tip: string | null;
}

export interface DashboardLearner {
    first_name: string;
    primary_goal: "job" | "freelance" | "startup" | "exploring" | null;
    ai_language_pref: "arabic" | "english" | "mix" | null;
    ai_detail_level: "short" | "balanced" | "detailed" | null;
    learning_velocity: "slow" | "normal" | "fast" | null;
    weekly_hours_category: "0-3" | "4-7" | "8-12" | "13+" | null;
}

export interface DashboardPath {
    path_id: string | null;
    path_display_name: string;
    is_active: boolean;
    completion_percent: number;
}

export interface DashboardStage {
    current_stage_id: string | null;
    current_stage_title: string;
    current_stage_number: number;
    total_stages: number;
    stage_completion_percent: number;
    stage_completed_topics: number;
    stage_total_topics: number;
}

export interface DashboardTopics {
    completed_topics: number;
    total_mandatory_topics: number;
    next_topic_id: string | null;
    next_topic_title: string;
    next_topic_estimated_time_min: number | null;
    remaining_topics_in_stage: number;
}

export type MissionType =
    | "ContinueLearning"
    | "FinishStage"
    | "GetBackOnTrack"
    | "StartFirstProject"
    | "ChooseNewPath"
    | "CompleteOnboarding";

export interface DashboardMission {
    type: MissionType;
    title: string;
    description: string;
    cta_label: string;
    cta_target: string;
    context_line: string | null;
}

export interface DashboardReadiness {
    unlocked_skills_count: number;
    roadmap_skills_count: number;
    manual_skills_count: number;
    completed_projects_count: number;
    available_projects_count: number;
    resume_status: "not_created" | "in_progress" | "ready";
    resume_last_updated_days_ago: number | null;
    ats_score: number | null;
}

export interface DashboardPace {
    streak_days: number;
    sessions_this_week: number;
    target_sessions_per_week: number;
    pace_status: "Ahead" | "On Track" | "Behind";
    active_days_this_week: number[];
}

export interface OnboardingBanner {
    show: boolean;
    plan_2_weeks: string[];
    first_milestone: string;
}

// ─── Recent Activity ───

export interface RecentActivityItem {
    type: "topic_completed" | "project_completed" | "resume_updated" | "analysis_saved";
    title: string;
    timestamp: string;
}

// ─── Display mappings ───

export const GOAL_LABELS: Record<string, string> = {
    job: "Get a Full-Time Job",
    freelance: "Freelance",
    startup: "Build My Own Project",
    exploring: "Exploring",
};

export const PATH_DISPLAY_NAMES: Record<string, string> = {
    frontend: "Frontend Development",
    fullstack: "Full-Stack Web Development",
    cybersecurity: "Cybersecurity & Ethical Hacking",
    datascience: "Data Science & Machine Learning",
};
