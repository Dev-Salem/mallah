"use server";

import { revalidatePath } from "next/cache";
import {
  addManualSkill,
  createCustomProject,
  deleteCustomProject,
  deleteManualSkill,
  toggleSkillVisibility,
  updateCustomProject,
  updateManualSkill,
  updateProjectStatus,
} from "../services/skills-hub-service";
import type {
  AddManualSkillInput,
  CreateCustomProjectInput,
  ToggleSkillVisibilityInput,
  UpdateCustomProjectInput,
  UpdateManualSkillInput,
  UpdateProjectStatusInput,
} from "../types";

function ok() {
  return { success: true as const };
}

function fail(error: unknown) {
  const message = error instanceof Error ? error.message : "Operation failed";
  return { success: false as const, error: message };
}

function revalidateHub() {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/skills");
}

export async function addManualSkillAction(userId: string, input: AddManualSkillInput) {
  try {
    await addManualSkill(userId, input);
    revalidateHub();
    revalidatePath(`/portfolio/${userId}`);
    return ok();
  } catch (error: unknown) {
    return fail(error);
  }
}

export async function updateManualSkillAction(userId: string, input: UpdateManualSkillInput) {
  try {
    await updateManualSkill(userId, input);
    revalidateHub();
    revalidatePath(`/portfolio/${userId}`);
    return ok();
  } catch (error: unknown) {
    return fail(error);
  }
}

export async function deleteManualSkillAction(userId: string, skillId: string) {
  try {
    await deleteManualSkill(userId, skillId);
    revalidateHub();
    revalidatePath(`/portfolio/${userId}`);
    return ok();
  } catch (error: unknown) {
    return fail(error);
  }
}

export async function toggleSkillVisibilityAction(userId: string, input: ToggleSkillVisibilityInput) {
  try {
    await toggleSkillVisibility(userId, input);
    revalidateHub();
    revalidatePath(`/portfolio/${userId}`);
    return ok();
  } catch (error: unknown) {
    return fail(error);
  }
}

export async function createCustomProjectAction(userId: string, input: CreateCustomProjectInput) {
  try {
    await createCustomProject(userId, input);
    revalidateHub();
    revalidatePath(`/portfolio/${userId}`);
    return ok();
  } catch (error: unknown) {
    return fail(error);
  }
}

export async function updateCustomProjectAction(userId: string, input: UpdateCustomProjectInput) {
  try {
    await updateCustomProject(userId, input);
    revalidateHub();
    revalidatePath(`/portfolio/${userId}`);
    return ok();
  } catch (error: unknown) {
    return fail(error);
  }
}

export async function deleteCustomProjectAction(userId: string, projectId: string) {
  try {
    await deleteCustomProject(userId, projectId);
    revalidateHub();
    revalidatePath(`/portfolio/${userId}`);
    return ok();
  } catch (error: unknown) {
    return fail(error);
  }
}

export async function updateProjectStatusAction(userId: string, input: UpdateProjectStatusInput) {
  try {
    await updateProjectStatus(userId, input);
    revalidateHub();
    revalidatePath(`/portfolio/${userId}`);
    return ok();
  } catch (error: unknown) {
    return fail(error);
  }
}

