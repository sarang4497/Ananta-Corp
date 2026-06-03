import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {
  QrCode,
  TrendingUp,
  PhoneCall,
  CalendarCheck,
  Users,
  MapPin,
  Star,
  MessageCircle,
  Globe,
  Sparkles,
  type LucideIcon
} from 'lucide-react';
import {Reveal, RevealItem} from '@/components/ui/Reveal';
import {SectionHeading} from '@/components/ui/SectionHeading';
import {buttonClassName} from '@/components/ui/Button';
import {CountUpStat, STAT_ACCENTS, type StatItem} from '@/components/home/StatsSection';
import {AskBellaButton} from '@/components/chat/AskBellaButton';
import {RevenuePerGuest} from '@/components/restaurants/RevenuePerGuest';
import {RestaurantFlow} from '@/components/restaurants/RestaurantFlow';
import {RestaurantImpactCharts} from '@/components/restaurants/RestaurantImpactCharts';
import {DentalFaq} from '@/components/dental/DentalFaq';
import {accentChip, type Accent} from '@/components/demos/demoAccent';
import {whatsappUrl} from '@/lib/whatsapp';
import {slugify} from '@/lib/slug';
import {cn} from '@/lib/cn';
import {buildAlternates} from '@/lib/metadata';

type Params = {params: Promise<{locale: string}>};

// Live QR-menu demo (only5stars) — opens in a new tab.
const DEMO_URL = 'https://www.only5stars.co/en/demoqrmenu/1';

// Per-service icons (same order as the services in messages).
const SERVICE_ICONS: LucideIcon[] = [
  QrCode, TrendingUp, PhoneCall, CalendarCheck, Users, MapPin, Star, MessageCircle, Globe
];
const DIFF_ICONS: LucideIcon[] = [QrCode, Star, MessageCircle, Sparkles];

// Per-card accent colour (icon + hover glow), kept within the brand palette.
const accentGlow: Record<Accent, string> = {
  blue: 'hover:border-blue/30 hover:shadow-[0_24px_60px_-24px_rgba(24,119,242,0.45)]',
  indigo: 'hover:border-indigo/30 hover:shadow-[0_24px_60px_-24px_rgba(79,70,229,0.45)]',
  orange: 'hover:border-orange/30 hover:shadow-[0_24px_60px_-24px_rgba(249,115,22,0.45)]',
  green: 'hover:border-green/30 hover:shadow-[0_24px_60px_-24px_rgba(34,197,94,0.45)]',
  red: 'hover:border-red/30 hover:shadow-[0_24px_60px_-24px_rgba(239,68,68,0.45)]',
  brand: 'hover:border-indigo/30 hover:shadow-[0_24px_60px_-24px_rgba(79,70,229,0.45)]'
};
const DIFF_ACCENTS: Accent[] = ['indigo', 'green', 'blue', 'orange'];
const SERVICE_ACCENTS: Accent[] = [
  'indigo', 'blue', 'green', 'orange', 'red', 'indigo', 'blue', 'green', 'orange'
];

type RevenueLabels = {
  kicker: string;
  heading: string;
  oldLabel: string;
  oldItems: string;
  oldDesc: string;
  newLabel: string;
  newItems: string;
  newDesc: string;
  note: string;
};

// Soft ambient brand glow — decorative depth, CSS only, behind content.
function AmbientGlow({className, color}: {className?: string; color: string}) {
  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none absolute -z-10 rounded-full blur-3xl motion-safe:animate-drift-slow',
        className
      )}
      style={{backgroundImage: `radial-gradient(circle, ${color}, transparent 70%)`}}
    />
  );
}

export async function generateMetadata({params}: Params): Promise<Metadata> {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pages.industries.restaurants.meta');
  return {
    title: t('title'),
    description: t('description'),
    alternates: buildAlternates(
      {pathname: '/industries/[slug]', params: {slug: 'restaurants'}},
      locale
    )
  };
}

export default async function RestaurantsPage({params}: Params) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pages.industries.restaurants');

  const stats = t.raw('stats') as StatItem[];
  const revenue = t.raw('revenue') as RevenueLabels;
  const diffCards = t.raw('difference.cards') as {title: string; body: string}[];
  const flowStages = t.raw('flow.stages') as {title: string; body: string}[];
  const services = t.raw('services') as {name: string; benefit: string}[];
  const faqItems = t.raw('faq.items') as {q: string; a: string}[];

  return (
    <>
      {/* 1 · Hero (no eyebrow) */}
      <section className="relative isolate shell pb-4 pt-14 text-center sm:pt-16">
        <AmbientGlow
          className="left-1/2 -top-10 h-72 w-[48rem] max-w-[94vw] -translate-x-1/2"
          color="rgba(79,70,229,0.14)"
        />
        <Reveal trigger="load" stagger={0.1} className="flex flex-col items-center gap-5">
          <RevealItem>
            <h1 className="text-balance text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-6xl">
              {t('hero.title')}
            </h1>
          </RevealItem>
          <RevealItem>
            <p className="mx-auto max-w-2xl text-pretty text-lg leading-relaxed text-muted">
              {t('hero.sub')}
            </p>
          </RevealItem>
          <RevealItem>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClassName('blue', 'lg', 'btn-sheen font-bold')}
              >
                Book a call
              </a>
              <a
                href={DEMO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClassName('primary', 'lg', 'btn-sheen font-bold')}
              >
                {t('demoCta')}
              </a>
              <AskBellaButton className={buttonClassName('secondary', 'lg')}>Ask Bella</AskBellaButton>
            </div>
          </RevealItem>
        </Reveal>
      </section>

      {/* 2 · Stats row (illustrative industry numbers) */}
      <section className="shell pb-10 pt-2 sm:pb-12">
        <Reveal
          stagger={0.08}
          className="mx-auto grid max-w-4xl grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4 sm:gap-8"
        >
          {stats.map((s, i) => (
            <RevealItem key={s.label}>
              <CountUpStat {...s} accent={STAT_ACCENTS[i % STAT_ACCENTS.length]} />
            </RevealItem>
          ))}
        </Reveal>
        <Reveal className="mx-auto mt-7 max-w-2xl text-center">
          <p className="text-xs leading-relaxed text-muted">{t('statsNote')}</p>
        </Reveal>
      </section>

      {/* 3 · The Market Reality + revenue-per-guest diagram */}
      <section className="border-y border-border bg-bg-soft/40">
        <div className="shell py-12 sm:py-14">
          <Reveal className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-red">
              The Market Reality
            </span>
            <h2 className="text-balance text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              {t('market.heading')}
            </h2>
            {/* Body paragraph stays left-aligned for readability on mobile. */}
            <p className="text-left text-base leading-relaxed text-muted sm:text-center sm:text-lg">
              {t('market.body')}
            </p>
          </Reveal>
          <Reveal className="mx-auto mt-10 w-full max-w-5xl sm:mt-12">
            <RevenuePerGuest {...revenue} />
          </Reveal>
          {/* See the QR digital menu + AI upsell for real. */}
          <Reveal className="mt-8 flex justify-center">
            <a
              href={DEMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClassName('primary', 'lg', 'btn-sheen font-bold')}
            >
              {t('demoCta')}
            </a>
          </Reveal>
        </div>
      </section>

      {/* 4 · The SMI Difference */}
      <section className="relative isolate shell py-12 sm:py-14">
        <AmbientGlow
          className="left-1/2 top-6 h-64 w-[44rem] max-w-[92vw] -translate-x-1/2"
          color="rgba(79,70,229,0.10)"
        />
        <Reveal>
          <SectionHeading title={t('difference.heading')} />
        </Reveal>
        <Reveal stagger={0.06} className="mt-8 grid gap-6 sm:mt-10 sm:grid-cols-2">
          {diffCards.map((c, i) => {
            const Icon = DIFF_ICONS[i % DIFF_ICONS.length];
            const accent = DIFF_ACCENTS[i % DIFF_ACCENTS.length];
            return (
              <RevealItem key={c.title} className="h-full">
                <div
                  className={cn(
                    'group flex h-full flex-col items-center gap-3 rounded-2xl border border-border bg-bg p-7 text-center shadow-card transition-all duration-300 hover:-translate-y-1 sm:items-start sm:text-left',
                    accentGlow[accent]
                  )}
                >
                  <span
                    className={cn(
                      'grid h-12 w-12 shrink-0 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-110',
                      accentChip[accent]
                    )}
                  >
                    <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden />
                  </span>
                  <h3 className="text-lg font-semibold tracking-tight text-ink sm:text-xl">{c.title}</h3>
                  <p className="text-[15px] leading-relaxed text-muted">{c.body}</p>
                </div>
              </RevealItem>
            );
          })}
        </Reveal>
      </section>

      {/* 5 · How it works — interactive flow */}
      <section className="border-y border-border bg-bg-soft/40">
        <div className="shell py-12 sm:py-14">
          <Reveal>
            <SectionHeading title={t('flow.heading')} />
          </Reveal>
          <Reveal className="mt-8 sm:mt-10">
            <RestaurantFlow stages={flowStages} intro={t('flow.intro')} />
          </Reveal>
        </div>
      </section>

      {/* 6 · Business impact — charts */}
      <section className="relative isolate shell py-12 sm:py-14">
        <AmbientGlow
          className="-bottom-10 left-0 h-72 w-[40rem] max-w-[90vw]"
          color="rgba(176,106,158,0.12)"
        />
        <Reveal>
          <SectionHeading title={t('impact.heading')} />
        </Reveal>
        <Reveal className="mt-8 sm:mt-10">
          <RestaurantImpactCharts
            chart1Title={t('impact.chart1Title')}
            chart1Caption={t('impact.chart1Caption')}
            chart2Title={t('impact.chart2Title')}
            chart2Caption={t('impact.chart2Caption')}
          />
        </Reveal>
        <Reveal className="mx-auto mt-8 max-w-3xl text-center">
          <p className="text-sm leading-relaxed text-muted">{t('impact.caption')}</p>
        </Reveal>
      </section>

      {/* 7 · Restaurant services grid (anchor IDs match the Industries nav) */}
      <section className="border-y border-border bg-bg-soft/40">
        <div className="shell py-12 sm:py-14">
          <Reveal>
            <SectionHeading title={t('servicesHeading')} />
          </Reveal>
          <Reveal stagger={0.05} className="mt-8 grid gap-6 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => {
              const Icon = SERVICE_ICONS[i % SERVICE_ICONS.length];
              const accent = SERVICE_ACCENTS[i % SERVICE_ACCENTS.length];
              return (
                <RevealItem key={s.name} className="h-full">
                  <div
                    id={slugify(s.name)}
                    className={cn(
                      'group flex h-full flex-col items-center gap-3 rounded-2xl border border-border bg-bg p-7 text-center shadow-card transition-all duration-300 hover:-translate-y-1 sm:items-start sm:text-left',
                      accentGlow[accent]
                    )}
                  >
                    <span className={cn('grid h-12 w-12 shrink-0 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-110', accentChip[accent])}>
                      <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden />
                    </span>
                    <h3 className="text-lg font-semibold leading-tight tracking-tight text-ink sm:text-xl">
                      {s.name}
                    </h3>
                    <p className="text-[15px] leading-relaxed text-muted">{s.benefit}</p>
                  </div>
                </RevealItem>
              );
            })}
          </Reveal>
        </div>
      </section>

      {/* 8 · FAQ */}
      <section className="relative isolate shell py-12 sm:py-14">
        <AmbientGlow
          className="right-0 top-8 h-64 w-[36rem] max-w-[88vw]"
          color="rgba(24,119,242,0.10)"
        />
        <Reveal>
          <SectionHeading title={t('faq.heading')} />
        </Reveal>
        <Reveal className="mt-8 sm:mt-10">
          <DentalFaq items={faqItems} />
        </Reveal>
      </section>

      {/* 9 · Closing CTA band + disclaimer */}
      <section
        className="relative text-white"
        style={{
          backgroundImage:
            'linear-gradient(110deg, #2563EB 0%, #4F46E5 45%, #6D5BD0 70%, #B06A9E 100%)'
        }}
      >
        <div className="shell flex flex-col items-center gap-5 py-14 text-center sm:py-16">
          <Reveal className="flex flex-col items-center gap-5">
            <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              {t('closing.heading')}
            </h2>
            <p className="max-w-2xl text-pretty text-base leading-relaxed text-white/90 sm:text-lg">
              {t('closing.sub')}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-bold text-blue no-underline shadow-sm transition-transform duration-200 hover:-translate-y-0.5"
              >
                Book a call
              </a>
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white no-underline transition-colors hover:bg-white/10"
              >
                WhatsApp
              </a>
              <AskBellaButton className="inline-flex items-center justify-center rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10">
                Ask Bella
              </AskBellaButton>
            </div>
            <p className="mt-4 max-w-3xl text-pretty text-xs leading-relaxed text-white/70">
              {t('closing.disclaimer')}
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
