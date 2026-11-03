'use client';

import {useEffect, useState, type ReactNode} from 'react';
import {createPortal} from 'react-dom';
import {cn} from '@/lib/cn';

/**
 * Hosts the assistant panel, portalled to <body> so `position: fixed` always
 * resolves against the viewport (sections use transforms/filters that would
 * otherwise capture it).
 *
 * - Phones (<768): a bottom SHEET — full width, rounded top, drag-handle
 *   visual, max 85dvh, safe-area padding, with a backdrop + scroll lock. The
 *   phone contact bar (var(--dock-h)) hides itself while the chat is open
 *   (html[data-chat-open]); the sheet sits above it in z-order either way.
 * - ≥768: a compact SIDE PANEL (~400px) anchored bottom-right, in front of the
 *   dock rail (which steps aside while open), height clamped with dvh. No
 *   backdrop: the page stays readable beside it.
 *
 * Open/close is a 340ms ease (opacity + rise); reduced motion → opacity only.
 * Focus moves into the panel on open (ChatPanel) and back to the launcher on
 * close (ChatWidget). When closed the holder is `inert` + visibility:hidden, so nothing inside is
 * focusable or announced. Escape closes. Children stay mounted so the
 * conversation survives close/reopen.
 */
export function ChatOverlay({open, onClose, children}: {open: boolean; onClose: () => void; children: ReactNode}) {
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only portal mount flag
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener('keydown', onKey);
    // Scroll lock only for the phone sheet (modal); the desktop panel is a side panel.
    const phone = window.matchMedia('(max-width: 767px)').matches;
    const prevOverflow = document.body.style.overflow;
    if (phone) document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      if (phone) document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <>
      <div
        aria-hidden
        onClick={onClose}
        data-testid="assistant-backdrop"
        className={cn(
          'fixed inset-0 z-[60] bg-ink/35 backdrop-blur-[2px] transition-opacity duration-[340ms] ease-[cubic-bezier(.22,1,.36,1)] md:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
      />
      <div
        inert={!open}
        data-state={open ? 'open' : 'closed'}
        data-testid="assistant-holder"
        className={cn(
          'fixed z-[65] flex flex-col',
          // phone: bottom sheet
          'inset-x-0 bottom-0 max-h-[85dvh] h-[min(85dvh,640px)]',
          // ≥768: compact side panel, bottom-right
          'md:inset-x-auto md:right-4 md:bottom-5 md:w-[400px] md:max-w-[calc(100vw-2rem)] md:h-[min(640px,calc(100dvh-var(--header-h)-2.5rem))] md:max-h-[calc(100dvh-var(--header-h)-2.5rem)]',
          'transition-[opacity,transform,visibility] duration-[340ms] ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transform-none',
          open ? 'visible translate-y-0 opacity-100' : 'invisible pointer-events-none translate-y-6 opacity-0 md:translate-y-3'
        )}
      >
        {children}
      </div>
    </>,
    document.body
  );
}
