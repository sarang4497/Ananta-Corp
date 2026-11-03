'use client';

import {useId, useState} from 'react';
import {Plus} from 'lucide-react';
import {cn} from '@/lib/cn';

/**
 * Accessible accordion: one item open at a time, buttons carry
 * aria-expanded/aria-controls, panels are labelled regions. Height animates
 * with the grid-rows trick (no fixed heights); static under reduced motion.
 */
export function FaqAccordion({items}: {items: {q: string; a: string}[]}) {
  const [open, setOpen] = useState<number | null>(0);
  const uid = useId();
  return (
    <ul className="divide-y divide-line border-y border-line">
      {items.map((it, i) => {
        const on = open === i;
        return (
          <li key={it.q} className={cn('relative transition-colors duration-200', on && 'bg-white')}>
            <span aria-hidden className={cn('absolute inset-y-0 left-0 w-[3px] bg-orange transition-opacity duration-200', on ? 'opacity-100' : 'opacity-0')} />
            <h3>
              <button
                type="button"
                id={`${uid}-q-${i}`}
                aria-expanded={on}
                aria-controls={`${uid}-a-${i}`}
                onClick={() => setOpen(on ? null : i)}
                className="flex min-h-14 w-full items-start justify-between gap-4 px-4 py-4 text-left text-[15.5px] font-semibold leading-snug text-ink hover:text-indigo focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue sm:px-5"
              >
                <span>{it.q}</span>
                <Plus className={cn('mt-0.5 h-5 w-5 shrink-0 text-indigo transition-transform duration-300 motion-reduce:transition-none', on && 'rotate-45')} aria-hidden />
              </button>
            </h3>
            <div
              id={`${uid}-a-${i}`}
              role="region"
              aria-labelledby={`${uid}-q-${i}`}
              className={cn(
                'grid transition-[grid-template-rows,visibility] duration-300 ease-out motion-reduce:transition-none',
                on ? 'visible grid-rows-[1fr]' : 'invisible grid-rows-[0fr]'
              )}
            >
              <div className="min-h-0 overflow-hidden">
                <p className="px-4 pb-5 text-[14.5px] leading-relaxed text-muted sm:px-5">{it.a}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
