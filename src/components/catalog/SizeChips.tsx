'use client';

import {useState} from 'react';
import {cn} from '@/lib/cn';

/**
 * Visual thickness/size selector built from the product's options. Selection
 * is purely visual (pricing is via WhatsApp), but it makes the range tangible.
 */
export function SizeChips({sizes, label, note}: {sizes: string[]; label: string; note?: string}) {
  const [selected, setSelected] = useState(0);

  if (sizes.length === 0) return null;

  return (
    <div className="flex flex-col gap-2.5">
      <span className="text-xs font-bold uppercase tracking-[0.16em] text-muted">
        {label}
        <span className="ml-2 normal-case tracking-normal text-indigo">{sizes[selected]}</span>
      </span>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size, i) => (
          <button
            key={size}
            type="button"
            onClick={() => setSelected(i)}
            aria-pressed={i === selected}
            className={cn(
              'rounded-full border px-4 py-1.5 text-sm font-semibold transition-all',
              i === selected
                ? 'border-orange bg-orange text-white shadow-orange'
                : 'border-border bg-bg text-ink hover:border-indigo/40 hover:text-indigo'
            )}
          >
            {size}
          </button>
        ))}
      </div>
      {note && <p className="text-xs leading-relaxed text-muted">{note}</p>}
    </div>
  );
}
