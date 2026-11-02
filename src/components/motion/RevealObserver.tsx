'use client';

import {useEffect} from 'react';
import {usePathname} from 'next/navigation';

/**
 * ONE observer for every [data-reveal] element on the page (server components
 * just add the attribute). Elements already in the viewport reveal at once;
 * others reveal when ~10% enters. Re-scans after client navigation and when
 * new nodes mount (tabs, filters). Content is visible without JS — the hidden
 * start state only exists under html.js (set by the inline head script).
 */
export function RevealObserver() {
  const pathname = usePathname();
  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const reveal = (el: Element) => el.classList.add('is-in');
    if (reduce || !('IntersectionObserver' in window)) {
      document.querySelectorAll('[data-reveal]').forEach(reveal);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            reveal(e.target);
            io.unobserve(e.target);
          }
        }
      },
      {rootMargin: '0px 0px -8% 0px', threshold: 0.01}
    );
    const scan = () =>
      document.querySelectorAll('[data-reveal]:not(.is-in)').forEach((el) => {
        const r = el.getBoundingClientRect();
        // Already on screen (or above it: fast scroll / anchor jump) → show now.
        if (r.top < window.innerHeight && r.bottom > -1) reveal(el);
        else if (r.bottom <= 0) reveal(el);
        else io.observe(el);
      });
    scan();
    // Fast scroll / anchor jumps can skip an element's intersection entirely:
    // anything that is now on screen or already passed is revealed.
    let raf = 0;
    const sweep = () => {
      raf = 0;
      document.querySelectorAll('[data-reveal]:not(.is-in)').forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight) {
          reveal(el);
          io.unobserve(el);
        }
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(sweep);
    };
    window.addEventListener('scroll', onScroll, {passive: true});
    const mo = new MutationObserver(() => scan());
    mo.observe(document.body, {childList: true, subtree: true});
    // Safety net: anything still hidden after a long idle is shown (e.g. print).
    const onPrint = () => document.querySelectorAll('[data-reveal]').forEach(reveal);
    window.addEventListener('beforeprint', onPrint);
    root.dataset.motion = 'ready';
    return () => {
      io.disconnect();
      mo.disconnect();
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
      window.removeEventListener('beforeprint', onPrint);
    };
  }, [pathname]);
  return null;
}
