'use client';

import {useRef} from 'react';
import Image from 'next/image';
import {useInView} from 'motion/react';
import {ArrowUpRight} from 'lucide-react';
import {buttonClassName} from '@/components/ui/Button';

/**
 * Browser-framed preview of a live site. The site loads in a lazy, non-
 * interactive <iframe> only when scrolled near — but since many sites block
 * framing (X-Frame-Options/CSP), the "Visit …" button is always present as the
 * reliable way through (new tab, rel=noopener). No black.
 *
 * When a site blocks embedding entirely, pass `image` (a screenshot in
 * /public): it renders inside the same browser-frame mockup (object-cover,
 * top-aligned) instead of the iframe, so there's never a blank area.
 */
export function SitePreview({
  url,
  host,
  cta,
  image,
  heightClass = 'h-[360px] sm:h-[460px]'
}: {
  url: string;
  host: string;
  cta: string;
  image?: string;
  heightClass?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {once: true, margin: '300px'});

  return (
    <div ref={ref} className="flex w-full flex-col items-center gap-5">
      <div className="w-full overflow-hidden rounded-2xl border border-border bg-bg shadow-glow">
        {/* Faux browser chrome with the URL. */}
        <div className="flex items-center gap-2 border-b border-border bg-bg-soft/70 px-4 py-3">
          <span className="flex gap-1.5" aria-hidden>
            <span className="h-3 w-3 rounded-full bg-red/50" />
            <span className="h-3 w-3 rounded-full bg-orange/50" />
            <span className="h-3 w-3 rounded-full bg-green/50" />
          </span>
          <span className="ml-2 flex-1 truncate rounded-md border border-border bg-bg px-4 py-1.5 text-center text-xs text-muted sm:text-sm">
            {host}
          </span>
        </div>

        <div className={`relative w-full bg-bg-soft ${heightClass}`}>
          {image ? (
            // Screenshot fallback for sites that block framing — fills the frame,
            // top-aligned so the site's header/hero shows. No blank area.
            <Image
              src={image}
              alt={`${host} — site preview`}
              fill
              sizes="(max-width: 1024px) 100vw, 960px"
              className="object-cover object-top"
            />
          ) : inView ? (
            <iframe
              src={url}
              title={`${host} — live preview`}
              loading="lazy"
              className="absolute inset-0 h-full w-full"
              style={{pointerEvents: 'none'}}
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center text-sm text-muted">Loading preview…</div>
          )}
        </div>
      </div>

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClassName('blue', 'lg', 'gap-1.5 px-7 py-3.5 font-bold shadow-glow')}
      >
        {cta}
        <ArrowUpRight className="h-4 w-4" aria-hidden />
      </a>
    </div>
  );
}
