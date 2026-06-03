import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {PolicyBody} from '@/components/PolicyBody';
import {REFUND} from '@/content/legal';
import {buildAlternates} from '@/lib/metadata';

type Params = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: Params): Promise<Metadata> {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pages.refund.meta');
  return {
    title: t('title'),
    description: t('description'),
    alternates: buildAlternates('/refund-policy', locale)
  };
}

export default async function RefundPolicyPage({params}: Params) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pages.refund.hero');

  return (
    <article className="shell py-12 font-[family-name:var(--font-inter)] sm:py-16">
      <h1 className="text-balance text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        {t('title')}
      </h1>
      <div className="mt-8">
        <PolicyBody content={REFUND} />
      </div>
    </article>
  );
}
