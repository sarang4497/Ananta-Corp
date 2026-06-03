'use client';

import {useMemo, useState} from 'react';
import Image from 'next/image';
import {Search} from 'lucide-react';
import {whatsappUrl} from '@/lib/whatsapp';
import {cn} from '@/lib/cn';
import type {Decor, DecorType} from '@/data/decors';

export type TypeChip = {key: DecorType | 'all'; label: string};

/**
 * The 156-design décor gallery — search (name/code) + type filter over a
 * lazy-loaded responsive grid of self-hosted swatches. Hover reveals a gentle
 * zoom + the WhatsApp price ask.
 */
export function DecorGallery({
  decors,
  chips,
  searchPlaceholder,
  countTemplate,
  priceLabel,
  emptyLabel
}: {
  decors: Decor[];
  chips: TypeChip[];
  searchPlaceholder: string;
  countTemplate: string;
  priceLabel: string;
  emptyLabel: string;
}) {
  const [type, setType] = useState<DecorType | 'all'>('all');
  const [query, setQuery] = useState('');

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return decors.filter(
      (d) =>
        (type === 'all' || d.type === type) &&
        (!q || d.name.toLowerCase().includes(q) || d.code.includes(q))
    );
  }, [decors, type, query]);

  return (
    <div className="flex flex-col gap-7">
      {/* Controls */}
      <div className="flex flex-col items-center gap-4">
        <label className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full rounded-full border border-border bg-bg py-3 pl-11 pr-5 text-sm text-ink shadow-card outline-none transition-colors placeholder:text-muted/70 focus:border-indigo/50"
          />
        </label>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {chips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={() => setType(chip.key)}
              aria-pressed={type === chip.key}
              className={cn(
                'rounded-full border px-4 py-2 text-sm font-semibold transition-all',
                type === chip.key
                  ? 'border-indigo bg-indigo text-white shadow-card'
                  : 'border-border bg-bg text-ink hover:border-indigo/40 hover:text-indigo'
              )}
            >
              {chip.label}
            </button>
          ))}
        </div>
        <p className="text-sm font-medium text-muted">
          {countTemplate.replace('{count}', String(visible.length))}
        </p>
      </div>

      {/* Grid */}
      {visible.length === 0 ? (
        <p className="py-16 text-center text-base text-muted">{emptyLabel}</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {visible.map((d) => (
            <figure
              key={d.image}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-bg shadow-card transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-orange/40 hover:shadow-[0_24px_60px_-24px_rgba(249,115,22,0.4)]"
            >
              <div className="relative aspect-square w-full overflow-hidden">
                <Image
                  src={d.image}
                  alt={`${d.code} – ${d.name}`}
                  fill
                  loading="lazy"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <figcaption className="flex flex-1 flex-col gap-1.5 p-3">
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-indigo">
                  {d.code}
                </span>
                <span className="text-[13px] font-bold leading-snug text-ink">{d.name}</span>
                <a
                  href={whatsappUrl(`Hello! I'm interested in the ${d.code} – ${d.name} pre-laminated board finish. Please share price and availability details.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto pt-1 text-[12px] font-bold text-orange-deep no-underline transition-colors hover:text-orange"
                >
                  {priceLabel} →
                </a>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}
