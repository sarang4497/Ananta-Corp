'use client';

import {Fragment, useRef} from 'react';
import {LazyMotion, domAnimation, m, useInView} from 'motion/react';
import {ArrowRight} from 'lucide-react';

/**
 * Big "leaky funnel" centerpiece for The Market Reality. Five stages narrow
 * top-to-bottom — $1,000 ad spend → 50 leads → 25 booked → 10 show → 2 convert
 * — so the drop-off is unmissable, then a revenue payoff shows $1,000 in →
 * ~$10,000 out (≈10×). Segments fill in sequence on scroll-in. Branded
 * blue→indigo→mauve, no black. Numbers are an illustrative example.
 */

type Stage = {label: string; sub?: string; value: string; width: number; color: string};

// Width % narrows each step (drop-off is obvious); a generous minWidth keeps
// even "2 convert" large and legible on mobile.
const STAGES: Stage[] = [
  {label: 'Ad spend', value: '$1,000', width: 100, color: '#1877F2'},
  {label: 'Leads', value: '50', width: 80, color: '#3A66E0'},
  {label: 'Appointments booked', value: '25', width: 60, color: '#4F46E5'},
  {label: 'Show up', value: '10', width: 42, color: '#6D5BD0'},
  {label: 'Convert', sub: 'become patients', value: '2', width: 26, color: '#B06A9E'}
];

const HONEST =
  'Example funnel — actual numbers vary by clinic, market, budget, and competition.';

export function LeakyFunnel({caption = HONEST}: {caption?: string}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {once: true, margin: '-60px'});
  // Payoff bars animate after the funnel has filled in.
  const payoffDelay = STAGES.length * 0.14 + 0.2;

  return (
    <LazyMotion features={domAnimation}>
      <div ref={ref} className="w-full">
        {/* The funnel */}
        <div className="flex flex-col items-center gap-2.5 sm:gap-3">
          {STAGES.map((s, i) => (
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
              {i < STAGES.length - 1 ? (
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

        {/* Revenue payoff */}
        <div className="mt-8 grid items-center gap-7 rounded-3xl border border-indigo/20 bg-gradient-to-br from-blue/5 via-bg to-indigo/10 p-6 sm:mt-10 sm:grid-cols-[1.1fr_1fr] sm:gap-8 sm:p-9">
          {/* Statements */}
          <div className="flex flex-col gap-3 text-center sm:text-left">
            <p className="text-2xl font-extrabold leading-tight tracking-tight text-ink sm:text-3xl">
              2 implant patients{' '}
              <span className="whitespace-nowrap text-indigo">≈ $10,000</span> in revenue
            </p>
            <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-lg font-bold text-muted sm:justify-start sm:text-xl">
              <span className="text-ink">$1,000 in</span>
              <ArrowRight className="h-5 w-5 text-blue" aria-hidden />
              <span className="text-blue">~$10,000 out</span>
              <span className="inline-flex items-center rounded-full bg-gradient-brand px-3 py-1 text-sm font-extrabold uppercase tracking-wide text-white shadow-sm">
                ≈ 10×
              </span>
            </p>
          </div>

          {/* Growing bars: $1,000 → $10,000 */}
          <div className="flex items-end justify-center gap-5 sm:gap-7" aria-hidden>
            <div className="flex flex-col items-center gap-2">
              <m.div
                initial={{scaleY: 0}}
                animate={inView ? {scaleY: 1} : {}}
                transition={{duration: 0.5, delay: payoffDelay, ease: [0.22, 1, 0.36, 1]}}
                style={{transformOrigin: 'bottom', backgroundImage: 'linear-gradient(180deg,#3A66E0,#1877F2)'}}
                className="w-12 rounded-t-lg shadow-sm sm:w-14"
                // Short bar.
              >
                <div className="h-14 sm:h-16" />
              </m.div>
              <span className="text-xs font-bold text-muted sm:text-sm">$1,000 in</span>
            </div>

            <ArrowRight className="mb-7 h-6 w-6 shrink-0 text-indigo sm:mb-8" aria-hidden />

            <div className="flex flex-col items-center gap-2">
              <m.div
                initial={{scaleY: 0}}
                animate={inView ? {scaleY: 1} : {}}
                transition={{duration: 0.7, delay: payoffDelay + 0.18, ease: [0.22, 1, 0.36, 1]}}
                style={{transformOrigin: 'bottom', backgroundImage: 'linear-gradient(180deg,#6D5BD0,#4F46E5)'}}
                className="w-16 rounded-t-lg shadow-glow sm:w-20"
                // Tall bar (~10× presence).
              >
                <div className="h-40 sm:h-48" />
              </m.div>
              <span className="text-xs font-extrabold text-indigo sm:text-sm">$10,000 out</span>
            </div>
          </div>
        </div>
      </div>
    </LazyMotion>
  );
}
