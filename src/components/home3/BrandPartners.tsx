import {ArrowRight} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {PRODUCTS, categoryHref} from '@/data/products';
import {CATEGORY_COPY} from '@/content/categories';
import {BRAND_ASSETS} from '@/content/site';
import {BRANDS, countByBrand} from '@/data/stats';
import {BrandLogo} from '@/components/site/BrandLogo';
import {SECTION, SectionHead} from './ui';

/**
 * 07 BRAND PARTNERS — official logos, the relationship exactly as A1 states
 * it (Tenon = supplied range, never "authorised"), computed product counts,
 * supplied categories and links to /partners + the brand-filtered catalogue.
 */
export function BrandPartners() {
  return (
    <section aria-labelledby="brands-title" className={`${SECTION} bg-bg-warm`}>
      <div className="shell">
        <SectionHead
          id="brands-title"
          eyebrow="Brand partners"
          title="Recognised manufacturers, supplied from one desk."
          aside={
            <Link href="/partners" className="arrow-nudge inline-flex min-h-11 items-center gap-1.5 text-[14.5px] font-semibold text-indigo">
              About our brands <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          }
        />
        <ul className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {BRANDS.map((b, i) => {
            const a = BRAND_ASSETS[b];
            const cats = [...new Set(PRODUCTS.filter((p) => p.brand === b).map((p) => p.category))];
            return (
              <li key={b} className="flex flex-col gap-5 rounded-[12px] border border-line bg-white p-6 sm:p-7" data-reveal="up" style={{['--d' as string]: `${i * 90}ms`}}>
                <div className="flex min-h-16 items-center">
                  <BrandLogo brand={b} height={b === 'Action TESA' ? 42 : b === 'Duroply' ? 25 : 22} />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-t border-line pt-4">
                  <span className="t-label text-orange-ink">{a.relation}</span>
                  <span className="text-[13px] font-semibold text-ink">{countByBrand(b)} products listed</span>
                </div>
                <p className="text-[14.5px] leading-relaxed text-muted">{a.supplies}</p>
                <ul className="flex flex-wrap gap-2">
                  {cats.map((c) => (
                    <li key={c}>
                      <Link href={categoryHref(c)} className="inline-flex min-h-10 items-center rounded-[5px] border border-line px-3 py-1.5 text-[13px] font-medium text-ink hover:border-indigo/40 hover:text-indigo">
                        {CATEGORY_COPY[c].short}
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex flex-wrap gap-x-5 gap-y-2 pt-1">
                  <Link href={{pathname: '/products', query: {brand: b}}} className="arrow-nudge inline-flex min-h-11 items-center gap-1.5 text-[14px] font-semibold text-indigo">
                    View {b} range <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                  <Link href={{pathname: '/partners', hash: a.slug}} className="inline-flex min-h-11 items-center text-[14px] font-medium text-muted hover:text-indigo">
                    Brand page
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
