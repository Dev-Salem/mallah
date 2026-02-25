export type WeeklyHoursCategory = "0-3" | "4-7" | "8-12" | "13+";
export type LearningVelocity = "slow" | "normal" | "fast";
export type AILanguagePref = "AR" | "EN" | "MIX";
export type AIDetailLevel = "Short" | "Balanced" | "Detailed";

export interface ProfileViewModel {
  user_id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  background_type: string | null;
  primary_goal: string | null;
  current_path_id: string | null;
  current_path_name: string | null;
  onboarding_completed: boolean;
  weekly_hours_category: WeeklyHoursCategory | null;
  learning_velocity: LearningVelocity | null;
  ai_language_pref: AILanguagePref | null;
  ai_detail_level: AIDetailLevel | null;
}

export interface UpdateProfileInput {
  first_name: string;
  last_name: string;
  background_type: string;
  primary_goal: string;
}

export interface UpdateLearningPrefsInput {
  weekly_hours_category: WeeklyHoursCategory;
}

export interface UpdateAIPrefsInput {
  ai_language_pref: AILanguagePref;
  ai_detail_level: AIDetailLevel;
}

export interface PasswordChangeInput {
  old_password: string;
  new_password: string;
  confirm_password: string;
}
