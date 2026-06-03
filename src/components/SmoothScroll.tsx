'use client';

import {useEffect} from 'react';
import Lenis from 'lenis';

/**
 * Wires Lenis smooth scrolling for the whole app. Pure side-effect client leaf:
 * renders nothing. Automatically disables itself when the user prefers reduced
 * motion so we never fight assistive settings.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    // Crisp, responsive feel: a high lerp settles in a few frames (not the
    // over-damped ~1s ease that made scrolling feel laggy). Smooth the wheel
    // only — leave touch native so mobile scrolling never goes through JS.
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 1
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return null;
}
