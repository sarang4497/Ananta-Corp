'use client';

import {useState} from 'react';

function PlayIcon({className}: {className?: string}) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M8 5.14v13.72a1 1 0 0 0 1.54.84l10.7-6.86a1 1 0 0 0 0-1.68L9.54 4.3A1 1 0 0 0 8 5.14Z" />
    </svg>
  );
}

/**
 * Responsive 16:9 testimonial video. Lazy by default — shows the YouTube
 * thumbnail with a play button and only loads the real iframe on click (no
 * YouTube JS until the visitor engages). Falls back to a branded placeholder
 * when no ID is set. Plays inline; no black.
 */
export function DentalTestimonialVideo({
  youtubeId,
  placeholder
}: {
  youtubeId?: string;
  placeholder: string;
}) {
  const [play, setPlay] = useState(false);
  const id = youtubeId?.trim();

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-bg-soft shadow-card">
      {!id ? (
        <div className="grid h-full w-full place-items-center bg-gradient-to-br from-blue/10 via-indigo/10 to-[#B06A9E]/15">
          <div className="flex flex-col items-center gap-3 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-bg/80 text-indigo shadow-sm">
              <PlayIcon className="ml-0.5 h-6 w-6" />
            </span>
            <p className="text-sm font-medium text-muted">{placeholder}</p>
          </div>
        </div>
      ) : play ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1`}
          title="Dental partner testimonial"
          loading="lazy"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlay(true)}
          aria-label="Play testimonial video"
          className="group absolute inset-0 h-full w-full"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
            alt=""
            className="h-full w-full object-cover"
          />
          <span className="absolute inset-0 bg-indigo/25 transition-colors duration-300 group-hover:bg-indigo/10" />
          <span className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-blue shadow-lg transition-transform duration-200 group-hover:scale-110">
            <PlayIcon className="ml-1 h-7 w-7" />
          </span>
        </button>
      )}
    </div>
  );
}
