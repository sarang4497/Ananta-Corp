'use client';

import type {ReactNode} from 'react';

/**
 * Opens the floating assistant chat from anywhere (e.g. a page's secondary CTA)
 * by dispatching a window event the ChatWidget listens for.
 */
export function AskBellaButton({
  className,
  children
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event('open-bella'))}
      className={className}
    >
      {children}
    </button>
  );
}
