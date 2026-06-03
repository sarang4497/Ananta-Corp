'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';
import {buttonClassName} from '@/components/ui/Button';

const PRODUCT_OPTIONS = [
  'plywood',
  'mdf',
  'moistMaster',
  'prelam',
  'flushDoor',
  'smartLocks',
  'multiple',
  'other'
] as const;

/**
 * The contact enquiry form — name, phone, email, product interest, quantity,
 * message. POSTs to /api/lead; if that fails, falls back to a prefilled
 * mailto: so no enquiry is ever lost.
 */
export function ContactLeadForm() {
  const t = useTranslations('contact.form');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === 'sending' || status === 'sent') return;
    setStatus('sending');

    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get('name') ?? '').trim();
    const phone = String(data.get('phone') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const product = String(data.get('product') ?? '').trim();
    const quantity = String(data.get('quantity') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();

    const composed = [
      product && `Product interest: ${product}`,
      quantity && `Quantity: ${quantity}`,
      message
    ]
      .filter(Boolean)
      .join('\n');

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name, phone, email, message: composed, source: 'contact-form'})
      });
      const json = (await res.json()) as {ok?: boolean};
      if (!json.ok) throw new Error('lead-failed');
      setStatus('sent');
    } catch {
      // Fallback: open a prefilled email so the enquiry still reaches us.
      const subject = encodeURIComponent(`Enquiry from ${name || 'website'}`);
      const body = encodeURIComponent(`${composed}\n\nName: ${name}\nPhone: ${phone}\nEmail: ${email}`);
      window.location.href = `mailto:info@anantacorporation.com?subject=${subject}&body=${body}`;
      setStatus('error');
    }
  }

  const inputClass =
    'w-full rounded-xl border border-border bg-bg-soft/50 px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-indigo/50 focus:bg-bg';
  const labelClass = 'flex flex-col gap-1.5';
  const labelText = 'text-sm font-medium text-ink';

  if (status === 'sent') {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-green/30 bg-green/5 px-6 py-12 text-center">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-green/15 text-green">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <p className="text-base font-medium text-ink">{t('success')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          <span className={labelText}>{t('name')} *</span>
          <input type="text" name="name" required placeholder={t('namePlaceholder')} className={inputClass} />
        </label>
        <label className={labelClass}>
          <span className={labelText}>{t('phone')} *</span>
          <input type="tel" name="phone" required placeholder={t('phonePlaceholder')} className={inputClass} />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          <span className={labelText}>{t('email')} *</span>
          <input type="email" name="email" required placeholder={t('emailPlaceholder')} className={inputClass} />
        </label>
        <label className={labelClass}>
          <span className={labelText}>{t('quantity')}</span>
          <input type="text" name="quantity" placeholder={t('quantityPlaceholder')} className={inputClass} />
        </label>
      </div>
      <label className={labelClass}>
        <span className={labelText}>{t('product')}</span>
        <select name="product" defaultValue="" className={inputClass}>
          <option value="" disabled>
            {t('productPlaceholder')}
          </option>
          {PRODUCT_OPTIONS.map((opt) => (
            <option key={opt} value={t(`productOptions.${opt}`)}>
              {t(`productOptions.${opt}`)}
            </option>
          ))}
        </select>
      </label>
      <label className={labelClass}>
        <span className={labelText}>{t('message')}</span>
        <textarea name="message" rows={4} placeholder={t('messagePlaceholder')} className={`${inputClass} resize-none`} />
      </label>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button type="submit" disabled={status === 'sending'} className={buttonClassName('orange', 'lg', 'font-bold')}>
          {status === 'sending' ? t('sending') : t('submit')}
        </button>
        <span className="text-xs text-muted">{t('note')}</span>
      </div>
      {status === 'error' && <p className="text-sm text-red">{t('error')}</p>}
    </form>
  );
}
