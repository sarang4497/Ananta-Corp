'use client';

import {useCallback, useState} from 'react';
import {useTranslations} from 'next-intl';
import {buttonClassName} from '@/components/ui/Button';
import {cn} from '@/lib/cn';
import {Turnstile} from './Turnstile';

/**
 * Inline email-verification step shown after the free message. Captures the
 * lead, runs the Turnstile bot filter, and confirms a 6-digit code. On success
 * it calls `onVerified` so the chat can resume.
 *
 * GDPR: an explicit consent line + privacy-policy link are shown before any
 * email is sent.
 * TODO(privacy): point the privacy link at the real policy once the
 *   /privacy page is finalised.
 */

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const inputClass =
  'w-full rounded-xl border border-border bg-bg-soft/50 px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-indigo/50 focus:bg-bg';

export function EmailGate({onVerified}: {onVerified: (email: string) => void}) {
  const t = useTranslations('chat.gate');
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [consent, setConsent] = useState(false);
  const [token, setToken] = useState<string>('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onToken = useCallback((tok: string) => setToken(tok), []);

  async function requestCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!EMAIL_RE.test(email)) return setError(t('invalidEmail'));
    if (!consent) return setError(t('consentRequired'));

    setBusy(true);
    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({action: 'request', email, consent, turnstileToken: token})
      });
      const data = (await res.json()) as {ok: boolean; error?: string};
      if (!data.ok) return setError(t('sendError'));
      setStep('code');
    } catch {
      setError(t('sendError'));
    } finally {
      setBusy(false);
    }
  }

  async function confirmCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({action: 'confirm', email, code})
      });
      const data = (await res.json()) as {ok: boolean; verified?: boolean; error?: string};
      if (data.ok && data.verified) {
        onVerified(email);
        return;
      }
      const map: Record<string, string> = {
        expired: t('expired'),
        'too-many-attempts': t('tooMany'),
        mismatch: t('codeError'),
        'not-found': t('expired')
      };
      setError(map[data.error ?? ''] ?? t('codeError'));
    } catch {
      setError(t('codeError'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="chat-rise rounded-2xl border border-indigo/20 bg-bg-soft/50 p-4">
      {step === 'email' ? (
        <form onSubmit={requestCode} className="flex flex-col gap-3" noValidate>
          <div>
            <p className="text-sm font-semibold text-ink">{t('emailTitle')}</p>
            <p className="mt-0.5 text-xs text-muted">{t('emailSub')}</p>
          </div>
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('emailPlaceholder')}
            className={inputClass}
            required
          />
          <label className="flex items-start gap-2 text-[11px] leading-snug text-muted">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5 accent-indigo"
            />
            <span>
              {t('consent')}{' '}
              <a href="/privacy" target="_blank" rel="noreferrer" className="text-indigo underline">
                {t('privacy')}
              </a>
            </span>
          </label>
          <Turnstile onToken={onToken} />
          {error ? <p className="text-xs text-red">{error}</p> : null}
          <button type="submit" disabled={busy} className={buttonClassName('primary', 'md')}>
            {busy ? t('sending') : t('sendCode')}
          </button>
        </form>
      ) : (
        <form onSubmit={confirmCode} className="flex flex-col gap-3" noValidate>
          <div>
            <p className="text-sm font-semibold text-ink">{t('codeTitle')}</p>
            <p className="mt-0.5 text-xs text-muted">{t('codeSub', {email})}</p>
          </div>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            placeholder={t('codePlaceholder')}
            className={cn(inputClass, 'text-center text-lg tracking-[0.5em]')}
            required
          />
          {error ? <p className="text-xs text-red">{error}</p> : null}
          <button
            type="submit"
            disabled={busy || code.length < 6}
            className={buttonClassName('primary', 'md')}
          >
            {busy ? t('verifying') : t('verify')}
          </button>
          <div className="flex items-center justify-between text-[11px] text-muted">
            <button type="button" onClick={requestCode} className="underline hover:text-ink">
              {t('resend')}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep('email');
                setCode('');
                setError(null);
              }}
              className="underline hover:text-ink"
            >
              {t('changeEmail')}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
