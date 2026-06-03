import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

// Next.js 16 renames the middleware entrypoint to `proxy.ts`.
export default createMiddleware(routing);

export const config = {
  // Match everything EXCEPT:
  //  - /api, /_next, /_vercel
  //  - any path containing a dot (files like favicon.ico, images, etc.)
  // while still matching the unprefixed root `/`.
  matcher: '/((?!api|_next|_vercel|.*\\..*).*)'
};
