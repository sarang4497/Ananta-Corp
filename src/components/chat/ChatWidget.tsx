'use client';

import dynamic from 'next/dynamic';
import {useEffect, useState} from 'react';
import {useTranslations} from 'next-intl';
import {ChatOverlay} from './ChatOverlay';
import {cn} from '@/lib/cn';

// The panel (chat UI + voice + Turnstile + gates) is code-split into its own
// chunk. ssr:false + dynamic import keeps all of it out of the initial payload;
// the JS only downloads the first time the visitor opens the chat.
const ChatPanel = dynamic(() => import('./ChatPanel'), {ssr: false});

/**
 * Floating chat launcher. Tiny client leaf mounted globally in the layout.
 * Renders only the button until first open, then loads the panel chunk (inside
 * a viewport-contained overlay).
 */
export function ChatWidget() {
  const t = useTranslations('chat');
  const [open, setOpen] = useState(false);
  const [everOpened, setEverOpened] = useState(false);
  const [seed, setSeed] = useState<string | undefined>(undefined);

  const close = () => setOpen(false);

  // The single, site-wide entry point: any chat CTA (see AskBellaButton)
  // dispatches `open-bella`; callers can also pass a typed message in
  // `detail.message` so it's auto-sent as the first turn.
  useEffect(() => {
    const openChat = (e: Event) => {
      const message = (e as CustomEvent<{message?: string}>).detail?.message;
      if (message) setSeed(message);
      setEverOpened(true);
      setOpen(true);
    };
    window.addEventListener('open-bella', openChat);
    return () => window.removeEventListener('open-bella', openChat);
  }, []);

  return (
    <>
      {/* The ONE chat panel site-wide — mounted once on first open and kept
          alive (hidden) so the conversation survives close/reopen. The overlay
          keeps it inside the viewport with a backdrop + Escape close. */}
      {everOpened ? (
        <ChatOverlay open={open} onClose={close}>
          <ChatPanel onClose={close} initialMessage={seed} />
        </ChatOverlay>
      ) : null}

      {/* Launcher — hidden on mobile while open (the full-screen panel + its
          header X take over there); stays on desktop as a rotated close affordance. */}
      <button
        type="button"
        onClick={() => {
          setEverOpened(true);
          setOpen((v) => !v);
        }}
        aria-label={open ? t('close') : t('open')}
        aria-expanded={open}
        className={cn(
          'fixed bottom-4 right-4 z-[70] grid h-14 w-14 place-items-center rounded-full bg-gradient-brand text-white shadow-glow transition-transform duration-200 sm:bottom-6 sm:right-6',
          'hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue/40 focus-visible:ring-offset-2',
          open && 'rotate-90 max-sm:hidden'
        )}
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M21 12a8 8 0 0 1-11.5 7.2L4 21l1.8-5.5A8 8 0 1 1 21 12Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
    </>
  );
}
