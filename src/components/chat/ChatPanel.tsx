'use client';

import {useCallback, useEffect, useRef, useState} from 'react';
import {useTranslations} from 'next-intl';
import {ArrowRight, ArrowUpRight, Mic, Phone, Search, SendHorizontal, Square, Volume2, VolumeX, X} from 'lucide-react';
import {WhatsAppIcon} from '@/components/ui/Button';
import {Link} from '@/i18n/navigation';
import {cn} from '@/lib/cn';
import {BellaAvatar} from './BellaAvatar';
import {ChatMarkdown} from './ChatMarkdown';
import {CHAT_COPY as C} from './copy';
import {GUIDE_CHIPS, actionKey, respond, type Action} from '@/lib/assistant/guide';
import {
  DEFAULT_LANG,
  canListen,
  canSpeak,
  createRecognition,
  loadReadAloudPref,
  readTranscript,
  saveReadAloudPref,
  speak,
  speechErrorMessage,
  stopSpeaking,
  type Recognition
} from '@/lib/assistant/speech';

/**
 * The Ananta materials guide panel — 100% DETERMINISTIC.
 * Every reply comes from respond() (src/lib/assistant/guide.ts). There is NO
 * network request of any kind from this panel: no model, no API route.
 * Voice input uses the browser's Web Speech API (transcript lands in the
 * editable input, never auto-sent); read-aloud uses speechSynthesis, only on
 * click.
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
const isPhone = () => typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches;

const chipCls =
  'inline-flex min-h-11 items-center rounded-full border border-indigo/20 bg-surface-blue px-3.5 py-1.5 text-left text-[13px] font-medium leading-snug text-indigo transition-colors hover:border-indigo/45 hover:bg-white text-balance';
const actionBase =
  'inline-flex min-h-11 max-w-full items-center gap-1.5 rounded-[8px] px-3 py-1.5 text-left text-[13px] font-semibold leading-snug transition-colors text-balance [overflow-wrap:anywhere]';
const toneCls = {
  default: 'border border-line bg-white text-ink hover:border-indigo/40 hover:text-indigo',
  price: 'bg-orange text-white hover:bg-orange-deep',
  whatsapp: 'border border-wa/40 bg-white text-ink hover:border-wa',
  call: 'border border-line bg-white text-ink hover:border-indigo/40'
} as const;

function ActionButton({action: a, onAsk, onLeave}: {action: Action; onAsk: (v: string) => void; onLeave: () => void}) {
  if (a.kind === 'ask')
    return (
      <button type="button" onClick={() => onAsk(a.value)} className={chipCls}>
        {a.label}
      </button>
    );
  if (a.kind === 'search')
    return (
      <button
        type="button"
        onClick={() => {
          onLeave();
          window.dispatchEvent(new CustomEvent('open-search', {detail: {q: a.value}}));
        }}
        className={cn(actionBase, toneCls.default)}
      >
        <Search className="h-4 w-4 shrink-0" aria-hidden />
        {a.label}
      </button>
    );
  if (a.kind === 'link')
    return (
      <Link href={a.href} onClick={() => isPhone() && onLeave()} className={cn(actionBase, toneCls[a.tone ?? 'default'])}>
        {a.label}
        <ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
      </Link>
    );
  const tone = a.tone ?? 'default';
  const newTab = a.value.startsWith('http');
  return (
    <a
      href={a.value}
      target={newTab ? '_blank' : undefined}
      rel={newTab ? 'noopener noreferrer' : undefined}
      className={cn(actionBase, toneCls[tone])}
    >
      {tone === 'whatsapp' || (tone === 'price' && a.value.includes('wa.me')) ? (
        <WhatsAppIcon className={cn('h-4 w-4 shrink-0', tone === 'whatsapp' && 'text-wa')} />
      ) : tone === 'call' ? (
        <Phone className="h-4 w-4 shrink-0" aria-hidden />
      ) : null}
      {a.label}
      {newTab && tone === 'default' ? <ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden /> : null}
      {newTab ? <span className="sr-only"> (opens in a new tab)</span> : null}
    </a>
  );
}

function Wave() {
  return (
    <span aria-hidden className="flex h-5 items-center gap-[3px]">
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} className="chat-wave-bar block h-5 w-[3px] rounded-full bg-orange" style={{animationDelay: `${i * 0.12}s`}} />
      ))}
    </span>
  );
}

export default function ChatPanel({open, onClose, seed}: {open: boolean; onClose: () => void; seed?: {message: string; n: number}}) {
  const t = useTranslations('chat');
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Feature detection (client-only component: safe in initialisers).
  const [voiceOk] = useState(canListen);
  const [ttsOk] = useState(canSpeak);
  const [readAloud, setReadAloud] = useState(loadReadAloudPref);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const recRef = useRef<Recognition | null>(null);
  const baseRef = useRef('');
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState('');
  const [voiceError, setVoiceError] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({top: el.scrollHeight, behavior: 'auto'});
  }, [messages, interim]);

  const stopListening = useCallback((abort = false) => {
    const r = recRef.current;
    if (!r) return;
    try {
      if (abort) r.abort();
      else r.stop();
    } catch {
      /* already stopped */
    }
  }, []);

  const stopReading = useCallback(() => {
    stopSpeaking();
    setSpeakingId(null);
  }, []);

  const send = useCallback(
    (raw: string) => {
      const text = raw.trim();
      if (!text) return;
      stopReading();
      stopListening(true);
      const reply = respond(text);
      setMessages((prev) => [
        ...prev,
        {id: nextId(), role: 'user', content: text},
        {id: nextId(), role: 'assistant', content: reply.text, actions: reply.actions, intent: reply.intent}
      ]);
      setInput('');
      setVoiceError('');
    },
    [stopListening, stopReading]
  );

  // Seeded first turn from `open-bella` detail.message.
  const lastSeed = useRef(0);
  useEffect(() => {
    if (seed && seed.n !== lastSeed.current) {
      lastSeed.current = seed.n;
      send(seed.message);
    }
  }, [seed, send]);

  // Focus moves into the panel on open: the composer on desktop; the dialog
  // itself on phones (so the on-screen keyboard doesn't cover the sheet).
  const dialogRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => {
      if (dialogRef.current?.contains(document.activeElement)) return;
      (isPhone() ? dialogRef.current : inputRef.current)?.focus({preventScroll: true});
    }, 20);
    return () => window.clearTimeout(id);
  }, [open]);

  // Closing stops everything audible.
  useEffect(() => {
    if (!open) {
      stopSpeaking(); // speakingId is ignored while closed (see `reading`)
      stopListening(true);
    }
  }, [open, stopListening]);
  useEffect(
    () => () => {
      stopSpeaking();
      recRef.current?.abort();
    },
    []
  );

  const startListening = () => {
    if (listening) return stopListening();
    stopReading();
    setVoiceError('');
    const r = createRecognition(DEFAULT_LANG);
    if (!r) {
      setVoiceError(C.micUnsupported);
      return;
    }
    baseRef.current = input.trim();
    let gotFinal = false;
    r.onstart = () => {
      setListening(true);
      setStatus(C.listening);
    };
    r.onresult = (e) => {
      const {final, interim: live} = readTranscript(e);
      setInterim(live);
      if (final) {
        gotFinal = true;
        const next = [baseRef.current, final].filter(Boolean).join(' ');
        setInput(next);
      }
    };
    r.onerror = (e) => {
      const msg = speechErrorMessage(e.error);
      if (msg) setVoiceError(msg);
    };
    r.onend = () => {
      recRef.current = null;
      setListening(false);
      setInterim('');
      setStatus(gotFinal ? C.transcriptReady : '');
      // Back to the editable input — the user reviews and presses send.
      window.setTimeout(() => inputRef.current?.focus({preventScroll: true}), 0);
    };
    recRef.current = r;
    try {
      r.start();
      setListening(true);
    } catch {
      recRef.current = null;
      setVoiceError(speechErrorMessage(''));
    }
  };

  const toggleRead = (m: Msg) => {
    if (reading === m.id) return stopReading();
    const u = speak(m.content, {onEnd: () => setSpeakingId((cur) => (cur === m.id ? null : cur))});
    setSpeakingId(u ? m.id : null);
  };

  const toggleReadAloudPref = () => {
    const next = !readAloud;
    setReadAloud(next);
    saveReadAloudPref(next);
    if (!next) stopReading();
  };

  const lastAssistant = [...messages].reverse().find((m) => m.role === 'assistant');
  const showRead = ttsOk && readAloud;
  const reading = open ? speakingId : null;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal={false}
      aria-labelledby="assistant-title"
      tabIndex={-1}
      data-testid="assistant-panel"
      className={cn(
        'flex h-full w-full min-h-0 flex-col overflow-hidden bg-white outline-none',
        'rounded-t-[20px] border-t border-line shadow-lift pb-[env(safe-area-inset-bottom)]',
        'md:rounded-[16px] md:border md:pb-0'
      )}
    >
      {/* Drag-handle visual (phones) */}
      <div aria-hidden className="flex shrink-0 justify-center pt-2 md:hidden">
        <span className="h-1.5 w-10 rounded-full bg-ink/15" />
      </div>

      <div className="flex shrink-0 items-center gap-3 border-b border-line px-4 py-3">
        <BellaAvatar size={36} className="ring-2 ring-white" />
        <div className="min-w-0 flex-1 leading-tight">
          <h2 id="assistant-title" className="text-[15px] font-semibold text-ink [overflow-wrap:anywhere]">
            {t('title')}
          </h2>
          <p className="mt-0.5 text-[12px] leading-snug text-muted [overflow-wrap:anywhere]">{t('subtitle')}</p>
        </div>
        {ttsOk ? (
          <button
            type="button"
            onClick={toggleReadAloudPref}
            aria-pressed={readAloud}
            aria-label={readAloud ? C.readAloudOn : C.readAloudOff}
            title={readAloud ? C.readAloudOn : C.readAloudOff}
            data-testid="assistant-readaloud-pref"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-[10px] text-muted hover:bg-bg-soft hover:text-ink"
          >
            {readAloud ? <Volume2 className="h-[18px] w-[18px]" aria-hidden /> : <VolumeX className="h-[18px] w-[18px]" aria-hidden />}
          </button>
        ) : null}
        <button
          type="button"
          onClick={onClose}
          aria-label={t('close')}
          data-testid="assistant-close"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-[10px] border border-line bg-white text-ink hover:bg-bg-soft"
        >
          <X className="h-[18px] w-[18px]" aria-hidden />
        </button>
      </div>

      <div ref={scrollRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4" aria-live="polite" aria-relevant="additions">
        {/* Welcome state */}
        <div className="chat-rise" data-intent="greeting" data-testid="assistant-welcome">
          <p className="text-[17px] font-semibold text-ink">{C.welcomeHeading}</p>
          <div className="mt-1.5 text-[13.5px] leading-relaxed text-muted [overflow-wrap:anywhere]">{t('greeting')}</div>
          {messages.length === 0 ? (
            <>
              <p className="mt-3 text-[12px] font-medium uppercase tracking-[0.08em] text-steel">{C.welcomeHint}</p>
              <div className="mt-2 flex flex-wrap gap-2" data-testid="assistant-chips">
                {GUIDE_CHIPS.map((a) => (
                  <ActionButton key={actionKey(a)} action={a} onAsk={send} onLeave={onClose} />
                ))}
              </div>
            </>
          ) : null}
        </div>

        {messages.map((m) => (
          <div key={m.id} className={cn('chat-rise flex flex-col', m.role === 'user' ? 'items-end' : 'items-start')} data-intent={m.intent} data-role={m.role}>
            <span className="sr-only">{m.role === 'user' ? C.you : C.assistant}:</span>
            <div
              className={cn(
                'max-w-[92%] min-w-0 rounded-[14px] px-3.5 py-2.5 text-[13.5px] leading-relaxed [overflow-wrap:anywhere]',
                m.role === 'user' ? 'whitespace-pre-wrap rounded-br-[4px] bg-indigo text-white' : 'rounded-bl-[4px] border border-line bg-bg-soft text-ink'
              )}
            >
              {m.role === 'assistant' ? <ChatMarkdown text={m.content} /> : m.content}
            </div>
            {m.role === 'assistant' && showRead ? (
              <button
                type="button"
                onClick={() => toggleRead(m)}
                aria-pressed={reading === m.id}
                data-testid="assistant-read"
                className="mt-1 inline-flex min-h-11 items-center gap-1.5 rounded-[8px] px-2 text-[12.5px] font-medium text-muted hover:text-indigo"
              >
                {reading === m.id ? <Square className="h-3.5 w-3.5" aria-hidden /> : <Volume2 className="h-4 w-4" aria-hidden />}
                {reading === m.id ? C.stopReading : C.readAloud}
              </button>
            ) : null}
            {m === lastAssistant && m.actions?.length ? (
              <div role="group" aria-label={C.actionsLabel} className="mt-2 flex max-w-full flex-wrap gap-2" data-testid="assistant-actions">
                {m.actions.map((a) => (
                  <ActionButton key={actionKey(a)} action={a} onAsk={send} onLeave={onClose} />
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <form
        className="shrink-0 border-t border-line bg-white px-3 pb-3 pt-2.5"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <p className="sr-only" role="status" aria-live="polite" data-testid="assistant-voice-status">
          {status}
        </p>
        {listening ? (
          <div className="mb-2 flex items-center gap-3 rounded-[10px] bg-surface-blue px-3 py-2" data-testid="assistant-listening">
            <Wave />
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold text-indigo">{C.listening}</p>
              <p className="text-[12.5px] leading-snug text-muted [overflow-wrap:anywhere]" data-testid="assistant-interim">
                {interim || C.listeningHint}
              </p>
            </div>
          </div>
        ) : null}
        {voiceError ? (
          <div role="alert" className="mb-2 flex items-start gap-2 rounded-[10px] border border-orange/30 bg-orange/5 px-3 py-2 text-[12.5px] leading-snug text-ink" data-testid="assistant-voice-error">
            <span className="min-w-0 flex-1 [overflow-wrap:anywhere]">{voiceError}</span>
            <button type="button" onClick={() => setVoiceError('')} className="shrink-0 font-semibold text-indigo" aria-label={C.dismissError}>
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>
        ) : null}
        <div className="flex items-center gap-2">
          <label className="sr-only" htmlFor="assistant-input">
            {t('inputPlaceholder')}
          </label>
          <input
            ref={inputRef}
            id="assistant-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('inputPlaceholder')}
            autoComplete="off"
            enterKeyHint="send"
            className="min-h-11 min-w-0 flex-1 rounded-[10px] border border-line bg-bg-soft px-3.5 text-[16px] text-ink outline-none placeholder:text-steel focus:border-indigo/50 focus:bg-white"
          />
          {voiceOk ? (
            <button
              type="button"
              onClick={startListening}
              aria-label={listening ? C.micStop : C.mic}
              aria-pressed={listening}
              title={listening ? C.micStop : C.mic}
              data-testid="assistant-mic"
              className={cn(
                'grid h-11 w-11 shrink-0 place-items-center rounded-[10px] border transition-colors',
                listening ? 'chat-pulse border-red bg-red text-white' : 'border-line bg-white text-indigo hover:border-indigo/40'
              )}
            >
              {listening ? <Square className="h-4 w-4" aria-hidden /> : <Mic className="h-[18px] w-[18px]" aria-hidden />}
            </button>
          ) : null}
          <button
            type="submit"
            disabled={!input.trim()}
            aria-label={t('send')}
            data-testid="assistant-send"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-[10px] bg-indigo text-white transition-colors hover:bg-blue disabled:cursor-not-allowed disabled:bg-ink/15 disabled:text-ink/45"
          >
            <SendHorizontal className="h-[18px] w-[18px]" aria-hidden />
          </button>
        </div>
      </form>
    </div>
  );
}
