'use client';

import Image from 'next/image';
import {useState} from 'react';
import {ArrowRight} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {CATEGORIES, categoryHref} from '@/data/products';
import {CATEGORY_COPY} from '@/content/categories';
import {AUDIENCES} from '@/content/site';
import {countByCategory} from '@/data/stats';
import {cn} from '@/lib/cn';

/**
 * 06 WHO IT'S FOR — four professional entry points answering "what can I
 * source here?". Mappings use only catalogue categories and A1 capability
 * lines. Accessible tabs (arrow keys move between tabs).
 */
export function AudiencePaths() {
  const [i, setI] = useState(0);
  const a = AUDIENCES[i];
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const n = (i + (e.key === 'ArrowRight' ? 1 : AUDIENCES.length - 1)) % AUDIENCES.length;
    setI(n);
    document.getElementById(`aud-tab-${n}`)?.focus();
  };
  return (
    <section aria-labelledby="aud-title" className="bg-white py-14 sm:py-20">
      <div className="shell grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
        <div data-reveal="up">
          <p className="t-label text-orange-ink">Who sources here</p>
          <h2 id="aud-title" className="t-h2 mt-3 max-w-[18ch] text-ink">
            Built around how projects actually buy material.
          </h2>
          <div role="tablist" aria-label="Choose your role" className="rail mt-7 gap-2 lg:flex lg:flex-col lg:gap-0 lg:overflow-visible" onKeyDown={onKey}>
            {AUDIENCES.map((x, n) => (
              <button
                key={x.key}
                id={`aud-tab-${n}`}
                role="tab"
                type="button"
                aria-selected={n === i}
                aria-controls="aud-panel"
                tabIndex={n === i ? 0 : -1}
                onClick={() => setI(n)}
                className={cn(
                  'flex min-h-11 items-center justify-between gap-4 whitespace-nowrap rounded-[6px] border px-4 text-left text-[15px] font-semibold transition-colors duration-150 lg:min-h-16 lg:rounded-none lg:border-0 lg:border-b lg:px-0 lg:text-[clamp(1.05rem,0.9rem+0.5vw,1.35rem)]',
                  n === i ? 'border-navy bg-navy text-white lg:border-line lg:bg-transparent lg:text-indigo' : 'border-line text-ink hover:text-indigo lg:text-steel'
                )}
              >
                {x.label}
                <ArrowRight className={cn('hidden h-5 w-5 transition-transform duration-200 lg:block', n === i ? 'translate-x-0 text-orange' : '-translate-x-2 opacity-0')} aria-hidden />
              </button>
            ))}
          </div>
        </div>

        <div id="aud-panel" role="tabpanel" aria-labelledby={`aud-tab-${i}`} className="min-w-0">
          <div key={a.key} data-reveal="fade" className="rounded-[10px] border border-line bg-bg-soft p-5 sm:p-7">
            <p className="text-[clamp(1.1rem,1rem+0.5vw,1.35rem)] font-semibold leading-snug text-ink">{a.line}</p>
            {a.extra && <p className="mt-2 text-[14px] text-muted">{a.extra}</p>}
            <ul className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {a.categories.map((slug) => {
                const c = CATEGORIES.find((x) => x.slug === slug)!;
                return (
                  <li key={slug}>
                    <Link href={categoryHref(slug)} className="tile-lift group flex items-center gap-3 rounded-[6px] border border-line bg-white p-2.5">
                      <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-[4px] bg-bg-soft">
                        <Image src={c.image} alt="" fill sizes="48px" className="object-cover" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[13.5px] font-semibold leading-tight text-ink group-hover:text-indigo">{CATEGORY_COPY[slug].short}</span>
                        <span className="t-label text-steel">{countByCategory(slug)} listed</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
