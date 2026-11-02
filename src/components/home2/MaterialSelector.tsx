'use client';

import {useState} from 'react';
import {PRODUCTS} from '@/data/products';
import {EXPOSURE_LABEL, SELECTOR} from '@/content/site';
import {ProductTile} from '@/components/catalog2/ProductTile';
import {WhatsAppIcon} from '@/components/ui/Button';
import {whatsappUrl} from '@/lib/whatsapp';
import {cn} from '@/lib/cn';

const LEVELS = ['dry', 'humid', 'wet'] as const;

/**
 * MICRO-DEMO A — Material selector. Application → zone → exposure → products.
 * Deterministic: every answer is a fixed mapping from Ananta's own FAQ/product
 * copy (src/content/site.ts SELECTOR). Value first, WhatsApp after the result.
 */
export function MaterialSelector() {
  const [app, setApp] = useState(0);
  const [zone, setZone] = useState(0);
  const a = SELECTOR[app];
  const z = a.zones[Math.min(zone, a.zones.length - 1)];
  const picks = z.picks.map((s) => PRODUCTS.find((p) => p.slug === s)!).filter(Boolean);
  const level = LEVELS.indexOf(z.exposure);
  const msg = `Hello! I'm planning a ${a.label.toLowerCase()} (${z.label.toLowerCase()}). Suggested: ${picks.map((p) => p.short).join(', ')}. Please share price and availability.`;

  return (
    <div id="selector" className="rounded-[12px] border border-line bg-white p-5 sm:p-7" data-reveal="up">
      <div className="flex items-center justify-between gap-3">
        <p className="t-label text-orange-ink">Tool 01 · Material selector</p>
        <span className="t-label hidden text-steel sm:inline">Based on Ananta product guidance</span>
      </div>
      <h3 className="t-h3 mt-3 text-ink">Which board for which job?</h3>

      <fieldset className="mt-5">
        <legend className="text-[13px] font-semibold text-muted">1 · Application</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {SELECTOR.map((x, i) => (
            <button
              key={x.key}
              type="button"
              aria-pressed={i === app}
              onClick={() => {
                setApp(i);
                setZone(0);
              }}
              className={cn(
                'min-h-10 rounded-[5px] border px-3.5 text-[13.5px] font-medium transition-colors duration-150',
                i === app ? 'border-navy bg-navy text-white' : 'border-line text-ink hover:border-indigo/40'
              )}
            >
              {x.label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-4">
        <legend className="text-[13px] font-semibold text-muted">2 · Where exactly</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {a.zones.map((x, i) => (
            <button
              key={x.key}
              type="button"
              aria-pressed={x.key === z.key}
              onClick={() => setZone(i)}
              className={cn(
                'min-h-10 rounded-[5px] border px-3.5 text-[13.5px] font-medium transition-colors duration-150',
                x.key === z.key ? 'border-orange bg-orange/10 text-orange-ink' : 'border-line text-ink hover:border-indigo/40'
              )}
            >
              {x.label}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="mt-6 border-t border-line pt-5" aria-live="polite">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[13px] font-semibold text-muted">3 · Exposure</p>
          <div className="flex items-center gap-1.5" role="img" aria-label={`Exposure: ${EXPOSURE_LABEL[z.exposure]}`}>
            {LEVELS.map((l, i) => (
              <span key={l} className="flex flex-col items-center gap-1">
                <span className={cn('h-1.5 w-16 rounded-full transition-colors duration-300 sm:w-20', i <= level ? (i === 2 ? 'bg-blue' : i === 1 ? 'bg-indigo/70' : 'bg-indigo/40') : 'bg-line')} />
                <span className={cn('t-label', i === level ? 'text-ink' : 'text-steel')}>{EXPOSURE_LABEL[l].split(' ')[0]}</span>
              </span>
            ))}
          </div>
        </div>
        <p className="mt-4 text-[14.5px] leading-relaxed text-ink">{z.why}</p>
        <ul key={`${a.key}-${z.key}`} className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-3">
          {picks.map((p, i) => (
            <li key={p.slug} data-reveal="up" style={{['--d' as string]: `${i * 70}ms`}}>
              <ProductTile product={p} size="sm" />
            </li>
          ))}
        </ul>
        <a
          href={whatsappUrl(msg)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-[6px] bg-orange px-4 text-[14px] font-semibold text-white hover:bg-orange-deep"
        >
          <WhatsAppIcon className="h-4 w-4" /> Get price for this selection
        </a>
      </div>
    </div>
  );
}
