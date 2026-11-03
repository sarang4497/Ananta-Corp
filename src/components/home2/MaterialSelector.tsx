'use client';

import {useState} from 'react';
import {ArrowRight, Bath, Briefcase, Columns2, CookingPot, DoorOpen, Shirt, type LucideIcon} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {EXPOSURE_LABEL, SELECTOR} from '@/content/site';
import {bySlug, comparablePair, compareHref, pickFacts} from '@/content/tools-data';
import {ProductTile} from '@/components/catalog2/ProductTile';
import {WhatsAppIcon} from '@/components/ui/Button';
import {quoteWhatsappUrl} from '@/lib/quote';
import {cn} from '@/lib/cn';
import s from '@/components/tools/tools.module.css';

const LEVELS = ['dry', 'humid', 'wet'] as const;
const ICONS: Record<string, LucideIcon> = {kitchen: CookingPot, wardrobe: Shirt, bathroom: Bath, office: Briefcase, doors: DoorOpen};

/**
 * Material selector — application → zone (with its exposure) → existing
 * products. Deterministic: every answer is a fixed mapping from Ananta's own
 * product guidance (src/content/site.ts SELECTOR); reasons are derived from
 * each product's own exposure/uses. ONE component: embedded on the homepage
 * and full-size at /tools/material-selector.
 */
export function MaterialSelector({variant = 'embedded'}: {variant?: 'embedded' | 'page'}) {
  const [app, setApp] = useState(0);
  const [zone, setZone] = useState(0);
  const a = SELECTOR[app];
  const z = a.zones[Math.min(zone, a.zones.length - 1)];
  const picks = z.picks.map((slug) => bySlug(slug)).filter((p) => p !== undefined);
  const level = LEVELS.indexOf(z.exposure);
  const pair = comparablePair(z.picks);
  const page = variant === 'page';
  const Title = page ? 'h2' : 'h3';
  const quote = quoteWhatsappUrl({
    requirement: `${a.label} — ${z.label}. Suggested: ${picks.map((p) => p.short).join(', ')}`,
    source: 'Material Selector'
  });

  return (
    <div id="selector" className={cn('rounded-[12px] border border-line bg-white', page ? 'p-5 sm:p-8' : 'p-5 sm:p-7')} data-reveal="up">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <p className="t-label text-orange-ink">Tool 01 · Material selector</p>
        <span className="t-label text-steel">Based on Ananta product guidance</span>
      </div>
      <Title className="t-h3 mt-3 text-balance text-ink">{page ? 'Answer two questions.' : 'Which board for which job?'}</Title>

      <div className={cn('mt-6 grid gap-6', page && 'lg:grid-cols-12 lg:gap-10')}>
        <div className={cn(page && 'lg:col-span-5')}>
          <fieldset>
            <legend className="text-[13px] font-semibold text-muted">1 · Application</legend>
            <div className={cn('mt-2 grid grid-cols-2 gap-2', page ? 'sm:grid-cols-3 lg:grid-cols-2' : 'sm:grid-cols-3 lg:grid-cols-5')}>
              {SELECTOR.map((x, i) => {
                const Icon = ICONS[x.key] ?? Columns2;
                const on = i === app;
                return (
                  <button
                    key={x.key}
                    type="button"
                    aria-pressed={on}
                    onClick={() => {
                      setApp(i);
                      setZone(0);
                    }}
                    className={cn(
                      'flex min-h-14 items-center gap-2.5 rounded-[8px] border px-3 py-2 text-left text-[13.5px] font-medium leading-snug transition-[background-color,border-color,color,transform] duration-150 active:scale-[0.98]',
                      on ? 'border-navy bg-navy text-white' : 'border-line bg-white text-ink hover:border-indigo/40'
                    )}
                  >
                    <Icon className={cn('h-4.5 w-4.5 shrink-0', on ? 'text-orange-light' : 'text-indigo')} aria-hidden />
                    <span className="min-w-0">{x.label}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset key={a.key} className={cn('mt-5', s.step)}>
            <legend className="text-[13px] font-semibold text-muted">2 · Where exactly</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {a.zones.map((x, i) => (
                <button
                  key={x.key}
                  type="button"
                  aria-pressed={x.key === z.key}
                  onClick={() => setZone(i)}
                  className={cn(
                    'min-h-11 rounded-[6px] border px-3.5 py-2 text-left text-[13.5px] font-medium leading-snug transition-colors duration-150',
                    x.key === z.key ? 'border-orange bg-orange/10 text-orange-ink' : 'border-line text-ink hover:border-indigo/40'
                  )}
                >
                  {x.label}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="mt-5">
            <p className="text-[13px] font-semibold text-muted">Exposure</p>
            <div className="mt-2 grid grid-cols-3 gap-1.5" role="img" aria-label={`Exposure: ${EXPOSURE_LABEL[z.exposure]}`}>
              {LEVELS.map((l, i) => (
                <span key={l} className="flex flex-col gap-1.5">
                  <span
                    className={cn(
                      'h-1.5 rounded-full transition-colors duration-300',
                      i <= level ? (i === 2 ? 'bg-blue' : i === 1 ? 'bg-indigo/70' : 'bg-indigo/40') : 'bg-line'
                    )}
                  />
                  <span className={cn('text-[12px] leading-tight', i === level ? 'font-semibold text-ink' : 'text-steel')}>{EXPOSURE_LABEL[l]}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className={cn('border-t border-line pt-5', page && 'lg:col-span-7 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0')} aria-live="polite">
          <div key={`${a.key}-${z.key}`} className={s.step}>
            <p className="text-[13px] font-semibold text-muted">3 · Recommended</p>
            <p className="mt-2 text-[15px] leading-relaxed text-ink">{z.why}</p>
            <ul className={cn('mt-4 grid grid-cols-1 gap-3 min-[400px]:grid-cols-2', page ? 'xl:grid-cols-3' : 'lg:grid-cols-3')}>
              {picks.map((p, i) => (
                <li key={p.slug} className={cn('flex flex-col gap-2', s.step)} style={{['--d' as string]: `${80 + i * 70}ms`}}>
                  <ProductTile product={p} size="sm" />
                  <ul className="flex flex-wrap gap-1" aria-label={`Why ${p.short}`}>
                    {pickFacts(p).map((f) => (
                      <li key={f} className="rounded-[4px] bg-bg-soft px-2 py-1 text-[11.5px] leading-tight text-muted">
                        {f}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap gap-2">
              <a
                href={quote}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-[6px] bg-orange px-4 py-2 text-left text-[14px] font-semibold text-white hover:bg-orange-deep"
              >
                <WhatsAppIcon className="h-4 w-4 shrink-0" /> Get price for this selection
              </a>
              {pair && (
                <Link
                  href={compareHref(pair[0], pair[1])}
                  className="inline-flex min-h-11 items-center gap-2 rounded-[6px] border border-ink/15 bg-white px-4 py-2 text-left text-[14px] font-semibold text-ink hover:border-indigo/50 hover:text-indigo"
                >
                  <Columns2 className="h-4 w-4 shrink-0" aria-hidden /> Compare these two
                </Link>
              )}
              {!page && (
                <Link
                  href={{pathname: '/tools/[tool]', params: {tool: 'material-selector'}}}
                  className="arrow-nudge inline-flex min-h-11 items-center gap-1.5 px-2 text-[14px] font-semibold text-indigo hover:underline"
                >
                  Open full selector <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
