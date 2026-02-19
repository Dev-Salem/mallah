"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { InterestScores, Path } from "../types";

async function getAuthenticatedUserIdAndClient() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");
    return { userId: user.id, supabase };
}

export async function saveStepOne(firstName: string, lastName: string) {
    const { userId, supabase } = await getAuthenticatedUserIdAndClient();

    const { error } = await supabase
        .from("learners")
        .update({
            first_name: firstName.trim(),
            last_name: lastName.trim(),
        })
        .eq("user_id", userId);

    if (error) throw new Error(error.message);
    revalidatePath("/onboarding");
}

export async function saveStepTwo(backgroundType: string) {
    const { userId, supabase } = await getAuthenticatedUserIdAndClient();

    const { error } = await supabase
        .from("learners")
        .update({
            background_type: backgroundType,
        })
        .eq("user_id", userId);

    if (error) throw new Error(error.message);
    revalidatePath("/onboarding");
}

export async function saveStepThree(
    weeklyLearningHours: string,
    learningStylePrimary: string
) {
    const { userId, supabase } = await getAuthenticatedUserIdAndClient();

    const { error } = await supabase
        .from("learners")
        .update({
            weekly_learning_hours: weeklyLearningHours,
            learning_style_primary: learningStylePrimary,
        })
        .eq("user_id", userId);

    if (error) throw new Error(error.message);
    revalidatePath("/onboarding");
}

export async function saveStepFour(interestScores: InterestScores) {
    const { userId, supabase } = await getAuthenticatedUserIdAndClient();

    const { error } = await supabase
        .from("learners")
        .update({
            interest_scores: interestScores,
        })
        .eq("user_id", userId);

    if (error) throw new Error(error.message);
    revalidatePath("/onboarding");
}

export async function saveStepFive(primaryGoal: string) {
    const { userId, supabase } = await getAuthenticatedUserIdAndClient();

    const { error } = await supabase
        .from("learners")
        .update({
            primary_goal: primaryGoal,
        })
        .eq("user_id", userId);

    if (error) throw new Error(error.message);
    revalidatePath("/onboarding");
}

export async function saveStepSix(
    aiLanguagePref: string,
    aiDetailLevel: string
) {
    const { userId, supabase } = await getAuthenticatedUserIdAndClient();

    const { error } = await supabase
        .from("learners")
        .update({
            ai_language_pref: aiLanguagePref,
            ai_detail_level: aiDetailLevel,
        })
        .eq("user_id", userId);

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
    const { userId, supabase } = await getAuthenticatedUserIdAndClient();

    const { error } = await supabase
        .from("learners")
        .update({
            current_path_id: pathId,
            onboarding_completed: true,
        })
        .eq("user_id", userId);

    if (error) throw new Error(error.message);
    revalidatePath("/onboarding");
    revalidatePath("/dashboard");
}
