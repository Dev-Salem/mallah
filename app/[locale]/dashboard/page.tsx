import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { getDashboardSummary } from "@/features/dashboard";
import { DashboardView } from "@/features/dashboard/components/DashboardView";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const locale = await getLocale();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  // Check onboarding status
  const { data: learner } = await supabase
    .from("learners")
    .select("onboarding_completed")
    .eq("user_id", user.id)
    .single();

  if (!learner || !learner.onboarding_completed) {
    redirect(`/${locale}/onboarding`);
  }

  // Fetch dashboard data
  const summary = await getDashboardSummary(user.id);

  return <DashboardView summary={summary} />;
}
