
import { createClient } from "@/lib/supabase/server";
import { ResumeWithSections, Resume } from "../types";

export async function getUserResumes(userId: string): Promise<Resume[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("resumes")
        .select("*")
        .eq("user_id", userId)
        .order("last_updated_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
}

export async function getResumeDetail(resumeId: string): Promise<ResumeWithSections | null> {
    const supabase = await createClient();

    const { data: resume, error: resumeError } = await supabase
        .from("resumes")
        .select("*")
        .eq("id", resumeId)
        .single();

    if (resumeError || !resume) return null;

    const { data: sections, error: sectionsError } = await supabase
        .from("resume_sections")
        .select("*")
        .eq("resume_id", resumeId)
        .order("sort_order", { ascending: true });

    if (sectionsError) throw new Error(sectionsError.message);

    return {
        ...resume,
        sections: sections || []
    };
}

export async function getSkillsForResume(userId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("user_skills")
        .select("*, skills(*)")
        .eq("user_id", userId);

    if (error) throw new Error(error.message);
    return data || [];
}

export async function getProjectsForResume(userId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("user_projects")
        .select("*, projects(*)")
        .eq("user_id", userId)
        .eq("status", "Completed");

    if (error) throw new Error(error.message);
    return data || [];
}
