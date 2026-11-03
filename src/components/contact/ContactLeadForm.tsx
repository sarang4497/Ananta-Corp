'use client';

import {Suspense, useState} from 'react';
import {useSearchParams} from 'next/navigation';
import {CheckCircle2} from 'lucide-react';
import {CATEGORIES, type CategorySlug} from '@/data/products';
import {CATEGORY_COPY} from '@/content/categories';
import {COMPANY} from '@/content/site';
import {WhatsAppIcon} from '@/components/ui/Button';
import {whatsappUrl} from '@/lib/whatsapp';
import {QUOTE_QUERY_KEYS} from '@/lib/quote';

type QuoteKey = (typeof QUOTE_QUERY_KEYS)[number];
type Prefill = Partial<Record<QuoteKey, string>>;

const LABEL: Record<QuoteKey, string> = {
  product: 'Product',
  category: 'Category',
  size: 'Size / thickness',
  finish: 'Finish / décor',
  quantity: 'Quantity',
  city: 'City',
  requirement: 'Requirement',
  source: 'From'
};

/** Category query may be a slug ("mdf") or a display name ("MDF & HDHMR"). */
function categoryName(v?: string) {
  if (!v) return '';
  const bySlug = CATEGORY_COPY[v as CategorySlug];
  if (bySlug) return bySlug.name;
  const byName = CATEGORIES.find((c) => [CATEGORY_COPY[c.slug].name, CATEGORY_COPY[c.slug].short].some((n) => n.toLowerCase() === v.toLowerCase()));
  return byName ? CATEGORY_COPY[byName.slug].name : v;
}

/**
 * Enquiry form → POST /api/lead. Reads the shared quote context
 * (QUOTE_QUERY_KEYS from src/lib/quote.ts) from the URL to PREFILL fields and
 * shows a "Your request" summary. useSearchParams is wrapped in Suspense
 * (Next 16 static prerender); the fallback is the same form, unprefilled, so
 * it is usable before hydration.
 * Success only after the API returns ok:true; "sent to the team" only when
 * the API reports email === 'sent'. On failure it opens a prefilled email.
 */
export function ContactLeadForm() {
  return (
    <Suspense fallback={<LeadForm prefill={{}} />}>
      <PrefilledForm />
    </Suspense>
  );
}

function PrefilledForm() {
  const sp = useSearchParams();
  const prefill: Prefill = {};
  for (const k of QUOTE_QUERY_KEYS) {
    const v = sp.get(k)?.trim();
    if (v) prefill[k] = v.slice(0, 300);
  }
  return <LeadForm key={sp.toString()} prefill={prefill} />;
}

function LeadForm({prefill}: {prefill: Prefill}) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [summary, setSummary] = useState('');
  const [product, setProduct] = useState(prefill.product || categoryName(prefill.category));
  const [ref, setRef] = useState<{id: string; email: string} | null>(null);
  const chips = QUOTE_QUERY_KEYS.filter((k) => prefill[k]).map((k) => ({k, label: LABEL[k], v: k === 'category' ? categoryName(prefill[k]) : prefill[k]!}));
  const known = CATEGORIES.some((c) => CATEGORY_COPY[c.slug].name === product) || ['Multiple categories', 'Custom furniture'].includes(product);

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
      v('product') && `Product interest: ${v('product')}${v('size') ? ` — ${v('size')}` : ''}`,
      v('finish') && `Finish / décor: ${v('finish')}`,
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
        body: JSON.stringify({
          name: v('name'),
          phone: v('phone'),
          email: v('email'),
          company: v('company'),
          product: v('product'),
          category: prefill.category ? categoryName(prefill.category) : undefined,
          size: v('size'),
          finish: v('finish'),
          quantity: v('quantity'),
          city: v('city'),
          message: v('message'),
          website: v('website'),
          source: 'contact-form',
          origin: prefill.source,
          page: window.location.pathname + window.location.search
        })
      });
      const json = (await res.json()) as {ok?: boolean; id?: string; email?: string};
      if (!res.ok || !json.ok) throw new Error('lead-failed');
      setRef({id: json.id ?? '', email: json.email ?? ''});
      setStatus('sent');
    } catch {
      const subject = encodeURIComponent(`Enquiry from ${v('name') || 'website'}`);
      const body = encodeURIComponent(`${composed}\n\nName: ${v('name')}\nCompany: ${v('company')}\nPhone: ${v('phone')}\nEmail: ${v('email')}`);
      window.location.href = `mailto:${COMPANY.email}?subject=${subject}&body=${body}`;
      setStatus('error');
    }
  }

  const input =
    'min-h-11 w-full min-w-0 rounded-[6px] border border-line bg-white px-3.5 text-[14.5px] text-ink placeholder:text-steel focus:border-indigo/60 focus:outline-none focus:ring-2 focus:ring-indigo/10';
  const label = 'flex min-w-0 flex-col gap-1.5 text-[13px] font-semibold text-ink';

  if (status === 'sent') {
    return (
      <div className="rounded-[10px] border border-green/30 bg-green/5 p-6" role="status" data-testid="lead-success">
        <CheckCircle2 className="h-7 w-7 text-green" aria-hidden />
        <p className="mt-3 text-[17px] font-semibold text-ink">{ref?.email === 'sent' ? 'Enquiry sent to the team.' : 'Enquiry received.'}</p>
        <p className="mt-1 text-[14px] leading-relaxed text-muted">
          {ref?.id ? (
            <>
              Reference <span className="font-mono text-ink">{ref.id}</span>.{' '}
            </>
          ) : null}
          For pricing, you can also send the same request on WhatsApp.
        </p>
        <a
          href={whatsappUrl(summary)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-[6px] bg-orange px-4 py-2 text-[14px] font-semibold text-white hover:bg-orange-deep"
        >
          <WhatsAppIcon className="h-4 w-4 shrink-0" /> Send on WhatsApp too
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="relative flex flex-col gap-4" noValidate data-testid="lead-form">
      {chips.length > 0 && (
        <div className="rounded-[8px] border border-indigo/15 bg-surface-blue p-4" data-testid="quote-summary">
          <p className="t-label text-indigo">Your request</p>
          <ul className="mt-2.5 flex flex-wrap gap-2">
            {chips.map((c) => (
              <li key={c.k} className="inline-flex max-w-full flex-wrap items-baseline gap-x-1.5 rounded-[5px] border border-line bg-white px-2.5 py-1.5 text-[13px] leading-snug">
                <span className="text-muted">{c.label}:</span>
                <span className="break-words font-semibold text-ink">{c.v}</span>
              </li>
            ))}
          </ul>
          <p className="mt-2.5 text-[12.5px] text-muted">Prefilled below — edit anything before sending.</p>
        </div>
      )}
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
            {product && !known && <option value={product}>{product}</option>}
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
          <input type="text" name="quantity" defaultValue={prefill.quantity} placeholder="e.g. 40 sheets 18 mm, 12 doors" className={input} />
        </label>
        <label className={label}>
          Size / thickness
          <input type="text" name="size" defaultValue={prefill.size} placeholder="e.g. 18 MM, 8 × 4 ft" className={input} />
        </label>
        <label className={label}>
          Finish / décor
          <input type="text" name="finish" defaultValue={prefill.finish} placeholder="e.g. 3009 Classic Planked Walnut" className={input} />
        </label>
      </div>
      {/* Honeypot: hidden from people and assistive tech, catches bots. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <label className={label}>
        City / site location
        <input type="text" name="city" defaultValue={prefill.city} autoComplete="address-level2" className={input} />
      </label>
      <label className={label}>
        Requirement
        <textarea name="message" rows={4} defaultValue={prefill.requirement} placeholder="Grades, thicknesses, finishes, timeline…" className={`${input} min-h-28 resize-y py-3`} />
      </label>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="inline-flex min-h-12 items-center justify-center rounded-[6px] bg-indigo px-6 py-2.5 text-[15px] font-semibold text-white hover:bg-blue disabled:opacity-60"
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
