import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Reveal, RevealItem} from '@/components/ui/Reveal';
import {SectionHeading} from '@/components/ui/SectionHeading';
import {Hero} from '@/components/hero/Hero';
import {PinnedBanner} from '@/components/hero/PinnedBanner';
import {StatsSection, type StatItem} from '@/components/home/StatsSection';
import {ServiceCard} from '@/components/home/ServiceCard';
import {OfferingRow} from '@/components/home/OfferingRow';
import {FlagshipDemo} from '@/components/demos/FlagshipDemo';
import {ContactForm} from '@/components/home/ContactForm';
import {OfficeMap} from '@/components/home/OfficeMap';
import {AboutSections} from '@/components/about/AboutSections';
import {SERVICES, INDUSTRIES} from '@/components/nav-menu';
import type {Accent} from '@/components/demos/demoAccent';
import type {DemoId} from '@/components/demos/OfferingDemo';
import {buildAlternates} from '@/lib/metadata';

type Params = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: Params): Promise<Metadata> {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home.meta');
  return {
    title: t('title'),
    description: t('description'),
    alternates: buildAlternates('/', locale)
  };
}

// Maps each demo (in copy order) to its palette accent + demo chunk.
const DEMOS: {accent: Accent; demoId: DemoId}[] = [
  {accent: 'blue', demoId: 'appFlow'},
  {accent: 'indigo', demoId: 'erp'},
  {accent: 'orange', demoId: 'automation'},
  {accent: 'green', demoId: 'brain'},
  {accent: 'red', demoId: 'acquisition'}
];


export default async function HomePage({params}: Params) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home');

  const serviceCards = t.raw('serviceCards') as {title: string; benefit: string}[];
  const industries = t.raw('industriesSection.items') as {title: string; benefit: string}[];
  const demos = t.raw('demos.items') as {tech: string; benefit: string}[];
  const stats = t.raw('stats') as StatItem[];

  return (
    <>
      {/* Pinned banner — sticks below the navbar as one fixed top block. */}
      <PinnedBanner pill={t.raw('hero.pill') as string[]} />

      {/* Above-the-fold hero video — scrolls beneath the pinned block. */}
      <Hero />

      {/* Stats band — four big count-up numbers, directly below the marquee. */}
      <StatsSection stats={stats} />

      {/* 1 · Services — heading + 7 clickable icon cards. */}
      <section id="services" className="shell pb-12 pt-12 sm:pb-16 sm:pt-16">
        <Reveal>
          <SectionHeading title={t('servicesSection.heading')} />
        </Reveal>
        <Reveal stagger={0.08} className="mt-10 grid grid-cols-1 gap-6 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {SERVICES.map((s, i) => (
            <RevealItem key={s.key} className="h-full">
              <ServiceCard
                icon={s.icon}
                title={serviceCards[i].title}
                benefit={serviceCards[i].benefit}
                accent={s.accent}
                href={s.href}
              />
            </RevealItem>
          ))}
        </Reveal>
      </section>

      {/* 2 · Industries — placed before the demos. */}
      <section id="industries" className="shell pb-12 sm:pb-16">
        <Reveal>
          <SectionHeading title={t('industriesSection.heading')} />
        </Reveal>
        <Reveal stagger={0.08} className="mt-10 grid grid-cols-1 gap-6 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {INDUSTRIES.map((ind, i) => (
            <RevealItem key={ind.slug} className="h-full">
              <ServiceCard
                icon={ind.icon}
                title={industries[i].title}
                benefit={industries[i].benefit}
                accent={ind.accent}
                href={{pathname: '/industries/[slug]', params: {slug: ind.slug}}}
              />
            </RevealItem>
          ))}
        </Reveal>
      </section>

      {/* 3 · Demos — flagship featured demo, then the alternating rows. */}
      <section className="shell pb-12 sm:pb-16">
        {/* Flagship — the largest, full-width showcase, above the rows. */}
        <Reveal className="flex flex-col gap-6">
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 text-center">
            <h3 className="text-balance text-2xl font-semibold leading-tight tracking-tight text-ink sm:text-3xl">
              {t('flagship.heading')}
            </h3>
            <p className="text-pretty text-base leading-relaxed text-muted sm:text-lg">
              {t('flagship.caption')}
            </p>
          </div>
          <FlagshipDemo className="mt-2" />
        </Reveal>

        <div className="mt-12 flex flex-col gap-16 sm:mt-16 sm:gap-20">
          {demos.map((item, i) => (
            <OfferingRow
              key={item.tech}
              index={i + 1}
              tech={item.tech}
              benefit={item.benefit}
              accent={DEMOS[i].accent}
              demoId={DEMOS[i].demoId}
              reversed={i % 2 === 1}
            />
          ))}
        </div>
      </section>

      {/* 4 · About — placed below the demos. Founder's Story + Vision + Team. */}
      <section id="about" className="shell pb-12 sm:pb-16">
        <Reveal>
          <SectionHeading title={t('aboutSection.heading')} />
        </Reveal>
        <div className="mt-10 sm:mt-12">
          <AboutSections />
        </div>
      </section>

      {/* 5 · Contact — "Let's Talk": required form + 3-pin map. Tight top, roomy
          bottom so it sits close to the section above but still feels substantial. */}
      <section id="contact" className="shell pb-20 pt-4 text-center sm:pb-28 sm:pt-6">
        <Reveal>
          <SectionHeading title={t('contact.heading')} />
        </Reveal>
        <Reveal className="mt-10 grid items-stretch gap-10 text-left sm:mt-12 lg:grid-cols-2 lg:gap-14">
          <ContactForm />
          <OfficeMap />
        </Reveal>
      </section>
    </>
  );
}
