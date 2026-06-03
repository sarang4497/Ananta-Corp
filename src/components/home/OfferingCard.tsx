import type {LucideIcon} from 'lucide-react';
import {cn} from '@/lib/cn';
import {accentChip, type Accent} from '@/components/demos/demoAccent';

/**
 * Accent-tinted hover glow. Literal class strings only — Tailwind can't see
 * runtime-built names, so each accent maps to a complete shadow utility.
 */
const accentGlow: Record<Accent, string> = {
  blue: 'hover:shadow-[0_24px_60px_-24px_rgba(24,119,242,0.45)]',
  indigo: 'hover:shadow-[0_24px_60px_-24px_rgba(79,70,229,0.45)]',
  orange: 'hover:shadow-[0_24px_60px_-24px_rgba(249,115,22,0.45)]',
  green: 'hover:shadow-[0_24px_60px_-24px_rgba(34,197,94,0.45)]',
  red: 'hover:shadow-[0_24px_60px_-24px_rgba(239,68,68,0.45)]',
  brand: 'hover:shadow-[0_24px_60px_-24px_rgba(79,70,229,0.45)]'
};

type Props = {
  icon: LucideIcon;
  title: string;
  benefit: string;
  accent: Accent;
  /** Larger padding + icon for the two featured top-row cards. */
  featured?: boolean;
};

export function OfferingCard({icon: Icon, title, benefit, accent, featured = false}: Props) {
  return (
    <div
      className={cn(
        'group flex h-full flex-col rounded-2xl border border-border bg-bg shadow-card transition-all duration-300 hover:-translate-y-1',
        accentGlow[accent],
        featured ? 'p-8 sm:p-10' : 'p-6 sm:p-7'
      )}
    >
      <span
        className={cn(
          'inline-flex shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110',
          accentChip[accent],
          featured ? 'h-14 w-14' : 'h-12 w-12'
        )}
      >
        <Icon className={featured ? 'h-7 w-7' : 'h-6 w-6'} strokeWidth={1.75} aria-hidden />
      </span>
      <h3
        className={cn(
          'mt-5 font-semibold tracking-tight text-ink',
          featured ? 'text-xl sm:text-2xl' : 'text-lg'
        )}
      >
        {title}
      </h3>
      <p className="mt-2 text-pretty text-sm leading-relaxed text-muted sm:text-base">
        {benefit}
      </p>
    </div>
  );
}
