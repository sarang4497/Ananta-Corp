import type {Metadata, Viewport} from 'next';
import type {ReactNode} from 'react';
import {Geist, Geist_Mono, Inter} from 'next/font/google';
import {notFound} from 'next/navigation';
import {hasLocale, NextIntlClientProvider} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import {routing} from '@/i18n/routing';
import {siteUrl} from '@/config';
import SmoothScroll from '@/components/SmoothScroll';
import {Navbar} from '@/components/Navbar';
import {Footer} from '@/components/Footer';
import {ChatWidget} from '@/components/chat/ChatWidget';
import {WhatsAppButton} from '@/components/WhatsAppButton';
import {GradientMesh} from '@/components/ui/GradientMesh';
import '../globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap'
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap'
});

// Inter (semibold) — the SaaS-standard navbar typeface; far more legible at
// nav size than the previous display font.
const inter = Inter({
  variable: '--font-inter',
  weight: '600',
  subsets: ['latin'],
  display: 'swap'
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl)
};

export const viewport: Viewport = {
  themeColor: '#ffffff'
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;

  // Ensure the incoming `[locale]` is one we support.
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering.
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      {/* overflow-x-clip (not hidden) guards against horizontal scroll on mobile
          without creating a scroll container that would break sticky positioning. */}
      <body className="min-h-dvh overflow-x-clip bg-bg text-ink antialiased">
        <NextIntlClientProvider>
          <SmoothScroll />
          {/* Ambient, slowly drifting multi-color backdrop (pure CSS). */}
          <GradientMesh />
          <div className="relative flex min-h-dvh flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          {/* Sticky WhatsApp contact button (site-wide). */}
          <WhatsAppButton />
          {/* Floating AI assistant — its heavy panel loads in a lazy chunk. */}
          <ChatWidget />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
