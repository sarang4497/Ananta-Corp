'use client';

import {useId, useState} from 'react';
import {Mail, Phone} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {COMPANY} from '@/content/site';
import {WhatsAppIcon} from '@/components/ui/Button';
import {quoteContactHref, quoteWhatsappUrl, type QuoteContext} from '@/lib/quote';
import {cn} from '@/lib/cn';

/**
 * Size selector + enquiry. Size, finish, quantity and city flow into BOTH the
 * WhatsApp message and the written-enquiry link (src/lib/quote.ts), so the
 * sales team sees the full context. No prices, stock or delivery promises.
 * data-dock-hide: the floating dock steps aside while this in-page CTA is on
 * screen (no duplicate buttons).
 */
export function EnquiryBox({
  name,
  sizes,
  sizesLabel,
  sizesNote,
  category,
  finish: defaultFinish,
  source = 'Product page'
}: {
  name: string;
  sizes: string[];
  sizesLabel?: string;
  sizesNote?: string;
  /** Category name for the enquiry context. */
  category?: string;
  /** Prelam décor (code – name); shows an editable finish field when set. */
  finish?: string;
  source?: string;
}) {
  const id = useId();
  const [size, setSize] = useState<string | null>(null);
  const [finish, setFinish] = useState(defaultFinish ?? '');
  const [quantity, setQuantity] = useState('');
  const [city, setCity] = useState('');

  const ctx: QuoteContext = {category, size: size ?? undefined, finish: finish || undefined, quantity, city, source};
  // The product line names the chosen size too ("<name> — 18 MM") so the
  // first line of the WhatsApp message is self-explanatory.
  const waHref = quoteWhatsappUrl({...ctx, product: size ? `${name} — ${size}` : name});
  const contactHref = quoteContactHref({...ctx, product: name});

  const field =
    'min-h-11 w-full min-w-0 rounded-[6px] border border-line bg-white px-3 text-[14px] text-ink placeholder:text-steel focus:border-indigo/50 focus:outline-none focus-visible:outline-2 focus-visible:outline-blue';

  return (
    <div data-dock-hide className="rounded-[12px] border border-line bg-white p-4 shadow-[0_1px_0_rgba(18,26,47,0.03)] sm:p-5" data-testid="enquiry-box">
      <p className="t-label text-orange-ink">Get a quote</p>
      {sizes.length > 0 && (
        <fieldset className="mt-3">
          <legend className="text-[13px] font-semibold text-ink">
            {sizesLabel ?? 'Size'} <span className="font-normal text-muted">— select to include in your enquiry</span>
          </legend>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {sizes.map((s) => (
              <button
                key={s}
                type="button"
                aria-pressed={size === s}
                onClick={() => setSize((v) => (v === s ? null : s))}
                className={cn(
                  'min-h-11 min-w-[3.75rem] rounded-[6px] border px-3 font-mono text-[12.5px] transition-colors duration-150',
                  size === s ? 'border-navy bg-navy text-white' : 'border-line text-ink hover:border-indigo/40'
                )}
              >
                {s.replace(' MM', ' mm')}
              </button>
            ))}
          </div>
          {sizesNote && <p className="mt-2.5 text-[12.5px] leading-relaxed text-muted">{sizesNote}</p>}
        </fieldset>
      )}

      <div className={cn('grid grid-cols-1 gap-3 min-[400px]:grid-cols-2', sizes.length > 0 ? 'mt-4' : 'mt-3')}>
        {defaultFinish !== undefined && (
          <label className="flex min-w-0 flex-col gap-1 min-[400px]:col-span-2" htmlFor={`${id}-finish`}>
            <span className="text-[12.5px] font-semibold text-ink">Finish / décor</span>
            <input id={`${id}-finish`} name="finish" value={finish} onChange={(e) => setFinish(e.target.value)} className={field} autoComplete="off" />
          </label>
        )}
        <label className="flex min-w-0 flex-col gap-1" htmlFor={`${id}-qty`}>
          <span className="text-[12.5px] font-semibold text-ink">
            Quantity <span className="font-normal text-muted">(optional)</span>
          </span>
          <input
            id={`${id}-qty`}
            name="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="e.g. 20 sheets"
            className={field}
            autoComplete="off"
            data-testid="enquiry-quantity"
          />
        </label>
        <label className="flex min-w-0 flex-col gap-1" htmlFor={`${id}-city`}>
          <span className="text-[12.5px] font-semibold text-ink">
            City / site <span className="font-normal text-muted">(optional)</span>
          </span>
          <input
            id={`${id}-city`}
            name="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="e.g. Ahmedabad"
            className={field}
            autoComplete="address-level2"
            data-testid="enquiry-city"
          />
        </label>
      </div>

      <div className="mt-4 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="product-whatsapp"
          className="inline-flex min-h-12 sm:flex-[2_1_14rem] items-center justify-center gap-2 rounded-[6px] bg-orange px-5 text-center text-[15px] font-semibold text-white text-balance transition-colors duration-150 hover:bg-orange-deep"
        >
          <WhatsAppIcon className="h-4 w-4 shrink-0" /> Get price on WhatsApp
        </a>
        <Link
          href={contactHref}
          data-testid="product-enquiry"
          className="inline-flex min-h-12 sm:flex-[1_1_10rem] items-center justify-center gap-2 rounded-[6px] border border-line px-4 text-center text-[14px] font-semibold text-ink text-balance transition-colors duration-150 hover:border-indigo/40 hover:text-indigo"
        >
          <Mail className="h-4 w-4 shrink-0" aria-hidden /> Send a written enquiry
        </Link>
      </div>
      <p className="mt-3 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[12.5px] leading-relaxed text-muted">
        Current pricing and stock come from our team; delivery is arranged as per location and availability.
        <a href={COMPANY.phoneHref} className="inline-flex min-h-11 items-center gap-1 font-semibold text-indigo hover:underline">
          <Phone className="h-3.5 w-3.5" aria-hidden /> Call
        </a>
      </p>
    </div>
  );
}
