"use server";

import { revalidatePath } from "next/cache";
import {
  fetchResumes,
  createResume,
  upsertResumeSections,
  updateResumeStatus,
  fetchResumeById,
  deleteResume,
  cloneResume,
  updateResumeTypeAndJD,
} from "../services/resume-service";
import { parseJobDescription, improveResumeText } from "../services/ai-service";
import { calculateATSScore, PATH_BASELINES } from "../services/ats-service";
import { createClient } from "@/lib/supabase/server";
import { SourceJDShape, WhatChangedSummary } from "../types";

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

export async function cloneResumeAction(resumeId: string, newTitle: string) {
  const existing = await fetchResumes();
  if (existing.length >= 3) {
    throw new Error("Resume limit reached. Delete a resume to create a new one.");
  }
  const cloned = await cloneResume(resumeId, newTitle);
  revalidatePath("/dashboard/resume-builder");
  return cloned;
}

export async function deleteResumeAction(resumeId: string) {
  await deleteResume(resumeId);
  revalidatePath("/dashboard/resume-builder");
}

/* -------------------------------------------------------------------------- */
/*  Tailor for a Job — Silent clone + AI personalization                       */
/* -------------------------------------------------------------------------- */

export async function tailorForJobAction(
  baseResumeId: string,
  title: string,
  jdText: string
): Promise<{ newResumeId: string; whatChanged: WhatChangedSummary }> {
  // 1. Guard: check resume count
  const existing = await fetchResumes();
  if (existing.length >= 3) {
    throw new Error("Resume limit reached. Delete a resume to create a new one.");
  }

  // 2. Silent clone
  const cloned = await cloneResume(baseResumeId, title);
  const cloneId = cloned.resume_id;

  // 3. Parse JD
  const jdData = await parseJobDescription(jdText);
  const jobTitle = jdData.job_title || "this role";
  const companyName = jdData.company_name || "";
  const requiredSkills = jdData.required_skills || [];
  const preferredSkills = jdData.preferred_skills || [];

  // 4. Fetch clone's sections
  const cloneData = await fetchResumeById(cloneId);
  const sections = cloneData?.resume_sections || [];

  const whatChanged: WhatChangedSummary = {
    summaryRewritten: false,
    bulletsUpdatedCount: 0,
    skillsReordered: false,
    projectsReordered: false,
    partialFailure: false,
    jobTitle: `${jobTitle}${companyName ? " @ " + companyName : ""}`,
  };

  // 5. AI rewrite Summary
  const summarySection = sections.find((s: any) => s.section_type === "SUMMARY");
  if (summarySection?.content?.text) {
    try {
      const improved = await improveResumeText({
        text: summarySection.content.text,
        sectionType: "SUMMARY",
        pathId: "",
        primaryGoal: `Tailoring for: ${jobTitle}. Required: ${requiredSkills.join(", ")}`,
        languagePref: "en",
      });
      summarySection.content.text = improved;
      whatChanged.summaryRewritten = true;
    } catch {
      whatChanged.partialFailure = true;
    }
  }

  // 6. AI rewrite Experience bullets (batch approach)
  const expSection = sections.find((s: any) => s.section_type === "EXPERIENCE");
  if (expSection?.content && Array.isArray(expSection.content)) {
    const allBullets: { entryIdx: number; bulletIdx: number; text: string }[] = [];
    expSection.content.forEach((entry: any, eIdx: number) => {
      if (entry.bullets && Array.isArray(entry.bullets)) {
        entry.bullets.forEach((b: string, bIdx: number) => {
          if (b.trim()) allBullets.push({ entryIdx: eIdx, bulletIdx: bIdx, text: b });
        });
      }
    });

    if (allBullets.length > 0) {
      try {
        const bulletTexts = allBullets.map((b) => b.text);
        const batchPrompt = `These are experience bullets from a resume. Rewrite each to better match a ${jobTitle} role requiring: ${requiredSkills.join(", ")}.

Rules:
1. Use strong action verbs.
2. Highlight achievements relevant to the JD.
3. Preserve original facts — do NOT invent new accomplishments.
4. Return ONLY the rewritten bullets, one per line, in the SAME order.
5. Same count of bullets as input.

Bullets:
${bulletTexts.map((t, i) => `${i + 1}. ${t}`).join("\n")}`;

        const { text: improvedBullets } = await (await import("ai")).generateText({
          model: (await import("@ai-sdk/openai")).openai("gpt-4o"),
          maxRetries: 2,
          system: "You are an expert resume writer. Rewrite the provided resume bullets to be more relevant to the target job. ONLY return the rewritten bullets, numbered, one per line.",
          prompt: batchPrompt,
        });

        const lines = improvedBullets
          .trim()
          .split("\n")
          .map((l) => l.replace(/^\d+\.\s*/, "").trim())
          .filter((l) => l.length > 0);

        let updated = 0;
        allBullets.forEach((b, idx) => {
          if (lines[idx] && lines[idx] !== b.text) {
            expSection.content[b.entryIdx].bullets[b.bulletIdx] = lines[idx];
            updated++;
          }
        });
        whatChanged.bulletsUpdatedCount = updated;
      } catch {
        whatChanged.partialFailure = true;
      }
    }
  }

  // 7. Reorder Skills — required first, then preferred, then unmatched
  const skillsSection = sections.find((s: any) => s.section_type === "SKILLS");
  if (skillsSection?.content?.included_skill_ids) {
    // Skills are stored as IDs — reordering happens at render time using source_jd
    // We mark this as reordered since the JD data will be stored
    whatChanged.skillsReordered = requiredSkills.length > 0;
  }

  // 8. Reorder Projects — most JD-relevant first
  const projectsSection = sections.find((s: any) => s.section_type === "PROJECTS");
  if (projectsSection?.content && Array.isArray(projectsSection.content) && projectsSection.content.length > 1) {
    // Projects reordering also happens at render time based on project_skills overlap
    whatChanged.projectsReordered = requiredSkills.length > 0;
  }

  // 9. Save updated sections
  const updatedSections = sections.map((s: any) => ({
    ...s,
    resume_id: cloneId,
  }));
  await upsertResumeSections(updatedSections);

  // 10. Update resume type to job_based and store source_jd
  const sourceJd: SourceJDShape = {
    job_title: jobTitle,
    company_name: companyName,
    required_skills: requiredSkills,
    preferred_skills: preferredSkills,
    analysis_id: null,
  };
  const finalTitle = title || `${jobTitle}${companyName ? " @ " + companyName : ""}`;
  await updateResumeTypeAndJD(cloneId, finalTitle, sourceJd, "job_based");

  revalidatePath("/dashboard/resume-builder");
  return { newResumeId: cloneId, whatChanged };
}
