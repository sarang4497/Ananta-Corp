'use client';

import {useEffect, useRef, useState} from 'react';
import type {ComponentProps} from 'react';
import {
  LazyMotion,
  domAnimation,
  m,
  AnimatePresence,
  useReducedMotion
} from 'motion/react';
import {ChevronDown, ArrowRight} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {Link, usePathname} from '@/i18n/navigation';
import {cn} from '@/lib/cn';

const EASE = [0.22, 1, 0.36, 1] as const;
type Href = ComponentProps<typeof Link>['href'];
type Category = {id: string; title: string; products: {name: string}[]};

/** Anchor for the nth product (1-based) on /ai-products. */
function anchorFor(n: number): Href {
  return {pathname: '/ai-products', hash: `product-${String(n).padStart(2, '0')}`} as Href;
}

/**
 * "AI Products ▾" mega-menu — categories as columns with their products listed
 * beneath (Operations has 10, so a multi-column panel reads best). Matches the
 * dropdown styling; hover-intent open, Escape + outside-click close, animated
 * (reduced-motion safe), keyboard accessible.
 */
export function AiProductsMenu() {
  const t = useTranslations('aiProducts');
  const tn = useTranslations('nav');
  const pathname = usePathname();
  const categories = t.raw('categories') as Category[];

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const reduce = useReducedMotion();
  const active = pathname === '/ai-products';

  function openNow() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  }
  function closeSoon() {
    closeTimer.current = setTimeout(() => setOpen(false), 140);
  }

  useEffect(() => {
    if (!open) return;
    function onDown(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // Running global index so product anchors match the /ai-products page order.
  let counter = 0;

  return (
    <div ref={ref} className="relative" onMouseEnter={openNow} onMouseLeave={closeSoon}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'group inline-flex items-center gap-1 whitespace-nowrap rounded-full px-1.5 py-2 font-[family-name:var(--font-inter)] text-base font-semibold tracking-[-0.01em] transition-colors',
          open || active ? 'text-blue' : 'text-ink hover:text-blue'
        )}
      >
        {tn('aiProducts')}
        <ChevronDown className={cn('h-4 w-4 transition-transform duration-200', open && 'rotate-180')} aria-hidden />
      </button>

      <LazyMotion features={domAnimation}>
        <AnimatePresence>
          {open && (
            <m.div
              role="menu"
              aria-label={tn('aiProducts')}
              initial={reduce ? {opacity: 0} : {opacity: 0, y: 6, scale: 0.98}}
              animate={reduce ? {opacity: 1} : {opacity: 1, y: 0, scale: 1}}
              exit={reduce ? {opacity: 0} : {opacity: 0, y: 6, scale: 0.98}}
              transition={{duration: 0.16, ease: EASE}}
              // pt-2 bridges the gap so hovering button → panel never closes.
              className="absolute left-0 top-full z-50 pt-2"
            >
              <div className="w-[min(90vw,820px)] overflow-hidden rounded-2xl border border-border bg-bg p-4 shadow-[0_24px_60px_-24px_rgba(24,119,242,0.45)]">
                <Link
                  href="/ai-products"
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-xl bg-bg-soft px-3 py-2 text-sm font-semibold text-ink no-underline transition-colors hover:text-blue"
                >
                  {tn('aiAll')}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>

                <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
                  {categories.map((cat) => (
                    <div key={cat.id} className="flex flex-col gap-0.5">
                      <span className="mb-1 text-[12px] font-bold uppercase leading-tight tracking-[0.1em] text-indigo">
                        {cat.title}
                      </span>
                      {cat.products.map((p) => {
                        counter += 1;
                        return (
                          <Link
                            key={p.name}
                            role="menuitem"
                            href={anchorFor(counter)}
                            onClick={() => setOpen(false)}
                            className="block rounded-md py-0.5 text-[13px] leading-snug text-ink no-underline transition-colors hover:text-blue"
                          >
                            {p.name}
                          </Link>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </LazyMotion>
    </div>
  );
}
