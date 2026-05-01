"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { trackerService } from "../services/tracker.service";
import { ApplicationStage } from "../types";

const ApplicationSchema = z.object({
  company_name: z.string().min(1, "Company name is required"),
  role_title: z.string().min(1, "Job title is required"),
  location: z.string().optional().nullable(),
  stage: z.enum([
    "saved", "applied", "in_review", "interviewing", "offer", "accepted", "rejected", "withdrawn"
  ] as const),
  date: z.string().min(1, "Date is required"),
  posting_url: z.string().url().or(z.literal("")).optional().nullable(),
  notes: z.string().optional().nullable(),
  analysis_id: z.string().uuid().optional().nullable(),
});

export async function getApplicationsAction() {
  try {
    return await trackerService.getApplications();
  } catch (error) {
    console.error("Failed to fetch applications:", error);
    throw new Error("Failed to load applications");
  }
}

export async function createApplicationAction(formData: z.infer<typeof ApplicationSchema>) {
  try {
    const validatedData = ApplicationSchema.parse(formData);
    const result = await trackerService.createApplication(validatedData);
    revalidatePath("/[locale]/dashboard/tracker", "page");
    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to create application:", error);
    return { success: false, error: "Failed to create application" };
  }
}

export async function updateApplicationAction(
  applicationId: string, 
  formData: Partial<z.infer<typeof ApplicationSchema>>
) {
  try {
    const validatedData = ApplicationSchema.partial().parse(formData);
    const result = await trackerService.updateApplication({
      application_id: applicationId,
      ...validatedData
    });
    revalidatePath("/[locale]/dashboard/tracker", "page");
    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to update application:", error);
    return { success: false, error: "Failed to update application" };
  }
}

export async function deleteApplicationAction(applicationId: string) {
  try {
    await trackerService.deleteApplication(applicationId);
    revalidatePath("/[locale]/dashboard/tracker", "page");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete application:", error);
    return { success: false, error: "Failed to delete application" };
  }
}

export async function getTrackedAnalysesIdsAction() {
  try {
    return await trackerService.getTrackedAnalysesIds();
  } catch (error) {
    console.error("Failed to fetch tracked analysis IDs:", error);
    return [];
  }
}
