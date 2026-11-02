'use client';

import {useState} from 'react';
import {Phone} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {COMPANY, WA} from '@/content/site';
import {WhatsAppIcon} from '@/components/ui/Button';
import {whatsappUrl} from '@/lib/whatsapp';
import {cn} from '@/lib/cn';

/**
 * Size selector + enquiry. Picking a size puts it into the WhatsApp message
 * so the sales team sees product AND size. data-dock-hide: the floating dock
 * steps aside while this in-page CTA is on screen (no duplicate buttons).
 */
export function EnquiryBox({name, sizes, sizesLabel, sizesNote}: {name: string; sizes: string[]; sizesLabel?: string; sizesNote?: string}) {
  const [size, setSize] = useState<string | null>(null);
  const msg = size ? `Hello! I'm interested in ${name} — ${size}. Please share price and availability details.` : WA.product(name);
  return (
    <div data-dock-hide className="rounded-[10px] border border-line bg-white p-5" data-testid="enquiry-box">
      {sizes.length > 0 && (
        <fieldset>
          <legend className="text-[13px] font-semibold text-muted">
            {sizesLabel ?? 'Size'} <span className="font-normal">— select to include in your enquiry</span>
          </legend>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {sizes.map((s) => (
              <button
                key={s}
                type="button"
                aria-pressed={size === s}
                onClick={() => setSize((v) => (v === s ? null : s))}
                className={cn(
                  'min-h-10 min-w-[3.5rem] rounded-[5px] border px-3 font-mono text-[12.5px] transition-colors duration-150',
                  size === s ? 'border-navy bg-navy text-white' : 'border-line text-ink hover:border-indigo/40'
                )}
              >
                {s.replace(' MM', ' mm')}
              </button>
            ))}
          </div>
          {sizesNote && <p className="mt-2.5 text-[12.5px] text-muted">{sizesNote}</p>}
        </fieldset>
      )}
      <div className={cn('flex flex-col gap-2.5 sm:flex-row', sizes.length > 0 && 'mt-5')}>
        <a
          href={whatsappUrl(msg)}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="product-whatsapp"
          className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-[6px] bg-orange px-5 text-[15px] font-semibold text-white hover:bg-orange-deep"
        >
          <WhatsAppIcon className="h-4 w-4" /> Get price on WhatsApp
        </a>
        <a href={COMPANY.phoneHref} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[6px] border border-line px-5 text-[14.5px] font-semibold text-ink hover:border-indigo/40">
          <Phone className="h-4 w-4" aria-hidden /> Call
        </a>
      </div>
      <p className="mt-3 text-[12.5px] text-muted">
        Real-time pricing and stock from our team. Delivery arranged as per location &amp; availability.{' '}
        <Link href={{pathname: '/contact', query: size ? {product: name, size} : {product: name}}} className="font-semibold text-indigo hover:underline">
          Send a written enquiry
        </Link>
      </p>
    </div>
  );
}
