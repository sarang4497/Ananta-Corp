'use client';

import Image from 'next/image';
import {useEffect, useId, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent} from 'react';
import {ArrowRight, CornerDownLeft, History, MessageSquareText, Search, X} from 'lucide-react';
import {Link, useRouter} from '@/i18n/navigation';
import {POPULAR_QUERIES, groupResults, search, type SearchDoc, type SearchGroup} from '@/data/search';
import {NAV_CATEGORIES} from '@/content/nav';
import {SEARCH_PLACEHOLDER} from '@/content/nav';
import {cn} from '@/lib/cn';

const RECENT_KEY = 'ananta-search-recent';

function readRecent(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]');
    return Array.isArray(v) ? v.filter((x) => typeof x === 'string').slice(0, 5) : [];
  } catch {
    return [];
  }
}
function saveRecent(q: string) {
  const t = q.trim();
  if (!t) return;
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify([t, ...readRecent().filter((x) => x.toLowerCase() !== t.toLowerCase())].slice(0, 5)));
  } catch {
    /* private mode */
  }
}

const KIND_LABEL: Record<SearchDoc['kind'], string> = {
  product: 'Product',
  category: 'Category',
  subcategory: 'Grade',
  brand: 'Brand',
  application: 'Application',
  tool: 'Tool',
  post: 'Guide',
  decor: 'Décor',
  page: 'Page'
};

/**
 * Site search dialog (lazy chunk, mounted by SearchHost).
 * Desktop: centred ~720px dialog. Phones (<768): full-screen sheet with a
 * large input. Results grouped (Products, Categories, Brands, Applications,
 * Tools, Guides, Décors, Pages); ↑/↓ move, Enter opens, Escape closes. Empty
 * query → recent searches + popular chips + categories. Always offers "Ask
 * the assistant" (dispatches open-bella with the query).
 */
export default function SearchDialog({initialQuery = '', onClose}: {initialQuery?: string; onClose: () => void}) {
  const [q, setQ] = useState(initialQuery);
  const [active, setActive] = useState(0);
  // Client-only chunk (ssr:false), so localStorage is safe in the initialiser.
  const [recent] = useState<string[]>(readRecent);
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const uid = useId();

  const groups = useMemo(() => groupResults(search(q, {limit: 60}), 6), [q]);
  const flat = useMemo(() => groups.flatMap((g) => g.items.map((r) => r.doc)), [groups]);
  const optId = (i: number) => `${uid}-o${i}`;

  useEffect(() => {
    input.current?.focus();
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = 'hidden';
    return () => {
      html.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    document.getElementById(optId(active))?.scrollIntoView({block: 'nearest'});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const go = (d: SearchDoc) => {
    saveRecent(q);
    onClose();
    router.push(d.href as Parameters<typeof router.push>[0]);
  };

  const ask = () => {
    const message = q.trim();
    onClose();
    window.dispatchEvent(new CustomEvent('open-bella', {detail: message ? {message} : undefined}));
  };

  const onKey = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      onClose();
    } else if (e.key === 'ArrowDown' && flat.length) {
      e.preventDefault();
      setActive((i) => (i + 1) % flat.length);
    } else if (e.key === 'ArrowUp' && flat.length) {
      e.preventDefault();
      setActive((i) => (i - 1 + flat.length) % flat.length);
    } else if (e.key === 'Enter' && e.target === input.current) {
      e.preventDefault();
      if (flat[active]) go(flat[active]);
      else if (q.trim()) ask();
    } else if (e.key === 'Tab') {
      // Keep focus inside the dialog.
      const f = [...(box.current?.querySelectorAll<HTMLElement>('input,button,a[href]') ?? [])];
      if (!f.length) return;
      const i = f.indexOf(document.activeElement as HTMLElement);
      if (e.shiftKey && i <= 0) {
        e.preventDefault();
        f[f.length - 1].focus();
      } else if (!e.shiftKey && i === f.length - 1) {
        e.preventDefault();
        f[0].focus();
      }
    }
  };

  const chip =
    'inline-flex min-h-10 items-center gap-1.5 rounded-full border border-line bg-white px-3.5 text-[13.5px] text-ink transition-colors duration-150 hover:border-indigo/40 hover:text-indigo';

  const offsets = groups.map((_, gi) => groups.slice(0, gi).reduce((a, g) => a + g.items.length, 0));
  return (
    <div className="fixed inset-0 z-[75]" onKeyDown={onKey}>
      <div className="absolute inset-0 bg-navy/45 backdrop-blur-[2px]" onClick={onClose} aria-hidden />
      <div
        ref={box}
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        data-testid="search-dialog"
        className={cn(
          'sheet-up absolute flex flex-col bg-white',
          // phones: full-screen sheet
          'inset-0 pt-[env(safe-area-inset-top)]',
          // ≥768: centred dialog
          'md:inset-auto md:left-1/2 md:top-[min(12vh,120px)] md:max-h-[min(680px,calc(100dvh-2*min(12vh,120px)))] md:w-[min(720px,calc(100vw-2*var(--gutter)))] md:-translate-x-1/2 md:rounded-[14px] md:pt-0 md:shadow-lift'
        )}
      >
        <div className="flex items-center gap-2 border-b border-line px-[var(--gutter)] md:px-4">
          <Search className="h-5 w-5 shrink-0 text-indigo" aria-hidden />
          <input
            ref={input}
            type="text"
            inputMode="search"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setActive(0);
            }}
            placeholder={SEARCH_PLACEHOLDER}
            aria-label="Search products, brands, décors and guides"
            role="combobox"
            aria-expanded={flat.length > 0}
            aria-controls={`${uid}-list`}
            aria-activedescendant={flat.length ? optId(active) : undefined}
            aria-autocomplete="list"
            enterKeyHint="search"
            autoComplete="off"
            spellCheck={false}
            data-testid="search-input"
            className="min-h-16 min-w-0 flex-1 bg-transparent text-[18px] text-ink outline-none placeholder:text-steel md:min-h-14 md:text-[16px]"
          />
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-[8px] px-2 text-[14px] font-medium text-muted hover:bg-bg-soft hover:text-ink"
            aria-label="Close search"
          >
            <X className="h-5 w-5 md:hidden" aria-hidden />
            <kbd className="hidden rounded-[4px] border border-line px-1.5 font-mono text-[11px] md:inline">Esc</kbd>
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-[var(--gutter)] pb-4 md:px-2">
          {!q.trim() ? (
            <div className="flex flex-col gap-6 px-0 py-5 md:px-2">
              {recent.length > 0 && (
                <section aria-label="Recent searches">
                  <p className="t-label text-steel">Recent</p>
                  <ul className="mt-2.5 flex flex-wrap gap-2">
                    {recent.map((r) => (
                      <li key={r}>
                        <button type="button" className={chip} onClick={() => setQ(r)}>
                          <History className="h-3.5 w-3.5 text-steel" aria-hidden /> {r}
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
              <section aria-label="Popular searches">
                <p className="t-label text-steel">Popular</p>
                <ul className="mt-2.5 flex flex-wrap gap-2">
                  {POPULAR_QUERIES.map((p) => (
                    <li key={p}>
                      <button type="button" className={chip} onClick={() => setQ(p)}>
                        {p}
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
              <section aria-label="Browse categories">
                <p className="t-label text-steel">Browse categories</p>
                <ul className="mt-2.5 grid grid-cols-1 gap-1 sm:grid-cols-2">
                  {NAV_CATEGORIES.map((c) => (
                    <li key={c.slug}>
                      <Link href={c.href} onClick={onClose} className="flex min-h-12 items-center gap-3 rounded-[8px] p-1.5 hover:bg-bg-soft">
                        <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-[6px] bg-bg-soft">
                          <Image src={c.image} alt="" fill sizes="40px" className="object-cover" />
                        </span>
                        <span className="min-w-0 flex-1 text-[14.5px] font-medium text-ink">{c.name}</span>
                        <span className="tabular shrink-0 pr-1 text-[12.5px] text-steel">{c.count}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          ) : flat.length ? (
            <div id={`${uid}-list`} role="listbox" aria-label="Search results" className="py-2">
              {groups.map((g, gi) => (
                <div key={g.group} role="group" aria-labelledby={`${uid}-${slug(g.group)}`} className="pt-3">
                  <p id={`${uid}-${slug(g.group)}`} className="t-label px-0 pb-1.5 text-steel md:px-2">
                    {g.group}
                  </p>
                  {g.items.map(({doc}, k) => {
                    const i = offsets[gi] + k;
                    return (
                      <Link
                        key={doc.id}
                        id={optId(i)}
                        href={doc.href}
                        role="option"
                        aria-selected={i === active}
                        data-kind={doc.kind}
                        tabIndex={-1}
                        onMouseMove={() => active !== i && setActive(i)}
                        onClick={() => {
                          saveRecent(q);
                          onClose();
                        }}
                        className={cn(
                          'flex min-h-14 items-center gap-3 rounded-[8px] px-2 py-2 transition-colors duration-100',
                          i === active ? 'bg-surface-blue' : 'hover:bg-bg-soft'
                        )}
                      >
                        <Thumb doc={doc} group={g.group} />
                        <span className="min-w-0 flex-1">
                          <span className={cn('block text-[14.5px] font-medium leading-snug', i === active ? 'text-indigo' : 'text-ink')}>{doc.title}</span>
                          <span className="block text-[12.5px] leading-snug text-muted">{doc.subtitle}</span>
                        </span>
                        <span className="t-label hidden shrink-0 text-steel sm:inline">{KIND_LABEL[doc.kind]}</span>
                        {i === active && <CornerDownLeft className="hidden h-4 w-4 shrink-0 text-indigo md:block" aria-hidden />}
                      </Link>
                    );
                  })}
                </div>
              ))}
            </div>
          ) : (
            <div className="px-0 py-8 text-center md:px-2" data-testid="search-empty">
              <p className="text-[16px] font-semibold text-ink">No matches for “{q.trim()}”</p>
              <p className="mt-1.5 text-[14px] text-muted">Try a category, brand, grade (MR, BWP, HDHMR) or a 4-digit décor code.</p>
              <ul className="mt-4 flex flex-wrap justify-center gap-2">
                {POPULAR_QUERIES.slice(0, 5).map((p) => (
                  <li key={p}>
                    <button type="button" className={chip} onClick={() => setQ(p)}>
                      {p}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div
          className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-line bg-bg-soft px-[var(--gutter)] py-2.5 md:rounded-b-[14px] md:px-4"
          style={{paddingBottom: 'calc(10px + env(safe-area-inset-bottom))'}}
        >
          <button
            type="button"
            onClick={ask}
            data-testid="search-ask"
            className="inline-flex min-h-11 items-center gap-2 text-left text-[14px] font-semibold text-indigo hover:text-blue"
          >
            <MessageSquareText className="h-4 w-4 shrink-0" aria-hidden />
            {q.trim() ? <span>Ask the assistant about “{q.trim()}”</span> : <span>Ask the assistant</span>}
          </button>
          <Link href="/products" onClick={onClose} className="arrow-nudge inline-flex min-h-11 items-center gap-1.5 text-[13.5px] font-medium text-ink hover:text-indigo">
            Full catalogue <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </div>
  );
}

const slug = (g: SearchGroup) => g.toLowerCase().replace(/[^a-z]/g, '');

function Thumb({doc, group}: {doc: SearchDoc; group: SearchGroup}) {
  if (doc.image && doc.kind === 'brand') {
    return (
      <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-[6px] border border-line bg-white">
        <Image src={doc.image} alt="" fill sizes="40px" className="object-contain p-1" />
      </span>
    );
  }
  if (doc.image) {
    return (
      <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-[6px] bg-bg-soft">
        <Image src={doc.image} alt="" fill sizes="40px" className="object-cover" />
      </span>
    );
  }
  return (
    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[6px] bg-bg-soft font-mono text-[11px] font-semibold uppercase text-indigo" aria-hidden>
      {group.slice(0, 2)}
    </span>
  );
}
