'use client';

import {useEffect, useMemo, useState} from 'react';
import {Search, X} from 'lucide-react';
import {CATEGORIES, PRODUCTS, type Application, type Brand, type CategorySlug, type Exposure} from '@/data/products';
import {CATEGORY_COPY} from '@/content/categories';
import {APPLICATIONS, EXPOSURE_LABEL} from '@/content/site';
import {BRANDS} from '@/data/stats';
import {ProductTile} from './ProductTile';
import {cn} from '@/lib/cn';

type F = {q: string; category: CategorySlug | ''; brand: Brand | ''; app: Application | ''; exposure: Exposure | ''};
const EMPTY: F = {q: '', category: '', brand: '', app: '', exposure: ''};

/**
 * The catalogue browser: search + four filters, every one backed by real
 * product data (category, brand, application mapping, exposure from A1 copy).
 * Counts update live; filters sync to the URL (?category=…) so a filtered
 * view can be shared on WhatsApp.
 */
export function CatalogBrowser() {
  const [f, setF] = useState<F>(EMPTY);

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    // Read deep-link filters after hydration (keeps the SSR grid complete).
    const id = requestAnimationFrame(() => setF({
      q: sp.get('q') ?? '',
      category: (sp.get('category') as CategorySlug) ?? '',
      brand: (sp.get('brand') as Brand) ?? '',
      app: (sp.get('app') as Application) ?? '',
      exposure: (sp.get('exposure') as Exposure) ?? ''
    }));
    return () => cancelAnimationFrame(id);
  }, []);
  useEffect(() => {
    const sp = new URLSearchParams();
    (Object.keys(f) as (keyof F)[]).forEach((k) => f[k] && sp.set(k, f[k]));
    const qs = sp.toString();
    window.history.replaceState(null, '', qs ? `?${qs}` : window.location.pathname);
  }, [f]);

  const match = useMemo(
    () => (except?: keyof F) =>
      PRODUCTS.filter((p) => {
        const q = f.q.trim().toLowerCase();
        if (except !== 'q' && q && !`${p.name} ${p.brand} ${p.summary} ${p.uses.join(' ')} ${p.decorCode ?? ''}`.toLowerCase().includes(q)) return false;
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
  const set = <K extends keyof F>(k: K, v: F[K]) => setF((x) => ({...x, [k]: x[k] === v ? '' : v}));

  const group = <K extends 'category' | 'brand' | 'app' | 'exposure'>(k: K, label: string, opts: {v: F[K]; l: string}[]) => {
    const base = match(k);
    return (
      <fieldset className="min-w-0">
        <legend className="t-label text-steel">{label}</legend>
        <div className="rail -mx-[var(--side)] mt-2 gap-1.5 px-[var(--side)] lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0">
          {opts.map((o) => {
            const n = base.filter((p) =>
              k === 'category' ? p.category === o.v : k === 'brand' ? p.brand === o.v : k === 'app' ? p.applications.includes(o.v as Application) : p.exposure === o.v
            ).length;
            const on = f[k] === o.v;
            return (
              <button
                key={String(o.v)}
                type="button"
                aria-pressed={on}
                disabled={!n && !on}
                onClick={() => set(k, o.v)}
                className={cn(
                  'inline-flex min-h-10 items-center gap-2 whitespace-nowrap rounded-[5px] border px-3 text-[13px] transition-colors duration-150 disabled:opacity-40',
                  on ? 'border-navy bg-navy font-semibold text-white' : 'border-line bg-white text-ink hover:border-indigo/40'
                )}
              >
                {o.l}
                <span className={cn('t-label', on ? 'text-white/70' : 'text-steel')}>{n}</span>
              </button>
            );
          })}
        </div>
      </fieldset>
    );
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[290px_1fr] lg:gap-10">
      <aside className="flex min-w-0 flex-col gap-5 lg:sticky lg:top-[calc(var(--header-h)+48px)] lg:self-start" aria-label="Filters">
        <label className="relative block">
          <span className="sr-only">Search products</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-steel" aria-hidden />
          <input
            type="search"
            value={f.q}
            onChange={(e) => setF((x) => ({...x, q: e.target.value}))}
            placeholder="Search — e.g. BWP, 18 mm, walnut, 1104"
            className="min-h-11 w-full rounded-[6px] border border-line bg-white pl-9 pr-3 text-[14px] text-ink placeholder:text-steel focus:border-indigo/50 focus:outline-none"
          />
        </label>
        {group('category', 'Category', CATEGORIES.map((c) => ({v: c.slug, l: CATEGORY_COPY[c.slug].short})))}
        {/* Phones: secondary filters fold into a native <details> so products start
            on screen 1. Desktop: always visible (separate copy; one is display:none). */}
        <details className="group lg:hidden" open={!!(f.brand || f.app || f.exposure) || undefined}>
          <summary className="flex min-h-11 items-center justify-between rounded-[6px] border border-line bg-white px-3 text-[13.5px] font-semibold text-ink">
            More filters — brand, application, exposure
            <span aria-hidden className="t-label text-steel group-open:rotate-45">+</span>
          </summary>
          <div className="mt-4 flex flex-col gap-5">
            {group('brand', 'Brand', BRANDS.map((b) => ({v: b, l: b})))}
            {group('app', 'Application', APPLICATIONS.map((a) => ({v: a.key, l: a.label})))}
            {group('exposure', 'Exposure (boards)', (['dry', 'humid', 'wet'] as const).map((e) => ({v: e, l: EXPOSURE_LABEL[e]})))}
          </div>
        </details>
        <div className="hidden flex-col gap-5 lg:flex">
            {group('brand', 'Brand', BRANDS.map((b) => ({v: b, l: b})))}
            {group('app', 'Application', APPLICATIONS.map((a) => ({v: a.key, l: a.label})))}
            {group('exposure', 'Exposure (boards)', (['dry', 'humid', 'wet'] as const).map((e) => ({v: e, l: EXPOSURE_LABEL[e]})))}
        </div>
      </aside>

      <div className="min-w-0">
        <div className="mb-4 flex min-h-10 flex-wrap items-center justify-between gap-3">
          <p className="text-[14px] text-muted" aria-live="polite" data-testid="result-count">
            <span className="font-semibold text-ink">{list.length}</span> of {PRODUCTS.length} products
          </p>
          {active > 0 && (
            <button type="button" onClick={() => setF(EMPTY)} className="inline-flex min-h-10 items-center gap-1.5 text-[13px] font-semibold text-indigo">
              <X className="h-3.5 w-3.5" aria-hidden /> Clear {active} filter{active > 1 ? 's' : ''}
            </button>
          )}
        </div>
        {list.length ? (
          <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
            {list.map((p, i) => (
              <li key={p.slug}>
                <ProductTile product={p} size="sm" priority={i < 4} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-[8px] border border-line bg-bg-soft p-6 text-[14px] text-muted">
            No product matches all of these filters. Clear one, or ask the team on WhatsApp — they can advise on alternatives.
          </p>
        )}
      </div>
    </div>
  );
}
