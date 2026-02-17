import { createClient } from "@/lib/supabase/server";
import type { OnboardingProfile, Path } from "../types";

const ONBOARDING_PROFILE_FIELDS =
    "id, first_name, last_name, onboarding_completed, onboarding_step, current_path_id, background_type, primary_goal, ai_language_pref, ai_detail_level, weekly_learning_hours, learning_style_primary, interest_scores";

export async function getProfile(
    userId: string
): Promise<OnboardingProfile | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("profiles")
        .select(ONBOARDING_PROFILE_FIELDS)
        .eq("id", userId)
        .single();

    if (error || !data) return null;
    return data as OnboardingProfile;
}

export async function getActivePaths(): Promise<Path[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("paths")
        .select("*")
        .eq("is_active", true)
        .order("name");

    if (error || !data) return [];
    return data as Path[];
}

export async function getPathById(pathId: string): Promise<Path | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("paths")
        .select("*")
        .eq("id", pathId)
        .single();

    if (error || !data) return null;
    return data as Path;
}
