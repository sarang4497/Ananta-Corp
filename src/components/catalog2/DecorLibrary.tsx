'use client';

import Image from 'next/image';
import {useEffect, useMemo, useState} from 'react';
import {Search} from 'lucide-react';
import {DECORS, type DecorType} from '@/data/decors';
import {WA} from '@/content/site';
import {WhatsAppIcon} from '@/components/ui/Button';
import {whatsappUrl} from '@/lib/whatsapp';
import {cn} from '@/lib/cn';

const TYPES: {k: DecorType | 'all'; l: string}[] = [
  {k: 'all', l: 'All'},
  {k: 'woodgrain', l: 'Woodgrains'},
  {k: 'solid', l: 'Solids'},
  {k: 'stone', l: 'Stone & marble'},
  {k: 'fabric', l: 'Fabric'},
  {k: 'texture', l: 'Textures'}
];

/**
 * The full décor library — dense swatch grid (3 cols phone → 8 desktop),
 * search by name/code, filter by family; ?type= and ?q= deep links from the
 * homepage finish wall. Each swatch asks for its price on WhatsApp with the
 * code prefilled.
 */
export function DecorLibrary() {
  const [type, setType] = useState<DecorType | 'all'>('all');
  const [q, setQ] = useState('');
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const t = sp.get('type') as DecorType | null;
    const id = requestAnimationFrame(() => {
      if (t && TYPES.some((x) => x.k === t)) setType(t);
      if (sp.get('q')) setQ(sp.get('q')!);
    });
    return () => cancelAnimationFrame(id);
  }, []);
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return DECORS.filter((d) => (type === 'all' || d.type === type) && (!s || d.name.toLowerCase().includes(s) || d.code.includes(s)));
  }, [type, q]);

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <label className="relative block w-full lg:max-w-sm">
          <span className="sr-only">Search décors</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-steel" aria-hidden />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name or code — walnut, 1104…"
            className="min-h-11 w-full rounded-[6px] border border-line bg-white pl-9 pr-3 text-[14px] text-ink placeholder:text-steel focus:border-indigo/50 focus:outline-none"
          />
        </label>
        <div className="rail -mx-[var(--side)] gap-1.5 px-[var(--side)] lg:mx-0 lg:px-0">
          {TYPES.map((t) => {
            const n = t.k === 'all' ? DECORS.length : DECORS.filter((d) => d.type === t.k).length;
            return (
              <button
                key={t.k}
                type="button"
                aria-pressed={type === t.k}
                onClick={() => setType(t.k)}
                className={cn(
                  'inline-flex min-h-10 items-center gap-2 whitespace-nowrap rounded-[5px] border px-3 text-[13px] transition-colors duration-150',
                  type === t.k ? 'border-navy bg-navy font-semibold text-white' : 'border-line bg-white text-ink hover:border-indigo/40'
                )}
              >
                {t.l} <span className={cn('t-label', type === t.k ? 'text-white/70' : 'text-steel')}>{n}</span>
              </button>
            );
          })}
        </div>
      </div>
      <p className="mt-4 text-[13.5px] text-muted" aria-live="polite">
        Showing <span className="font-semibold text-ink">{list.length}</span> of {DECORS.length} décors
      </p>
      {list.length === 0 ? (
        <p className="mt-6 rounded-[8px] border border-line bg-white p-6 text-[14px] text-muted">No décor matches — try a code like 3009 or a word like oak.</p>
      ) : (
        <ul className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-8">
          {list.map((d) => (
            <li key={d.code}>
              <figure className="group">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[4px] bg-bg-soft">
                  <Image src={d.image} alt={`${d.code} – ${d.name}`} fill loading="lazy" sizes="(max-width:640px) 31vw, (max-width:1280px) 16vw, 150px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  <a
                    href={whatsappUrl(WA.decor(d.code, d.name))}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Get price for décor ${d.code} ${d.name} on WhatsApp`}
                    className="absolute bottom-1.5 right-1.5 grid h-9 w-9 place-items-center rounded-[5px] bg-white/95 text-wa shadow-card transition-opacity duration-150 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                  </a>
                </div>
                <figcaption className="mt-1.5 text-[12px] leading-tight">
                  <span className="t-label block text-ink">{d.code}</span>
                  <span className="block text-muted">{d.name}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
