export interface Path {
    id: string;
    name: string;
    name_ar: string;
    description: string | null;
    description_ar: string | null;
    is_active: boolean;
    interest_key: string;
    created_at: string;
}

export interface InterestScores {
    frontend: number;
    backend: number;
    data_ai: number;
    cybersecurity: number;
    mobile: number;
}

export type BackgroundType =
    | "Student"
    | "FreshGraduate"
    | "CareerShifter"
    | "NoTechBackground";

export type PrimaryGoal = "FullTimeJob" | "Freelance" | "OwnProject";

export type WeeklyLearningHours = "0-3" | "4-7" | "8-12" | "13+";

export type LearningStyle = "Video" | "Reading" | "HandsOn";

export type AiLanguagePref = "AR" | "EN" | "MIX";

export type AiDetailLevel = "Short" | "Balanced" | "Detailed";

export interface OnboardingProfile {
    user_id: string;
    first_name: string | null;
    last_name: string | null;
    onboarding_completed: boolean;
    current_path_id: string | null;
    background_type: BackgroundType | null;
    primary_goal: PrimaryGoal | null;
    ai_language_pref: AiLanguagePref | null;
    ai_detail_level: AiDetailLevel | null;
    weekly_learning_hours: WeeklyLearningHours | null;
    learning_style_primary: LearningStyle | null;
    interest_scores: InterestScores | null;
}
