import { SystemModule } from "@/components/dashboard/SystemModule";
import { getTranslations } from "next-intl/server";

export default async function SkillsPage() {
  const t = await getTranslations('Dashboard');

  return (
    <div className="h-full">
      <h1 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">
        {t('skillsHub')} 
      </h1>
      <SystemModule 
        title={t('skillsHub')}
        description="The Skills & Projects database is undergoing synchronization. Your mission achievements will be visible here."
      />
    </div>
  );
}
