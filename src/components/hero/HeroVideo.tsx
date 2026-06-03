'use client';

import {useEffect, useRef, useState, type VideoHTMLAttributes} from 'react';
import {cn} from '@/lib/cn';

/**
 * Full-bleed hero background video, tuned for iOS Safari autoplay.
 *
 * iOS only autoplays a video that is muted + inline AND present (visible, not
 * display:none) in the markup. So the single <video> is rendered directly (not
 * injected later via JS) with every attribute set in the markup:
 *   muted, autoPlay, loop, playsInline, webkit-playsinline (+ x5 for Android).
 * mp4/H.264 is listed FIRST so iOS plays it reliably; webm is a secondary source.
 * `media` keeps phones on the mobile file and desktops on the desktop file (no
 * cross-download). A poster <img> sits on top and fades out once playback starts;
 * if autoplay is ever blocked (e.g. Low Power Mode) the poster simply stays —
 * never a blank/black area.
 *
 * Assets: /hero/hero-mobile.{mp4,webm} · /hero/hero-desktop.{mp4,webm} ·
 *         /hero/poster.jpg
 */

const POSTER = '/hero/poster.jpg';

// Non-standard inline-playback attributes (legacy iOS WebKit + X5 on Android),
// rendered straight into the markup. Double-cast because they aren't in React's
// video prop types.
const INLINE_ATTRS = {
  'webkit-playsinline': 'true',
  'x5-playsinline': 'true'
} as unknown as VideoHTMLAttributes<HTMLVideoElement>;

export function HeroVideo() {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    // Respect reduced motion: keep the poster, never play.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // iOS gates autoplay on the muted *property* (not just the attribute) and on
    // defaultMuted being set, so force both before any play attempt.
    el.muted = true;
    el.defaultMuted = true;

    // Every attempt re-asserts muted first, then calls play() and swallows the
    // rejection iOS throws when it defers autoplay.
    const tryPlay = () => {
      el.muted = true;
      const p = el.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    };

    // 1) Immediate attempt.
    tryPlay();

    // 2) Retry as the media becomes ready — iOS frequently only succeeds on a
    //    later readiness event, not the first.
    const mediaEvents = ['loadeddata', 'canplay', 'canplaythrough'] as const;
    mediaEvents.forEach((ev) => el.addEventListener(ev, tryPlay));

    // 3) Retry on the very first user interaction anywhere on the page, so a
    //    deferred autoplay is kicked off by the earliest touch/scroll/tap. The
    //    listeners drop themselves once playback has actually started.
    const interactEvents = ['touchstart', 'scroll', 'click', 'keydown'] as const;
    const removeInteract = () =>
      interactEvents.forEach((ev) => document.removeEventListener(ev, onInteract));
    const onInteract = () => {
      tryPlay();
      if (!el.paused) removeInteract();
    };
    interactEvents.forEach((ev) =>
      document.addEventListener(ev, onInteract, {passive: true})
    );

    // 4) Some iOS versions defer play until the element is on-screen — replay
    //    whenever it scrolls into view.
    let io: IntersectionObserver | undefined;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) if (entry.isIntersecting) tryPlay();
        },
        {threshold: 0.1}
      );
      io.observe(el);
    }

    return () => {
      mediaEvents.forEach((ev) => el.removeEventListener(ev, tryPlay));
      removeInteract();
      io?.disconnect();
    };
  }, []);

  return (
    // Deep brand-indigo fallback so there is never a black flash.
    <div aria-hidden className="absolute inset-0 overflow-hidden bg-[#312e81]">
      <div className="absolute inset-0 will-change-transform motion-safe:animate-hero-zoom">
        {/* Always rendered + fully visible (opacity-100) so iOS will autoplay it.
            Hidden only for reduced-motion users (the poster stays for them). */}
        <video
          ref={videoRef}
          muted
          autoPlay
          loop
          playsInline
          preload="auto"
          poster={POSTER}
          {...INLINE_ATTRS}
          onCanPlay={(e) => {
            const p = e.currentTarget.play();
            if (p && typeof p.catch === 'function') p.catch(() => {});
          }}
          onPlaying={() => setPlaying(true)}
          className="absolute inset-0 h-full w-full object-cover object-top motion-reduce:hidden"
        >
          {/* mp4/H.264 FIRST so iOS Safari plays it reliably; webm secondary. */}
          <source src="/hero/hero-mobile.mp4" type="video/mp4" media="(max-width: 767px)" />
          <source src="/hero/hero-mobile.webm" type="video/webm" media="(max-width: 767px)" />
          <source src="/hero/hero-desktop.mp4" type="video/mp4" media="(min-width: 768px)" />
          <source src="/hero/hero-desktop.webm" type="video/webm" media="(min-width: 768px)" />
        </video>

        {/* Poster overlay — on top of the video, fades out once it actually plays.
            The video itself is never hidden, so autoplay is never blocked. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={POSTER}
          alt=""
          className={cn(
            'absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-700',
            playing ? 'opacity-0' : 'opacity-100'
          )}
        />
      </div>

      {/* Legibility wash — indigo/blue, NEVER black. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(24,119,242,0.10) 0%, rgba(79,70,229,0.20) 55%, rgba(79,70,229,0.34) 100%)'
        }}
      />
    </div>
  );
}
