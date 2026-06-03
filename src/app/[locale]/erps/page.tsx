import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Package, Calculator, Users, Contact, Workflow, Database} from 'lucide-react';
import {PageTemplate} from '@/components/PageTemplate';
import {buildAlternates} from '@/lib/metadata';

type Params = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: Params): Promise<Metadata> {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pages.erps.meta');
  return {
    title: t('title'),
    description: t('description'),
    alternates: buildAlternates('/erps', locale)
  };
}

export default async function ErpsPage({params}: Params) {
  const {locale} = await params;
  setRequestLocale(locale);
  return (
    <PageTemplate
      namespace="pages.erps"
      accent="green"
      icons={[Package, Calculator, Users, Contact, Workflow, Database]}
    />
  );
}
