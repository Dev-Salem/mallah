import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import Link from "next/link";
import { signOut } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { getDashboardSummary } from "@/features/dashboard/services/dashboard-service";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const locale = await getLocale();
  const t = await getTranslations("Dashboard");

  if (!user) {
    redirect(`/${locale}/login`);
  }

  const summary = await getDashboardSummary(user.id);

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">{t("title")}</h1>
          <p className="text-slate-400">
            Mission: <span className="text-slate-200">{summary.mission.title}</span>
          </p>
        </div>
        <form action={signOut}>
          <Button variant="outline">{t("signOut")}</Button>
        </form>
      </div>

      {summary.onboarding_banner.show && (
        <section className="border border-cyan-700/40 bg-cyan-950/20 rounded-lg p-4">
          <h2 className="text-white font-semibold mb-2">Starter Plan</h2>
          <p className="text-slate-300 text-sm mb-3">{summary.onboarding_banner.first_milestone}</p>
          <div className="space-y-2">
            {summary.onboarding_banner.starter_plan_2_weeks.map((week) => (
              <div key={week.week} className="text-sm text-slate-300">
                <span className="font-semibold text-cyan-400">Week {week.week}:</span>{" "}
                {week.actions.join(" • ")}
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <section className="border border-slate-800 rounded-lg p-4 bg-slate-900/40">
          <h3 className="text-white font-semibold mb-2">Mission</h3>
          <p className="text-slate-300 mb-3">{summary.mission.description}</p>
          <Link href={`/${locale}${summary.mission.cta_target}`}>
            <Button>{summary.mission.cta_label}</Button>
          </Link>
        </section>

        <section className="border border-slate-800 rounded-lg p-4 bg-slate-900/40">
          <h3 className="text-white font-semibold mb-2">Progress</h3>
          <div className="space-y-2 text-sm text-slate-300">
            <p>Path: {summary.path.path_display_name ?? "Not assigned"}</p>
            <p>Path completion: {summary.path.completion_percent ?? "N/A"}%</p>
            <p>Current stage: {summary.stage.current_stage_title ?? "N/A"}</p>
            <p>
              Topics: {summary.topics.completed_topics}/{summary.topics.total_mandatory_topics}
            </p>
            <p>Next topic: {summary.topics.next_topic_title ?? "Path complete"}</p>
          </div>
        </section>

        <section className="border border-slate-800 rounded-lg p-4 bg-slate-900/40">
          <h3 className="text-white font-semibold mb-2">Readiness</h3>
          <div className="space-y-2 text-sm text-slate-300">
            <p>Skills unlocked: {summary.readiness.unlocked_skills_count}</p>
            <p>Projects completed: {summary.readiness.completed_projects_count}</p>
            <p>Resume: {summary.readiness.resume_status}</p>
          </div>
        </section>

        <section className="border border-slate-800 rounded-lg p-4 bg-slate-900/40">
          <h3 className="text-white font-semibold mb-2">Pace</h3>
          <div className="space-y-2 text-sm text-slate-300">
            <p>Streak days: {summary.pace.streak_days}</p>
            <p>
              Sessions this week: {summary.pace.sessions_this_week}/{summary.pace.target_sessions_per_week}
            </p>
            <p>Status: {summary.pace.pace_status}</p>
          </div>
        </section>
      </div>
    </div>
  );
}
