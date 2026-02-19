import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { getTopicData } from "@/features/roadmaps/services/roadmap-service";
import { TopicContent } from "@/features/roadmaps";

export default async function TopicPage({ params }: { params: Promise<{ topicId: string }> }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const locale = await getLocale();

    if (!user) {
        redirect(`/${locale}/login`);
    }

    const { topicId } = await params;
    const data = await getTopicData(topicId, user.id);

    if ("error" in data) {
        return <div className="p-8 text-destructive font-mono uppercase">Error: {data.error}</div>;
    }

    return <TopicContent topic={data.topic} progress={data.progress} userId={user.id} />;
}
