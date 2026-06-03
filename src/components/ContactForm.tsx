'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';
import {buttonClassName} from '@/components/ui/Button';

/** Demo contact form — client leaf. Mock submit, no backend. */
export function ContactForm() {
  const t = useTranslations('contact.form');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status !== 'idle') return;
    setStatus('sending');
    window.setTimeout(() => setStatus('sent'), 700);
  }

  const inputClass =
    'w-full rounded-xl border border-border bg-bg-soft/50 px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-indigo/50 focus:bg-bg';

  if (status === 'sent') {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-green/30 bg-green/5 px-6 py-12 text-center">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-green/15 text-green">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M5 13l4 4L19 7"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <p className="text-base font-medium text-ink">{t('success')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-ink">{t('name')}</span>
          <input
            type="text"
            name="name"
            required
            placeholder={t('namePlaceholder')}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-ink">{t('email')}</span>
          <input
            type="email"
            name="email"
            required
            placeholder={t('emailPlaceholder')}
            className={inputClass}
          />
        </label>
      </div>
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-ink">{t('message')}</span>
        <textarea
          name="message"
          required
          rows={5}
          placeholder={t('messagePlaceholder')}
          className={`${inputClass} resize-none`}
        />
      </label>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={status === 'sending'}
          className={buttonClassName('primary', 'lg')}
        >
          {status === 'sending' ? t('sending') : t('submit')}
        </button>
        <span className="text-xs text-muted">{t('note')}</span>
      </div>
    </form>
  );
}
