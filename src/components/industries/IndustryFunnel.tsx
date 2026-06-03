'use client';

import {Fragment, useRef} from 'react';
import {LazyMotion, domAnimation, m, useInView} from 'motion/react';
import {ArrowRight} from 'lucide-react';

/**
 * Big animated funnel centerpiece for "The Market Reality". Five stages narrow
 * top-to-bottom so the drop-off is unmissable, then a payoff card: either a
 * revenue MULTIPLIER (spend in → value out, ≈N×) or a CALLOUT (e.g. cart
 * recovery). Segments fill in sequence on scroll-in. Brand spectrum, no black.
 * All numbers are passed in and are illustrative examples.
 */

export type FunnelStage = {label: string; sub?: string; value: string; width: number; color: string};

export type FunnelPayoff =
  | {
      kind: 'multiplier';
      lead: string;
      leadValue: string;
      inLabel: string;
      outLabel: string;
      multiplier: string;
    }
  | {kind: 'callout'; title: string; body: string};

export function IndustryFunnel({
  stages,
  caption,
  payoff
}: {
  stages: FunnelStage[];
  caption: string;
  payoff: FunnelPayoff;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {once: true, margin: '-60px'});
  const payoffDelay = stages.length * 0.14 + 0.2;

  return (
    <LazyMotion features={domAnimation}>
      <div ref={ref} className="w-full">
        {/* The funnel */}
        <div className="flex flex-col items-center gap-2.5 sm:gap-3">
          {stages.map((s, i) => (
            <Fragment key={s.label}>
              <m.div
                initial={{opacity: 0, scaleX: 0.5}}
                animate={inView ? {opacity: 1, scaleX: 1} : {}}
                transition={{duration: 0.55, delay: i * 0.14, ease: [0.22, 1, 0.36, 1]}}
                style={{
                  width: `${s.width}%`,
                  minWidth: '10rem',
                  backgroundImage: `linear-gradient(100deg, ${s.color}, ${s.color}cc)`
                }}
                className="flex min-h-[4.75rem] flex-col items-center justify-center gap-0.5 rounded-2xl px-5 py-4 text-center text-white shadow-[0_16px_34px_-16px_rgba(79,70,229,0.55)] sm:min-h-[6rem] sm:px-8"
              >
                <span className="text-3xl font-extrabold leading-none tabular-nums sm:text-5xl">
                  {s.value}
                </span>
                <span className="text-xs font-bold uppercase tracking-[0.12em] text-white/95 sm:text-base">
                  {s.label}
                  {s.sub ? (
                    <span className="ml-1 font-medium normal-case tracking-normal text-white/80">
                      ({s.sub})
                    </span>
                  ) : null}
                </span>
              </m.div>
              {i < stages.length - 1 ? (
                <m.span
                  initial={{opacity: 0}}
                  animate={inView ? {opacity: 1} : {}}
                  transition={{delay: i * 0.14 + 0.34}}
                  aria-hidden
                  className="text-base leading-none text-indigo/45"
                >
                  ▼
                </m.span>
              ) : null}
            </Fragment>
          ))}
        </div>

        {/* Honest label */}
        <p className="mx-auto mt-5 max-w-2xl text-center text-xs leading-relaxed text-muted sm:text-sm">
          {caption}
        </p>

        {/* Payoff */}
        {payoff.kind === 'multiplier' ? (
          <div className="mt-8 grid items-center gap-7 rounded-3xl border border-indigo/20 bg-gradient-to-br from-blue/5 via-bg to-indigo/10 p-6 sm:mt-10 sm:grid-cols-[1.1fr_1fr] sm:gap-8 sm:p-9">
            <div className="flex flex-col gap-3 text-center sm:text-left">
              <p className="text-2xl font-extrabold leading-tight tracking-tight text-ink sm:text-3xl">
                {payoff.lead} <span className="whitespace-nowrap text-indigo">{payoff.leadValue}</span>
              </p>
              <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-lg font-bold text-muted sm:justify-start sm:text-xl">
                <span className="text-ink">{payoff.inLabel}</span>
                <ArrowRight className="h-5 w-5 text-blue" aria-hidden />
                <span className="text-blue">{payoff.outLabel}</span>
                <span className="inline-flex items-center rounded-full bg-gradient-brand px-3 py-1 text-sm font-extrabold uppercase tracking-wide text-white shadow-sm">
                  {payoff.multiplier}
                </span>
              </p>
            </div>

            {/* Growing bars: in → out */}
            <div className="flex items-end justify-center gap-5 sm:gap-7" aria-hidden>
              <div className="flex flex-col items-center gap-2">
                <m.div
                  initial={{scaleY: 0}}
                  animate={inView ? {scaleY: 1} : {}}
                  transition={{duration: 0.5, delay: payoffDelay, ease: [0.22, 1, 0.36, 1]}}
                  style={{transformOrigin: 'bottom', backgroundImage: 'linear-gradient(180deg,#3A66E0,#1877F2)'}}
                  className="w-12 rounded-t-lg shadow-sm sm:w-14"
                >
                  <div className="h-14 sm:h-16" />
                </m.div>
                <span className="text-xs font-bold text-muted sm:text-sm">{payoff.inLabel}</span>
              </div>

              <ArrowRight className="mb-7 h-6 w-6 shrink-0 text-indigo sm:mb-8" aria-hidden />

              <div className="flex flex-col items-center gap-2">
                <m.div
                  initial={{scaleY: 0}}
                  animate={inView ? {scaleY: 1} : {}}
                  transition={{duration: 0.7, delay: payoffDelay + 0.18, ease: [0.22, 1, 0.36, 1]}}
                  style={{transformOrigin: 'bottom', backgroundImage: 'linear-gradient(180deg,#6D5BD0,#4F46E5)'}}
                  className="w-16 rounded-t-lg shadow-glow sm:w-20"
                >
                  <div className="h-40 sm:h-48" />
                </m.div>
                <span className="text-xs font-extrabold text-indigo sm:text-sm">{payoff.outLabel}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-8 flex flex-col items-center gap-2 rounded-3xl border border-indigo/20 bg-gradient-to-br from-blue/5 via-bg to-indigo/10 p-6 text-center sm:mt-10 sm:p-9">
            <span className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-4 py-1.5 text-sm font-extrabold uppercase tracking-wide text-white shadow-sm">
              <ArrowRight className="h-4 w-4" aria-hidden />
              {payoff.title}
            </span>
            <p className="mx-auto mt-2 max-w-2xl text-base font-medium leading-relaxed text-muted sm:text-lg">
              {payoff.body}
            </p>
          </div>
        )}
      </div>
    </LazyMotion>
  );
}
