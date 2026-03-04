import { getTopicAction, getAdjacentTopics, getTopicBreadcrumb } from "@/features/roadmap/actions/topic-actions";
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

    const [topic, adjacentTopics, breadcrumb] = await Promise.all([
        getTopicAction(topicId),
        getAdjacentTopics(topicId),
        getTopicBreadcrumb(topicId),
    ]);

    if (!topic) {
        redirect(`/${locale}/dashboard/roadmap`);
    }

    return (
        <div className="h-full w-full">
            <TopicViewerView
                topic={topic}
                adjacentTopics={adjacentTopics}
                breadcrumb={breadcrumb}
            />
        </div>
    );
}
