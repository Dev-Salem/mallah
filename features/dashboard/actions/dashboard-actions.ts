"use server";

import { createClient } from "@/lib/supabase/server";

export async function getDashboardData() {
    const supabase = await createClient();

    // 1. Get current user session (Required baseline)
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return { error: "Not authenticated" };

    // 2. Get learner profile (Required for path-specific queries)
    const { data: learner, error: learnerError } = await supabase
        .from("learners")
        .select("*, paths(*)")
        .eq("user_id", user.id)
        .single();

    if (learnerError || !learner) {
        return { error: "Learner profile not found" };
    }

    const userId = user.id;
    const pathId = learner.current_path_id;

    // 3. Execute all independent data queries in parallel
    const [
        completedTopicsRes,
        skillsCountRes,
        projectsCountRes,
        resumeRes,
        totalTopicsRes,
        nextTopicRes
    ] = await Promise.all([
        // Count completed topics
        supabase
            .from("user_progress")
            .select("*", { count: 'exact', head: true })
            .eq("user_id", userId)
            .eq("status", "Completed"),

        // Count skills
        supabase
            .from("user_skills")
            .select("*", { count: 'exact', head: true })
            .eq("user_id", userId),

        // Count completed projects
        supabase
            .from("user_projects")
            .select("*", { count: 'exact', head: true })
            .eq("user_id", userId)
            .eq("status", "Completed"),

        // Latest resume
        supabase
            .from("resumes")
            .select("ats_score, last_updated_at")
            .eq("user_id", userId)
            .order('last_updated_at', { ascending: false })
            .limit(1)
            .maybeSingle(),

        // Total topics in path (Single joined query)
        pathId
            ? supabase
                .from("topics")
                .select("id, stages!inner(path_id)", { count: 'exact', head: true })
                .eq("stages.path_id", pathId)
            : Promise.resolve({ count: 0 }),

        // Next Topic candidates + Progress
        pathId
            ? Promise.all([
                supabase
                    .from("topics")
                    .select("id, title, stage_id, stages!inner(title, order_index)")
                    .eq("stages.path_id", pathId)
                    .order('stages(order_index)', { ascending: true })
                    .order('order_index', { ascending: true }),
                supabase
                    .from("user_progress")
                    .select("topic_id")
                    .eq("user_id", userId)
                    .eq("status", "Completed")
            ])
            : Promise.resolve([null, null])
    ]);

    // 4. Process Results
    const completedTopics = completedTopicsRes.count || 0;
    const skillsCount = skillsCountRes.count || 0;
    const projectsCount = projectsCountRes.count || 0;
    const resume = resumeRes.data;
    const totalTopics = totalTopicsRes.count || 0;
    const percent = totalTopics > 0 ? Math.round((completedTopics) / totalTopics * 100) : 0;

    // Find next topic from parallel results
    let nextTopic = null;
    if (pathId && nextTopicRes) {
        const [topicsData, progressData] = nextTopicRes as [any, any];
        const topics = topicsData?.data;
        const completedProgress = progressData?.data;

        if (topics) {
            const completedIds = new Set(completedProgress?.map((p: any) => p.topic_id) || []);
            nextTopic = topics.find((t: any) => !completedIds.has(t.id)) || null;
        }
    }

    // 5. Generate Dynamic AI Tip (Rule-based v1)
    let aiTipKey = 'aiTipDefault';
    if (percent === 0) {
        aiTipKey = 'aiTipStart';
    } else if (percent > 20 && projectsCount === 0) {
        aiTipKey = 'aiTipProjectEncourage';
    } else if (percent === 100) {
        aiTipKey = 'aiTipComplete';
    } else if (percent > 80) {
        aiTipKey = 'aiTipAlmostThere';
    }

    return {
        profile: learner,
        stats: {
            percent,
            completedLessons: completedTopics,
            totalLessons: totalTopics,
            skillsCount: skillsCount,
            projectsCount: projectsCount,
            resumeStatus: !resume ? 'NotCreated' : (resume.ats_score ? 'Scored' : 'Draft'),
            atsScore: resume?.ats_score || null,
        },
        nextTopic,
        aiTipKey
    };
}

