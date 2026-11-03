import type {Metadata, Viewport} from 'next';
import type {ReactNode} from 'react';
import {Geist, Geist_Mono} from 'next/font/google';
import {notFound} from 'next/navigation';
import {hasLocale, NextIntlClientProvider} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import {routing} from '@/i18n/routing';
import {siteUrl} from '@/config';
import {Header} from '@/components/site/Header';
import {NavPostsProvider} from '@/components/site/NavPosts';
import {NAV_POSTS} from '@/content/nav-posts';
import {Footer} from '@/components/site/Footer';
import {ContactDock} from '@/components/site/ContactDock';
import {RevealObserver} from '@/components/motion/RevealObserver';
import {ChatWidget} from '@/components/chat/ChatWidget';
import {SearchHost} from '@/components/search/SearchHost';
import {organizationJsonLd} from '@/lib/jsonld';
import '@/styles/globals.css';

// One family (Geist) + its mono for technical labels. Inter was dropped.
const geistSans = Geist({variable: '--font-geist-sans', subsets: ['latin'], display: 'swap'});
const geistMono = Geist_Mono({variable: '--font-geist-mono', subsets: ['latin'], display: 'swap', weight: ['400', '500']});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Ananta Corporation | Plywood, MDF & Board Supplier in Ahmedabad',
    template: '%s | Ananta Corporation'
  },
  openGraph: {
    siteName: 'Ananta Corporation',
    type: 'website',
    locale: 'en_IN',
    images: [{url: '/images/scenes/living-wood.webp', width: 1200, height: 546, alt: 'Wood-panelled interior'}]
  },
  twitter: {card: 'summary_large_image'}
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover'
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

// Set html.js before first paint so reveal start-states only exist when JS
// runs (no-JS visitors and crawlers always see all content).
const JS_FLAG = "document.documentElement.classList.add('js')";

export default async function LocaleLayout({children, params}: {children: ReactNode; params: Promise<{locale: string}>}) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html lang={locale} className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{__html: JS_FLAG}} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(organizationJsonLd())}} />
      </head>
      <body className="min-h-dvh overflow-x-clip bg-bg text-ink antialiased">
        <NextIntlClientProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[80] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-indigo focus:shadow-lift"
          >
            Skip to content
          </a>
          <RevealObserver />
          <div className="relative flex min-h-dvh flex-col">
            <NavPostsProvider posts={NAV_POSTS}>
              <Header />
            </NavPostsProvider>
            <main id="main" className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <ContactDock />
          <ChatWidget />
          <SearchHost />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
