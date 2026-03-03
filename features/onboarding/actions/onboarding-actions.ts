"use server";

import { createClient } from "@/lib/supabase/server";
import { onboardingFormDataSchema, onboardingDraftSchema } from "../types";
import type { OnboardingFormData, OnboardingDraft, OnboardingResult, PathId } from "../types";
import { VELOCITY_MAP } from "../constants";
import {
    generatePathRecommendation,
    buildInterestVector,
    computeReadinessLevel,
} from "../services/ai-service";
import { RoadmapService } from "@/features/roadmap/services/roadmap-service";

// ─── Partial Draft Persistence ───

export async function saveOnboardingDraftAction(
    draft: OnboardingDraft
): Promise<{ success: true; onboardingId: string } | { success: false; error: string }> {
    try {
        const supabase = await createClient();
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
            return { success: false, error: "Not authenticated." };
        }

        // Find existing non-completed onboarding session
        const { data: existing } = await supabase
            .from("onboarding_responses")
            .select("onboarding_id")
            .eq("user_id", user.id)
            .is("completed_at", null)
            .order("created_at", { ascending: false })
            .maybeSingle();

        const payload = {
            user_id: user.id,
            background_type: draft.backgroundType,
            primary_goal: draft.primaryGoal,
            weekly_hours_category: draft.weeklyHoursCategory,
            learning_velocity: draft.weeklyHoursCategory
                ? VELOCITY_MAP[draft.weeklyHoursCategory]
                : undefined,
            raw_interests: draft.interests,
            interest_vector: draft.interests ? buildInterestVector(draft.interests) : undefined,
            confidence_snapshot: draft.confidenceItems,
            readiness_level: draft.confidenceItems
                ? computeReadinessLevel(draft.confidenceItems)
                : undefined,
            ai_language_pref: draft.aiLanguagePref,
            ai_detail_level: draft.aiDetailLevel,
            current_step: draft.currentStep,
        };

        if (existing) {
            const { error: updateError } = await supabase
                .from("onboarding_responses")
                .update(payload)
                .eq("onboarding_id", existing.onboarding_id);

            if (updateError) throw updateError;
            return { success: true, onboardingId: existing.onboarding_id };
        } else {
            const { data: insertRow, error: insertError } = await supabase
                .from("onboarding_responses")
                .insert(payload)
                .select("onboarding_id")
                .single();

            if (insertError || !insertRow) throw insertError;
            return { success: true, onboardingId: insertRow.onboarding_id };
        }
    } catch (error: any) {
        console.error("saveOnboardingDraftAction error:", error);
        return { success: false, error: error.message || "Failed to save draft." };
    }
}

export async function getOnboardingDraftAction(): Promise<
    { success: true; draft: OnboardingDraft | null } | { success: false; error: string }
> {
    try {
        const supabase = await createClient();
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
            return { success: false, error: "Not authenticated." };
        }

        const { data, error } = await supabase
            .from("onboarding_responses")
            .select("*")
            .eq("user_id", user.id)
            .is("completed_at", null)
            .order("created_at", { ascending: false })
            .maybeSingle();

        if (error) throw error;
        if (!data) return { success: true, draft: null };

        return {
            success: true,
            draft: {
                backgroundType: data.background_type,
                primaryGoal: data.primary_goal,
                weeklyHoursCategory: data.weekly_hours_category,
                interests: data.raw_interests || [],
                confidenceItems: data.confidence_snapshot || [],
                aiLanguagePref: data.ai_language_pref,
                aiDetailLevel: data.ai_detail_level,
                currentStep: data.current_step,
            },
        };
    } catch (error: any) {
        console.error("getOnboardingDraftAction error:", error);
        return { success: false, error: error.message || "Failed to fetch draft." };
    }
}

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

        // 4. Find existing draft to update or insert fresh
        const { data: existing } = await supabase
            .from("onboarding_responses")
            .select("onboarding_id")
            .eq("user_id", user.id)
            .is("completed_at", null)
            .order("created_at", { ascending: false })
            .maybeSingle();

        const payload = {
            user_id: user.id,
            background_type: data.backgroundType,
            primary_goal: data.primaryGoal,
            weekly_hours_category: data.weeklyHoursCategory,
            learning_velocity: learningVelocity,
            raw_interests: data.interests,
            interest_vector: interestVector,
            confidence_snapshot: data.confidenceItems,
            readiness_level: readinessLevel,
            ai_language_pref: data.aiLanguagePref,
            ai_detail_level: data.aiDetailLevel,
            completed_at: new Date().toISOString(),
            current_step: "completed",
        };

        let onboardingId: string;

        if (existing) {
            const { error: updateError } = await supabase
                .from("onboarding_responses")
                .update(payload)
                .eq("onboarding_id", existing.onboarding_id);

            if (updateError) throw updateError;
            onboardingId = existing.onboarding_id;
        } else {
            const { data: insertRow, error: insertError } = await supabase
                .from("onboarding_responses")
                .insert(payload)
                .select("onboarding_id")
                .single();

            if (insertError || !insertRow) throw insertError;
            onboardingId = insertRow.onboarding_id;
        }

        // 5. Get AI recommendation
        const recommendation = await generatePathRecommendation(data);

        if (!recommendation) {
            // AI failed — return null recommendation so UI shows manual selection
            return {
                success: true,
                result: {
                    onboardingId: onboardingId,
                    recommendation: null,
                },
            };
        }

        // 6. Insert ai_recommendations
        const { error: recError } = await supabase.from("ai_recommendations").insert({
            user_id: user.id,
            onboarding_id: onboardingId,
            recommended_path_id: recommendation.recommended_path_id,
            confidence_score: recommendation.match_score,
            reasons: recommendation.reasons,
            alternatives: recommendation.alternatives,
            plan_2_weeks: null,
            accepted_path_id: null,
        });

        if (recError) {
            console.error("AI recommendation insert error:", recError);
        }

        return {
            success: true,
            result: {
                onboardingId: onboardingId,
                recommendation,
            },
        };
    } catch (error: any) {
        console.error("submitOnboardingAction error:", error);
        return { success: false, error: error.message || "An unexpected error occurred." };
    }
}

// ─── Accept Path & Finalize Onboarding ───

export async function acceptPathAction(
    pathId: PathId,
    onboardingId: string
): Promise<{ success: true } | { success: false; error: string }> {
    if (!onboardingId) {
        return { success: false, error: "Missing onboarding session. Please restart onboarding." };
    }
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

        // Initialize roadmap scaffolding
        await RoadmapService.initializeUserRoadmap(user.id, pathId);

        // 5. Update accepted_path_id in ai_recommendations
        await supabase
            .from("ai_recommendations")
            .update({ accepted_path_id: pathId })
            .eq("onboarding_id", onboardingId);

        return { success: true };
    } catch (error: any) {
        console.error("acceptPathAction error:", error);
        return { success: false, error: "An unexpected error occurred." };
    }
}
