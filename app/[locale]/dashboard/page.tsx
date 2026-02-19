import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { DashboardClient, getDashboardData } from "@/features/dashboard";

export default async function DashboardPage() {
  const data = await getDashboardData();
  const locale = await getLocale();

  if ("error" in data) {
    if (data.error === "Not authenticated") {
      redirect(`/${locale}/login`);
    }
  }

  // Redirect to onboarding if no path selected
  if (!("error" in data) && !data.profile.current_path_id && !data.profile.onboarding_completed) {
    redirect(`/${locale}/onboarding`);
  }

  return <DashboardClient data={data} />;
}

