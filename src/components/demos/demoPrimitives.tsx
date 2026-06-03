'use client';

import {useEffect, useRef} from 'react';
import {useReducedMotion} from 'motion/react';
import {accentHex, type Accent} from './demoAccent';

/* ----------------------------------------------------------------------------
   Small building blocks shared across demos. The count-up / typewriter write
   straight to the DOM node via rAF (no per-frame React re-render), and snap to
   the final value when reduced motion is set or when their `active` flag is off.
---------------------------------------------------------------------------- */

const easeOutCubic = (p: number) => 1 - Math.pow(1 - p, 3);

/** Animated number that counts from `from` to `to` whenever `active` is true. */
export function CountUp({
  to,
  from = 0,
  active,
  durationMs = 1200,
  format,
  className
}: {
  to: number;
  from?: number;
  active: boolean;
  durationMs?: number;
  format?: (v: number) => string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion() ?? false;
  const fmt = (v: number) => (format ? format(v) : String(Math.round(v)));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!active) {
      el.textContent = fmt(from);
      return;
    }
    if (reduce) {
      el.textContent = fmt(to);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / durationMs);
      el.textContent = fmt(from + (to - from) * easeOutCubic(p));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, to, from, durationMs, reduce]);

  return (
    <span ref={ref} className={className}>
      {fmt(from)}
    </span>
  );
}

/** Types `text` out character-by-character whenever `active` is true. */
export function Typewriter({
  text,
  active,
  speed = 34,
  startDelay = 0,
  className,
  caret = false,
  caretClassName
}: {
  text: string;
  active: boolean;
  speed?: number;
  startDelay?: number;
  className?: string;
  caret?: boolean;
  caretClassName?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion() ?? false;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!active) {
      el.textContent = '';
      return;
    }
    if (reduce) {
      el.textContent = text;
      return;
    }
    let raf = 0;
    const start = performance.now() + startDelay;
    const tick = (now: number) => {
      const e = Math.max(0, now - start);
      const n = Math.min(text.length, Math.floor(e / speed));
      el.textContent = text.slice(0, n);
      if (n < text.length) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, text, reduce, speed, startDelay]);

  return (
    <span className={className}>
      <span ref={ref} />
      {caret && active && (
        <span className={caretClassName ?? 'd-blink ml-px inline-block h-[1em] w-px align-middle bg-current'} />
      )}
    </span>
  );
}

/** A five-star row; `filled` stars use the accent, the rest are faint. */
export function Stars({
  filled = 5,
  size = 12,
  accent,
  className
}: {
  filled?: number;
  size?: number;
  accent: Accent;
  className?: string;
}) {
  return (
    <span className={className} style={{display: 'inline-flex', gap: 1}} aria-hidden>
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24">
          <path
            d="M12 2.5l2.9 5.9 6.5.95-4.7 4.58 1.1 6.47L12 17.4l-5.8 3.05 1.1-6.47-4.7-4.58 6.5-.95z"
            fill={i < filled ? accentHex[accent] : 'rgba(79,70,229,0.14)'}
          />
        </svg>
      ))}
    </span>
  );
}

/** A gradient avatar bubble with initials. */
export function Avatar({
  initials,
  from,
  to,
  size = 26,
  className
}: {
  initials: string;
  from: string;
  to: string;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={className}
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${from}, ${to})`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 9999,
        color: '#fff',
        fontSize: size * 0.4,
        fontWeight: 600,
        letterSpacing: '0.02em',
        flex: 'none'
      }}
    >
      {initials}
    </span>
  );
}
