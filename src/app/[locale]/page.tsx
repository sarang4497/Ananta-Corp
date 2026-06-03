import type {Metadata} from 'next';
import Image from 'next/image';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {ArrowRight, Wrench, Users, Warehouse, Truck, BadgeCheck} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {Reveal, RevealItem} from '@/components/ui/Reveal';
import {SectionHeading} from '@/components/ui/SectionHeading';
import {Card} from '@/components/ui/Card';
import {buttonClassName} from '@/components/ui/Button';
import {TrustStrip} from '@/components/home/TrustStrip';
import {CatalogCard} from '@/components/catalog/CatalogCard';
import {Testimonials, type Testimonial} from '@/components/home/Testimonials';
import {CtaBand} from '@/components/home/CtaBand';
import {PRODUCT_CATEGORIES, CATEGORY_ICONS} from '@/components/nav-menu';
import {CATEGORIES, PRODUCTS} from '@/data/products';
import {buildAlternates} from '@/lib/metadata';
import {whatsappUrl} from '@/lib/whatsapp';

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

/** USP icons, in copy order (Technical · Design+Execution · Stock · Logistics). */
const USP_ICONS = [Wrench, Users, Warehouse, Truck];

/** Partner brand logos (self-hosted, from the original site). */
const BRAND_LOGOS: Record<string, {src: string; width: number; height: number}> = {
  'Action TESA': {src: '/images/brands/action-tesa.png', width: 2139, height: 832},
  Duroply: {src: '/images/brands/duroply.png', width: 127, height: 44},
  'Tenon Smart Lock': {src: '/images/brands/tenon-smart-lock.png', width: 151, height: 31}
};

/** Featured SKUs shown on the homepage, by slug. */
const FEATURED_SLUGS = [
  'duroply-mr-moisture-resistant-plywood',
  'duroply-bwp-boiling-water-proof-plywood',
  'action-tesa-interior-grade-mdf',
  'action-tesa-hdhmr-board'
];

export default async function HomePage({params}: Params) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home');

  const tn = await getTranslations('nav');
  const trust = t.raw('trust') as string[];
  const categories = t.raw('categories.items') as {title: string; body: string}[];
  const usps = t.raw('usps.items') as {title: string; body: string}[];
  const brands = t.raw('brands.items') as string[];
  const testimonials = t.raw('testimonials.items') as Testimonial[];
  const featured = FEATURED_SLUGS.map((slug) => PRODUCTS.find((p) => p.slug === slug)!);

  return (
    <>
      {/* 1 · HERO — copy left, image placeholder right, on a soft warm wash. */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(160deg, rgba(29,78,216,0.06) 0%, rgba(255,255,255,0) 45%, rgba(249,115,22,0.05) 100%)'
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
            <RevealItem className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1">
              {(t.raw('hero.pills') as string[]).map((pill) => (
                <span key={pill} className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange" aria-hidden />
                  {pill}
                </span>
              ))}
            </RevealItem>
          </Reveal>

          {/* Hero visual — interior shot from the original site's hero slider. */}
          <Reveal trigger="load" delay={0.15}>
            <div className="relative h-72 w-full overflow-hidden rounded-2xl border border-border shadow-card sm:h-96 lg:h-[28rem]">
              <Image
                src="/images/hero/plywood-slider.png"
                alt="Warm wood-panelled living room built with premium plywood"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
            </div>
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
            const image = CATEGORIES.find((c) => c.key === cat.key)?.image;
            return (
              <RevealItem key={cat.key} className="h-full">
                <Card href={cat.href} accent="orange" className="group h-full gap-3">
                  {image && (
                    <div className="relative -mx-2 -mt-2 mb-1 h-40 overflow-hidden rounded-xl border border-border">
                      <Image
                        src={image}
                        alt={categories[i].title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}
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
          {featured.map((p) => {
            const cat = CATEGORIES.find((c) => c.slug === p.category)!;
            return (
              <RevealItem key={p.slug} className="h-full">
                <CatalogCard
                  product={p}
                  categoryLabel={tn(cat.key)}
                  viewLabel={t('featured.view')}
                  priceLabel={t('featured.price')}
                />
              </RevealItem>
            );
          })}
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

      {/* 6 · ABOUT TEASER — end-to-end supply + custom furniture. */}
      <section id="about-teaser" className="mt-16 border-y border-border bg-bg-soft sm:mt-24">
        <div className="shell grid items-center gap-10 py-14 sm:py-16 lg:grid-cols-2 lg:gap-14">
          <Reveal className="flex flex-col items-start gap-4">
            <span className="text-xs font-mono font-medium uppercase tracking-[0.18em] text-indigo">
              {t('aboutTeaser.eyebrow')}
            </span>
            <h2 className="text-balance text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">
              {t('aboutTeaser.heading')}
            </h2>
            <p className="text-pretty text-[15px] leading-relaxed text-muted">
              {t('aboutTeaser.body')}
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-1.5 text-base font-bold text-indigo no-underline transition-colors hover:text-orange-deep"
            >
              {t('aboutTeaser.cta')}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Reveal>
          <Reveal delay={0.08} stagger={0.07} className="flex flex-col gap-4">
            {(t.raw('aboutTeaser.highlights') as {title: string; body: string}[]).map((h) => (
              <RevealItem
                key={h.title}
                className="flex items-start gap-3.5 rounded-2xl border border-border bg-bg p-5 shadow-card"
              >
                <BadgeCheck className="mt-0.5 h-5.5 w-5.5 shrink-0 text-orange" aria-hidden />
                <span>
                  <span className="block text-base font-bold text-ink">{h.title}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-muted">{h.body}</span>
                </span>
              </RevealItem>
            ))}
          </Reveal>
        </div>
      </section>

      {/* 7 · BRANDS */}
      <section id="brands" className="shell pt-16 sm:pt-24">
        <Reveal>
          <SectionHeading eyebrow={t('brands.eyebrow')} title={t('brands.heading')} sub={t('brands.sub')} />
        </Reveal>
        <Reveal stagger={0.08} className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-5 sm:grid-cols-3">
          {brands.map((brand) => {
            const logo = BRAND_LOGOS[brand];
            return (
              <RevealItem key={brand}>
                <Link
                  href="/partners"
                  className="group flex h-28 flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-bg px-6 no-underline shadow-card transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-orange/30 hover:shadow-glow"
                >
                  {logo ? (
                    <Image
                      src={logo.src}
                      alt={`${brand} logo`}
                      width={logo.width}
                      height={logo.height}
                      className="h-12 w-auto max-w-full object-contain"
                    />
                  ) : (
                    <span className="text-lg font-bold tracking-tight text-ink group-hover:text-indigo">
                      {brand}
                    </span>
                  )}
                  <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
                    {brand}
                  </span>
                </Link>
              </RevealItem>
            );
          })}
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
