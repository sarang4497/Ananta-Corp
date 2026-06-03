import type {LucideIcon} from 'lucide-react';
import {Check} from 'lucide-react';
import {getTranslations} from 'next-intl/server';
import {Reveal, RevealItem} from '@/components/ui/Reveal';
import {SectionHeading} from '@/components/ui/SectionHeading';
import {Pill} from '@/components/ui/Pill';
import {buttonClassName} from '@/components/ui/Button';
import {StatsSection, type StatItem} from '@/components/home/StatsSection';
import {AskBellaButton} from '@/components/chat/AskBellaButton';
import {accentChip, type Accent} from '@/components/demos/demoAccent';
import {whatsappUrl} from '@/lib/whatsapp';
import {slugify} from '@/lib/slug';
import {cn} from '@/lib/cn';

type Service = {name: string; benefit: string};
type TitledBody = {title: string; body: string};

/**
 * Shared service / industry page template — Suby-structured, objective:
 *   Hero → The Market Reality → Our Approach → services grid → Why Us →
 *   Outcome → Closing CTA. Design-system styled, no black, 1.5cm gutters,
 *   scroll-in animation. Each services grid item carries an anchor ID
 *   (slugify(name)) matching the nav mega-menu links.
 */
export async function PageTemplate({
  namespace,
  accent,
  icons,
  stats,
  demoHref
}: {
  namespace: string;
  accent: Accent;
  icons: LucideIcon[];
  /** Real count-up stats (e.g. Dental) — optional. */
  stats?: StatItem[];
  /** Adds a "Experience live demo" hero CTA (e.g. Restaurants). */
  demoHref?: string;
}) {
  const t = await getTranslations(namespace);
  const services = t.raw('services') as Service[];
  const why = t.raw('why') as TitledBody[];

  const primaryCta = (
    <a
      href={whatsappUrl()}
      target="_blank"
      rel="noopener noreferrer"
      className={buttonClassName('blue', 'lg', 'font-bold')}
    >
      Book a call
    </a>
  );
  const askBella = (
    <AskBellaButton className={buttonClassName('secondary', 'lg')}>Ask Bella</AskBellaButton>
  );

  return (
    <>
      {/* 1 · Hero */}
      <section className="shell pb-10 pt-16 text-center sm:pt-20">
        <Reveal trigger="load" stagger={0.1} className="flex flex-col items-center gap-5">
          <RevealItem>
            <Pill>{t('hero.eyebrow')}</Pill>
          </RevealItem>
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
              {primaryCta}
              {askBella}
              {demoHref ? (
                <a
                  href={demoHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonClassName('secondary', 'lg')}
                >
                  Experience live demo
                </a>
              ) : null}
            </div>
          </RevealItem>
        </Reveal>
      </section>

      {/* Real count-up stats (Dental). */}
      {stats && stats.length > 0 ? <StatsSection stats={stats} /> : null}

      {/* 2 · The Market Reality + 3 · Our Approach */}
      <section className="border-y border-border bg-bg-soft/40">
        <div className="shell grid gap-10 py-14 sm:py-20 lg:grid-cols-2 lg:gap-16">
          <Reveal className="flex flex-col items-center gap-4 text-center sm:items-start sm:text-left">
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-red">
              The Market Reality
            </span>
            <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              {t('market.heading')}
            </h2>
            {/* Body paragraph stays left-aligned for readability. */}
            <p className="text-left text-base leading-relaxed text-muted sm:text-lg">{t('market.body')}</p>
          </Reveal>
          <Reveal className="flex flex-col items-center gap-4 text-center sm:items-start sm:text-left">
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-indigo">
              Our Approach
            </span>
            <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              {t('approach.heading')}
            </h2>
            <p className="text-left text-base leading-relaxed text-muted sm:text-lg">{t('approach.body')}</p>
          </Reveal>
        </div>
      </section>

      {/* 4 · Services grid (anchor IDs match the nav). */}
      <section className="shell py-14 sm:py-20">
        <Reveal>
          <SectionHeading title={t('servicesHeading')} />
        </Reveal>
        <Reveal stagger={0.06} className="mt-10 grid gap-7 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => {
            const Icon = icons[i % icons.length];
            return (
              <RevealItem key={s.name} className="h-full">
                <div
                  id={slugify(s.name)}
                  className="group flex h-full flex-col items-center gap-3 rounded-2xl border border-border bg-bg p-7 text-center shadow-card transition-all duration-300 hover:-translate-y-1 sm:items-start sm:p-8 sm:text-left"
                >
                  <span
                    className={cn(
                      'grid h-12 w-12 shrink-0 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-110',
                      accentChip[accent]
                    )}
                  >
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
      </section>

      {/* 5 · Why Studio Marketing Italia */}
      <section className="border-y border-border bg-bg-soft/40">
        <div className="shell py-14 sm:py-20">
          <Reveal>
            <SectionHeading title={t('whyHeading')} />
          </Reveal>
          <Reveal stagger={0.06} className="mt-10 grid gap-6 sm:mt-12 sm:grid-cols-2">
            {why.map((w) => (
              <RevealItem key={w.title} className="h-full">
                <div className="flex h-full gap-3.5 rounded-2xl border border-border bg-bg p-6 shadow-card">
                  <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-blue/10 text-blue">
                    <Check className="h-4 w-4" strokeWidth={2.5} aria-hidden />
                  </span>
                  <div className="flex flex-col gap-1.5">
                    <h3 className="text-lg font-semibold text-ink">{w.title}</h3>
                    <p className="text-[15px] leading-relaxed text-muted">{w.body}</p>
                  </div>
                </div>
              </RevealItem>
            ))}
          </Reveal>
        </div>
      </section>

      {/* 6 · Outcome (qualitative — TODO real numbers) */}
      <section className="shell py-14 text-center sm:py-20">
        <Reveal className="mx-auto flex max-w-3xl flex-col items-center gap-4">
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-green">
            The Outcome
          </span>
          <h2 className="text-balance text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            {t('outcome.heading')}
          </h2>
          <p className="text-pretty text-base leading-relaxed text-muted sm:text-lg">
            {t('outcome.body')}
          </p>
        </Reveal>
      </section>

      {/* 7 · Closing CTA band (full-bleed gradient; inner text on the gutter). */}
      <section
        className="relative text-white"
        style={{
          backgroundImage:
            'linear-gradient(110deg, #2563EB 0%, #4F46E5 45%, #6D5BD0 70%, #B06A9E 100%)'
        }}
      >
        <div className="shell flex flex-col items-center gap-5 py-16 text-center sm:py-20">
          <Reveal className="flex flex-col items-center gap-5">
            <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              {t('closing.heading')}
            </h2>
            <p className="max-w-2xl text-pretty text-base leading-relaxed text-white/90 sm:text-lg">
              {t('closing.body')}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-bold text-blue no-underline shadow-sm transition-transform duration-200 hover:-translate-y-0.5"
              >
                Book a call
              </a>
              <AskBellaButton className="inline-flex items-center justify-center rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10">
                Ask Bella
              </AskBellaButton>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
