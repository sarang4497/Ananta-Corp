'use client';

import type {ReactNode} from 'react';
import {m} from 'motion/react';
import {Whiteboard} from './Whiteboard';
import {Cursor} from './Cursor';
import {Avatar, Typewriter} from './demoPrimitives';
import {useDemoTimeline, type TimelineStep} from './useDemoTimeline';
import {accentBg, accentHex, accentHex2, accentText, type Accent} from './demoAccent';

/**
 * Demo 1 — Custom Web & Mobile Apps (blue).
 * A scripted booking journey inside a polished phone: browse services → open
 * one → fill the booking form → confirm → success confirmation card slides up.
 */

const STEPS: TimelineStep[] = [
  {duration: 1500, cursor: {x: 50, y: 90}}, // 0 home, cursor resting
  {duration: 1300, cursor: {x: 58, y: 47}}, // 1 reach for a service card
  {duration: 1100, cursor: {x: 58, y: 47}, click: true}, // 2 tap it
  {duration: 1500, cursor: {x: 50, y: 81}}, // 3 detail, reach Book
  {duration: 1100, cursor: {x: 50, y: 81}, click: true}, // 4 tap Book
  {duration: 1400, cursor: {x: 50, y: 38}, click: true}, // 5 form, focus name
  {duration: 1600, cursor: {x: 50, y: 38}}, // 6 name types
  {duration: 1400, cursor: {x: 50, y: 51}, click: true}, // 7 pick guests
  {duration: 1300, cursor: {x: 58, y: 63}, click: true}, // 8 pick date
  {duration: 1200, cursor: {x: 50, y: 83}}, // 9 reach Confirm
  {duration: 1100, cursor: {x: 50, y: 83}, click: true}, // 10 tap Confirm
  {duration: 2500, cursor: {x: 50, y: 95}}, // 11 success
  {duration: 2200, cursor: {x: 50, y: 95}} // 12 hold
];

const spring = {type: 'spring', stiffness: 220, damping: 22} as const;

export default function AppFlowDemo({playing, accent}: {playing: boolean; accent: Accent}) {
  const {index, cursor, clickKey} = useDemoTimeline(STEPS, playing);

  const screen: 'home' | 'detail' | 'form' | 'success' =
    index <= 2 ? 'home' : index <= 4 ? 'detail' : index <= 10 ? 'form' : 'success';

  const hex = accentHex[accent];
  const hex2 = accentHex2[accent];

  return (
    <Whiteboard label="mobile_app.tsx" accent={accent} playing={playing}>
      {/* Phone */}
      <div className="absolute left-1/2 top-[5%] h-[90%] w-[46%] max-w-[230px] -translate-x-1/2">
        <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[1.9rem] border border-border bg-bg p-[5px] shadow-[0_20px_45px_-20px_rgba(79,70,229,0.45)]">
          <span className="absolute left-1/2 top-[7px] z-20 h-1.5 w-12 -translate-x-1/2 rounded-full bg-ink/15" />
          <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1.55rem] bg-bg-soft/50">
            {/* app bar */}
            <div className="flex items-center gap-2 px-3 pb-2 pt-5">
              <span className={`grid h-6 w-6 place-items-center rounded-lg ${accentBg[accent]}`}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M4 7h16M4 12h16M4 17h10" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              </span>
              <span className="text-[11px] font-semibold text-ink">Salone Aurora</span>
              <Avatar initials="MB" from={hex} to={hex2} size={22} className="ml-auto" />
            </div>

            <div className="relative min-h-0 flex-1">
              {/* HOME */}
              {screen === 'home' && (
                <div className="flex h-full flex-col gap-2 px-3 pb-3">
                  <div
                    className="relative overflow-hidden rounded-xl p-2.5"
                    style={{background: `linear-gradient(120deg, ${hex}, ${hex2})`}}
                  >
                    <p className="text-[10px] font-medium text-white/80">Welcome back, Marco</p>
                    <p className="text-[12px] font-semibold leading-tight text-white">Book your next visit</p>
                  </div>
                  <div className="grid flex-1 grid-cols-2 gap-2">
                    {SERVICES.map((s, i) => (
                      <div
                        key={s.name}
                        className="flex flex-col gap-1 rounded-xl border border-border bg-bg p-1.5 shadow-sm"
                      >
                        <div
                          className="h-9 w-full rounded-lg"
                          style={{
                            background: `linear-gradient(135deg, ${hex}22, ${hex2}33)`,
                            outline: i === 1 ? `1.5px solid ${hex}` : 'none'
                          }}
                        />
                        <span className="text-[9.5px] font-semibold leading-tight text-ink">{s.name}</span>
                        <span className={`text-[9px] font-medium ${accentText[accent]}`}>{s.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* DETAIL */}
              {screen === 'detail' && (
                <div className="flex h-full flex-col gap-2 px-3 pb-3">
                  <div
                    className="h-20 w-full rounded-xl"
                    style={{background: `linear-gradient(135deg, ${hex}, ${hex2})`}}
                  />
                  <div>
                    <p className="text-[12px] font-semibold text-ink">Haircut &amp; Style</p>
                    <p className="text-[9.5px] text-muted">45 min · with Giulia</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    {['Wash, cut & blow-dry', 'Style consultation', 'Finish & products'].map((f) => (
                      <div key={f} className="flex items-center gap-1.5">
                        <span className={`grid h-3 w-3 place-items-center rounded-full ${accentBg[accent]}`}>
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="none">
                            <path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                        <span className="text-[9.5px] text-ink/80">{f}</span>
                      </div>
                    ))}
                  </div>
                  <div className={`mt-auto grid h-8 place-items-center rounded-xl text-[11px] font-semibold text-white ${accentBg[accent]}`}>
                    Book now · €38
                  </div>
                </div>
              )}

              {/* FORM */}
              {screen === 'form' && (
                <div className="flex h-full flex-col gap-2 px-3 pb-3">
                  <p className="text-[11px] font-semibold text-ink">Your booking</p>
                  <Field label="Name">
                    <Typewriter
                      text="Marco Bianchi"
                      active={index >= 6}
                      className="text-[10px] font-medium text-ink"
                      caret={index === 6}
                      caretClassName="d-blink ml-px inline-block h-3 w-px align-middle"
                    />
                  </Field>
                  <Field label="Guests" focused={index === 7}>
                    <span className={`text-[10px] font-medium ${index >= 7 ? 'text-ink' : 'text-muted/50'}`}>
                      {index >= 7 ? '2 people' : 'Select…'}
                    </span>
                  </Field>
                  <div>
                    <p className="mb-1 text-[8.5px] font-medium uppercase tracking-wide text-muted">Date</p>
                    <div className="grid grid-cols-3 gap-1">
                      {DATES.map((d, i) => {
                        const picked = index >= 8 && i === 1;
                        return (
                          <div
                            key={d.day}
                            className="flex flex-col items-center rounded-lg border py-1 text-center"
                            style={{
                              borderColor: picked ? hex : 'var(--border)',
                              background: picked ? `${hex}14` : 'var(--bg)'
                            }}
                          >
                            <span className="text-[8px] uppercase text-muted">{d.day}</span>
                            <span className={`text-[12px] font-semibold ${picked ? accentText[accent] : 'text-ink'}`}>
                              {d.num}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <m.div
                    animate={index === 10 ? {scale: [1, 0.95, 1]} : {scale: 1}}
                    transition={{duration: 0.3}}
                    className={`mt-auto grid h-8 place-items-center rounded-xl text-[11px] font-semibold text-white ${accentBg[accent]}`}
                  >
                    Confirm booking
                  </m.div>
                </div>
              )}

              {/* SUCCESS */}
              {screen === 'success' && (
                <div className="flex h-full flex-col items-center justify-center gap-3 px-4 text-center">
                  <m.span
                    initial={{scale: 0, rotate: -20}}
                    animate={{scale: 1, rotate: 0}}
                    transition={spring}
                    className={`grid h-14 w-14 place-items-center rounded-full text-white ${accentBg[accent]}`}
                    style={{boxShadow: `0 12px 28px -8px ${hex}88`}}
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                      <m.path
                        d="M5 13l4 4L19 7"
                        stroke="#fff"
                        strokeWidth="2.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{pathLength: 0}}
                        animate={{pathLength: 1}}
                        transition={{duration: 0.5, delay: 0.18}}
                      />
                    </svg>
                  </m.span>
                  <m.div
                    initial={{opacity: 0, y: 18}}
                    animate={{opacity: 1, y: 0}}
                    transition={{...spring, delay: 0.32}}
                    className="w-full rounded-xl border border-border bg-bg p-3 shadow-card"
                  >
                    <p className="text-[12px] font-semibold text-ink">Booked! See you Saturday</p>
                    <p className="mt-0.5 text-[9.5px] text-muted">Haircut &amp; Style · Sat 14, 10:00 · Giulia</p>
                    <div className="mt-2 flex items-center gap-1.5">
                      <span className={`h-1.5 w-1.5 rounded-full ${accentBg[accent]}`} />
                      <span className="text-[9px] font-medium text-muted">Confirmation sent to your email</span>
                    </div>
                  </m.div>
                </div>
              )}
            </div>

            {/* tab bar */}
            <div className="flex items-center justify-around border-t border-border bg-bg px-2 py-1.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-1.5 w-1.5 rounded-full"
                  style={{background: i === 0 ? hex : 'rgba(79,70,229,0.18)'}}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <Cursor x={cursor.x} y={cursor.y} clickKey={clickKey} accent={accent} />
    </Whiteboard>
  );
}

const SERVICES = [
  {name: 'Color & Care', price: '€52'},
  {name: 'Haircut & Style', price: '€38'},
  {name: 'Beard Trim', price: '€18'},
  {name: 'Treatment', price: '€44'}
];

const DATES = [
  {day: 'Fri', num: '13'},
  {day: 'Sat', num: '14'},
  {day: 'Sun', num: '15'}
];

function Field({label, focused, children}: {label: string; focused?: boolean; children: ReactNode}) {
  return (
    <div>
      <p className="mb-1 text-[8.5px] font-medium uppercase tracking-wide text-muted">{label}</p>
      <div
        className="flex h-7 items-center rounded-lg border bg-bg px-2"
        style={{borderColor: focused ? 'rgba(79,70,229,0.45)' : 'var(--border)'}}
      >
        {children}
      </div>
    </div>
  );
}
