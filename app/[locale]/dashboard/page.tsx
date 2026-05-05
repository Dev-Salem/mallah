import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { getDashboardSummary, getRecentActivity } from "@/features/dashboard/services/dashboard-service";
import { DashboardView } from "@/features/dashboard/components/DashboardView";

export default async function DashboardPage() {
  const locale = await getLocale();
  const supabase = await createClient();

  // Auth check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/${locale}/login`);
  }

  // Learner check
  const { data: learner } = await supabase
    .from("learners")
    .select("onboarding_completed, current_path_id")
    .eq("user_id", user.id)
    .single();

  if (!learner) {
    console.warn(`[Dashboard] Learner record missing for user ${user.id}. Redirecting to onboarding.`);
    redirect(`/${locale}/onboarding`);
  }

  // Edge case: Onboarding not completed → redirect
  if (!learner.onboarding_completed) {
    redirect(`/${locale}/onboarding`);
  }

  // Edge case: No path selected → redirect
  if (!learner.current_path_id) {
    redirect(`/${locale}/onboarding`);
  }

  // Fetch dashboard summary
  const summary = await getDashboardSummary(user.id);

  // Edge case: Inactive path
  if (!summary.path.is_active) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
        <h2 className="text-xl font-bold text-white">This path is no longer available</h2>
        <p className="text-muted-foreground text-sm">Choose a new learning path to continue your journey.</p>
        <a
          href={`/${locale}/onboarding`}
          className="text-primary underline text-sm hover:text-primary/80 transition-colors"
        >
          Choose a new path →
        </a>
      </div>
    );
  }

  // Edge case: No stages/topics
  if (summary.stage.total_stages === 0 || summary.topics.total_mandatory_topics === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Content is being updated</h2>
        <p className="text-muted-foreground text-sm">Check back soon. We&apos;re adding new lessons to your path.</p>
      </div>
    );
  }

  // Fetch recent activity
  const recentActivity = await getRecentActivity(user.id);

  return <DashboardView summary={summary} recentActivity={recentActivity} />;
}
