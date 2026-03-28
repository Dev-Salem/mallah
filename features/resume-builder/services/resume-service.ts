"use server";

import { createClient } from "../../../lib/supabase/server";
import { ResumeType, SourceJDShape } from "../types";

/* -------------------------------------------------------------------------- */
/*  Section defaults                                                          */
/* -------------------------------------------------------------------------- */

const DEFAULT_SECTION_TYPES = [
  "PERSONAL_INFO",
  "SUMMARY",
  "SKILLS",
  "PROJECTS",
  "EXPERIENCE",
  "EDUCATION",
  "CERTIFICATIONS",
] as const;

function defaultContent(type: string): any {
  switch (type) {
    case "PERSONAL_INFO":
      return { phone: "", location: "", linkedin: "", github: "", portfolio: "" };
    case "SUMMARY":
      return { text: "" };
    case "SKILLS":
      return { included_skill_ids: [], manual_skills: [] };
    case "PROJECTS":
      return [];
    case "EXPERIENCE":
      return [];
    case "EDUCATION":
      return [];
    case "CERTIFICATIONS":
      return [];
    default:
      return {};
  }
}

/* -------------------------------------------------------------------------- */
/*  Queries                                                                   */
/* -------------------------------------------------------------------------- */

export async function fetchResumes() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("resumes")
    .select("*")
    .eq("user_id", user?.id ?? "")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("fetchResumes error:", error);
    return [];
  }
  return data;
}

export async function fetchResumeById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("resumes")
    .select("*, resume_sections(*)")
    .eq("resume_id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export async function createResume(
  title: string,
  resumeType: ResumeType = "general",
  sourceJd: SourceJDShape | null = null
) {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) throw new Error("Unauthorized");

  // 1. Create resume row
  const { data, error } = await supabase
    .from("resumes")
    .insert({
      user_id: userData.user.id,
      title,
      resume_type: resumeType,
      source_jd: sourceJd,
      status: "in_progress",
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  // 2. Auto-create 7 resume_sections with defaults
  const sectionRows = DEFAULT_SECTION_TYPES.map((type, idx) => ({
    resume_id: data.resume_id,
    section_type: type,
    content: defaultContent(type),
    is_visible: true,
    sort_order: idx,
  }));

  const { error: secError } = await supabase
    .from("resume_sections")
    .insert(sectionRows);

  if (secError) {
    console.error("Auto-create sections error:", secError);
    // Don't throw — resume was already created; sections can be created later
  }

  return data;
}

/* -------------------------------------------------------------------------- */
/*  Fetch user skills for resume (checkbox grid)                              */
/* -------------------------------------------------------------------------- */

export async function fetchUserSkillsForResume(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_skills")
    .select("skill_id, level, skills(skill_id, name, category)")
    .eq("user_id", userId);

  if (error) {
    console.error("fetchUserSkillsForResume error:", error);
    return [];
  }
  return data || [];
}

/* -------------------------------------------------------------------------- */
/*  Mutations                                                                 */
/* -------------------------------------------------------------------------- */

export async function updateResumeStatus(
  id: string,
  atsScore: number | null,
  status: "not_created" | "in_progress" | "ready"
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("resumes")
    .update({
      ats_score: atsScore,
      status,
      last_updated_at: new Date().toISOString(),
    })
    .eq("resume_id", id);

  if (error) throw new Error(error.message);
}

export async function upsertResumeSections(sections: any[]) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("resume_sections")
    .upsert(sections, { onConflict: "section_id" });

  if (error) throw new Error(error.message);
}

export async function deleteResume(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("resumes")
    .delete()
    .eq("resume_id", id);
  if (error) throw new Error(error.message);
}
