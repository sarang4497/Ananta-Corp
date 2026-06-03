'use client';

// TODO: confirm "Lubi Electronics" naming/permission before using the real client name publicly.

import {useMemo} from 'react';
import {m} from 'motion/react';
import {Whiteboard} from './Whiteboard';
import {Cursor} from './Cursor';
import {useDemoTimeline, type TimelineStep} from './useDemoTimeline';
import {accentHex} from './demoAccent';
import {CountUp, Typewriter, Avatar} from './demoPrimitives';

/* ============================================================================
   AutomatedHiring — the flagship showcase demo.

   A click-by-click, six-stage journey that loops seamlessly:
     1. Outlook-style inbox: AI plucks 3 résumé emails out of the noise
     2. Scan & analyze: PDFs fan out, scanned, fields fly off as chips
     3. Smart sheet: a table builds row-by-row with animated fit-score bars
     4. Chat with the sheet: a query types, AI replies, rows re-sort
     5. AI voice interview: orb + waveform, live transcript, live scoring
     6. Handoff: shortlist card, calendar, cursor books the interview

   Accent INDIGO -> BLUE. No black anywhere: text uses var(--ink)/var(--ink-soft)
   /var(--muted); shadows are tinted indigo/blue rgba. Transform/opacity only.
   Built entirely on the shared foundation (useDemoTimeline / Whiteboard /
   Cursor / demoPrimitives), so it inherits scroll-in play, off-screen pause and
   the reduced-motion final-frame fallback for free.
============================================================================ */

const ACCENT = 'indigo' as const;
const INDIGO = accentHex.indigo; // #4f46e5
const BLUE = accentHex.blue; // #1877f2
const GREEN = accentHex.green; // #22c55e
const ORANGE = accentHex.orange; // #f97316

const SPRING = {type: 'spring', stiffness: 210, damping: 26, mass: 0.8} as const;
const EASE = [0.22, 1, 0.36, 1] as const;

/* ----------------------------------------------------------------------------
   Timeline. Six stages, each broken into ~1.5s sub-beats that drive the inner
   choreography. The cursor mostly rests off-stage and only comes alive for the
   final "Book interview" click in stage 6.
---------------------------------------------------------------------------- */

const OFF = {x: 116, y: 116}; // cursor parked off-stage

const STEPS: TimelineStep[] = [
  // Stage 1 — inbox (3 beats)
  {duration: 1500, cursor: OFF}, // inbox settles
  {duration: 1500, cursor: OFF}, // AI assistant wakes
  {duration: 1500, cursor: OFF}, // résumés highlighted, rest dim
  // Stage 2 — scan (3 beats)
  {duration: 1500, cursor: OFF}, // cards fan out
  {duration: 1500, cursor: OFF}, // scan sweep
  {duration: 1500, cursor: OFF}, // fields fly off
  // Stage 3 — sheet (3 beats)
  {duration: 1500, cursor: OFF}, // row 1
  {duration: 1500, cursor: OFF}, // row 2
  {duration: 1500, cursor: OFF}, // row 3 + bars
  // Stage 4 — chat (3 beats)
  {duration: 1600, cursor: OFF}, // query types
  {duration: 1600, cursor: OFF}, // reply streams
  {duration: 1600, cursor: OFF}, // re-sort + top badge
  // Stage 5 — interview (3 beats)
  {duration: 1600, cursor: OFF}, // q&a 1
  {duration: 1600, cursor: OFF}, // q&a 2 + scores
  {duration: 1600, cursor: OFF}, // shortlisted stamp
  // Stage 6 — handoff (3 beats)
  {duration: 1500, cursor: {x: 50, y: 50}}, // shortlist appears
  {duration: 1600, cursor: {x: 72, y: 82}, click: true, clickDelay: 760}, // book
  {duration: 1900, cursor: {x: 72, y: 82}}, // success, hold final frame
];

/** Which stage (0-5) a given step index belongs to. */
const STAGE_OF = [0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5];
/** Sub-beat (0-2) within the active stage. */
const BEAT_OF = [0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2];

const STAGE_LABELS = [
  'Inbox triage',
  'Scan & analyze',
  'Smart sheet',
  'Chat with the sheet',
  'AI voice interview',
  'Handoff',
];

/* ----------------------------------------------------------------------------
   Fictional data.
---------------------------------------------------------------------------- */

type Candidate = {
  name: string;
  initials: string;
  from: string;
  to: string;
  role: string;
  years: number;
  skills: string;
  edu: string;
  score: number;
};

const CANDIDATES: Candidate[] = [
  {
    name: 'Emily Watson',
    initials: 'EW',
    from: INDIGO,
    to: BLUE,
    role: 'Product Manager',
    years: 8,
    skills: 'Roadmap, Stakeholders, Strategy',
    edu: 'MBA, Wharton',
    score: 94,
  },
  {
    name: 'James Carter',
    initials: 'JC',
    from: BLUE,
    to: '#22a4f2',
    role: 'Product Manager',
    years: 6,
    skills: 'Roadmap, Analytics, Agile',
    edu: 'MBA, INSEAD',
    score: 81,
  },
  {
    name: 'Sarah Mitchell',
    initials: 'SM',
    from: '#6d5bf0',
    to: INDIGO,
    role: 'Associate PM',
    years: 4,
    skills: 'Research, Backlog, A/B Tests',
    edu: 'BSc, UC Berkeley',
    score: 72,
  },
];

type MailItem = {
  initials: string;
  from: string;
  to: string;
  sender: string;
  subject: string;
  preview: string;
  time: string;
  attach?: string;
  resume?: boolean;
};

const MAIL: MailItem[] = [
  {
    initials: 'EW',
    from: INDIGO,
    to: BLUE,
    sender: 'Emily Watson',
    subject: 'Application — Product Manager',
    preview: 'Please find my résumé attached for the open role…',
    time: '09:42',
    attach: 'CV_Emily_Watson.pdf',
    resume: true,
  },
  {
    initials: 'NL',
    from: '#9aa0c0',
    to: '#c2c7df',
    sender: 'Industry Weekly',
    subject: 'Top product trends this quarter',
    preview: 'AI copilots, PLG, and usage-based pricing on the rise…',
    time: '09:21',
  },
  {
    initials: 'JC',
    from: BLUE,
    to: '#22a4f2',
    sender: 'James Carter',
    subject: 'Re: Product Manager role — candidate',
    preview: 'Sharing my CV. 6 years shipping B2B products…',
    time: '08:58',
    attach: 'CV_James_Carter.pdf',
    resume: true,
  },
  {
    initials: 'AC',
    from: '#9aa0c0',
    to: '#c2c7df',
    sender: 'Accounts',
    subject: 'Invoice #INV-20451 due Friday',
    preview: 'Your monthly subscription invoice is ready…',
    time: '08:30',
    attach: 'INV-20451.pdf',
  },
  {
    initials: 'SM',
    from: '#6d5bf0',
    to: INDIGO,
    sender: 'Sarah Mitchell',
    subject: 'Associate PM — application',
    preview: 'Hello, attaching my résumé for your review…',
    time: '08:11',
    attach: 'CV_Sarah_Mitchell.pdf',
    resume: true,
  },
  {
    initials: 'HR',
    from: '#9aa0c0',
    to: '#c2c7df',
    sender: 'People Ops',
    subject: 'Internal memo: Q3 hiring plan',
    preview: 'Headcount approvals for the new product line…',
    time: 'Yesterday',
  },
  {
    initials: 'MT',
    from: '#9aa0c0',
    to: '#c2c7df',
    sender: 'Meeting',
    subject: 'Invite: Design review — Thu 3:00 PM',
    preview: 'You have been invited to the weekly design…',
    time: 'Yesterday',
  },
  {
    initials: 'SP',
    from: '#9aa0c0',
    to: '#c2c7df',
    sender: 'Supplier',
    subject: 'Updated vendor pricing',
    preview: 'Pricing for the analytics platform has shifted…',
    time: 'Mon',
  },
];

/* ----------------------------------------------------------------------------
   Tiny shared bits.
---------------------------------------------------------------------------- */

function Tag({children}: {children: React.ReactNode}) {
  return (
    <span
      className="rounded-md px-2 py-[3px] text-[11px] font-semibold"
      style={{background: 'rgba(79,70,229,0.10)', color: INDIGO}}
    >
      {children}
    </span>
  );
}

function Paperclip({color = '#9aa0c0'}: {color?: string}) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M21 11.5l-8.5 8.5a5 5 0 0 1-7-7l8.5-8.5a3.3 3.3 0 0 1 4.7 4.7L9.2 17a1.6 1.6 0 0 1-2.3-2.3l7.3-7.3"
        stroke={color}
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Check({size = 14, color = '#fff'}: {size?: number; color?: string}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M5 12.5l4.2 4.2L19 7" stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StageProgress({stage}: {stage: number}) {
  return (
    <div className="absolute right-3 top-3 z-30 flex items-center gap-2 rounded-full border border-border bg-bg/85 px-3.5 py-2 backdrop-blur-sm">
      <span className="text-[17px] font-semibold" style={{color: INDIGO}}>
        {STAGE_LABELS[stage]}
      </span>
      <span className="font-mono text-[15px] font-medium text-muted">{stage + 1}/6</span>
    </div>
  );
}

/* ----------------------------------------------------------------------------
   STAGE 1 — Outlook-style inbox.
---------------------------------------------------------------------------- */

function InboxStage({beat}: {beat: number}) {
  const aiOn = beat >= 1;
  const triaged = beat >= 2;
  const folders = [
    {name: 'Inbox', count: 8, on: true},
    {name: 'Sent', count: 0, on: false},
    {name: 'Drafts', count: 0, on: false},
    {name: 'Archive', count: 0, on: false},
  ];

  return (
    <m.div
      key="inbox"
      className="absolute inset-0 flex flex-col"
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
      transition={{duration: 0.45, ease: EASE}}
    >
      {/* ribbon header (indigo->blue, never black) */}
      <div
        className="flex items-center justify-between px-6 py-4"
        style={{background: `linear-gradient(120deg, ${INDIGO}, ${BLUE})`}}
      >
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/20">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
              <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="#fff" strokeWidth="1.8" />
              <path d="M4 7l8 6 8-6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </span>
          <span className="text-[22px] font-semibold text-white">Mail</span>
        </div>
        <m.div
          className="flex items-center gap-2 rounded-full px-4 py-2"
          style={{background: 'rgba(255,255,255,0.18)'}}
          animate={aiOn ? {scale: [1, 1.08, 1]} : {scale: 1}}
          transition={{duration: 0.6, ease: EASE}}
        >
          <span
            className="h-3 w-3 rounded-full"
            style={{background: aiOn ? GREEN : 'rgba(255,255,255,0.55)'}}
          />
          <span className="text-[18px] font-semibold text-white">AI Assistant</span>
        </m.div>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* folder rail */}
        <div className="w-[180px] flex-none border-r border-border bg-surface px-3 py-4">
          {folders.map((f) => (
            <div
              key={f.name}
              className="mb-1.5 flex items-center justify-between rounded-lg px-3 py-2.5"
              style={f.on ? {background: 'rgba(79,70,229,0.12)'} : undefined}
            >
              <span
                className="text-[19px] font-medium"
                style={{color: f.on ? INDIGO : 'var(--color-muted)'}}
              >
                {f.name}
              </span>
              {f.count > 0 && (
                <span
                  className="rounded-full px-2 text-[16px] font-bold text-white"
                  style={{background: INDIGO}}
                >
                  {f.count}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* message list */}
        <div className="demo-fade-edge min-h-0 flex-1 overflow-hidden px-3 py-2">
          {MAIL.map((mItem, i) => {
            const dim = triaged && !mItem.resume;
            const lift = triaged && mItem.resume;
            return (
              <m.div
                key={mItem.sender + i}
                className="relative mb-1.5 flex items-start gap-3 rounded-xl px-3.5 py-3"
                animate={{
                  opacity: dim ? 0.32 : 1,
                  scale: lift ? 1.012 : 1,
                  filter: dim ? 'grayscale(0.4)' : 'grayscale(0)',
                }}
                transition={{duration: 0.5, ease: EASE}}
                style={
                  lift
                    ? {
                        background: 'rgba(79,70,229,0.07)',
                        boxShadow: '0 8px 22px -14px rgba(79,70,229,0.7)',
                      }
                    : undefined
                }
              >
                <Avatar initials={mItem.initials} from={mItem.from} to={mItem.to} size={44} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="truncate text-[20px] font-semibold text-ink">{mItem.sender}</span>
                    <span className="flex-none text-[16px] text-muted">{mItem.time}</span>
                  </div>
                  <div className="truncate text-[18px] font-medium text-ink-soft">{mItem.subject}</div>
                  <div className="truncate text-[16px] text-muted">{mItem.preview}</div>
                  {mItem.attach && (
                    <div className="mt-1.5 inline-flex items-center gap-1.5 rounded-md bg-surface-2 px-2 py-1">
                      <Paperclip color={mItem.resume ? INDIGO : '#9aa0c0'} />
                      <span className="text-[15px] font-medium" style={{color: mItem.resume ? INDIGO : 'var(--color-muted)'}}>
                        {mItem.attach}
                      </span>
                    </div>
                  )}
                </div>

                {/* glow + check on triaged résumés */}
                {lift && (
                  <m.span
                    className="absolute -right-1 -top-1 grid h-7 w-7 place-items-center rounded-full"
                    style={{background: GREEN, boxShadow: '0 0 0 3px rgba(34,197,94,0.18)'}}
                    initial={{scale: 0}}
                    animate={{scale: 1}}
                    transition={SPRING}
                  >
                    <Check size={15} />
                  </m.span>
                )}
              </m.div>
            );
          })}
        </div>
      </div>

      {aiOn && (
        <m.div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full px-5 py-2.5 text-[18px] font-semibold text-white"
          style={{background: `linear-gradient(120deg, ${INDIGO}, ${BLUE})`, boxShadow: '0 10px 26px -12px rgba(79,70,229,0.8)'}}
          initial={{opacity: 0, y: 10}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.4, ease: EASE}}
        >
          {triaged ? '3 applications found — pulling résumés' : 'Scanning inbox…'}
        </m.div>
      )}
    </m.div>
  );
}

/* ----------------------------------------------------------------------------
   STAGE 2 — Scan & analyze.
---------------------------------------------------------------------------- */

function ScanStage({beat}: {beat: number}) {
  const fanned = beat >= 0;
  const scanning = beat >= 1;
  const extracted = beat >= 2;

  const chips = ['Name', 'Years exp', 'Skills', 'Education'];

  return (
    <m.div
      key="scan"
      className="absolute inset-0 flex flex-col items-center justify-center px-6 pt-12"
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
      transition={{duration: 0.45, ease: EASE}}
    >
      <div className="mb-8 text-center text-[24px] font-semibold text-ink-soft">
        Reading 3 résumés
      </div>

      <div className="relative flex items-center justify-center" style={{height: 320}}>
        {CANDIDATES.map((c, i) => {
          const offset = (i - 1) * 220;
          const rot = (i - 1) * 7;
          return (
            <m.div
              key={c.name}
              className="absolute w-[240px] overflow-hidden rounded-2xl border border-border bg-white"
              style={{boxShadow: '0 22px 50px -24px rgba(79,70,229,0.6)'}}
              initial={{x: 0, rotate: 0, opacity: 0}}
              animate={{x: fanned ? offset : 0, rotate: fanned ? rot : 0, opacity: 1}}
              transition={{...SPRING, delay: i * 0.08}}
            >
              {/* doc header */}
              <div className="flex items-center gap-2.5 px-4 py-3" style={{background: 'rgba(79,70,229,0.06)'}}>
                <Avatar initials={c.initials} from={c.from} to={c.to} size={38} />
                <span className="truncate text-[19px] font-semibold text-ink">{c.name}</span>
              </div>
              {/* faux résumé lines */}
              <div className="relative px-4 py-5">
                {[80, 64, 72, 50, 68].map((w, j) => (
                  <div
                    key={j}
                    className="mb-3 h-3 rounded-full"
                    style={{width: `${w}%`, background: 'rgba(79,70,229,0.14)'}}
                  />
                ))}
                {/* scanning sweep */}
                {scanning && (
                  <m.div
                    className="absolute inset-x-0 h-14"
                    style={{
                      background: `linear-gradient(180deg, transparent, ${INDIGO}33, transparent)`,
                      borderTop: `2px solid ${BLUE}`,
                    }}
                    initial={{top: 0}}
                    animate={{top: ['0%', '100%', '0%']}}
                    transition={{duration: 1.4, ease: 'easeInOut', repeat: Infinity, delay: i * 0.12}}
                  />
                )}
              </div>
            </m.div>
          );
        })}
      </div>

      {/* extracted field chips fly out */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        {chips.map((label, i) => (
          <m.div
            key={label}
            className="flex items-center gap-2 rounded-full border border-border bg-white px-5 py-2.5"
            style={{boxShadow: '0 8px 20px -14px rgba(24,119,242,0.7)'}}
            initial={{opacity: 0, y: 14, scale: 0.9}}
            animate={extracted ? {opacity: 1, y: 0, scale: 1} : {opacity: 0, y: 14, scale: 0.9}}
            transition={{...SPRING, delay: extracted ? i * 0.1 : 0}}
          >
            <span className="h-2.5 w-2.5 rounded-full" style={{background: i % 2 ? BLUE : INDIGO}} />
            <span className="text-[19px] font-semibold text-ink-soft">{label}</span>
          </m.div>
        ))}
      </div>
    </m.div>
  );
}

/* ----------------------------------------------------------------------------
   STAGE 3 — Smart sheet.
---------------------------------------------------------------------------- */

const COLS = ['Candidate', 'Role', 'Experience', 'Key Skills', 'Education', 'Fit Score'];

function scoreColor(s: number) {
  return s >= 85 ? GREEN : s >= 78 ? BLUE : ORANGE;
}

function SheetRow({c, active}: {c: Candidate; active: boolean}) {
  return (
    <m.tr
      initial={{opacity: 0, y: 12}}
      animate={active ? {opacity: 1, y: 0} : {opacity: 0, y: 12}}
      transition={{...SPRING}}
      style={{borderTop: '1px solid var(--color-border)'}}
    >
      <td className="px-4 py-5">
        <div className="flex items-center gap-3">
          <Avatar initials={c.initials} from={c.from} to={c.to} size={40} />
          <span className="text-[20px] font-semibold text-ink">{c.name}</span>
        </div>
      </td>
      <td className="px-4 py-5 text-[18px] text-ink-soft">{c.role}</td>
      <td className="px-4 py-5 text-[18px] font-semibold text-ink-soft">
        <CountUp to={c.years} active={active} durationMs={900} format={(v) => `${Math.round(v)} yrs`} />
      </td>
      <td className="px-4 py-5 text-[18px] text-ink-soft">{c.skills}</td>
      <td className="px-4 py-5 text-[17px] text-muted">{c.edu}</td>
      <td className="px-4 py-5">
        <div className="flex items-center gap-3">
          <div className="h-3 w-32 overflow-hidden rounded-full bg-surface-2">
            <m.div
              className="h-full rounded-full"
              style={{background: scoreColor(c.score)}}
              initial={{width: 0}}
              animate={{width: active ? `${c.score}%` : 0}}
              transition={{duration: 0.9, ease: EASE}}
            />
          </div>
          <CountUp
            to={c.score}
            active={active}
            durationMs={900}
            className="text-[20px] font-bold"
            format={(v) => `${Math.round(v)}`}
          />
        </div>
      </td>
    </m.tr>
  );
}

function SheetStage({beat}: {beat: number}) {
  // beat 0 -> 1 row, beat 1 -> 2 rows, beat 2 -> 3 rows
  const rowsShown = beat + 1;
  return (
    <m.div
      key="sheet"
      className="absolute inset-0 flex flex-col px-5 pt-16 pb-6"
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
      transition={{duration: 0.45, ease: EASE}}
    >
      <div className="mb-4 text-[24px] font-semibold text-ink-soft">Candidate sheet</div>
      <div className="flex flex-1 items-center">
        <div className="w-full overflow-hidden rounded-2xl border border-border bg-white" style={{boxShadow: '0 20px 44px -26px rgba(79,70,229,0.5)'}}>
          <table className="w-full border-collapse text-left">
            <thead>
              <tr style={{background: 'rgba(79,70,229,0.06)'}}>
                {COLS.map((c) => (
                  <th key={c} className="px-4 py-4 text-[16px] font-bold uppercase tracking-wide" style={{color: INDIGO}}>
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CANDIDATES.map((c, i) => (
                <SheetRow key={c.name} c={c} active={i < rowsShown} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </m.div>
  );
}

/* ----------------------------------------------------------------------------
   STAGE 4 — Chat with the sheet.
---------------------------------------------------------------------------- */

function ChatStage({beat}: {beat: number}) {
  const typing = beat >= 0;
  const replying = beat >= 1;
  const sorted = beat >= 2;

  // re-sorted order: top match first; others fade
  const order = sorted ? CANDIDATES : CANDIDATES;

  return (
    <m.div
      key="chat"
      className="absolute inset-0 px-5 pt-16 pb-5"
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
      transition={{duration: 0.45, ease: EASE}}
    >
      {/* mini sheet (re-sorting) — fills the stage, vertically centered */}
      <div className="flex h-full flex-col justify-center gap-3">
        {order.map((c, i) => {
          const top = sorted && i === 0;
          const faded = sorted && i !== 0;
          return (
            <m.div
              key={c.name}
              layout
              className="relative flex items-center gap-3.5 rounded-xl border border-border bg-white px-4 py-4"
              animate={{
                opacity: faded ? 0.4 : 1,
                scale: top ? 1.02 : 1,
              }}
              transition={SPRING}
              style={top ? {boxShadow: '0 14px 30px -16px rgba(34,197,94,0.8)', borderColor: 'rgba(34,197,94,0.5)'} : undefined}
            >
              <Avatar initials={c.initials} from={c.from} to={c.to} size={40} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[20px] font-semibold text-ink">{c.name}</div>
                <div className="truncate text-[17px] text-muted">{c.skills}</div>
              </div>
              <span className="text-[21px] font-bold" style={{color: scoreColor(c.score)}}>
                {c.score}
              </span>
              {top && (
                <m.span
                  className="absolute -right-1 -top-3 rounded-full px-3 py-1 text-[16px] font-bold text-white"
                  style={{background: GREEN, boxShadow: '0 0 0 3px rgba(34,197,94,0.16)'}}
                  initial={{scale: 0, opacity: 0}}
                  animate={{scale: 1, opacity: 1}}
                  transition={SPRING}
                >
                  Top match — 94%
                </m.span>
              )}
            </m.div>
          );
        })}
      </div>

      {/* chat box — centered in the demo (both axes), larger text */}
      <div
        className="absolute left-1/2 top-1/2 w-[82%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-border bg-surface"
        style={{boxShadow: '0 26px 56px -20px rgba(79,70,229,0.6)'}}
      >
        <div className="flex items-center gap-2.5 border-b border-border px-5 py-4">
          <span className="grid h-11 w-11 place-items-center rounded-lg" style={{background: `linear-gradient(120deg, ${INDIGO}, ${BLUE})`}}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M12 3l2.2 5.3L20 9l-4.5 3.6L17 19l-5-3.2L7 19l1.5-6.4L4 9l5.8-.7z" fill="#fff" />
            </svg>
          </span>
          <span className="text-[22px] font-semibold text-ink-soft">Ask the sheet</span>
        </div>

        <div className="flex flex-col gap-4 p-5">
          {/* user query */}
          <div className="self-end rounded-2xl rounded-br-md px-5 py-3.5 text-[26px] font-medium leading-snug text-white" style={{background: INDIGO, maxWidth: '92%'}}>
            <Typewriter
              text="Who's the best fit for the Product Manager role?"
              active={typing}
              speed={26}
            />
          </div>
          {/* AI reply */}
          {replying && (
            <m.div
              className="self-start rounded-2xl rounded-bl-md border border-border bg-white px-5 py-3.5 text-[23px] leading-snug text-ink-soft"
              style={{maxWidth: '94%'}}
              initial={{opacity: 0, y: 8}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.35, ease: EASE}}
            >
              <Typewriter
                text="Emily Watson — 8 yrs leading product roadmaps and stakeholders, the strongest match at 94%. Sorting her to the top."
                active={replying}
                speed={20}
              />
            </m.div>
          )}
        </div>
      </div>
    </m.div>
  );
}

/* ----------------------------------------------------------------------------
   STAGE 5 — AI voice interview.
---------------------------------------------------------------------------- */

function Waveform({active}: {active: boolean}) {
  return (
    <svg width="220" height="64" viewBox="0 0 160 48" fill="none" aria-hidden className="max-w-full">
      <m.path
        d="M2 24 Q12 6 22 24 T42 24 T62 24 T82 24 T102 24 T122 24 T142 24 T158 24"
        stroke={BLUE}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeDasharray="320"
        initial={{strokeDashoffset: 320}}
        animate={active ? {strokeDashoffset: [320, 0, 320]} : {strokeDashoffset: 320}}
        transition={{duration: 2.2, ease: 'easeInOut', repeat: Infinity}}
      />
    </svg>
  );
}

const QA = [
  {q: 'How do you prioritize a roadmap when every team wants their feature first?', a: 'I weigh impact against effort, tie each item to a goal metric, then sequence ruthlessly.'},
  {q: 'Tell me about aligning engineering and design on a hard trade-off.', a: 'Shared goal, options framed with data, and one clear decision owner.'},
];

const SCORES = [
  {label: 'Communication', value: 90},
  {label: 'Product Sense', value: 95},
  {label: 'Culture', value: 88},
];

function InterviewStage({beat}: {beat: number}) {
  const showQ1 = beat >= 0;
  const showQ2 = beat >= 1;
  const shortlisted = beat >= 2;
  const c = CANDIDATES[0];

  return (
    <m.div
      key="interview"
      className="absolute inset-0 flex gap-5 px-5 pt-16 pb-5"
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
      transition={{duration: 0.45, ease: EASE}}
    >
      {/* left: candidate + orb */}
      <div className="flex w-[38%] flex-none flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-surface px-5 py-6" style={{boxShadow: '0 18px 40px -24px rgba(79,70,229,0.5)'}}>
        <Avatar initials={c.initials} from={c.from} to={c.to} size={72} />
        <div className="text-center">
          <div className="text-[21px] font-semibold text-ink">{c.name}</div>
          <div className="text-[17px] text-muted">{c.role}</div>
        </div>

        <m.div
          className="mt-1 grid h-24 w-24 place-items-center rounded-full"
          style={{background: `linear-gradient(135deg, ${INDIGO}, ${BLUE})`, boxShadow: '0 0 0 8px rgba(79,70,229,0.12)'}}
          animate={{scale: [1, 1.08, 1]}}
          transition={{duration: 1.6, ease: 'easeInOut', repeat: Infinity}}
        >
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden>
            <rect x="9" y="3" width="6" height="11" rx="3" stroke="#fff" strokeWidth="1.8" />
            <path d="M5 11a7 7 0 0 0 14 0M12 18v3" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </m.div>
        <Waveform active />
        <div className="text-[16px] font-medium text-muted">AI interviewer</div>
      </div>

      {/* right: transcript + scores */}
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <div className="demo-fade-edge flex-1 space-y-4 overflow-hidden rounded-2xl border border-border bg-white p-5" style={{boxShadow: '0 18px 40px -26px rgba(24,119,242,0.5)'}}>
          {[QA[0], showQ2 ? QA[1] : null].filter(Boolean).map((qa, i) => (
            <div key={i} className="space-y-2">
              <div className="rounded-xl rounded-tl-sm px-4 py-2.5 text-[18px] font-medium" style={{background: 'rgba(79,70,229,0.08)', color: INDIGO}}>
                <Typewriter text={qa!.q} active={i === 0 ? showQ1 : showQ2} speed={16} />
              </div>
              <div className="rounded-xl rounded-tl-sm px-4 py-2.5 text-[18px] text-ink-soft">
                <Typewriter text={qa!.a} active={i === 0 ? showQ1 : showQ2} speed={14} startDelay={500} />
              </div>
            </div>
          ))}
        </div>

        {/* live scoring */}
        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="mb-3 text-[16px] font-bold uppercase tracking-wide" style={{color: INDIGO}}>Live scoring</div>
          <div className="space-y-3">
            {SCORES.map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <span className="w-[150px] flex-none text-[18px] text-ink-soft">{s.label}</span>
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-surface-2">
                  <m.div
                    className="h-full rounded-full"
                    style={{background: `linear-gradient(90deg, ${INDIGO}, ${BLUE})`}}
                    initial={{width: 0}}
                    animate={{width: `${s.value}%`}}
                    transition={{duration: 1, ease: EASE}}
                  />
                </div>
                <CountUp to={s.value} active durationMs={1000} className="w-10 flex-none text-right text-[18px] font-bold text-ink" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* shortlisted stamp */}
      {shortlisted && (
        <m.div
          className="absolute left-1/2 top-1/2 flex items-center gap-2.5 rounded-xl px-6 py-3.5 text-[23px] font-bold text-white"
          style={{background: GREEN, boxShadow: '0 18px 40px -16px rgba(34,197,94,0.9)'}}
          initial={{opacity: 0, scale: 0.6, x: '-50%', y: '-50%', rotate: -8}}
          animate={{opacity: 1, scale: 1, x: '-50%', y: '-50%', rotate: -8}}
          transition={SPRING}
        >
          <Check size={24} />
          Auto-shortlisted
        </m.div>
      )}
    </m.div>
  );
}

/* ----------------------------------------------------------------------------
   STAGE 6 — Handoff.
---------------------------------------------------------------------------- */

const CAL_DAYS = ['M', 'T', 'W', 'T', 'F'];

function HandoffStage({beat}: {beat: number}) {
  const booked = beat >= 2;
  const top2 = CANDIDATES.slice(0, 2);

  return (
    <m.div
      key="handoff"
      className="absolute inset-0 flex flex-col px-5 pt-16 pb-6"
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
      transition={{duration: 0.45, ease: EASE}}
    >
      <div className="mb-4 text-[24px] font-semibold text-ink-soft">Hiring manager · Shortlist</div>

      <div className="flex flex-1 gap-5">
        {/* shortlist card */}
        <div className="flex w-[52%] flex-col justify-center gap-4 rounded-2xl border border-border bg-white p-5" style={{boxShadow: '0 20px 44px -26px rgba(79,70,229,0.5)'}}>
          {top2.map((c, i) => (
            <m.div
              key={c.name}
              className="flex items-center gap-3.5 rounded-xl px-4 py-4"
              style={{background: i === 0 ? 'rgba(34,197,94,0.08)' : 'rgba(79,70,229,0.05)'}}
              initial={{opacity: 0, x: -14}}
              animate={{opacity: 1, x: 0}}
              transition={{...SPRING, delay: i * 0.12}}
            >
              <Avatar initials={c.initials} from={c.from} to={c.to} size={50} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[21px] font-semibold text-ink">{c.name}</div>
                <div className="truncate text-[17px] text-muted">{c.role}</div>
              </div>
              <span className="text-[24px] font-bold" style={{color: scoreColor(c.score)}}>{c.score}</span>
            </m.div>
          ))}
        </div>

        {/* calendar + book */}
        <div className="flex w-[48%] flex-col rounded-2xl border border-border bg-surface p-5" style={{boxShadow: '0 20px 44px -26px rgba(24,119,242,0.45)'}}>
          <div className="mb-3 text-[16px] font-bold uppercase tracking-wide" style={{color: INDIGO}}>Suggested time</div>
          <div className="mb-3 grid grid-cols-5 gap-2">
            {CAL_DAYS.map((d, i) => (
              <div
                key={i}
                className="grid place-items-center rounded-lg py-3 text-[18px] font-semibold"
                style={
                  i === 3
                    ? {background: `linear-gradient(120deg, ${INDIGO}, ${BLUE})`, color: '#fff'}
                    : {background: 'var(--color-surface-2)', color: 'var(--color-ink-soft)'}
                }
              >
                {d}
              </div>
            ))}
          </div>
          <div className="mb-4 text-[18px] font-medium text-ink-soft">Thu · 3:00 PM — Final interview</div>

          <m.button
            className="mt-auto flex items-center justify-center gap-2.5 rounded-xl px-4 py-4 text-[20px] font-bold text-white"
            style={{
              background: booked ? GREEN : `linear-gradient(120deg, ${INDIGO}, ${BLUE})`,
              boxShadow: booked ? '0 14px 30px -14px rgba(34,197,94,0.9)' : '0 14px 30px -14px rgba(79,70,229,0.9)',
            }}
            animate={{scale: booked ? [1, 1.04, 1] : 1}}
            transition={{duration: 0.5, ease: EASE}}
          >
            {booked ? (
              <>
                <Check size={22} />
                Interview booked
              </>
            ) : (
              'Book final interview'
            )}
          </m.button>
        </div>
      </div>

      {/* final line */}
      <m.div
        className="mt-5 text-center text-[26px] font-bold"
        style={{
          backgroundImage: `linear-gradient(120deg, ${INDIGO}, ${BLUE})`,
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
        }}
        initial={{opacity: 0, y: 10}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.5, ease: EASE, delay: 0.15}}
      >
        From 200 applicants to 2 interviews — AI-assisted.
      </m.div>
    </m.div>
  );
}

/* ----------------------------------------------------------------------------
   Root.
---------------------------------------------------------------------------- */

export default function AutomatedHiringDemo({playing}: {playing: boolean}) {
  const {index, cursor, clickKey, reduce} = useDemoTimeline(STEPS, playing);

  const stage = STAGE_OF[index] ?? 0;
  const beat = BEAT_OF[index] ?? 0;

  // For reduced motion / final-frame fallback, the timeline pins to the last
  // step → stage 6 booked. Force fully-revealed beats so each stage settles.
  const settledBeat = reduce ? 2 : beat;

  const stageView = useMemo(() => {
    switch (stage) {
      case 0:
        return <InboxStage beat={settledBeat} />;
      case 1:
        return <ScanStage beat={settledBeat} />;
      case 2:
        return <SheetStage beat={settledBeat} />;
      case 3:
        return <ChatStage beat={settledBeat} />;
      case 4:
        return <InterviewStage beat={settledBeat} />;
      default:
        return <HandoffStage beat={settledBeat} />;
    }
  }, [stage, settledBeat]);

  return (
    <Whiteboard label="AI-Assisted hiring" accent={ACCENT} playing={playing}>
      <StageProgress stage={stage} />
      <div className="absolute inset-0">{stageView}</div>
      <Cursor x={cursor.x} y={cursor.y} clickKey={clickKey} accent={ACCENT} hidden={stage !== 5} />
    </Whiteboard>
  );
}
