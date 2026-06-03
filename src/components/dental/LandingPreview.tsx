'use client';

import {useRef} from 'react';
import {useInView} from 'motion/react';
import {buttonClassName} from '@/components/ui/Button';

const PREVIEW_URL = 'https://dentallandingpage-theta.vercel.app/';
const PREVIEW_HOST = 'dentallandingpage-theta.vercel.app';

/**
 * Browser-framed preview of a real dental landing page. The live site is loaded
 * in a lazy <iframe> (only when scrolled near, non-interactive) — but since the
 * site may block framing (X-Frame-Options/CSP), the big "View live example"
 * button is always present as the reliable way through. No black.
 */
export function LandingPreview({heading, cta}: {heading: string; cta: string}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {once: true, margin: '300px'});

  return (
    <div ref={ref} className="flex w-full flex-col items-center gap-7">
      {/* Big, full-width browser-framed showcase. */}
      <div className="w-full overflow-hidden rounded-2xl border border-border bg-bg shadow-glow">
        {/* Faux browser chrome with the URL. */}
        <div className="flex items-center gap-2 border-b border-border bg-bg-soft/70 px-4 py-3">
          <span className="flex gap-1.5" aria-hidden>
            <span className="h-3 w-3 rounded-full bg-red/50" />
            <span className="h-3 w-3 rounded-full bg-orange/50" />
            <span className="h-3 w-3 rounded-full bg-green/50" />
          </span>
          <span className="ml-2 flex-1 truncate rounded-md border border-border bg-bg px-4 py-1.5 text-center text-xs text-muted sm:text-sm">
            {PREVIEW_HOST}
          </span>
        </div>

        {/* Lazy live preview — large + tall so a good portion of the page shows. */}
        <div className="relative h-[460px] w-full bg-bg-soft sm:h-[640px] lg:h-[780px]">
          {inView ? (
            <iframe
              src={PREVIEW_URL}
              title="Dental landing page — live preview"
              loading="lazy"
              className="absolute inset-0 h-full w-full"
              style={{pointerEvents: 'none'}}
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center text-sm text-muted">
              Loading preview…
            </div>
          )}
        </div>
      </div>

      {/* Always-present fallback — big and obvious (the site may block framing). */}
      <a
        href={PREVIEW_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClassName('blue', 'lg', 'px-8 py-4 text-base font-bold shadow-glow')}
      >
        {cta}
      </a>
    </div>
  );
}
