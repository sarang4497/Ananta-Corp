import {Link} from '@/i18n/navigation';
import {PRODUCTS, productHref} from '@/data/products';
import {EXPOSURE_LABEL} from '@/content/site';
import {TECH_SLUGS, TECH_SPEC_LABELS} from '@/content/home';
import {SECTION, SectionHead} from './ui';

const LEVEL = {dry: 1, humid: 2, wet: 3} as const;

/**
 * 06 MATERIAL TECHNOLOGY — what separates MR, BWP, MDF, HDHMR, HMR and
 * prelam, using ONLY each product's own spec rows and standards, always
 * attributed to the manufacturer that states them. Navy proof band.
 */
export function MaterialTech() {
  const boards = TECH_SLUGS.map((s) => PRODUCTS.find((p) => p.slug === s)).filter((p) => !!p);
  return (
    <section aria-labelledby="tech-title" className={`${SECTION} relative bg-navy text-white`}>
      <div aria-hidden className="bg-grid-dark pointer-events-none absolute inset-0 opacity-50" />
      <div className="shell relative">
        <SectionHead
          dark
          id="tech-title"
          eyebrow="Material technology"
          title="What actually separates one board from another."
          lead="Grade, resin, density and exposure — as published for each product. Standards are shown exactly as stated by the manufacturer."
        />
        <ul className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {boards.map((p, i) => {
            const rows = TECH_SPEC_LABELS.map((l) => p.specs.find(([k]) => k === l)).filter((r) => !!r);
            const lvl = p.exposure ? LEVEL[p.exposure] : 0;
            return (
              <li key={p.slug} className="flex flex-col rounded-[10px] border border-navy-line bg-navy-2/60 p-5 sm:p-6" data-reveal="up" style={{['--d' as string]: `${(i % 3) * 90}ms`}}>
                <p className="t-label text-orange-light">{p.brand}</p>
                <h3 className="mt-2 text-[18px] font-semibold leading-snug">
                  <Link href={productHref(p)} className="hover:underline">
                    {p.short}
                  </Link>
                </h3>
                {p.exposure && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between gap-3 text-[12.5px] text-white/70">
                      <span>Exposure</span>
                      <span className="font-semibold text-white">{EXPOSURE_LABEL[p.exposure]}</span>
                    </div>
                    <div className="mt-2 grid grid-cols-3 gap-1" aria-hidden>
                      {[1, 2, 3].map((n) => (
                        <span key={n} className={n <= lvl ? 'h-1.5 rounded-full bg-orange' : 'h-1.5 rounded-full bg-white/15'} />
                      ))}
                    </div>
                  </div>
                )}
                <dl className="mt-5 flex flex-col divide-y divide-white/10 border-y border-white/10">
                  {rows.map(([k, v]) => (
                    <div key={k} className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-3 py-2.5 text-[13.5px]">
                      <dt className="text-white/60">{k}</dt>
                      <dd className="text-white">{v}</dd>
                    </div>
                  ))}
                </dl>
                {p.standards.length > 0 && (
                  <ul className="mt-4 flex flex-col gap-1.5">
                    {p.standards.map((s) => (
                      <li key={s.label} className="text-[13px] leading-snug text-white/80">
                        <span className="font-semibold text-white">{s.label}</span>
                        {s.detail ? ` — ${s.detail}` : ''} <span className="text-white/55">(as stated by {s.by})</span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
