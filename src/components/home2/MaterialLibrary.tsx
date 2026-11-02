'use client';

import Image from 'next/image';
import {useMemo, useState} from 'react';
import {ArrowRight} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {CATEGORIES, PRODUCTS, type Product} from '@/data/products';
import {CATEGORY_COPY} from '@/content/categories';
import {APPLICATIONS, BRAND_ASSETS} from '@/content/site';
import {BRANDS, STATS, thicknessesFor} from '@/data/stats';
import {ProductTile} from '@/components/catalog2/ProductTile';
import {cn} from '@/lib/cn';

type Mode = 'category' | 'brand' | 'application';

type Facet = {key: string; label: string; count: number; match: (p: Product) => boolean; note?: string; image?: string};

function facetsFor(mode: Mode): Facet[] {
  if (mode === 'brand')
    return BRANDS.map((b) => ({
      key: b,
      label: b,
      count: PRODUCTS.filter((p) => p.brand === b).length,
      match: (p: Product) => p.brand === b,
      note: `${BRAND_ASSETS[b].relation} — ${BRAND_ASSETS[b].supplies}`
    }));
  if (mode === 'application')
    return APPLICATIONS.map((a) => ({
      key: a.key,
      label: a.label,
      count: PRODUCTS.filter((p) => p.applications.includes(a.key)).length,
      match: (p: Product) => p.applications.includes(a.key),
      note: a.hint
    }));
  return CATEGORIES.map((c) => {
    const t = thicknessesFor(c.slug);
    return {
      key: c.slug,
      label: CATEGORY_COPY[c.slug].name,
      count: PRODUCTS.filter((p) => p.category === c.slug).length,
      match: (p: Product) => p.category === c.slug,
      note: CATEGORY_COPY[c.slug].what + (t.length ? ` ${t.length} thickness options listed.` : ''),
      image: c.image
    };
  });
}

/**
 * 03 PRODUCT WORLD — "Explore the material library". The catalogue itself is
 * the proof of range: real tiles, real counts, three ways in (category /
 * brand / application — all from the data). Desktop: sticky navigator + wide
 * 4-col matrix. Phones: chip rail + swipeable tile rail.
 */
export function MaterialLibrary() {
  const [mode, setMode] = useState<Mode>('category');
  const facets = useMemo(() => facetsFor(mode), [mode]);
  const [active, setActive] = useState<string>('all');
  const facet = facets.find((f) => f.key === active);
  const list = facet ? PRODUCTS.filter(facet.match) : PRODUCTS;

  const switchMode = (m: Mode) => {
    setMode(m);
    setActive('all');
  };

  return (
    <section id="library" className="bg-bg-soft py-14 sm:py-20" aria-labelledby="library-title">
      <div className="shell-wide">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div data-reveal="up">
            <p className="t-label text-orange-ink">The material library</p>
            <h2 id="library-title" className="t-h2 mt-3 max-w-[22ch] text-ink">
              {STATS.products} products. {STATS.categories} categories. One place to specify.
            </h2>
          </div>
          <div role="tablist" aria-label="Browse by" className="inline-flex w-fit rounded-[7px] border border-line bg-white p-1" data-reveal="up">
            {(
              [
                ['category', 'Category'],
                ['brand', 'Brand'],
                ['application', 'Application']
              ] as const
            ).map(([m, l]) => (
              <button
                key={m}
                role="tab"
                type="button"
                aria-selected={mode === m}
                onClick={() => switchMode(m)}
                className={cn(
                  'min-h-10 rounded-[5px] px-3.5 text-[13.5px] font-semibold transition-colors duration-150 sm:px-4',
                  mode === m ? 'bg-navy text-white' : 'text-muted hover:text-ink'
                )}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr] lg:gap-8">
          {/* Navigator: sticky list on desktop, chip rail on phones */}
          <div className="lg:sticky lg:top-[calc(var(--header-h)+48px)] lg:self-start">
            <ul className="rail -mx-[var(--side)] gap-2 px-[var(--side)] lg:mx-0 lg:flex lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0" aria-label="Filter">
              <li>
                <FacetButton active={active === 'all'} onClick={() => setActive('all')} label="All products" count={STATS.products} />
              </li>
              {facets.map((f) => (
                <li key={f.key}>
                  <FacetButton active={active === f.key} onClick={() => setActive(f.key)} label={f.label} count={f.count} image={f.image} />
                </li>
              ))}
            </ul>
            <p className="mt-4 hidden min-h-[4.5rem] text-[13px] leading-relaxed text-muted lg:block" aria-live="polite">
              {facet?.note ?? 'Every product Ananta lists — plywood, MDF, HDHMR, Moist Master, prelam boards, flush doors and smart locks.'}
            </p>
          </div>

          <div className="min-w-0">
            <p className="mb-3 text-[13px] text-muted lg:hidden" aria-live="polite">
              {facet?.note ?? 'Every product in the catalogue.'}
            </p>
            <ul
              key={`${mode}-${active}`}
              className="rail -mx-[var(--side)] gap-3 px-[var(--side)] pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 md:grid-cols-3 xl:grid-cols-4"
            >
              {list.map((p, i) => (
                <li key={p.slug} className="w-[64vw] max-w-[260px] sm:w-auto sm:max-w-none" data-reveal="up" style={{['--d' as string]: `${Math.min(i, 8) * 40}ms`}}>
                  <ProductTile product={p} />
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link href="/products" className="arrow-nudge inline-flex items-center gap-1.5 text-[14.5px] font-semibold text-indigo">
                Open the full catalogue with filters <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <span className="t-label text-steel">Showing {list.length} of {STATS.products}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FacetButton({active, onClick, label, count, image}: {active: boolean; onClick: () => void; label: string; count: number; image?: string}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'flex min-h-11 w-full items-center gap-3 whitespace-nowrap rounded-[6px] border px-3 text-left text-[14px] transition-colors duration-150 lg:rounded-none lg:border-0 lg:border-l-2 lg:py-2.5',
        active
          ? 'border-navy bg-navy font-semibold text-white lg:border-orange lg:bg-white lg:text-indigo'
          : 'border-line bg-white text-ink hover:text-indigo lg:bg-transparent'
      )}
    >
      {image && (
        <span className="relative hidden h-8 w-8 shrink-0 overflow-hidden rounded-[3px] bg-bg-soft lg:block">
          <Image src={image} alt="" fill sizes="32px" className="object-cover" />
        </span>
      )}
      <span className="flex-1">{label}</span>
      <span className={cn('t-label', active ? 'text-white/70 lg:text-orange-ink' : 'text-steel')}>{count}</span>
    </button>
  );
}
