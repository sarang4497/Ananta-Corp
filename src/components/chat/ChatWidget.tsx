'use client';

import dynamic from 'next/dynamic';
import {useEffect, useState} from 'react';
import {ChatOverlay} from './ChatOverlay';

// The panel (chat UI + voice + Turnstile + gates) is code-split into its own
// chunk. ssr:false + dynamic import keeps all of it out of the initial payload;
// the JS only downloads the first time the visitor opens the chat.
const ChatPanel = dynamic(() => import('./ChatPanel'), {ssr: false});

/**
 * The materials assistant host. Mounted globally; renders nothing until the
 * ContactDock (or any AskBellaButton) dispatches `open-bella`, then loads the
 * panel chunk inside a viewport-contained overlay. The launcher lives in the
 * ContactDock so WhatsApp + assistant read as one contact system.
 */
export function ChatWidget() {
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

  // Tell the ContactDock (the single floating-control manager, which owns the
  // assistant launcher) to step aside while the panel is open.
  useEffect(() => {
    const html = document.documentElement;
    if (open) html.dataset.chatOpen = '1';
    else delete html.dataset.chatOpen;
  }, [open]);

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

    </>
  );
}
