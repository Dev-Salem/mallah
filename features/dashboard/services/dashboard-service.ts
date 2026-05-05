import { createClient } from "@/lib/supabase/server";
import type { DashboardSummary, DashboardMission, RecentActivityItem } from "../types";
import { PATH_DISPLAY_NAMES } from "../types";
import { RoadmapService } from "@/features/roadmap/services/roadmap-service";

/**
 * Fetches and assembles the full dashboard summary for a given user.
 * Implements v3 spec (dashboard.md) — mission priority, real data queries.
 */
export async function getDashboardSummary(
    userId: string
): Promise<DashboardSummary> {
    const supabase = await createClient();

    // ── Fetch learner profile ──
    const { data: learner } = await supabase
        .from("learners")
        .select(
            "first_name, primary_goal, learning_velocity, weekly_hours_category, ai_language_pref, ai_detail_level, current_path_id"
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
        .select("plan_2_weeks, first_milestone")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

    // ── Fetch Roadmap ──
    const roadmap = await RoadmapService.getUserRoadmap(userId);

    let stageData = {
        current_stage_id: null as string | null,
        current_stage_title: "Stage 1",
        current_stage_number: 1,
        total_stages: 0,
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
        next_topic_estimated_time_text: null as string | null,
        remaining_topics_in_stage: 0,
    };

    let projectsCount = 0;
    let completedProjects = 0;
    let availableProjects = 0;
    let pathCompletionPercent = 0;

    let currentStage: any = null;
    let currentStageIndex = 0;
    let nextTopic: any = null;
    let nextProject: any = null;
    let hasPassedStage1 = false;

    if (roadmap && roadmap.stages.length > 0) {
        stageData.total_stages = roadmap.stages.length;

        for (let i = 0; i < roadmap.stages.length; i++) {
            const stg = roadmap.stages[i];
            if (!stg.is_unlocked) continue;

            const tComp = stg.topics.filter(t => t.user_status === 'completed').length;
            const pComp = (stg.project?.user_status === 'completed' || 
                           stg.project?.user_status === 'waiting' || 
                           stg.project?.user_status === 'skipped') ? 1 : 0;
            const totalStageItems = stg.topics.length + (stg.project ? 1 : 0);

            topicsData.completed_topics += tComp;
            topicsData.total_mandatory_topics += stg.topics.length;

            if (stg.project) {
                projectsCount++;
                if (stg.project.user_status === 'completed') completedProjects++;
                if (stg.project.user_status === 'available') availableProjects++;
            }

            // Track if stage 1 is completed (for StartFirstProject mission)
            const isStageDone = (tComp + pComp) >= totalStageItems;
            if (i === 0 && isStageDone) {
                hasPassedStage1 = true;
            }

            // First incomplete stage = current stage
            if (!isStageDone && !currentStage) {
                currentStage = stg;
                currentStageIndex = i;
                stageData.current_stage_id = stg.stage_id;
                stageData.current_stage_title = stg.title;
                stageData.current_stage_number = i + 1;
                stageData.stage_completed_topics = tComp + pComp;
                stageData.stage_total_topics = totalStageItems;
                stageData.stage_completion_percent = totalStageItems > 0
                    ? Math.round(((tComp + pComp) / totalStageItems) * 100)
                    : 0;
                topicsData.remaining_topics_in_stage = totalStageItems - (tComp + pComp);

                // Find next uncompleted topic
                const uncompletedTopic = stg.topics.find(t => t.user_status !== 'completed');
                if (uncompletedTopic) {
                    nextTopic = uncompletedTopic;
                } else if (stg.project && !pComp) {
                    nextProject = stg.project;
                }
            }
        }

        // Also count topics from locked stages for total
        for (const stg of roadmap.stages) {
            if (stg.is_unlocked) continue;
            topicsData.total_mandatory_topics += stg.topics.length;
            if (stg.project) projectsCount++;
        }

        // Path completion
        const totalPathItems = topicsData.total_mandatory_topics + projectsCount;
        const totalCompletedPathItems = topicsData.completed_topics + completedProjects;
        pathCompletionPercent = totalPathItems > 0
            ? Math.round((totalCompletedPathItems / totalPathItems) * 100)
            : 0;

        if (nextTopic) {
            topicsData.next_topic_id = nextTopic.topic_id;
            topicsData.next_topic_title = nextTopic.title;
            topicsData.next_topic_estimated_time_min = nextTopic.estimated_time_min;
            topicsData.next_topic_estimated_time_text = nextTopic.estimated_time_text;
        } else if (nextProject) {
            topicsData.next_topic_id = nextProject.project_id;
            topicsData.next_topic_title = nextProject.title;
        } else {
            topicsData.next_topic_title = "All Caught Up!";
        }
    }

    // ── Fetch real skill counts from user_skills ──
    const { count: totalSkills } = await supabase
        .from("user_skills")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);

    const { count: roadmapSkills } = await supabase
        .from("user_skills")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .in("source", ["roadmap", "project"]);

    const { count: manualSkills } = await supabase
        .from("user_skills")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("source", "manual");

    // ── Fetch aggregate resume data ──
    const { data: userResumes } = await supabase
        .from('resumes')
        .select('status, ats_score, last_updated_at')
        .eq('user_id', userId);

    let aggResumeStatus: "not_created" | "in_progress" | "ready" = "not_created";
    let aggAtsScore: number | null = null;
    let aggResumeDaysAgo: number | null = null;

    if (userResumes && userResumes.length > 0) {
        if (userResumes.some((r: any) => r.status === 'ready')) {
            aggResumeStatus = 'ready';
        } else if (userResumes.some((r: any) => r.status === 'in_progress')) {
            aggResumeStatus = 'in_progress';
        }

        const scores = userResumes.map((r: any) => r.ats_score).filter((s): s is number => s !== null);
        if (scores.length > 0) {
            aggAtsScore = Math.max(...scores);
        }

        const timestamps = userResumes.map((r: any) => new Date(r.last_updated_at).getTime()).filter(t => !isNaN(t));
        if (timestamps.length > 0) {
            const mostRecentMs = Math.max(...timestamps);
            aggResumeDaysAgo = Math.floor((new Date().getTime() - mostRecentMs) / (1000 * 60 * 60 * 24));
        }
    }

    // ── Compute pace & streak from user_progress.last_accessed_at ──
    const paceData = await computePaceData(userId, learner.weekly_hours_category);

    // ── Compute mission (6-priority chain) ──
    const mission = computeMission(
        learner,
        pathDisplayName,
        roadmap,
        nextTopic,
        nextProject,
        pathCompletionPercent,
        completedProjects,
        hasPassedStage1,
        stageData,
        topicsData,
        paceData.daysSinceLastActive
    );

    // ── Compute onboarding banner ──
    const showBanner = topicsData.completed_topics === 0 && !!aiRec;
    const plan2Weeks: string[] = [];
    if (aiRec?.plan_2_weeks) {
        const plan = aiRec.plan_2_weeks as string[];
        plan2Weeks.push(...plan);
    }

    // ── Compute target sessions ──
    const targetSessions = getTargetSessions(learner.weekly_hours_category);

    // ── Build AI tip (rule-based fallback) ──
    const aiTip = buildAiTip(stageData, topicsData, pathCompletionPercent);

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
            unlocked_skills_count: totalSkills ?? 0,
            roadmap_skills_count: roadmapSkills ?? 0,
            manual_skills_count: manualSkills ?? 0,
            completed_projects_count: completedProjects,
            available_projects_count: availableProjects,
            resume_status: aggResumeStatus,
            resume_last_updated_days_ago: aggResumeDaysAgo,
            ats_score: aggAtsScore,
        },
        pace: {
            streak_days: paceData.streakDays,
            sessions_this_week: paceData.sessionsThisWeek,
            target_sessions_per_week: targetSessions,
            pace_status: computePaceStatus(paceData.sessionsThisWeek, targetSessions),
            active_days_this_week: paceData.activeDaysThisWeek,
        },
        onboarding_banner: {
            show: showBanner,
            plan_2_weeks: plan2Weeks,
            first_milestone: aiRec?.first_milestone ?? "Your First Project",
        },
        ai_tip: aiTip,
    };
}

/**
 * Fetches recent activity items for the dashboard.
 */
export async function getRecentActivity(userId: string): Promise<RecentActivityItem[]> {
    const supabase = await createClient();
    const items: RecentActivityItem[] = [];

    // Completed topics
    const { data: topicActivity } = await supabase
        .from("user_progress")
        .select("completed_at, topic_id, topics(title)")
        .eq("user_id", userId)
        .eq("status", "completed")
        .not("completed_at", "is", null)
        .order("completed_at", { ascending: false })
        .limit(5);

    if (topicActivity) {
        for (const row of topicActivity) {
            const topicTitle = (row as any).topics?.title || "a topic";
            items.push({
                type: "topic_completed",
                title: `Completed: ${topicTitle}`,
                timestamp: row.completed_at!,
            });
        }
    }

    // Completed projects
    const { data: projectActivity } = await supabase
        .from("user_projects")
        .select("completed_at, project_id, projects(title)")
        .eq("user_id", userId)
        .eq("status", "completed")
        .not("completed_at", "is", null)
        .order("completed_at", { ascending: false })
        .limit(5);

    if (projectActivity) {
        for (const row of projectActivity) {
            const projectTitle = (row as any).projects?.title || "a project";
            items.push({
                type: "project_completed",
                title: `Completed project: ${projectTitle}`,
                timestamp: row.completed_at!,
            });
        }
    }

    // Updated resume
    const { data: resumeActivity } = await supabase
        .from("resumes")
        .select("last_updated_at")
        .eq("user_id", userId)
        .order("last_updated_at", { ascending: false })
        .limit(1);

    if (resumeActivity && resumeActivity.length > 0 && resumeActivity[0].last_updated_at) {
        items.push({
            type: "resume_updated",
            title: "Updated resume",
            timestamp: resumeActivity[0].last_updated_at,
        });
    }

    // Sort by timestamp descending, take top 5
    items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return items.slice(0, 5);
}

// ── Mission computation (6-priority chain per spec §7.1) ──
function computeMission(
    learner: { current_path_id: string | null },
    pathDisplayName: string,
    roadmap: any,
    nextTopic: any,
    nextProject: any,
    pathCompletionPercent: number,
    completedProjects: number,
    hasPassedStage1: boolean,
    stageData: DashboardSummary["stage"],
    topicsData: DashboardSummary["topics"],
    daysSinceLastActive: number | null
): DashboardMission {
    // Priority 1: Onboarding not completed (safety — page.tsx already redirects)
    if (!learner.current_path_id) {
        return {
            type: "CompleteOnboarding",
            title: "Let's Finish Setting Up Your Path",
            description: "Answer a few quick questions to get your personalized learning roadmap.",
            cta_label: "Complete Setup",
            cta_target: "/onboarding",
            context_line: null,
        };
    }

    // Priority 2: Path fully completed
    if (pathCompletionPercent >= 100) {
        return {
            type: "ChooseNewPath",
            title: "You've Completed Your Path — What's Next?",
            description: "Explore a new path to keep growing.",
            cta_label: "Explore Paths",
            cta_target: "/dashboard/roadmap",
            context_line: null,
        };
    }

    // Priority 3: 0 projects completed AND learner has passed Stage 1
    if (completedProjects === 0 && hasPassedStage1) {
        return {
            type: "StartFirstProject",
            title: "Time to Build Something Real",
            description: "You've learned the theory. Projects are what make your skills visible to employers and clients.",
            cta_label: "Start Your First Project",
            cta_target: "/dashboard/skills",
            context_line: null,
        };
    }

    // Priority 4: Inactive for ≥ 7 days
    if (daysSinceLastActive !== null && daysSinceLastActive >= 7 && nextTopic) {
        const timeNote = nextTopic.estimated_time_text
            ? ` It only takes ${nextTopic.estimated_time_text}.`
            : nextTopic.estimated_time_min
                ? ` It only takes ${nextTopic.estimated_time_min} minutes.`
                : "";
        return {
            type: "GetBackOnTrack",
            title: "Ready to Pick Up Where You Left Off?",
            description: `You were working on ${nextTopic.title}.${timeNote}`,
            cta_label: "Resume Learning",
            cta_target: `/dashboard/topic/${nextTopic.topic_id}`,
            context_line: `Last active: ${daysSinceLastActive} days ago`,
        };
    }

    // Priority 5: Current stage ≥ 80% complete
    if (stageData.stage_completion_percent >= 80 && nextTopic) {
        const nextStageTitle = roadmap?.stages?.[stageData.current_stage_number]?.title || "the next stage";
        return {
            type: "FinishStage",
            title: `Finish Stage ${stageData.current_stage_number} — You're Almost There`,
            description: `Complete ${nextTopic.title} to unlock ${nextStageTitle}.`,
            cta_label: "Complete the Stage",
            cta_target: `/dashboard/topic/${nextTopic.topic_id}`,
            context_line: `${topicsData.remaining_topics_in_stage} topic(s) left in this stage`,
        };
    }

    // Priority 6: Default — ContinueLearning
    if (nextProject) {
        return {
            type: "ContinueLearning",
            title: "Project Milestone Available",
            description: `You are ready for the ${nextProject.title} project. Show what you've learned!`,
            cta_label: "Start Project",
            cta_target: `/dashboard/project/${nextProject.project_id}`,
            context_line: `Stage ${stageData.current_stage_number} · ${topicsData.remaining_topics_in_stage} topics remaining`,
        };
    }

    if (nextTopic) {
        return {
            type: "ContinueLearning",
            title: "Continue Your Learning",
            description: `Next up: ${nextTopic.title} in ${stageData.current_stage_title}`,
            cta_label: "Continue",
            cta_target: `/dashboard/topic/${nextTopic.topic_id}`,
            context_line: `Stage ${stageData.current_stage_number} · ${topicsData.remaining_topics_in_stage} topics remaining`,
        };
    }

    // Fallback
    return {
        type: "ContinueLearning",
        title: "Continue Your Learning",
        description: `Explore your ${pathDisplayName} roadmap.`,
        cta_label: "Go to Roadmap",
        cta_target: "/dashboard/roadmap",
        context_line: null,
    };
}

// ── Pace data computation from user_progress.last_accessed_at ──
interface PaceResult {
    streakDays: number;
    sessionsThisWeek: number;
    activeDaysThisWeek: number[];
    daysSinceLastActive: number | null;
}

async function computePaceData(userId: string, weeklyHoursCategory: string | null): Promise<PaceResult> {
    const supabase = await createClient();

    // Get all distinct dates where user had activity (last_accessed_at)
    const { data: progressRows } = await supabase
        .from("user_progress")
        .select("last_accessed_at")
        .eq("user_id", userId)
        .not("last_accessed_at", "is", null)
        .order("last_accessed_at", { ascending: false });

    if (!progressRows || progressRows.length === 0) {
        return { streakDays: 0, sessionsThisWeek: 0, activeDaysThisWeek: [], daysSinceLastActive: null };
    }

    // Build set of unique active dates (YYYY-MM-DD)
    const activeDateSet = new Set<string>();
    for (const row of progressRows) {
        if (row.last_accessed_at) {
            const d = new Date(row.last_accessed_at);
            activeDateSet.add(d.toISOString().split("T")[0]);
        }
    }

    const sortedDates = Array.from(activeDateSet).sort().reverse();
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    // Days since last active
    const lastActiveDate = sortedDates[0];
    const daysSinceLastActive = lastActiveDate
        ? Math.floor((today.getTime() - new Date(lastActiveDate).getTime()) / (1000 * 60 * 60 * 24))
        : null;

    // Streak: consecutive days counting back from today (or yesterday)
    let streakDays = 0;
    const checkDate = new Date(today);
    // If not active today, check if active yesterday to start the streak
    if (!activeDateSet.has(todayStr)) {
        checkDate.setDate(checkDate.getDate() - 1);
        if (!activeDateSet.has(checkDate.toISOString().split("T")[0])) {
            // No activity today or yesterday — streak is 0
            streakDays = 0;
        } else {
            // Start counting from yesterday
            while (activeDateSet.has(checkDate.toISOString().split("T")[0])) {
                streakDays++;
                checkDate.setDate(checkDate.getDate() - 1);
            }
        }
    } else {
        // Active today — count backwards
        while (activeDateSet.has(checkDate.toISOString().split("T")[0])) {
            streakDays++;
            checkDate.setDate(checkDate.getDate() - 1);
        }
    }

    // This week's sessions (Mon=0 ... Sun=6)
    // Find start of current week (Monday)
    const dayOfWeek = today.getDay(); // 0=Sun, 1=Mon ... 6=Sat
    const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const monday = new Date(today);
    monday.setDate(today.getDate() - mondayOffset);
    monday.setHours(0, 0, 0, 0);

    const activeDaysThisWeek: number[] = [];
    let sessionsThisWeek = 0;

    for (let i = 0; i < 7; i++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        const dStr = d.toISOString().split("T")[0];
        if (activeDateSet.has(dStr)) {
            activeDaysThisWeek.push(i); // 0=Mon...6=Sun
            sessionsThisWeek++;
        }
    }

    return { streakDays, sessionsThisWeek, activeDaysThisWeek, daysSinceLastActive };
}

// ── Pace status computation ──
function computePaceStatus(sessionsThisWeek: number, targetSessions: number): "Ahead" | "On Track" | "Behind" {
    if (sessionsThisWeek > targetSessions) return "Ahead";
    if (sessionsThisWeek >= targetSessions) return "On Track";
    return "Behind";
}

// ── Target sessions from weekly_hours_category ──
function getTargetSessions(category: string | null): number {
    switch (category) {
        case "0-3": return 2;
        case "4-7": return 3;
        case "8-12": return 5;
        case "13+": return 7;
        default: return 3;
    }
}

// ── Rule-based AI tip fallback ──
function buildAiTip(
    stageData: DashboardSummary["stage"],
    topicsData: DashboardSummary["topics"],
    pathCompletionPercent: number
): string | null {
    // No tip for brand new users
    if (topicsData.completed_topics === 0) return null;

    const remaining = topicsData.remaining_topics_in_stage;
    if (remaining > 0 && remaining <= 3) {
        return `You're ${remaining} lesson${remaining === 1 ? '' : 's'} away from completing ${stageData.current_stage_title}. Finishing it unlocks your next stage milestone.`;
    }

    if (pathCompletionPercent > 0 && pathCompletionPercent < 100) {
        return `Keep going — ${remaining} topic(s) left in ${stageData.current_stage_title}.`;
    }

    return null;
}
