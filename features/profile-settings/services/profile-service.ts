"use server";

import { createClient } from "@/lib/supabase/server";
import type { ProfileData } from "../types";

export async function getProfileData(): Promise<ProfileData | { error: string }> {
    const supabase = await createClient();

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        return { error: "Not authenticated" };
    }

    const { data: learner, error: learnerError } = await supabase
        .from("learners")
        .select("*, paths(name)")
        .eq("user_id", user.id)
        .single();

    if (learnerError || !learner) {
        return { error: "Learner profile not found" };
    }

    return {
        user_id: user.id,
        first_name: learner.first_name || "",
        last_name: learner.last_name || "",
        email: user.email || "",
        background_type: learner.background_type || "Student",
        primary_goal: learner.primary_goal || "FullTimeJob",
        current_path_id: learner.current_path_id,
        path_name: learner.paths?.name || null,
        onboarding_completed: learner.onboarding_completed || false,
        weekly_learning_hours: learner.weekly_learning_hours || "4-7",
        learning_style_primary: learner.learning_style_primary || "Video",
        ai_language_pref: learner.ai_language_pref || "EN",
        ai_detail_level: learner.ai_detail_level || "Balanced",
    };
}
