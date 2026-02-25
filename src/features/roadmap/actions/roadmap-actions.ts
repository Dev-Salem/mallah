"use server";

import { revalidatePath } from "next/cache";
import { completeTopic, getRoadmapSummary, openTopic } from "../services/roadmap-service";

export async function getRoadmapSummaryAction(userId: string) {
  try {
    const summary = await getRoadmapSummary(userId);
    return { success: true, summary };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load roadmap";
    return { success: false, error: message };
  }
}

export async function openTopicAction(userId: string, topicId: string) {
  try {
    const topic = await openTopic(userId, topicId);
    revalidatePath("/dashboard/roadmap");
    return { success: true, topic };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to open topic";
    return { success: false, error: message };
  }
}

export async function completeTopicAction(userId: string, topicId: string) {
  try {
    const result = await completeTopic(userId, topicId);
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/roadmap");
    return { success: true, result };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to complete topic";
    return { success: false, error: message };
  }
}
