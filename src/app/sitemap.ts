import type {MetadataRoute} from 'next';
import {getPathname} from '@/i18n/navigation';
import {routing} from '@/i18n/routing';
import {siteUrl} from '@/config';

type Href = Parameters<typeof getPathname>[0]['href'];

const productSlugs = [
  'product-one',
  'product-two',
  'product-three',
  'product-four',
  'product-five',
  'product-six'
];

const industrySlugs = ['dental', 'restaurants', 'engineering-b2b', 'ecommerce', 'med-spas'];

const staticHrefs: Href[] = [
  '/',
  // Primary navbar pages.
  '/lead-generation',
  '/websites',
  '/custom-apps',
  '/ai-products',
  '/erps',
  '/content-branding',
  '/custom-dashboards',
  '/business-consulting',
  '/case-studies',
  '/pricing',
  // Legal.
  '/privacy-policy',
  '/refund-policy',
  '/terms',
  '/disclaimer',
  // Existing pages.
  '/services',
  '/products',
  '/work',
  '/contact'
];

const hrefs: Href[] = [
  ...staticHrefs,
  ...productSlugs.map(
    (slug) => ({pathname: '/products/[slug]', params: {slug}}) as Href
  ),
  ...industrySlugs.map(
    (slug) => ({pathname: '/industries/[slug]', params: {slug}}) as Href
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
    changeFrequency: 'monthly',
    alternates: {languages}
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  return hrefs.map(entry);
}
