import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { completeTopic, openTopic } from "@/features/roadmap/services/roadmap-service";

interface Props {
  params: Promise<{ topicId: string; locale: string }>;
}

export default async function TopicPage({ params }: Props) {
  const { topicId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const locale = await getLocale();

  if (!user) redirect(`/${locale}/login`);
  const userId = user.id;

  const topic = await openTopic(userId, topicId);

  async function completeAction() {
    "use server";
    const result = await completeTopic(userId, topicId);
    if (result.next_topic.next_topic_id) {
      redirect(`/${locale}/dashboard/roadmap/topic/${result.next_topic.next_topic_id}`);
    }
    redirect(`/${locale}/dashboard/roadmap`);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl text-white font-black">{topic.title}</h1>
        <p className="text-slate-400">{topic.summary}</p>
      </div>

      <section className="border border-slate-800 rounded-lg p-4 bg-slate-900/40 space-y-3">
        <h2 className="text-white font-semibold">Resources</h2>
        {topic.resources.length === 0 && <p className="text-slate-400 text-sm">No resources available.</p>}
        {topic.resources.map((resource) => (
          <article key={resource.id} className="border border-slate-800 rounded-md p-3">
            <h3 className="text-slate-100">{resource.title}</h3>
            <p className="text-xs text-slate-500 mb-2">{resource.resource_type}</p>
            {resource.content && <p className="text-slate-300 text-sm">{resource.content}</p>}
            {resource.url && (
              <a href={resource.url} target="_blank" rel="noreferrer" className="text-cyan-400 text-sm">
                Open resource
              </a>
            )}
          </article>
        ))}
      </section>

      <form action={completeAction}>
        <Button disabled={topic.status === "Completed"}>
          {topic.status === "Completed" ? "Completed" : "Mark as Complete"}
        </Button>
      </form>
    </div>
  );
}
