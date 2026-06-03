'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';
import {buttonClassName} from '@/components/ui/Button';
import {cn} from '@/lib/cn';

/**
 * Homepage contact form. Client leaf — all fields required (inline validation),
 * posts Name / Email / Company / Message to /api/lead (source: "contact-form"),
 * and shows a warm success state.
 */

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
type Field = 'name' | 'email' | 'company' | 'message';
const FIELDS: Field[] = ['name', 'email', 'company', 'message'];

const inputBase =
  'w-full rounded-xl border bg-bg-soft/50 px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-muted/70 focus:bg-bg';

export function ContactForm() {
  const t = useTranslations('home.contact');
  const [values, setValues] = useState<Record<Field, string>>({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const [touched, setTouched] = useState<Record<Field, boolean>>({
    name: false,
    email: false,
    company: false,
    message: false
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  function errorFor(f: Field): string | null {
    const v = values[f].trim();
    if (!v) return t('required');
    if (f === 'email' && !EMAIL_RE.test(v)) return t('invalidEmail');
    return null;
  }
  const isValid = FIELDS.every((f) => !errorFor(f));

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setTouched({name: true, email: true, company: true, message: true});
    if (!isValid || status !== 'idle') return;
    setStatus('sending');
    // Best-effort server capture (no email backend wired yet — logs the lead).
    try {
      await fetch('/api/lead', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({...values, source: 'contact-form'})
      });
    } catch {
      /* best-effort; still send the email below */
    }
    // Reliable delivery: open a prefilled email to the team.
    const subject = `New enquiry from ${values.name}${values.company ? ` (${values.company})` : ''}`;
    const body = [
      `Name: ${values.name}`,
      `Email: ${values.email}`,
      `Company: ${values.company}`,
      '',
      'Message:',
      values.message
    ].join('\n');
    window.location.href = `mailto:info@studiomarketingitalia.it?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    setStatus('sent');
  }

  if (status === 'sent') {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-green/30 bg-green/5 px-6 py-16 text-center">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-green/15 text-green">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <p className="text-lg font-semibold text-ink">{t('success')}</p>
        <p className="max-w-xs text-sm leading-relaxed text-muted">{t('successSub')}</p>
      </div>
    );
  }

  // Plain helper (called, not mounted as <Component/>) so inputs keep focus
  // across re-renders.
  function field(f: Field, type = 'text') {
    const err = touched[f] ? errorFor(f) : null;
    const common = {
      name: f,
      value: values[f],
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setValues((prev) => ({...prev, [f]: e.target.value})),
      onBlur: () => setTouched((prev) => ({...prev, [f]: true})),
      'aria-invalid': err ? true : undefined,
      className: cn(inputBase, err ? 'border-red/60 focus:border-red/60' : 'border-border focus:border-indigo/50')
    };
    return (
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-ink">{t(f)}</span>
        {f === 'message' ? (
          <textarea {...common} rows={4} className={cn(common.className, 'resize-none')} />
        ) : (
          <input {...common} type={type} />
        )}
        {err && <span className="text-xs font-medium text-red">{err}</span>}
      </label>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {field('name')}
        {field('email', 'email')}
      </div>
      {field('company')}
      {field('message')}
      <button
        type="submit"
        disabled={!isValid || status === 'sending'}
        className={buttonClassName('blue', 'lg', 'font-bold')}
      >
        {status === 'sending' ? t('sending') : t('submit')}
      </button>
    </form>
  );
}
