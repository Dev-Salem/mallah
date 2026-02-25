"use server";

import { revalidatePath } from "next/cache";
import {
    saveOnboardingStep,
    saveAIRecommendation,
    updateAIStatus,
    getOnboardingState
} from "../services/onboarding-service";
import { computePathScorecard, deriveLearningVelocity } from "../services/scoring-logic";
import { generateRecommendation } from "../services/ai-service";
import { OnboardingResponse } from "../types";

export async function saveStepAction(userId: string, data: Partial<OnboardingResponse>) {
    try {
        // If weekly_hours_category is present, also derive learning_velocity
        if (data.weekly_hours_category) {
            data.learning_velocity = deriveLearningVelocity(data.weekly_hours_category);
        }

        await saveOnboardingStep(userId, data);
        revalidatePath("/onboarding");
        return { success: true };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "An unknown error occurred";
        return { error: message };
    }
}

export async function finishOnboardingAction(userId: string) {
    try {
        const state = await getOnboardingState(userId);
        if (!state) throw new Error("Onboarding state not found");

        await updateAIStatus(state.id, 'pending', (state.ai_attempt_count || 0) + 1);

        // 1. Compute deterministic scores
        const { scorecard, top_signals } = computePathScorecard(state);

        // 2. Call OpenAI
        const recommendation = await generateRecommendation(state, scorecard, top_signals);

        // 3. Save recommendation
        await saveAIRecommendation(userId, state.id, recommendation);

        revalidatePath("/onboarding");
        revalidatePath("/dashboard");

        return { success: true, recommendation };
    } catch (error: unknown) {
        console.error("Finish Onboarding Error:", error);
        const message = error instanceof Error ? error.message : "An unknown error occurred";
        // Note: In real production, we'd trigger a background retry if this fails.
        // For now, we return the error to the UI.
        return { error: message };
    }
}
