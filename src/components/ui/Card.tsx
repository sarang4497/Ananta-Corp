import type {ComponentProps, ReactNode} from 'react';
import {Link} from '@/i18n/navigation';
import {cn} from '@/lib/cn';

type Accent = 'blue' | 'indigo' | 'orange' | 'green' | 'red' | 'none';

const accentGlow: Record<Accent, string> = {
  blue: 'hover:shadow-[0_24px_60px_-24px_rgba(24,119,242,0.45)] hover:border-blue/30',
  indigo:
    'hover:shadow-[0_24px_60px_-24px_rgba(79,70,229,0.45)] hover:border-indigo/30',
  orange:
    'hover:shadow-[0_24px_60px_-24px_rgba(249,115,22,0.4)] hover:border-orange/30',
  green:
    'hover:shadow-[0_24px_60px_-24px_rgba(34,197,94,0.4)] hover:border-green/30',
  red: 'hover:shadow-[0_24px_60px_-24px_rgba(239,68,68,0.4)] hover:border-red/30',
  none: 'hover:shadow-glow hover:border-indigo/30'
};

const cardBase =
  'relative flex flex-col rounded-2xl border border-border bg-bg p-6 shadow-card ' +
  'transition-[transform,box-shadow,border-color] duration-300 will-change-transform ' +
  'hover:-translate-y-1';

type Props = {
  children: ReactNode;
  className?: string;
  accent?: Accent;
  href?: ComponentProps<typeof Link>['href'];
};

export function Card({children, className, accent = 'none', href}: Props) {
  const classes = cn(cardBase, accentGlow[accent], className);

  if (href !== undefined) {
    return (
      <Link href={href} className={cn(classes, 'no-underline')}>
        {children}
      </Link>
    );
  }

  return <div className={classes}>{children}</div>;
}
