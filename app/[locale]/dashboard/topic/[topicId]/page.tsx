import { getTranslations } from "next-intl/server";
import { getTopicAction } from "@/features/roadmap/actions/topic-actions";
import { TopicViewerView } from "@/features/roadmap/components/TopicViewerView";
import { redirect } from "next/navigation";

interface TopicPageProps {
    params: {
        locale: string;
        topicId: string;
    };
}

export default async function TopicPage({ params }: TopicPageProps) {
    const { topicId, locale } = await params;
    const t = await getTranslations('TopicViewer');

    const topic = await getTopicAction(topicId);

    if (!topic) {
        // Topic not found
        redirect(`/${locale}/dashboard/roadmap`);
    }

    return (
        <div className="h-full w-full">
            <TopicViewerView topic={topic} />
        </div>
    );
}
