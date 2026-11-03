import {Link} from '@/i18n/navigation';
import {productHref, type Product} from '@/data/products';
import {EXPOSURE_LABEL} from '@/content/site';
import {mmSizes} from '@/data/usps';

/**
 * Compact product matrix for specifiers — one row per product, verified
 * columns only (unknowns show an en dash, never a guess). On phones the table
 * scrolls inside its own focusable frame (a genuine scroller, so it is marked
 * data-overflow-ok); the first column stays pinned.
 */
export function SpecMatrix({products}: {products: Product[]}) {
  const thick = (p: Product) => {
    const mm = mmSizes(p).map((s) => s.replace(' MM', ''));
    return mm.length ? `${mm.join(' · ')} mm` : p.sizes.length ? p.sizes.join(' · ') : '—';
  };
  const grade = (p: Product) => p.specs.find(([k]) => k === 'Grade' || k === 'Board' || k === 'Type')?.[1] ?? '—';
  return (
    <div className="overflow-x-auto rounded-[10px] border border-line bg-white focus-visible:outline-2 focus-visible:outline-blue" tabIndex={0} role="region" aria-label="Specification matrix — scrolls sideways on small screens" data-overflow-ok>
      <table className="w-full min-w-[720px] border-collapse text-[13px]">
        <thead className="bg-bg-soft text-left">
          <tr>
            {['Product', 'Type / grade', 'Exposure', 'Thickness / sizes', 'Standard / property'].map((h, i) => (
              <th key={h} scope="col" className={i === 0 ? 't-label sticky left-0 z-[1] bg-bg-soft px-4 py-3 font-medium text-muted' : 't-label px-4 py-3 font-medium text-muted'}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.slug} className="border-t border-line align-top transition-colors duration-150 hover:bg-surface-blue/40">
              <th scope="row" className="sticky left-0 z-[1] max-w-[200px] bg-white px-4 py-3 text-left font-semibold">
                <Link href={productHref(p)} className="text-ink hover:text-indigo">
                  {p.short}
                </Link>
              </th>
              <td className="px-4 py-3 text-ink">{grade(p)}</td>
              <td className="px-4 py-3 text-ink">{p.exposure ? EXPOSURE_LABEL[p.exposure] : '—'}</td>
              <td className="px-4 py-3 font-mono text-[12px] text-ink">{thick(p)}</td>
              <td className="px-4 py-3 text-ink">
                {p.standards.length ? `${p.standards.map((s) => s.label).join(', ')} (${p.standards[0].by})` : p.specsOnRequest ? 'On request' : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
