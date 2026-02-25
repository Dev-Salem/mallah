import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { getRoadmapSummary } from "@/features/roadmap/services/roadmap-service";

function statusVariant(status: "NotStarted" | "InProgress" | "Completed") {
  if (status === "Completed") return "default";
  if (status === "InProgress") return "secondary";
  return "outline";
}

export default async function RoadmapPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const locale = await getLocale();
  const t = await getTranslations("Dashboard");

  if (!user) redirect(`/${locale}/login`);

  const summary = await getRoadmapSummary(user.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white uppercase tracking-tight">{t("roadmap")}</h1>
        <p className="text-slate-400">
          {summary.path.name} · {summary.path.completed_topics}/{summary.path.total_mandatory_topics} mandatory
          topics
        </p>
      </div>

      <section className="border border-slate-800 rounded-lg p-4 bg-slate-900/40">
        <h2 className="text-white font-semibold mb-2">Next Topic</h2>
        {summary.next_topic.is_path_complete ? (
          <p className="text-emerald-400">Path complete.</p>
        ) : (
          <Link href={`/${locale}/dashboard/roadmap/topic/${summary.next_topic.next_topic_id}`} className="text-cyan-400">
            {summary.next_topic.next_stage_title} · {summary.next_topic.next_topic_title}
          </Link>
        )}
      </section>

      <div className="space-y-4">
        {summary.stages.map((stage) => (
          <section key={stage.stage_id} className="border border-slate-800 rounded-lg p-4 bg-slate-900/40">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold">{stage.title}</h3>
              <span className="text-sm text-slate-400">
                {stage.completion_percent === null ? "N/A" : `${stage.completion_percent}%`}
              </span>
            </div>
            <div className="space-y-2">
              {stage.topics.map((topic) => (
                <div key={topic.topic_id} className="flex items-center justify-between border border-slate-800 rounded-md px-3 py-2">
                  <div>
                    <Link href={`/${locale}/dashboard/roadmap/topic/${topic.topic_id}`} className="text-slate-200">
                      {topic.title}
                    </Link>
                    <p className="text-xs text-slate-500">{topic.estimated_time_min ?? "-"} min</p>
                  </div>
                  <Badge variant={statusVariant(topic.status)}>{topic.status}</Badge>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
