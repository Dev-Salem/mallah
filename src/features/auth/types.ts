export type UserRole = 'learner' | 'admin';
export type UserStatus = 'active' | 'blocked';

export interface User {
    user_id: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    created_at: string;
    last_login_at?: string;
}

export interface LearnerProfile {
    user_id: string;
    first_name: string;
    last_name: string;
    onboarding_completed: boolean;
    current_path_id?: string;
    background_type?: string;
    primary_goal?: string;
    learning_velocity?: string;
    weekly_hours_category?: string;
    ai_language_pref?: string;
    ai_detail_level?: string;
    readiness_level?: string;
}

export interface AdminProfile {
    user_id: string;
    display_name: string;
    admin_level: 'normal' | 'super';
}
