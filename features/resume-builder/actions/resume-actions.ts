"use server";

import { revalidatePath } from "next/cache";
import {
  fetchResumes,
  createResume,
  upsertResumeSections,
  updateResumeStatus,
  fetchResumeById,
  deleteResume,
} from "../services/resume-service";
import { parseJobDescription, improveResumeText } from "../services/ai-service";
import { calculateATSScore, PATH_BASELINES } from "../services/ats-service";
import { createClient } from "@/lib/supabase/server";
import { SourceJDShape } from "../types";

/* -------------------------------------------------------------------------- */
/*  Helper – get learner's current path                                       */
/* -------------------------------------------------------------------------- */

async function getLearnerPathId(): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return "frontend";

  const { data } = await supabase
    .from("learners")
    .select("current_path_id")
    .eq("user_id", user.id)
    .single();

  return data?.current_path_id || "frontend";
}

/* -------------------------------------------------------------------------- */
/*  Actions                                                                   */
/* -------------------------------------------------------------------------- */

import { updateResumeTypeAndJD, cloneResume } from "../services/resume-service";

export async function createGeneralResumeAction(title: string) {
  const resume = await createResume(title, "general");
  revalidatePath("/resume-builder");
  return resume;
}

export async function cloneResumeAction(baseResumeId: string, cloneTitle: string) {
  const cloned = await cloneResume(baseResumeId, cloneTitle);
  revalidatePath("/resume-builder");
  return cloned;
}

export async function personalizeResumeAction(
  resumeId: string,
  title: string,
  jdText: string
) {
  // 1. Parse JD and extract required/preferred skills
  const jdData = await parseJobDescription(jdText);
  // jdData conceptually returns { job_title, company_name, required_skills, preferred_skills, analysis_id }

  // 2. Fetch the base resume's current sections
  const baseResumeData = await fetchResumeById(resumeId);
  const sections = baseResumeData?.resume_sections || [];

  const summarySection = sections.find((s: any) => s.section_type === "SUMMARY");
  const experienceSection = sections.find((s: any) => s.section_type === "EXPERIENCE");

  // 3. AI Rewrite Summary & Experience (in a real app, this would be blocking or handled optimistically)
  // For the sake of the v1 spec, we run the AI rewrite for core blocks here:
  let updatedSummaryText = summarySection?.content?.text || "";
  if (updatedSummaryText) {
    try {
      updatedSummaryText = await improveResumeText({
        text: updatedSummaryText,
        sectionType: "SUMMARY",
        pathId: "", // Will use JD keywords to bias it
        primaryGoal: "",
        languagePref: "en",
      });
    } catch {
      // fallback to original if AI fails
    }
  }

  // 4. Update the sections payload
  const updatedSections = [...sections];
  const summaryIdx = updatedSections.findIndex((s: any) => s.section_type === "SUMMARY");
  if (summaryIdx !== -1) {
    updatedSections[summaryIdx].content.text = updatedSummaryText;
  }
  
  // Note: We leave skill/project reordering to the frontend component rendering logic 
  // utilizing the `source_jd.required_skills` rather than mutating the array order in the DB.
  
  await upsertResumeSections(updatedSections);

  // 5. Update resume type to job_based and store the source_jd
  await updateResumeTypeAndJD(resumeId, title, jdData as SourceJDShape, "job_based");

  revalidatePath(`/resume-builder/${resumeId}`);
  return { success: true };
}

export async function saveResumeAction(resumeId: string, sections: any[]) {
  const payload = sections.map((s) => ({ ...s, resume_id: resumeId }));
  await upsertResumeSections(payload);

  const pathId = await getLearnerPathId();
  const targetKeywords = PATH_BASELINES[pathId] || [];
  const atsResult = calculateATSScore(payload, targetKeywords);

  // Status transition per spec:
  // "ready" requires: Summary non-empty AND ≥1 skill AND ATS ≥ 50
  let newStatus: "not_created" | "in_progress" | "ready" = "in_progress";

  const summarySection = sections.find(
    (s) => s.section_type === "SUMMARY"
  );
  const summaryText = (summarySection?.content?.text || "").trim();
  const hasSummary = summaryText.length > 0;

  const skillsSection = sections.find(
    (s) => s.section_type === "SKILLS"
  );
  const hasSkills =
    (skillsSection?.content?.included_skill_ids?.length || 0) > 0 ||
    (skillsSection?.content?.manual_skills?.length || 0) > 0;

  if (hasSummary && hasSkills && atsResult.score >= 50) {
    newStatus = "ready";
  }

  await updateResumeStatus(resumeId, atsResult.score, newStatus);
  revalidatePath(`/resume-builder/${resumeId}`);
  return atsResult;
}

export async function aiImproveAction(
  text: string,
  sectionType: string,
  pathId: string,
  primaryGoal: string
) {
  return await improveResumeText({
    text,
    sectionType,
    pathId,
    primaryGoal,
    languagePref: "en",
  });
}

export async function deleteResumeAction(resumeId: string) {
  await deleteResume(resumeId);
  revalidatePath("/dashboard/resume-builder");
}
