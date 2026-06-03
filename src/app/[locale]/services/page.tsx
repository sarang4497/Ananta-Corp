import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {PageHero} from '@/components/PageHero';
import {Reveal, RevealItem} from '@/components/ui/Reveal';
import {Card} from '@/components/ui/Card';
import {SectionHeading} from '@/components/ui/SectionHeading';
import {buildAlternates} from '@/lib/metadata';

type Params = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: Params): Promise<Metadata> {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('services.meta');
  return {
    title: t('title'),
    description: t('description'),
    alternates: buildAlternates('/services', locale)
  };
}

const accents = ['blue', 'indigo', 'orange', 'green'] as const;

export default async function ServicesPage({params}: Params) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('services');

  const items = t.raw('items') as {title: string; body: string}[];
  const steps = t.raw('process.steps') as {title: string; body: string}[];

  return (
    <>
      <PageHero
        eyebrow={t('hero.eyebrow')}
        title={t('hero.title')}
        sub={t('hero.sub')}
      />

      <section className="shell py-16">
        <Reveal stagger={0.08} className="grid gap-5 sm:grid-cols-2">
          {items.map((item, i) => (
            <RevealItem key={item.title}>
              <Card accent={accents[i]} className="h-full gap-3">
                <span className="font-mono text-[11px] uppercase tracking-widest text-indigo">
                  0{i + 1}
                </span>
                <h2 className="text-xl font-semibold text-ink">{item.title}</h2>
                <p className="text-sm leading-relaxed text-muted">{item.body}</p>
              </Card>
            </RevealItem>
          ))}
        </Reveal>
      </section>

      <section className="shell py-16">
        <Reveal>
          <SectionHeading
            eyebrow="Process"
            title={t('process.heading')}
            sub={t('process.sub')}
          />
        </Reveal>
        <Reveal stagger={0.1} className="mt-12 grid gap-5 sm:grid-cols-3">
          {steps.map((step, i) => (
            <RevealItem key={step.title}>
              <Card className="h-full gap-3">
                <span className="bg-gradient-brand bg-clip-text font-mono text-3xl font-semibold text-transparent">
                  {i + 1}
                </span>
                <h3 className="text-lg font-semibold text-ink">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted">{step.body}</p>
              </Card>
            </RevealItem>
          ))}
        </Reveal>
      </section>
    </>
  );
}
