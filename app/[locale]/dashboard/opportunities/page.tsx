import { getTranslations } from 'next-intl/server';
import { OpportunitiesClient } from '@/features/opportunity-analyzer/components/OpportunitiesClient';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Dashboard.Opportunities' });
  return {
    title: `${t('tabs.jobFeed')} | Mallah`,
  };
}

export default async function OpportunitiesPage() {
  return (
    <div className="py-8 px-4 max-w-6xl mx-auto space-y-6">
      <OpportunitiesClient />
    </div>
  );
}
