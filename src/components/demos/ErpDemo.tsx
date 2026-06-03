'use client';

import {m} from 'motion/react';
import {Whiteboard} from './Whiteboard';
import {Cursor} from './Cursor';
import {CountUp} from './demoPrimitives';
import {useDemoTimeline, type TimelineStep} from './useDemoTimeline';
import {accentBg, accentHex, accentText, type Accent} from './demoAccent';

/**
 * Demo 2 — Internal Tools & ERPs (indigo).
 * A SaaS admin panel. Click "Sync" → messy rows settle into a clean sorted
 * table, KPI cards count up, a revenue line draws in, a kanban card moves to
 * Done.
 */

const STEPS: TimelineStep[] = [
  {duration: 1600, cursor: {x: 87, y: 30}}, // 0 idle (messy)
  {duration: 1300, cursor: {x: 88, y: 13}}, // 1 reach Sync
  {duration: 1300, cursor: {x: 88, y: 13}, click: true}, // 2 click Sync
  {duration: 1700, cursor: {x: 70, y: 40}}, // 3 syncing
  {duration: 1700, cursor: {x: 50, y: 45}}, // 4 sorted + KPIs count
  {duration: 1700, cursor: {x: 30, y: 55}}, // 5 chart draws
  {duration: 1500, cursor: {x: 55, y: 86}}, // 6 settle
  {duration: 1700, cursor: {x: 84, y: 86}}, // 7 kanban → Done
  {duration: 2400, cursor: {x: 60, y: 60}}, // 8 settled
  {duration: 2100, cursor: {x: 60, y: 60}} // 9 hold
];

const ROWS = [
  {id: 'INV-2042', name: 'Rossi S.r.l.', value: 12400, messyX: -7, status: 'Paid'},
  {id: 'INV-2039', name: 'Conti & Co.', value: 8650, messyX: 9, status: 'Paid'},
  {id: 'INV-2051', name: 'Marini SpA', value: 6300, messyX: -5, status: 'Due'},
  {id: 'INV-2048', name: 'Verdi Group', value: 4180, messyX: 6, status: 'Paid'}
];

const NAV = ['grid', 'cart', 'chart', 'users', 'cog'] as const;
const CHART = [22, 19, 27, 24, 33, 30, 41, 47];

export default function ErpDemo({playing, accent}: {playing: boolean; accent: Accent}) {
  const {index, cursor, clickKey} = useDemoTimeline(STEPS, playing);
  const hex = accentHex[accent];
  const syncing = index === 3;
  const done = index >= 4;
  const charting = index >= 5;
  const moved = index >= 7;

  // Build the revenue line path in a 0..100 x 0..40 viewBox.
  const max = Math.max(...CHART);
  const pts = CHART.map((v, i) => {
    const x = (i / (CHART.length - 1)) * 100;
    const y = 38 - (v / max) * 32;
    return [x, y] as const;
  });
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  const area = `${line} L100 40 L0 40 Z`;
  const lastPt = pts[pts.length - 1];

  return (
    <Whiteboard label="erp_dashboard" accent={accent} playing={playing}>
      <div className="absolute inset-2 flex overflow-hidden rounded-2xl border border-border bg-bg shadow-card sm:inset-3">
        {/* sidebar */}
        <div className="flex w-9 flex-none flex-col items-center gap-3 border-r border-border bg-bg-soft/50 py-3 sm:w-11">
          <span className={`h-5 w-5 rounded-lg ${accentBg[accent]}`} />
          {NAV.map((n, i) => (
            <span
              key={n}
              className="grid h-6 w-6 place-items-center rounded-lg"
              style={{background: i === 0 ? `${hex}1a` : 'transparent'}}
            >
              <NavIcon name={n} color={i === 0 ? hex : 'rgba(91,99,133,0.5)'} />
            </span>
          ))}
        </div>

        {/* main */}
        <div className="flex min-w-0 flex-1 flex-col gap-2 p-2.5">
          {/* topbar */}
          <div className="flex items-center gap-2">
            <div>
              <p className="text-[11px] font-semibold leading-none text-ink">Operations</p>
              <p className="mt-0.5 text-[8px] text-muted">Finance · live</p>
            </div>
            <m.button
              type="button"
              animate={index === 2 ? {scale: [1, 0.94, 1]} : {scale: 1}}
              transition={{duration: 0.3}}
              className={`ml-auto inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[9.5px] font-semibold text-white ${accentBg[accent]}`}
              style={{boxShadow: `0 8px 18px -8px ${hex}aa`}}
            >
              <m.span
                animate={syncing ? {rotate: 360} : {rotate: 0}}
                transition={syncing ? {repeat: Infinity, duration: 0.9, ease: 'linear'} : {duration: 0.2}}
                className="inline-flex"
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                  <path d="M20 11a8 8 0 1 0-2.3 5.7M20 5v5h-5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </m.span>
              {syncing ? 'Syncing…' : done ? 'Synced' : 'Sync'}
            </m.button>
          </div>

          {/* KPI cards */}
          <div className="grid grid-cols-3 gap-2">
            {[
              {l: 'Revenue', v: 31530, f: (n: number) => `€${Math.round(n).toLocaleString('en-US')}`, up: '+18%'},
              {l: 'Orders', v: 184, f: (n: number) => String(Math.round(n)), up: '+12%'},
              {l: 'Margin', v: 42, f: (n: number) => `${Math.round(n)}%`, up: '+4pt'}
            ].map((k) => (
              <div key={k.l} className="rounded-xl border border-border bg-bg-soft/40 p-1.5">
                <p className="text-[7.5px] font-medium uppercase tracking-wide text-muted">{k.l}</p>
                <p className="mt-0.5 text-[12px] font-bold leading-none text-ink">
                  <CountUp to={k.v} active={done} format={k.f} durationMs={1300} />
                </p>
                <p className={`mt-0.5 text-[7.5px] font-semibold ${accentText[accent]}`}>{k.up} MoM</p>
              </div>
            ))}
          </div>

          {/* chart + table */}
          <div className="grid min-h-0 flex-1 grid-cols-[1.1fr_1fr] gap-2">
            {/* chart card */}
            <div className="flex min-h-0 flex-col rounded-xl border border-border bg-bg p-2">
              <p className="text-[8.5px] font-semibold text-ink">Revenue trend</p>
              <div className="relative min-h-0 flex-1">
                <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
                  <defs>
                    <linearGradient id={`erp-fill-${accent}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={hex} stopOpacity="0.28" />
                      <stop offset="100%" stopColor={hex} stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {[10, 20, 30].map((y) => (
                    <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="rgba(79,70,229,0.08)" strokeWidth="0.4" />
                  ))}
                  <m.path
                    d={area}
                    fill={`url(#erp-fill-${accent})`}
                    initial={{opacity: 0}}
                    animate={{opacity: charting ? 1 : 0}}
                    transition={{duration: 0.6, delay: 0.3}}
                  />
                  <m.path
                    d={line}
                    fill="none"
                    stroke={hex}
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                    initial={{pathLength: 0}}
                    animate={{pathLength: charting ? 1 : 0}}
                    transition={{duration: 1.1, ease: 'easeInOut'}}
                  />
                </svg>
                <m.span
                  className="absolute h-1.5 w-1.5 rounded-full"
                  style={{
                    background: hex,
                    left: `${lastPt[0]}%`,
                    top: `${(lastPt[1] / 40) * 100}%`,
                    boxShadow: `0 0 0 3px ${hex}33`,
                    marginLeft: -3,
                    marginTop: -3
                  }}
                  initial={{scale: 0}}
                  animate={{scale: charting ? 1 : 0}}
                  transition={{delay: 1.1, type: 'spring', stiffness: 300, damping: 18}}
                />
              </div>
            </div>

            {/* table card */}
            <div className="flex min-h-0 flex-col rounded-xl border border-border bg-bg p-2">
              <div className="mb-1 flex items-center justify-between">
                <p className="text-[8.5px] font-semibold text-ink">Invoices</p>
                {done && (
                  <m.span
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    className="inline-flex items-center gap-0.5 text-[7px] font-medium text-muted"
                  >
                    Amount
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none">
                      <path d="M12 5v14M6 13l6 6 6-6" stroke={hex} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </m.span>
                )}
              </div>
              <div className="flex min-h-0 flex-1 flex-col gap-1">
                {(done ? [...ROWS].sort((a, b) => b.value - a.value) : ROWS).map((r) => (
                  <m.div
                    key={r.id}
                    className="relative flex items-center gap-1.5 overflow-hidden rounded-md border border-border bg-bg-soft/40 px-1.5 py-1"
                    animate={{x: done ? 0 : r.messyX, opacity: done ? 1 : 0.55}}
                    transition={{type: 'spring', stiffness: 200, damping: 22}}
                  >
                    <span className="h-1.5 w-1.5 flex-none rounded-full" style={{background: hex}} />
                    <span className="min-w-0 flex-1 truncate text-[8px] font-medium text-ink">{r.name}</span>
                    {done ? (
                      <>
                        <span className="text-[8px] font-bold tabular-nums text-ink">
                          €{r.value.toLocaleString('en-US')}
                        </span>
                        <span
                          className="rounded px-1 py-px text-[6.5px] font-semibold"
                          style={{
                            background: r.status === 'Paid' ? '#22c55e1f' : '#f973161f',
                            color: r.status === 'Paid' ? '#16a34a' : '#ea580c'
                          }}
                        >
                          {r.status}
                        </span>
                      </>
                    ) : (
                      <span className="h-2 w-8 rounded bg-border" />
                    )}
                    {syncing && <span className="demo-sheen absolute inset-0" />}
                  </m.div>
                ))}
              </div>
            </div>
          </div>

          {/* kanban */}
          <div className="relative grid grid-cols-3 gap-2">
            {['To do', 'Doing', 'Done'].map((c) => (
              <div key={c} className="rounded-lg border border-border bg-bg-soft/40 px-1.5 py-1">
                <div className="flex items-center gap-1">
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{background: c === 'Done' ? '#22c55e' : c === 'Doing' ? hex : 'rgba(91,99,133,0.4)'}}
                  />
                  <span className="text-[7px] font-semibold uppercase tracking-wide text-muted">{c}</span>
                </div>
                <div className="mt-1 flex flex-col gap-1">
                  {c === 'To do' && <span className="block h-3 rounded bg-border/70" />}
                  {c === 'Done' && <span className="block h-3 rounded bg-border/40" />}
                  {c === 'Doing' && !moved && <span className="block h-3 rounded bg-border/40" />}
                </div>
              </div>
            ))}
            {/* the moving card */}
            <m.div
              className="absolute top-[18px] flex h-4 items-center gap-1 rounded-md border bg-bg px-1.5 shadow-sm"
              style={{width: '28%', borderColor: moved ? '#22c55e' : hex}}
              animate={{left: moved ? '69%' : '36%'}}
              transition={{type: 'spring', stiffness: 200, damping: 20}}
            >
              {moved ? (
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <span className="h-1.5 w-1.5 rounded-full" style={{background: hex}} />
              )}
              <span className="truncate text-[7px] font-semibold text-ink">Reconcile Q2</span>
            </m.div>
          </div>
        </div>
      </div>

      <Cursor x={cursor.x} y={cursor.y} clickKey={clickKey} accent={accent} />
    </Whiteboard>
  );
}

function NavIcon({name, color}: {name: (typeof NAV)[number]; color: string}) {
  const p: Record<(typeof NAV)[number], string> = {
    grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
    cart: 'M4 5h2l2 11h10l2-8H7M9 20h.01M17 20h.01',
    chart: 'M4 20V10M10 20V4M16 20v-7M20 20H3',
    users: 'M16 19a4 4 0 0 0-8 0M12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6',
    cog: 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6M19 12l1.5-1-1-2-1.8.6-1.5-1L15 6h-2l-.7 1.6-1.5 1L9 8l-1 2L9.5 11v2L8 14l1 2 1.8-.6 1.5 1L13 18h2l.7-1.6 1.5-1 1.8.6 1-2-1.5-1z'
  };
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <path d={p[name]} stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
