'use client';

import {useId, useRef, useState, type KeyboardEvent} from 'react';
import {ArrowRight} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import type {Href} from '@/data/products';
import type {Usp} from '@/data/usps';
import {cn} from '@/lib/cn';
import {UspIcon} from './UspIcon';

export type UspTabItem = {slug: string; label: string; name: string; href: Href; usps: Usp[]; uses?: string};

/**
 * "Key attributes" — one tab per product, verified attributes in the panel.
 * WAI-ARIA tabs (roving tabindex, arrow/Home/End keys). Tabs WRAP — no
 * arrow-scrolled hidden tabs; every attribute in a panel is visible.
 */
export function UspTabs({items, title = 'Key attributes'}: {items: UspTabItem[]; title?: string}) {
  const base = useId();
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  if (!items.length) return null;

  const focus = (i: number) => {
    const n = (i + items.length) % items.length;
    setActive(n);
    refs.current[n]?.focus();
  };
  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const map: Record<string, () => void> = {
      ArrowRight: () => focus(i + 1),
      ArrowDown: () => focus(i + 1),
      ArrowLeft: () => focus(i - 1),
      ArrowUp: () => focus(i - 1),
      Home: () => focus(0),
      End: () => focus(items.length - 1)
    };
    if (map[e.key]) {
      e.preventDefault();
      map[e.key]();
    }
  };

  const it = items[active];
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-8" data-testid="usp-tabs">
      <div role="tablist" aria-label={title} className="flex flex-wrap gap-2 lg:flex-col lg:flex-nowrap">
        {items.map((x, i) => (
          <button
            key={x.slug}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${base}-tab-${i}`}
            aria-selected={i === active}
            aria-controls={`${base}-panel`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => onKey(e, i)}
            className={cn(
              'inline-flex min-h-11 max-w-full items-center rounded-[6px] border px-3.5 py-2 text-left text-[13.5px] font-medium leading-snug transition-colors duration-150 lg:w-full',
              i === active ? 'border-navy bg-navy text-white' : 'border-line bg-white text-ink hover:border-indigo/40'
            )}
          >
            <span className="min-w-0 break-words">{x.label}</span>
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id={`${base}-panel`}
        aria-labelledby={`${base}-tab-${active}`}
        tabIndex={0}
        className="min-w-0 rounded-[10px] border border-line bg-white p-5 focus-visible:outline-2 focus-visible:outline-blue sm:p-6"
      >
        <p className="text-[16px] font-semibold leading-snug text-ink text-pretty">{it.name}</p>
        <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {it.usps.map((u) => (
            <li key={u.key} className="flex min-w-0 items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-surface-blue text-indigo">
                <UspIcon name={u.icon} />
              </span>
              <span className="min-w-0">
                <span className="t-label block text-steel">{u.label}</span>
                <span className="block break-words text-[14px] font-semibold leading-snug text-ink">{u.value}</span>
                {u.note && <span className="block text-[12px] text-muted">{u.note}</span>}
              </span>
            </li>
          ))}
        </ul>
        {it.uses && (
          <p className="mt-4 border-t border-line pt-4 text-[13.5px] leading-relaxed text-muted">
            <span className="font-semibold text-ink">Used for: </span>
            {it.uses}
          </p>
        )}
        <Link href={it.href} className="arrow-nudge mt-4 inline-flex min-h-11 items-center gap-1.5 text-[14px] font-semibold text-indigo">
          View product <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </div>
  );
}
