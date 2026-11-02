import {Link} from '@/i18n/navigation';
import {productHref, type Product} from '@/data/products';
import {EXPOSURE_LABEL} from '@/content/site';

/**
 * Compact product matrix for specifiers — one row per product, verified
 * columns only (unknowns show an en dash, never a guess). Scrolls inside its
 * own frame on phones.
 */
export function SpecMatrix({products}: {products: Product[]}) {
  const thick = (p: Product) => {
    const mm = p.sizes.filter((s) => /MM$/.test(s)).map((s) => s.replace(' MM', ''));
    return mm.length ? `${mm.join(' · ')} mm` : p.sizes.length ? p.sizes.join(' · ') : '—';
  };
  const grade = (p: Product) => p.specs.find(([k]) => k === 'Grade' || k === 'Board' || k === 'Type')?.[1] ?? '—';
  return (
    <div className="overflow-x-auto rounded-[8px] border border-line" tabIndex={0} role="region" aria-label="Specification matrix">
      <table className="w-full min-w-[680px] border-collapse text-[13px]">
        <thead className="bg-bg-soft text-left">
          <tr>
            {['Product', 'Type / grade', 'Exposure', 'Sizes', 'Standard / property'].map((h) => (
              <th key={h} scope="col" className="t-label px-4 py-3 font-medium text-muted">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.slug} className="border-t border-line align-top">
              <th scope="row" className="px-4 py-3 text-left font-semibold">
                <Link href={productHref(p)} className="text-ink hover:text-indigo">
                  {p.short}
                </Link>
              </th>
              <td className="px-4 py-3 text-ink">{grade(p)}</td>
              <td className="px-4 py-3 text-ink">{p.exposure ? EXPOSURE_LABEL[p.exposure] : '—'}</td>
              <td className="px-4 py-3 font-mono text-[12px] text-ink">{thick(p)}</td>
              <td className="px-4 py-3 text-ink">{p.standards.length ? p.standards.map((s) => s.label).join(', ') : p.specsOnRequest ? 'On request' : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
