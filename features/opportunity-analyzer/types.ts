export type OpportunityScoreTier = 'NOT_READY' | 'EARLY_STAGE' | 'GETTING_CLOSE' | 'STRONG_CANDIDATE' | 'EXCELLENT_MATCH';

export const SCORE_WEIGHT_MALLAH = 1.0;
export const SCORE_WEIGHT_CV = 1.0;
export const REQUIRED_SKILL_WEIGHT = 0.55;
export const PREFERRED_SKILL_WEIGHT = 0.2;
export const PROJECT_WEIGHT = 0.25;
export const MAX_MATCH_SCORE = 95;
export const APPLY_READY_SCORE = 75;

export interface ExtractedSkill {
    name: string;
    level?: 'beginner' | 'intermediate' | 'advanced';
    category?: string;
}

export interface ExtractedCVProject {
    project_name: string;
    skills: string[];
    summary?: string;
}

export interface ExtractedJD {
    job_title?: string;
    seniority?: 'Intern' | 'Junior' | 'Mid' | 'Senior';
    employment_type?: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
    required_skills: string[];
    preferred_skills: string[];
    responsibilities: string[];
}

export interface ExtractedCV {
    extracted_skills: Array<{ skill_name: string; inferred_level: string }>;
    extracted_projects: ExtractedCVProject[];
    experience_years: number;
    previous_roles: string[];
}

export interface SkillMatchInfo {
    skill_name: string;
    matched_requirement: string;
    source: 'roadmap' | 'project' | 'manual' | 'cv';
    requirement_type?: 'required' | 'preferred';
    is_verified: boolean;
    current_level?: string;
    required_level?: string;
    weight: number;
    project_title?: string; // If source == project
    match_reason?: string;
}

export interface MatchScoreBreakdown {
    matched: SkillMatchInfo[];
    partial: SkillMatchInfo[];
    missing: {
        required: string[];
        preferred: string[];
    };
}

export type ActionStepType = 'learn_topic' | 'build_project' | 'update_resume' | 'apply_now';

export interface ActionPlanStep {
    step_type: ActionStepType;
    title: string;
    reason: string | null;
    link_target: string | null;
}

export interface OpportunityAnalysisResult {
    analysis_id?: string;
    match_score: number;
    job_title: string | null;
    company_name: string | null;
    location: string | null;
    seniority_level: string | null;
    raw_jd_text: string;
    extracted_skills: {
        required: string[];
        preferred: string[];
    };
    skills_breakdown: MatchScoreBreakdown;
    action_plan: ActionPlanStep[];
    cv_skills_contributed: number;
    is_saved: boolean;
    matchingResumeId?: string | null;
    created_at?: string;
    last_reanalyzed_at?: string;
}

export interface CVUpload {
    cv_id: string;
    user_id: string;
    file_name: string;
    extracted_skills: Array<{ skill_name: string; inferred_level: string }>;
    experience_years: number;
    previous_roles: string[];
    uploaded_at: string;
}

export interface JobListing {
    job_id: string;
    path_id: string;
    title: string;
    company: string;
    location: string;
    is_remote: boolean;
    employment_type: string;
    seniority: 'Intern' | 'Junior' | 'Mid' | 'Senior';
    description: string;
    required_skills: string[];
    preferred_skills: string[];
    apply_url?: string;
    source_url?: string;
    status: 'published' | 'expired';
    published_at: string;
    expires_at: string;
    created_at: string;
}
