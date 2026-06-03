'use client';

import {useEffect, useRef, useState} from 'react';
import {useInView, useReducedMotion} from 'motion/react';
import {cn} from '@/lib/cn';

type Props = {
  /** e.g. "+180%", "2.4×", "+95%". The numeric part counts up. */
  value: string;
  label: string;
  className?: string;
};

// Split "+180%" -> prefix "+", number "180", suffix "%".
function parseValue(value: string) {
  const match = value.match(/^([^\d-]*)(-?[\d.,]+)(.*)$/);
  if (!match) return {prefix: '', num: NaN, suffix: value, decimals: 0};
  const prefix = match[1];
  const raw = match[2].replace(/,/g, '');
  const suffix = match[3];
  const decimals = raw.includes('.') ? raw.split('.')[1].length : 0;
  return {prefix, num: parseFloat(raw), suffix, decimals};
}

/** Animated metric that counts up the first time it scrolls into view. */
export function Stat({value, label, className}: Props) {
  const {prefix, num, suffix, decimals} = parseValue(value);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {once: true, margin: '-60px'});
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(() =>
    Number.isNaN(num) ? value : `${prefix}0${suffix}`
  );

  useEffect(() => {
    if (Number.isNaN(num)) return;
    if (!inView || reduce) {
      if (inView) setDisplay(value);
      return;
    }

    const duration = 1300;
    let raf = 0;
    let start = 0;
    const tick = (t: number) => {
      if (!start) start = t;
      const progress = Math.min((t - start) / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = (num * eased).toFixed(decimals);
      setDisplay(`${prefix}${current}${suffix}`);
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, num, decimals, prefix, suffix, value]);

  return (
    <div ref={ref} className={cn('flex flex-col gap-1', className)}>
      <span className="bg-gradient-brand bg-clip-text text-4xl font-semibold tracking-tight text-transparent sm:text-5xl">
        {display}
      </span>
      <span className="text-sm text-muted">{label}</span>
    </div>
  );
}
