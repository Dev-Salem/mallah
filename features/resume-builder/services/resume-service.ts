import { createClient } from "../../../lib/supabase/server";
import { ResumeType, SourceJDShape } from "../types";

export async function fetchResumes() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("resumes")
    .select("*")
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
  return data;
}

export async function updateResumeStatus(id: string, atsScore: number | null, status: "not_created" | "in_progress" | "ready") {
  const supabase = await createClient();
  const { error } = await supabase
    .from("resumes")
    .update({ ats_score: atsScore, status, last_updated_at: new Date().toISOString() })
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
  const { error } = await supabase.from("resumes").delete().eq("resume_id", id);
  if (error) throw new Error(error.message);
}
