'use client';

import {m} from 'motion/react';
import {accentHex, type Accent} from './demoAccent';

/**
 * A realistic pointer that springs between targets and presses on each click.
 * Position is given in % of the stage; the spring tween makes the travel feel
 * natural. `clickKey` increments on every scripted click — the ripple + press
 * replay off its identity. Purely presentational, no system cursor.
 */
export function Cursor({
  x,
  y,
  clickKey,
  accent,
  hidden
}: {
  x: number;
  y: number;
  clickKey: number;
  accent: Accent;
  hidden?: boolean;
}) {
  return (
    <m.div
      className="pointer-events-none absolute z-40"
      initial={false}
      animate={{left: `${x}%`, top: `${y}%`, opacity: hidden ? 0 : 1}}
      transition={{
        left: {type: 'spring', stiffness: 150, damping: 21, mass: 0.7},
        top: {type: 'spring', stiffness: 150, damping: 21, mass: 0.7},
        opacity: {duration: 0.3}
      }}
    >
      {/* click ripple */}
      {clickKey > 0 && (
        <m.span
          key={clickKey}
          className="absolute -left-px -top-px -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{width: 36, height: 36, border: `2px solid ${accentHex[accent]}`}}
          initial={{scale: 0.25, opacity: 0.7}}
          animate={{scale: 1.45, opacity: 0}}
          transition={{duration: 0.55, ease: 'easeOut'}}
        />
      )}

      {/* pointer, with a press scale on each click */}
      <m.div
        animate={{scale: clickKey > 0 ? [1, 0.82, 1] : 1}}
        transition={{duration: 0.34, ease: 'easeOut'}}
        style={{filter: 'drop-shadow(0 3px 5px rgba(21,24,59,0.28))'}}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M5.5 3.2 L5.5 19.6 L9.7 15.5 L12.1 21 L14.6 19.9 L12.2 14.5 L18.1 14.5 Z"
            fill="#ffffff"
            stroke="#15183b"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        </svg>
      </m.div>
    </m.div>
  );
}
