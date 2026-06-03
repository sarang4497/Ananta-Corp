'use client';

import dynamic from 'next/dynamic';
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type ReactNode
} from 'react';
import {useReducedMotion} from 'motion/react';
import {cn} from '@/lib/cn';

/**
 * Reusable three-layer demo loader. Every homepage demo goes through this so
 * the page stays cheap to load and cheap to scroll:
 *
 *  1. POSTER FIRST — render only a static poster (no demo JS, no animation)
 *     until the slot approaches the viewport.
 *  2. LAZY-LOAD ON ARRIVAL — within `preloadMargin` of the viewport, the demo's
 *     chunk is dynamically imported (next/dynamic, ssr:false) and mounted; the
 *     poster doubles as the loading fallback so nothing pops in empty.
 *  3. PLAY ONLY IN VIEW — `playing` is true exactly while the slot is on screen,
 *     so the demo's timeline runs only then and halts otherwise. When the slot
 *     drifts beyond the keep-alive margin it unmounts back to the poster,
 *     freeing its React tree + animation frame. Re-entering remounts (restart).
 *
 * Reduced motion: never autoplay. The demo still mounts near the viewport but
 * with playing=false, so it shows its settled final frame (handled inside each
 * demo via useDemoTimeline) — matching the prior reduced-motion behavior.
 */
// Demos share `{playing}` but differ in extra props (most take `accent`, the
// flagship takes none), so the loaded component is typed loosely at this
// generic boundary; each adapter passes the right props via `demoProps`.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DemoComponent = ComponentType<any>;

type Props = {
  /** Stable thunk, e.g. `() => import('./AppFlowDemo')`. */
  load: () => Promise<{default: DemoComponent}>;
  /** Static frozen-frame placeholder; also used as the chunk loading fallback. */
  poster: ReactNode;
  /** Extra props forwarded to the demo (e.g. `{accent}`). */
  demoProps?: Record<string, unknown>;
  /** How far outside the viewport to preload + keep the demo mounted. */
  preloadMargin?: string;
  /** Sets the slot's aspect ratio / sizing. */
  className?: string;
};

export function LazyDemo({
  load,
  poster,
  demoProps,
  preloadMargin = '400px 0px',
  className
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion() ?? false;
  const [mounted, setMounted] = useState(false);
  const [playing, setPlaying] = useState(false);

  // Create the code-split component once; its loading fallback is the poster.
  const Demo = useMemo(
    () => dynamic(load, {ssr: false, loading: () => <>{poster}</>}),
    // load + poster are stable (a module-level thunk and a static element).
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Keep-alive zone: mount within `preloadMargin` of the viewport, unmount
    // once it drifts further away (frees the tree + animation frame).
    const keepAlive = new IntersectionObserver(
      ([entry]) => setMounted(entry.isIntersecting),
      {rootMargin: preloadMargin}
    );
    // Play zone: animate only while genuinely on screen — and never under
    // reduced motion (the demo then renders its static final frame).
    const playZone = new IntersectionObserver(
      ([entry]) => setPlaying(!reduce && entry.isIntersecting),
      {threshold: 0.35}
    );
    keepAlive.observe(el);
    playZone.observe(el);
    return () => {
      keepAlive.disconnect();
      playZone.disconnect();
    };
  }, [reduce, preloadMargin]);

  return (
    <div ref={ref} className={cn('relative overflow-hidden', className)}>
      {mounted ? <Demo playing={playing} {...demoProps} /> : poster}
    </div>
  );
}
