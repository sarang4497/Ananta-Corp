import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'it'],
  defaultLocale: 'en',
  // English served at the root (no prefix); Italian under /it/.
  localePrefix: 'as-needed',
  // Root always serves English — never redirect based on the browser language.
  localeDetection: false,
  pathnames: {
    '/': '/',
    // Primary navbar destinations.
    '/lead-generation': {en: '/lead-generation', it: '/generazione-lead'},
    '/websites': {en: '/websites', it: '/siti-web'},
    '/custom-apps': {en: '/custom-apps', it: '/app-personalizzate'},
    '/ai-products': {en: '/ai-products', it: '/prodotti-ai'},
    '/erps': {en: '/erps', it: '/erp'},
    '/content-branding': {en: '/content-branding', it: '/content-branding'},
    '/custom-dashboards': {en: '/custom-dashboards', it: '/custom-dashboards'},
    '/business-consulting': {en: '/business-consulting', it: '/business-consulting'},
    '/case-studies': {en: '/case-studies', it: '/casi-studio'},
    '/pricing': {en: '/pricing', it: '/pricing'},
    '/industries/[slug]': {en: '/industries/[slug]', it: '/industries/[slug]'},
    '/privacy-policy': {en: '/privacy-policy', it: '/privacy-policy'},
    '/refund-policy': {en: '/refund-policy', it: '/refund-policy'},
    '/terms': {en: '/terms', it: '/terms'},
    '/disclaimer': {en: '/disclaimer', it: '/disclaimer'},
    // Existing pages (still reachable, footer + deep links). The legacy
    // /products listing keeps its own IT slug (/prodotti) so it doesn't clash
    // with the navbar's /ai-products → /prodotti-ai.
    '/services': {en: '/services', it: '/servizi'},
    '/products': {en: '/products', it: '/prodotti'},
    '/products/[slug]': {en: '/products/[slug]', it: '/prodotti/[slug]'},
    '/work': {en: '/work', it: '/lavori'},
    '/contact': {en: '/contact', it: '/contatti'}
  }
});
