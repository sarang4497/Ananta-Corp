import {ArrowRight} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {PRODUCTS, categoryHref} from '@/data/products';
import {CATEGORY_COPY} from '@/content/categories';
import {BRAND_ASSETS} from '@/content/site';
import {BRANDS, countByBrand} from '@/data/stats';
import {BrandLogo} from '@/components/site/BrandLogo';

/**
 * 05 AUTHORIZED BRANDS — navy band. Logo on a white plate (official colours
 * kept), the relationship exactly as A1 states it (Tenon = supplied range,
 * never "authorized"), what Ananta supplies from that brand (computed from the
 * catalogue) and links into those categories.
 */
export function BrandsBand() {
  return (
    <section aria-labelledby="brands-title" className="relative overflow-hidden bg-navy py-14 text-white sm:py-20">
      <div aria-hidden className="bg-grid-dark pointer-events-none absolute inset-0 opacity-60" />
      <div className="shell relative">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between" data-reveal="up">
          <div>
            <p className="t-label text-orange-light">Brands on the shelf</p>
            <h2 id="brands-title" className="t-h2 mt-3 max-w-[24ch]">
              Recognised manufacturers, one supply desk.
            </h2>
          </div>
          <Link href="/partners" className="arrow-nudge inline-flex items-center gap-1.5 text-[14.5px] font-semibold text-white/85 hover:text-white">
            About our brands <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        <ul className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-[10px] border border-navy-line bg-navy-line lg:grid-cols-3">
          {BRANDS.map((b, i) => {
            const cats = [...new Set(PRODUCTS.filter((p) => p.brand === b).map((p) => p.category))];
            return (
              <li key={b} className="flex flex-col gap-5 bg-navy p-6 sm:p-7" data-reveal="up" style={{['--d' as string]: `${i * 90}ms`}}>
                <div className="flex h-16 items-center justify-center rounded-[6px] bg-white px-5">
                  <BrandLogo brand={b} height={b === 'Action TESA' ? 40 : b === 'Duroply' ? 25 : 20} />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="t-label text-orange-light">{BRAND_ASSETS[b].relation}</span>
                  <span className="t-label text-white/55">{countByBrand(b)} products</span>
                </div>
                <p className="text-[14.5px] leading-relaxed text-white/80">{BRAND_ASSETS[b].supplies}</p>
                <ul className="mt-auto flex flex-wrap gap-2">
                  {cats.map((c) => (
                    <li key={c}>
                      <Link
                        href={categoryHref(c)}
                        className="inline-flex min-h-9 items-center rounded-[4px] border border-white/20 px-3 text-[12.5px] font-medium text-white/90 hover:border-white/60"
                      >
                        {CATEGORY_COPY[c].short}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
