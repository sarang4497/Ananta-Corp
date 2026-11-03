'use client';

import Image from 'next/image';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {Check, Heart, Search, X} from 'lucide-react';
import {DECORS, type Decor, type DecorType} from '@/data/decors';
import {DecorDialog, PRELAM_PRODUCT} from '@/components/tools/DecorDialog';
import {WhatsAppIcon} from '@/components/ui/Button';
import {quoteWhatsappUrl} from '@/lib/quote';
import {cn} from '@/lib/cn';

const TYPES: {k: DecorType | 'all'; l: string}[] = [
  {k: 'all', l: 'All'},
  {k: 'woodgrain', l: 'Woodgrains'},
  {k: 'solid', l: 'Solids'},
  {k: 'stone', l: 'Stone & marble'},
  {k: 'fabric', l: 'Fabric'},
  {k: 'texture', l: 'Textures'}
];
const FAMILIES = TYPES.filter((t): t is {k: DecorType; l: string} => t.k !== 'all');
const familyName = (t: DecorType) => FAMILIES.find((f) => f.k === t)!.l;

const STORE = 'ananta:decor-shortlist';
export const SHORTLIST_MAX = 12;

function readShortlist(): string[] {
  try {
    const raw = JSON.parse(window.localStorage.getItem(STORE) ?? '[]');
    return Array.isArray(raw) ? raw.filter((c): c is string => typeof c === 'string' && DECORS.some((d) => d.code === c)).slice(0, SHORTLIST_MAX) : [];
  } catch {
    return [];
  }
}

function writeShortlist(codes: string[]) {
  try {
    window.localStorage.setItem(STORE, JSON.stringify(codes));
  } catch {
    /* storage unavailable (private mode / quota) — shortlist stays in memory */
  }
}

/**
 * Finish explorer — the full décor library. Search by name/code, filter by
 * family (the existing `type` field only), grouped by family; ?type= and ?q=
 * deep links. Each swatch enlarges in an accessible dialog and can be
 * shortlisted (localStorage, max 12); the shortlist goes to WhatsApp in one
 * message.
 */
export function DecorLibrary() {
  const [type, setType] = useState<DecorType | 'all'>('all');
  const [q, setQ] = useState('');
  const [shortlist, setShortlist] = useState<string[]>([]);
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const t = sp.get('type') as DecorType | null;
    const id = requestAnimationFrame(() => {
      if (t && TYPES.some((x) => x.k === t)) setType(t);
      if (sp.get('q')) setQ(sp.get('q')!);
      setShortlist(readShortlist());
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return DECORS.filter((d) => (type === 'all' || d.type === type) && (!s || d.name.toLowerCase().includes(s) || d.code.includes(s)));
  }, [type, q]);
  const groups = useMemo(
    () => FAMILIES.map((f) => ({...f, items: list.filter((d) => d.type === f.k)})).filter((g) => g.items.length),
    [list]
  );
  // Dialog order follows the on-screen (grouped) order.
  const ordered = useMemo(() => groups.flatMap((g) => g.items), [groups]);

  const toggle = useCallback((code: string) => {
    setShortlist((cur) => {
      const next = cur.includes(code) ? cur.filter((c) => c !== code) : cur.length >= SHORTLIST_MAX ? cur : [...cur, code];
      writeShortlist(next);
      return next;
    });
  }, []);
  const clear = () => {
    setShortlist([]);
    writeShortlist([]);
  };

  const openIdx = open ? ordered.findIndex((d) => d.code === open) : -1;
  const current = openIdx >= 0 ? ordered[openIdx] : undefined;
  const full = shortlist.length >= SHORTLIST_MAX;
  const picked = shortlist.map((c) => DECORS.find((d) => d.code === c)!).filter(Boolean);
  const shortlistHref = quoteWhatsappUrl({
    product: PRELAM_PRODUCT,
    finish: picked.map((d) => `${d.code} ${d.name}`).join(', '),
    source: 'Finish Explorer'
  });

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
        <div className="flex flex-wrap gap-1.5">
          {TYPES.map((t) => {
            const n = t.k === 'all' ? DECORS.length : DECORS.filter((d) => d.type === t.k).length;
            return (
              <button
                key={t.k}
                type="button"
                aria-pressed={type === t.k}
                onClick={() => setType(t.k)}
                className={cn(
                  'inline-flex min-h-11 items-center gap-2 rounded-[5px] border px-3 py-1.5 text-left text-[13px] leading-tight transition-colors duration-150',
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
        Showing <span className="font-semibold text-ink">{list.length}</span> of {DECORS.length} décors · tap a swatch to enlarge, ♡ to shortlist (up to {SHORTLIST_MAX})
      </p>

      {list.length === 0 ? (
        <p className="mt-6 rounded-[8px] border border-line bg-white p-6 text-[14px] text-muted">No décor matches — try a code like 3009 or a word like oak.</p>
      ) : (
        groups.map((g) => (
          <section key={g.k} aria-labelledby={`fam-${g.k}`} className="mt-8 first-of-type:mt-6">
            <h2 id={`fam-${g.k}`} className="flex flex-wrap items-baseline gap-x-2 border-b border-line pb-2 text-[17px] font-semibold text-ink">
              {g.l} <span className="t-label text-steel">{g.items.length}</span>
            </h2>
            <ul className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-8">
              {g.items.map((d) => (
                <Swatch key={d.code} d={d} on={shortlist.includes(d.code)} full={full} onOpen={() => setOpen(d.code)} onToggle={() => toggle(d.code)} />
              ))}
            </ul>
          </section>
        ))
      )}

      {picked.length > 0 && (
        <div
          data-testid="decor-shortlist"
          aria-label="Décor shortlist"
          role="region"
          className="sticky bottom-[calc(var(--dock-h)+8px)] z-30 mt-8 rounded-[12px] border border-line bg-white/97 p-3 shadow-lift backdrop-blur-md sm:p-4"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold text-ink">
                Shortlist <span className="t-label text-steel">{picked.length}/{SHORTLIST_MAX}</span>
              </p>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {picked.map((d) => (
                  <li key={d.code}>
                    <button
                      type="button"
                      onClick={() => toggle(d.code)}
                      aria-label={`Remove ${d.code} ${d.name} from shortlist`}
                      className="inline-flex min-h-11 items-center gap-1.5 rounded-[6px] border border-line bg-white py-1 pl-1 pr-2 text-left text-[12px] leading-tight text-ink hover:border-indigo/40"
                    >
                      <span className="relative h-9 w-6 shrink-0 overflow-hidden rounded-[3px] bg-bg-soft" aria-hidden>
                        <Image src={d.image} alt="" fill sizes="24px" className="object-cover" />
                      </span>
                      <span className="font-semibold">{d.code}</span>
                      <X className="h-3.5 w-3.5 shrink-0 text-steel" aria-hidden />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                data-testid="decor-shortlist-whatsapp"
                href={shortlistHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[6px] bg-orange px-4 py-2 text-center text-[14px] font-semibold text-white hover:bg-orange-deep"
              >
                <WhatsAppIcon className="h-4 w-4 shrink-0" /> Send shortlist on WhatsApp
              </a>
              <button type="button" onClick={clear} className="inline-flex min-h-11 items-center px-3 text-[13.5px] font-semibold text-muted hover:text-ink">
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {current && (
        <DecorDialog
          decor={current}
          family={familyName(current.type)}
          index={openIdx}
          total={ordered.length}
          onClose={() => setOpen(null)}
          onStep={(dir) => setOpen(ordered[(openIdx + dir + ordered.length) % ordered.length].code)}
          shortlisted={shortlist.includes(current.code)}
          onToggle={() => toggle(current.code)}
          full={full}
        />
      )}
    </div>
  );
}

function Swatch({d, on, full, onOpen, onToggle}: {d: Decor; on: boolean; full: boolean; onOpen: () => void; onToggle: () => void}) {
  return (
    <li>
      <figure className="group">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[4px] bg-bg-soft">
          <button type="button" onClick={onOpen} aria-label={`Enlarge ${d.code} ${d.name}`} className="absolute inset-0 block focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue">
            <Image
              src={d.image}
              alt=""
              fill
              loading="lazy"
              sizes="(max-width:640px) 31vw, (max-width:1280px) 16vw, 150px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </button>
          <button
            type="button"
            aria-pressed={on}
            onClick={onToggle}
            disabled={!on && full}
            aria-label={on ? `Remove ${d.code} ${d.name} from shortlist` : `Add ${d.code} ${d.name} to shortlist`}
            className="absolute right-0 top-0 grid h-11 w-11 place-items-center disabled:opacity-40"
          >
            <span
              className={cn(
                'grid h-8 w-8 place-items-center rounded-full shadow-card transition-[background-color,color,transform] duration-150 active:scale-90',
                on ? 'bg-indigo text-white' : 'bg-white/95 text-ink'
              )}
            >
              {on ? <Check className="h-4 w-4" aria-hidden /> : <Heart className="h-4 w-4" aria-hidden />}
            </span>
          </button>
        </div>
        <figcaption className="mt-1.5 text-[12px] leading-tight">
          <span className="t-label block text-ink">{d.code}</span>
          <span className="block break-words text-muted">{d.name}</span>
        </figcaption>
      </figure>
    </li>
  );
}
