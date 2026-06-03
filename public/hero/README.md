# Hero footage (placeholders)

Drop the real above-the-fold hero assets here:

- `poster.jpg` — a still frame of the footage. Paints instantly as the LCP.
  After adding it, point `POSTER` in `src/components/hero/HeroVideo.tsx` at
  `/hero/poster.jpg` (currently the placeholder `poster.svg`).
- `hero.webm` — preferred web-optimised video (VP9/AV1), muted, short loop.
- `hero.mp4` — H.264 fallback for Safari/iOS.

Until `hero.webm` / `hero.mp4` exist, the stage shows the poster only — which is
also exactly what mobile and reduced-motion visitors always get.
