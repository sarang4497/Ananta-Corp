import type {ComponentProps} from 'react';
import type {Link} from '@/i18n/navigation';

type Href = ComponentProps<typeof Link>['href'];

/** Primary navigation, shared by the Navbar (desktop + mobile) and Footer.
 *  Groundwork: just Contact until the Ananta product pages are designed. */
export const navItems: ReadonlyArray<{href: Href; key: string}> = [
  {href: '/contact', key: 'contact'}
];
