export type BackgroundType = 'Student' | 'FreshGraduate' | 'CareerShifter' | 'NoTechBackground';
export type PrimaryGoal = 'FullTimeJob' | 'Freelance' | 'OwnProject' | 'JustExploring';
export type WeeklyHoursCategory = '0-3' | '4-7' | '8-12' | '13+';
export type LearningVelocity = 'slow' | 'normal' | 'fast';
export type AIStatus = 'not_started' | 'pending' | 'success' | 'failed';
export type AIDetailLevel = 'Short' | 'Balanced' | 'Detailed';
export type AILanguagePref = 'AR' | 'EN' | 'MIX';

export interface InterestVector {
    frontend: number;
    fullstack: number;
    cybersecurity: number;
    datascience: number;
    debugging: number;
    experimenting: number;
}

export interface WorkstyleVector {
    choice: 'visual' | 'complete' | 'secure' | 'analyze';
    ambiguity: 'step-by-step' | 'moderate' | 'open-ended';
    math_comfort: 'Low' | 'Medium' | 'High';
}

export interface ConfidenceSnapshot {
    git: 'Never' | 'Tried' | 'Comfortable';
    cli: 'Never' | 'Tried' | 'Comfortable';
    programming: 'Never' | 'Tried' | 'Comfortable';
    apis: 'Never' | 'Tried' | 'Comfortable';
    db: 'Never' | 'Tried' | 'Comfortable';
    web: 'Never' | 'Tried' | 'Comfortable';
}

export interface OnboardingResponse {
    id: string;
    user_id: string;
    background_type: BackgroundType;
    primary_goal: PrimaryGoal;
    weekly_hours_category: WeeklyHoursCategory;
    learning_velocity: LearningVelocity;
    interest_vector: InterestVector;
    workstyle_vector: WorkstyleVector;
    confidence_snapshot: ConfidenceSnapshot;
    readiness_level: number;
    ai_language_pref: AILanguagePref;
    ai_detail_level: AIDetailLevel;
    ai_status: AIStatus;
    ai_attempt_count: number;
    ai_last_attempt_at: string | null;
    completed_at: string | null;
    created_at: string;
}

export interface AIRecommendation {
    id: string;
    user_id: string;
    onboarding_id: string;
    recommended_path_id: string;
    confidence_score: number;
    explanation: {
        summary: string;
        top_3_reasons: string[];
        what_this_path_looks_like: string;
    };
    alternatives: {
        path_id: string;
        why_it_was_close: string;
    }[];
    starter_plan_2_weeks: {
        week: number;
        actions: string[];
    }[];
    first_milestone: {
        title: string;
        success_criteria: string[];
    };
    risk_flags?: string[];
    accepted_path_id?: string;
    created_at: string;
}
