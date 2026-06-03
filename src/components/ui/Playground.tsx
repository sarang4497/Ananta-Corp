import type {ReactNode} from 'react';
import {cn} from '@/lib/cn';

type Props = {
  /** Label shown in the Geist Mono terminal-style header bar. */
  title?: string;
  children: ReactNode;
  className?: string;
};

/**
 * Bordered "app shell" with a Geist Mono header bar — the framed surface every
 * AI demo / playground renders inside. Purely presentational (Server Component);
 * the interactive demo is passed in as children.
 */
export function Playground({title = 'demo.tsx', children, className}: Props) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl border border-border bg-bg shadow-glow',
        className
      )}
    >
      <div className="flex items-center gap-3 border-b border-border bg-bg-soft/60 px-4 py-3">
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-blue/40" />
          <span className="h-2.5 w-2.5 rounded-full bg-indigo/40" />
          <span className="h-2.5 w-2.5 rounded-full bg-green/40" />
        </span>
        <span className="font-mono text-xs text-muted">{title}</span>
        <span className="ml-auto font-mono text-[10px] uppercase tracking-widest text-indigo">
          live
        </span>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </div>
  );
}
