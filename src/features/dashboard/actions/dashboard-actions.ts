"use server";

import { getDashboardSummary } from "../services/dashboard-service";

export async function getDashboardSummaryAction(userId: string) {
  try {
    const summary = await getDashboardSummary(userId);
    return { success: true, summary };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load dashboard summary";
    return { success: false, error: message };
  }
}
