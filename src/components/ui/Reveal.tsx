'use client';

import type {ReactNode} from 'react';
import {
  LazyMotion,
  domAnimation,
  m,
  useReducedMotion,
  type Variants
} from 'motion/react';
import {cn} from '@/lib/cn';

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Vertical rise distance in px. */
  y?: number;
  /** Delay before the (group) animation starts, in seconds. */
  delay?: number;
  /** Per-child stagger in seconds. When > 0, children should be <RevealItem>. */
  stagger?: number;
  /** Animate on mount ("load") or when scrolled into view ("inView"). */
  trigger?: 'inView' | 'load';
  once?: boolean;
};

const EASE = [0.22, 1, 0.36, 1] as const;

const container = (stagger: number, delay: number): Variants => ({
  hidden: {},
  show: {transition: {staggerChildren: stagger, delayChildren: delay}}
});

const single = (y: number, delay: number): Variants => ({
  hidden: {opacity: 0, y},
  show: {opacity: 1, y: 0, transition: {duration: 0.6, ease: EASE, delay}}
});

const itemVariants = (y: number): Variants => ({
  hidden: {opacity: 0, y},
  show: {opacity: 1, y: 0, transition: {duration: 0.6, ease: EASE}}
});

/**
 * Fade + rise reveal built on motion/react, wrapped in LazyMotion with the `m`
 * component so only the lightweight DOM animation features ship. Always gated on
 * useReducedMotion — reduced-motion users get the content with no animation.
 *
 * - Single element: <Reveal>…</Reveal>
 * - Staggered group: <Reveal stagger={0.08}><RevealItem/>…</Reveal>
 */
export function Reveal({
  children,
  className,
  y = 24,
  delay = 0,
  stagger = 0,
  trigger = 'inView',
  once = true
}: RevealProps) {
  const reduce = useReducedMotion();
  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  const animateProps =
    trigger === 'load'
      ? {animate: 'show' as const}
      : {
          whileInView: 'show' as const,
          viewport: {once, margin: '-80px'} as const
        };

  const variants = stagger > 0 ? container(stagger, delay) : single(y, delay);

  return (
    <LazyMotion features={domAnimation} strict>
      <m.div
        className={cn(className)}
        variants={variants}
        initial="hidden"
        {...animateProps}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}

/** A child of a staggered <Reveal stagger>. Inherits the parent's trigger. */
export function RevealItem({
  children,
  className,
  y = 24
}: {
  children: ReactNode;
  className?: string;
  y?: number;
}) {
  return (
    <m.div className={cn(className)} variants={itemVariants(y)}>
      {children}
    </m.div>
  );
}
