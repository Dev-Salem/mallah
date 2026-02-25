import { SystemModule } from "@/components/dashboard/SystemModule";
import { getTranslations } from "next-intl/server";

export default async function OpportunitiesPage() {
  const t = await getTranslations('Dashboard');

  return (
    <div className="h-full">
      <h1 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">
        {t('opportunityAnalyzer')}
      </h1>
      <SystemModule 
        title={t('opportunityAnalyzer')}
        description="The Opportunity Analyzer scans the market for your next destination. Coming online soon."
      />
    </div>
  );
}
