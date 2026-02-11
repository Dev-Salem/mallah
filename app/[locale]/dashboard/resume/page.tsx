import { SystemModule } from "@/components/dashboard/SystemModule";
import { getTranslations } from "next-intl/server";

export default async function ResumePage() {
  const t = await getTranslations('Dashboard');

  return (
    <div className="h-full">
      <h1 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">
        {t('resumeBuilder')}
      </h1>
      <SystemModule 
        title={t('resumeBuilder')}
        description="The Resume Builder engine is warming up. Prepare for automated dossier creation."
      />
    </div>
  );
}
