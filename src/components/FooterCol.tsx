'use client';

import {useState, type ReactNode} from 'react';
import {ChevronDown} from 'lucide-react';
import {cn} from '@/lib/cn';

/**
 * Footer link column — a tap-to-expand accordion on mobile (keeps the footer
 * super compact), always expanded on desktop. Server-rendered links are passed
 * in as children.
 */
export function FooterCol({heading, children}: {heading: string; children: ReactNode}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex items-center justify-between gap-2 py-1 sm:pointer-events-none sm:cursor-default sm:py-0"
      >
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-white">{heading}</span>
        <ChevronDown
          className={cn('h-4 w-4 shrink-0 text-white/70 transition-transform sm:hidden', open && 'rotate-180')}
          aria-hidden
        />
      </button>
      <div className={cn('mt-1.5 flex-col gap-1.5', open ? 'flex' : 'hidden', 'sm:flex')}>{children}</div>
    </div>
  );
}
