import type {MetadataRoute} from 'next';
import {getPathname} from '@/i18n/navigation';
import {routing} from '@/i18n/routing';
import {siteUrl} from '@/config';
import {CATEGORIES, PRODUCTS} from '@/data/products';

type Href = Parameters<typeof getPathname>[0]['href'];

const staticHrefs: Href[] = [
  '/',
  '/products',
  '/decor',
  '/about',
  '/partners',
  '/contact',
  '/privacy',
  '/terms'
];

const hrefs: Href[] = [
  ...staticHrefs,
  ...CATEGORIES.map(
    (c) => ({pathname: '/products/[category]', params: {category: c.slug}}) as Href
  ),
  ...CATEGORIES.flatMap((c) =>
    c.subs.map(
      (s) =>
        ({
          pathname: '/products/[category]/[sub]',
          params: {category: c.slug, sub: s.slug}
        }) as Href
    )
  ),
  ...PRODUCTS.map(
    (p) =>
      ({
        pathname: '/products/[category]/[sub]/[slug]',
        params: {category: p.category, sub: p.subcategory, slug: p.slug}
      }) as Href
  )
];

function entry(href: Href): MetadataRoute.Sitemap[number] {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = siteUrl + getPathname({href, locale});
  }
  return {
    url: siteUrl + getPathname({href, locale: routing.defaultLocale}),
    lastModified: new Date(),
    changeFrequency: 'weekly',
    alternates: {languages}
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  return hrefs.map(entry);
}
