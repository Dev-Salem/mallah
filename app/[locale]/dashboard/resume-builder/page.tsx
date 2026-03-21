import { getTranslations } from "next-intl/server";
import { fetchResumes } from "@/features/resume-builder/services/resume-service";
import ResumeCardsGrid from "@/features/resume-builder/components/resume-cards-grid";

export default async function ResumeBuilderPage() {
  const initialData = await fetchResumes();

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      <ResumeCardsGrid initialData={initialData} />
    </div>
  );
}
