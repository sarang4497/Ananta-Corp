'use client';

import {useCallback, useEffect, useRef, useState} from 'react';
import {useTranslations} from 'next-intl';
import {buttonClassName} from '@/components/ui/Button';
import {whatsappUrl} from '@/lib/whatsapp';
import {cn} from '@/lib/cn';
import {BellaAvatar} from './BellaAvatar';
import {ChatMarkdown} from './ChatMarkdown';

/**
 * The chat assistant panel. Code-split into its own lazy chunk (see
 * ChatWidget). Streams from /api/chat and renders markdown.
 * `initialMessage` is auto-sent once on open.
 * Simplest version: no bot protection / email gating.
 */

interface Msg {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  seed?: boolean; // greeting — shown but not sent as history
}

const STARTERS = [
  'What products do you supply?',
  'Which plywood is right for a kitchen?',
  "What's the difference between MDF and HDHMR?",
  'How do I get a price quote?'
];

const ERROR_MSG =
  "I'm having trouble right now — please reach us on WhatsApp (https://wa.me/918320052838) or via /contact.";

let counter = 0;
const nextId = () => `m${++counter}`;

export default function ChatPanel({
  onClose,
  initialMessage
}: {
  onClose: () => void;
  initialMessage?: string;
}) {
  const t = useTranslations('chat');

  const [messages, setMessages] = useState<Msg[]>(() => [
    {id: 'greeting', role: 'assistant', content: t('greeting'), seed: true}
  ]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [capped, setCapped] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  // True when the user is at/near the bottom of the messages area. Streaming
  // tokens only auto-scroll while this holds — if the user scrolls UP to read,
  // we stop yanking the view down to the latest token.
  const [nearBottom, setNearBottom] = useState(true);

  const hasUserMsg = messages.some((m) => m.role === 'user');

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'auto') => {
    const el = scrollRef.current;
    if (el) el.scrollTo({top: el.scrollHeight, behavior});
  }, []);

  const onMessagesScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setNearBottom(distanceFromBottom < 80);
  }, []);

  // Auto-scroll on new content ONLY when the user is already near the bottom, or
  // when they just sent a message (last message is their own). While they're
  // scrolled up reading, streaming tokens never force the view down.
  useEffect(() => {
    const last = messages[messages.length - 1];
    if (nearBottom || last?.role === 'user') scrollToBottom('auto');
  }, [messages, busy, nearBottom, scrollToBottom]);

  const callApi = useCallback(async (history: Msg[]) => {
    setBusy(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          messages: history
            .filter((m) => !m.seed)
            .map((m) => ({role: m.role, content: m.content}))
        })
      });
      if (!res.ok || !res.body) throw new Error('bad-response');

      // Server signals the conversation has hit its message cap.
      const isCapped = res.headers.get('x-chat-capped') === 'true';

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      const id = nextId();
      setMessages((prev) => [...prev, {id, role: 'assistant', content: ''}]);
      let acc = '';
      for (;;) {
        const {done, value} = await reader.read();
        if (done) break;
        acc += decoder.decode(value, {stream: true});
        setMessages((prev) => prev.map((m) => (m.id === id ? {...m, content: acc} : m)));
      }
      if (!acc.trim()) {
        setMessages((prev) => prev.map((m) => (m.id === id ? {...m, content: ERROR_MSG} : m)));
      }
      if (isCapped) setCapped(true);
    } catch {
      setMessages((prev) => [...prev, {id: nextId(), role: 'assistant', content: ERROR_MSG}]);
    } finally {
      setBusy(false);
    }
  }, []);

  const send = useCallback(
    (textOverride?: string) => {
      const text = (textOverride ?? input).trim();
      if (!text || busy || capped) return;
      const userMsg: Msg = {id: nextId(), role: 'user', content: text};
      const history = [...messages, userMsg];
      setMessages(history);
      setInput('');
      void callApi(history);
    },
    [input, busy, capped, messages, callApi]
  );

  // Auto-send the message typed in the hero box. Tracks the last value sent so a
  // NEW hero submission into the already-mounted panel still fires (without
  // re-sending the same one on re-render).
  const lastInitial = useRef<string | undefined>(undefined);
  useEffect(() => {
    const msg = initialMessage?.trim();
    if (msg && msg !== lastInitial.current) {
      lastInitial.current = msg;
      send(msg);
    }
  }, [initialMessage, send]);

  return (
    <div
      role="dialog"
      aria-label={t('title')}
      className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border bg-bg shadow-[0_30px_80px_-24px_rgba(79,70,229,0.55)]"
    >
      {/* Header (pinned) — assistant identity over a soft brand-gradient wash. */}
      <div
        className="relative z-10 flex shrink-0 items-center gap-2.5 border-b border-border bg-gradient-to-r from-blue/10 via-bg-soft/70 to-indigo/10 px-3.5 py-2.5"
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-brand"
          aria-hidden
        />
        <div className="relative shrink-0">
          <BellaAvatar size={38} className="ring-2 ring-white shadow-[0_6px_16px_-6px_rgba(24,119,242,0.6)]" />
          {/* Online status badge. */}
          <span
            className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-bg bg-green"
            aria-hidden
          />
        </div>
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-sm font-bold text-ink">{t('title')}</p>
          <p className="truncate text-[11px] text-muted">{t('subtitle')}</p>
        </div>
        {/* Close — always visible, 40px hit area, high contrast. */}
        <button
          type="button"
          onClick={onClose}
          aria-label={t('close')}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border bg-bg text-ink shadow-sm transition-colors hover:bg-bg-soft active:bg-bg-soft"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Messages zone. The inner div is the ONLY scrolling container:
          `data-lenis-prevent` stops the site's Lenis smooth-scroll from
          hijacking the wheel here (which otherwise scrolled the page behind),
          and `overscroll-contain` stops scroll-chaining to <body>. */}
      <div className="relative min-h-0 flex-1">
      <div
        ref={scrollRef}
        onScroll={onMessagesScroll}
        data-lenis-prevent
        className="h-full space-y-2.5 overflow-y-auto overscroll-contain px-3.5 py-3"
      >
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn('chat-rise flex', m.role === 'user' ? 'justify-end' : 'justify-start')}
          >
            <div
              className={cn(
                'max-w-[88%] rounded-2xl px-3 py-2 text-[13px] leading-relaxed',
                m.role === 'user'
                  ? 'whitespace-pre-wrap rounded-br-md bg-gradient-brand text-white shadow-[0_6px_18px_-6px_rgba(79,70,229,0.55)]'
                  : 'rounded-bl-md border border-border/60 bg-bg text-ink shadow-sm'
              )}
            >
              {m.role === 'assistant' ? m.content ? <ChatMarkdown text={m.content} /> : '…' : m.content}
            </div>
          </div>
        ))}

        {busy && messages[messages.length - 1]?.role === 'user' ? (
          <div className="chat-rise flex justify-start">
            <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-border/60 bg-bg px-3.5 py-3 shadow-sm">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="chat-wave-bar h-1.5 w-1.5 rounded-full bg-muted"
                  style={{animationDelay: `${i * 0.15}s`}}
                />
              ))}
            </div>
          </div>
        ) : null}

        {/* Starter chips — only before the first user message. */}
        {!hasUserMsg && !busy ? (
          <div className="flex flex-col items-start gap-1.5 pt-1">
            {STARTERS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => send(s)}
                className="rounded-full border border-indigo/20 bg-indigo/5 px-3 py-1.5 text-left text-xs font-medium text-indigo transition-all hover:border-indigo/40 hover:bg-indigo/10 hover:shadow-sm"
              >
                {s}
              </button>
            ))}
          </div>
        ) : null}
      </div>

        {/* "↓ New messages" — shown only when the user has scrolled up; jumps
            back to the latest and re-enables auto-scroll. */}
        {!nearBottom ? (
          <button
            type="button"
            onClick={() => scrollToBottom('smooth')}
            className="absolute bottom-3 left-1/2 z-20 -translate-x-1/2 rounded-full border border-border bg-bg px-3 py-1.5 text-xs font-semibold text-indigo shadow-md transition-colors hover:bg-bg-soft"
          >
            ↓ New messages
          </button>
        ) : null}
      </div>

      {/* Input — or the warm capped CTA once the conversation cap is reached.
          Pinned (shrink-0) with safe-area padding so it clears the home bar. */}
      {capped ? (
        <div
          className="shrink-0 border-t border-border bg-bg-soft/40 px-4 py-4"
        >
          <p className="mb-3 text-center text-xs leading-relaxed text-muted">
            We keep chats short and focused — the best next step is a quick call with our team.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <a href="/contact" className={buttonClassName('blue', 'md', 'font-bold')}>
              Book a call
            </a>
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClassName('secondary', 'md')}
            >
              WhatsApp
            </a>
          </div>
        </div>
      ) : (
        <div
          className="shrink-0 border-t border-border bg-bg-soft/40 px-2.5 py-2.5"
        >
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              rows={1}
              placeholder={t('inputPlaceholder')}
              className="max-h-24 min-h-[2.25rem] flex-1 resize-none rounded-xl border border-border bg-bg px-3 py-2 text-[16px] text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-indigo/50"
            />
            <button
              type="button"
              onClick={() => send()}
              disabled={busy || !input.trim()}
              aria-label={t('send')}
              className={buttonClassName('primary', 'md', 'h-9 w-9 shrink-0 !px-0')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M4 12l16-8-6 16-2.5-6.5L4 12Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
