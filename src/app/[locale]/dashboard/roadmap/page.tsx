import { SystemModule } from "@/components/dashboard/SystemModule";
import { getTranslations } from "next-intl/server";

export default async function RoadmapPage() {
  const t = await getTranslations('Dashboard');

  return (
    <div className="h-full">
      <h1 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">
        {t('roadmap')}
      </h1>
      <SystemModule 
        title={t('roadmap')}
        description="The Career Roadmap module is currently being calibrated. Check back soon for your personalized navigation instructions."
      />
    </div>
  );
}
