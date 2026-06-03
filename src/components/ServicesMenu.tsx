'use client';

import {useEffect, useRef, useState} from 'react';
import {
  LazyMotion,
  domAnimation,
  m,
  AnimatePresence,
  useReducedMotion
} from 'motion/react';
import type {ComponentProps} from 'react';
import {ChevronDown} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {Link, usePathname} from '@/i18n/navigation';
import {SERVICES} from './nav-menu';
import {slugify} from '@/lib/slug';
import {cn} from '@/lib/cn';

const EASE = [0.22, 1, 0.36, 1] as const;
type Href = ComponentProps<typeof Link>['href'];

/**
 * "Services ▾" mega-menu — the seven services as columns, each with its
 * sub-services listed beneath (linking to the service page). Mirrors the
 * Industries / AI Products mega-menus: hover-intent open, Escape + outside-click
 * close, animated (reduced-motion safe), keyboard accessible, no black.
 */
export function ServicesMenu() {
  const tn = useTranslations('nav');
  const tp = useTranslations('pages');
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const reduce = useReducedMotion();
  const active = SERVICES.some((s) => s.match === pathname);

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
        {tn('services')}
        <ChevronDown className={cn('h-4 w-4 transition-transform duration-200', open && 'rotate-180')} aria-hidden />
      </button>

      <LazyMotion features={domAnimation}>
        <AnimatePresence>
          {open && (
            <m.div
              role="menu"
              aria-label={tn('services')}
              initial={reduce ? {opacity: 0} : {opacity: 0, y: 6, scale: 0.98}}
              animate={reduce ? {opacity: 1} : {opacity: 1, y: 0, scale: 1}}
              exit={reduce ? {opacity: 0} : {opacity: 0, y: 6, scale: 0.98}}
              transition={{duration: 0.16, ease: EASE}}
              // Services is the left-most item, so the panel opens to the right.
              className="absolute left-0 top-full z-50 pt-2"
            >
              <div className="w-[min(94vw,860px)] overflow-hidden rounded-2xl border border-border bg-bg p-4 shadow-[0_24px_60px_-24px_rgba(24,119,242,0.45)]">
                <div className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3 lg:grid-cols-4">
                  {SERVICES.map((s) => {
                    const subs = tp.raw(`${s.key}.services`) as {name: string}[];
                    return (
                      <div key={s.key} className="flex flex-col gap-0.5">
                        <Link
                          href={s.href}
                          onClick={() => setOpen(false)}
                          className="mb-1 text-[12px] font-bold uppercase leading-tight tracking-[0.1em] text-indigo no-underline transition-colors hover:text-blue"
                        >
                          {tn(s.key)}
                        </Link>
                        {subs.map((sub) => (
                          <Link
                            key={sub.name}
                            role="menuitem"
                            href={{pathname: s.match, hash: slugify(sub.name)} as Href}
                            onClick={() => setOpen(false)}
                            className="block rounded-md py-0.5 text-[13px] leading-snug text-ink no-underline transition-colors hover:text-blue"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </LazyMotion>
    </div>
  );
}
