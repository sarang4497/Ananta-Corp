import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {PolicyPage, type PolicySection} from '@/components/PolicyPage';
import {buildAlternates} from '@/lib/metadata';

type Params = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: Params): Promise<Metadata> {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('terms');
  return {
    title: t('meta.title'),
    description: t('meta.description'),
    alternates: buildAlternates('/terms', locale)
  };
}

export default async function TermsPage({params}: Params) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('terms');
  const sections = t.raw('sections') as PolicySection[];

  return (
    <PolicyPage
      eyebrow={t('eyebrow')}
      title={t('title')}
      updated={t('updated')}
      sections={sections}
    />
  );
}
