import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { getRoadmapData } from "@/features/roadmaps/services/roadmap-service";
import { RoadmapView } from "@/features/roadmaps/components/RoadmapView";

export default async function RoadmapPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const locale = await getLocale();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  const { data: learner } = await supabase
    .from("learners")
    .select("current_path_id")
    .eq("user_id", user.id)
    .single();

  if (!learner?.current_path_id) {
    redirect(`/${locale}/onboarding`);
  }

  const data = await getRoadmapData(learner.current_path_id, user.id);

  if ("error" in data) {
    return <div className="p-8 text-destructive font-mono uppercase">Error: {data.error}</div>;
  }

  return <RoadmapView data={data} />;
}
