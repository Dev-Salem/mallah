export type OpportunityScoreTier = 'NOT_READY' | 'EARLY_STAGE' | 'GETTING_CLOSE' | 'STRONG_CANDIDATE' | 'EXCELLENT_MATCH';

export interface ExtractedSkill {
    name: string;
    level?: 'beginner' | 'intermediate' | 'advanced';
    category?: string;
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
    experience_years: number;
    previous_roles: string[];
}

export interface SkillMatchInfo {
    skill_name: string;
    source: 'roadmap' | 'project' | 'manual' | 'cv';
    is_verified: boolean;
    current_level?: string;
    required_level?: string;
    weight: number;
    project_title?: string; // If source == project
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
