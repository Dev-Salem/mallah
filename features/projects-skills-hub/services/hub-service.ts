"use server";

import { createClient } from "@/lib/supabase/server";

export async function getHubData(userId: string) {
    const supabase = await createClient();

    // 1. Fetch User Skills and Projects in parallel
    const [userSkillsRes, userProjectsRes] = await Promise.all([
        supabase
            .from("user_skills")
            .select(`
                *,
                skills (*)
            `)
            .eq("user_id", userId),
        supabase
            .from("user_projects")
            .select(`
                *,
                projects (*)
            `)
            .eq("user_id", userId)
    ]);

    const { data: userSkills } = userSkillsRes;
    const { data: userProjects } = userProjectsRes;

    return {
        skills: userSkills || [],
        projects: userProjects || []
    };
}
