'use client';

import {m} from 'motion/react';
import {Whiteboard} from './Whiteboard';
import {CountUp} from './demoPrimitives';
import {useDemoTimeline, type TimelineStep} from './useDemoTimeline';
import {accentHex, accentText, type Accent} from './demoAccent';

/**
 * Demo 5 — Customer Acquisition (red). Motion-led, no cursor.
 * A funnel fills stage by stage as particles stream down, a meeting card snaps
 * onto the calendar, and the pipeline value counts up to €48,500.
 */

const STEPS: TimelineStep[] = [
  {duration: 1600}, // 0 idle
  {duration: 1400}, // 1 Visitors
  {duration: 1300}, // 2 Leads
  {duration: 1300}, // 3 Qualified
  {duration: 1300}, // 4 Booked
  {duration: 1700}, // 5 meeting drops
  {duration: 1900}, // 6 pipeline counts
  {duration: 2500} // 7 hold
];

const STAGES = [
  {label: 'Visitors', count: 8420, width: 100, shade: 1},
  {label: 'Leads', count: 1240, width: 74, shade: 0.82},
  {label: 'Qualified', count: 380, width: 50, shade: 0.64},
  {label: 'Booked', count: 64, width: 30, shade: 0.46}
];

// deterministic particle lanes (no RNG)
const PARTICLES = [12, 30, 48, 66, 84, 22, 58, 76];

export default function AcquisitionDemo({playing, accent}: {playing: boolean; accent: Accent}) {
  const {index} = useDemoTimeline(STEPS, playing);
  const hex = accentHex[accent];
  const dropped = index >= 5;
  const counting = index >= 6;

  return (
    <Whiteboard label="acquisition_engine" accent={accent} playing={playing}>
      <div className="absolute inset-2 grid grid-cols-[1fr_1fr] gap-2 sm:inset-3">
        {/* funnel */}
        <div className="relative flex flex-col overflow-hidden rounded-2xl border border-border bg-bg p-2.5 shadow-card">
          <p className="text-[9px] font-semibold text-ink">Acquisition funnel</p>
          <p className="mb-1 text-[7px] text-muted">last 30 days</p>

          {/* descending particles */}
          <div className="pointer-events-none absolute inset-x-0 top-10 bottom-10 overflow-hidden">
            {PARTICLES.map((left, i) => (
              <span
                key={i}
                className="demo-fall absolute h-1 w-1 rounded-full"
                style={{left: `${left}%`, top: 0, background: hex, opacity: 0.5, animationDelay: `${-i * 0.34}s`}}
              />
            ))}
          </div>

          <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-1.5">
            {STAGES.map((s, k) => {
              const on = index >= 1 + k;
              return (
                <m.div
                  key={s.label}
                  className="flex items-center justify-between rounded-lg px-2"
                  style={{
                    width: `${s.width}%`,
                    background: `linear-gradient(90deg, ${hex}, ${hex}cc)`,
                    opacity: 0.42 + s.shade * 0.58,
                    boxShadow: `0 6px 14px -8px ${hex}99`
                  }}
                  initial={{scaleX: 0.2, opacity: 0}}
                  animate={{scaleX: on ? 1 : 0.2, opacity: on ? 0.42 + s.shade * 0.58 : 0}}
                  transition={{type: 'spring', stiffness: 180, damping: 22}}
                >
                  <span className="py-1 text-[8px] font-semibold text-white">{s.label}</span>
                  <span className="py-1 text-[9px] font-bold tabular-nums text-white">
                    <CountUp to={s.count} active={on} durationMs={1100} format={(n) => Math.round(n).toLocaleString('en-US')} />
                  </span>
                </m.div>
              );
            })}
          </div>

          <div className="relative z-10 mt-1 flex items-center justify-center gap-1 text-[7.5px] text-muted">
            <span className={`font-semibold ${accentText[accent]}`}>0.76%</span> visitor→booked
          </div>
        </div>

        {/* calendar + pipeline */}
        <div className="flex flex-col gap-2">
          <div className="relative flex-1 overflow-hidden rounded-2xl border border-border bg-bg p-2.5 shadow-card">
            <div className="mb-1.5 flex items-center justify-between">
              <p className="text-[9px] font-semibold text-ink">This week</p>
              <p className="text-[7px] text-muted">June 2026</p>
            </div>
            <div className="grid grid-cols-5 gap-1">
              {['M', 'T', 'W', 'T', 'F'].map((d, i) => (
                <div key={i} className="text-center">
                  <p className="text-[6.5px] font-medium uppercase text-muted">{d}</p>
                </div>
              ))}
              {/* day slots */}
              {Array.from({length: 15}).map((_, i) => {
                const target = i === 8; // Wed, mid
                return (
                  <div
                    key={i}
                    className="relative h-4 rounded-md border border-border bg-bg-soft/40"
                    style={target && dropped ? {borderColor: hex} : undefined}
                  >
                    {target && dropped && (
                      <m.div
                        initial={{y: -36, opacity: 0, scale: 0.8}}
                        animate={{y: 0, opacity: 1, scale: 1}}
                        transition={{type: 'spring', stiffness: 360, damping: 18}}
                        className="absolute inset-0 flex items-center gap-0.5 rounded-md px-1"
                        style={{background: hex, boxShadow: `0 6px 14px -6px ${hex}aa`}}
                      >
                        <span className="h-1 w-1 flex-none rounded-full bg-white" />
                        <span className="truncate text-[6px] font-semibold text-white">Demo · 10:00</span>
                      </m.div>
                    )}
                  </div>
                );
              })}
            </div>
            {dropped && (
              <m.p
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{delay: 0.3}}
                className="mt-1.5 flex items-center gap-1 text-[7px] font-medium text-muted"
              >
                <span className="h-1 w-1 rounded-full" style={{background: hex}} />
                Meeting auto-booked with acme.it
              </m.p>
            )}
          </div>

          {/* pipeline value */}
          <div className="rounded-2xl border border-border bg-bg p-2.5 shadow-card">
            <div className="flex items-center justify-between">
              <p className="text-[7.5px] font-medium uppercase tracking-wide text-muted">Pipeline value</p>
              <span
                className="inline-flex items-center gap-0.5 rounded-full px-1 py-px text-[7px] font-semibold"
                style={{background: `${hex}14`, color: hex}}
              >
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none">
                  <path d="M12 19V5M6 11l6-6 6 6" stroke={hex} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                +212%
              </span>
            </div>
            <p className="mt-0.5 text-[20px] font-bold leading-none text-ink">
              <CountUp
                to={48500}
                active={counting}
                durationMs={1500}
                format={(n) => `€${Math.round(n).toLocaleString('en-US')}`}
              />
            </p>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-bg-soft">
              <m.div
                className="h-full rounded-full"
                style={{background: `linear-gradient(90deg, ${hex}, ${hex}aa)`}}
                initial={{width: '0%'}}
                animate={{width: counting ? '82%' : '0%'}}
                transition={{duration: 1.4, ease: 'easeOut'}}
              />
            </div>
          </div>
        </div>
      </div>
    </Whiteboard>
  );
}
