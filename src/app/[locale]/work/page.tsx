import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {PageHero} from '@/components/PageHero';
import {Reveal, RevealItem} from '@/components/ui/Reveal';
import {Card} from '@/components/ui/Card';
import {SectionHeading} from '@/components/ui/SectionHeading';
import {buttonClassName} from '@/components/ui/Button';
import {buildAlternates} from '@/lib/metadata';

type Params = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: Params): Promise<Metadata> {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('work.meta');
  return {
    title: t('title'),
    description: t('description'),
    alternates: buildAlternates('/work', locale)
  };
}

const caseAccents = ['blue', 'orange', 'indigo'] as const;

export default async function WorkPage({params}: Params) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('work');

  const caseStudies = t.raw('caseStudies') as {
    tag: string;
    title: string;
    body: string;
  }[];
  const demos = t.raw('demos.items') as {
    title: string;
    body: string;
    cta: string;
    href: string;
  }[];

  return (
    <>
      <PageHero
        eyebrow={t('hero.eyebrow')}
        title={t('hero.title')}
        sub={t('hero.sub')}
      />

      <section className="shell py-16">
        <Reveal stagger={0.08} className="grid gap-5 sm:grid-cols-3">
          {caseStudies.map((cs, i) => (
            <RevealItem key={cs.title}>
              <Card accent={caseAccents[i]} className="h-full gap-3">
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-border bg-bg-soft/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-indigo">
                  {cs.tag}
                </span>
                <h2 className="text-lg font-semibold text-ink">{cs.title}</h2>
                <p className="text-sm leading-relaxed text-muted">{cs.body}</p>
              </Card>
            </RevealItem>
          ))}
        </Reveal>
      </section>

      <section className="shell py-16">
        <Reveal>
          <SectionHeading
            eyebrow="Demos"
            title={t('demos.heading')}
            sub={t('demos.sub')}
          />
        </Reveal>
        <Reveal stagger={0.1} className="mt-12 grid gap-5 sm:grid-cols-2">
          {demos.map((demo) => (
            <RevealItem key={demo.href}>
              <Card accent="green" className="h-full gap-4">
                <h3 className="text-xl font-semibold text-ink">{demo.title}</h3>
                <p className="text-sm leading-relaxed text-muted">{demo.body}</p>
                {/* Static site under /public — bypasses i18n, so a plain anchor. */}
                <a
                  href={demo.href}
                  className={buttonClassName('secondary', 'md', 'mt-auto w-fit')}
                >
                  {demo.cta} →
                </a>
              </Card>
            </RevealItem>
          ))}
        </Reveal>
      </section>
    </>
  );
}
