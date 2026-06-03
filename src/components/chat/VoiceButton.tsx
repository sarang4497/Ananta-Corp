'use client';

import {useCallback, useEffect, useRef, useState} from 'react';
import {useTranslations} from 'next-intl';
import {cn} from '@/lib/cn';
import {
  getVoiceProvider,
  isVoiceAvailable,
  VoiceError,
  type VoiceSession
} from '@/lib/voice';

/**
 * Mic button for the chat input. Uses the active voice provider (Web Speech by
 * default, or server STT via /api/transcribe). Shows a recording pulse + live
 * CSS waveform. Interim text streams into the input via `onText`; the settled
 * transcript is delivered via `onFinal`. Mic-permission denial is handled
 * gracefully (the button stays, an inline note explains, typing still works).
 */
export function VoiceButton({
  lang,
  onText,
  onFinal,
  disabled
}: {
  lang: string;
  onText: (text: string) => void;
  onFinal: (text: string) => void;
  disabled?: boolean;
}) {
  const t = useTranslations('chat');
  const [supported, setSupported] = useState(false);
  const [recording, setRecording] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const sessionRef = useRef<VoiceSession | null>(null);

  useEffect(() => {
    setSupported(isVoiceAvailable());
  }, []);

  const describe = useCallback(
    (code: string) =>
      code === 'permission-denied'
        ? t('micDenied')
        : code === 'unsupported'
          ? t('micUnsupported')
          : t('error'),
    [t]
  );

  const start = useCallback(async () => {
    setNote(null);
    try {
      const session = await getVoiceProvider().start({
        lang,
        onStart: () => setRecording(true),
        onText: (text, isFinal) => {
          if (isFinal) {
            setRecording(false);
            if (text) onFinal(text);
          } else {
            onText(text);
          }
        },
        onError: (e) => {
          setRecording(false);
          setNote(describe(e.code));
        }
      });
      sessionRef.current = session;
    } catch (e) {
      setRecording(false);
      setNote(describe(e instanceof VoiceError ? e.code : 'unknown'));
    }
  }, [lang, onText, onFinal, describe]);

  const stop = useCallback(async () => {
    const s = sessionRef.current;
    sessionRef.current = null;
    setRecording(false);
    await s?.stop();
  }, []);

  // Stop recording if the component unmounts.
  useEffect(() => () => sessionRef.current?.cancel(), []);

  if (!supported) return null;

  return (
    <div className="relative flex items-center">
      <button
        type="button"
        onClick={() => (recording ? stop() : start())}
        disabled={disabled}
        aria-pressed={recording}
        aria-label={recording ? t('micStop') : t('mic')}
        title={recording ? t('micStop') : t('mic')}
        className={cn(
          'grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-colors disabled:opacity-50',
          recording
            ? 'chat-pulse border-red/40 bg-red/10 text-red'
            : 'border-border bg-bg-soft/60 text-muted hover:text-indigo'
        )}
      >
        {recording ? (
          // Live waveform — pure CSS, staggered bars.
          <span className="flex items-end gap-[2px]" aria-hidden>
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="chat-wave-bar h-3 w-[2px] rounded-full bg-red"
                style={{animationDelay: `${i * 0.12}s`}}
              />
            ))}
          </span>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M12 15a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v6a3 3 0 0 0 3 3Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5 11a7 7 0 0 0 14 0M12 18v3"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      {note ? (
        <span className="absolute bottom-full right-0 mb-2 w-48 rounded-lg border border-border bg-bg px-3 py-2 text-[11px] text-muted shadow-card">
          {note}
        </span>
      ) : null}
    </div>
  );
}
