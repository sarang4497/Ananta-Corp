'use client';

import {useCallback, useEffect, useId, useRef, useState, type KeyboardEvent as ReactKeyboardEvent} from 'react';
import {ChevronDown, Mail, MapPin, Phone, Search} from 'lucide-react';
import {Link, usePathname} from '@/i18n/navigation';
import {NAV_MENUS, SEARCH_PLACEHOLDER, UTILITY, type MenuId} from '@/content/nav';
import {quoteWhatsappUrl} from '@/lib/quote';
import {whatsappUrl} from '@/lib/whatsapp';
import {WhatsAppIcon} from '@/components/ui/Button';
import {cn} from '@/lib/cn';
import {MobileMenu} from './MobileMenu';
import {MegaPanel} from './MegaPanels';
import {Logo} from './Logo';

const PANEL_LABEL: Record<MenuId, string> = {
  products: 'Products menu',
  brands: 'Brands menu',
  applications: 'Applications menu',
  tools: 'Tools menu',
  resources: 'Resources menu'
};

/** Opens site search (SearchHost listens). */
export function openSearch(q?: string) {
  window.dispatchEvent(new CustomEvent('open-search', {detail: q ? {q} : undefined}));
}

/**
 * Big white header.
 *  Desktop (≥1080, `nav:`): a slim utility bar (GSTIN · location · phone ·
 *  email · WhatsApp) that scrolls away, then the sticky 88px main bar: logo,
 *  seven menus (five with mega panels), an inline search trigger (⌘K / Ctrl-K
 *  / "/"), phone and the "Get Price" CTA. On scroll the bar compacts to 76px
 *  and gains a hairline + soft shadow.
 *  Panels open on hover-intent (~140 ms; ~100 ms when switching, ~180 ms
 *  close — a delay corridor instead of a safe triangle), on click, or by
 *  keyboard (Enter/Space toggle, ArrowDown opens and focuses the first link);
 *  Escape closes and returns focus; route change closes.
 *  Phones/tablets: 64px bar (+ notch inset) with search + menu icons.
 */
export function Header() {
  const [open, setOpen] = useState<MenuId | null>(null);
  const [seen, setSeen] = useState<Partial<Record<MenuId, true>>>({});
  const [compact, setCompact] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const pathname = usePathname();
  const uid = useId();
  const triggers = useRef<Partial<Record<MenuId, HTMLButtonElement | null>>>({});
  const panels = useRef<Partial<Record<MenuId, HTMLDivElement | null>>>({});
  const focusFirst = useRef<MenuId | null>(null);

  // Close panels on navigation (derived during render, not in an effect).
  const [path, setPath] = useState(pathname);
  if (path !== pathname) {
    setPath(pathname);
    setOpen(null);
  }
  // Mount a panel's body on first open (lazy imagery, small initial DOM).
  if (open && !seen[open]) setSeen((s) => ({...s, [open]: true}));

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 40);
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
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!document.querySelector('[data-testid="site-header"]')?.contains(t)) setOpen(null);
    };
    window.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
    };
  }, [open]);

  // ArrowDown → focus the first link once the panel body exists.
  useEffect(() => {
    if (open && focusFirst.current === open) {
      focusFirst.current = null;
      panels.current[open]?.querySelector<HTMLElement>('a,button')?.focus();
    }
  }, [open, seen]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const intent = useCallback((p: MenuId | null, delay: number) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(p), delay);
  }, []);

  const onTriggerKey = (p: MenuId) => (e: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      focusFirst.current = p;
      setOpen(p);
    }
  };

  const panelId = (p: MenuId) => `${uid}-${p}`;
  const menuText = 'text-[14.5px] font-medium min-[1280px]:text-[15px]';

  return (
    <header
      className="group/header sticky top-0 z-50 nav:-top-9"
      data-testid="site-header"
      data-compact={compact ? '1' : undefined}
    >
      {/* Utility bar — desktop only; scrolls away (header sticks at -36px). */}
      <div className="hidden border-b border-line bg-bg-soft text-[12.5px] text-muted nav:block">
        <div className="shell-header flex min-h-9 flex-wrap items-center justify-between gap-x-6 gap-y-1 py-1.5">
          <p className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <span>
              <span className="font-medium text-ink">GSTIN</span> {UTILITY.gstin}
            </span>
            <a href={UTILITY.mapsHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-indigo">
              <MapPin className="h-3.5 w-3.5 text-orange-ink" aria-hidden /> {UTILITY.location}
            </a>
          </p>
          <p className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <a href={UTILITY.phoneHref} className="inline-flex items-center gap-1.5 hover:text-indigo">
              <Phone className="h-3.5 w-3.5" aria-hidden /> {UTILITY.phoneDisplay}
            </a>
            <a href={`mailto:${UTILITY.email}`} className="inline-flex items-center gap-1.5 hover:text-indigo">
              <Mail className="h-3.5 w-3.5" aria-hidden /> {UTILITY.email}
            </a>
            <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-wa hover:text-ink">
              <WhatsAppIcon className="h-3.5 w-3.5" /> WhatsApp
            </a>
          </p>
        </div>
      </div>

      <div
        className={cn(
          'relative border-b bg-white transition-[box-shadow,border-color] duration-300',
          compact || open ? 'border-line shadow-[0_10px_30px_-22px_rgba(11,26,60,0.45)]' : 'border-transparent'
        )}
        style={{paddingTop: 'env(safe-area-inset-top)'}}
        onPointerLeave={(e) => e.pointerType === 'mouse' && intent(null, 180)}
      >
        <div
          className={cn(
            'shell-header flex min-h-16 items-center justify-between gap-3 transition-[min-height] duration-300 min-[1280px]:gap-5',
            compact ? 'nav:min-h-[var(--header-compact)]' : 'nav:min-h-[var(--header-full)]'
          )}
        >
          <Logo size="lg" />

          <nav aria-label="Main" className="hidden items-center nav:flex">
            {NAV_MENUS.map((m) =>
              m.panel ? (
                <button
                  key={m.id}
                  ref={(n) => {
                    triggers.current[m.id] = n;
                  }}
                  type="button"
                  aria-expanded={open === m.id}
                  aria-controls={panelId(m.id)}
                  data-menu={m.id}
                  onClick={() => setOpen((v) => (v === m.id ? null : m.id))}
                  onKeyDown={onTriggerKey(m.id)}
                  onPointerEnter={(e) => e.pointerType === 'mouse' && intent(m.id, open ? 100 : 140)}
                  className={cn(
                    'inline-flex min-h-11 items-center gap-1 rounded-[6px] px-2 transition-colors duration-150 min-[1280px]:px-3',
                    menuText,
                    open === m.id ? 'bg-bg-soft text-indigo' : 'text-ink hover:text-indigo'
                  )}
                >
                  {m.label}
                  <ChevronDown className={cn('h-3.5 w-3.5 text-steel transition-transform duration-150', open === m.id && 'rotate-180 text-indigo')} aria-hidden />
                </button>
              ) : (
                <Link
                  key={m.id}
                  href={m.href}
                  onPointerEnter={(e) => e.pointerType === 'mouse' && open && intent(null, 120)}
                  className={cn('inline-flex min-h-11 items-center rounded-[6px] px-2 text-ink hover:text-indigo min-[1280px]:px-3', menuText)}
                >
                  {m.label}
                </Link>
              )
            )}
          </nav>

          <div className="flex items-center gap-1 nav:gap-2">
            {/* Desktop search trigger, styled as an inline field. */}
            <button
              type="button"
              onClick={() => openSearch()}
              data-testid="search-trigger"
              aria-label="Search the site"
              aria-keyshortcuts="Control+K Meta+K /"
              className="hidden min-h-11 shrink-0 items-center gap-2 rounded-[8px] border border-line bg-bg-soft px-3 text-left text-[13.5px] text-muted transition-colors duration-150 hover:border-indigo/30 hover:bg-white nav:inline-flex min-[1440px]:min-w-[270px]"
            >
              <Search className="h-4 w-4 shrink-0 text-indigo" aria-hidden />
              <span className="min-[1440px]:hidden">Search</span>
              <span className="hidden flex-1 min-[1440px]:inline">{SEARCH_PLACEHOLDER}</span>
              <kbd className="hidden rounded-[4px] border border-line bg-white px-1.5 font-mono text-[11px] text-steel min-[1180px]:inline min-[1440px]:hidden">⌘K</kbd>
            </button>
            <a
              href={UTILITY.phoneHref}
              aria-label={`Call ${UTILITY.phoneDisplay}`}
              className="hidden h-11 w-11 shrink-0 place-items-center rounded-[8px] text-ink hover:bg-bg-soft hover:text-indigo min-[1536px]:grid"
            >
              <Phone className="h-[18px] w-[18px]" aria-hidden />
            </a>
            <a
              href={quoteWhatsappUrl({source: 'Header'})}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="header-get-price"
              className="hidden min-h-11 shrink-0 items-center gap-2 rounded-[8px] bg-orange px-4 text-[14px] font-semibold text-white shadow-[0_8px_20px_-12px_rgba(234,88,12,0.8)] transition-colors duration-150 hover:bg-orange-deep nav:inline-flex"
            >
              <WhatsAppIcon className="h-4 w-4" /> Get Price
            </a>

            {/* Phones/tablets */}
            <button
              type="button"
              onClick={() => openSearch()}
              data-testid="search-trigger-mobile"
              aria-label="Search the site"
              className="grid h-11 w-11 place-items-center rounded-[8px] text-ink hover:bg-bg-soft nav:hidden"
            >
              <Search className="h-[22px] w-[22px]" aria-hidden />
            </button>
            <MobileMenu />
          </div>
        </div>

        {/* ── Mega panels ─────────────────────────────────────────────── */}
        {NAV_MENUS.filter((m) => m.panel).map((m) => {
          const id = m.id as MenuId;
          return (
            <div
              key={id}
              id={panelId(id)}
              ref={(n) => {
                panels.current[id] = n;
              }}
              role="region"
              aria-label={PANEL_LABEL[id]}
              hidden={open !== id}
              data-panel={id}
              onPointerEnter={(e) => e.pointerType === 'mouse' && intent(id, 0)}
              className="panel-in absolute inset-x-0 top-full hidden max-h-[calc(100dvh-var(--header-compact)-8px)] overflow-y-auto overscroll-contain border-b border-t border-line bg-white shadow-lift nav:block"
            >
              <div className="shell-header">{seen[id] && <MegaPanel id={id} />}</div>
            </div>
          );
        })}
      </div>
    </header>
  );
}
