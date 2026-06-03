'use client';

import {useId, useRef, useState, type ReactNode} from 'react';
import {ChevronDown} from 'lucide-react';
import {cn} from '@/lib/cn';

/**
 * Generic navbar dropdown shell — hover-open on desktop with a small close
 * delay (so the pointer can travel into the panel), click-toggle as well for
 * touch/keyboard. Panel contents are passed as children; `wide` switches from
 * a compact list panel to the full mega-menu width.
 */
export function NavDropdown({
  label,
  wide = false,
  children
}: {
  label: string;
  wide?: boolean;
  children: ReactNode | ((close: () => void) => ReactNode);
}) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const panelId = useId();

  function show() {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setOpen(true);
  }
  function hideSoon() {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(false), 140);
  }
  const close = () => setOpen(false);

  return (
    <div
      className="relative"
      onMouseEnter={show}
      onMouseLeave={hideSoon}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) close();
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'group relative flex items-center gap-1 whitespace-nowrap rounded-full px-1.5 py-2 font-[family-name:var(--font-inter)] text-base font-semibold tracking-[-0.01em] transition-colors',
          open ? 'text-indigo' : 'text-ink hover:text-indigo'
        )}
      >
        {label}
        <ChevronDown
          className={cn('h-4 w-4 transition-transform duration-200', open && 'rotate-180')}
          aria-hidden
        />
      </button>

      <div
        id={panelId}
        className={cn(
          'absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3 transition-[opacity,transform] duration-200',
          wide ? 'w-[min(58rem,calc(100vw-2*var(--gutter)))]' : 'w-64',
          open
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none translate-y-1 opacity-0'
        )}
      >
        <div className="overflow-hidden rounded-2xl border border-border bg-bg p-3 shadow-glow">
          {typeof children === 'function' ? children(close) : children}
        </div>
      </div>
    </div>
  );
}
