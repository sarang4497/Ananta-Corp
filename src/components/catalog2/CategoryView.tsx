import type {CSSProperties} from 'react';
import Image from 'next/image';
import {ArrowRight} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {categoryHref, productHref, subcategoryHref, type Category, type Product} from '@/data/products';
import {CATEGORY_COPY, SUB_NAMES} from '@/content/categories';
import {WA} from '@/content/site';
import {postsForProduct, type Post} from '@/content/blog';
import {DECORS} from '@/data/decors';
import {STATS, thicknessesFor} from '@/data/stats';
import {uspsFor, usesLine} from '@/data/usps';
import {BrandLogo} from '@/components/site/BrandLogo';
import {WhatsAppIcon} from '@/components/ui/Button';
import {quoteWhatsappUrl} from '@/lib/quote';
import {faqJsonLd} from '@/lib/jsonld';
import {PageIntro} from './PageIntro';
import {ProductTile} from './ProductTile';
import {SpecMatrix} from './SpecMatrix';
import {FaqList} from './FaqList';
import {UspTabs} from './product/UspTabs';
import {RelatedGuides} from './product/RelatedGuides';
import type {Crumb} from './Breadcrumbs';
import {cn} from '@/lib/cn';

const d = (ms: number) => ({'--d': `${ms}ms`}) as CSSProperties;

function guidesFor(products: Product[]): Post[] {
  const seen = new Map<string, Post>();
  for (const p of products) for (const g of postsForProduct(p.slug)) seen.set(g.slug, g);
  return [...seen.values()];
}

/**
 * Category + subcategory page body: intro (what / best for / key point /
 * computed range), grade chips, a tabbed "Key attributes" block, product
 * cards, the specifier matrix, the décor library for prelam, first-party
 * FAQs, related guides and a quote band. Every number is computed.
 */
export function CategoryView({cat, sub, products, crumbs}: {cat: Category; sub?: string; products: Product[]; crumbs: Crumb[]}) {
  const copy = CATEGORY_COPY[cat.slug];
  const title = sub ? `${SUB_NAMES[sub]} ${copy.short}` : copy.name;
  const thick = [...new Set(products.flatMap((p) => p.sizes.filter((s) => /MM$/.test(s))))];
  const allThick = thicknessesFor(cat.slug);
  const faqs = [...new Map(products.flatMap((p) => p.faqs).map((f) => [f.q, f])).values()].slice(0, 6);
  const boards = products.some((p) => p.exposure);
  const isPrelam = cat.slug === 'pre-laminated-particle-board';
  const guides = guidesFor(products);
  const quoteCtx = {category: title, source: sub ? 'Subcategory page' : 'Category page'};
  const tabs = products.map((p) => ({slug: p.slug, label: p.short, name: p.name, href: productHref(p), usps: uspsFor(p), uses: usesLine(p, 4)}));

  const range = [
    `${products.length} product${products.length === 1 ? '' : 's'}`,
    (sub ? thick.length : allThick.length) > 0 ? `${sub ? thick.length : allThick.length} thickness options` : null,
    isPrelam ? `${STATS.decors} décors in the library` : null
  ].filter(Boolean);

  return (
    <>
      <span hidden data-wa-context={WA.category(title)} />
      {faqs.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(faqJsonLd(faqs))}} />}
      <PageIntro
        crumbs={crumbs}
        eyebrow={copy.brands.join(' · ')}
        title={title}
        lead={copy.what}
        aside={
          <div className="relative aspect-[16/10] overflow-hidden rounded-[12px] bg-bg-soft" data-reveal="image">
            <Image src={cat.image} alt={`${copy.name} — material render`} fill priority sizes="(max-width:1024px) 100vw, 40vw" className="object-cover" />
          </div>
        }
      >
        <dl className="hero-in mt-6 grid grid-cols-1 gap-px overflow-hidden rounded-[10px] border border-line bg-line sm:grid-cols-3" style={d(180)}>
          <div className="bg-white p-4">
            <dt className="t-label text-steel">Best for</dt>
            <dd className="mt-1 text-[13.5px] leading-snug text-ink">{copy.bestFor}</dd>
          </div>
          <div className="bg-white p-4">
            <dt className="t-label text-steel">Key point</dt>
            <dd className="mt-1 text-[13.5px] leading-snug text-ink">{copy.key}</dd>
          </div>
          <div className="bg-white p-4">
            <dt className="t-label text-steel">Range</dt>
            <dd className="mt-1 text-[13.5px] leading-snug text-ink" data-testid="category-range">
              {range.join(' · ')}
            </dd>
          </div>
        </dl>
        <div className="hero-in mt-5 flex flex-wrap items-center gap-4" style={d(220)}>
          {copy.brands.map((b) => (
            <BrandLogo key={b} brand={b} height={b === 'Action TESA' ? 30 : 22} />
          ))}
          <a
            href={quoteWhatsappUrl(quoteCtx)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 rounded-[6px] bg-orange px-4 text-center text-[14px] font-semibold text-white text-balance hover:bg-orange-deep sm:ml-auto"
          >
            <WhatsAppIcon className="h-4 w-4 shrink-0" /> Get price on WhatsApp
          </a>
        </div>
      </PageIntro>

      {cat.subs.length > 1 && (
        <nav aria-label={`${copy.name} grades`} className="border-b border-line bg-white">
          <ul className="shell flex flex-wrap gap-2 py-3">
            <li>
              <Link
                href={categoryHref(cat.slug)}
                aria-current={!sub ? 'page' : undefined}
                className={cn('inline-flex min-h-11 items-center rounded-[6px] border px-3.5 text-[13.5px] font-medium', !sub ? 'border-navy bg-navy text-white' : 'border-line text-ink hover:border-indigo/40')}
              >
                All {copy.short}
              </Link>
            </li>
            {cat.subs.map((s) => (
              <li key={s.slug}>
                <Link
                  href={subcategoryHref(cat.slug, s.slug)}
                  aria-current={sub === s.slug ? 'page' : undefined}
                  className={cn('inline-flex min-h-11 items-center rounded-[6px] border px-3.5 text-[13.5px] font-medium', sub === s.slug ? 'border-navy bg-navy text-white' : 'border-line text-ink hover:border-indigo/40')}
                >
                  {SUB_NAMES[s.slug]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <section className="bg-bg-soft py-10 sm:py-14" aria-labelledby="products-title">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 id="products-title" className="t-h3 text-ink" data-reveal="up">
              {products.length === 1 ? 'The product' : `${products.length} products`}
            </h2>
            <Link href="/products" className="arrow-nudge inline-flex min-h-11 items-center gap-1 text-[14px] font-semibold text-indigo">
              Full catalogue <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
          <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 2xl:grid-cols-4">
            {products.map((p, i) => (
              <li key={p.slug} data-reveal="up" style={d(Math.min(i, 8) * 50)}>
                <ProductTile product={p} priority={i < 2} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {tabs.length > 1 && (
        <section className="border-b border-line bg-white py-10 sm:py-14" aria-labelledby="usp-title">
          <div className="shell">
            <p className="t-label text-orange-ink" data-reveal="up">
              Verified from product data
            </p>
            <h2 id="usp-title" className="t-h2 mt-2 text-ink" data-reveal="up">
              Key attributes
            </h2>
            <p className="mt-2 max-w-[62ch] text-[14.5px] text-muted" data-reveal="up">
              Pick a product to see its grade, standard, exposure and thickness at a glance. Standards are as stated by the manufacturer.
            </p>
            <div className="mt-6">
              <UspTabs items={tabs} />
            </div>
          </div>
        </section>
      )}

      {isPrelam && (
        <section className="border-b border-line bg-white py-10 sm:py-14" aria-labelledby="decor-promo">
          <div className="shell grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.4fr] lg:items-center">
            <div data-reveal="up">
              <p className="t-label text-orange-ink">Décor library</p>
              <h2 id="decor-promo" className="t-h2 mt-3 text-ink">
                {STATS.decors} finishes to choose from.
              </h2>
              <p className="mt-3 text-[15px] text-muted">Search by name or design code and ask for any finish on WhatsApp.</p>
              <Link
                href="/decor"
                className="arrow-nudge mt-5 inline-flex min-h-11 items-center gap-2 rounded-[6px] bg-indigo px-5 text-center text-[14px] font-semibold text-white text-balance hover:bg-blue"
              >
                Open the décor library <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
            <ul className="grid grid-cols-6 gap-1.5 sm:grid-cols-8" aria-hidden>
              {DECORS.filter((_, i) => i % 6 === 0)
                .slice(0, 24)
                .map((dc) => (
                  <li key={dc.code} className="relative aspect-square overflow-hidden rounded-[3px] bg-bg-soft">
                    <Image src={dc.image} alt="" fill sizes="80px" className="object-cover" />
                  </li>
                ))}
            </ul>
          </div>
        </section>
      )}

      {boards && products.length > 1 && (
        <section className="bg-white py-10 sm:py-14" aria-labelledby="matrix-title">
          <div className="shell">
            <h2 id="matrix-title" className="t-h3 text-ink" data-reveal="up">
              At a glance — for specifiers
            </h2>
            <p className="mt-1 text-[13.5px] text-muted">Verified values only. Standards are as stated by the manufacturer for that product.</p>
            <div className="mt-5" data-reveal="up">
              <SpecMatrix products={products} />
            </div>
          </div>
        </section>
      )}

      {faqs.length > 0 && (
        <section className="bg-white pb-14 pt-4 sm:pb-20" aria-labelledby="faq-title">
          <div className="shell grid grid-cols-1 gap-6 lg:grid-cols-[1fr_2fr]">
            <h2 id="faq-title" className="t-h3 text-ink">
              Questions buyers ask
            </h2>
            <FaqList items={faqs} />
          </div>
        </section>
      )}

      <RelatedGuides posts={guides} />

      <section className="border-t border-line bg-surface-blue">
        <div className="shell flex flex-col gap-4 py-10 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-[17px] font-semibold leading-snug text-ink text-pretty">Need {title.toLowerCase()} for a project?</p>
            <p className="mt-1 text-[14px] text-muted">Share sizes, quantities and your city to get current price and availability.</p>
          </div>
          <a
            href={quoteWhatsappUrl(quoteCtx)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-[6px] bg-orange px-5 text-center text-[15px] font-semibold text-white text-balance hover:bg-orange-deep"
          >
            <WhatsAppIcon className="h-4 w-4 shrink-0" /> Get price on WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
