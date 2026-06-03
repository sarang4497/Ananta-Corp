'use client';

import {useEffect, useRef, useState} from 'react';
import {
  LazyMotion,
  domAnimation,
  m,
  AnimatePresence,
  useReducedMotion
} from 'motion/react';
import {ChevronDown} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import type {NavMenuItem} from './nav-menu';
import {cn} from '@/lib/cn';

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Reusable navbar dropdown — opens on hover (desktop) and click/tap, with a
 * chevron that rotates when open. White panel, Inter, dark-blue text, soft
 * blue-tinted shadow. Keyboard accessible: Escape + outside-click to close,
 * proper aria; animated open/close via AnimatePresence (reduced-motion safe).
 */
export function NavDropdown({
  label,
  items,
  labelFor,
  currentPath
}: {
  label: string;
  items: NavMenuItem[];
  /** Resolve an item's display label from its translation key. */
  labelFor: (key: string) => string;
  currentPath: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const reduce = useReducedMotion();
  const active = items.some((i) => i.match === currentPath);

  function openNow() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  }
  function closeSoon() {
    closeTimer.current = setTimeout(() => setOpen(false), 120);
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
    <div
      ref={ref}
      className="relative"
      onMouseEnter={openNow}
      onMouseLeave={closeSoon}
    >
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
        {label}
        <ChevronDown
          className={cn('h-4 w-4 transition-transform duration-200', open && 'rotate-180')}
          aria-hidden
        />
      </button>

      <LazyMotion features={domAnimation}>
        <AnimatePresence>
          {open && (
            <m.div
              role="menu"
              aria-label={label}
              initial={reduce ? {opacity: 0} : {opacity: 0, y: 6, scale: 0.98}}
              animate={reduce ? {opacity: 1} : {opacity: 1, y: 0, scale: 1}}
              exit={reduce ? {opacity: 0} : {opacity: 0, y: 6, scale: 0.98}}
              transition={{duration: 0.16, ease: EASE}}
              // pt-2 bridges the gap so hovering button → panel never closes.
              className="absolute left-1/2 top-full z-50 -translate-x-1/2 pt-2"
            >
              <div className="w-64 overflow-hidden rounded-2xl border border-border bg-bg p-2 shadow-[0_24px_60px_-24px_rgba(24,119,242,0.45)]">
                {items.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.match === currentPath;
                  return (
                    <Link
                      key={item.key}
                      role="menuitem"
                      href={item.href}
                      onClick={() => setOpen(false)}
                      aria-current={isActive ? 'page' : undefined}
                      className={cn(
                        'group/item flex items-center gap-3 rounded-xl px-3 py-2.5 font-[family-name:var(--font-inter)] text-sm font-medium no-underline transition-colors',
                        isActive ? 'bg-bg-soft text-blue' : 'text-ink hover:bg-bg-soft hover:text-blue'
                      )}
                    >
                      <span
                        className={cn(
                          'grid h-8 w-8 shrink-0 place-items-center rounded-lg transition-colors',
                          isActive
                            ? 'bg-blue/10 text-blue'
                            : 'bg-bg-soft text-indigo group-hover/item:bg-blue/10 group-hover/item:text-blue'
                        )}
                      >
                        <Icon className="h-4 w-4" aria-hidden />
                      </span>
                      {labelFor(item.key)}
                    </Link>
                  );
                })}
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </LazyMotion>
    </div>
  );
}
