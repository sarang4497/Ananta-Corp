import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Globe, LayoutTemplate, AppWindow, ShoppingCart, Code, Gauge, FileText} from 'lucide-react';
import {PageTemplate} from '@/components/PageTemplate';
import {buildAlternates} from '@/lib/metadata';

type Params = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: Params): Promise<Metadata> {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pages.websites.meta');
  return {
    title: t('title'),
    description: t('description'),
    alternates: buildAlternates('/websites', locale)
  };
}

export default async function WebsitesPage({params}: Params) {
  const {locale} = await params;
  setRequestLocale(locale);
  return (
    <PageTemplate
      namespace="pages.websites"
      accent="indigo"
      icons={[Globe, LayoutTemplate, AppWindow, ShoppingCart, Code, Gauge, FileText]}
    />
  );
}
