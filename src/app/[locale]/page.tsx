import type {Metadata} from 'next';
import type {ComponentProps} from 'react';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {ArrowRight, Wrench, Users, Warehouse, Truck, BadgeCheck} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {Reveal, RevealItem} from '@/components/ui/Reveal';
import {SectionHeading} from '@/components/ui/SectionHeading';
import {Card} from '@/components/ui/Card';
import {buttonClassName} from '@/components/ui/Button';
import {ImagePlaceholder} from '@/components/home/ImagePlaceholder';
import {TrustStrip} from '@/components/home/TrustStrip';
import {ProductCard} from '@/components/home/ProductCard';
import {Testimonials, type Testimonial} from '@/components/home/Testimonials';
import {CtaBand} from '@/components/home/CtaBand';
import {PRODUCT_CATEGORIES, CATEGORY_ICONS} from '@/components/nav-menu';
import {buildAlternates} from '@/lib/metadata';
import {whatsappUrl} from '@/lib/whatsapp';

type Params = {params: Promise<{locale: string}>};
type Href = ComponentProps<typeof Link>['href'];

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

/** USP icons, in copy order (Technical · Design+Execution · Stock · Logistics). */
const USP_ICONS = [Wrench, Users, Warehouse, Truck];

/** Featured SKUs — detail hrefs land on their subcategory pages (next batch). */
const FEATURED_HREFS: Href[] = [
  '/products/plywood/moisture-resistant',
  '/products/plywood/boiling-water-proof',
  '/products/mdf/interior-grade',
  '/products/mdf/hdhmr'
];

export default async function HomePage({params}: Params) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home');

  const trust = t.raw('trust') as string[];
  const categories = t.raw('categories.items') as {title: string; body: string}[];
  const usps = t.raw('usps.items') as {title: string; body: string}[];
  const featured = t.raw('featured.items') as {name: string; brand: string}[];
  const brands = t.raw('brands.items') as string[];
  const testimonials = t.raw('testimonials.items') as Testimonial[];

  return (
    <>
      {/* 1 · HERO — copy left, image placeholder right, on a soft warm wash. */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(160deg, rgba(79,70,229,0.06) 0%, rgba(255,255,255,0) 45%, rgba(249,115,22,0.05) 100%)'
          }}
        />
        <div className="shell relative grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
          <Reveal trigger="load" stagger={0.09} className="flex flex-col items-start gap-5">
            <RevealItem>
              <span className="inline-flex items-center gap-2 rounded-full border border-indigo/20 bg-bg px-4 py-1.5 text-sm font-semibold text-indigo shadow-card">
                <BadgeCheck className="h-4 w-4 text-orange" aria-hidden />
                {t('hero.badge')}
              </span>
            </RevealItem>
            <RevealItem>
              <h1 className="text-balance text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-6xl">
                {t('hero.titlePre')}{' '}
                <span className="text-gradient-wordmark">{t('hero.titleAccent')}</span>
              </h1>
            </RevealItem>
            <RevealItem>
              <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted">
                {t('hero.sub')}
              </p>
            </RevealItem>
            <RevealItem className="mt-1 flex flex-wrap items-center gap-3">
              <Link href="/products" className={buttonClassName('primary', 'lg', 'font-bold')}>
                {t('hero.ctaProducts')}
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
              </Link>
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClassName('orange', 'lg', 'btn-sheen font-bold')}
              >
                {t('hero.ctaWhatsapp')}
              </a>
            </RevealItem>
          </Reveal>

          {/* Hero visual placeholder — real photography lands in the asset batch. */}
          <Reveal trigger="load" delay={0.15}>
            <ImagePlaceholder
              label={t('hero.imageLabel')}
              className="h-72 w-full sm:h-96 lg:h-[28rem]"
              iconSize={40}
            />
          </Reveal>
        </div>
      </section>

      {/* 2 · TRUST STRIP */}
      <TrustStrip items={trust} />

      {/* 3 · CATEGORIES — 6 cards. */}
      <section id="categories" className="shell pb-6 pt-14 sm:pt-20">
        <Reveal>
          <SectionHeading
            eyebrow={t('categories.eyebrow')}
            title={t('categories.heading')}
            sub={t('categories.sub')}
          />
        </Reveal>
        <Reveal
          stagger={0.07}
          className="mt-10 grid grid-cols-1 gap-6 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3"
        >
          {PRODUCT_CATEGORIES.map((cat, i) => {
            const Icon = CATEGORY_ICONS[cat.key];
            return (
              <RevealItem key={cat.key} className="h-full">
                <Card href={cat.href} accent="orange" className="h-full gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-indigo/8 text-indigo transition-colors">
                    <Icon className="h-6 w-6" aria-hidden />
                  </span>
                  <h3 className="text-lg font-bold leading-snug text-ink">
                    {categories[i].title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted">{categories[i].body}</p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-bold text-orange-deep">
                    {t('categories.cta')}
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </span>
                </Card>
              </RevealItem>
            );
          })}
        </Reveal>
      </section>

      {/* 4 · WHY CHOOSE US — 4 USP cards on a warm band. */}
      <section id="why-us" className="mt-14 bg-bg-warm py-14 sm:mt-20 sm:py-20">
        <div className="shell">
          <Reveal>
            <SectionHeading
              eyebrow={t('usps.eyebrow')}
              title={t('usps.heading')}
              sub={t('usps.sub')}
            />
          </Reveal>
          <Reveal
            stagger={0.07}
            className="mt-10 grid grid-cols-1 gap-6 sm:mt-12 sm:grid-cols-2 lg:grid-cols-4"
          >
            {usps.map((usp, i) => {
              const Icon = USP_ICONS[i % USP_ICONS.length];
              return (
                <RevealItem key={usp.title} className="h-full">
                  <Card accent="indigo" className="h-full gap-3 bg-bg">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-orange/10 text-orange-deep">
                      <Icon className="h-5.5 w-5.5" aria-hidden />
                    </span>
                    <h3 className="text-base font-bold leading-snug text-ink">{usp.title}</h3>
                    <p className="text-sm leading-relaxed text-muted">{usp.body}</p>
                  </Card>
                </RevealItem>
              );
            })}
          </Reveal>
        </div>
      </section>

      {/* 5 · FEATURED PRODUCTS — real SKUs. */}
      <section id="featured" className="shell pt-14 sm:pt-20">
        <Reveal>
          <SectionHeading
            eyebrow={t('featured.eyebrow')}
            title={t('featured.heading')}
            sub={t('featured.sub')}
          />
        </Reveal>
        <Reveal
          stagger={0.07}
          className="mt-10 grid grid-cols-1 gap-6 sm:mt-12 sm:grid-cols-2 lg:grid-cols-4"
        >
          {featured.map((p, i) => (
            <RevealItem key={p.name} className="h-full">
              <ProductCard
                name={p.name}
                brand={p.brand}
                href={FEATURED_HREFS[i]}
                viewLabel={t('featured.view')}
                priceLabel={t('featured.price')}
              />
            </RevealItem>
          ))}
        </Reveal>
        <Reveal className="mt-8 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-base font-bold text-indigo no-underline transition-colors hover:text-orange-deep"
          >
            {t('featured.viewAll')}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </Reveal>
      </section>

      {/* 6 · BRANDS */}
      <section id="brands" className="shell pt-16 sm:pt-24">
        <Reveal>
          <SectionHeading eyebrow={t('brands.eyebrow')} title={t('brands.heading')} sub={t('brands.sub')} />
        </Reveal>
        <Reveal stagger={0.08} className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-5 sm:grid-cols-3">
          {brands.map((brand) => (
            <RevealItem key={brand}>
              <Link
                href="/partners"
                className="group flex h-28 flex-col items-center justify-center gap-1.5 rounded-2xl border border-border bg-bg no-underline shadow-card transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-orange/30 hover:shadow-glow"
              >
                <span className="text-lg font-bold tracking-tight text-ink group-hover:text-indigo">
                  {brand}
                </span>
                <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
                  {t('brands.logoNote')}
                </span>
              </Link>
            </RevealItem>
          ))}
        </Reveal>
      </section>

      {/* 7 · TESTIMONIALS */}
      <section id="testimonials" className="shell pb-16 pt-16 sm:pb-24 sm:pt-24">
        <Reveal>
          <SectionHeading
            eyebrow={t('testimonials.eyebrow')}
            title={t('testimonials.heading')}
            sub={t('testimonials.sub')}
          />
        </Reveal>
        <Testimonials items={testimonials} />
      </section>

      {/* 8 · ENQUIRY CTA BAND */}
      <CtaBand
        heading={t('cta.heading')}
        sub={t('cta.sub')}
        note={t('cta.note')}
        ctaWhatsapp={t('cta.whatsapp')}
        ctaContact={t('cta.contact')}
      />
    </>
  );
}
