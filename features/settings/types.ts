import { z } from "zod";

// ─── Profile Update Schema ───

export const profileUpdateSchema = z.object({
    first_name: z.string().min(1, "First name is required").max(100).optional(),
    last_name: z.string().min(1, "Last name is required").max(100).optional(),
    background_type: z.enum(["student", "fresh_grad", "career_shifter", "no_tech"]).optional(),
    primary_goal: z.enum(["job", "freelance", "startup", "exploring"]).optional(),
});

export const learningPrefsSchema = z.object({
    weekly_hours_category: z.enum(["0-3", "4-7", "8-12", "13+"]),
});

export const aiPrefsSchema = z.object({
    ai_language_pref: z.enum(["arabic", "english", "mix"]),
    ai_detail_level: z.enum(["short", "balanced", "detailed"]),
});

export const changePasswordSchema = z.object({
    new_password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_password: z.string(),
}).refine(data => data.new_password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
});

export const deleteAccountSchema = z.object({
    confirm_email: z.string().email(),
});

// ─── Profile Data Types ───

export interface ProfileData {
    user: {
        email: string;
        email_verified: boolean;
    };
    learner: {
        first_name: string;
        last_name: string;
        background_type: string | null;
        primary_goal: string | null;
        current_path_id: string | null;
        current_path_display_name: string;
        weekly_hours_category: string | null;
        learning_velocity: string | null;
        ai_language_pref: string | null;
        ai_detail_level: string | null;
    };
}

// ─── Display mappings ───

export const BACKGROUND_OPTIONS = [
    { label: "Student", value: "student" },
    { label: "Fresh Graduate", value: "fresh_grad" },
    { label: "Career Shifter", value: "career_shifter" },
    { label: "No Tech Background", value: "no_tech" },
] as const;

export const GOAL_OPTIONS = [
    { label: "Get a Full-Time Job", value: "job" },
    { label: "Freelance", value: "freelance" },
    { label: "Build My Own Project", value: "startup" },
    { label: "Exploring", value: "exploring" },
] as const;

export const HOURS_OPTIONS = [
    { label: "0–3 hours/week", value: "0-3" },
    { label: "4–7 hours/week", value: "4-7" },
    { label: "8–12 hours/week", value: "8-12" },
    { label: "13+ hours/week", value: "13+" },
] as const;

export const AI_LANG_OPTIONS = [
    { label: "Arabic", value: "arabic" },
    { label: "English", value: "english" },
    { label: "Mix", value: "mix" },
] as const;

export const AI_DETAIL_OPTIONS = [
    { label: "Short", value: "short" },
    { label: "Balanced", value: "balanced" },
    { label: "Detailed", value: "detailed" },
] as const;

export const PATH_DISPLAY_NAMES: Record<string, string> = {
    frontend: "Frontend Development",
    fullstack: "Full-Stack Web Development",
    cybersecurity: "Cybersecurity & Ethical Hacking",
    datascience: "Data Science & Machine Learning",
};

// ─── Velocity derivation ───

export function deriveVelocity(category: string): string {
    switch (category) {
        case "0-3": return "slow";
        case "4-7": return "normal";
        case "8-12":
        case "13+": return "fast";
        default: return "normal";
    }
}
