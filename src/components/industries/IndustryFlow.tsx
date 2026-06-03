'use client';

import {Fragment, useState} from 'react';
import {LazyMotion, domAnimation, m, AnimatePresence, useReducedMotion} from 'motion/react';
import {
  Target,
  PhoneCall,
  FileText,
  Handshake,
  TrendingUp,
  Megaphone,
  Repeat,
  MousePointerClick,
  MailWarning,
  MessageCircle,
  CalendarCheck,
  ClipboardCheck,
  Star,
  Sparkles,
  type LucideIcon
} from 'lucide-react';
import type {Accent} from '@/components/demos/demoAccent';
import {cn} from '@/lib/cn';

// Icon components can't cross the server→client boundary as props, so pages pass
// icon NAMES (strings) and we resolve them here.
const ICONS: Record<string, LucideIcon> = {
  Target, PhoneCall, FileText, Handshake, TrendingUp, Megaphone, Repeat,
  MousePointerClick, MailWarning, MessageCircle, CalendarCheck, ClipboardCheck, Star, Sparkles
};

type Stage = {title: string; body: string};

// Per-accent active/hover/text classes (literal strings so Tailwind sees them).
const FLOW: Record<Accent, {active: string; hover: string; text: string}> = {
  blue: {active: 'border-blue/40 bg-blue/5', hover: 'hover:border-blue/25', text: 'text-blue'},
  indigo: {active: 'border-indigo/40 bg-indigo/5', hover: 'hover:border-indigo/25', text: 'text-indigo'},
  orange: {active: 'border-orange/40 bg-orange/5', hover: 'hover:border-orange/25', text: 'text-orange'},
  green: {active: 'border-green/40 bg-green/5', hover: 'hover:border-green/25', text: 'text-green'},
  red: {active: 'border-red/40 bg-red/5', hover: 'hover:border-red/25', text: 'text-red'},
  brand: {active: 'border-indigo/40 bg-indigo/5', hover: 'hover:border-indigo/25', text: 'text-indigo'}
};

/**
 * Interactive multi-stage flow — each step is a clickable card; the detail panel
 * below expands the active step. Horizontal + connected on desktop, vertical
 * stack on mobile. Keyboard accessible (real buttons), reduced-motion safe.
 * Shared by the industry flagship pages (icons + accent supplied per industry).
 */
export function IndustryFlow({
  stages,
  intro,
  icons,
  accent
}: {
  stages: Stage[];
  intro: string;
  icons: string[];
  accent: Accent;
}) {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const a = FLOW[accent];

  return (
    <LazyMotion features={domAnimation}>
      <p className="mb-6 text-center text-sm text-muted">{intro}</p>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-0">
        {stages.map((s, i) => {
          const Icon = ICONS[icons[i % icons.length]] ?? Sparkles;
          const isActive = active === i;
          return (
            <Fragment key={s.title}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-expanded={isActive}
                className={cn(
                  'flex flex-1 items-center gap-3 rounded-2xl border p-4 text-left transition-all duration-200 sm:flex-col sm:items-center sm:gap-2 sm:text-center',
                  isActive
                    ? cn(a.active, 'shadow-card')
                    : cn('border-border bg-bg hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-card', a.hover)
                )}
              >
                <span
                  className={cn(
                    'grid h-11 w-11 shrink-0 place-items-center rounded-xl transition-colors',
                    isActive ? 'bg-gradient-brand text-white' : cn('bg-bg-soft', a.text)
                  )}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.85} aria-hidden />
                </span>
                <span className="flex flex-col sm:items-center">
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
                    Step {i + 1}
                  </span>
                  <span className="text-sm font-semibold text-ink">{s.title}</span>
                </span>
              </button>
              {i < stages.length - 1 ? (
                <m.span
                  initial={reduce ? false : {opacity: 0, x: -8}}
                  animate={{opacity: 1, x: 0}}
                  transition={{duration: 0.4, delay: 0.2 + i * 0.12, ease: [0.22, 1, 0.36, 1]}}
                  className={cn('hidden shrink-0 items-center self-center px-1 text-lg sm:flex', a.text, 'opacity-50')}
                  aria-hidden
                >
                  →
                </m.span>
              ) : null}
            </Fragment>
          );
        })}
      </div>

      <div className="mt-5 rounded-2xl border border-border bg-bg-soft/40 p-6">
        <AnimatePresence mode="wait">
          <m.div
            key={active}
            initial={{opacity: 0, y: 8}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -8}}
            transition={{duration: 0.2}}
          >
            <span className={cn('text-[11px] font-bold uppercase tracking-[0.18em]', a.text)}>
              Step {active + 1} · {stages[active].title}
            </span>
            <p className="mt-2 text-base leading-relaxed text-muted sm:text-lg">
              {stages[active].body}
            </p>
          </m.div>
        </AnimatePresence>
      </div>
    </LazyMotion>
  );
}
