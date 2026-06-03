'use client';

import {useRef} from 'react';
import {useAnimationFrame, useMotionValue, useReducedMotion, type MotionValue} from 'motion/react';

/**
 * A shared ~20s looping clock for the offering demos.
 *
 * Returns a `progress` MotionValue in [0, 1]. Driving visuals off this motion
 * value (via useTransform) means the demo animates WITHOUT React re-renders.
 *
 *  - advances only while `playing` is true (paused off-screen),
 *  - loops every `durationMs`,
 *  - when the user prefers reduced motion, it pins progress at 1 so each demo
 *    renders its final, settled frame (no motion).
 */
export function useDemoClock(
  playing: boolean,
  durationMs = 20000
): {progress: MotionValue<number>; reduce: boolean} {
  const reduce = useReducedMotion() ?? false;
  const progress = useMotionValue(reduce ? 1 : 0);
  const elapsed = useRef(0);

  useAnimationFrame((_t, delta) => {
    if (reduce) {
      if (progress.get() !== 1) progress.set(1);
      return;
    }
    if (!playing) return;
    elapsed.current = (elapsed.current + delta) % durationMs;
    progress.set(elapsed.current / durationMs);
  });

  return {progress, reduce};
}
