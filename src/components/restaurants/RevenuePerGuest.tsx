'use client';

import {useEffect, useRef, useState} from 'react';
import {LazyMotion, domAnimation, m, useInView, useReducedMotion} from 'motion/react';
import {ArrowRight} from 'lucide-react';

/**
 * "Revenue per guest" before/after centerpiece — the same guest, two very
 * different checks. Old way (paper menu, ~$24) vs new way (QR menu + AI upsell,
 * ~$42, ≈ +75%). Numbers count up and the proportional bars fill on scroll-in.
 * Branded blue→indigo, no black. Figures are an illustrative example.
 */

const OLD = 24;
const NEW = 42;
const UP = Math.round(((NEW - OLD) / OLD) * 100); // ≈ 75

type Labels = {
  kicker: string;
  heading: string;
  oldLabel: string;
  oldItems: string;
  oldDesc: string;
  newLabel: string;
  newItems: string;
  newDesc: string;
  note: string;
};

function useCountUp(target: number, run: boolean, reduce: boolean) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (reduce) {
      setN(target);
      return;
    }
    if (!run) return;
    let raf = 0;
    let start = 0;
    const dur = 1100;
    const tick = (t: number) => {
      if (!start) start = t;
      const p = Math.min((t - start) / dur, 1);
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setN(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run, reduce]);
  return n;
}

function Column({
  label,
  value,
  items,
  desc,
  variant,
  run,
  reduce
}: {
  label: string;
  value: number;
  items: string;
  desc: string;
  variant: 'old' | 'new';
  run: boolean;
  reduce: boolean;
}) {
  const n = useCountUp(value, run, reduce);
  const isNew = variant === 'new';
  // Bar width relative to the larger (new) check, so the gap is visual.
  const widthPct = (value / NEW) * 100;

  return (
    <div
      className={[
        'flex flex-col gap-4 rounded-2xl border p-6 sm:p-7',
        isNew
          ? 'border-indigo/30 bg-gradient-to-br from-blue/5 via-bg to-indigo/10 shadow-[0_24px_60px_-28px_rgba(79,70,229,0.5)]'
          : 'border-border bg-bg-soft/40'
      ].join(' ')}
    >
      <span
        className={[
          'inline-flex w-fit items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em]',
          isNew ? 'bg-gradient-brand text-white' : 'bg-bg text-muted'
        ].join(' ')}
      >
        {label}
      </span>

      <div className="flex items-end gap-1">
        <span
          className={[
            'text-5xl font-extrabold leading-none tracking-tight tabular-nums sm:text-6xl',
            isNew ? 'text-indigo' : 'text-ink/60'
          ].join(' ')}
        >
          ${n}
        </span>
        <span className="pb-1 text-sm font-semibold text-muted">avg check</span>
      </div>

      {/* Proportional bar. */}
      <div className="h-3 w-full overflow-hidden rounded-full bg-bg-soft">
        <m.div
          initial={{width: reduce ? `${widthPct}%` : 0}}
          animate={run ? {width: `${widthPct}%`} : {}}
          transition={{duration: 1, ease: [0.22, 1, 0.36, 1]}}
          className={['h-full rounded-full', isNew ? 'bg-gradient-brand' : 'bg-ink/25'].join(' ')}
        />
      </div>

      <p className={['text-sm font-semibold', isNew ? 'text-ink' : 'text-muted'].join(' ')}>
        {items}
      </p>
      <p className="text-[13px] leading-relaxed text-muted">{desc}</p>
    </div>
  );
}

export function RevenuePerGuest(labels: Labels) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {once: true, margin: '-60px'});
  const reduce = !!useReducedMotion();

  return (
    <LazyMotion features={domAnimation}>
      <div ref={ref} className="w-full">
        <div className="mx-auto mb-8 flex max-w-3xl flex-col items-center gap-3 text-center sm:mb-10">
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-indigo">
            {labels.kicker}
          </span>
          <h3 className="text-balance text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            {labels.heading}
          </h3>
        </div>

        <div className="relative grid items-stretch gap-5 sm:grid-cols-2 sm:gap-6">
          <Column
            label={labels.oldLabel}
            value={OLD}
            items={labels.oldItems}
            desc={labels.oldDesc}
            variant="old"
            run={inView}
            reduce={reduce}
          />
          <Column
            label={labels.newLabel}
            value={NEW}
            items={labels.newItems}
            desc={labels.newDesc}
            variant="new"
            run={inView}
            reduce={reduce}
          />

          {/* Uplift badge between the columns. */}
          <m.div
            initial={reduce ? false : {opacity: 0, scale: 0.8}}
            animate={inView ? {opacity: 1, scale: 1} : {}}
            transition={{duration: 0.5, delay: 0.9, ease: [0.22, 1, 0.36, 1]}}
            className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 sm:block"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-extrabold text-indigo shadow-[0_12px_30px_-10px_rgba(79,70,229,0.55)] ring-1 ring-indigo/15">
              <ArrowRight className="h-4 w-4" aria-hidden />≈ +{UP}%
            </span>
          </m.div>
        </div>

        {/* Mobile uplift line + note. */}
        <p className="mt-5 text-center text-base font-extrabold text-indigo sm:hidden">
          ≈ +{UP}% average check
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-center text-xs leading-relaxed text-muted">
          {labels.note}
        </p>
      </div>
    </LazyMotion>
  );
}
