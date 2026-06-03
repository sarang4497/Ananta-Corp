import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Megaphone, Search, Briefcase, TrendingUp, LayoutTemplate, Magnet, Repeat, Target} from 'lucide-react';
import {PageTemplate} from '@/components/PageTemplate';
import {buildAlternates} from '@/lib/metadata';

type Params = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: Params): Promise<Metadata> {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pages.leadGeneration.meta');
  return {
    title: t('title'),
    description: t('description'),
    alternates: buildAlternates('/lead-generation', locale)
  };
}

export default async function LeadGenerationPage({params}: Params) {
  const {locale} = await params;
  setRequestLocale(locale);
  return (
    <PageTemplate
      namespace="pages.leadGeneration"
      accent="blue"
      icons={[Megaphone, Search, Briefcase, TrendingUp, LayoutTemplate, Magnet, Repeat, Target]}
    />
  );
}
