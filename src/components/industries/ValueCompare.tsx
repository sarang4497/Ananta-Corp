'use client';

import {useEffect, useRef, useState} from 'react';
import {LazyMotion, domAnimation, m, useInView, useReducedMotion} from 'motion/react';
import {ArrowRight} from 'lucide-react';

/**
 * Before/after value centerpiece — the same client, two very different lifetime
 * values. Numbers count up and the proportional bars fill on scroll-in. Brand
 * blue→indigo, no black. Figures are passed in and are illustrative.
 */

type Labels = {
  kicker: string;
  heading: string;
  oldLabel: string;
  oldValue: number;
  oldItems: string;
  oldDesc: string;
  newLabel: string;
  newValue: number;
  newItems: string;
  newDesc: string;
  currency: string; // e.g. "€"
  uplift: string; // e.g. "≈ 10× lifetime value"
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
    const dur = 1200;
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
  maxValue,
  items,
  desc,
  currency,
  variant,
  run,
  reduce
}: {
  label: string;
  value: number;
  maxValue: number;
  items: string;
  desc: string;
  currency: string;
  variant: 'old' | 'new';
  run: boolean;
  reduce: boolean;
}) {
  const n = useCountUp(value, run, reduce);
  const isNew = variant === 'new';
  const widthPct = (value / maxValue) * 100;
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
            'text-4xl font-extrabold leading-none tracking-tight tabular-nums sm:text-5xl',
            isNew ? 'text-indigo' : 'text-ink/60'
          ].join(' ')}
        >
          {currency}
          {n.toLocaleString('en-US')}
        </span>
        <span className="pb-1 text-sm font-semibold text-muted">/ client</span>
      </div>

      <div className="h-3 w-full overflow-hidden rounded-full bg-bg-soft">
        <m.div
          initial={{width: reduce ? `${widthPct}%` : 0}}
          animate={run ? {width: `${widthPct}%`} : {}}
          transition={{duration: 1, ease: [0.22, 1, 0.36, 1]}}
          className={['h-full rounded-full', isNew ? 'bg-gradient-brand' : 'bg-ink/25'].join(' ')}
        />
      </div>

      <p className={['text-sm font-semibold', isNew ? 'text-ink' : 'text-muted'].join(' ')}>{items}</p>
      <p className="text-[13px] leading-relaxed text-muted">{desc}</p>
    </div>
  );
}

export function ValueCompare(labels: Labels) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {once: true, margin: '-60px'});
  const reduce = !!useReducedMotion();
  const maxValue = Math.max(labels.oldValue, labels.newValue);

  return (
    <LazyMotion features={domAnimation}>
      <div ref={ref} className="w-full">
        <div className="mx-auto mb-8 flex max-w-3xl flex-col items-center gap-3 text-center sm:mb-10">
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-indigo">{labels.kicker}</span>
          <h3 className="text-balance text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            {labels.heading}
          </h3>
        </div>

        <div className="relative grid items-stretch gap-5 sm:grid-cols-2 sm:gap-6">
          <Column
            label={labels.oldLabel}
            value={labels.oldValue}
            maxValue={maxValue}
            items={labels.oldItems}
            desc={labels.oldDesc}
            currency={labels.currency}
            variant="old"
            run={inView}
            reduce={reduce}
          />
          <Column
            label={labels.newLabel}
            value={labels.newValue}
            maxValue={maxValue}
            items={labels.newItems}
            desc={labels.newDesc}
            currency={labels.currency}
            variant="new"
            run={inView}
            reduce={reduce}
          />

          <m.div
            initial={reduce ? false : {opacity: 0, scale: 0.8}}
            animate={inView ? {opacity: 1, scale: 1} : {}}
            transition={{duration: 0.5, delay: 0.9, ease: [0.22, 1, 0.36, 1]}}
            className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 sm:block"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-extrabold text-indigo shadow-[0_12px_30px_-10px_rgba(79,70,229,0.55)] ring-1 ring-indigo/15">
              <ArrowRight className="h-4 w-4" aria-hidden />
              {labels.uplift}
            </span>
          </m.div>
        </div>

        <p className="mt-5 text-center text-base font-extrabold text-indigo sm:hidden">{labels.uplift}</p>
        <p className="mx-auto mt-4 max-w-2xl text-center text-xs leading-relaxed text-muted">{labels.note}</p>
      </div>
    </LazyMotion>
  );
}
