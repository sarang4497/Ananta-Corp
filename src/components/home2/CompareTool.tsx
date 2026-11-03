'use client';

import Image from 'next/image';
import {Suspense, useEffect, useId, useState} from 'react';
import {useSearchParams} from 'next/navigation';
import {ArrowLeftRight, ArrowRight, Check, Link2} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {productHref, type Product} from '@/data/products';
import {COMPARABLE, compare} from '@/data/stats';
import {bySlug, compareHref, resolvePair} from '@/content/tools-data';
import {BrandLogo} from '@/components/site/BrandLogo';
import {WhatsAppIcon} from '@/components/ui/Button';
import {quoteWhatsappUrl} from '@/lib/quote';
import {cn} from '@/lib/cn';
import s from '@/components/tools/tools.module.css';

type Variant = 'embedded' | 'page';
type Props = {variant?: Variant; initialA?: string; initialB?: string};

/**
 * Board comparison — two products using ONLY stored, sourced attributes
 * (compare() in src/data/stats.ts). Rows appear only where both products have
 * a value; fewer than four overlapping fields → "not comparable".
 * The page variant keeps the pair in the URL (?a=&b=) for sharing.
 */
export function CompareTool(props: Props) {
  if (props.variant !== 'page') return <CompareView {...props} />;
  return (
    <Suspense fallback={<CompareView {...props} />}>
      <CompareFromUrl {...props} />
    </Suspense>
  );
}

function CompareFromUrl(props: Props) {
  const sp = useSearchParams();
  const [a, b] = resolvePair(sp.get('a') ?? props.initialA, sp.get('b') ?? props.initialB);
  // Read once on mount; afterwards the view owns the state and mirrors it into the URL.
  return <CompareView {...props} initialA={a} initialB={b} syncUrl />;
}

const isCompared = (slug: string) => COMPARABLE.some((p) => p.slug === slug);

function CompareView({variant = 'embedded', initialA, initialB, syncUrl = false}: Props & {syncUrl?: boolean}) {
  const idA = useId();
  const idB = useId();
  const [start] = useState(() => resolvePair(initialA, initialB));
  const [a, setA] = useState(start[0]);
  const [b, setB] = useState(start[1]);
  const [copied, setCopied] = useState(false);
  const pa = bySlug(a)!;
  const pb = bySlug(b)!;
  const rows = isCompared(a) && isCompared(b) && a !== b ? compare(pa, pb) : null;
  const page = variant === 'page';
  const Title = page ? 'h2' : 'h3';

  useEffect(() => {
    if (!syncUrl) return;
    const url = new URL(window.location.href);
    if (url.searchParams.get('a') === a && url.searchParams.get('b') === b) return;
    url.searchParams.set('a', a);
    url.searchParams.set('b', b);
    window.history.replaceState(window.history.state, '', url);
  }, [a, b, syncUrl]);

  const copy = async () => {
    const url = new URL(window.location.href);
    if (!syncUrl) {
      url.pathname = '/tools/compare';
      url.search = '';
      url.hash = '';
    }
    url.searchParams.set('a', a);
    url.searchParams.set('b', b);
    try {
      await navigator.clipboard.writeText(url.toString());
    } catch {
      window.prompt('Copy this link', url.toString());
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const select = 'min-h-11 w-full min-w-0 rounded-[6px] border border-line bg-white px-3 text-[14px] text-ink';
  const diffs = rows ? rows.filter((r) => r.a !== r.b).length : 0;

  return (
    <div id="compare" className={cn('rounded-[12px] border border-line bg-white', page ? 'p-4 sm:p-8' : 'p-5 sm:p-7')} data-reveal="up">
      <p className="t-label text-orange-ink">Tool 02 · Compare</p>
      <Title className="t-h3 mt-3 text-balance text-ink">{page ? 'Pick two boards.' : 'Two boards, side by side.'}</Title>

      <div className="mt-5 grid grid-cols-1 items-end gap-2 min-[480px]:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:gap-3">
        <div className="min-w-0">
          <label htmlFor={idA} className="text-[13px] font-semibold text-muted">
            Product A
          </label>
          <select id={idA} value={a} onChange={(e) => setA(e.target.value)} className={`${select} mt-1.5`}>
            {COMPARABLE.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.short}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={() => {
            setA(b);
            setB(a);
          }}
          aria-label="Swap products A and B"
          className="grid h-11 w-11 place-items-center justify-self-center rounded-[6px] border border-line text-ink transition-[border-color,color,transform] duration-150 hover:border-indigo/50 hover:text-indigo active:scale-95"
        >
          <ArrowLeftRight className="h-4 w-4" aria-hidden />
        </button>
        <div className="min-w-0">
          <label htmlFor={idB} className="text-[13px] font-semibold text-muted">
            Product B
          </label>
          <select id={idB} value={b} onChange={(e) => setB(e.target.value)} className={`${select} mt-1.5`}>
            {COMPARABLE.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.short}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5" aria-live="polite">
        {a === b ? (
          <p className="rounded-[6px] bg-bg-soft p-4 text-[14px] text-muted">Pick two different products.</p>
        ) : (
          <>
            <div key={`${a}|${b}`} className={cn('grid grid-cols-2 gap-2 sm:gap-4', s.pop)}>
              <Head p={pa} label="A" page={page} />
              <Head p={pb} label="B" page={page} />
            </div>
            {!rows ? (
              <p className="mt-4 rounded-[6px] bg-bg-soft p-4 text-[14px] text-muted">
                These two don’t share enough verified attributes for a fair comparison — open each product page for its own data.
              </p>
            ) : (
              <>
                <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] text-muted">
                  <span>
                    {rows.length} shared attributes · <span className="font-semibold text-ink">{diffs} differ</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-[2px] border-l-2 border-orange bg-orange/10" aria-hidden /> highlighted = different
                  </span>
                </p>
                <div role="table" aria-label={`${pa.name} compared with ${pb.name}`} className="mt-2 border-b border-line text-[13.5px]">
                  <div role="rowgroup" className="sr-only">
                    <div role="row">
                      <span role="columnheader">Attribute</span>
                      <span role="columnheader">{pa.short}</span>
                      <span role="columnheader">{pb.short}</span>
                    </div>
                  </div>
                  <div role="rowgroup">
                    {rows.map((r) => {
                      const differs = r.a !== r.b;
                      return (
                        <div
                          key={r.label}
                          role="row"
                          data-differs={differs || undefined}
                          className={cn(
                            'grid grid-cols-2 gap-x-3 gap-y-1 border-t border-l-2 border-t-line px-2 py-2.5 sm:grid-cols-[minmax(7rem,24%)_minmax(0,1fr)_minmax(0,1fr)] sm:gap-x-4',
                            differs ? `border-l-orange ${s.diff}` : 'border-l-transparent'
                          )}
                        >
                          <span role="rowheader" className="col-span-2 font-medium text-muted sm:col-span-1">
                            {r.label}
                          </span>
                          <span role="cell" className="min-w-0 break-words text-ink">
                            {r.a}
                          </span>
                          <span role="cell" className="min-w-0 break-words text-ink">
                            {r.b}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={copy}
                className="inline-flex min-h-11 items-center gap-2 rounded-[6px] border border-ink/15 bg-white px-4 text-[14px] font-semibold text-ink hover:border-indigo/50 hover:text-indigo"
              >
                {copied ? <Check className="h-4 w-4 text-wa" aria-hidden /> : <Link2 className="h-4 w-4" aria-hidden />}
                {copied ? 'Link copied' : 'Copy link'}
              </button>
              {!page && (
                <Link
                  href={compareHref(a, b)}
                  className="arrow-nudge inline-flex min-h-11 items-center gap-1.5 px-2 text-[14px] font-semibold text-indigo hover:underline"
                >
                  Open full comparison <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              )}
              <span className="sr-only" role="status">
                {copied ? 'Link copied to clipboard' : ''}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Head({p, label, page}: {p: Product; label: 'A' | 'B'; page: boolean}) {
  const staged = p.category === 'smart-locks' || p.cardImage.includes('/products/');
  return (
    <div className="flex min-w-0 flex-col rounded-[8px] border border-line">
      <div className={cn('relative overflow-hidden rounded-t-[8px]', page ? 'aspect-[4/3] lg:aspect-[16/9]' : 'aspect-[16/9]', staged ? 'bg-grid bg-bg-soft' : 'bg-bg-soft')}>
        <Image
          src={p.cardImage}
          alt=""
          fill
          sizes="(max-width: 640px) 45vw, 320px"
          className={staged ? 'object-contain p-3 mix-blend-multiply' : 'object-cover'}
        />
        <span className="t-label absolute left-2 top-2 rounded-[3px] bg-white/90 px-1.5 py-0.5 text-ink">{label}</span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-2.5 sm:p-4">
        <BrandLogo brand={p.brand} height={p.brand === 'Action TESA' ? 18 : 14} />
        <Link href={productHref(p)} className="text-[13.5px] font-semibold leading-snug text-ink hover:text-indigo sm:text-[15px]">
          {p.short}
        </Link>
        <a
          href={quoteWhatsappUrl({product: p.name, source: 'Board Comparison'})}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Get price for ${p.name} on WhatsApp`}
          className="mt-auto inline-flex min-h-11 items-center justify-center gap-1.5 rounded-[6px] bg-orange px-2.5 py-2 text-center text-[13px] font-semibold leading-tight text-white hover:bg-orange-deep"
        >
          <WhatsAppIcon className="h-3.5 w-3.5 shrink-0" /> Get price
        </a>
      </div>
    </div>
  );
}
