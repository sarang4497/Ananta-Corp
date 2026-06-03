'use client';

import {useEffect, useState} from 'react';
import {useReducedMotion} from 'motion/react';
import {cn} from '@/lib/cn';

/**
 * Types `text` out character by character on mount, then holds with a blinking
 * caret. Honors prefers-reduced-motion (full text shown immediately, static
 * caret). The full string is always in the a11y tree via an sr-only copy.
 */
export function Typewriter({
  text,
  className,
  speed = 55
}: {
  text: string;
  className?: string;
  speed?: number;
}) {
  const reduce = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (reduce) {
      setCount(text.length);
      return;
    }
    setCount(0);
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setCount(i);
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [reduce, text, speed]);

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {text.slice(0, count)}
        <span
          className={cn(
            'ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.14em] bg-current',
            reduce ? 'opacity-100' : 'motion-safe:animate-blink'
          )}
        />
      </span>
    </span>
  );
}
