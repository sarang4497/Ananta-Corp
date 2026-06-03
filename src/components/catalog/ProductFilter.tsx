'use client';

import {useState, type ReactNode} from 'react';
import {cn} from '@/lib/cn';

export type FilterChip = {key: string; label: string};

/**
 * /products listing — filter chips (All + the 6 categories) over the card
 * grid. Cards are rendered on the server and passed in keyed by category, so
 * this client leaf only toggles visibility.
 */
export function ProductFilter({
  chips,
  allLabel,
  countTemplate,
  cards
}: {
  chips: FilterChip[];
  allLabel: string;
  /** e.g. "{count} products" — rendered with the visible count. */
  countTemplate: string;
  /** Pre-rendered cards with their category key. */
  cards: {category: string; node: ReactNode}[];
}) {
  const [active, setActive] = useState<string>('all');
  const visible = cards.filter((c) => active === 'all' || c.category === active);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Chip label={allLabel} active={active === 'all'} onClick={() => setActive('all')} />
        {chips.map((chip) => (
          <Chip
            key={chip.key}
            label={chip.label}
            active={active === chip.key}
            onClick={() => setActive(chip.key)}
          />
        ))}
      </div>
      <p className="text-center text-sm font-medium text-muted">
        {countTemplate.replace('{count}', String(visible.length))}
      </p>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visible.map((c, i) => (
          <div key={i} className="h-full">
            {c.node}
          </div>
        ))}
      </div>
    </div>
  );
}

function Chip({label, active, onClick}: {label: string; active: boolean; onClick: () => void}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'rounded-full border px-4 py-2 text-sm font-semibold transition-all',
        active
          ? 'border-indigo bg-indigo text-white shadow-card'
          : 'border-border bg-bg text-ink hover:border-indigo/40 hover:text-indigo'
      )}
    >
      {label}
    </button>
  );
}
