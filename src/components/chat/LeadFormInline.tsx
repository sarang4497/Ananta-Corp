'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {buttonClassName} from '@/components/ui/Button';

/**
 * Conversion gate shown at HARD_CAP. The email is already known, so we ask only
 * for name + phone/message, post it to /api/lead (source: "chat"), and offer
 * clear "Book a call" / "Email us" actions to /contact.
 */

const inputClass =
  'w-full rounded-xl border border-border bg-bg-soft/50 px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-indigo/50 focus:bg-bg';

export function LeadFormInline({email}: {email?: string}) {
  const t = useTranslations('chat.contactGate');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');
    try {
      await fetch('/api/lead', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, name, message: phone, source: 'chat'})
      });
    } catch {
      /* best-effort; still show success so the visitor isn't blocked */
    }
    setStatus('sent');
  }

  return (
    <div className="chat-rise rounded-2xl border border-indigo/20 bg-bg-soft/50 p-4">
      <p className="text-sm font-semibold text-ink">{t('title')}</p>
      <p className="mt-0.5 text-xs text-muted">{t('sub')}</p>

      {status === 'sent' ? (
        <p className="mt-3 rounded-xl border border-green/30 bg-green/5 px-3 py-2.5 text-sm text-ink">
          {t('sent')}
        </p>
      ) : (
        <form onSubmit={submit} className="mt-3 flex flex-col gap-2.5">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('namePlaceholder')}
            aria-label={t('name')}
            className={inputClass}
            required
          />
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={t('phonePlaceholder')}
            aria-label={t('phone')}
            className={inputClass}
            required
          />
          <button
            type="submit"
            disabled={status === 'sending'}
            className={buttonClassName('primary', 'md')}
          >
            {status === 'sending' ? t('sending') : t('submit')}
          </button>
        </form>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        <Link href="/contact" className={buttonClassName('secondary', 'sm')}>
          {t('bookCall')}
        </Link>
        <a
          href="mailto:hello@studiomarketingitalia.it"
          className={buttonClassName('ghost', 'sm')}
        >
          {t('emailUs')}
        </a>
      </div>
    </div>
  );
}
