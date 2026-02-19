
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { ResumeSection, ResumeSectionType } from "../types";

async function getAuthenticatedUserId(): Promise<string> {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");
    return user.id;
}

export async function createResume(title: string, language: 'AR' | 'EN' = 'EN') {
    const userId = await getAuthenticatedUserId();
    const supabase = await createClient();

    const { data: resume, error } = await supabase
        .from("resumes")
        .insert({
            user_id: userId,
            title,
            language,
            last_updated_at: new Date().toISOString()
        })
        .select()
        .single();

    if (error) throw new Error(error.message);

    // Initialize with default sections
    const defaultSections: Partial<ResumeSection>[] = [
        { resume_id: resume.id, section_type: 'SUMMARY', sort_order: 1, section_content: '' },
        { resume_id: resume.id, section_type: 'SKILLS', sort_order: 2, section_content: '[]' },
        { resume_id: resume.id, section_type: 'PROJECTS', sort_order: 3, section_content: '[]' },
        { resume_id: resume.id, section_type: 'EXPERIENCE', sort_order: 4, section_content: '[]' },
        { resume_id: resume.id, section_type: 'EDUCATION', sort_order: 5, section_content: '[]' }
    ];

    const { error: sectionsError } = await supabase
        .from("resume_sections")
        .insert(defaultSections);

    if (sectionsError) throw new Error(sectionsError.message);

    revalidatePath("/dashboard/resume");
    return resume;
}

export async function updateResumeSection(sectionId: string, content: string, header?: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("resume_sections")
        .update({
            section_content: content,
            header: header || null
        })
        .eq("id", sectionId);

    if (error) throw new Error(error.message);

    // Update the resume's timestamp too
    const { data: section } = await supabase.from("resume_sections").select("resume_id").eq("id", sectionId).single();
    if (section) {
        await supabase
            .from("resumes")
            .update({ last_updated_at: new Date().toISOString() })
            .eq("id", section.resume_id);
    }

    revalidatePath("/dashboard/resume");
}

export async function updateAtsScore(resumeId: string, score: number) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("resumes")
        .update({ ats_score: score })
        .eq("id", resumeId);

    if (error) throw new Error(error.message);
    revalidatePath("/dashboard/resume");
}
