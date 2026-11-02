import {siteUrl} from '@/config';
import {COMPANY} from '@/content/site';
import type {Product} from '@/data/products';

/**
 * Structured data — only verifiable facts (research/ANANTA_CONTENT_TRUTH.md).
 * No ratings, no reviews, no opening hours (unconfirmed), no "leading".
 */
export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness'],
    '@id': `${siteUrl}/#organization`,
    name: COMPANY.name,
    url: siteUrl,
    logo: `${siteUrl}/images/logo/Ananta-Logo.png`,
    image: `${siteUrl}/images/scenes/living-wood.webp`,
    description:
      'Supplier of plywood, MDF, HDHMR, HMR boards, pre-laminated particle boards, flush doors and smart locks in Ahmedabad, Gujarat.',
    foundingDate: COMPANY.since,
    telephone: '+918320052838',
    email: COMPANY.email,
    vatID: COMPANY.gstin,
    address: {
      '@type': 'PostalAddress',
      streetAddress: COMPANY.street,
      addressLocality: COMPANY.city,
      addressRegion: COMPANY.region,
      postalCode: COMPANY.postalCode,
      addressCountry: 'IN'
    },
    areaServed: [
      {'@type': 'City', name: 'Ahmedabad'},
      {'@type': 'State', name: 'Gujarat'}
    ],
    sameAs: [COMPANY.instagram, COMPANY.facebook],
    knowsAbout: ['Plywood', 'MDF Board', 'HDHMR Board', 'HMR Board', 'Pre-Laminated Particle Board', 'Flush Door', 'Smart Locks']
  };
}

export function productJsonLd(p: Product, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    description: p.summary,
    brand: {'@type': 'Brand', name: p.brand},
    category: p.category,
    image: `${siteUrl}${p.cardImage}`,
    url
    // No offers/price/ratings: prices are quoted on request (A1); no reviews invented.
  };
}

export function breadcrumbJsonLd(items: {name: string; url: string}[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({'@type': 'ListItem', position: i + 1, name: it.name, item: it.url}))
  };
}
