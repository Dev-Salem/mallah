import { createClient } from "@/lib/supabase/server";
import { OnboardingResponse, AIRecommendation, AIStatus } from "../types";

export async function getOnboardingState(userId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('onboarding_responses')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data as OnboardingResponse | null;
}

export async function saveOnboardingStep(userId: string, data: Partial<OnboardingResponse>) {
    const supabase = await createClient();

    const { data: existing } = await supabase
        .from('onboarding_responses')
        .select('id')
        .eq('user_id', userId)
        .single();

    if (existing) {
        const { error } = await supabase
            .from('onboarding_responses')
            .update(data)
            .eq('user_id', userId);
        if (error) throw error;
    } else {
        const { error } = await supabase
            .from('onboarding_responses')
            .insert({ ...data, user_id: userId });
        if (error) throw error;
    }
}

export async function saveAIRecommendation(userId: string, onboardingId: string, recommendation: any) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('ai_recommendations')
        .insert({
            user_id: userId,
            onboarding_id: onboardingId,
            recommended_path_id: recommendation.recommended_path_id,
            confidence_score: recommendation.confidence_score,
            explanation: recommendation.explanation,
            alternatives: recommendation.alternatives,
            starter_plan_2_weeks: recommendation.starter_plan_2_weeks,
            first_milestone: recommendation.first_milestone,
            risk_flags: recommendation.risk_flags,
        });

    if (error) throw error;

    // Update onboarding status
    await supabase
        .from('onboarding_responses')
        .update({
            ai_status: 'success',
            completed_at: new Date().toISOString()
        })
        .eq('id', onboardingId);

    // Update learner record
    await supabase
        .from('learners')
        .update({
            onboarding_completed: true,
            current_path_id: await getPathUuid(recommendation.recommended_path_id)
        })
        .eq('user_id', userId);
}

async function getPathUuid(interestKey: string) {
    const supabase = await createClient();
    const { data } = await supabase
        .from('paths')
        .select('id')
        .eq('interest_key', interestKey)
        .single();
    return data?.id || null;
}

export async function updateAIStatus(onboardingId: string, status: AIStatus, attemptCount?: number) {
    const supabase = await createClient();
    const updateData: any = { ai_status: status, ai_last_attempt_at: new Date().toISOString() };
    if (attemptCount !== undefined) updateData.ai_attempt_count = attemptCount;

    await supabase
        .from('onboarding_responses')
        .update(updateData)
        .eq('id', onboardingId);
}
