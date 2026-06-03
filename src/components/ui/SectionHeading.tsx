import type {ReactNode} from 'react';
import {cn} from '@/lib/cn';

type Props = {
  eyebrow?: ReactNode;
  title: ReactNode;
  sub?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  sub,
  align = 'center',
  className
}: Props) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3',
        align === 'center' ? 'items-center text-center mx-auto max-w-2xl' : 'items-start text-left',
        className
      )}
    >
      {eyebrow && (
        <span className="text-xs font-mono font-medium uppercase tracking-[0.18em] text-indigo">
          {eyebrow}
        </span>
      )}
      <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
        {title}
      </h2>
      {sub && (
        <p className="text-pretty text-base leading-relaxed text-muted sm:text-lg">
          {sub}
        </p>
      )}
    </div>
  );
}
