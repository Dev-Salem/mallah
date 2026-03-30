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

export async function createGeneralResumeAction(title: string) {
  const resume = await createResume(title, "general");
  revalidatePath("/resume-builder");
  return resume;
}

export async function createJobBasedResumeAction(
  jdText: string,
  title: string
) {
  const jdData = await parseJobDescription(jdText);
  const resume = await createResume(title, "job_based", jdData as any);

  const allResumes = await fetchResumes();
  const generalResumes = allResumes.filter(
    (r: any) => r.resume_type === "general"
  );
  if (generalResumes.length > 0) {
    const latestGeneral = generalResumes[0];
    const baseResumeData = await fetchResumeById(latestGeneral.resume_id);

    if (baseResumeData?.resume_sections) {
      const newSections = baseResumeData.resume_sections.map((s: any) => {
        const { section_id, ...rest } = s;
        return {
          ...rest,
          resume_id: resume.resume_id,
        };
      });

      await upsertResumeSections(newSections);
    }
  }

  revalidatePath("/resume-builder");
  return resume;
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
