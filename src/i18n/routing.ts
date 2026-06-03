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
    '/contact': '/contact'
  }
});
