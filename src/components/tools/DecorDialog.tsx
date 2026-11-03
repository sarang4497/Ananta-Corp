'use client';

import Image from 'next/image';
import {useEffect, useRef} from 'react';
import {Check, ChevronLeft, ChevronRight, Heart, X} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {PRODUCTS, productHref} from '@/data/products';
import type {Decor} from '@/data/decors';
import {WhatsAppIcon} from '@/components/ui/Button';
import {quoteWhatsappUrl} from '@/lib/quote';
import {cn} from '@/lib/cn';
import s from './tools.module.css';

export const PRELAM_PRODUCT = 'Action TESA prelam particle board';

/**
 * Accessible enlarge dialog for one décor: focus moves in and is trapped,
 * Escape closes, ←/→ step through the current list, focus returns to the
 * swatch that opened it.
 */
export function DecorDialog({
  decor: d,
  family,
  index,
  total,
  onClose,
  onStep,
  shortlisted,
  onToggle,
  full
}: {
  decor: Decor;
  family: string;
  index: number;
  total: number;
  onClose: () => void;
  onStep: (dir: -1 | 1) => void;
  shortlisted: boolean;
  onToggle: () => void;
  full: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const product = PRODUCTS.find((p) => p.decorCode === d.code);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      html.style.overflow = prev;
      opener?.focus?.();
    };
  }, []);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'ArrowRight') onStep(1);
    else if (e.key === 'ArrowLeft') onStep(-1);
    else if (e.key === 'Tab') {
      const els = ref.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
      if (!els || !els.length) return;
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  const nav = 'grid h-11 w-11 place-items-center rounded-[6px] border border-line bg-white text-ink hover:border-indigo/50 hover:text-indigo';

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center p-3 sm:p-6" onKeyDown={onKey}>
      <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="decor-dialog-title"
        data-testid="decor-dialog"
        className={cn(
          'relative grid max-h-[calc(100dvh-1.5rem)] w-full max-w-[860px] grid-rows-[minmax(0,1fr)_auto] overflow-y-auto rounded-[12px] bg-white shadow-lift sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:grid-rows-1',
          s.pop
        )}
      >
        <div className="relative min-h-[38dvh] bg-bg-soft sm:min-h-[min(72dvh,620px)]">
          <Image key={d.code} src={d.image} alt={`${d.code} – ${d.name}`} fill sizes="(max-width: 640px) 94vw, 430px" className={cn('object-cover', s.pop)} />
        </div>
        <div className="flex flex-col gap-4 p-5 sm:p-7">
          <div className="flex items-start justify-between gap-3">
            <p className="t-label text-steel" aria-live="polite">
              {family} · {index + 1} of {total}
            </p>
            <button ref={closeRef} type="button" onClick={onClose} aria-label="Close" className={nav}>
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>
          <div>
            <p className="t-label text-orange-ink">Action TESA · prelam décor</p>
            <h2 id="decor-dialog-title" className="mt-2 text-[clamp(1.5rem,1.2rem+1.4vw,2.2rem)] font-semibold leading-[1.1] tracking-[-0.02em] text-ink">
              {d.code} <span className="text-muted">–</span> {d.name}
            </h2>
            {product && (
              <Link href={productHref(product)} className="mt-2 inline-block text-[14px] font-semibold text-indigo hover:underline">
                View product page →
              </Link>
            )}
          </div>
          <div className="mt-auto grid gap-2">
            <button
              type="button"
              aria-pressed={shortlisted}
              onClick={onToggle}
              disabled={!shortlisted && full}
              className={cn(
                'inline-flex min-h-11 items-center justify-center gap-2 rounded-[6px] border px-4 py-2 text-center text-[14px] font-semibold',
                shortlisted ? 'border-indigo bg-surface-blue text-indigo' : 'border-ink/15 text-ink hover:border-indigo/50 hover:text-indigo',
                'disabled:opacity-50'
              )}
            >
              {shortlisted ? <Check className="h-4 w-4" aria-hidden /> : <Heart className="h-4 w-4" aria-hidden />}
              {shortlisted ? 'In shortlist' : full ? 'Shortlist is full' : 'Add to shortlist'}
            </button>
            <a
              href={quoteWhatsappUrl({product: PRELAM_PRODUCT, finish: `${d.code} – ${d.name}`, source: 'Finish Explorer'})}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[6px] bg-orange px-4 py-2 text-center text-[14px] font-semibold text-white hover:bg-orange-deep"
            >
              <WhatsAppIcon className="h-4 w-4 shrink-0" /> Get price for {d.code}
            </a>
            <div className="flex items-center justify-between gap-2 pt-1">
              <button type="button" onClick={() => onStep(-1)} aria-label="Previous décor" className={nav}>
                <ChevronLeft className="h-4 w-4" aria-hidden />
              </button>
              <span className="text-center text-[12.5px] text-muted">← / → to browse</span>
              <button type="button" onClick={() => onStep(1)} aria-label="Next décor" className={nav}>
                <ChevronRight className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
