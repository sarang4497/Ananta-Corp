'use client';

import {useCallback, useEffect, useRef, useState} from 'react';
import {useTranslations} from 'next-intl';
import {buttonClassName} from '@/components/ui/Button';
import {Link} from '@/i18n/navigation';
import {cn} from '@/lib/cn';
import {BellaAvatar} from './BellaAvatar';
import {ChatMarkdown} from './ChatMarkdown';
import {GUIDE_CHIPS, respond, type Action} from '@/lib/assistant/guide';

/**
 * The Ananta materials guide panel — 100% DETERMINISTIC.
 * Every reply comes from respond() (src/lib/assistant/guide.ts), which builds
 * answers from verified catalogue/brand/company data. There is NO network
 * request of any kind: no model, no API route. Unknown questions get a safe
 * fallback with topic buttons + WhatsApp/contact.
 */

interface Msg {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  actions?: Action[];
  intent?: string;
}

let counter = 0;
const nextId = () => `m${++counter}`;

export default function ChatPanel({onClose, initialMessage}: {onClose: () => void; initialMessage?: string}) {
  const t = useTranslations('chat');
  const [messages, setMessages] = useState<Msg[]>(() => [
    {id: 'greeting', role: 'assistant', content: t('greeting'), actions: GUIDE_CHIPS, intent: 'greeting'}
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({top: el.scrollHeight, behavior: 'auto'});
  }, [messages]);

  const send = useCallback((textOverride?: string) => {
    const text = (textOverride ?? '').trim();
    if (!text) return;
    const reply = respond(text);
    setMessages((prev) => [
      ...prev,
      {id: nextId(), role: 'user', content: text},
      {id: nextId(), role: 'assistant', content: reply.text, actions: reply.actions, intent: reply.intent}
    ]);
    setInput('');
  }, []);

  const lastInitial = useRef<string | undefined>(undefined);
  useEffect(() => {
    const msg = initialMessage?.trim();
    if (msg && msg !== lastInitial.current) {
      lastInitial.current = msg;
      send(msg);
    }
  }, [initialMessage, send]);

  const lastAssistant = [...messages].reverse().find((m) => m.role === 'assistant');

  return (
    <div
      role="dialog"
      aria-label={t('title')}
      data-testid="assistant-panel"
      className="flex h-full w-full flex-col overflow-hidden rounded-[12px] border border-line bg-white shadow-lift"
    >
      <div className="flex shrink-0 items-center gap-2.5 border-b border-line bg-bg-soft px-3.5 py-2.5">
        <BellaAvatar size={36} className="ring-2 ring-white" />
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-sm font-semibold text-ink">{t('title')}</p>
          <p className="truncate text-[11px] text-muted">{t('subtitle')}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={t('close')}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-[8px] border border-line bg-white text-ink hover:bg-bg-soft"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div ref={scrollRef} className="min-h-0 flex-1 space-y-2.5 overflow-y-auto overscroll-contain px-3.5 py-3" aria-live="polite">
        {messages.map((m) => (
          <div key={m.id} className={cn('chat-rise flex flex-col', m.role === 'user' ? 'items-end' : 'items-start')} data-intent={m.intent}>
            <div
              className={cn(
                'max-w-[90%] rounded-[12px] px-3 py-2 text-[13px] leading-relaxed',
                m.role === 'user' ? 'whitespace-pre-wrap rounded-br-[4px] bg-indigo text-white' : 'rounded-bl-[4px] border border-line bg-white text-ink'
              )}
            >
              {m.role === 'assistant' ? <ChatMarkdown text={m.content} /> : m.content}
            </div>
            {m === lastAssistant && m.actions?.length ? (
              <div className="mt-2 flex max-w-full flex-wrap gap-1.5" data-testid="assistant-actions">
                {m.actions.map((a) =>
                  a.kind === 'ask' ? (
                    <button
                      key={a.label}
                      type="button"
                      onClick={() => send(a.value)}
                      className="min-h-9 rounded-[6px] border border-indigo/25 bg-surface-blue px-2.5 text-left text-[12.5px] font-medium text-indigo hover:border-indigo/50"
                    >
                      {a.label}
                    </button>
                  ) : a.kind === 'link' ? (
                    <Link key={a.label} href={a.value as '/'} className="inline-flex min-h-9 items-center rounded-[6px] border border-line px-2.5 text-[12.5px] font-semibold text-ink hover:border-indigo/40">
                      {a.label}
                    </Link>
                  ) : (
                    <a
                      key={a.label}
                      href={a.value}
                      target={a.value.startsWith('http') ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      className="inline-flex min-h-9 items-center rounded-[6px] bg-orange px-2.5 text-[12.5px] font-semibold text-white hover:bg-orange-deep"
                    >
                      {a.label}
                    </a>
                  )
                )}
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <form
        className="shrink-0 border-t border-line bg-bg-soft px-2.5 py-2.5"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <div className="flex items-end gap-2">
          <label className="sr-only" htmlFor="assistant-input">
            {t('inputPlaceholder')}
          </label>
          <input
            id="assistant-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('inputPlaceholder')}
            autoComplete="off"
            className="min-h-10 flex-1 rounded-[8px] border border-line bg-white px-3 text-[16px] text-ink outline-none placeholder:text-steel focus:border-indigo/50"
          />
          <button type="submit" disabled={!input.trim()} aria-label={t('send')} className={buttonClassName('primary', 'md', 'h-10 w-10 shrink-0 !px-0')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M4 12l16-8-6 16-2.5-6.5L4 12Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
