import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {ArrowRight} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {PageHero} from '@/components/PageHero';
import {Reveal} from '@/components/ui/Reveal';
import {ImagePlaceholder} from '@/components/home/ImagePlaceholder';
import {CtaBand} from '@/components/home/CtaBand';
import {buttonClassName} from '@/components/ui/Button';
import {categoryHref, type CategorySlug} from '@/data/products';
import {buildAlternates} from '@/lib/metadata';

type Params = {params: Promise<{locale: string}>};

/** Anchor ids match the Partners dropdown hashes. */
const PARTNER_SECTIONS: {id: string; key: string; categories: CategorySlug[]}[] = [
  {id: 'action-tesa', key: 'actionTesa', categories: ['mdf', 'pre-laminated-particle-board']},
  {id: 'duroply', key: 'duroply', categories: ['plywood', 'flush-door']},
  {id: 'tenon-smart-lock', key: 'tenonSmartLock', categories: ['smart-locks']}
];

export async function generateMetadata({params}: Params): Promise<Metadata> {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('partners.meta');
  return {
    title: t('title'),
    description: t('description'),
    alternates: buildAlternates('/partners', locale)
  };
}

export default async function PartnersPage({params}: Params) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('partners');
  const tn = await getTranslations('nav');
  const tc = await getTranslations('catalog');

  return (
    <>
      <PageHero eyebrow={t('hero.eyebrow')} title={t('hero.title')} sub={t('hero.sub')} />

      <section className="shell flex flex-col gap-12 pb-14 sm:gap-16">
        {PARTNER_SECTIONS.map((section, i) => (
          <Reveal key={section.id}>
            <article
              id={section.id}
              className={`grid items-center gap-8 rounded-3xl border border-border bg-bg p-6 shadow-card sm:p-10 lg:grid-cols-[1fr_1.4fr] lg:gap-12 ${
                i % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''
              }`}
            >
              <ImagePlaceholder
                label={t(`${section.key}.logoLabel`)}
                className="h-48 w-full sm:h-56"
              />
              <div className="flex flex-col items-start gap-3.5">
                <span className="inline-flex items-center rounded-full bg-orange/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-orange-deep">
                  {t('partnerBadge')}
                </span>
                <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                  {tn(section.key)}
                </h2>
                <p className="text-pretty text-[15px] leading-relaxed text-muted">
                  {t(`${section.key}.who`)}
                </p>
                <p className="text-pretty text-[15px] leading-relaxed text-muted">
                  {t(`${section.key}.supply`)}
                </p>
                <div className="mt-1 flex flex-wrap gap-2.5">
                  {section.categories.map((cat, j) => {
                    const ctas = t.raw(`${section.key}.ctas`) as string[];
                    return (
                      <Link key={cat} href={categoryHref(cat)} className={buttonClassName('secondary', 'sm')}>
                        {ctas[j]}
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                      </Link>
                    );
                  })}
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </section>

      <CtaBand
        heading={tc('cta.heading')}
        sub={tc('cta.sub')}
        note={tc('cta.note')}
        ctaWhatsapp={tc('card.price')}
        ctaContact={tc('cta.contact')}
      />
    </>
  );
}
