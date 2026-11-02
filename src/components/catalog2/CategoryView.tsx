import Image from 'next/image';
import {ArrowRight} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {categoryHref, subcategoryHref, type Category, type Product} from '@/data/products';
import {CATEGORY_COPY, SUB_NAMES} from '@/content/categories';
import {WA} from '@/content/site';
import {DECORS} from '@/data/decors';
import {STATS, thicknessesFor} from '@/data/stats';
import {BrandLogo} from '@/components/site/BrandLogo';
import {WhatsAppIcon, buttonClassName} from '@/components/ui/Button';
import {whatsappUrl} from '@/lib/whatsapp';
import {PageIntro} from './PageIntro';
import {ProductTile} from './ProductTile';
import {SpecMatrix} from './SpecMatrix';
import {FaqList} from './FaqList';
import type {Crumb} from './Breadcrumbs';
import {cn} from '@/lib/cn';

/**
 * Category + subcategory page body. WHAT IT IS / BEST FOR / KEY
 * DIFFERENTIATOR / BRAND up top, then products, a spec matrix for
 * specifiers, the décor library for prelam, and first-party FAQs.
 */
export function CategoryView({cat, sub, products, crumbs}: {cat: Category; sub?: string; products: Product[]; crumbs: Crumb[]}) {
  const copy = CATEGORY_COPY[cat.slug];
  const title = sub ? `${SUB_NAMES[sub]} ${copy.short}` : copy.name;
  const thick = thicknessesFor(cat.slug);
  const faqs = [...new Map(products.flatMap((p) => p.faqs).map((f) => [f.q, f])).values()].slice(0, 6);
  const boards = products.some((p) => p.exposure);
  const isPrelam = cat.slug === 'pre-laminated-particle-board';

  return (
    <>
      <span hidden data-wa-context={WA.category(title)} />
      <PageIntro
        crumbs={crumbs}
        eyebrow={copy.brands.join(' · ')}
        title={title}
        lead={copy.what}
        aside={
          <div className="relative aspect-[16/10] overflow-hidden rounded-[10px] bg-bg-soft" data-reveal="mask">
            <Image src={cat.image} alt={`${copy.name} — material render`} fill priority sizes="(max-width:1024px) 100vw, 40vw" className="object-cover" />
          </div>
        }
      >
        <dl className="hero-in mt-6 grid grid-cols-1 gap-px overflow-hidden rounded-[8px] border border-line bg-line sm:grid-cols-3" style={{['--d' as string]: '180ms'}}>
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
            <dd className="mt-1 text-[13.5px] leading-snug text-ink">
              {products.length} product{products.length > 1 ? 's' : ''}
              {thick.length > 0 && !sub ? ` · ${thick.length} thicknesses` : ''}
              {isPrelam ? ` · ${STATS.decors} décors` : ''}
            </dd>
          </div>
        </dl>
        <div className="hero-in mt-5 flex flex-wrap items-center gap-4" style={{['--d' as string]: '220ms'}}>
          {copy.brands.map((b) => (
            <BrandLogo key={b} brand={b} height={b === 'Action TESA' ? 30 : 22} />
          ))}
        </div>
      </PageIntro>

      {cat.subs.length > 1 && (
        <nav aria-label={`${copy.name} grades`} className="border-b border-line bg-white">
          <ul className="shell rail gap-2 py-3">
            <li>
              <Link href={categoryHref(cat.slug)} className={cn('inline-flex min-h-10 items-center rounded-[5px] border px-3.5 text-[13.5px] font-medium', !sub ? 'border-navy bg-navy text-white' : 'border-line text-ink hover:border-indigo/40')}>
                All {copy.short}
              </Link>
            </li>
            {cat.subs.map((s) => (
              <li key={s.slug}>
                <Link
                  href={subcategoryHref(cat.slug, s.slug)}
                  aria-current={sub === s.slug ? 'page' : undefined}
                  className={cn('inline-flex min-h-10 items-center whitespace-nowrap rounded-[5px] border px-3.5 text-[13.5px] font-medium', sub === s.slug ? 'border-navy bg-navy text-white' : 'border-line text-ink hover:border-indigo/40')}
                >
                  {SUB_NAMES[s.slug]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <section className="bg-bg-soft py-10 sm:py-14" aria-label="Products">
        <div className="shell">
          <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
            {products.map((p, i) => (
              <li key={p.slug} data-reveal="up" style={{['--d' as string]: `${Math.min(i, 8) * 50}ms`}}>
                <ProductTile product={p} size={products.length > 3 ? 'sm' : 'md'} priority={i < 2} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {isPrelam && (
        <section className="border-b border-line bg-white py-10 sm:py-14" aria-labelledby="decor-promo">
          <div className="shell grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.4fr] lg:items-center">
            <div data-reveal="up">
              <p className="t-label text-orange-ink">Décor library</p>
              <h2 id="decor-promo" className="t-h2 mt-3 text-ink">
                {STATS.decors} finishes to choose from.
              </h2>
              <p className="mt-3 text-[15px] text-muted">Search by name or design code and ask for any finish on WhatsApp.</p>
              <Link href="/decor" className={buttonClassName('primary', 'md', 'arrow-nudge mt-5')}>
                Open the décor library <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
            <ul className="grid grid-cols-6 gap-1.5 sm:grid-cols-8" aria-hidden>
              {DECORS.filter((_, i) => i % 6 === 0)
                .slice(0, 24)
                .map((d) => (
                  <li key={d.code} className="relative aspect-square overflow-hidden rounded-[3px] bg-bg-soft">
                    <Image src={d.image} alt="" fill sizes="80px" className="object-cover" />
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

      <section className="border-t border-line bg-bg-soft">
        <div className="shell flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[16px] font-semibold text-ink">Need {title.toLowerCase()} for a project? Send sizes and quantities.</p>
          <a href={whatsappUrl(WA.category(title))} target="_blank" rel="noopener noreferrer" className={buttonClassName('orange', 'md')}>
            <WhatsAppIcon className="h-4 w-4" /> Get price on WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
