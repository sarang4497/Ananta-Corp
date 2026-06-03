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
    // Product catalog (pages land in later batches; hrefs are wired now).
    '/products': '/products',
    '/products/plywood': '/products/plywood',
    '/products/plywood/moisture-resistant': '/products/plywood/moisture-resistant',
    '/products/plywood/boiling-water-proof': '/products/plywood/boiling-water-proof',
    '/products/mdf': '/products/mdf',
    '/products/mdf/interior-grade': '/products/mdf/interior-grade',
    '/products/mdf/exterior-grade': '/products/mdf/exterior-grade',
    '/products/mdf/hdhmr': '/products/mdf/hdhmr',
    '/products/high-moisture-resistant-board-moist-master':
      '/products/high-moisture-resistant-board-moist-master',
    '/products/pre-laminated-particle-board': '/products/pre-laminated-particle-board',
    '/products/flush-door': '/products/flush-door',
    '/products/smart-locks': '/products/smart-locks',
    // Legal (batch 5).
    '/privacy': '/privacy',
    '/terms': '/terms'
  }
});
