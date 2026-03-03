import { getTranslations } from "next-intl/server";
import { getRoadmapAction } from "@/features/roadmap/actions/roadmap-actions";
import { RoadmapView } from "@/features/roadmap/components/RoadmapView";

export default async function RoadmapPage() {
  const t = await getTranslations('Dashboard');
  const roadmapData = await getRoadmapAction();

  if (!roadmapData) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">
          {t('roadmap')}
        </h1>
        <p className="text-muted-foreground max-w-lg">
          We could not find your personalized learning path. Please ensure you have completed the onboarding process.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <RoadmapView roadmap={roadmapData} />
    </div>
  );
}
