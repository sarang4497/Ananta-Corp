import type {CSSProperties} from 'react';
import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {setRequestLocale} from 'next-intl/server';
import {ArrowRight, Check, CircleSlash, Columns2, MessageCircleQuestion} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {PRODUCTS, categoryBySlug, categoryHref, productByPath, productPath, relatedProducts, subcategoryHref, type CategorySlug} from '@/data/products';
import {specBlocksFor, uspsFor} from '@/data/usps';
import {CATEGORY_COPY, SUB_NAMES} from '@/content/categories';
import {BRAND_ASSETS} from '@/content/site';
import {postsForProduct} from '@/content/blog';
import {siteUrl} from '@/config';
import {Breadcrumbs} from '@/components/catalog2/Breadcrumbs';
import {Gallery} from '@/components/catalog2/Gallery';
import {EnquiryBox} from '@/components/catalog2/EnquiryBox';
import {FaqList} from '@/components/catalog2/FaqList';
import {ProductTile, compareHref, isComparable} from '@/components/catalog2/ProductTile';
import {SpecBlocks, UspRow} from '@/components/catalog2/product/SpecBlocks';
import {RelatedGuides} from '@/components/catalog2/product/RelatedGuides';
import {BrandLogo} from '@/components/site/BrandLogo';
import {buildAlternates} from '@/lib/metadata';
import {quoteMessage} from '@/lib/quote';
import {breadcrumbJsonLd, faqJsonLd, productJsonLd} from '@/lib/jsonld';

type Params = {params: Promise<{locale: string; category: string; sub: string; slug: string}>};

const d = (ms: number) => ({'--d': `${ms}ms`}) as CSSProperties;

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
  const guides = postsForProduct(p.slug);
  const brand = BRAND_ASSETS[p.brand];
  const usps = uspsFor(p);
  const blocks = specBlocksFor(p);
  const comparable = isComparable(p);
  const decor = p.specs.find(([k]) => k === 'Décor')?.[1];
  const url = siteUrl + productPath(p);
  const typeLine = `${copy.short}${cat.subs.length > 1 ? ` · ${SUB_NAMES[sub]}` : ''}`;
  const crumbs = [
    {label: 'Home', href: '/' as const},
    {label: 'Products', href: '/products' as const},
    {label: copy.name, href: categoryHref(cat.slug)},
    ...(cat.subs.length > 1 ? [{label: SUB_NAMES[sub], href: subcategoryHref(cat.slug, sub)}] : []),
    {label: p.short}
  ];

  return (
    <>
      <span hidden data-wa-context={quoteMessage({product: p.name})} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            productJsonLd(p, url),
            breadcrumbJsonLd([
              {name: 'Home', url: siteUrl},
              {name: 'Products', url: `${siteUrl}/products`},
              {name: copy.name, url: `${siteUrl}/products/${cat.slug}`},
              ...(cat.subs.length > 1 ? [{name: SUB_NAMES[sub], url: `${siteUrl}/products/${cat.slug}/${sub}`}] : []),
              {name: p.name, url}
            ]),
            ...(p.faqs.length ? [faqJsonLd(p.faqs)] : [])
          ])
        }}
      />

      {/* ── Hero: gallery + identity + quote ─────────────────────────────── */}
      <section className="border-b border-line bg-white">
        <div className="shell pb-10 pt-6 sm:pt-8 lg:pb-14">
          <Breadcrumbs items={crumbs} />
          <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="min-w-0 lg:sticky lg:top-[calc(var(--header-h,72px)+24px)] lg:self-start">
              <Gallery images={[p.cardImage, ...p.images.filter((im) => im !== p.cardImage)]} name={p.name} />
            </div>
            <div className="flex min-w-0 flex-col">
              <div className="hero-in flex flex-wrap items-center gap-3">
                <BrandLogo brand={p.brand} height={p.brand === 'Action TESA' ? 30 : 22} />
                <span className="t-label text-steel">{typeLine}</span>
              </div>
              <h1 className="hero-in mt-4 text-[clamp(1.7rem,1.2rem+1.9vw,2.6rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-ink text-balance" style={d(60)}>
                {p.name}
              </h1>
              <p className="hero-in t-lead mt-3 text-muted" style={d(120)}>
                {p.summary}
              </p>

              {usps.length > 0 && (
                <div className="hero-in mt-5" style={d(160)}>
                  <UspRow usps={usps} />
                </div>
              )}

              <div className="hero-in mt-5" style={d(200)}>
                <EnquiryBox name={p.name} sizes={p.sizes} sizesLabel={p.sizesLabel} sizesNote={p.sizesNote} category={copy.name} finish={decor} />
              </div>

              <div className="hero-in mt-3 flex flex-wrap gap-x-5 gap-y-1" style={d(240)}>
                {comparable && (
                  <Link href={compareHref(p)} className="inline-flex min-h-11 items-center gap-1.5 text-[13.5px] font-semibold text-indigo hover:underline" data-testid="product-compare">
                    <Columns2 className="h-4 w-4" aria-hidden /> Compare with another product
                  </Link>
                )}
                <a href="#specification" className="inline-flex min-h-11 items-center gap-1.5 text-[13.5px] font-semibold text-ink hover:text-indigo">
                  Full specification <ArrowRight className="h-4 w-4 rotate-90" aria-hidden />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Overview + visual spec blocks ────────────────────────────────── */}
      <section className="bg-bg-soft py-10 sm:py-14" aria-labelledby="overview-title">
        <div className="shell grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <p className="t-label text-orange-ink" data-reveal="up">
              Overview
            </p>
            <h2 id="overview-title" className="t-h3 mt-2 text-ink" data-reveal="up">
              About {p.short}
            </h2>
            <p className="mt-3 max-w-[64ch] text-[15px] leading-relaxed text-muted" data-reveal="up">
              {p.about}
            </p>
            {p.specsOnRequest && (
              <p className="mt-4 rounded-[8px] border border-line bg-white p-4 text-[14px] leading-relaxed text-muted" data-reveal="up">
                Detailed specifications, finishes and variants are shared on request — ask the team on WhatsApp.
              </p>
            )}
          </div>
          <div className="min-w-0 lg:col-span-7">
            {blocks.length > 0 && (
              <>
                <h3 className="t-label mb-3 text-steel" data-reveal="up">
                  At a glance
                </h3>
                <SpecBlocks blocks={blocks} />
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── Full specification + standards + used for / not for ──────────── */}
      <section id="specification" className="scroll-mt-[calc(var(--header-h,72px)+16px)] bg-white py-10 sm:py-14" aria-labelledby="spec-title">
        <div className="shell grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-7">
            <h2 id="spec-title" className="t-h3 text-ink" data-reveal="up">
              Specification
            </h2>
            <dl className="mt-4 divide-y divide-line border-y border-line" data-reveal="up" data-testid="spec-table">
              {p.specs.map(([k, v]) => (
                <div key={k} className="grid grid-cols-1 gap-1 py-3 text-[14px] min-[420px]:grid-cols-[minmax(110px,38%)_1fr] min-[420px]:gap-4">
                  <dt className="text-muted">{k}</dt>
                  <dd className="min-w-0 break-words font-medium text-ink">{v}</dd>
                </div>
              ))}
              {p.sizes.length > 0 && (
                <div className="grid grid-cols-1 gap-1 py-3 text-[14px] min-[420px]:grid-cols-[minmax(110px,38%)_1fr] min-[420px]:gap-4">
                  <dt className="text-muted">{p.sizesLabel ?? 'Sizes'} — listed</dt>
                  <dd className="min-w-0 break-words font-mono text-[13px] text-ink">{p.sizes.every((s) => /MM$/.test(s)) ? `${p.sizes.map((s) => s.replace(' MM', '')).join(' · ')} mm` : p.sizes.join(' · ')}</dd>
                </div>
              )}
            </dl>
            {p.sizesNote && (
              <p className="mt-3 text-[13px] leading-relaxed text-muted" data-reveal="up">
                {p.sizesNote}
              </p>
            )}

            {p.standards.length > 0 && (
              <div className="mt-6 rounded-[10px] bg-bg-soft p-5" data-reveal="up">
                <p className="t-label text-steel">Standards &amp; properties — as stated by {p.brand}</p>
                <ul className="mt-3 flex flex-col gap-2">
                  {p.standards.map((s) => (
                    <li key={s.label} className="flex gap-2.5 text-[14px] text-ink">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-indigo" aria-hidden />
                      <span className="min-w-0">
                        <span className="font-semibold">{s.label}</span>
                        {s.detail ? <span className="text-muted"> — {s.detail}</span> : null}
                        <span className="text-muted"> (as stated by {s.by})</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <aside className="flex min-w-0 flex-col gap-5 lg:col-span-5">
            {(p.uses.length > 0 || p.notFor) && (
              <div className="grid grid-cols-1 gap-px overflow-hidden rounded-[10px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2" data-reveal="up">
                {p.uses.length > 0 && (
                  <div className="bg-white p-5">
                    <h3 className="t-label text-steel">Used for</h3>
                    <ul className="mt-3 flex flex-col gap-2">
                      {p.uses.map((u) => (
                        <li key={u} className="flex gap-2 text-[14px] text-ink">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-indigo" aria-hidden />
                          <span className="min-w-0">{u}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="bg-white p-5">
                  <h3 className="t-label text-steel">Not for</h3>
                  {p.notFor ? (
                    <p className="mt-3 flex gap-2 text-[14px] leading-relaxed text-ink">
                      <CircleSlash className="mt-0.5 h-4 w-4 shrink-0 text-orange-ink" aria-hidden />
                      <span className="min-w-0">{p.notFor}</span>
                    </p>
                  ) : (
                    <p className="mt-3 text-[14px] leading-relaxed text-muted">No specific limit listed. Share your site conditions and ask the team about suitability.</p>
                  )}
                </div>
              </div>
            )}

            {comparable && (
              <Link href={compareHref(p)} className="tile-lift group flex items-center justify-between gap-4 rounded-[10px] border border-line p-5" data-reveal="up">
                <span className="min-w-0">
                  <span className="t-label text-steel">Compare tool</span>
                  <span className="mt-1 block text-[14.5px] font-semibold text-ink group-hover:text-indigo">Compare {p.short} side by side</span>
                  <span className="block text-[13px] text-muted">Verified attributes only — grade, exposure, density, standards, thickness.</span>
                </span>
                <Columns2 className="h-5 w-5 shrink-0 text-indigo" aria-hidden />
              </Link>
            )}

            <Link href={{pathname: '/partners', hash: brand.slug}} className="tile-lift group flex items-center justify-between gap-4 rounded-[10px] border border-line p-5" data-reveal="up">
              <span className="min-w-0">
                <span className="t-label text-steel">{brand.relation}</span>
                <span className="mt-1 block text-[14.5px] font-semibold text-ink group-hover:text-indigo">More from {p.brand}</span>
                <span className="block text-[13px] text-muted">{brand.supplies}</span>
              </span>
              <ArrowRight className="h-5 w-5 shrink-0 text-indigo" aria-hidden />
            </Link>
          </aside>
        </div>
      </section>

      {/* ── FAQs ─────────────────────────────────────────────────────────── */}
      {p.faqs.length > 0 && (
        <section className="bg-white pb-12 sm:pb-16" aria-labelledby="faq-title">
          <div className="shell grid grid-cols-1 gap-6 lg:grid-cols-[1fr_2fr]">
            <div>
              <h2 id="faq-title" className="t-h3 text-ink" data-reveal="up">
                Frequently asked
              </h2>
              <p className="mt-2 flex gap-2 text-[13.5px] text-muted">
                <MessageCircleQuestion className="mt-0.5 h-4 w-4 shrink-0 text-indigo" aria-hidden />
                <span>Something else? Ask the team on WhatsApp with your size and quantity.</span>
              </p>
            </div>
            <FaqList items={p.faqs} />
          </div>
        </section>
      )}

      <RelatedGuides posts={guides} />

      {/* ── Related products ─────────────────────────────────────────────── */}
      <section className="border-t border-line bg-bg-soft pb-[calc(2.5rem+env(safe-area-inset-bottom))] pt-10 sm:pb-14 sm:pt-14" aria-labelledby="rel-title">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 id="rel-title" className="t-h3 text-ink" data-reveal="up">
              Related products
            </h2>
            <Link href={categoryHref(cat.slug)} className="arrow-nudge inline-flex min-h-11 items-center gap-1 text-[14px] font-semibold text-indigo">
              All {copy.short} <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
          <ul className="rail -mx-[var(--side)] mt-5 gap-3 px-[var(--side)] pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-4">
            {related.map((r) => (
              <li key={r.slug} className="w-[68vw] max-w-[260px] shrink-0 snap-start sm:w-auto sm:max-w-none">
                <ProductTile product={r} size="sm" />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
