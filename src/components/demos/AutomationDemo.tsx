'use client';

import {m} from 'motion/react';
import {Whiteboard} from './Whiteboard';
import {Cursor} from './Cursor';
import {CountUp} from './demoPrimitives';
import {useDemoTimeline, type TimelineStep} from './useDemoTimeline';
import {accentBg, accentHex, accentText, type Accent} from './demoAccent';

/**
 * Demo 3 — Workflow Automation (orange).
 * A flow-builder canvas. An incoming email triggers the run; the cursor wires
 * Parse → CRM → Auto-reply → Schedule with animated connectors, each node lights
 * up and checks off in sequence, and an "hours saved" counter climbs.
 */

type NodeDef = {key: string; label: string; icon: IconName; x: number; y: number};

const EMAIL = {x: 13, y: 50};
const NODES: NodeDef[] = [
  {key: 'parse', label: 'Parse', icon: 'parse', x: 38, y: 27},
  {key: 'crm', label: 'CRM', icon: 'users', x: 61, y: 27},
  {key: 'reply', label: 'Auto-reply', icon: 'reply', x: 61, y: 73},
  {key: 'sched', label: 'Schedule', icon: 'calendar', x: 84, y: 50}
];

// Connector endpoints (email→parse, parse→crm, crm→reply, reply→sched).
const LINKS = [EMAIL, ...NODES.map((n) => ({x: n.x, y: n.y}))];

const STEPS: TimelineStep[] = [
  {duration: 1800, cursor: {x: EMAIL.x, y: EMAIL.y}}, // 0 email arrives
  {duration: 1300, cursor: NODES[0], click: true}, // 1 wire → parse
  {duration: 1300, cursor: NODES[1], click: true}, // 2 wire → crm
  {duration: 1300, cursor: NODES[2], click: true}, // 3 wire → reply
  {duration: 1300, cursor: NODES[3], click: true}, // 4 wire → schedule
  {duration: 1200, cursor: NODES[0]}, // 5 process parse
  {duration: 1200, cursor: NODES[1]}, // 6 process crm
  {duration: 1200, cursor: NODES[2]}, // 7 process reply
  {duration: 1200, cursor: NODES[3]}, // 8 process schedule
  {duration: 2100, cursor: {x: 84, y: 88}}, // 9 hours saved climbs
  {duration: 2600, cursor: {x: 60, y: 55}} // 10 hold
];

export default function AutomationDemo({playing, accent}: {playing: boolean; accent: Accent}) {
  const {index, cursor, clickKey} = useDemoTimeline(STEPS, playing);
  const hex = accentHex[accent];

  const nodeState = (k: number): 'idle' | 'active' | 'done' =>
    index >= 6 + k ? 'done' : index === 5 + k ? 'active' : 'idle';
  const counterActive = index >= 9;

  return (
    <Whiteboard label="flow_builder" accent={accent} playing={playing}>
      {/* connectors */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        {LINKS.slice(0, -1).map((a, i) => {
          const b = LINKS[i + 1];
          const dx = (b.x - a.x) * 0.5;
          const d = `M${a.x} ${a.y} C${a.x + dx} ${a.y}, ${b.x - dx} ${b.y}, ${b.x} ${b.y}`;
          const active = index >= 1 + i;
          return (
            <g key={i}>
              <path d={d} fill="none" stroke="rgba(79,70,229,0.1)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
              <m.path
                d={d}
                fill="none"
                stroke={hex}
                strokeWidth="1.6"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                initial={{pathLength: 0}}
                animate={{pathLength: active ? 1 : 0}}
                transition={{duration: 0.6, ease: 'easeInOut'}}
              />
            </g>
          );
        })}
      </svg>

      {/* incoming email card */}
      <m.div
        className="absolute z-10 w-[20%] min-w-[92px] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-bg p-2 shadow-card"
        style={{left: `${EMAIL.x}%`, top: `${EMAIL.y}%`}}
        initial={{opacity: 0, x: '-70%', scale: 0.9}}
        animate={{opacity: 1, x: '-50%', scale: 1}}
        transition={{type: 'spring', stiffness: 200, damping: 20}}
      >
        <div className="flex items-center gap-1.5">
          <span className={`grid h-5 w-5 place-items-center rounded-md ${accentBg[accent]}`}>
            <Icon name="mail" color="#fff" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-[8px] font-semibold leading-tight text-ink">New enquiry</p>
            <p className="truncate text-[7px] text-muted">laura@acme.it</p>
          </div>
        </div>
        <div className="mt-1.5 space-y-1">
          <span className="block h-1 w-full rounded-full bg-border" />
          <span className="block h-1 w-3/4 rounded-full bg-border" />
        </div>
        <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-bg-soft px-1.5 py-0.5 text-[6.5px] font-medium text-muted">
          <span className="h-1 w-1 rounded-full" style={{background: hex}} /> trigger
        </span>
      </m.div>

      {/* nodes */}
      {NODES.map((n, k) => {
        const st = nodeState(k);
        return (
          <div
            key={n.key}
            className="absolute z-10 w-[18%] min-w-[80px] -translate-x-1/2 -translate-y-1/2"
            style={{left: `${n.x}%`, top: `${n.y}%`}}
          >
            <m.div
              className="relative flex items-center gap-1.5 overflow-hidden rounded-xl border bg-bg px-2 py-1.5 shadow-card"
              animate={{
                borderColor: st === 'idle' ? 'rgba(79,70,229,0.12)' : hex,
                boxShadow: st === 'active' ? `0 0 0 3px ${hex}22, 0 8px 18px -10px ${hex}88` : '0 1px 2px rgba(24,119,242,0.06)'
              }}
              transition={{duration: 0.3}}
            >
              <span
                className="grid h-5 w-5 flex-none place-items-center rounded-md"
                style={{background: st === 'idle' ? 'rgba(79,70,229,0.08)' : hex}}
              >
                <Icon name={n.icon} color={st === 'idle' ? 'rgba(91,99,133,0.7)' : '#fff'} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[8.5px] font-semibold leading-tight text-ink">{n.label}</p>
                <p className="truncate text-[6.5px] text-muted">
                  {st === 'done' ? 'completed' : st === 'active' ? 'running…' : 'ready'}
                </p>
              </div>
              {/* status */}
              <span className="flex-none">
                {st === 'done' ? (
                  <m.span
                    initial={{scale: 0}}
                    animate={{scale: 1}}
                    transition={{type: 'spring', stiffness: 320, damping: 16}}
                    className="grid h-3.5 w-3.5 place-items-center rounded-full"
                    style={{background: hex}}
                  >
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none">
                      <path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </m.span>
                ) : st === 'active' ? (
                  <m.span
                    className="block h-3 w-3 rounded-full border-2"
                    style={{borderColor: `${hex}40`, borderTopColor: hex}}
                    animate={{rotate: 360}}
                    transition={{repeat: Infinity, duration: 0.8, ease: 'linear'}}
                  />
                ) : (
                  <span className="block h-1.5 w-1.5 rounded-full" style={{background: 'rgba(91,99,133,0.3)'}} />
                )}
              </span>
              {st === 'active' && <span className="demo-sheen absolute inset-0" />}
            </m.div>
          </div>
        );
      })}

      {/* hours-saved counter */}
      <div className="absolute bottom-3 right-3 z-10 rounded-xl border border-border bg-bg px-2.5 py-1.5 shadow-card">
        <p className="text-[7px] font-medium uppercase tracking-wide text-muted">Hours saved / week</p>
        <div className="flex items-end gap-1">
          <p className={`text-[18px] font-bold leading-none ${accentText[accent]}`}>
            <CountUp to={37} active={counterActive} durationMs={1300} />
          </p>
          <span className="mb-0.5 text-[8px] font-semibold text-muted">hrs</span>
        </div>
        {/* celebratory burst */}
        {counterActive &&
          [0, 1, 2, 3, 4, 5].map((i) => (
            <m.span
              key={`${index}-${i}`}
              className="absolute left-3 top-2 h-1 w-1 rounded-full"
              style={{background: hex}}
              initial={{opacity: 1, x: 0, y: 0, scale: 1}}
              animate={{
                opacity: 0,
                x: Math.cos((i / 6) * Math.PI * 2) * 22,
                y: Math.sin((i / 6) * Math.PI * 2) * 22 - 4,
                scale: 0
              }}
              transition={{duration: 0.7, ease: 'easeOut'}}
            />
          ))}
      </div>

      <Cursor x={cursor.x} y={cursor.y} clickKey={clickKey} accent={accent} />
    </Whiteboard>
  );
}

type IconName = 'mail' | 'parse' | 'users' | 'reply' | 'calendar';
function Icon({name, color}: {name: IconName; color: string}) {
  const p: Record<IconName, string> = {
    mail: 'M3 6h18v12H3zM3 7l9 6 9-6',
    parse: 'M8 6L3 12l5 6M16 6l5 6-5 6M13 4l-2 16',
    users: 'M16 19a4 4 0 0 0-8 0M12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6',
    reply: 'M9 7L4 12l5 5M4 12h9a7 7 0 0 1 7 7',
    calendar: 'M4 6h16v15H4zM4 10h16M8 3v4M16 3v4'
  };
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <path d={p[name]} stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
