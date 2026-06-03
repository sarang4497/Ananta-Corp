'use client';

import {useState} from 'react';
import {ChevronDown} from 'lucide-react';
import {cn} from '@/lib/cn';

export type FaqItem = {q: string; a: string};

/** Clean accordion — one item open at a time, animated height via grid trick. */
export function Faq({items}: {items: FaqItem[]}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-3">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={item.q}
            className={cn(
              'overflow-hidden rounded-2xl border bg-bg transition-colors',
              isOpen ? 'border-indigo/30 shadow-card' : 'border-border'
            )}
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <span className="text-[15px] font-bold leading-snug text-ink">{item.q}</span>
              <span
                className={cn(
                  'grid h-7 w-7 shrink-0 place-items-center rounded-full transition-colors',
                  isOpen ? 'bg-orange text-white' : 'bg-indigo/8 text-indigo'
                )}
              >
                <ChevronDown
                  className={cn('h-4 w-4 transition-transform duration-200', isOpen && 'rotate-180')}
                  aria-hidden
                />
              </span>
            </button>
            <div
              className={cn(
                'grid transition-[grid-template-rows] duration-300 ease-out',
                isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
              )}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-4 text-sm leading-relaxed text-muted">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
