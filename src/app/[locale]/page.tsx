import type {Metadata} from 'next';
import Image from 'next/image';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {ArrowRight, Wrench, ShieldCheck, Warehouse, Truck, BadgeCheck, ShieldQuestion} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {Reveal, RevealItem} from '@/components/ui/Reveal';
import {SectionHeading} from '@/components/ui/SectionHeading';
import {Card} from '@/components/ui/Card';
import {TrustStrip} from '@/components/home/TrustStrip';
import {Hero} from '@/components/home/Hero';
import {WhoWeServe, type ServeItem} from '@/components/home/WhoWeServe';
import {Solutions, type SolutionItem} from '@/components/home/Solutions';
import {Process, type ProcessStep, type ProcessCard} from '@/components/home/Process';
import {ProjectProof, type ProjectItem} from '@/components/home/ProjectProof';
import {CatalogCard} from '@/components/catalog/CatalogCard';
import {Faq, type FaqItem} from '@/components/catalog/Faq';
import {Testimonials, type Testimonial} from '@/components/home/Testimonials';
import {CtaBand} from '@/components/home/CtaBand';
import {PRODUCT_CATEGORIES, CATEGORY_ICONS} from '@/components/nav-menu';
import {CATEGORIES, PRODUCTS} from '@/data/products';
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

/** Why-Choose-Us icons, in copy order (Stock · Guidance · Quality · Delivery). */
const USP_ICONS = [Warehouse, Wrench, ShieldCheck, Truck];

/** Partner brand logos (self-hosted, from the original site). */
const BRAND_LOGOS: Record<string, {src: string; width: number; height: number}> = {
  'Action TESA': {src: '/images/brands/action-tesa.png', width: 2139, height: 832},
  Duroply: {src: '/images/brands/duroply.png', width: 127, height: 44},
  'Tenon Smart Lock': {src: '/images/brands/tenon-smart-lock.png', width: 151, height: 31}
};

/** Six featured SKUs shown on the homepage, by slug. */
const FEATURED_SLUGS = [
  'duroply-mr-moisture-resistant-plywood',
  'duroply-bwp-boiling-water-proof-plywood',
  'action-tesa-interior-grade-mdf',
  'action-tesa-hdhmr-board',
  'action-tesa-moist-master-hmr-board',
  'high-end-smart-main-door-lock'
];

export default async function HomePage({params}: Params) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home');
  const tn = await getTranslations('nav');

  const trust = t.raw('trust') as string[];
  const serve = t.raw('serve.items') as ServeItem[];
  const categories = t.raw('categories.items') as {title: string; body: string; chips: string[]}[];
  const solutions = t.raw('solutions.items') as SolutionItem[];
  const usps = t.raw('usps.items') as {title: string; body: string}[];
  const processSteps = t.raw('process.steps') as ProcessStep[];
  const processCards = t.raw('process.cards') as ProcessCard[];
  const brands = t.raw('brands.items') as {name: string; desc: string}[];
  const brandBadges = t.raw('brands.badges') as string[];
  const projects = t.raw('projects.items') as ProjectItem[];
  const testimonials = t.raw('testimonials.items') as Testimonial[];
  const faqs = t.raw('faq.items') as FaqItem[];
  const featured = FEATURED_SLUGS.map((slug) => PRODUCTS.find((p) => p.slug === slug)!);

  return (
    <>
      {/* 1 · HERO */}
      <Hero
        badge={t('hero.badge')}
        titlePre={t('hero.titlePre')}
        titleAccent={t('hero.titleAccent')}
        sub={t('hero.sub')}
        ctaWhatsapp={t('hero.ctaWhatsapp')}
        ctaProducts={t('hero.ctaProducts')}
        pills={t.raw('hero.pills') as string[]}
        rawLabel={t('hero.rawLabel')}
        finishedLabel={t('hero.finishedLabel')}
        floating={t.raw('hero.floating') as string[]}
      />

      {/* 2 · TRUST METRICS BAR */}
      <TrustStrip items={trust} />

      {/* 3 · WHO WE SERVE */}
      <WhoWeServe
        eyebrow={t('serve.eyebrow')}
        heading={t('serve.heading')}
        sub={t('serve.sub')}
        items={serve}
      />

      {/* 4 · PRODUCT CATEGORIES — 6 visual cards with use-for chips. */}
      <section id="categories" className="shell pt-14 sm:pt-20">
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
                <Link
                  href={cat.href}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-bg no-underline shadow-card transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-orange/30 hover:shadow-[0_24px_60px_-24px_rgba(249,115,22,0.4)]"
                >
                  {image && (
                    <div className="relative h-44 overflow-hidden border-b border-border">
                      <Image
                        src={image}
                        alt={categories[i].title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute left-3 top-3 grid h-11 w-11 place-items-center rounded-xl border border-white/30 bg-bg/95 text-indigo shadow-card">
                        <Icon className="h-5.5 w-5.5" aria-hidden />
                      </span>
                    </div>
                  )}
                  <div className="flex flex-1 flex-col gap-3 p-6 pt-5">
                    <h3 className="text-lg font-bold leading-snug text-ink">{categories[i].title}</h3>
                    <p className="text-sm leading-relaxed text-muted">{categories[i].body}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {categories[i].chips.map((chip) => (
                        <span
                          key={chip}
                          className="inline-flex items-center rounded-full bg-indigo/8 px-2.5 py-1 text-[11px] font-semibold text-indigo"
                        >
                          {chip}
                        </span>
                      ))}
                    </div>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-bold text-orange-deep">
                      {t('categories.cta')}
                      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
                    </span>
                  </div>
                </Link>
              </RevealItem>
            );
          })}
        </Reveal>
      </section>

      {/* 5 · APPLICATION-BASED SOLUTIONS */}
      <Solutions
        eyebrow={t('solutions.eyebrow')}
        heading={t('solutions.heading')}
        sub={t('solutions.sub')}
        cta={t('solutions.cta')}
        items={solutions}
      />

      {/* 6 · WHY CHOOSE US — 4 premium cards. */}
      <section id="why-us" className="shell pt-14 sm:pt-20">
        <Reveal>
          <SectionHeading eyebrow={t('usps.eyebrow')} title={t('usps.heading')} sub={t('usps.sub')} />
        </Reveal>
        <Reveal
          stagger={0.07}
          className="mt-10 grid grid-cols-1 gap-6 sm:mt-12 sm:grid-cols-2 lg:grid-cols-4"
        >
          {usps.map((usp, i) => {
            const Icon = USP_ICONS[i % USP_ICONS.length];
            return (
              <RevealItem key={usp.title} className="h-full">
                <Card accent="indigo" className="h-full gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-brand text-white">
                    <Icon className="h-6 w-6" aria-hidden />
                  </span>
                  <h3 className="text-base font-bold leading-snug text-ink">{usp.title}</h3>
                  <p className="text-sm leading-relaxed text-muted">{usp.body}</p>
                </Card>
              </RevealItem>
            );
          })}
        </Reveal>
      </section>

      {/* 7 · MATERIAL → FINISHED FURNITURE */}
      <Process
        eyebrow={t('process.eyebrow')}
        heading={t('process.heading')}
        sub={t('process.sub')}
        steps={processSteps}
        cards={processCards}
      />

      {/* 8 · FEATURED PRODUCTS — 6 real SKUs. */}
      <section id="featured" className="shell pt-14 sm:pt-20">
        <Reveal>
          <SectionHeading
            eyebrow={t('featured.eyebrow')}
            title={t('featured.heading')}
            sub={t('featured.sub')}
          />
        </Reveal>
        <Reveal
          stagger={0.06}
          className="mt-10 grid grid-cols-1 gap-6 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3"
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

      {/* 9 · BRAND PARTNERS */}
      <section id="brands" className="mt-14 bg-bg-warm py-14 sm:mt-20 sm:py-20">
        <div className="shell">
          <Reveal>
            <SectionHeading eyebrow={t('brands.eyebrow')} title={t('brands.heading')} sub={t('brands.sub')} />
          </Reveal>
          <Reveal stagger={0.08} className="mt-10 grid grid-cols-1 gap-6 sm:mt-12 lg:grid-cols-3">
            {brands.map((brand, i) => {
              const logo = BRAND_LOGOS[brand.name];
              const badge = brandBadges[i % brandBadges.length];
              return (
                <RevealItem key={brand.name} className="h-full">
                  <Link
                    href="/partners"
                    className="group flex h-full flex-col gap-4 rounded-2xl border border-border bg-bg p-6 no-underline shadow-card transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-orange/30 hover:shadow-glow"
                  >
                    <div className="flex h-20 items-center justify-center rounded-xl border border-border bg-bg-soft px-6">
                      {logo ? (
                        <Image
                          src={logo.src}
                          alt={`${brand.name} logo`}
                          width={logo.width}
                          height={logo.height}
                          className="h-10 w-auto max-w-full object-contain"
                        />
                      ) : (
                        <span className="text-lg font-bold tracking-tight text-ink">{brand.name}</span>
                      )}
                    </div>
                    <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-orange/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-orange-deep">
                      <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
                      {badge}
                    </span>
                    <p className="text-sm leading-relaxed text-muted">{brand.desc}</p>
                  </Link>
                </RevealItem>
              );
            })}
          </Reveal>
        </div>
      </section>

      {/* 10 · PROJECT PROOF */}
      <ProjectProof
        eyebrow={t('projects.eyebrow')}
        heading={t('projects.heading')}
        sub={t('projects.sub')}
        outcome={t('projects.outcome')}
        items={projects}
      />

      {/* 11 · TESTIMONIALS */}
      <section id="testimonials" className="shell pt-14 sm:pt-20">
        <Reveal>
          <SectionHeading
            eyebrow={t('testimonials.eyebrow')}
            title={t('testimonials.heading')}
            sub={t('testimonials.sub')}
          />
        </Reveal>
        <Testimonials items={testimonials} />
      </section>

      {/* 12 · FAQ */}
      <section id="faq" className="shell pt-14 sm:pt-20">
        <Reveal>
          <SectionHeading
            eyebrow={
              <span className="inline-flex items-center gap-1.5">
                <ShieldQuestion className="h-4 w-4" aria-hidden />
                {t('faq.eyebrow')}
              </span>
            }
            title={t('faq.heading')}
          />
        </Reveal>
        <Reveal className="mt-10 sm:mt-12">
          <Faq items={faqs} />
        </Reveal>
      </section>

      {/* 13 · FINAL CTA BAND */}
      <div className="pt-14 sm:pt-20">
        <CtaBand
          heading={t('cta.heading')}
          sub={t('cta.sub')}
          note={t('cta.note')}
          ctaWhatsapp={t('cta.whatsapp')}
          ctaContact={t('cta.contact')}
          chips={t.raw('cta.chips') as string[]}
        />
      </div>
    </>
  );
}
