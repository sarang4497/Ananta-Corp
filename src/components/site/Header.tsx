'use client';

import Image from 'next/image';
import {useCallback, useEffect, useId, useRef, useState} from 'react';
import {ArrowRight, ChevronDown, Phone} from 'lucide-react';
import {Link, usePathname} from '@/i18n/navigation';
import {CATEGORIES, PRODUCTS, categoryHref, productHref, subcategoryHref} from '@/data/products';
import {CATEGORY_COPY, SUB_NAMES} from '@/content/categories';
import {BRAND_ASSETS, COMPANY, WA} from '@/content/site';
import {BRANDS, STATS, countByBrand, countByCategory} from '@/data/stats';
import {BrandLogo} from './BrandLogo';
import {MobileMenu} from './MobileMenu';
import {Logo} from './Logo';
import {WhatsAppIcon} from '@/components/ui/Button';
import {whatsappUrl} from '@/lib/whatsapp';
import {cn} from '@/lib/cn';

type Panel = 'products' | 'brands' | 'capabilities' | null;

export const CAPABILITIES = [
  {label: 'Material supply', body: 'Plywood, MDF, boards, doors and smart locks from one source.', href: '/products' as const},
  {label: 'Ready stock', body: `Inventory held in ${COMPANY.facility} of warehouse and workshop space.`, href: {pathname: '/about', hash: 'operations'} as const},
  {label: 'Custom furniture', body: 'Custom sizes and furniture made to your drawings.', href: {pathname: '/about', hash: 'custom'} as const},
  {label: 'Project support', body: 'Bulk orders, contractor partnerships, design + execution support.', href: {pathname: '/about', hash: 'support'} as const}
];

/**
 * Sticky header. Desktop (≥1080): Products mega menu with live category
 * preview, Brands and Capabilities panels — open on hover-intent (~140 ms),
 * click, or keyboard; Escape closes and returns focus. Phones/tablets: the
 * full-height MobileMenu sheet.
 */
export function Header() {
  const [open, setOpen] = useState<Panel>(null);
  const [preview, setPreview] = useState(CATEGORIES[0].slug);
  const [scrolled, setScrolled] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const pathname = usePathname();
  const ids = {products: useId(), brands: useId(), capabilities: useId()};
  const triggers = useRef<Record<string, HTMLButtonElement | null>>({});

  // Close panels on navigation (state derived during render, not in an effect).
  const [path, setPath] = useState(pathname);
  if (path !== pathname) {
    setPath(pathname);
    setOpen(null);
  }
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        triggers.current[open]?.focus();
        setOpen(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const intent = useCallback((p: Panel, delay: number) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(p), delay);
  }, []);

  const cat = CATEGORIES.find((c) => c.slug === preview)!;
  const copy = CATEGORY_COPY[cat.slug];
  const catProducts = PRODUCTS.filter((p) => p.category === cat.slug);

  const trigger = (p: Exclude<Panel, null>, label: string) => (
    <button
      ref={(n) => {
        triggers.current[p] = n;
      }}
      type="button"
      aria-expanded={open === p}
      aria-controls={ids[p]}
      onClick={() => setOpen((v) => (v === p ? null : p))}
      onPointerEnter={(e) => e.pointerType === 'mouse' && intent(p, open ? 0 : 140)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && intent(null, 180)}
      className={cn(
        'inline-flex h-10 items-center gap-1 rounded-[5px] px-3 text-[14px] font-medium transition-colors duration-150',
        open === p ? 'bg-bg-soft text-indigo' : 'text-ink hover:text-indigo'
      )}
    >
      {label}
      <ChevronDown className={cn('h-3.5 w-3.5 transition-transform duration-150', open === p && 'rotate-180')} aria-hidden />
    </button>
  );

  return (
    <header className="sticky top-0 z-50" data-testid="site-header">
      {/* Utility bar — desktop only, first-party lines (A1 announcement bar). */}
      <div className="hidden bg-navy text-white/80 nav:block">
        <div className="shell flex h-8 items-center justify-between gap-6 text-[12px]">
          <p className="truncate">
            <span className="text-orange-light">●</span>&nbsp; Bulk orders &amp; contractor partnerships · Material supply + custom furniture
          </p>
          <div className="flex shrink-0 items-center gap-5">
            <a href={COMPANY.phoneHref} className="hover:text-white">
              {COMPANY.phoneDisplay}
            </a>
            <a href={`mailto:${COMPANY.email}`} className="hover:text-white">
              {COMPANY.email}
            </a>
          </div>
        </div>
      </div>

      <div
        className={cn(
          'relative border-b bg-white/95 backdrop-blur-md transition-[box-shadow,border-color] duration-200',
          scrolled || open ? 'border-line shadow-[0_8px_24px_-20px_rgba(11,26,60,0.5)]' : 'border-transparent'
        )}
        onPointerLeave={(e) => e.pointerType === 'mouse' && intent(null, 180)}
      >
        <div className="shell flex h-16 items-center justify-between gap-4">
          <Logo />

          <nav aria-label="Main" className="hidden items-center gap-0.5 nav:flex">
            {trigger('products', 'Products')}
            {trigger('brands', 'Brands')}
            {trigger('capabilities', 'Capabilities')}
            <Link href="/about" className="inline-flex h-10 items-center px-3 text-[14px] font-medium text-ink hover:text-indigo">
              About
            </Link>
            <Link href="/contact" className="inline-flex h-10 items-center px-3 text-[14px] font-medium text-ink hover:text-indigo">
              Contact
            </Link>
          </nav>

          <div className="hidden items-center gap-2 nav:flex">
            <a
              href={COMPANY.phoneHref}
              className="inline-flex h-10 items-center gap-2 px-2 text-[13px] font-medium text-muted hover:text-indigo"
              aria-label={`Call ${COMPANY.phoneDisplay}`}
            >
              <Phone className="h-4 w-4" aria-hidden />
            </a>
            <a
              href={whatsappUrl(WA.default)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center gap-2 rounded-[6px] bg-orange px-4 text-[13.5px] font-semibold text-white transition-colors duration-150 hover:bg-orange-deep"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Request price
            </a>
          </div>

          <MobileMenu />
        </div>

        {/* ── Panels ─────────────────────────────────────────────────────── */}
        <div
          id={ids.products}
          role="region"
          aria-label="Products menu"
          hidden={open !== 'products'}
          onPointerEnter={(e) => e.pointerType === 'mouse' && intent('products', 0)}
          className="absolute inset-x-0 top-full hidden border-b border-line bg-white shadow-lift nav:block"
        >
          <div className="shell grid grid-cols-[300px_1fr_260px] gap-8 py-7">
            <ul className="flex flex-col">
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={categoryHref(c.slug)}
                    onPointerEnter={() => setPreview(c.slug)}
                    onFocus={() => setPreview(c.slug)}
                    className={cn(
                      'flex items-center justify-between gap-3 border-l-2 px-3 py-2.5 text-[14.5px] transition-colors duration-150',
                      preview === c.slug ? 'border-orange bg-bg-soft font-semibold text-indigo' : 'border-transparent text-ink hover:text-indigo'
                    )}
                  >
                    {CATEGORY_COPY[c.slug].name}
                    <span className="t-label text-steel">{countByCategory(c.slug)}</span>
                  </Link>
                </li>
              ))}
              <li className="mt-3 border-t border-line pt-3">
                <Link href="/products" className="arrow-nudge flex items-center gap-1.5 px-3 py-1.5 text-[13.5px] font-semibold text-indigo">
                  All {STATS.products} products <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </Link>
              </li>
            </ul>

            {/* Live preview of the hovered/focused category */}
            <div className="grid grid-cols-[200px_1fr] gap-6" aria-live="polite">
              <div className="relative aspect-square overflow-hidden rounded-md bg-bg-soft">
                <Image src={cat.image} alt="" fill sizes="200px" className="object-cover" />
              </div>
              <div className="min-w-0">
                <p className="t-label text-orange-ink">{copy.brands.join(' · ')}</p>
                <p className="mt-1.5 text-lg font-semibold text-ink">{copy.name}</p>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">{copy.what}</p>
                <p className="mt-3 text-[12.5px] text-muted">
                  <span className="font-semibold text-ink">Best for:</span> {copy.bestFor}
                </p>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {(cat.subs.length > 1
                    ? cat.subs.map((s) => ({label: SUB_NAMES[s.slug], href: subcategoryHref(cat.slug, s.slug)}))
                    : catProducts.slice(0, 5).map((p) => ({label: p.short, href: productHref(p)}))
                  ).map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="inline-flex rounded-[4px] border border-line px-2.5 py-1 text-[12.5px] text-ink hover:border-indigo/40 hover:text-indigo"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex flex-col gap-2 border-l border-line pl-6">
              <p className="t-label text-steel">Tools</p>
              <Link href="/decor" className="group rounded-md p-2 hover:bg-bg-soft">
                <span className="block text-[14px] font-semibold text-ink group-hover:text-indigo">Décor library</span>
                <span className="text-[12.5px] text-muted">{STATS.decors} prelam finishes by code</span>
              </Link>
              <Link href={{pathname: '/', hash: 'selector'}} className="group rounded-md p-2 hover:bg-bg-soft">
                <span className="block text-[14px] font-semibold text-ink group-hover:text-indigo">Material selector</span>
                <span className="text-[12.5px] text-muted">Application → grade → product</span>
              </Link>
              <Link href={{pathname: '/', hash: 'compare'}} className="group rounded-md p-2 hover:bg-bg-soft">
                <span className="block text-[14px] font-semibold text-ink group-hover:text-indigo">Compare boards</span>
                <span className="text-[12.5px] text-muted">Two products, side by side</span>
              </Link>
            </div>
          </div>
        </div>

        <div
          id={ids.brands}
          role="region"
          aria-label="Brands menu"
          hidden={open !== 'brands'}
          onPointerEnter={(e) => e.pointerType === 'mouse' && intent('brands', 0)}
          className="absolute inset-x-0 top-full hidden border-b border-line bg-white shadow-lift nav:block"
        >
          <div className="shell grid grid-cols-3 gap-6 py-7">
            {BRANDS.map((b) => (
              <Link
                key={b}
                href={{pathname: '/partners', hash: BRAND_ASSETS[b].slug}}
                className="group flex flex-col gap-3 rounded-md border border-line p-5 transition-colors duration-150 hover:border-indigo/40"
              >
                <div className="flex h-10 items-center">
                  <BrandLogo brand={b} height={b === 'Action TESA' ? 34 : 24} />
                </div>
                <p className="t-label text-orange-ink">
                  {BRAND_ASSETS[b].relation} · {countByBrand(b)} products
                </p>
                <p className="text-[13.5px] leading-relaxed text-muted">{BRAND_ASSETS[b].supplies}</p>
              </Link>
            ))}
          </div>
        </div>

        <div
          id={ids.capabilities}
          role="region"
          aria-label="Capabilities menu"
          hidden={open !== 'capabilities'}
          onPointerEnter={(e) => e.pointerType === 'mouse' && intent('capabilities', 0)}
          className="absolute inset-x-0 top-full hidden border-b border-line bg-white shadow-lift nav:block"
        >
          <div className="shell grid grid-cols-4 gap-6 py-7">
            {CAPABILITIES.map((c, i) => (
              <Link key={c.label} href={c.href} className="group border-t-2 border-line pt-4 hover:border-orange">
                <span className="t-label text-steel">0{i + 1}</span>
                <span className="mt-1 block text-[15px] font-semibold text-ink group-hover:text-indigo">{c.label}</span>
                <span className="mt-1 block text-[13px] leading-relaxed text-muted">{c.body}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
