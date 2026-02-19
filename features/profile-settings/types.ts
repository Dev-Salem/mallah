export interface ProfileData {
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
    background_type: "Student" | "FreshGraduate" | "CareerShifter" | "NoTechBackground";
    primary_goal: "FullTimeJob" | "Freelance" | "OwnProject";
    current_path_id: string | null;
    path_name: string | null;
    onboarding_completed: boolean;
    weekly_learning_hours: string;
    learning_style_primary: "Video" | "Reading" | "HandsOn";
    ai_language_pref: "AR" | "EN" | "MIX";
    ai_detail_level: "Short" | "Balanced" | "Detailed";
}

export interface UpdateProfilePayload {
    first_name: string;
    last_name: string;
    background_type: string;
    primary_goal: string;
}

export interface UpdatePreferencesPayload {
    weekly_learning_hours: string;
    learning_style_primary: string;
    ai_language_pref: string;
    ai_detail_level: string;
}
