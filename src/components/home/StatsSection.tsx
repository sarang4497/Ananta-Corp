'use client';

import {useEffect, useRef, useState} from 'react';
import {useInView, useReducedMotion} from 'motion/react';
import {cn} from '@/lib/cn';

export type StatItem = {
  value: number;
  prefix?: string;
  suffix?: string;
  /** Decimal places to render (e.g. 1 for "3.5×"). Defaults to 0 (integer). */
  decimals?: number;
  label: string;
};

// One palette accent per stat, in copy order.
export const STAT_ACCENTS = ['bg-blue', 'bg-green', 'bg-orange', 'bg-indigo'] as const;
const ACCENTS = STAT_ACCENTS;

/**
 * Single big number that counts up 0 → value whenever it scrolls into view.
 * Uses `once: false`, so leaving and re-entering the viewport resets to 0 and
 * replays the count. Reduced-motion users see the final value immediately.
 */
export function CountUpStat({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  label,
  accent
}: StatItem & {accent: string}) {
  const ref = useRef<HTMLDivElement>(null);
  // No once-flag — re-entry must replay the count.
  const inView = useInView(ref, {once: false, margin: '-80px'});
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (reduce) {
      setDisplay(value);
      return;
    }
    // Reset to 0 on exit so the next enter counts up again.
    if (!inView) {
      setDisplay(0);
      return;
    }

    const duration = 1400;
    let raf = 0;
    let start = 0;
    const tick = (t: number) => {
      if (!start) start = t;
      const progress = Math.min((t - start) / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplay(value * eased);
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, value]);

  return (
    <div ref={ref} className="flex flex-col items-center gap-3 text-center">
      <span className="text-[clamp(1.25rem,3vw,2.5rem)] font-bold leading-none tracking-tight text-[#15183b] tabular-nums">
        {prefix}
        {display.toFixed(decimals)}
        {suffix}
      </span>
      <span className={cn('h-1 w-12 rounded-full', accent)} aria-hidden />
      <span className="max-w-[18rem] text-balance text-sm font-medium text-muted sm:text-base">
        {label}
      </span>
    </div>
  );
}

/**
 * Stats band below the hero marquee. Four big count-up numbers — 4 across on
 * desktop, 2×2 on tablet, stacked on mobile. Light-indigo surface, --ink text.
 */
export function StatsSection({stats}: {stats: StatItem[]}) {
  return (
    <section className="border-y border-border bg-bg-soft/50">
      <div className="shell pb-4 pt-6 sm:pb-6 sm:pt-8">
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-12 lg:grid-cols-4 lg:gap-8">
          {stats.map((stat, i) => (
            <CountUpStat
              key={stat.label}
              {...stat}
              accent={ACCENTS[i % ACCENTS.length]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
