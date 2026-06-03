import type {Metadata} from 'next';
import {getPathname} from '@/i18n/navigation';
import {routing} from '@/i18n/routing';
import {siteUrl} from '@/config';

type Href = Parameters<typeof getPathname>[0]['href'];

function absolute(href: Href, locale: string) {
  return siteUrl + getPathname({href, locale});
}

/**
 * Build canonical + hreflang alternates for a page. `href` is the internal
 * pathname (e.g. '/services' or {pathname:'/products/[slug]', params}); localized
 * slugs and locale prefixes are resolved via getPathname.
 *
 * - canonical → current locale's URL
 * - languages → one entry per locale (en, it)
 * - x-default → English (the default locale, served at the root)
 */
export function buildAlternates(
  href: Href,
  locale: string
): Metadata['alternates'] {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    languages[l] = absolute(href, l);
  }
  languages['x-default'] = absolute(href, routing.defaultLocale);

  return {
    canonical: absolute(href, locale),
    languages
  };
}
