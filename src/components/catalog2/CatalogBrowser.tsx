'use client';

import {useEffect, useMemo, useState} from 'react';
import {Search, SlidersHorizontal, X} from 'lucide-react';
import {CATEGORIES, PRODUCTS, type Application, type Brand, type CategorySlug, type Exposure} from '@/data/products';
import {CATEGORY_COPY} from '@/content/categories';
import {APPLICATIONS, EXPOSURE_LABEL} from '@/content/site';
import {BRANDS} from '@/data/stats';
import {ProductTile} from './ProductTile';
import {cn} from '@/lib/cn';

type F = {q: string; category: CategorySlug | ''; brand: Brand | ''; app: Application | ''; exposure: Exposure | ''};
type FacetKey = 'category' | 'brand' | 'app' | 'exposure';
const EMPTY: F = {q: '', category: '', brand: '', app: '', exposure: ''};

const OPTIONS: Record<FacetKey, {label: string; opts: {v: string; l: string}[]}> = {
  category: {label: 'Category', opts: CATEGORIES.map((c) => ({v: c.slug, l: CATEGORY_COPY[c.slug].short}))},
  brand: {label: 'Brand', opts: BRANDS.map((b) => ({v: b, l: b}))},
  app: {label: 'Application', opts: APPLICATIONS.map((a) => ({v: a.key, l: a.label}))},
  exposure: {label: 'Exposure (boards)', opts: (['dry', 'humid', 'wet'] as const).map((e) => ({v: e, l: EXPOSURE_LABEL[e]}))}
};
const SECONDARY: FacetKey[] = ['brand', 'app', 'exposure'];

/**
 * The catalogue browser: search + four facets, every one backed by real
 * product data (category, brand, application mapping, exposure from A1 copy).
 * Counts update live; filters sync to the URL (?category=…&app=…) so a
 * filtered view can be shared on WhatsApp.
 *
 * Phones: search + a category scroller up top, the other facets in a
 * "Filters" bottom sheet. The sheet IS a native <details>, so it still opens
 * without JavaScript (it simply renders inline then).
 */
export function CatalogBrowser() {
  const [f, setF] = useState<F>(EMPTY);
  const [sheet, setSheet] = useState(false);

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    // Read deep-link filters after hydration (keeps the SSR grid complete).
    const id = requestAnimationFrame(() =>
      setF({
        q: sp.get('q') ?? '',
        category: (sp.get('category') as CategorySlug) ?? '',
        brand: (sp.get('brand') as Brand) ?? '',
        app: (sp.get('app') as Application) ?? '',
        exposure: (sp.get('exposure') as Exposure) ?? ''
      })
    );
    return () => cancelAnimationFrame(id);
  }, []);
  useEffect(() => {
    const sp = new URLSearchParams();
    (Object.keys(f) as (keyof F)[]).forEach((k) => f[k] && sp.set(k, f[k]));
    const qs = sp.toString();
    window.history.replaceState(null, '', qs ? `?${qs}` : window.location.pathname);
  }, [f]);
  // Lock page scroll while the phone sheet is open; Escape closes it.
  useEffect(() => {
    if (!sheet) return;
    const mq = window.matchMedia('(min-width: 1024px)');
    if (mq.matches) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSheet(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.documentElement.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [sheet]);

  const match = useMemo(
    () => (except?: keyof F) =>
      PRODUCTS.filter((p) => {
        const q = f.q.trim().toLowerCase();
        if (except !== 'q' && q && !`${p.name} ${p.brand} ${p.summary} ${p.uses.join(' ')} ${p.sizes.join(' ')} ${p.decorCode ?? ''}`.toLowerCase().includes(q)) return false;
        if (except !== 'category' && f.category && p.category !== f.category) return false;
        if (except !== 'brand' && f.brand && p.brand !== f.brand) return false;
        if (except !== 'app' && f.app && !p.applications.includes(f.app)) return false;
        if (except !== 'exposure' && f.exposure && p.exposure !== f.exposure) return false;
        return true;
      }),
    [f]
  );
  const list = match();
  const active = (Object.keys(f) as (keyof F)[]).filter((k) => f[k]).length;
  const secondaryActive = SECONDARY.filter((k) => f[k]).length;
  const set = (k: FacetKey, v: string) => setF((x) => ({...x, [k]: x[k] === v ? '' : v}));
  const count = (k: FacetKey, v: string) =>
    match(k).filter((p) => (k === 'category' ? p.category === v : k === 'brand' ? p.brand === v : k === 'app' ? p.applications.includes(v as Application) : p.exposure === v)).length;

  const chip = (k: FacetKey, o: {v: string; l: string}, rail = false) => {
    const n = count(k, o.v);
    const on = f[k] === o.v;
    return (
      <button
        key={o.v}
        type="button"
        aria-pressed={on}
        disabled={!n && !on}
        onClick={() => set(k, o.v)}
        className={cn(
          'inline-flex min-h-11 items-center gap-2 rounded-[6px] border px-3 py-1.5 text-left text-[13px] leading-snug transition-colors duration-150 disabled:opacity-40',
          rail && 'shrink-0 snap-start',
          on ? 'border-navy bg-navy font-semibold text-white' : 'border-line bg-white text-ink hover:border-indigo/40'
        )}
      >
        <span>{o.l}</span>
        <span className={cn('t-label tabular-nums', on ? 'text-white/70' : 'text-steel')}>{n}</span>
      </button>
    );
  };

  const group = (k: FacetKey) => (
    <fieldset key={k} className="min-w-0">
      <legend className="t-label text-steel">{OPTIONS[k].label}</legend>
      <div className="mt-2 flex flex-wrap gap-1.5">{OPTIONS[k].opts.map((o) => chip(k, o))}</div>
    </fieldset>
  );

  const search = (
    <label className="relative block">
      <span className="sr-only">Search products</span>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-steel" aria-hidden />
      <input
        type="search"
        value={f.q}
        onChange={(e) => setF((x) => ({...x, q: e.target.value}))}
        placeholder="Search — e.g. BWP, 18 mm, walnut, 1104"
        className="min-h-12 w-full rounded-[8px] border border-line bg-white pl-9 pr-3 text-[14.5px] text-ink placeholder:text-steel focus:border-indigo/50 focus:outline-none focus-visible:outline-2 focus-visible:outline-blue"
      />
    </label>
  );

  const pills = (Object.keys(OPTIONS) as FacetKey[])
    .filter((k) => f[k])
    .map((k) => ({k, l: OPTIONS[k].opts.find((o) => o.v === f[k])?.l ?? f[k]}));

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr] lg:gap-10">
      {/* Desktop filter column */}
      <aside className="hidden min-w-0 flex-col gap-6 rounded-[12px] border border-line bg-white p-5 lg:sticky lg:top-[calc(var(--header-h,72px)+32px)] lg:flex lg:self-start" aria-label="Filters">
        {search}
        {(Object.keys(OPTIONS) as FacetKey[]).map(group)}
      </aside>

      {/* Phone / tablet: search, category scroller, Filters sheet */}
      <div className="flex min-w-0 flex-col gap-3 lg:hidden" aria-label="Filters" role="group">
        {search}
        <div className="rail -mx-[var(--side)] gap-1.5 px-[var(--side)] pb-1" role="group" aria-label="Category">
          {OPTIONS.category.opts.map((o) => chip('category', o, true))}
        </div>
        <details className="group/sheet" open={sheet} onToggle={(e) => setSheet((e.currentTarget as HTMLDetailsElement).open)}>
          <summary
            className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 rounded-[8px] border border-line bg-white px-4 text-[14px] font-semibold text-ink [&::-webkit-details-marker]:hidden"
            data-testid="filters-toggle"
          >
            <span className="inline-flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-indigo" aria-hidden />
              Filters
              {secondaryActive > 0 && <span className="rounded-full bg-indigo px-2 py-0.5 text-[11px] text-white">{secondaryActive}</span>}
            </span>
            <span className="text-[12.5px] font-normal text-muted">Brand · application · exposure</span>
          </summary>
          {/* Backdrop (JS only: tapping it closes the sheet). */}
          <button type="button" aria-label="Close filters" tabIndex={-1} onClick={() => setSheet(false)} className="fixed inset-0 z-[60] hidden bg-navy/40 [.js_&]:group-open/sheet:block" />
          {/* Without JS this renders inline under the summary; with JS (html.js) it is a bottom sheet. */}
          <div
            className="mt-3 flex flex-col rounded-[12px] border border-line bg-white [.js_&]:fixed [.js_&]:inset-x-0 [.js_&]:bottom-0 [.js_&]:z-[61] [.js_&]:mt-0 [.js_&]:max-h-[85dvh] [.js_&]:rounded-b-none [.js_&]:rounded-t-[16px] [.js_&]:border-0 [.js_&]:shadow-[0_-12px_40px_rgba(11,26,60,0.18)]"
            role="region"
            aria-label="Filter options"
            data-testid="filters-sheet"
          >
            <div className="flex items-center justify-between gap-3 border-b border-line px-[var(--side)] py-3">
              <p className="text-[15px] font-semibold text-ink">Filters</p>
              <button type="button" onClick={() => setSheet(false)} className="inline-flex h-11 w-11 items-center justify-center rounded-[8px] text-ink hover:bg-bg-soft" aria-label="Close filters">
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <div className="flex flex-col gap-6 overflow-y-auto px-[var(--side)] py-5">{SECONDARY.map(group)}</div>
            <div className="flex flex-wrap gap-2 border-t border-line px-[var(--side)] pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3">
              {secondaryActive > 0 && (
                <button
                  type="button"
                  onClick={() => setF((x) => ({...x, brand: '', app: '', exposure: ''}))}
                  className="inline-flex min-h-12 flex-1 items-center justify-center rounded-[6px] border border-line px-4 text-[14px] font-semibold text-ink"
                >
                  Reset
                </button>
              )}
              <button type="button" onClick={() => setSheet(false)} className="inline-flex min-h-12 flex-[2] items-center justify-center rounded-[6px] bg-indigo px-4 text-center text-[14px] font-semibold text-white">
                Show {list.length} product{list.length === 1 ? '' : 's'}
              </button>
            </div>
          </div>
        </details>
      </div>

      <div className="min-w-0">
        <div className="mb-4 flex min-h-11 flex-wrap items-center justify-between gap-3">
          <p className="text-[14px] text-muted" aria-live="polite" data-testid="result-count">
            <span className="font-semibold text-ink">{list.length}</span> of {PRODUCTS.length} products
          </p>
          {active > 0 && (
            <button type="button" onClick={() => setF(EMPTY)} className="inline-flex min-h-11 items-center gap-1.5 text-[13px] font-semibold text-indigo">
              <X className="h-3.5 w-3.5" aria-hidden /> Clear {active} filter{active > 1 ? 's' : ''}
            </button>
          )}
        </div>
        {pills.length > 0 && (
          <ul className="mb-4 flex flex-wrap gap-1.5" aria-label="Active filters">
            {pills.map(({k, l}) => (
              <li key={k}>
                <button
                  type="button"
                  onClick={() => setF((x) => ({...x, [k]: ''}))}
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-surface-blue px-3 text-[12.5px] font-medium text-indigo hover:bg-indigo hover:text-white"
                  aria-label={`Remove filter ${OPTIONS[k].label}: ${l}`}
                >
                  {l} <X className="h-3 w-3" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        )}
        {list.length ? (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3" data-testid="catalog-grid">
            {list.map((p, i) => (
              <li key={p.slug}>
                <ProductTile product={p} priority={i < 3} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-[10px] border border-line bg-white p-6 text-[14px] text-muted">
            No product matches all of these filters. Clear one, or ask the team on WhatsApp — they can advise on alternatives.
          </p>
        )}
      </div>
    </div>
  );
}
