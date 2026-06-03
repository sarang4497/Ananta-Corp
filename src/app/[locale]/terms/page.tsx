import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {PolicyBody} from '@/components/PolicyBody';
import {TERMS} from '@/content/legal';
import {buildAlternates} from '@/lib/metadata';

type Params = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: Params): Promise<Metadata> {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pages.terms.meta');
  return {
    title: t('title'),
    description: t('description'),
    alternates: buildAlternates('/terms', locale)
  };
}

export default async function TermsPage({params}: Params) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pages.terms.hero');

  return (
    <article className="shell py-12 font-[family-name:var(--font-inter)] sm:py-16">
      <h1 className="text-balance text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        {t('title')}
      </h1>
      <div className="mt-8">
        <PolicyBody content={TERMS} />
      </div>
    </article>
  );
}
