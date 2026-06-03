import type {ComponentProps, ReactNode} from 'react';
import {Link} from '@/i18n/navigation';
import {cn} from '@/lib/cn';

const pillBase =
  'inline-flex items-center gap-2 rounded-full border border-border bg-bg-soft/70 ' +
  'px-3.5 py-1.5 text-xs font-medium text-muted backdrop-blur-sm';

type Props = {
  children: ReactNode;
  className?: string;
  /** Optional dot color (defaults to brand blue). */
  dot?: 'blue' | 'indigo' | 'green' | 'orange' | 'red' | 'none';
  href?: ComponentProps<typeof Link>['href'];
};

const dotColor: Record<string, string> = {
  blue: 'bg-blue',
  indigo: 'bg-indigo',
  green: 'bg-green',
  orange: 'bg-orange',
  red: 'bg-red'
};

export function Pill({children, className, dot = 'blue', href}: Props) {
  const content = (
    <>
      {dot !== 'none' && (
        <span
          className={cn(
            'h-1.5 w-1.5 rounded-full',
            dotColor[dot] ?? 'bg-blue'
          )}
        />
      )}
      <span>{children}</span>
    </>
  );

  if (href !== undefined) {
    return (
      <Link
        href={href}
        className={cn(
          pillBase,
          'transition-colors hover:text-ink hover:border-indigo/30 no-underline',
          className
        )}
      >
        {content}
      </Link>
    );
  }

  return <span className={cn(pillBase, className)}>{content}</span>;
}
