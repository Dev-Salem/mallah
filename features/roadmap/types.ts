export type ResourceType = 'VIDEO' | 'ARTICLE' | 'INTERNAL_TEXT' | 'CERT' | 'DOCUMENTATION';

export interface TopicResource {
    id: string;
    topic_id: string;
    resource_type: ResourceType;
    title: string;
    url?: string | null;
    content?: string | null;
    provider?: string | null;
    cost_type?: string | null;
    order_index: number;
}

export interface Skill {
    skill_id: string;
    name: string;
    category: string;
}

export interface Topic {
    topic_id: string;
    stage_id: string;
    title: string;
    summary?: string | null;
    topic_type: 'concept' | 'lesson' | 'lesson_lab' | 'project_milestone' | 'project_capstone';
    estimated_time_min: number;
    estimated_time_text?: string | null;
    difficulty_level: 'beginner' | 'intermediate' | 'advanced';
    order_index: number;
    user_status?: 'not_started' | 'in_progress' | 'completed'; // Joined from user_progress
    resources?: TopicResource[];
    skills?: Skill[];
}

export interface ProjectReview {
    id: string;
    user_project_id: string;
    overall_verdict: 'strong' | 'solid' | 'needs_work';
    score: number | null;
    score_total: number | null;
    strengths: string | null;
    improvements: string | null;
    requirements_results: any;
    recommended_topics: string[] | null;
    stretch_score: number | null;
    submission_number: number | null;
    created_at: string | null;
}

export interface Project {
    project_id: string;
    stage_id: string;
    title: string;
    description?: string | null;
    overview?: string | null;
    core_requirements?: string[] | null;
    stretch_goals?: string[] | null;
    evaluation_criteria?: string[] | null;
    quality_signals?: string[] | null; // Keep for backward compatibility if needed, but we'll use evaluation_criteria
    recommended_tech?: string[] | null;
    difficulty_level: 'beginner' | 'intermediate' | 'advanced';
    thumbnail_url?: string | null;
    is_public_default: boolean;
    user_status?: 'available' | 'in_progress' | 'completed' | 'waiting';
    effort_planning?: string | null;
    effort_building?: string | null;
    effort_polish?: string | null;
    effort_planning_pct?: number | null;
    effort_building_pct?: number | null;
    effort_polish_pct?: number | null;
    employer_signal?: string | null;
    learning_objectives?: string[] | null;
    skills?: Skill[];
}

export interface UserProjectSubmission {
    id?: string;
    user_id?: string;
    project_id?: string;
    github_url?: string | null;
    demo_url?: string | null;
    personal_note?: string | null;
    custom_name?: string | null;
    custom_description?: string | null;
    is_public?: boolean;
    thumbnail_url?: string | null;
    tech_tags?: string[] | null;
    status: 'available' | 'in_progress' | 'completed' | 'waiting';
    review_status?: 'none' | 'pending' | 'complete' | 'failed' | null;
    feedback?: string | null;
    grade?: number | null;
    completed_at?: string | null;
    skipped?: boolean | null;
    skipped_at?: string | null;
    updated_at?: string | null;
    created_at?: string | null;
    latest_review?: ProjectReview | null;
}

export interface CertificateSuggestion {
    id: string;
    stageLabel: string;
    afterText?: string | null;
    title: string;
    provider: string;
    url: string;
    costLabel?: string | null;
    costNote?: string | null;
    whyNow?: string | null;
}

export interface Stage {
    stage_id: string;
    path_id: string;
    title: string;
    order_index: number;
    difficulty_level: string;
    is_unlocked: boolean; // Calculated field based on previous project
    topics: Topic[];
    project: Project | null;
}

export interface RoadmapCertificateStage {
    title: string;
    suggestions: CertificateSuggestion[];
}

export interface RoadmapData {
    path_id: string;
    stages: Stage[];
    certificateStage?: RoadmapCertificateStage | null;
}
