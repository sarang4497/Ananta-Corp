'use client';

import dynamic from 'next/dynamic';
import {useCallback, useEffect, useRef, useState} from 'react';
import {ChatOverlay} from './ChatOverlay';

// The panel (chat UI + voice + read-aloud) is code-split into its own chunk and
// only downloads the first time the visitor opens the assistant.
const ChatPanel = dynamic(() => import('./ChatPanel'), {ssr: false});

/**
 * The materials assistant host. Mounted globally; renders nothing until any
 * CTA dispatches `open-bella` (detail?: {message?: string}), then loads the
 * panel chunk inside the overlay. The launcher lives in the ContactDock, which
 * steps aside while html[data-chat-open] is set.
 */
export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [everOpened, setEverOpened] = useState(false);
  const [seed, setSeed] = useState<{message: string; n: number} | undefined>(undefined);
  const returnTo = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    // Speech never outlives the panel.
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    // Return focus to the launcher once the dock is interactive again
    // (it un-inerts after data-chat-open is removed).
    const back = returnTo.current;
    window.setTimeout(() => {
      const fallback = document.querySelector<HTMLElement>(
        window.matchMedia('(max-width: 767px)').matches ? '[data-testid="assistant-launcher"]' : '[data-testid="assistant-launcher-desktop"]'
      );
      const target = back && back.isConnected && !back.closest('[inert]') ? back : fallback;
      target?.focus({preventScroll: true});
    }, 60);
  }, []);

  useEffect(() => {
    let n = 0;
    const openChat = (e: Event) => {
      const message = (e as CustomEvent<{message?: string} | undefined>).detail?.message?.trim();
      const active = document.activeElement;
      if (active instanceof HTMLElement && active !== document.body && !active.closest('[data-testid="assistant-holder"]')) returnTo.current = active;
      if (message) setSeed({message, n: ++n});
      setEverOpened(true);
      setOpen(true);
    };
    window.addEventListener('open-bella', openChat);
    return () => window.removeEventListener('open-bella', openChat);
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    if (open) html.dataset.chatOpen = '1';
    else delete html.dataset.chatOpen;
  }, [open]);

  return everOpened ? (
    <ChatOverlay open={open} onClose={close}>
      <ChatPanel open={open} onClose={close} seed={seed} />
    </ChatOverlay>
  ) : null;
}
