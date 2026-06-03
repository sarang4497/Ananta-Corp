import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {
  Target,
  Eye,
  Wrench,
  Users,
  Warehouse,
  Truck,
  Factory,
  CheckCircle2,
  Ruler
} from 'lucide-react';
import {PageHero} from '@/components/PageHero';
import {Reveal, RevealItem} from '@/components/ui/Reveal';
import {SectionHeading} from '@/components/ui/SectionHeading';
import {Card} from '@/components/ui/Card';
import {ImagePlaceholder} from '@/components/home/ImagePlaceholder';
import {Testimonials, type Testimonial} from '@/components/home/Testimonials';
import {CtaBand} from '@/components/home/CtaBand';
import {buildAlternates} from '@/lib/metadata';

type Params = {params: Promise<{locale: string}>};

const USP_ICONS = [Wrench, Users, Warehouse, Truck];

export async function generateMetadata({params}: Params): Promise<Metadata> {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('about.meta');
  return {
    title: t('title'),
    description: t('description'),
    alternates: buildAlternates('/about', locale)
  };
}

export default async function AboutPage({params}: Params) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('about');
  const th = await getTranslations('home');
  const tc = await getTranslations('catalog');

  const usps = t.raw('usps.items') as {title: string; body: string}[];
  const facilities = t.raw('facilities.items') as string[];
  const apartTiles = t.raw('apart.items') as {title: string; body: string}[];
  const testimonials = th.raw('testimonials.items') as Testimonial[];

  return (
    <>
      <PageHero eyebrow={t('hero.eyebrow')} title={t('hero.title')} sub={t('hero.sub')} />

      {/* Brand story */}
      <section className="shell grid items-center gap-10 pb-14 lg:grid-cols-2 lg:gap-14">
        <Reveal className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            {t('story.heading')}
          </h2>
          <p className="text-pretty text-[15px] leading-relaxed text-muted">{t('story.p1')}</p>
          <p className="text-pretty text-[15px] leading-relaxed text-muted">{t('story.p2')}</p>
        </Reveal>
        <Reveal delay={0.1}>
          <ImagePlaceholder label={t('story.imageLabel')} className="h-72 w-full sm:h-80" />
        </Reveal>
      </section>

      {/* Mission + Vision (verbatim from the master doc) */}
      <section className="border-y border-border bg-bg-soft">
        <div className="shell grid gap-6 py-12 sm:grid-cols-2 sm:py-14">
          <Reveal>
            <Card accent="indigo" className="h-full gap-3 bg-bg">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-indigo/10 text-indigo">
                <Target className="h-5.5 w-5.5" aria-hidden />
              </span>
              <h3 className="text-lg font-bold text-ink">{t('mission.heading')}</h3>
              <p className="text-sm leading-relaxed text-muted">{t('mission.body')}</p>
            </Card>
          </Reveal>
          <Reveal delay={0.08}>
            <Card accent="orange" className="h-full gap-3 bg-bg">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-orange/10 text-orange-deep">
                <Eye className="h-5.5 w-5.5" aria-hidden />
              </span>
              <h3 className="text-lg font-bold text-ink">{t('vision.heading')}</h3>
              <p className="text-sm leading-relaxed text-muted">{t('vision.body')}</p>
            </Card>
          </Reveal>
        </div>
      </section>

      {/* USPs expanded */}
      <section className="shell pt-14 sm:pt-16">
        <Reveal>
          <SectionHeading eyebrow={t('usps.eyebrow')} title={t('usps.heading')} sub={t('usps.sub')} />
        </Reveal>
        <Reveal stagger={0.07} className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {usps.map((usp, i) => {
            const Icon = USP_ICONS[i % USP_ICONS.length];
            return (
              <RevealItem key={usp.title} className="h-full">
                <Card accent="indigo" className="h-full flex-row items-start gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-orange/10 text-orange-deep">
                    <Icon className="h-6 w-6" aria-hidden />
                  </span>
                  <span>
                    <h3 className="text-base font-bold text-ink">{usp.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">{usp.body}</p>
                  </span>
                </Card>
              </RevealItem>
            );
          })}
        </Reveal>
      </section>

      {/* Facilities */}
      <section className="shell grid items-center gap-10 pt-14 sm:pt-16 lg:grid-cols-2 lg:gap-14">
        <Reveal>
          <ImagePlaceholder label={t('facilities.imageLabel')} className="h-72 w-full sm:h-80" />
        </Reveal>
        <Reveal delay={0.08} className="flex flex-col gap-4">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-indigo/8 text-indigo">
            <Factory className="h-6 w-6" aria-hidden />
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            {t('facilities.heading')}
          </h2>
          <p className="text-pretty text-[15px] leading-relaxed text-muted">{t('facilities.body')}</p>
          <ul className="mt-1 flex flex-col gap-2.5">
            {facilities.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink">
                <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-orange" aria-hidden />
                {f}
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* What sets us apart */}
      <section className="mt-14 bg-bg-warm py-14 sm:mt-16 sm:py-16">
        <div className="shell">
          <Reveal>
            <SectionHeading eyebrow={t('apart.eyebrow')} title={t('apart.heading')} sub={t('apart.sub')} />
          </Reveal>
          <Reveal stagger={0.07} className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {apartTiles.map((tile) => (
              <RevealItem key={tile.title} className="h-full">
                <Card accent="orange" className="h-full gap-2.5 bg-bg">
                  <Ruler className="h-5 w-5 text-indigo" aria-hidden />
                  <h3 className="text-base font-bold text-ink">{tile.title}</h3>
                  <p className="text-sm leading-relaxed text-muted">{tile.body}</p>
                </Card>
              </RevealItem>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Testimonials */}
      <section className="shell pb-4 pt-14 sm:pt-16">
        <Reveal>
          <SectionHeading
            eyebrow={th('testimonials.eyebrow')}
            title={th('testimonials.heading')}
            sub={th('testimonials.sub')}
          />
        </Reveal>
        <Testimonials items={testimonials} />
      </section>

      <div className="pt-12 sm:pt-16">
        <CtaBand
          heading={tc('cta.heading')}
          sub={tc('cta.sub')}
          note={tc('cta.note')}
          ctaWhatsapp={tc('card.price')}
          ctaContact={tc('cta.contact')}
        />
      </div>
    </>
  );
}
