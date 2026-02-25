"use server";

import { revalidatePath } from "next/cache";
import {
  changePassword,
  rerunRecommendation,
  updateAIPrefs,
  updateLearningPrefs,
  updateProfile,
} from "../services/profile-service";
import type { UpdateAIPrefsInput, UpdateLearningPrefsInput, UpdateProfileInput } from "../types";

export async function updateProfileAction(userId: string, input: UpdateProfileInput) {
  try {
    await updateProfile(userId, input);
    revalidatePath("/dashboard/profile");
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update profile";
    return { success: false, error: message };
  }
}

export async function updateLearningPrefsAction(userId: string, input: UpdateLearningPrefsInput) {
  try {
    await updateLearningPrefs(userId, input);
    revalidatePath("/dashboard/profile");
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update learning preferences";
    return { success: false, error: message };
  }
}

export async function updateAIPrefsAction(userId: string, input: UpdateAIPrefsInput) {
  try {
    await updateAIPrefs(userId, input);
    revalidatePath("/dashboard/profile");
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update AI preferences";
    return { success: false, error: message };
  }
}

export async function changePasswordAction(
  userId: string,
  input: { old_password: string; new_password: string; confirm_password: string }
) {
  try {
    await changePassword(userId, input);
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update password";
    return { success: false, error: message };
  }
}

export async function rerunRecommendationAction(userId: string) {
  try {
    const result = await rerunRecommendation(userId);
    revalidatePath("/dashboard/profile");
    return { success: true, result };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to rerun recommendation";
    return { success: false, error: message };
  }
}
