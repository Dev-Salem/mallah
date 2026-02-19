import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { getUserAnalyses } from "@/features/opportunity-analyzer/services/opportunity-service";
import { OpportunityAnalyzerClient } from "@/features/opportunity-analyzer/components/OpportunityAnalyzerClient";

export default async function OpportunitiesPage() {
  const locale = await getLocale();
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  const analyses = await getUserAnalyses(user.id);

  return <OpportunityAnalyzerClient analyses={analyses} />;
}
