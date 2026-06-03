import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Gauge, Database, BarChart3, LineChart, PieChart, TrendingUp} from 'lucide-react';
import {PageTemplate} from '@/components/PageTemplate';
import {buildAlternates} from '@/lib/metadata';

type Params = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: Params): Promise<Metadata> {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pages.customDashboards.meta');
  return {
    title: t('title'),
    description: t('description'),
    alternates: buildAlternates('/custom-dashboards', locale)
  };
}

export default async function CustomDashboardsPage({params}: Params) {
  const {locale} = await params;
  setRequestLocale(locale);
  return (
    <PageTemplate
      namespace="pages.customDashboards"
      accent="blue"
      icons={[Gauge, Database, BarChart3, LineChart, PieChart, TrendingUp]}
    />
  );
}
