'use client';

import {cn} from '@/lib/cn';
import {LazyDemo} from './LazyDemo';
import {DemoPoster} from './DemoPoster';

/**
 * Featured flagship demo slot (AutomatedHiring), sized larger than the offering
 * rows. Same poster-first / lazy-load / play-only-in-view contract as the rest,
 * via <LazyDemo>. The demo's own chunk is never in the page's initial JS.
 */
export function FlagshipDemo({className}: {className?: string}) {
  return (
    // Half-size footprint, centered in the section. The inner renders the demo
    // at 2× and scales it to 0.5, so the whole scene (layout + text) shrinks
    // proportionally and stays crisp — identical layout, just half as large.
    // Slightly less reduction on mobile, where it isn't oversized.
    <div
      className={cn(
        'relative mx-auto aspect-[4/3] w-[92%] overflow-hidden sm:aspect-[16/10] sm:w-2/3 lg:aspect-[16/9] lg:w-1/2',
        className
      )}
    >
      <div className="absolute left-0 top-0 h-[200%] w-[200%] origin-top-left scale-50">
        <LazyDemo
          load={() => import('./AutomatedHiringDemo')}
          poster={<DemoPoster label="AI-Assisted hiring" accent="indigo" />}
          // Tall slot: preload a little earlier so it's ready as it scrolls up.
          preloadMargin="500px 0px"
          className="h-full w-full"
        />
      </div>
    </div>
  );
}
