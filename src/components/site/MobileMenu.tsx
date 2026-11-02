'use client';

import Image from 'next/image';
import {useEffect, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import {ArrowRight, ChevronDown, Menu, Phone, X} from 'lucide-react';
import {Link, usePathname} from '@/i18n/navigation';
import {CATEGORIES, categoryHref} from '@/data/products';
import {CATEGORY_COPY} from '@/content/categories';
import {BRAND_ASSETS, COMPANY, WA} from '@/content/site';
import {BRANDS, STATS, countByCategory} from '@/data/stats';
import {WhatsAppIcon} from '@/components/ui/Button';
import {whatsappUrl} from '@/lib/whatsapp';
import {cn} from '@/lib/cn';

const CAPS = [
  {label: 'Material supply', href: '/products' as const},
  {label: 'Ready stock', href: {pathname: '/about', hash: 'operations'} as const},
  {label: 'Custom furniture', href: {pathname: '/about', hash: 'custom'} as const},
  {label: 'Project support', href: {pathname: '/about', hash: 'support'} as const}
];

/**
 * Phones/tablets (<1080): full-height sheet. Large 48px rows, product
 * categories with thumbnails + real counts, brands, capabilities, then call +
 * WhatsApp pinned at the bottom. Body scroll locked while open; Escape and
 * route change close it; focus moves into the sheet and back to the trigger.
 */
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState<'products' | 'brands' | 'caps' | null>('products');
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
      sheet.current?.querySelector<HTMLElement>('a,button')?.focus();
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
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const head = (key: 'products' | 'brands' | 'caps', label: string) => (
    <button
      type="button"
      aria-expanded={section === key}
      onClick={() => setSection((s) => (s === key ? null : key))}
      className="flex min-h-14 w-full items-center justify-between text-left text-[20px] font-semibold tracking-tight text-ink"
    >
      {label}
      <ChevronDown className={cn('h-5 w-5 text-steel transition-transform duration-200', section === key && 'rotate-180')} aria-hidden />
    </button>
  );

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
        className="-mr-2 grid h-11 w-11 place-items-center rounded-[6px] text-ink hover:bg-bg-soft"
      >
        {open ? <X className="h-6 w-6" aria-hidden /> : <Menu className="h-6 w-6" aria-hidden />}
      </button>

      {/* Portalled to <body>: the header's backdrop-filter creates a containing
          block for fixed children, which would collapse a fixed sheet to 0px. */}
      {open &&
        createPortal(
      <div
        id="mobile-menu"
        ref={sheet}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        data-testid="mobile-menu"
        className="fixed inset-x-0 bottom-0 top-16 z-[60] flex flex-col bg-white"
      >
        <nav aria-label="Mobile" className="flex-1 overflow-y-auto overscroll-contain px-[var(--side)] pb-6">
          <div className="border-b border-line">
            {head('products', 'Products')}
            {section === 'products' && (
              <ul className="grid grid-cols-2 gap-2 pb-5">
                {CATEGORIES.map((c) => (
                  <li key={c.slug}>
                    <Link href={categoryHref(c.slug)} className="flex items-center gap-2.5 rounded-md border border-line p-2 active:bg-bg-soft">
                      <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-[4px] bg-bg-soft">
                        <Image src={c.image} alt="" fill sizes="44px" className="object-cover" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[13.5px] font-semibold leading-tight text-ink">{CATEGORY_COPY[c.slug].short}</span>
                        <span className="t-label text-steel">{countByCategory(c.slug)} items</span>
                      </span>
                    </Link>
                  </li>
                ))}
                <li className="col-span-2 flex flex-wrap gap-2 pt-1">
                  <Link href="/products" className="inline-flex min-h-11 items-center gap-1.5 rounded-[6px] bg-indigo px-4 text-[14px] font-semibold text-white">
                    All {STATS.products} products <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                  <Link href="/decor" className="inline-flex min-h-11 items-center rounded-[6px] border border-line px-4 text-[14px] font-semibold text-ink">
                    {STATS.decors} décors
                  </Link>
                </li>
              </ul>
            )}
          </div>
          <div className="border-b border-line">
            {head('brands', 'Brands')}
            {section === 'brands' && (
              <ul className="flex flex-col pb-4">
                {BRANDS.map((b) => (
                  <li key={b}>
                    <Link href={{pathname: '/partners', hash: BRAND_ASSETS[b].slug}} className="flex min-h-12 items-center justify-between gap-3 text-[16px] text-ink">
                      {b}
                      <span className="t-label text-steel">{BRAND_ASSETS[b].relation}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="border-b border-line">
            {head('caps', 'Capabilities')}
            {section === 'caps' && (
              <ul className="flex flex-col pb-4">
                {CAPS.map((c) => (
                  <li key={c.label}>
                    <Link href={c.href} className="flex min-h-12 items-center text-[16px] text-ink">
                      {c.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <Link href="/about" className="flex min-h-14 items-center border-b border-line text-[20px] font-semibold tracking-tight text-ink">
            About
          </Link>
          <Link href="/contact" className="flex min-h-14 items-center border-b border-line text-[20px] font-semibold tracking-tight text-ink">
            Contact
          </Link>
          <p className="mt-5 text-[13px] leading-relaxed text-muted">{COMPANY.addressLines.join(', ')}</p>
        </nav>
        <div className="grid grid-cols-2 gap-2 border-t border-line bg-white px-[var(--side)] pt-3" style={{paddingBottom: 'calc(12px + env(safe-area-inset-bottom))'}}>
          <a href={COMPANY.phoneHref} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[6px] border border-line text-[15px] font-semibold text-ink">
            <Phone className="h-4 w-4" aria-hidden /> Call
          </a>
          <a
            href={whatsappUrl(WA.default)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[6px] bg-orange text-[15px] font-semibold text-white"
          >
            <WhatsAppIcon className="h-4 w-4" /> WhatsApp
          </a>
        </div>
      </div>,
          document.body
        )}
    </div>
  );
}
