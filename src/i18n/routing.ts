import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  // English only for now; the next-intl scaffold stays so more locales can be
  // added later without rewiring links or metadata.
  locales: ['en'],
  defaultLocale: 'en',
  // English served at the root (no prefix).
  localePrefix: 'as-needed',
  localeDetection: false,
  pathnames: {
    '/': '/',
    '/contact': '/contact',
    '/about': '/about',
    '/partners': '/partners',
    '/decor': '/decor',
    // Product catalog: listing → category → subcategory → product detail.
    '/products': '/products',
    '/products/[category]': '/products/[category]',
    '/products/[category]/[sub]': '/products/[category]/[sub]',
    '/products/[category]/[sub]/[slug]': '/products/[category]/[sub]/[slug]',
    // Legal.
    '/privacy': '/privacy',
    '/terms': '/terms'
  }
});
