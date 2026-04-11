import { getTranslations } from 'next-intl/server';
import { OpportunitiesClient } from '@/features/opportunity-analyzer/components/OpportunitiesClient';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Dashboard.Opportunities' });
  return {
    title: `${t('pageTitle')} | Mallah`,
  };
}

export default function OpportunitiesPage() {
  return (
    <div className="py-8 px-4 max-w-6xl mx-auto space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Opportunities</h1>
        <p className="text-muted-foreground">Discover jobs matching your skills or analyze a custom job description.</p>
      </div>
      
      <OpportunitiesClient />
    </div>
  );
}
