import type {Metadata} from 'next';
import {Fragment, type ReactNode} from 'react';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {
  Stethoscope,
  ShoppingBag,
  ShoppingCart,
  Factory,
  Smartphone,
  Trophy,
  Landmark,
  Building2,
  Navigation,
  ShieldCheck,
  CreditCard,
  Newspaper,
  Bus,
  Medal,
  Gamepad2,
  Droplet,
  HardHat,
  House,
  type LucideIcon
} from 'lucide-react';
import {Reveal, RevealItem} from '@/components/ui/Reveal';
import {buttonClassName} from '@/components/ui/Button';
import {CountUpStat, STAT_ACCENTS, type StatItem} from '@/components/home/StatsSection';
import {AskBellaButton} from '@/components/chat/AskBellaButton';
import {CaseStudy, type Impact} from '@/components/case-studies/CaseStudy';
import {SitePreview} from '@/components/case-studies/SitePreview';
import {HiringFlow} from '@/components/case-studies/HiringFlow';
import {ClientPhotosPair} from '@/components/case-studies/ClientPhotosPair';
import {DentalTestimonialVideo} from '@/components/dental/DentalTestimonialVideo';
import type {Accent} from '@/components/demos/demoAccent';
import {whatsappUrl} from '@/lib/whatsapp';
import {cn} from '@/lib/cn';
import {buildAlternates} from '@/lib/metadata';

type Params = {params: Promise<{locale: string}>};

const DENTAL_VIDEO = 'vSHgV3tcfgA';

type CaseConfig = {accent: Accent; Icon: LucideIcon; jarvis: boolean; featured?: 'dental' | 'hstus' | 'lubi'};

// Structural metadata per case (in the same order as messages `cases`).
const CONFIG: CaseConfig[] = [
  {accent: 'blue', Icon: Stethoscope, jarvis: false, featured: 'dental'},
  {accent: 'green', Icon: ShoppingBag, jarvis: false},
  {accent: 'orange', Icon: ShoppingCart, jarvis: false, featured: 'hstus'},
  {accent: 'indigo', Icon: Factory, jarvis: false, featured: 'lubi'},
  {accent: 'blue', Icon: Smartphone, jarvis: true},
  {accent: 'green', Icon: Trophy, jarvis: true},
  {accent: 'indigo', Icon: Landmark, jarvis: true},
  {accent: 'orange', Icon: Building2, jarvis: true},
  {accent: 'blue', Icon: Navigation, jarvis: true},
  {accent: 'red', Icon: ShieldCheck, jarvis: true},
  {accent: 'indigo', Icon: CreditCard, jarvis: true},
  {accent: 'orange', Icon: Newspaper, jarvis: true},
  {accent: 'green', Icon: Bus, jarvis: true},
  {accent: 'blue', Icon: Medal, jarvis: true},
  {accent: 'indigo', Icon: Gamepad2, jarvis: true},
  {accent: 'red', Icon: Droplet, jarvis: true},
  {accent: 'orange', Icon: HardHat, jarvis: true},
  {accent: 'blue', Icon: House, jarvis: true}
];

// Display order (decoupled from the JSON array so both locales stay aligned with
// CONFIG/media by index): Lubi (3) is shown above Nisarg (1); HSTUS (2) follows.
const ORDER = [0, 3, 1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

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
  const t = await getTranslations('pages.caseStudies.meta');
  return {
    title: t('title'),
    description: t('description'),
    alternates: buildAlternates('/case-studies', locale)
  };
}

export default async function CaseStudiesPage({params}: Params) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pages.caseStudies');

  const stats = t.raw('stats') as StatItem[];
  const labels = t.raw('labels') as {problem: string; did: string};
  const jarvisCredit = t('jarvisCredit');
  const featured = t.raw('featured') as {
    dentalVideoPlaceholder: string;
    dentalCta: string;
    hstusCta: string;
    lubiCta: string;
  };
  const cases = t.raw('cases') as {
    tag: string;
    title: string;
    tagline: string;
    problem: string;
    did: string;
    bullets?: string[];
    impactValue?: string;
    impactLabel: string;
    chips?: string[];
  }[];

  // Lazy featured media (built here, passed into the server CaseStudy).
  const media: Record<number, ReactNode> = {
    0: (
      <div className="flex flex-col gap-6">
        <div className="mx-auto w-full max-w-3xl">
          <DentalTestimonialVideo youtubeId={DENTAL_VIDEO} placeholder={featured.dentalVideoPlaceholder} />
        </div>
        <SitePreview
          url="https://dentallandingpage-theta.vercel.app/"
          host="dentallandingpage-theta.vercel.app"
          cta={featured.dentalCta}
          heightClass="h-[420px] sm:h-[560px] lg:h-[680px]"
        />
      </div>
    ),
    2: (
      <SitePreview
        url="https://hstus.com"
        host="hstus.com"
        cta={featured.hstusCta}
        image="/case-studies/hstus-preview.jpg"
      />
    ),
    3: (
      <div className="flex flex-col gap-8">
        {/* Impact shown visually — the AI hiring pipeline at a glance. */}
        <HiringFlow />
        <SitePreview url="https://lubielectronics.com" host="lubielectronics.com" cta={featured.lubiCta} />
      </div>
    )
  };

  return (
    <>
      {/* Hero (no eyebrow) */}
      <section className="relative isolate shell pb-6 pt-14 text-center sm:pt-16">
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
            <p className="mx-auto max-w-2xl text-pretty text-lg leading-relaxed text-muted">{t('hero.sub')}</p>
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
              <AskBellaButton className={buttonClassName('secondary', 'lg')}>Ask Bella</AskBellaButton>
            </div>
          </RevealItem>
        </Reveal>
      </section>

      {/* Proof stats */}
      <section className="shell pb-4 pt-2 sm:pb-6">
        {/* Five stats — flex-wrap + justify-center so odd rows stay centered:
            2 per line on mobile, 3 on tablet, all 5 on desktop. */}
        <Reveal stagger={0.08} className="mx-auto flex max-w-5xl flex-wrap items-start justify-center gap-x-8 gap-y-10 sm:gap-x-10">
          {stats.map((s, i) => (
            <RevealItem key={s.label} className="w-[40%] sm:w-[28%] lg:w-[16%]">
              <CountUpStat {...s} accent={STAT_ACCENTS[i % STAT_ACCENTS.length]} />
            </RevealItem>
          ))}
        </Reveal>
      </section>

      {/* The 18 case studies, stacked. Render order is decoupled from the JSON
          array order (which stays aligned with CONFIG/media across locales):
          Lubi (orig index 3) is shown ABOVE Nisarg (orig index 1). */}
      <section className="relative isolate shell py-12 sm:py-16">
        <AmbientGlow
          className="right-0 top-1/3 h-72 w-[40rem] max-w-[90vw]"
          color="rgba(24,119,242,0.08)"
        />
        <div className="flex flex-col gap-16 sm:gap-20 lg:gap-24">
          {ORDER.map((orig, pos) => {
            const c = cases[orig];
            const cfg = CONFIG[orig];
            const impact: Impact = {value: c.impactValue, label: c.impactLabel, chips: c.chips};
            const isFeature = cfg.featured === 'dental' || cfg.featured === 'lubi';
            const node = (
              <CaseStudy
                index={pos}
                accent={cfg.accent}
                Icon={cfg.Icon}
                tag={c.tag}
                title={c.title}
                tagline={c.tagline}
                problem={c.problem}
                did={c.did}
                bullets={c.bullets}
                impact={impact}
                labels={labels}
                jarvisCredit={cfg.jarvis ? jarvisCredit : undefined}
                media={media[orig]}
                layout={isFeature ? 'feature' : 'split'}
              />
            );
            return (
              <Fragment key={c.title}>
                {node}
                {/* The two real client photos live at the END of the dental case
                    study — side by side, full content width. */}
                {cfg.featured === 'dental' ? (
                  <Reveal>
                    <ClientPhotosPair />
                  </Reveal>
                ) : null}
              </Fragment>
            );
          })}
        </div>
      </section>

      {/* Closing CTA band + disclaimer */}
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
