'use client';

import {useLayoutEffect, useRef} from 'react';
import {HeroIntro} from './HeroIntro';

/**
 * Homepage-only sticky banner (the "Next-Gen AI Systems…" gradient row + the
 * second line). It pins directly below the sticky navbar so navbar + banner read
 * as one fixed top block; everything from the hero video down scrolls beneath it.
 *
 * It also measures the real pinned-block height (navbar + this banner) and writes
 * it to `--pinned-h` on <html> — consumed by the hero section height and by the
 * anchor scroll offset (`scroll-margin-top` / `scroll-padding-top`). Measured in
 * useLayoutEffect (before paint) so there's no first-frame jump; reset on unmount
 * so inner pages fall back to the navbar-only default.
 */
export function PinnedBanner({pill}: {pill: string[]}) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const banner = ref.current;
    if (!banner) return;
    const root = document.documentElement;
    const header = document.querySelector('header');

    const update = () => {
      const total = (header?.offsetHeight ?? 0) + banner.offsetHeight;
      root.style.setProperty('--pinned-h', `${total}px`);
    };
    update();

    const ro = new ResizeObserver(update);
    ro.observe(banner);
    if (header) ro.observe(header);
    window.addEventListener('resize', update);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', update);
      root.style.removeProperty('--pinned-h');
    };
  }, []);

  return (
    <div ref={ref} className="sticky top-[var(--nav-h)] z-40 bg-bg">
      <HeroIntro pill={pill} />
    </div>
  );
}
