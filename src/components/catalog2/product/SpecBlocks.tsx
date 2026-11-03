import type {CSSProperties} from 'react';
import type {SpecBlock, Usp} from '@/data/usps';
import {UspIcon} from './UspIcon';

/**
 * Visual spec blocks (Thickness, Size, Grade, Standard, Density, Exposure,
 * Application) — only the blocks that have a value; text always wraps.
 */
export function SpecBlocks({blocks}: {blocks: SpecBlock[]}) {
  if (!blocks.length) return null;
  return (
    <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-[10px] border border-line bg-line min-[420px]:grid-cols-2 lg:grid-cols-3" data-testid="spec-blocks">
      {blocks.map((b, i) => (
        <li key={b.key} className="flex min-w-0 gap-3 bg-white p-4" data-reveal="up" style={{'--d': `${Math.min(i, 6) * 60}ms`} as CSSProperties}>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-surface-blue text-indigo">
            <UspIcon name={b.icon} />
          </span>
          <span className="min-w-0">
            <span className="t-label block text-steel">{b.label}</span>
            <span className="mt-0.5 block break-words text-[14.5px] font-semibold leading-snug text-ink">{b.value}</span>
            {b.note && <span className="mt-0.5 block text-[12px] text-muted">{b.note}</span>}
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Verified key-attribute row for the product hero. */
export function UspRow({usps}: {usps: Usp[]}) {
  if (!usps.length) return null;
  return (
    <ul className="grid grid-cols-1 gap-2 min-[400px]:grid-cols-2" aria-label="Key attributes" data-testid="product-usps">
      {usps.map((u) => (
        <li key={u.key} className="flex min-w-0 items-start gap-2.5 rounded-[8px] border border-line bg-white px-3 py-2.5">
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] bg-surface-blue text-indigo">
            <UspIcon name={u.icon} className="h-3.5 w-3.5" />
          </span>
          <span className="min-w-0">
            <span className="t-label block text-steel">{u.label}</span>
            <span className="block break-words text-[13.5px] font-semibold leading-snug text-ink">{u.value}</span>
            {u.note && <span className="block text-[11.5px] text-muted">{u.note}</span>}
          </span>
        </li>
      ))}
    </ul>
  );
}
