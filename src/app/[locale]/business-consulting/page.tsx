import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Rocket, Users, Filter, Megaphone, TrendingUp, BarChart3} from 'lucide-react';
import {PageTemplate} from '@/components/PageTemplate';
import {buildAlternates} from '@/lib/metadata';

type Params = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: Params): Promise<Metadata> {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pages.businessConsulting.meta');
  return {
    title: t('title'),
    description: t('description'),
    alternates: buildAlternates('/business-consulting', locale)
  };
}

export default async function BusinessConsultingPage({params}: Params) {
  const {locale} = await params;
  setRequestLocale(locale);
  return (
    <PageTemplate
      namespace="pages.businessConsulting"
      accent="indigo"
      icons={[Rocket, Users, Filter, Megaphone, TrendingUp, BarChart3]}
    />
  );
}
