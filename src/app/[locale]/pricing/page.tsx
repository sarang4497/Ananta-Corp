import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {PageHero} from '@/components/PageHero';
import {ComingSoon} from '@/components/ComingSoon';
import {buildAlternates} from '@/lib/metadata';

type Params = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: Params): Promise<Metadata> {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pages.pricing.meta');
  return {
    title: t('title'),
    description: t('description'),
    alternates: buildAlternates('/pricing', locale)
  };
}

export default async function PricingPage({params}: Params) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pages.pricing');

  return (
    <>
      <PageHero
        eyebrow={t('hero.eyebrow')}
        title={t('hero.title')}
        sub={t('hero.sub')}
      />
      {/* TODO: replace with real pricing/packages — do not invent numbers. */}
      <ComingSoon heading={t('todo.heading')} body={t('todo.body')} />
    </>
  );
}
