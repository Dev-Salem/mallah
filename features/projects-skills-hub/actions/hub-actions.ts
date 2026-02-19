"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addManualSkill(userId: string, skillName: string, level: 'Beginner' | 'Intermediate' | 'Advanced') {
    const supabase = await createClient();

    // 1. Find or create skill
    let { data: skill } = await supabase
        .from("skills")
        .select("id")
        .eq("name", skillName)
        .maybeSingle();

    if (!skill) {
        const { data: newSkill, error: skillError } = await supabase
            .from("skills")
            .insert({ name: skillName, category: 'Technical' })
            .select("id")
            .single();

        if (skillError) throw new Error(skillError.message);
        skill = newSkill;
    }

    // 2. Add to user_skills
    const { error } = await supabase
        .from("user_skills")
        .upsert({
            user_id: userId,
            skill_id: skill.id,
            level,
            source: 'Manual'
        }, {
            onConflict: 'user_id,skill_id'
        });

    if (error) throw new Error(error.message);
    revalidatePath("/dashboard/skills");
    return { success: true };
}

export async function addExternalProject(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const githubUrl = formData.get("githubUrl") as string;

    // 1. Create project
    const { data: project, error: projectError } = await supabase
        .from("projects")
        .insert({
            title,
            description,
            is_external: true,
            source_type: 'UserCustom',
            difficulty_level: 'Beginner'
        })
        .select("id")
        .single();

    if (projectError) throw new Error(projectError.message);

    // 2. Link to user
    const { error } = await supabase
        .from("user_projects")
        .insert({
            user_id: user.id,
            project_id: project.id,
            github_url: githubUrl,
            status: 'Completed'
        });

    if (error) throw new Error(error.message);
    revalidatePath("/dashboard/skills");
    return { success: true };
}
