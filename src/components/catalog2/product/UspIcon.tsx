import {
  BadgeCheck,
  Bug,
  DoorClosed,
  Droplets,
  FingerprintPattern,
  FlaskConical,
  Gauge,
  Info,
  KeyRound,
  Layers,
  LayoutGrid,
  Maximize2,
  Monitor,
  Palette,
  Ruler,
  ShieldCheck,
  type LucideIcon
} from 'lucide-react';
import type {Usp, UspIcon as UspIconName} from '@/data/usps';
import {cn} from '@/lib/cn';

const ICONS: Record<UspIconName, LucideIcon> = {
  BadgeCheck,
  Bug,
  DoorClosed,
  Droplets,
  FingerprintPattern,
  FlaskConical,
  Gauge,
  Info,
  KeyRound,
  Layers,
  LayoutGrid,
  Maximize2,
  Monitor,
  Palette,
  Ruler,
  ShieldCheck
};

export function UspIcon({name, className}: {name: UspIconName; className?: string}) {
  const I = ICONS[name];
  return <I className={cn('h-4 w-4 shrink-0', className)} aria-hidden />;
}

/**
 * Wrapping list of verified attribute chips. Every chip is visible (no
 * scroll-hidden chips); long values wrap inside the chip.
 */
export function UspChips({usps, size = 'md', className}: {usps: Usp[]; size?: 'sm' | 'md'; className?: string}) {
  if (!usps.length) return null;
  return (
    <ul className={cn('flex flex-wrap gap-1.5', className)} aria-label="Key attributes">
      {usps.map((u) => (
        <li
          key={u.key}
          className={cn(
            'inline-flex min-w-0 max-w-full items-start gap-1.5 rounded-[5px] bg-surface-blue text-indigo',
            size === 'sm' ? 'px-2 py-1 text-[11.5px] leading-snug' : 'px-2.5 py-1.5 text-[12.5px] leading-snug'
          )}
        >
          <UspIcon name={u.icon} className="mt-px h-3.5 w-3.5" />
          <span className="min-w-0 break-words">
            <span className="sr-only">{u.label}: </span>
            {u.value}
            {u.note && u.source === 'standard' ? <span className="text-muted"> · {u.note}</span> : null}
          </span>
        </li>
      ))}
    </ul>
  );
}
