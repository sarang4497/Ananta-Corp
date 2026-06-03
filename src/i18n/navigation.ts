import {createNavigation} from 'next-intl/navigation';
import {routing} from './routing';

// Use these everywhere instead of next/link & next/navigation so that
// localized pathnames + the locale prefix are handled automatically.
export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);
