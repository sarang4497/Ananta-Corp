'use client';

import {useState} from 'react';
import {LazyMotion, domAnimation, m, AnimatePresence} from 'motion/react';
import {ChevronDown} from 'lucide-react';
import {cn} from '@/lib/cn';

type Item = {q: string; a: string};

/**
 * FAQ accordion — one open at a time, smooth expand/collapse, keyboard
 * accessible (real buttons + aria-expanded). No black.
 */
export function DentalFaq({items}: {items: Item[]}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <LazyMotion features={domAnimation}>
      <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-border bg-bg shadow-card">
        {items.map((it, i) => {
          const isOpen = open === i;
          return (
            <div key={it.q} className={cn(i > 0 && 'border-t border-border')}>
              <h3>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-bg-soft/50"
                >
                  <span className="text-[15px] font-semibold text-ink">{it.q}</span>
                  <ChevronDown
                    className={cn(
                      'h-5 w-5 shrink-0 text-muted transition-transform duration-200',
                      isOpen && 'rotate-180 text-blue'
                    )}
                    aria-hidden
                  />
                </button>
              </h3>
              <AnimatePresence initial={false}>
                {isOpen ? (
                  <m.div
                    initial={{height: 0, opacity: 0}}
                    animate={{height: 'auto', opacity: 1}}
                    exit={{height: 0, opacity: 0}}
                    transition={{duration: 0.25, ease: [0.22, 1, 0.36, 1]}}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-[15px] leading-relaxed text-muted">{it.a}</p>
                  </m.div>
                ) : null}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </LazyMotion>
  );
}
