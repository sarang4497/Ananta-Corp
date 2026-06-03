import type {MetadataRoute} from 'next';
import {getPathname} from '@/i18n/navigation';
import {routing} from '@/i18n/routing';
import {siteUrl} from '@/config';

type Href = Parameters<typeof getPathname>[0]['href'];

const hrefs: Href[] = ['/', '/contact'];

function entry(href: Href): MetadataRoute.Sitemap[number] {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = siteUrl + getPathname({href, locale});
  }
  return {
    url: siteUrl + getPathname({href, locale: routing.defaultLocale}),
    lastModified: new Date(),
    changeFrequency: 'monthly',
    alternates: {languages}
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  return hrefs.map(entry);
}
