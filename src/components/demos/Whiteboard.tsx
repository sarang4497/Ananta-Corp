'use client';

import type {CSSProperties, ReactNode} from 'react';
import {LazyMotion, MotionConfig, domAnimation} from 'motion/react';
import {accentHex, type Accent} from './demoAccent';

/**
 * The shared stage every demo plays on: a clean, realistic whiteboard surface
 * that floats above the page. Faint indigo paper grid (never black), a soft
 * inner highlight + layered drop shadow for depth, a Geist Mono title top-left
 * and a tiny live pulse dot.
 *
 * Also the single LazyMotion boundary for the demo it wraps (strict → demos use
 * `m.*`, keeping each chunk tree-shaken) and the owner of the `--play` custom
 * property so ambient CSS bits pause off-screen.
 */
export function Whiteboard({
  label,
  accent,
  playing,
  children
}: {
  label: string;
  accent: Accent;
  playing: boolean;
  children: ReactNode;
}) {
  const style = {'--play': playing ? 'running' : 'paused'} as CSSProperties;

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
      <div
        style={style}
        className="relative h-full w-full overflow-hidden rounded-3xl border border-border bg-bg shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_2px_4px_rgba(24,119,242,0.04),0_28px_60px_-30px_rgba(79,70,229,0.4),0_12px_28px_-22px_rgba(24,119,242,0.28)]"
      >
        {/* paper grid */}
        <div aria-hidden className="demo-grid pointer-events-none absolute inset-0" />
        {/* inner highlight / vignette for depth */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-3xl shadow-[inset_0_0_50px_rgba(79,70,229,0.05),inset_0_1px_0_rgba(255,255,255,0.8)]"
        />
        {/* subtle top sheen */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-1/3 rounded-t-3xl bg-gradient-to-b from-white/60 to-transparent"
        />

        {/* title + live dot */}
        <div className="absolute left-3 top-3 z-30 flex items-center gap-1.5 rounded-full border border-border bg-bg/80 px-2.5 py-1 backdrop-blur-sm">
          <span className="demo-ping" style={{background: accentHex[accent]}} />
          <span className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-muted">
            {label}
          </span>
        </div>

        {children}
      </div>
      </MotionConfig>
    </LazyMotion>
  );
}
