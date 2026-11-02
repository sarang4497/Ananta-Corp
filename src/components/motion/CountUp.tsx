'use client';

import {useEffect, useLayoutEffect, useRef} from 'react';

const useIso = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/**
 * Animated figure for VERIFIED / COMPUTED numbers only ("156", "11,000",
 * "2020"). Server + first render show the FINAL value (SEO, no-JS, screen
 * readers). With motion allowed, digits reset before first paint and count up
 * once on entering view; width is reserved so layout never shifts.
 */
export function CountUp({value, className = ''}: {value: string; className?: string}) {
  const ref = useRef<HTMLSpanElement>(null);
  useIso(() => {
    const el = ref.current;
    const m = value.match(/^(\D*)(\d[\d,]*)(.*)$/);
    if (!el || !m) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    const [, pre, num, post] = m;
    const target = Number(num.replace(/,/g, ''));
    const grouped = num.includes(',');
    const isYear = !grouped && target >= 1900 && target <= 2100;
    const from = isYear ? target - 12 : 0;
    const fmt = (n: number) => {
      const s = Math.round(n).toString();
      return pre + (grouped ? s.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : s) + post;
    };
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) return; // already visible: no flash
    el.style.minWidth = `${r.width}px`;
    el.textContent = fmt(from);
    el.dataset.countRoll = 'start';
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        el.dataset.countRoll = 'in';
        const t0 = performance.now();
        const dur = 1100;
        const tick = (now: number) => {
          const k = Math.min(1, (now - t0) / dur);
          el.textContent = fmt(from + (target - from) * (1 - Math.pow(1 - k, 3)));
          if (k < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      {threshold: 0.5}
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      el.textContent = value;
      delete el.dataset.countRoll;
    };
  }, [value]);
  return (
    <span ref={ref} data-count className={`tabular ${className}`}>
      {value}
    </span>
  );
}
