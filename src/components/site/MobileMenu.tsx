'use client';

import Image from 'next/image';
import {useEffect, useRef, useState, type ReactNode} from 'react';
import {createPortal} from 'react-dom';
import {ArrowRight, ChevronDown, ChevronRight, Menu, Phone, Search, X} from 'lucide-react';
import {Link, usePathname} from '@/i18n/navigation';
import {NAV_APPLICATIONS, NAV_BRANDS, NAV_CATEGORIES, NAV_COMPANY, NAV_RESOURCES, NAV_TOOLS, NAV_TOTAL, SEARCH_PLACEHOLDER, UTILITY} from '@/content/nav';
import {quoteContactHref, quoteWhatsappUrl} from '@/lib/quote';
import {WhatsAppIcon} from '@/components/ui/Button';
import {cn} from '@/lib/cn';
import {useNavPosts} from './NavPosts';
import {ToolIcon} from './ToolIcon';

type Section = 'brands' | 'applications' | 'tools' | 'resources';

/**
 * Phones/tablets (<1080): premium full-height sheet under the header.
 * Search field on top → product categories as photo rows with real counts →
 * accordions for Brands / Applications / Tools / Resources → company links.
 * Get Price, WhatsApp and Call are pinned at the bottom (safe-area padded).
 * Body scroll locked while open; Escape and route change close it; focus
 * moves into the sheet and back to the trigger. Sets html[data-menu-open]
 * so the bottom utility bar steps aside.
 */
export function MobileMenu() {
  const NAV_POSTS = useNavPosts();
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState<Section | null>(null);
  const [q, setQ] = useState('');
  const pathname = usePathname();
  const btn = useRef<HTMLButtonElement>(null);
  const sheet = useRef<HTMLDivElement>(null);

  const [path, setPath] = useState(pathname);
  if (path !== pathname) {
    setPath(pathname);
    setOpen(false);
  }
  useEffect(() => {
    const html = document.documentElement;
    if (open) {
      html.style.overflow = 'hidden';
      html.dataset.menuOpen = '1';
      sheet.current?.querySelector<HTMLElement>('[data-autofocus]')?.focus();
    } else {
      html.style.overflow = '';
      delete html.dataset.menuOpen;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        setOpen(false);
        btn.current?.focus();
      }
    };
    // Search / assistant opened from elsewhere → close the sheet.
    const close = () => setOpen(false);
    window.addEventListener('keydown', onKey);
    window.addEventListener('open-search', close);
    window.addEventListener('open-bella', close);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('open-search', close);
      window.removeEventListener('open-bella', close);
    };
  }, [open]);

  const submitSearch = () => {
    setOpen(false);
    window.dispatchEvent(new CustomEvent('open-search', {detail: q.trim() ? {q: q.trim()} : undefined}));
  };

  const acc = (key: Section, label: string, count: number | undefined, body: ReactNode) => (
    <div className="border-b border-line">
      <button
        type="button"
        aria-expanded={section === key}
        aria-controls={`mm-${key}`}
        onClick={() => setSection((s) => (s === key ? null : key))}
        className="flex min-h-14 w-full items-center justify-between gap-3 text-left text-[18px] font-semibold tracking-tight text-ink"
      >
        <span>
          {label}
          {count !== undefined && <span className="t-label ml-2 align-middle text-steel">{count}</span>}
        </span>
        <ChevronDown className={cn('h-5 w-5 shrink-0 text-steel transition-transform duration-200', section === key && 'rotate-180')} aria-hidden />
      </button>
      <div id={`mm-${key}`} hidden={section !== key} className="pb-4">
        {body}
      </div>
    </div>
  );

  const row = 'flex min-h-12 items-center justify-between gap-3 text-[15.5px] text-ink active:text-indigo';

  return (
    <div className="nav:hidden">
      <button
        ref={btn}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? 'Close menu' : 'Open menu'}
        data-testid="menu-toggle"
        className="-mr-2 grid h-11 w-11 place-items-center rounded-[8px] text-ink hover:bg-bg-soft"
      >
        {open ? <X className="h-6 w-6" aria-hidden /> : <Menu className="h-6 w-6" aria-hidden />}
      </button>

      {/* Portalled to <body> so no ancestor can become the fixed sheet's containing block. */}
      {open &&
        createPortal(
          <div
            id="mobile-menu"
            ref={sheet}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            data-testid="mobile-menu"
            className="sheet-up fixed inset-x-0 bottom-0 top-[var(--header-h)] z-[60] flex flex-col border-t border-line bg-white"
          >
            <nav aria-label="Mobile" className="flex-1 overflow-y-auto overscroll-contain">
              <div className="shell pb-6 pt-4">
                <form
                  role="search"
                  onSubmit={(e) => {
                    e.preventDefault();
                    submitSearch();
                  }}
                  className="flex min-h-12 items-center gap-2 rounded-[10px] border border-line bg-bg-soft pl-3 pr-1.5 focus-within:border-indigo/40 focus-within:bg-white"
                >
                  <Search className="h-5 w-5 shrink-0 text-indigo" aria-hidden />
                  <label htmlFor="mm-search" className="sr-only">
                    Search
                  </label>
                  <input
                    id="mm-search"
                    type="text"
                    inputMode="search"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder={SEARCH_PLACEHOLDER}
                    enterKeyHint="search"
                    className="min-w-0 flex-1 bg-transparent py-2 text-[16px] text-ink outline-none placeholder:text-steel"
                  />
                  <button type="submit" className="grid h-10 w-10 shrink-0 place-items-center rounded-[8px] text-indigo" aria-label="Search">
                    <ArrowRight className="h-5 w-5" aria-hidden />
                  </button>
                </form>

                <div className="mt-5 flex items-baseline justify-between gap-3">
                  <p className="t-label text-steel">Products</p>
                  <Link href="/products" data-autofocus className="inline-flex min-h-11 items-center gap-1 text-[14px] font-semibold text-indigo">
                    All {NAV_TOTAL} <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </div>
                <ul className="mt-1 flex flex-col divide-y divide-line border-y border-line">
                  {NAV_CATEGORIES.map((c) => (
                    <li key={c.slug}>
                      <Link href={c.href} className="flex min-h-[68px] items-center gap-3.5 py-2.5 active:bg-bg-soft">
                        <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[8px] bg-bg-soft">
                          <Image src={c.image} alt="" fill sizes="56px" className="object-cover" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[16px] font-semibold leading-snug text-ink">{c.name}</span>
                          <span className="block text-[13px] text-muted">
                            {c.count} {c.count === 1 ? 'product' : 'products'} · {c.brands.join(' · ')}
                          </span>
                        </span>
                        <ChevronRight className="h-5 w-5 shrink-0 text-steel" aria-hidden />
                      </Link>
                    </li>
                  ))}
                </ul>

                <div className="mt-2">
                  {acc(
                    'brands',
                    'Brands',
                    NAV_BRANDS.length,
                    <ul className="flex flex-col">
                      {NAV_BRANDS.map((b) => (
                        <li key={b.brand}>
                          <Link href={b.href} className={row}>
                            <span>{b.brand}</span>
                            <span className="t-label shrink-0 text-right text-steel">
                              {b.relation} · {b.count}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                  {acc(
                    'applications',
                    'Applications',
                    NAV_APPLICATIONS.length,
                    <ul className="flex flex-col">
                      {NAV_APPLICATIONS.map((a) => (
                        <li key={a.key}>
                          <Link href={a.href} className={row}>
                            <span>{a.label}</span>
                            <span className="tabular shrink-0 text-[13px] text-steel">{a.count}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                  {acc(
                    'tools',
                    'Tools',
                    NAV_TOOLS.length,
                    <ul className="flex flex-col">
                      {NAV_TOOLS.map((t) => (
                        <li key={t.slug}>
                          <Link href={t.href} className="flex min-h-12 items-center gap-3 py-1.5 text-ink">
                            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[6px] bg-surface-blue text-indigo">
                              <ToolIcon icon={t.icon} className="h-[18px] w-[18px]" />
                            </span>
                            <span className="min-w-0">
                              <span className="block text-[15.5px]">{t.name}</span>
                              <span className="block text-[12.5px] text-muted">{t.short}</span>
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                  {acc(
                    'resources',
                    'Resources',
                    undefined,
                    <ul className="flex flex-col">
                      {NAV_POSTS.map((p) => (
                        <li key={p.slug}>
                          <Link href={p.href} className={row}>
                            {p.title}
                          </Link>
                        </li>
                      ))}
                      {NAV_RESOURCES.map((r) => (
                        <li key={r.label}>
                          <Link href={r.href} className={row}>
                            <span>{r.label}</span>
                            {r.count !== undefined && <span className="tabular shrink-0 text-[13px] text-steel">{r.count}</span>}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                  {NAV_COMPANY.map((l) => (
                    <Link key={l.label} href={l.href} className="flex min-h-14 items-center border-b border-line text-[18px] font-semibold tracking-tight text-ink">
                      {l.label}
                    </Link>
                  ))}
                </div>
                <p className="mt-5 text-[13px] leading-relaxed text-muted">
                  GSTIN {UTILITY.gstin} · {UTILITY.location}
                </p>
              </div>
            </nav>
            <div className="border-t border-line bg-white" style={{paddingBottom: 'calc(12px + env(safe-area-inset-bottom))'}}>
              <div className="shell grid grid-cols-[1.3fr_1fr_auto] gap-2 pt-3">
                <Link
                  href={quoteContactHref({source: 'Mobile menu'})}
                  className="inline-flex min-h-12 items-center justify-center rounded-[8px] bg-orange px-3 text-center text-[15px] font-semibold text-white"
                >
                  Get Price
                </Link>
                <a
                  href={quoteWhatsappUrl({source: 'Mobile menu'})}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[8px] border border-wa/40 px-3 text-[15px] font-semibold text-ink"
                >
                  <WhatsAppIcon className="h-4 w-4 text-wa" /> WhatsApp
                </a>
                <a
                  href={UTILITY.phoneHref}
                  aria-label={`Call ${UTILITY.phoneDisplay}`}
                  className="inline-flex min-h-12 min-w-12 items-center justify-center gap-2 rounded-[8px] border border-line px-3 text-[15px] font-semibold text-ink"
                >
                  <Phone className="h-4 w-4" aria-hidden /> <span className="max-[359px]:sr-only">Call</span>
                </a>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
