"use server";

import { createClient } from "@/lib/supabase/server";
import { onboardingFormDataSchema } from "../types";
import type { OnboardingFormData, OnboardingResult, PathId } from "../types";
import { VELOCITY_MAP } from "../constants";
import {
    generatePathRecommendation,
    buildInterestVector,
    computeReadinessLevel,
} from "../services/ai-service";

// ─── Submit Onboarding & Get AI Recommendation ───

export async function submitOnboardingAction(
    rawData: OnboardingFormData
): Promise<{ success: true; result: OnboardingResult } | { success: false; error: string }> {
    try {
        // 1. Validate
        const data = onboardingFormDataSchema.parse(rawData);

        // 2. Get authenticated user
        const supabase = await createClient();
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
            return { success: false, error: "Not authenticated." };
        }

        // 3. Derive computed fields
        const learningVelocity = VELOCITY_MAP[data.weeklyHoursCategory];
        const interestVector = buildInterestVector(data.interests);
        const readinessLevel = computeReadinessLevel(data.confidenceItems);

        // 4. Insert onboarding_responses
        const { data: onboardingRow, error: insertError } = await supabase
            .from("onboarding_responses")
            .insert({
                user_id: user.id,
                background_type: data.backgroundType,
                primary_goal: data.primaryGoal,
                weekly_hours_category: data.weeklyHoursCategory,
                learning_velocity: learningVelocity,
                interest_vector: interestVector,
                confidence_snapshot: data.confidenceItems,
                readiness_level: readinessLevel,
                ai_language_pref: data.aiLanguagePref,
                ai_detail_level: data.aiDetailLevel,
            })
            .select("onboarding_id")
            .single();

        if (insertError || !onboardingRow) {
            console.error("Onboarding insert error:", insertError);
            return { success: false, error: "Failed to save onboarding responses." };
        }

        // 5. Get AI recommendation
        const recommendation = await generatePathRecommendation(data);

        if (!recommendation) {
            // AI failed — return null recommendation so UI shows manual selection
            return {
                success: true,
                result: {
                    onboardingId: onboardingRow.onboarding_id,
                    recommendation: null,
                },
            };
        }

        // 6. Insert ai_recommendations
        const { error: recError } = await supabase.from("ai_recommendations").insert({
            user_id: user.id,
            onboarding_id: onboardingRow.onboarding_id,
            recommended_path_id: recommendation.recommended_path_id,
            confidence_score: recommendation.match_score,
            reasons: recommendation.reasons,
            alternatives: recommendation.alternatives,
            plan_2_weeks: {},
            accepted_path_id: null,
        });

        if (recError) {
            console.error("AI recommendation insert error:", recError);
        }

        return {
            success: true,
            result: {
                onboardingId: onboardingRow.onboarding_id,
                recommendation,
            },
        };
    } catch (error) {
        console.error("submitOnboardingAction error:", error);
        return { success: false, error: "An unexpected error occurred." };
    }
}

// ─── Accept Path & Finalize Onboarding ───

export async function acceptPathAction(
    pathId: PathId,
    onboardingId: string
): Promise<{ success: true } | { success: false; error: string }> {
    try {
        const supabase = await createClient();
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
            return { success: false, error: "Not authenticated." };
        }

        // 1. Get learner data for portfolio_slug generation
        const { data: learner } = await supabase
            .from("learners")
            .select("first_name, last_name")
            .eq("user_id", user.id)
            .single();

        // 2. Generate portfolio_slug
        const baseName = learner
            ? `${learner.first_name}-${learner.last_name}`.toLowerCase().replace(/\s+/g, "-")
            : "user";
        const suffix = Math.random().toString(36).substring(2, 5);
        const portfolioSlug = `${baseName}-${suffix}`;

        // 3. Get onboarding responses for learner profile fields
        const { data: onboardingData } = await supabase
            .from("onboarding_responses")
            .select("*")
            .eq("onboarding_id", onboardingId)
            .single();

        // 4. Update learners table
        const { error: updateError } = await supabase
            .from("learners")
            .update({
                current_path_id: pathId,
                onboarding_completed: true,
                background_type: onboardingData?.background_type,
                primary_goal: onboardingData?.primary_goal,
                weekly_hours_category: onboardingData?.weekly_hours_category,
                learning_velocity: onboardingData?.learning_velocity,
                ai_language_pref: onboardingData?.ai_language_pref,
                ai_detail_level: onboardingData?.ai_detail_level,
                readiness_level: onboardingData?.readiness_level,
                portfolio_slug: portfolioSlug,
            })
            .eq("user_id", user.id);

        if (updateError) {
            console.error("Learner update error:", updateError);
            return { success: false, error: "Failed to finalize onboarding." };
        }

        // 5. Update accepted_path_id in ai_recommendations
        await supabase
            .from("ai_recommendations")
            .update({ accepted_path_id: pathId })
            .eq("onboarding_id", onboardingId);

        return { success: true };
    } catch (error) {
        console.error("acceptPathAction error:", error);
        return { success: false, error: "An unexpected error occurred." };
    }
}
