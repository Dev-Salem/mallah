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

    const { data, error } = await supabase
        .from('ai_recommendations')
        .insert({
            user_id: userId,
            onboarding_id: onboardingId,
            recommended_path_id: recommendation.recommended_path_id,
            confidence_score: Math.round(recommendation.confidence_score),
            explanation: recommendation.explanation,
            alternatives: recommendation.alternatives,
            starter_plan_2_weeks: recommendation.starter_plan_2_weeks,
            first_milestone: recommendation.first_milestone,
            risk_flags: recommendation.risk_flags,
        })
        .select('id')
        .single();

    if (error) throw error;

    const { error: onboardingUpdateError } = await supabase
        .from('onboarding_responses')
        .update({
            ai_status: 'success'
        })
        .eq('id', onboardingId);
    if (onboardingUpdateError) throw onboardingUpdateError;

    return data.id as string;
}

export async function getPathUuid(interestKey: string) {
    const supabase = await createClient();
    const { data } = await supabase
        .from('paths')
        .select('id, is_active')
        .eq('interest_key', interestKey)
        .single();
    if (!data?.id || !data?.is_active) return null;
    return data.id;
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

export async function acceptRecommendation(
    userId: string,
    recommendationId: string,
    selectedPathId?: "frontend" | "fullstack" | "cybersecurity" | "datascience"
) {
    const supabase = await createClient();
    const { data: recommendation, error } = await supabase
        .from('ai_recommendations')
        .select('id, onboarding_id, recommended_path_id')
        .eq('id', recommendationId)
        .eq('user_id', userId)
        .single();

    if (error || !recommendation) throw new Error("Recommendation not found");

    const acceptedPath = selectedPathId || recommendation.recommended_path_id;
    const pathUuid = await getPathUuid(acceptedPath);
    if (!pathUuid) throw new Error("Selected path is invalid or inactive.");

    const { error: recUpdateError } = await supabase
        .from('ai_recommendations')
        .update({ accepted_path_id: acceptedPath })
        .eq('id', recommendationId)
        .eq('user_id', userId);
    if (recUpdateError) throw recUpdateError;

    const now = new Date().toISOString();
    const { error: learnerError } = await supabase
        .from('learners')
        .update({
            onboarding_completed: true,
            current_path_id: pathUuid
        })
        .eq('user_id', userId);
    if (learnerError) throw learnerError;

    const { error: onboardingError } = await supabase
        .from('onboarding_responses')
        .update({
            completed_at: now,
            ai_status: 'success'
        })
        .eq('id', recommendation.onboarding_id)
        .eq('user_id', userId);
    if (onboardingError) throw onboardingError;
}
