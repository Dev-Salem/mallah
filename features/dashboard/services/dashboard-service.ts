import { createClient } from "@/lib/supabase/server";
import type { DashboardSummary } from "../types";
import { PATH_DISPLAY_NAMES } from "../types";
import { RoadmapService } from "@/features/roadmap/services/roadmap-service";

/**
 * Fetches and assembles the full dashboard summary for a given user.
 */
export async function getDashboardSummary(
    userId: string
): Promise<DashboardSummary> {
    const supabase = await createClient();

    // ── Fetch learner profile ──
    const { data: learner } = await supabase
        .from("learners")
        .select(
            "first_name, primary_goal, learning_velocity, weekly_hours_category, ai_language_pref, ai_detail_level, current_path_id, portfolio_slug, opportunity_analyses_count"
        )
        .eq("user_id", userId)
        .single();

    if (!learner) {
        throw new Error("Learner profile not found");
    }

    // ── Fetch path info ──
    let pathDisplayName = "Not Selected";
    let pathIsActive = true;

    if (learner.current_path_id) {
        const { data: pathRow } = await supabase
            .from("paths")
            .select("name, is_active")
            .eq("path_id", learner.current_path_id)
            .single();

        if (pathRow) {
            pathDisplayName = pathRow.name || PATH_DISPLAY_NAMES[learner.current_path_id] || "Unknown Path";
            pathIsActive = pathRow.is_active;
        }
    }

    // ── Fetch AI recommendation for onboarding banner ──
    const { data: aiRec } = await supabase
        .from("ai_recommendations")
        .select("confidence_score, reasons, accepted_path_id")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

    // ── Fetch Roadmap ──
    const roadmap = await RoadmapService.getUserRoadmap(userId);

    let stageData = {
        current_stage_id: null as string | null,
        current_stage_title: "Stage 1",
        stage_completion_percent: 0,
        stage_completed_topics: 0,
        stage_total_topics: 0,
    };

    let topicsData = {
        completed_topics: 0,
        total_mandatory_topics: 0,
        next_topic_id: null as string | null,
        next_topic_title: "Your first lesson",
        next_topic_estimated_time_min: null as number | null,
    };

    let projectsCount = 0;
    let completedProjects = 0;
    let pathCompletionPercent = 0;

    let currentStage = null;
    let nextTopic = null;
    let nextProject = null;

    if (roadmap && roadmap.stages.length > 0) {
        // Find the active stage (first unlocked stage that has uncompleted items)
        for (const stg of roadmap.stages) {
            if (!stg.is_unlocked) continue;

            const tComp = stg.topics.filter(t => t.user_status === 'completed').length;
            const pComp = stg.project?.user_status === 'completed' ? 1 : 0;
            const totalStageItems = stg.topics.length + (stg.project ? 1 : 0);

            topicsData.completed_topics += tComp;
            topicsData.total_mandatory_topics += stg.topics.length;

            if (stg.project) {
                projectsCount++;
                if (pComp) completedProjects++;
            }

            // If this stage is not fully completed, it's our current stage
            if ((tComp + pComp) < totalStageItems && !currentStage) {
                currentStage = stg;
                stageData.current_stage_id = stg.stage_id;
                stageData.current_stage_title = stg.title;
                stageData.stage_completed_topics = tComp + pComp;
                stageData.stage_total_topics = totalStageItems;
                stageData.stage_completion_percent = totalStageItems > 0
                    ? Math.round(((tComp + pComp) / totalStageItems) * 100)
                    : 0;

                // Find next topic or project in this stage
                const uncompletedTopic = stg.topics.find(t => t.user_status !== 'completed');
                if (uncompletedTopic) {
                    nextTopic = uncompletedTopic;
                } else if (stg.project && stg.project.user_status !== 'completed') {
                    nextProject = stg.project;
                }
            } else if ((tComp + pComp) === totalStageItems) {
                // If it is fully completed, keep accumulating path progress
            }
        }

        // If all unlocked stages are completed, maybe the whole path is completed or waiting for next lock
        // (Handled by the loop continuing)

        // Path completion
        const totalPathItems = topicsData.total_mandatory_topics + projectsCount;
        const totalCompletedPathItems = topicsData.completed_topics + completedProjects;
        pathCompletionPercent = totalPathItems > 0
            ? Math.round((totalCompletedPathItems / totalPathItems) * 100)
            : 0;

        // Set next topic labels
        if (nextTopic) {
            topicsData.next_topic_id = nextTopic.topic_id;
            topicsData.next_topic_title = nextTopic.title;
            topicsData.next_topic_estimated_time_min = nextTopic.estimated_time_min;
        } else if (nextProject) {
            topicsData.next_topic_id = nextProject.project_id; // Using topic_id slot for routing
            topicsData.next_topic_title = nextProject.title;
        } else {
            topicsData.next_topic_title = "All Caught Up!";
        }
    }

    // ── Compute mission ──
    const mission = computeMission(learner, pathDisplayName, roadmap, nextTopic, nextProject);

    // ── Compute onboarding banner ──
    const showBanner = !!aiRec && pathCompletionPercent === 0;
    const matchReasons: string[] = [];
    if (aiRec?.reasons) {
        const reasons = aiRec.reasons as string[];
        matchReasons.push(...reasons.slice(0, 2));
    }

    // ── Compute opportunity analyzer visibility ──
    const showOpportunityPrompt =
        learner.primary_goal === "job" || learner.primary_goal === "freelance";

    // ── Compute target sessions from weekly_hours_category ──
    const targetSessions = getTargetSessions(learner.weekly_hours_category);

    return {
        learner: {
            first_name: learner.first_name,
            primary_goal: learner.primary_goal,
            ai_language_pref: learner.ai_language_pref,
            ai_detail_level: learner.ai_detail_level,
            learning_velocity: learner.learning_velocity,
            weekly_hours_category: learner.weekly_hours_category,
        },
        path: {
            path_id: learner.current_path_id,
            path_display_name: pathDisplayName,
            is_active: pathIsActive,
            completion_percent: pathCompletionPercent,
        },
        stage: stageData,
        topics: topicsData,
        mission,
        readiness: {
            unlocked_skills_count: Math.floor(topicsData.completed_topics * 1.5), // Mock for now until we join skills
            completed_projects_count: completedProjects,
            available_projects_count: projectsCount - completedProjects,
            resume_status: "not_created",
            ats_score: null,
            portfolio_has_public_items: completedProjects > 0,
            portfolio_slug: learner.portfolio_slug,
        },
        pace: {
            streak_days: 0, // Requires event tracking
            sessions_this_week: 0,
            target_sessions_per_week: targetSessions,
            pace_status: "on_track",
        },
        opportunity_analyzer: {
            show_prompt: showOpportunityPrompt,
            analyses_count: learner.opportunity_analyses_count || 0,
        },
        onboarding_banner: {
            show: showBanner,
            match_score: aiRec?.confidence_score ?? 0,
            match_reasons: matchReasons,
            first_milestone_project_title: roadmap?.stages?.[0]?.project?.title || "Your First Project",
        },
        ai_tip: null,
    };
}

// ── Mission computation ──
function computeMission(
    learner: { current_path_id: string | null },
    pathDisplayName: string,
    roadmap: any,
    nextTopic: any,
    nextProject: any
): DashboardSummary["mission"] {
    if (!learner.current_path_id) {
        return {
            type: "complete_onboarding",
            title: "Let's Finish Setting Up Your Path",
            description: "Answer a few quick questions to get your personalized learning roadmap.",
            cta_label: "Complete Setup",
            cta_target: "/onboarding",
        };
    }

    if (nextProject) {
        return {
            type: "start_available_project",
            title: "Project Milestone Available",
            description: `You are ready for the ${nextProject.title} project. Show what you've learned!`,
            cta_label: "Start Project",
            cta_target: `/dashboard/project/${nextProject.project_id}`,
        };
    }

    if (nextTopic) {
        return {
            type: "continue_learning",
            title: "Continue Your Learning",
            description: `Up next: ${nextTopic.title}. Let's dive back in!`,
            cta_label: "Go to Lesson",
            cta_target: `/dashboard/topic/${nextTopic.topic_id}`,
        };
    }

    // Default: continue_learning
    return {
        type: "continue_learning",
        title: "Continue Your Learning",
        description: `Explore your ${pathDisplayName} roadmap.`,
        cta_label: "Go to Roadmap",
        cta_target: "/dashboard/roadmap",
    };
}

// ── Target sessions from weekly_hours_category ──
function getTargetSessions(category: string | null): number {
    switch (category) {
        case "0-3":
            return 2;
        case "4-7":
            return 3;
        case "8-12":
            return 5;
        case "13+":
            return 7;
        default:
            return 3;
    }
}
