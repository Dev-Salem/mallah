import { createClient } from "@/lib/supabase/server";
import type { DashboardSummary } from "../types";
import { PATH_DISPLAY_NAMES } from "../types";

/**
 * Fetches and assembles the full dashboard summary for a given user.
 * Phase 1: Only sections using learners/paths/ai_recommendations are populated.
 * All other sections return safe defaults.
 */
export async function getDashboardSummary(
    userId: string
): Promise<DashboardSummary> {
    const supabase = await createClient();

    // ── Fetch learner profile ──
    const { data: learner } = await supabase
        .from("learners")
        .select(
            "first_name, primary_goal, learning_velocity, weekly_hours_category, ai_language_pref, ai_detail_level, current_path_id, portfolio_slug"
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

    // ── Compute mission (Phase 1: limited rules) ──
    const mission = computeMission(learner, pathDisplayName);

    // ── Compute onboarding banner ──
    const showBanner = !!aiRec && !aiRec.accepted_path_id;
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
            completion_percent: 0, // Phase 2
        },
        stage: {
            current_stage_id: null, // Phase 2
            current_stage_title: "Stage 1", // Placeholder
            stage_completion_percent: 0,
            stage_completed_topics: 0,
            stage_total_topics: 0,
        },
        topics: {
            completed_topics: 0, // Phase 2
            total_mandatory_topics: 0,
            next_topic_id: null,
            next_topic_title: "Your first lesson",
            next_topic_estimated_time_min: null,
        },
        mission,
        readiness: {
            unlocked_skills_count: 0, // Phase 2
            completed_projects_count: 0,
            available_projects_count: 0,
            resume_status: "not_created",
            ats_score: null,
            portfolio_has_public_items: false,
            portfolio_slug: learner.portfolio_slug,
        },
        pace: {
            streak_days: 0, // Phase 2
            sessions_this_week: 0,
            target_sessions_per_week: targetSessions,
            pace_status: "on_track",
        },
        opportunity_analyzer: {
            show_prompt: showOpportunityPrompt,
            analyses_count: 0, // Phase 2
        },
        onboarding_banner: {
            show: showBanner,
            match_score: aiRec?.confidence_score ?? 0,
            match_reasons: matchReasons,
            first_milestone_project_title: "Your First Project", // Phase 2: from projects table
        },
        ai_tip: null, // Phase 2
    };
}

// ── Mission computation (Phase 1: limited rules) ──
function computeMission(
    learner: { current_path_id: string | null },
    pathDisplayName: string
): DashboardSummary["mission"] {
    // Phase 1: only two mission types are computable
    if (!learner.current_path_id) {
        return {
            type: "complete_onboarding",
            title: "Let's Finish Setting Up Your Path",
            description:
                "Answer a few quick questions to get your personalized learning roadmap.",
            cta_label: "Complete Setup",
            cta_target: "/onboarding",
        };
    }

    // Default: continue_learning
    return {
        type: "continue_learning",
        title: "Continue Your Learning",
        description: `Start exploring your ${pathDisplayName} roadmap and begin your first lesson.`,
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
