"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { InterestScores, Path } from "../types";

async function getAuthenticatedUserId(): Promise<string> {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");
    return user.id;
}

export async function saveStepOne(firstName: string, lastName: string) {
    const userId = await getAuthenticatedUserId();
    const supabase = await createClient();

    const { error } = await supabase
        .from("profiles")
        .update({
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            onboarding_step: 2,
            updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

    if (error) throw new Error(error.message);
    revalidatePath("/onboarding");
}

export async function saveStepTwo(backgroundType: string) {
    const userId = await getAuthenticatedUserId();
    const supabase = await createClient();

    const { error } = await supabase
        .from("profiles")
        .update({
            background_type: backgroundType,
            onboarding_step: 3,
            updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

    if (error) throw new Error(error.message);
    revalidatePath("/onboarding");
}

export async function saveStepThree(
    weeklyLearningHours: string,
    learningStylePrimary: string
) {
    const userId = await getAuthenticatedUserId();
    const supabase = await createClient();

    const { error } = await supabase
        .from("profiles")
        .update({
            weekly_learning_hours: weeklyLearningHours,
            learning_style_primary: learningStylePrimary,
            onboarding_step: 4,
            updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

    if (error) throw new Error(error.message);
    revalidatePath("/onboarding");
}

export async function saveStepFour(interestScores: InterestScores) {
    const userId = await getAuthenticatedUserId();
    const supabase = await createClient();

    const { error } = await supabase
        .from("profiles")
        .update({
            interest_scores: interestScores,
            onboarding_step: 5,
            updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

    if (error) throw new Error(error.message);
    revalidatePath("/onboarding");
}

export async function saveStepFive(primaryGoal: string) {
    const userId = await getAuthenticatedUserId();
    const supabase = await createClient();

    const { error } = await supabase
        .from("profiles")
        .update({
            primary_goal: primaryGoal,
            onboarding_step: 6,
            updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

    if (error) throw new Error(error.message);
    revalidatePath("/onboarding");
}

export async function saveStepSix(
    aiLanguagePref: string,
    aiDetailLevel: string
) {
    const userId = await getAuthenticatedUserId();
    const supabase = await createClient();

    const { error } = await supabase
        .from("profiles")
        .update({
            ai_language_pref: aiLanguagePref,
            ai_detail_level: aiDetailLevel,
            onboarding_step: 7,
            updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

    if (error) throw new Error(error.message);
    revalidatePath("/onboarding");
}

export async function computeRecommendedPath(
    interestScores: InterestScores,
    activePaths: Path[]
): Promise<Path | null> {
    // Find the interest key with the highest score
    const entries = Object.entries(interestScores) as [string, number][];
    entries.sort((a, b) => b[1] - a[1]);

    for (const [key] of entries) {
        const match = activePaths.find((p) => p.interest_key === key);
        if (match) return match;
    }

    // Fallback: return first active path
    return activePaths.length > 0 ? activePaths[0] : null;
}

export async function completeOnboarding(pathId: string) {
    const userId = await getAuthenticatedUserId();
    const supabase = await createClient();

    const { error } = await supabase
        .from("profiles")
        .update({
            current_path_id: pathId,
            onboarding_completed: true,
            onboarding_step: 7,
            updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

    if (error) throw new Error(error.message);
    revalidatePath("/onboarding");
    revalidatePath("/dashboard");
}
