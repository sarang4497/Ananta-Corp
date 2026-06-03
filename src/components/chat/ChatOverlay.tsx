'use client';

import {useEffect, useState, type ReactNode} from 'react';
import {createPortal} from 'react-dom';
import {cn} from '@/lib/cn';

/**
 * Positions the chat panel so it NEVER exceeds the viewport, with a backdrop and
 * Escape-to-close. Children stay mounted (so the conversation survives
 * close/reopen); only visibility toggles with `open`.
 *
 * CRITICAL: the overlay is rendered through a PORTAL to <body>. A
 * `position: fixed` element is positioned relative to the nearest ancestor that
 * has a `transform`, `filter`, `will-change`, `contain` (etc.) — and this app
 * uses those on hero/section wrappers (GradientMesh, HeroVideo, animated cards).
 * Mounted inline, the panel was captured by one of those ancestors instead of
 * the viewport, so its pinned header (with the X) ended up off-screen and the
 * messages ran full-height down the page. Portalling to <body> guarantees the
 * `fixed` box resolves against the viewport — a contained box with the X always
 * visible — from BOTH the hero box and the floating launcher.
 *
 * - Mobile: fixed, fills the dynamic viewport (100dvh) edge-to-edge.
 * - Desktop: a contained box anchored bottom-right above the launcher.
 *
 * The panel itself is a fixed-height flex column (header / scrolling messages /
 * input), so long answers scroll inside it and the close button in the pinned
 * header is always on-screen.
 */
export function ChatOverlay({
  open,
  onClose,
  children
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  // Portals need the DOM; wait until mounted on the client.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    // Lock background scroll while the chat is open.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <>
      {/* Backdrop — click to close. Indigo-tinted, never pure black. */}
      <div
        aria-hidden
        onClick={onClose}
        className={cn(
          'fixed inset-0 z-[60] bg-ink/40 backdrop-blur-sm transition-opacity duration-200',
          open ? 'opacity-100' : 'pointer-events-none hidden opacity-0'
        )}
      />
      {/* Panel holder — a small CONTAINED box on EVERY breakpoint (never
          full-screen). Anchored bottom-right with margin so the backdrop shows
          around it (tap-to-close). Lifted clear of the mobile safe-area inset. */}
      <div
        className={cn(
          'fixed z-[65] right-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] w-[min(92vw,360px)] h-[min(70dvh,520px)] max-h-[min(70dvh,520px)]',
          'sm:right-6 sm:bottom-24 sm:h-[min(80vh,640px)] sm:max-h-[min(80vh,640px)] sm:w-[430px]',
          open ? 'block' : 'hidden'
        )}
      >
        {children}
      </div>
    </>,
    document.body
  );
}
