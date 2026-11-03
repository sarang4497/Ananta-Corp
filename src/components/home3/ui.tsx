import type {ReactNode} from 'react';
import {cn} from '@/lib/cn';

/**
 * Homepage V2 primitives. CTAs WRAP (no nowrap), keep 44px+ targets; section
 * spacing uses the shared `.section` rhythm with the same clamp as fallback.
 */
const base =
  'group inline-flex min-h-12 items-center justify-center gap-2 rounded-[6px] px-5 py-2.5 text-center text-[15px] font-semibold leading-tight text-balance ' +
  'transition-[background-color,border-color,color,transform] duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue active:scale-[0.98]';

const variants = {
  primary: 'bg-indigo text-white hover:bg-blue',
  orange: 'bg-orange text-white hover:bg-orange-deep',
  wa: 'border border-wa/45 bg-white text-ink hover:border-wa hover:bg-wa/5',
  outline: 'border border-ink/15 bg-white text-ink hover:border-indigo/50 hover:text-indigo',
  light: 'bg-white text-navy hover:bg-surface-blue',
  'outline-light': 'border border-white/30 text-white hover:border-white/70 hover:bg-white/5'
} as const;

export function cta(variant: keyof typeof variants = 'primary', className?: string) {
  return cn(base, variants[variant], className);
}

export const SECTION = 'section py-[clamp(3.5rem,2.25rem+4.2vw,7.5rem)]';

export function SectionHead({
  id,
  eyebrow,
  title,
  lead,
  dark = false,
  aside,
  className
}: {
  id: string;
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  dark?: boolean;
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between', className)}>
      <div className="max-w-3xl">
        <p className={cn('t-label flex items-center gap-2', dark ? 'text-orange-light' : 'text-orange-ink')} data-reveal="up">
          <span aria-hidden className={cn('inline-block h-px w-6', dark ? 'bg-orange-light' : 'bg-orange')} data-reveal="line" />
          {eyebrow}
        </p>
        <h2 id={id} className={cn('t-h2 mt-3 text-balance', dark ? 'text-white' : 'text-ink')} data-reveal="up" style={{['--d' as string]: '80ms'}}>
          {title}
        </h2>
        {lead && (
          <p className={cn('mt-4 max-w-[62ch] text-[15.5px] leading-relaxed', dark ? 'text-white/75' : 'text-muted')} data-reveal="up" style={{['--d' as string]: '160ms'}}>
            {lead}
          </p>
        )}
      </div>
      {aside && <div data-reveal="up" style={{['--d' as string]: '200ms'}}>{aside}</div>}
    </div>
  );
}
