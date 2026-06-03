import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {ArrowRight, CheckCircle2, Ruler, Palette} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {Reveal, RevealItem} from '@/components/ui/Reveal';
import {SectionHeading} from '@/components/ui/SectionHeading';
import {Pill} from '@/components/ui/Pill';
import {Breadcrumbs} from '@/components/catalog/Breadcrumbs';
import {CatalogCard} from '@/components/catalog/CatalogCard';
import {Faq, type FaqItem} from '@/components/catalog/Faq';
import {CtaBand} from '@/components/home/CtaBand';
import {CATEGORY_ICONS} from '@/components/nav-menu';
import {buttonClassName} from '@/components/ui/Button';
import {
  CATEGORIES,
  categoryBySlug,
  productsByCategory,
  subcategoryHref,
  type CategorySlug
} from '@/data/products';
import {buildAlternates} from '@/lib/metadata';

type Params = {params: Promise<{locale: string; category: string}>};

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({category: c.slug}));
}

export async function generateMetadata({params}: Params): Promise<Metadata> {
  const {locale, category} = await params;
  const cat = categoryBySlug(category);
  if (!cat) return {};
  setRequestLocale(locale);
  const t = await getTranslations(`catalog.categories.${cat.key}`);
  return {
    title: t('meta.title'),
    description: t('meta.description'),
    alternates: buildAlternates(
      {pathname: '/products/[category]', params: {category: cat.slug}},
      locale
    )
  };
}

export default async function CategoryPage({params}: Params) {
  const {locale, category} = await params;
  const cat = categoryBySlug(category);
  if (!cat) notFound();
  setRequestLocale(locale);

  const t = await getTranslations(`catalog.categories.${cat.key}`);
  const tc = await getTranslations('catalog');
  const tn = await getTranslations('nav');

  const products = productsByCategory(cat.slug);
  const benefits = t.raw('benefits') as {title: string; body: string}[];
  const glance = t.raw('glance') as {label: string; value: string}[];
  const faq = t.raw('faq') as FaqItem[];
  const Icon = CATEGORY_ICONS[cat.key];
  const isPrelam = cat.slug === 'pre-laminated-particle-board';

  return (
    <>
      {/* Category hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(160deg, rgba(79,70,229,0.07) 0%, rgba(255,255,255,0) 50%, rgba(249,115,22,0.05) 100%)'
          }}
        />
        <div className="shell relative flex flex-col gap-6 pb-10 pt-10 sm:pt-14">
          <Breadcrumbs
            items={[
              {label: tc('breadcrumb.home'), href: '/'},
              {label: tc('breadcrumb.products'), href: '/products'},
              {label: tn(cat.key)}
            ]}
          />
          <Reveal trigger="load" className="flex max-w-3xl flex-col items-start gap-4">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-indigo/8 text-indigo">
              <Icon className="h-7 w-7" aria-hidden />
            </span>
            <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight text-ink sm:text-5xl">
              {t('heading')}
            </h1>
            <p className="text-pretty text-lg leading-relaxed text-muted">{t('intro')}</p>
          </Reveal>
        </div>
      </section>

      {/* Why this material — benefits row */}
      <section className="border-y border-border bg-bg-soft">
        <div className="shell py-10 sm:py-12">
          <Reveal
            stagger={0.06}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {benefits.map((b) => (
              <RevealItem key={b.title} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-orange" aria-hidden />
                <span>
                  <span className="block text-sm font-bold text-ink">{b.title}</span>
                  <span className="mt-0.5 block text-[13px] leading-relaxed text-muted">
                    {b.body}
                  </span>
                </span>
              </RevealItem>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Products in this category */}
      <section className="shell pt-14 sm:pt-16">
        <Reveal className="flex flex-col items-center gap-3 text-center">
          <Pill>{tc('rangeEyebrow')}</Pill>
          <SectionHeading title={t('rangeHeading')} />
        </Reveal>

        {/* Subcategory quick links (only where a category has multiple). */}
        {cat.subs.length > 1 && (
          <Reveal className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {cat.subs.map((sub) => (
              <Link
                key={sub.slug}
                href={subcategoryHref(cat.slug as CategorySlug, sub.slug)}
                className="rounded-full border border-border bg-bg px-4 py-2 text-sm font-semibold text-ink no-underline transition-all hover:border-indigo/40 hover:text-indigo"
              >
                {tn(sub.key)}
              </Link>
            ))}
          </Reveal>
        )}

        <Reveal
          stagger={0.07}
          className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {products.map((p) => (
            <RevealItem key={p.slug} className="h-full">
              <CatalogCard
                product={p}
                categoryLabel={tn(cat.key)}
                viewLabel={tc('card.view')}
                priceLabel={tc('card.price')}
              />
            </RevealItem>
          ))}
        </Reveal>

        {/* Prelam: the décor catalog is the real range — make it loud. */}
        {isPrelam && (
          <Reveal className="mt-10">
            <Link
              href="/decor"
              className="group flex flex-col items-center gap-3 rounded-3xl border border-indigo/20 bg-gradient-to-r from-indigo/5 via-bg to-orange/5 px-6 py-10 text-center no-underline shadow-card transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-glow sm:flex-row sm:justify-between sm:px-10 sm:text-left"
            >
              <span className="flex items-center gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-orange/10 text-orange-deep">
                  <Palette className="h-6 w-6" aria-hidden />
                </span>
                <span>
                  <span className="block text-xl font-bold text-ink">{tc('decorPromo.title')}</span>
                  <span className="mt-1 block text-sm text-muted">{tc('decorPromo.sub')}</span>
                </span>
              </span>
              <span className={buttonClassName('orange', 'md', 'shrink-0 font-bold')}>
                {tc('decorPromo.cta')}
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
              </span>
            </Link>
          </Reveal>
        )}
      </section>

      {/* Specs at a glance */}
      <section className="shell pt-14 sm:pt-16">
        <Reveal>
          <div className="mx-auto max-w-4xl rounded-3xl border border-border bg-bg-warm p-7 sm:p-9">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo/10 text-indigo">
                <Ruler className="h-5 w-5" aria-hidden />
              </span>
              <h2 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
                {tc('glanceHeading')}
              </h2>
            </div>
            <dl className="mt-6 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
              {glance.map((g) => (
                <div key={g.label} className="flex flex-col gap-0.5 border-b border-border pb-3">
                  <dt className="text-xs font-bold uppercase tracking-[0.14em] text-muted">
                    {g.label}
                  </dt>
                  <dd className="text-[15px] font-semibold text-ink">{g.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </section>

      {/* FAQ */}
      <section className="shell pb-4 pt-14 sm:pt-16">
        <Reveal>
          <SectionHeading eyebrow={tc('faqEyebrow')} title={tc('faqHeading')} />
        </Reveal>
        <Reveal className="mt-8">
          <Faq items={faq} />
        </Reveal>
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
