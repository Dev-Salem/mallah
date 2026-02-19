import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { getHubData } from "@/features/projects-skills-hub/services/hub-service";
import { HubTabs } from "@/features/projects-skills-hub/components/HubTabs";

export default async function SkillsHubPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const locale = await getLocale();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  const data = await getHubData(user.id);

  return <HubTabs data={data} userId={user.id} />;
}
