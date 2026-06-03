import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Palette, Compass, Share2, Video, PenTool, Search, Mail} from 'lucide-react';
import {PageTemplate} from '@/components/PageTemplate';
import {buildAlternates} from '@/lib/metadata';

type Params = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: Params): Promise<Metadata> {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pages.contentBranding.meta');
  return {
    title: t('title'),
    description: t('description'),
    alternates: buildAlternates('/content-branding', locale)
  };
}

export default async function ContentBrandingPage({params}: Params) {
  const {locale} = await params;
  setRequestLocale(locale);
  return (
    <PageTemplate
      namespace="pages.contentBranding"
      accent="red"
      icons={[Palette, Compass, Share2, Video, PenTool, Search, Mail]}
    />
  );
}
