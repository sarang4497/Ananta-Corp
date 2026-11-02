'use client';

import {useId, useState} from 'react';
import {Link} from '@/i18n/navigation';
import {productHref} from '@/data/products';
import {COMPARABLE, compare} from '@/data/stats';

/**
 * MICRO-DEMO B — compare two boards using ONLY stored, sourced attributes.
 * Rows appear only where both products have a value; if fewer than four
 * fields overlap the pair is declared not comparable (no invented values).
 */
export function CompareTool() {
  const idA = useId();
  const idB = useId();
  const [a, setA] = useState('duroply-mr-moisture-resistant-plywood');
  const [b, setB] = useState('duroply-bwp-boiling-water-proof-plywood');
  const pa = COMPARABLE.find((p) => p.slug === a)!;
  const pb = COMPARABLE.find((p) => p.slug === b)!;
  const rows = pa && pb && a !== b ? compare(pa, pb) : null;
  const select = 'min-h-11 w-full rounded-[6px] border border-line bg-white px-3 text-[14px] text-ink';

  return (
    <div id="compare" className="rounded-[12px] border border-line bg-white p-5 sm:p-7" data-reveal="up">
      <p className="t-label text-orange-ink">Tool 02 · Compare</p>
      <h3 className="t-h3 mt-3 text-ink">Two boards, side by side.</h3>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div>
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
        <div>
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
        ) : !rows ? (
          <p className="rounded-[6px] bg-bg-soft p-4 text-[14px] text-muted">
            These two don’t share enough verified attributes for a fair comparison — open each product page for its own data.
          </p>
        ) : (
          <table className="w-full table-fixed border-collapse text-[13px]">
            <caption className="sr-only">
              {pa.name} compared with {pb.name}
            </caption>
            <thead>
              <tr className="text-left">
                <th scope="col" className="w-[28%] pb-2 font-medium text-steel">
                  <span className="sr-only">Attribute</span>
                </th>
                <th scope="col" className="pb-2 pr-2 align-bottom">
                  <Link href={productHref(pa)} className="font-semibold text-indigo hover:underline">
                    {pa.short}
                  </Link>
                </th>
                <th scope="col" className="pb-2 align-bottom">
                  <Link href={productHref(pb)} className="font-semibold text-indigo hover:underline">
                    {pb.short}
                  </Link>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label} className="border-t border-line align-top">
                  <th scope="row" className="py-2.5 pr-2 text-left font-medium text-muted">
                    {r.label}
                  </th>
                  <td className="break-words py-2.5 pr-2 text-ink">{r.a}</td>
                  <td className="break-words py-2.5 text-ink">{r.b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
