import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Smartphone, MonitorSmartphone, Cloud, Users, Plug, Palette} from 'lucide-react';
import {PageTemplate} from '@/components/PageTemplate';
import {buildAlternates} from '@/lib/metadata';

type Params = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: Params): Promise<Metadata> {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pages.customApps.meta');
  return {
    title: t('title'),
    description: t('description'),
    alternates: buildAlternates('/custom-apps', locale)
  };
}

export default async function CustomAppsPage({params}: Params) {
  const {locale} = await params;
  setRequestLocale(locale);
  return (
    <PageTemplate
      namespace="pages.customApps"
      accent="orange"
      icons={[Smartphone, MonitorSmartphone, Cloud, Users, Plug, Palette]}
    />
  );
}
