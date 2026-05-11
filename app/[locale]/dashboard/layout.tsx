import { Sidebar } from "@/components/dashboard/Sidebar";
import { SidebarProvider, type SidebarContextData } from "@/features/dashboard/components/SidebarContext";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import React from "react";

async function getSidebarData(userId: string): Promise<SidebarContextData | null> {
  const supabase = await createClient();

  const { data: learner } = await supabase
    .from("learners")
    .select("first_name, current_path_id")
    .eq("user_id", userId)
    .single();

  if (!learner) return null;

  let pathDisplayName = "Not Selected";
  let pathCompletionPercent = 0;
  let currentStageNumber = 1;
  let totalStages = 0;

  if (learner.current_path_id) {
    const { data: pathRow } = await supabase
      .from("paths")
      .select("name")
      .eq("path_id", learner.current_path_id)
      .single();

    if (pathRow) pathDisplayName = pathRow.name || pathDisplayName;

    // Fetch all stages for this path
    const { data: stagesData } = await supabase
      .from("stages")
      .select(`
        stage_id,
        order_index,
        topics (topic_id),
        projects (project_id)
      `)
      .eq("path_id", learner.current_path_id)
      .order("order_index", { ascending: true });

    if (stagesData) {
      totalStages = stagesData.length;

      // Fetch user progress for topics and projects
      const { data: topicProgress } = await supabase
        .from("user_progress")
        .select("topic_id, status")
        .eq("user_id", userId);

      const { data: projectProgress } = await supabase
        .from("user_projects")
        .select("project_id, status")
        .eq("user_id", userId);

      const topicProgressMap = new Map(topicProgress?.map(p => [p.topic_id, p.status]) || []);
      const projectProgressMap = new Map(projectProgress?.map(p => [p.project_id, p.status]) || []);

      let totalItems = 0;
      let completedItems = 0;
      let foundCurrentStage = false;

      for (let i = 0; i < stagesData.length; i++) {
        const stage = stagesData[i];
        const stageTopics = stage.topics || [];
        const stageProjects = stage.projects || [];

        // Update total items count
        totalItems += stageTopics.length + stageProjects.length;

        // Count completed items in this stage
        let stageCompleted = true;
        
        stageTopics.forEach(t => {
          if (topicProgressMap.get(t.topic_id) === 'completed') {
            completedItems++;
          }
        });

        stageProjects.forEach(p => {
          const status = projectProgressMap.get(p.project_id);
          if (status === 'completed' || status === 'waiting') {
            completedItems++;
          } else {
            stageCompleted = false;
          }
        });

        // Current stage is the first one not fully completed (or rather, the one whose project is not done)
        if (!foundCurrentStage && !stageCompleted) {
          currentStageNumber = i + 1;
          foundCurrentStage = true;
        }
      }

      // If all stages are completed, set current stage to last one
      if (!foundCurrentStage && totalStages > 0) {
        currentStageNumber = totalStages;
      }

      if (totalItems > 0) {
        pathCompletionPercent = Math.round((completedItems / totalItems) * 100);
      }
    }
  }

  // Skill count for resume dot
  const { count: skillCount } = await supabase
    .from("user_skills")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);



  return {
    pathDisplayName,
    pathCompletionPercent,
    currentStageNumber,
    totalStages,
    firstName: learner.first_name,
    resumeStatus: "not_created",
    unlockedSkillsCount: skillCount ?? 0,
  };
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const locale = await getLocale();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  const sidebarData = await getSidebarData(user.id);

  return (
    <div className="relative min-h-screen bg-background flex flex-col lg:flex-row">
      {sidebarData ? (
        <SidebarProvider data={sidebarData}>
          <Sidebar />
        </SidebarProvider>
      ) : (
        <Sidebar />
      )}

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 lg:ms-60 min-h-screen transition-all duration-300 pb-20 lg:pb-0">
        <div className="p-4 lg:p-10 max-w-6xl mx-auto pt-6 lg:pt-8">
          {children}
        </div>
      </main>
    </div>
  );
}
