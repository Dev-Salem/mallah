"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { UpdateProfilePayload, UpdatePreferencesPayload } from "../types";

async function getAuthenticatedUserId(): Promise<string> {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");
    return user.id;
}

export async function updateProfile(payload: UpdateProfilePayload) {
    const userId = await getAuthenticatedUserId();
    const supabase = await createClient();

    const { error } = await supabase
        .from("learners")
        .update({
            first_name: payload.first_name,
            last_name: payload.last_name,
            background_type: payload.background_type,
            primary_goal: payload.primary_goal,
        })
        .eq("user_id", userId);

    if (error) throw new Error(error.message);
    revalidatePath("/dashboard/settings");
    return { success: true };
}

export async function updatePreferences(payload: UpdatePreferencesPayload) {
    const userId = await getAuthenticatedUserId();
    const supabase = await createClient();

    const { error } = await supabase
        .from("learners")
        .update({
            weekly_learning_hours: payload.weekly_learning_hours,
            learning_style_primary: payload.learning_style_primary,
            ai_language_pref: payload.ai_language_pref,
            ai_detail_level: payload.ai_detail_level,
        })
        .eq("user_id", userId);

    if (error) throw new Error(error.message);
    revalidatePath("/dashboard/settings");
    return { success: true };
}

export async function changePassword(currentPassword: string, newPassword: string) {
    const supabase = await createClient();

    const { error } = await supabase.auth.updateUser({
        password: newPassword,
    });

    if (error) throw new Error(error.message);
    return { success: true };
}
