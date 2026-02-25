import { createClient } from "@/lib/supabase/server";
import { computePathScorecard, deriveLearningVelocity } from "@/features/onboarding/services/scoring-logic";
import { generateRecommendation } from "@/features/onboarding/services/ai-service";
import { saveAIRecommendation, updateAIStatus } from "@/features/onboarding/services/onboarding-service";
import type {
  PasswordChangeInput,
  ProfileViewModel,
  UpdateAIPrefsInput,
  UpdateLearningPrefsInput,
  UpdateProfileInput,
} from "../types";

export async function getProfile(userId: string): Promise<ProfileViewModel> {
  const supabase = await createClient();
  const { data: userRow, error: userErr } = await supabase
    .from("users")
    .select("user_id, email")
    .eq("user_id", userId)
    .single();
  if (userErr) throw userErr;

  const { data: learner, error: learnerErr } = await supabase
    .from("learners")
    .select(
      "user_id,first_name,last_name,background_type,primary_goal,current_path_id,onboarding_completed,weekly_hours_category,learning_velocity,ai_language_pref,ai_detail_level"
    )
    .eq("user_id", userId)
    .single();
  if (learnerErr) throw learnerErr;

  let pathName: string | null = null;
  if (learner.current_path_id) {
    const { data: path } = await supabase.from("paths").select("name").eq("id", learner.current_path_id).maybeSingle();
    pathName = path?.name ?? null;
  }

  return {
    user_id: userId,
    email: userRow.email ?? null,
    first_name: learner.first_name ?? null,
    last_name: learner.last_name ?? null,
    background_type: learner.background_type ?? null,
    primary_goal: learner.primary_goal ?? null,
    current_path_id: learner.current_path_id ?? null,
    current_path_name: pathName,
    onboarding_completed: Boolean(learner.onboarding_completed),
    weekly_hours_category: learner.weekly_hours_category ?? null,
    learning_velocity: learner.learning_velocity ?? null,
    ai_language_pref: learner.ai_language_pref ?? null,
    ai_detail_level: learner.ai_detail_level ?? null,
  };
}

export async function updateProfile(userId: string, input: UpdateProfileInput) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("learners")
    .update({
      first_name: input.first_name,
      last_name: input.last_name,
      background_type: input.background_type,
      primary_goal: input.primary_goal,
    })
    .eq("user_id", userId);
  if (error) throw error;
}

export async function updateLearningPrefs(userId: string, input: UpdateLearningPrefsInput) {
  const supabase = await createClient();
  const velocity = deriveLearningVelocity(input.weekly_hours_category);
  const { error } = await supabase
    .from("learners")
    .update({
      weekly_hours_category: input.weekly_hours_category,
      learning_velocity: velocity,
    })
    .eq("user_id", userId);
  if (error) throw error;
}

export async function updateAIPrefs(userId: string, input: UpdateAIPrefsInput) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("learners")
    .update({
      ai_language_pref: input.ai_language_pref,
      ai_detail_level: input.ai_detail_level,
    })
    .eq("user_id", userId);
  if (error) throw error;
}

export async function changePassword(userId: string, input: PasswordChangeInput) {
  if (input.new_password !== input.confirm_password) {
    throw new Error("Password confirmation does not match.");
  }
  if (input.new_password.length < 8) {
    throw new Error("New password must be at least 8 characters.");
  }

  const supabase = await createClient();
  const { data: account, error: accountErr } = await supabase.from("users").select("email").eq("user_id", userId).single();
  if (accountErr || !account?.email) throw new Error("Unable to verify current password.");

  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: account.email,
    password: input.old_password,
  });
  if (verifyError) throw new Error("Current password is invalid.");

  const { error } = await supabase.auth.updateUser({
    password: input.new_password,
  });
  if (error) throw error;
}

export async function rerunRecommendation(userId: string) {
  const supabase = await createClient();
  const { data: onboarding, error: onboardErr } = await supabase
    .from("onboarding_responses")
    .select("*")
    .eq("user_id", userId)
    .single();
  if (onboardErr || !onboarding) throw new Error("Onboarding responses are required before reassessment.");

  await updateAIStatus(onboarding.id, "pending", (onboarding.ai_attempt_count || 0) + 1);

  const { scorecard, top_signals } = computePathScorecard(onboarding);
  const recommendation = await generateRecommendation(onboarding, scorecard, top_signals);
  const recommendationId = await saveAIRecommendation(userId, onboarding.id, recommendation);

  const { data: learner } = await supabase.from("learners").select("current_path_id").eq("user_id", userId).single();
  let currentPathName: string | null = null;
  if (learner?.current_path_id) {
    const { data: path } = await supabase.from("paths").select("name").eq("id", learner.current_path_id).maybeSingle();
    currentPathName = path?.name ?? null;
  }

  return {
    recommendation_id: recommendationId,
    current_path_name: currentPathName,
    new_recommended_path: recommendation.recommended_path_id,
    confidence_score: recommendation.confidence_score,
  };
}
