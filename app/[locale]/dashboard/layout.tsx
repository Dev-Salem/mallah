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

    // Count stages
    const { count: stageCount } = await supabase
      .from("stages")
      .select("*", { count: "exact", head: true })
      .eq("path_id", learner.current_path_id);

    totalStages = stageCount ?? 0;
  }

  // Skill count for resume dot
  const { count: skillCount } = await supabase
    .from("user_skills")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  // Active applications for tracker dot
  const { data: activeApps } = await supabase
    .from("application_tracker")
    .select("application_id")
    .eq("user_id", userId)
    .in("stage", ["interviewing", "offer"])
    .limit(1);

  return {
    pathDisplayName,
    pathCompletionPercent,
    currentStageNumber,
    totalStages,
    firstName: learner.first_name,
    resumeStatus: "not_created",
    unlockedSkillsCount: skillCount ?? 0,
    hasActiveApplications: (activeApps?.length ?? 0) > 0,
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
