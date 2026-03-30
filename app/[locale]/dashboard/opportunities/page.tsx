import { getTranslations } from 'next-intl/server';
import { AnalyzerContainer } from '@/features/opportunity-analyzer';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Dashboard.Opportunities' });
  return {
    title: `${t('pageTitle')} | Mallah`,
  };
}

export default function OpportunitiesPage() {
  return (
    <div className="py-8 px-4">
      <AnalyzerContainer />
    </div>
  );
}
