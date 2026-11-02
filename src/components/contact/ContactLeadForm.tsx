'use client';

import {useEffect, useState} from 'react';
import {CheckCircle2} from 'lucide-react';
import {CATEGORIES} from '@/data/products';
import {CATEGORY_COPY} from '@/content/categories';
import {WhatsAppIcon} from '@/components/ui/Button';
import {whatsappUrl} from '@/lib/whatsapp';

/**
 * Enquiry form → POST /api/lead (existing backend contract: email required;
 * name/phone/company/message optional). Extra fields (product, quantity,
 * city) are composed into `message`, so the API is unchanged.
 * The success state only appears after the API returns ok:true. It promises
 * nothing the backend doesn't do, and offers the same details on WhatsApp.
 * On failure it falls back to a prefilled email so nothing is lost.
 */
export function ContactLeadForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [summary, setSummary] = useState('');
  const [product, setProduct] = useState('');

  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get('product');
    const id = requestAnimationFrame(() => p && setProduct(p));
    return () => cancelAnimationFrame(id);
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === 'sending' || status === 'sent') return;
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setStatus('sending');
    const d = new FormData(form);
    const v = (k: string) => String(d.get(k) ?? '').trim();
    const composed = [
      v('product') && `Product interest: ${v('product')}`,
      v('quantity') && `Quantity: ${v('quantity')}`,
      v('city') && `City / site: ${v('city')}`,
      v('message')
    ]
      .filter(Boolean)
      .join('\n');
    setSummary(`Hello! I'm ${v('name')}${v('company') ? ` (${v('company')})` : ''}. ${composed.replace(/\n/g, '. ')}`);
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name: v('name'), phone: v('phone'), email: v('email'), company: v('company'), message: composed, source: 'contact-form'})
      });
      const json = (await res.json()) as {ok?: boolean};
      if (!res.ok || !json.ok) throw new Error('lead-failed');
      setStatus('sent');
    } catch {
      const subject = encodeURIComponent(`Enquiry from ${v('name') || 'website'}`);
      const body = encodeURIComponent(`${composed}\n\nName: ${v('name')}\nCompany: ${v('company')}\nPhone: ${v('phone')}\nEmail: ${v('email')}`);
      window.location.href = `mailto:info@anantacorporation.com?subject=${subject}&body=${body}`;
      setStatus('error');
    }
  }

  const input =
    'min-h-11 w-full rounded-[6px] border border-line bg-white px-3.5 text-[14.5px] text-ink placeholder:text-steel focus:border-indigo/60 focus:outline-none focus:ring-2 focus:ring-indigo/10';
  const label = 'flex flex-col gap-1.5 text-[13px] font-semibold text-ink';

  if (status === 'sent') {
    return (
      <div className="rounded-[10px] border border-green/30 bg-green/5 p-6" role="status" data-testid="lead-success">
        <CheckCircle2 className="h-7 w-7 text-green" aria-hidden />
        <p className="mt-3 text-[17px] font-semibold text-ink">Enquiry submitted.</p>
        <p className="mt-1 text-[14px] leading-relaxed text-muted">
          Your details were received. For pricing today, you can also send the same request on WhatsApp.
        </p>
        <a
          href={whatsappUrl(summary)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-[6px] bg-orange px-4 text-[14px] font-semibold text-white hover:bg-orange-deep"
        >
          <WhatsAppIcon className="h-4 w-4" /> Send on WhatsApp too
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate data-testid="lead-form">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className={label}>
          Name *
          <input type="text" name="name" required autoComplete="name" className={input} />
        </label>
        <label className={label}>
          Phone *
          <input type="tel" name="phone" required autoComplete="tel" placeholder="+91" className={input} />
        </label>
        <label className={label}>
          Email *
          <input type="email" name="email" required autoComplete="email" className={input} />
        </label>
        <label className={label}>
          Company / firm
          <input type="text" name="company" autoComplete="organization" className={input} />
        </label>
        <label className={label}>
          Product interest
          <select name="product" value={product} onChange={(e) => setProduct(e.target.value)} className={input}>
            <option value="">Select…</option>
            {product && !CATEGORIES.some((c) => CATEGORY_COPY[c.slug].name === product) && <option value={product}>{product}</option>}
            {CATEGORIES.map((c) => (
              <option key={c.slug} value={CATEGORY_COPY[c.slug].name}>
                {CATEGORY_COPY[c.slug].name}
              </option>
            ))}
            <option value="Multiple categories">Multiple categories</option>
            <option value="Custom furniture">Custom furniture</option>
          </select>
        </label>
        <label className={label}>
          Approx. quantity
          <input type="text" name="quantity" placeholder="e.g. 40 sheets 18 mm, 12 doors" className={input} />
        </label>
      </div>
      <label className={label}>
        City / site location
        <input type="text" name="city" autoComplete="address-level2" className={input} />
      </label>
      <label className={label}>
        Requirement
        <textarea name="message" rows={4} placeholder="Grades, thicknesses, finishes, timeline…" className={`${input} min-h-28 resize-y py-3`} />
      </label>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="inline-flex min-h-12 items-center justify-center rounded-[6px] bg-indigo px-6 text-[15px] font-semibold text-white hover:bg-blue disabled:opacity-60"
        >
          {status === 'sending' ? 'Sending…' : 'Send enquiry'}
        </button>
        <p className="text-[12.5px] text-muted">* Required. Used only to reply to your enquiry.</p>
      </div>
      {status === 'error' && (
        <p className="text-[13.5px] text-red" role="alert">
          The form could not be submitted, so your email app was opened with the details instead — or message us on WhatsApp.
        </p>
      )}
    </form>
  );
}
