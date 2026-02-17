import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { signOut } from "@/features/auth/actions/auth-actions";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import {
  LogOut,
  Terminal as TerminalIcon,
  Map,
  Cpu,
  FileText,
  Radar,
  ArrowRight,
  Zap,
  TrendingUp,
  Lightbulb,
  ChevronRight,
  Lock,
} from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const locale = await getLocale();
  const t = await getTranslations("Dashboard");
  const isArabic = locale === "ar";

  if (!user) {
    redirect(`/${locale}/login`);
  }

  // Fetch profile with path join
  const { data: profile } = await supabase
    .from("profiles")
    .select("*, paths(name, name_ar)")
    .eq("id", user.id)
    .single();

  const firstName = profile?.first_name || user.email?.split("@")[0] || "Navigator";
  const pathData = profile?.paths as { name: string; name_ar: string } | null;
  const pathName = pathData
    ? isArabic
      ? pathData.name_ar
      : pathData.name
    : null;

  // Placeholders — will connect to real data when tables exist
  const progressPercent = 0;
  const completedLessons = 0;
  const totalLessons = 0;
  const skillsCount = 0;
  const projectsCount = 0;

  const quickActions = [
    {
      key: "roadmap",
      href: "/dashboard/roadmap",
      icon: Map,
      label: t("viewRoadmap"),
    },
    {
      key: "skills",
      href: "/dashboard/skills",
      icon: Cpu,
      label: t("openSkillsHub"),
    },
    {
      key: "resume",
      href: "/dashboard/resume",
      icon: FileText,
      label: t("openResumeBuilder"),
    },
    {
      key: "opportunities",
      href: "/dashboard/opportunities",
      icon: Radar,
      label: t("analyzeOpportunity"),
    },
  ];

  return (
    <>
      {/* Header / Greeting */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-8">
        <div>
          <div className="inline-flex items-center gap-3 px-3 py-1 border border-primary/20 bg-primary/5 mb-4">
            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <span
              className={`text-[9px] uppercase ${!isArabic ? "tracking-[0.4em]" : ""} text-primary font-mono font-bold`}
            >
              {t("sessionActive")}
            </span>
          </div>
          <h1
            className={`text-4xl lg:text-5xl font-black text-white uppercase ${!isArabic ? "tracking-tighter" : ""} mb-2`}
          >
            {t("greeting")}{" "}
            <span className="text-primary">{firstName}</span>
          </h1>
          {pathName && (
            <p
              className={`text-muted-foreground font-mono text-xs uppercase ${!isArabic ? "tracking-[0.2em]" : ""} flex items-center gap-2`}
            >
              <TerminalIcon className="h-3 w-3 text-primary/40" />
              {t("currentPath")}: {pathName}
            </p>
          )}
        </div>

        <form action={signOut}>
          <Button
            variant="outline"
            className={`h-12 px-8 border-white/10 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 text-white rounded-none uppercase ${!isArabic ? "tracking-[0.2em]" : ""} font-mono text-[10px] transition-all group cursor-pointer`}
          >
            <LogOut className="me-3 h-3 w-3 group-hover:rotate-12 transition-transform" />
            {t("signOut")}
          </Button>
        </form>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Global Progress Card */}
        <div className="lg:col-span-2 glass border-white/5 p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Logo size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 border border-primary/20">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <h2
                className={`text-white font-bold uppercase ${!isArabic ? "tracking-widest" : ""} text-sm`}
              >
                {t("progressTitle")}
              </h2>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span
                  className={`text-[10px] font-mono text-muted-foreground uppercase ${!isArabic ? "tracking-widest" : ""}`}
                >
                  {t("progressOverall", { percent: progressPercent })}
                </span>
                <span
                  className={`text-[10px] font-mono text-primary/60 uppercase ${!isArabic ? "tracking-widest" : ""}`}
                >
                  {t("lessonsProgress", {
                    completed: completedLessons,
                    total: totalLessons,
                  })}
                </span>
              </div>
              <div className="w-full h-2 bg-white/5 border border-white/10 overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-1000 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Current Stage */}
            {pathName && (
              <div
                className={`mt-6 p-4 border border-white/5 bg-white/5 font-mono text-xs text-muted-foreground`}
              >
                <span
                  className={`text-[9px] text-primary/40 uppercase ${!isArabic ? "tracking-[0.3em]" : ""} block mb-1`}
                >
                  {t("currentStage")}
                </span>
                <span className="text-white">Stage 1 — Fundamentals</span>
              </div>
            )}
          </div>
        </div>

        {/* Resume Learning Card */}
        <div className="glass border-primary/20 p-8 flex flex-col justify-between group hover:bg-primary/5 transition-colors">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 border border-primary/20">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <h2
                className={`text-white font-bold uppercase ${!isArabic ? "tracking-widest" : ""} text-sm`}
              >
                {t("resumeLearning")}
              </h2>
            </div>
            <div
              className={`text-[9px] font-mono text-primary/40 uppercase ${!isArabic ? "tracking-[0.3em]" : ""} mb-2`}
            >
              {t("nextTopic")}
            </div>
            <p className="text-white text-sm font-medium mb-6">
              Introduction to HTML & CSS
            </p>
          </div>
          <button
            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-mono text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 group/btn cursor-pointer"
          >
            {t("resumeLearning")}
            <ArrowRight className="h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Quick Stats Row */}
        <div className="glass border-white/5 p-6 text-center">
          <div
            className={`text-[9px] font-mono text-primary/40 uppercase ${!isArabic ? "tracking-[0.3em]" : ""} mb-3`}
          >
            {t("skillsUnlocked")}
          </div>
          <div className="text-3xl font-black text-white mb-1">{skillsCount}</div>
          <div className="w-full h-px bg-primary/10" />
        </div>

        <div className="glass border-white/5 p-6 text-center">
          <div
            className={`text-[9px] font-mono text-primary/40 uppercase ${!isArabic ? "tracking-[0.3em]" : ""} mb-3`}
          >
            {t("projectsCompleted")}
          </div>
          <div className="text-3xl font-black text-white mb-1">
            {projectsCount}
          </div>
          <div className="w-full h-px bg-primary/10" />
        </div>

        <div className="glass border-white/5 p-6 text-center">
          <div
            className={`text-[9px] font-mono text-primary/40 uppercase ${!isArabic ? "tracking-[0.3em]" : ""} mb-3`}
          >
            {t("resumeReadiness")}
          </div>
          <div className="text-sm font-bold text-white/60 font-mono uppercase">
            {t("resumeNotCreated")}
          </div>
          <div className="w-full h-px bg-primary/10 mt-3" />
        </div>

        {/* AI Tip Panel */}
        <div className="lg:col-span-2 glass border-white/5 p-6 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 border border-primary/20">
              <Lightbulb className="h-4 w-4 text-primary" />
            </div>
            <span
              className={`text-[10px] font-mono text-primary uppercase ${!isArabic ? "tracking-[0.3em]" : ""} font-bold`}
            >
              {t("aiTipTitle")}
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t("aiTipDefault")}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="glass border-white/5 p-6">
          <span
            className={`block text-[9px] font-mono text-primary/40 uppercase ${!isArabic ? "tracking-[0.3em]" : ""} mb-4`}
          >
            {t("quickActions")}
          </span>
          <div className="space-y-2">
            {quickActions.map((action) => (
              <div
                key={action.key}
                className="flex items-center gap-3 px-3 py-2.5 border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all cursor-pointer group/qa relative"
              >
                <action.icon className="h-4 w-4 text-muted-foreground group-hover/qa:text-primary transition-colors" />
                <span
                  className={`text-[10px] font-mono text-muted-foreground group-hover/qa:text-white uppercase ${!isArabic ? "tracking-widest" : ""} flex-1 transition-colors`}
                >
                  {action.label}
                </span>
                <Lock className="h-3 w-3 text-white/10" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
