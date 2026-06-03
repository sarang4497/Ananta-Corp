'use client';

import {useEffect, useRef} from 'react';

/**
 * Cloudflare Turnstile (invisible bot filter). Renders the widget, solves it
 * with minimal/zero interaction, and hands the token to `onToken`.
 *
 * If NEXT_PUBLIC_TURNSTILE_SITE_KEY is unset (local dev), it immediately calls
 * onToken('') — the server treats Turnstile as disabled when the secret is unset.
 */

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

interface TurnstileApi {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  remove: (id: string) => void;
  reset: (id?: string) => void;
}
declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let scriptPromise: Promise<void> | null = null;
function loadScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.turnstile) return Promise.resolve();
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise<void>((resolve, reject) => {
    const s = document.createElement('script');
    s.src = SCRIPT_SRC;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('turnstile-load-failed'));
    document.head.appendChild(s);
  });
  return scriptPromise;
}

export function Turnstile({onToken}: {onToken: (token: string) => void}) {
  const ref = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  useEffect(() => {
    if (!SITE_KEY) {
      onToken(''); // disabled in dev
      return;
    }
    let cancelled = false;
    loadScript()
      .then(() => {
        if (cancelled || !ref.current || !window.turnstile) return;
        widgetId.current = window.turnstile.render(ref.current, {
          sitekey: SITE_KEY,
          appearance: 'interaction-only',
          callback: (token: string) => onToken(token),
          'error-callback': () => onToken(''),
          'expired-callback': () => window.turnstile?.reset(widgetId.current ?? undefined)
        });
      })
      .catch(() => onToken(''));
    return () => {
      cancelled = true;
      if (widgetId.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetId.current);
        } catch {
          /* ignore */
        }
      }
    };
  }, [onToken]);

  // Invisible in the interaction-only mode; renders a challenge only if needed.
  return <div ref={ref} aria-hidden className="empty:hidden" />;
}
