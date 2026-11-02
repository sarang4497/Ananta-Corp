'use client';

import {useEffect, useRef, type ReactNode} from 'react';

/**
 * Gentle scroll parallax for decorative layers (hero material plates).
 * Max shift = `depth` px, rAF-throttled, transform only, off under reduced
 * motion. Children stay inside their (overflow-clipped) frame.
 */
export function Parallax({children, depth = 24, className}: {children: ReactNode; depth?: number; className?: string}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.bottom < 0 || r.top > vh) return;
      const k = (r.top + r.height / 2 - vh / 2) / vh; // -1..1 around centre
      el.style.transform = `translate3d(0, ${(-k * depth).toFixed(1)}px, 0)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [depth]);
  return (
    <div ref={ref} className={className} style={{willChange: 'transform'}}>
      {children}
    </div>
  );
}
