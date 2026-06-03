'use client';

import {LazyMotion, domAnimation, m, useReducedMotion, type Variants} from 'motion/react';
import {Typewriter} from '@/components/Typewriter';

/**
 * Zone 1 content: two full-bleed banner rows — a dark-red bar over a bold
 * dark-blue line. (The headline now lives below the stats section.) Staggered
 * entrance on load via motion/react, gated by useReducedMotion. Client leaf —
 * only the animation ships here; copy comes from the server.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

const container: Variants = {
  hidden: {},
  show: {transition: {staggerChildren: 0.12, delayChildren: 0.05}}
};

const fadeUp: Variants = {
  hidden: {opacity: 0, y: 16},
  show: {opacity: 1, y: 0, transition: {duration: 0.6, ease: EASE}}
};

export function HeroIntro({pill}: {pill: string[]}) {
  const reduce = useReducedMotion();
  const initial = reduce ? 'show' : 'hidden';

  return (
    <LazyMotion features={domAnimation} strict>
      <m.div
        variants={container}
        initial={initial}
        animate="show"
        className="flex w-full flex-col"
      >
        {/* ROW 1 — full-bleed band, snug to the text (small even margin top +
            bottom). Premium blue→indigo gradient with a warm mauve accent
            fading in on the right (matches the chat panel). */}
        <m.div
          variants={fadeUp}
          className="w-full shell py-3 text-center sm:py-1"
          style={{
            backgroundImage:
              'linear-gradient(110deg, #2563EB 0%, #4F46E5 45%, #6D5BD0 70%, #B06A9E 100%)'
          }}
        >
          {/* Larger + roomier on mobile; desktop keeps the original clamp. */}
          <span className="block text-balance text-xl font-bold leading-snug tracking-tight text-white sm:text-[clamp(1.05rem,2.6vw,2rem)] sm:leading-tight">
            {pill[0]}
          </span>
        </m.div>

        {/* ROW 2 — full-bleed white band, bold dark-blue monospace line that
            types itself out on load, then holds with a blinking caret. */}
        <m.div variants={fadeUp} className="w-full bg-bg shell py-3.5 text-center sm:py-3">
          <Typewriter
            text={pill[1]}
            className="block font-mono text-lg font-bold leading-snug text-[#15183b] [font-variant-ligatures:none] sm:text-[clamp(1.04rem,1.95vw,1.56rem)]"
          />
        </m.div>
      </m.div>
    </LazyMotion>
  );
}
