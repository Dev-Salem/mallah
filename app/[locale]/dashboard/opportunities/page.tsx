import { getTranslations } from 'next-intl/server';
import { OpportunityAnalyzerUI } from '@/features/ai/components/OpportunityAnalyzerUI';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'Dashboard.Opportunities' });
  return {
    title: `${t('pageTitle')} | Mallah`,
  };
}

export default function OpportunitiesPage() {
  return (
    <div className="py-8 px-4">
      <OpportunityAnalyzerUI />
    </div>
  );
}
