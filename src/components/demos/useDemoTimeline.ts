'use client';

import {useMemo, useRef, useState} from 'react';
import {useAnimationFrame, useReducedMotion} from 'motion/react';

/**
 * Scripted timeline engine for the offering demos.
 *
 * Each demo declares its journey as plain data — a list of steps, each with a
 * duration, an optional cursor target (in % of the whiteboard stage, filled
 * forward), and an optional click. The hook runs the sequence on a single rAF
 * clock, advancing a `index` only when a step boundary is crossed (so demos
 * re-render a handful of times across the ~20s loop, not every frame), loops
 * seamlessly, and:
 *
 *  - advances only while `playing` is true (paused off-screen by OfferingDemo),
 *  - fires `clickKey` partway into a click step (after the cursor has had time
 *    to spring onto the target) so the ripple lands on the button,
 *  - when the user prefers reduced motion, pins to the final step so each demo
 *    renders its settled, finished frame with no motion.
 */

export type Vec = {x: number; y: number};

export type TimelineStep = {
  /** Duration of this step, in ms. */
  duration: number;
  /** Cursor target in % of the stage (0–100). Carried forward if omitted. */
  cursor?: Vec;
  /** Fire a click (ripple + press) partway through this step. */
  click?: boolean;
  /** ms into the step before the click fires (default 440). */
  clickDelay?: number;
};

export type Timeline = {
  /** Active step index. */
  index: number;
  /** Resolved cursor target for the active step. */
  cursor: Vec;
  /** Increments on every click — drive the <Cursor> ripple off this. */
  clickKey: number;
  /** True when prefers-reduced-motion: render the static final frame. */
  reduce: boolean;
};

export function useDemoTimeline(steps: TimelineStep[], playing: boolean): Timeline {
  const reduce = useReducedMotion() ?? false;

  // Resolve fill-forward cursor targets + cumulative offsets once.
  const {resolved, offsets, total} = useMemo(() => {
    const resolved: Vec[] = [];
    const offsets: number[] = [];
    let last: Vec = steps[0]?.cursor ?? {x: 50, y: 50};
    let acc = 0;
    for (const s of steps) {
      if (s.cursor) last = s.cursor;
      resolved.push(last);
      offsets.push(acc);
      acc += s.duration;
    }
    return {resolved, offsets, total: acc || 1};
  }, [steps]);

  const lastIdx = Math.max(0, steps.length - 1);
  const [index, setIndex] = useState(reduce ? lastIdx : 0);
  const [clickKey, setClickKey] = useState(0);

  const t = useRef(0);
  const idxRef = useRef(index);
  const firedRef = useRef(false);

  useAnimationFrame((_now, delta) => {
    if (reduce || !playing) return;
    t.current = (t.current + delta) % total;

    let idx = 0;
    for (let i = 0; i < steps.length; i++) {
      if (t.current >= offsets[i]) idx = i;
      else break;
    }

    if (idx !== idxRef.current) {
      idxRef.current = idx;
      firedRef.current = false;
      setIndex(idx);
    }

    const step = steps[idx];
    if (step?.click && !firedRef.current) {
      if (t.current - offsets[idx] >= (step.clickDelay ?? 440)) {
        firedRef.current = true;
        setClickKey((k) => k + 1);
      }
    }
  });

  return {
    index: reduce ? lastIdx : index,
    cursor: reduce ? resolved[lastIdx] : resolved[index],
    clickKey,
    reduce
  };
}
