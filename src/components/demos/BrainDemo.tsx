'use client';

import {m} from 'motion/react';
import {Whiteboard} from './Whiteboard';
import {Cursor} from './Cursor';
import {Typewriter} from './demoPrimitives';
import {useDemoTimeline, type TimelineStep} from './useDemoTimeline';
import {accentBg, accentHex, accentText, type Accent} from './demoAccent';

/**
 * Demo 4 — Company Brain (green).
 * A premium knowledge tool. Click the search bar → a question types itself →
 * send → the answer streams token-by-token → source citations pop in → an
 * "answered in 0.8s" badge.
 */

const QUERY = "What's our refund policy for enterprise plans?";
const ANSWER =
  'Enterprise plans include a full 30-day refund window. After 30 days, refunds are prorated for the unused term, processed within 5 business days.';

const STEPS: TimelineStep[] = [
  {duration: 1500, cursor: {x: 56, y: 58}}, // 0 idle
  {duration: 1300, cursor: {x: 50, y: 26}, click: true}, // 1 focus search
  {duration: 1900, cursor: {x: 50, y: 26}}, // 2 type query
  {duration: 1600, cursor: {x: 50, y: 26}}, // 3 type query
  {duration: 1200, cursor: {x: 90, y: 26}, click: true}, // 4 send
  {duration: 2200, cursor: {x: 56, y: 62}}, // 5 answer streams
  {duration: 1700, cursor: {x: 56, y: 62}}, // 6 stream continues
  {duration: 1400, cursor: {x: 42, y: 84}}, // 7 citations pop
  {duration: 1500, cursor: {x: 72, y: 84}}, // 8 timing badge
  {duration: 2400, cursor: {x: 56, y: 62}} // 9 hold
];

const SOURCES = [
  {name: 'Refund-Policy.pdf', cited: true},
  {name: 'Terms-of-Service.pdf', cited: true},
  {name: 'Pricing-2026.pdf', cited: false},
  {name: 'Onboarding.docx', cited: false}
];

export default function BrainDemo({playing, accent}: {playing: boolean; accent: Accent}) {
  const {index, cursor, clickKey} = useDemoTimeline(STEPS, playing);
  const hex = accentHex[accent];

  const focused = index >= 1;
  const typing = index >= 2;
  const streaming = index >= 5;
  const cited = index >= 7;
  const timed = index >= 8;

  return (
    <Whiteboard label="company_brain" accent={accent} playing={playing}>
      <div className="absolute inset-2 flex gap-2 overflow-hidden rounded-2xl border border-border bg-bg shadow-card sm:inset-3">
        {/* sources rail */}
        <div className="flex w-[30%] min-w-[96px] flex-none flex-col gap-1.5 border-r border-border bg-bg-soft/40 p-2">
          <div className="flex items-center gap-1.5">
            <span className={`grid h-5 w-5 place-items-center rounded-md ${accentBg[accent]}`}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                <path d="M12 3l2.2 5.3L20 9l-4 3.8L17 19l-5-3-5 3 1-6.2L4 9l5.8-.7z" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="text-[9px] font-semibold text-ink">Knowledge</span>
          </div>
          <p className="text-[7px] text-muted">12,480 docs indexed</p>
          <div className="mt-1 flex flex-col gap-1">
            {SOURCES.map((s) => {
              const hot = cited && s.cited;
              return (
                <m.div
                  key={s.name}
                  className="flex items-center gap-1 rounded-md border px-1.5 py-1"
                  animate={{
                    borderColor: hot ? hex : 'rgba(79,70,229,0.12)',
                    backgroundColor: hot ? `${hex}12` : 'rgba(255,255,255,0)'
                  }}
                  transition={{duration: 0.3}}
                >
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" className="flex-none">
                    <path d="M6 2h8l4 4v16H6zM14 2v4h4" stroke={hot ? hex : 'rgba(91,99,133,0.6)'} strokeWidth="1.8" strokeLinejoin="round" />
                  </svg>
                  <span className="min-w-0 flex-1 truncate text-[7.5px] font-medium text-ink">{s.name}</span>
                  {hot && <span className="h-1 w-1 flex-none rounded-full" style={{background: hex}} />}
                </m.div>
              );
            })}
          </div>
        </div>

        {/* main */}
        <div className="flex min-w-0 flex-1 flex-col p-2.5">
          {/* search bar */}
          <div
            className="flex items-center gap-1.5 rounded-xl border bg-bg px-2 py-1.5 transition-colors"
            style={{borderColor: focused ? hex : 'var(--border)', boxShadow: focused ? `0 0 0 3px ${hex}1f` : 'none'}}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="flex-none">
              <circle cx="11" cy="11" r="7" stroke="rgba(91,99,133,0.7)" strokeWidth="2" />
              <path d="M16.5 16.5L21 21" stroke="rgba(91,99,133,0.7)" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <div className="min-w-0 flex-1 text-[9.5px] text-ink">
              {typing ? (
                <Typewriter
                  text={QUERY}
                  active={typing}
                  speed={36}
                  caret={index >= 2 && index <= 3}
                  caretClassName="d-blink ml-px inline-block h-3 w-px align-middle"
                  className="text-ink"
                />
              ) : (
                <span className="text-muted/50">Ask anything…</span>
              )}
            </div>
            <m.button
              type="button"
              animate={index === 4 ? {scale: [1, 0.9, 1]} : {scale: 1}}
              transition={{duration: 0.3}}
              className={`grid h-5 w-5 flex-none place-items-center rounded-lg ${accentBg[accent]}`}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h13M13 6l6 6-6 6" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </m.button>
          </div>

          {/* answer */}
          <div className="mt-2 flex min-h-0 flex-1 flex-col">
            {streaming && (
              <m.div initial={{opacity: 0, y: 8}} animate={{opacity: 1, y: 0}} className="flex gap-1.5">
                <span className={`mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-full ${accentBg[accent]}`}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                    <path d="M12 3l2.2 5.3L20 9l-4 3.8L17 19l-5-3-5 3 1-6.2L4 9l5.8-.7z" fill="#fff" />
                  </svg>
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] leading-relaxed text-ink">
                    <Typewriter
                      text={ANSWER}
                      active={streaming}
                      speed={20}
                      caret={index >= 5 && index <= 6}
                      caretClassName="d-blink ml-px inline-block h-3 w-px align-middle"
                    />
                  </p>

                  {/* citations */}
                  {cited && (
                    <div className="mt-2 flex flex-wrap items-center gap-1">
                      <span className="text-[7px] font-medium uppercase tracking-wide text-muted">Sources</span>
                      {['Refund-Policy.pdf', 'Terms §4'].map((c, i) => (
                        <m.span
                          key={c}
                          initial={{opacity: 0, scale: 0.6, y: 4}}
                          animate={{opacity: 1, scale: 1, y: 0}}
                          transition={{type: 'spring', stiffness: 320, damping: 18, delay: i * 0.12}}
                          className="inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[7.5px] font-medium"
                          style={{borderColor: `${hex}55`, background: `${hex}12`, color: hex}}
                        >
                          <span className="h-1 w-1 rounded-full" style={{background: hex}} />
                          {c}
                        </m.span>
                      ))}
                    </div>
                  )}
                </div>
              </m.div>
            )}

            {/* timing badge */}
            {timed && (
              <m.div
                initial={{opacity: 0, y: 6}}
                animate={{opacity: 1, y: 0}}
                className="mt-auto flex items-center gap-1.5 pt-2"
              >
                <span
                  className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[7.5px] font-semibold"
                  style={{background: `${hex}14`, color: hex}}
                >
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke={hex} strokeWidth="2" />
                    <path d="M12 8v4l3 2" stroke={hex} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  answered in 0.8s
                </span>
                <span className={`text-[7.5px] font-medium ${accentText[accent]}`}>· grounded</span>
              </m.div>
            )}
          </div>
        </div>
      </div>

      <Cursor x={cursor.x} y={cursor.y} clickKey={clickKey} accent={accent} />
    </Whiteboard>
  );
}
