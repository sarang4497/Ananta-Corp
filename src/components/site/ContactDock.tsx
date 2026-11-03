'use client';

import {useEffect, useRef, useState} from 'react';
import {House, LayoutGrid, MessageSquareText, Search} from 'lucide-react';
import {Link, usePathname} from '@/i18n/navigation';
import {WA} from '@/content/site';
import {WhatsAppIcon} from '@/components/ui/Button';
import {whatsappUrl} from '@/lib/whatsapp';
import {cn} from '@/lib/cn';

/**
 * THE floating-control manager — the only fixed contact UI on the site.
 * WhatsApp and the assistant live in ONE object so they never read as two
 * competing chat systems.
 *
 *   Phones (<768):  a compact 5-action bar [Home · Products · Search ·
 *                   WhatsApp (contextual) · Ask], active-route state,
 *                   safe-area aware, ≤64px + inset.
 *   ≥768:           a vertical icon rail in the reserved side gutter.
 *
 * It steps aside (slides out + inert) when:
 *   - any [data-dock-hide] element (footer, forms, in-page product CTA bars)
 *     overlaps the dock's zone,
 *   - the visitor is typing in a field,
 *   - the mobile menu, site search or the assistant panel is open.
 * WhatsApp text is contextual: pages set data-wa-context on an element
 * (product/category/décor name) and the dock prefills it.
 */
const cell = (on: boolean, extra?: string) =>
  cn(
    'relative flex min-h-11 flex-col items-center justify-center gap-1 rounded-[8px] px-0.5 text-center text-[11px] font-medium leading-none transition-colors duration-150 active:bg-bg-soft',
    on ? 'text-indigo after:absolute after:inset-x-[30%] after:top-0 after:h-[2px] after:rounded-full after:bg-orange' : 'text-ink',
    extra
  );

export function ContactDock() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [message, setMessage] = useState<string>(WA.default);
  const ref = useRef<HTMLDivElement>(null);

  // Page context → WhatsApp prefill.
  useEffect(() => {
    const read = () => {
      const el = document.querySelector<HTMLElement>('[data-wa-context]');
      setMessage(el?.dataset.waContext || WA.default);
    };
    read();
    const id = requestAnimationFrame(read);
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  // Collision avoidance.
  useEffect(() => {
    let raf = 0;
    let typing = false;
    const evaluate = () => {
      raf = 0;
      const html = document.documentElement;
      if (html.dataset.menuOpen || html.dataset.chatOpen || html.dataset.searchOpen || typing) return setHidden(true);
      const dock = ref.current?.getBoundingClientRect();
      const vh = window.innerHeight;
      const zoneTop = dock && dock.height ? dock.top - 12 : vh - 90;
      const zoneLeft = dock && dock.width ? dock.left - 12 : 0;
      let hit = false;
      document.querySelectorAll<HTMLElement>('[data-dock-hide]').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < vh && r.bottom > zoneTop && r.right > zoneLeft) hit = true;
      });
      setHidden(hit);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(evaluate);
    };
    const onFocus = (e: FocusEvent) => {
      const t = e.target as HTMLElement | null;
      typing = !!t?.matches?.('input:not([type=checkbox]):not([type=radio]):not([type=button]), textarea, select, [contenteditable=true]');
      schedule();
    };
    const onBlur = () => {
      typing = false;
      schedule();
    };
    evaluate();
    window.addEventListener('scroll', schedule, {passive: true});
    window.addEventListener('resize', schedule);
    document.addEventListener('focusin', onFocus);
    document.addEventListener('focusout', onBlur);
    const mo = new MutationObserver(schedule);
    mo.observe(document.documentElement, {attributes: true, attributeFilter: ['data-menu-open', 'data-chat-open', 'data-search-open']});
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      document.removeEventListener('focusin', onFocus);
      document.removeEventListener('focusout', onBlur);
      mo.disconnect();
    };
  }, [pathname]);

  const openAssistant = () => window.dispatchEvent(new CustomEvent('open-bella'));
  const openSearch = () => window.dispatchEvent(new CustomEvent('open-search'));
  const active = pathname === '/' ? 'home' : pathname.startsWith('/products') ? 'products' : null;
  const wa = whatsappUrl(message);

  return (
    <div
      ref={ref}
      data-testid="contact-dock"
      data-hidden={hidden ? '1' : undefined}
      inert={hidden}
      aria-hidden={hidden || undefined}
      className={cn(
        'fixed z-40 transition-[transform,opacity] duration-300 ease-[cubic-bezier(.22,1,.36,1)]',
        // phones: full-width bar
        'inset-x-0 bottom-0 border-t border-line bg-white/97 backdrop-blur-md md:inset-x-auto md:border-0 md:bg-transparent md:backdrop-blur-none',
        'md:bottom-5 md:right-4',
        hidden ? 'pointer-events-none translate-y-[110%] opacity-0 md:translate-y-4' : 'translate-y-0 opacity-100'
      )}
      style={{paddingBottom: 'env(safe-area-inset-bottom)'}}
    >
      {/* Phone bar: five equal actions, icon + label, ≤64px. */}
      <nav aria-label="Quick actions" className="grid min-h-[62px] grid-cols-5 items-stretch px-1 md:hidden">
        <Link href="/" data-testid="dock-home" aria-current={active === 'home' ? 'page' : undefined} className={cell(active === 'home')}>
          <House className="h-[21px] w-[21px]" aria-hidden />
          <span>Home</span>
        </Link>
        <Link href="/products" data-testid="dock-products" aria-current={active === 'products' ? 'page' : undefined} className={cell(active === 'products')}>
          <LayoutGrid className="h-[21px] w-[21px]" aria-hidden />
          <span>Products</span>
        </Link>
        <button type="button" onClick={openSearch} data-testid="dock-search" className={cell(false)}>
          <Search className="h-[21px] w-[21px]" aria-hidden />
          <span>Search</span>
        </button>
        <a href={wa} target="_blank" rel="noopener noreferrer" data-testid="dock-whatsapp" aria-label="Get price on WhatsApp" className={cell(false, 'text-wa')}>
          <WhatsAppIcon className="h-[21px] w-[21px]" />
          <span className="text-ink">WhatsApp</span>
        </a>
        <button type="button" onClick={openAssistant} data-testid="assistant-launcher" aria-label="Ask the materials assistant" className={cell(false)}>
          <MessageSquareText className="h-[21px] w-[21px]" aria-hidden />
          <span aria-hidden>Ask</span>
        </button>
      </nav>

      {/* ≥768: vertical icon rail living in the reserved side gutter (--side),
          so it never sits over content. Labels slide out on hover/focus. */}
      <div className="hidden flex-col gap-2 md:flex">
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="dock-whatsapp-desktop"
          aria-label="Get price on WhatsApp"
          className="group/d relative grid h-12 w-12 place-items-center rounded-[10px] bg-wa text-white shadow-lift transition-transform duration-150 hover:-translate-y-0.5"
        >
          <WhatsAppIcon className="h-[22px] w-[22px]" />
          <span className="pointer-events-none absolute right-[calc(100%+10px)] whitespace-nowrap rounded-[6px] bg-navy px-3 py-2 text-[13px] font-semibold text-white opacity-0 transition-opacity duration-150 group-hover/d:opacity-100 group-focus-visible/d:opacity-100">
            Price on WhatsApp
          </span>
        </a>
        <button
          type="button"
          onClick={openAssistant}
          data-testid="assistant-launcher-desktop"
          aria-label="Ask the materials assistant"
          className="group/d relative grid h-12 w-12 place-items-center rounded-[10px] border border-line bg-white text-indigo shadow-lift transition-transform duration-150 hover:-translate-y-0.5"
        >
          <MessageSquareText className="h-5 w-5" aria-hidden />
          <span className="pointer-events-none absolute right-[calc(100%+10px)] whitespace-nowrap rounded-[6px] bg-navy px-3 py-2 text-[13px] font-semibold text-white opacity-0 transition-opacity duration-150 group-hover/d:opacity-100 group-focus-visible/d:opacity-100">
            Ask the materials assistant
          </span>
        </button>
      </div>
    </div>
  );
}
