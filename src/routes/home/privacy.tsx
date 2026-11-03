import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {PolicyPage, type PolicySection} from '@/components/PolicyPage';
import {buildAlternates} from '@/lib/metadata';

type Params = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: Params): Promise<Metadata> {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('privacy');
  return {
    title: t('meta.title'),
    description: t('meta.description'),
    alternates: buildAlternates('/privacy', locale)
  };
}

export default async function PrivacyPage({params}: Params) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('privacy');
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
