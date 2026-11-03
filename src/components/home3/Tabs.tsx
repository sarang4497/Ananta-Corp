'use client';

import {useId, useRef, useState, type ReactNode} from 'react';
import {cn} from '@/lib/cn';

/**
 * Accessible tabs (WAI-ARIA tabs pattern): role=tablist/tab/tabpanel,
 * roving tabindex, ArrowLeft/Right/Up/Down + Home/End move AND select.
 * Panels are server-rendered children; inactive ones are `hidden`.
 */
export function Tabs({
  label,
  tabs,
  className,
  listClassName
}: {
  label: string;
  tabs: {key: string; label: string; panel: ReactNode}[];
  className?: string;
  listClassName?: string;
}) {
  const [i, setI] = useState(0);
  const uid = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const go = (n: number) => {
    const k = (n + tabs.length) % tabs.length;
    setI(k);
    refs.current[k]?.focus();
  };
  const onKey = (e: React.KeyboardEvent) => {
    const map: Record<string, number> = {ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: tabs.length - 1};
    if (!(e.key in map)) return;
    e.preventDefault();
    go(map[e.key]);
  };
  return (
    <div className={className}>
      <div role="tablist" aria-label={label} aria-orientation="horizontal" className={cn('flex flex-wrap gap-2', listClassName)} onKeyDown={onKey}>
        {tabs.map((t, n) => (
          <button
            key={t.key}
            ref={(el) => {
              refs.current[n] = el;
            }}
            id={`${uid}-tab-${n}`}
            role="tab"
            type="button"
            aria-selected={n === i}
            aria-controls={`${uid}-panel-${n}`}
            tabIndex={n === i ? 0 : -1}
            onClick={() => setI(n)}
            className={cn(
              'inline-flex min-h-11 items-center rounded-[6px] border px-4 py-2 text-left text-[14.5px] font-semibold leading-tight transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue',
              n === i ? 'border-navy bg-navy text-white' : 'border-line bg-white text-ink hover:border-indigo/40 hover:text-indigo'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t, n) => (
        <div key={t.key} id={`${uid}-panel-${n}`} role="tabpanel" aria-labelledby={`${uid}-tab-${n}`} tabIndex={0} hidden={n !== i} className="mt-6 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue">
          {t.panel}
        </div>
      ))}
    </div>
  );
}
