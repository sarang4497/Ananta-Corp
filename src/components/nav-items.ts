import type {ComponentProps} from 'react';
import type {Link} from '@/i18n/navigation';

type Href = ComponentProps<typeof Link>['href'];

/** Primary navigation, shared by the Navbar (desktop + mobile) and Footer. */
export const navItems: ReadonlyArray<{href: Href; key: string}> = [
  {href: '/lead-generation', key: 'leadGeneration'},
  {href: '/websites', key: 'websites'},
  {href: '/custom-apps', key: 'customApps'},
  {href: '/ai-products', key: 'aiProducts'},
  {href: '/erps', key: 'erps'},
  {href: '/content-branding', key: 'contentBranding'},
  {href: '/case-studies', key: 'caseStudies'},
  {href: '/pricing', key: 'pricing'}
];
