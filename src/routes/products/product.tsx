import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {setRequestLocale} from 'next-intl/server';
import {ArrowRight, Check, CircleSlash} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {PRODUCTS, categoryBySlug, categoryHref, productByPath, productPath, relatedProducts, subcategoryHref, type CategorySlug} from '@/data/products';
import {CATEGORY_COPY, SUB_NAMES} from '@/content/categories';
import {BRAND_ASSETS, EXPOSURE_LABEL, WA} from '@/content/site';
import {siteUrl} from '@/config';
import {Breadcrumbs} from '@/components/catalog2/Breadcrumbs';
import {Gallery} from '@/components/catalog2/Gallery';
import {EnquiryBox} from '@/components/catalog2/EnquiryBox';
import {FaqList} from '@/components/catalog2/FaqList';
import {ProductTile} from '@/components/catalog2/ProductTile';
import {BrandLogo} from '@/components/site/BrandLogo';
import {buildAlternates} from '@/lib/metadata';
import {breadcrumbJsonLd, productJsonLd} from '@/lib/jsonld';

type Params = {params: Promise<{locale: string; category: string; sub: string; slug: string}>};

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({category: p.category, sub: p.subcategory, slug: p.slug}));
}

export async function generateMetadata({params}: Params): Promise<Metadata> {
  const {locale, category, sub, slug} = await params;
  const p = productByPath(category, sub, slug);
  if (!p) return {};
  return {
    title: `${p.name} — Supplier in Ahmedabad`,
    description: `${p.summary} ${p.brand} ${CATEGORY_COPY[p.category].short.toLowerCase()} from Ananta Corporation, Ahmedabad. Get price and availability on WhatsApp.`,
    alternates: buildAlternates({pathname: '/products/[category]/[sub]/[slug]', params: {category, sub, slug}}, locale),
    openGraph: {images: [{url: p.cardImage}]}
  };
}

export default async function ProductPage({params}: Params) {
  const {locale, category, sub, slug} = await params;
  const p = productByPath(category, sub, slug);
  const cat = categoryBySlug(category);
  if (!p || !cat) notFound();
  setRequestLocale(locale);

  const copy = CATEGORY_COPY[cat.slug as CategorySlug];
  const related = relatedProducts(p, 4);
  const brand = BRAND_ASSETS[p.brand];
  const url = siteUrl + productPath(p);
  const crumbs = [
    {label: 'Home', href: '/' as const},
    {label: 'Products', href: '/products' as const},
    {label: copy.name, href: categoryHref(cat.slug)},
    ...(cat.subs.length > 1 ? [{label: SUB_NAMES[sub], href: subcategoryHref(cat.slug, sub)}] : []),
    {label: p.short}
  ];

  return (
    <>
      <span hidden data-wa-context={WA.product(p.name)} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            productJsonLd(p, url),
            breadcrumbJsonLd([
              {name: 'Home', url: siteUrl},
              {name: 'Products', url: `${siteUrl}/products`},
              {name: copy.name, url: `${siteUrl}/products/${cat.slug}`},
              {name: p.name, url}
            ])
          ])
        }}
      />

      <section className="border-b border-line bg-white">
        <div className="shell pb-10 pt-6 sm:pt-8 lg:pb-14">
          <Breadcrumbs items={crumbs} />
          <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
            <Gallery images={p.images} name={p.name} />
            <div className="flex min-w-0 flex-col">
              <div className="hero-in flex flex-wrap items-center gap-3">
                <BrandLogo brand={p.brand} height={p.brand === 'Action TESA' ? 30 : 22} />
                <span className="t-label text-steel">
                  {copy.short}
                  {cat.subs.length > 1 ? ` · ${SUB_NAMES[sub]}` : ''}
                </span>
              </div>
              <h1 className="hero-in mt-4 text-[clamp(1.7rem,1.2rem+1.9vw,2.6rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-ink" style={{['--d' as string]: '60ms'}}>
                {p.name}
              </h1>
              <p className="hero-in t-lead mt-3 text-muted" style={{['--d' as string]: '120ms'}}>
                {p.summary}
              </p>

              {(p.exposure || p.standards.length > 0) && (
                <ul className="hero-in mt-5 flex flex-wrap gap-2" style={{['--d' as string]: '160ms'}}>
                  {p.exposure && (
                    <li className="inline-flex min-h-8 items-center rounded-[4px] bg-surface-blue px-2.5 text-[12.5px] font-medium text-indigo">{EXPOSURE_LABEL[p.exposure]}</li>
                  )}
                  {p.standards.map((s) => (
                    <li key={s.label} className="inline-flex min-h-8 items-center rounded-[4px] border border-line px-2.5 text-[12.5px] text-ink">
                      {s.label}
                    </li>
                  ))}
                </ul>
              )}

              <div className="hero-in mt-6" style={{['--d' as string]: '200ms'}}>
                <EnquiryBox name={p.name} sizes={p.sizes} sizesLabel={p.sizesLabel} sizesNote={p.sizesNote} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-10 sm:py-14" aria-labelledby="spec-title">
        <div className="shell grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 id="spec-title" className="t-h3 text-ink" data-reveal="up">
              Specification
            </h2>
            <dl className="mt-4 divide-y divide-line border-y border-line" data-reveal="up">
              {p.specs.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[minmax(110px,38%)_1fr] gap-4 py-3 text-[14px]">
                  <dt className="text-muted">{k}</dt>
                  <dd className="font-medium text-ink">{v}</dd>
                </div>
              ))}
              {p.specsOnRequest && (
                <div className="py-3 text-[14px] text-muted">Detailed specifications, finishes and variants are shared on request — ask on WhatsApp.</div>
              )}
            </dl>

            {p.standards.length > 0 && (
              <div className="mt-6 rounded-[8px] bg-bg-soft p-5" data-reveal="up">
                <p className="t-label text-steel">Standards &amp; properties — as stated by {p.brand}</p>
                <ul className="mt-3 flex flex-col gap-2">
                  {p.standards.map((s) => (
                    <li key={s.label} className="flex gap-2.5 text-[14px] text-ink">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-indigo" aria-hidden />
                      <span>
                        <span className="font-semibold">{s.label}</span>
                        {s.detail ? <span className="text-muted"> — {s.detail}</span> : null}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-8" data-reveal="up">
              <h2 className="t-h3 text-ink">About this product</h2>
              <p className="mt-3 max-w-[68ch] text-[15px] leading-relaxed text-muted">{p.about}</p>
            </div>
          </div>

          <aside className="flex flex-col gap-5 lg:col-span-5">
            {p.uses.length > 0 && (
              <div className="rounded-[8px] border border-line p-5" data-reveal="up">
                <p className="t-label text-steel">Used for</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {p.uses.map((u) => (
                    <li key={u} className="rounded-[4px] bg-surface-blue px-2.5 py-1 text-[13px] text-indigo">
                      {u}
                    </li>
                  ))}
                </ul>
                {p.notFor && (
                  <p className="mt-4 flex gap-2 border-t border-line pt-4 text-[13.5px] leading-relaxed text-ink">
                    <CircleSlash className="mt-0.5 h-4 w-4 shrink-0 text-orange-ink" aria-hidden />
                    <span>
                      <span className="font-semibold">Not for: </span>
                      {p.notFor}
                    </span>
                  </p>
                )}
              </div>
            )}
            <Link href={{pathname: '/partners', hash: brand.slug}} className="tile-lift group flex items-center justify-between gap-4 rounded-[8px] border border-line p-5" data-reveal="up">
              <span>
                <span className="t-label text-steel">{brand.relation}</span>
                <span className="mt-1 block text-[14.5px] font-semibold text-ink group-hover:text-indigo">More from {p.brand}</span>
                <span className="block text-[13px] text-muted">{brand.supplies}</span>
              </span>
              <ArrowRight className="h-5 w-5 shrink-0 text-indigo" aria-hidden />
            </Link>
          </aside>
        </div>
      </section>

      {p.faqs.length > 0 && (
        <section className="bg-white pb-12 sm:pb-16" aria-labelledby="faq-title">
          <div className="shell grid grid-cols-1 gap-6 lg:grid-cols-[1fr_2fr]">
            <h2 id="faq-title" className="t-h3 text-ink">
              Frequently asked
            </h2>
            <FaqList items={p.faqs} />
          </div>
        </section>
      )}

      <section className="border-t border-line bg-bg-soft py-10 sm:py-14" aria-labelledby="rel-title">
        <div className="shell">
          <div className="flex items-end justify-between gap-4">
            <h2 id="rel-title" className="t-h3 text-ink">
              Related products
            </h2>
            <Link href={categoryHref(cat.slug)} className="arrow-nudge inline-flex items-center gap-1 text-[14px] font-semibold text-indigo">
              All {copy.short} <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
          <ul className="rail -mx-[var(--side)] mt-5 gap-3 px-[var(--side)] pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-4">
            {related.map((r) => (
              <li key={r.slug} className="w-[60vw] max-w-[240px] sm:w-auto sm:max-w-none">
                <ProductTile product={r} size="sm" />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
