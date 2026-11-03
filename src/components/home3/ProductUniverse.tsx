import Image from 'next/image';
import {ArrowRight} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {CATEGORIES, PRODUCTS, categoryHref} from '@/data/products';
import {CATEGORY_COPY} from '@/content/categories';
import {APPLICATIONS} from '@/content/site';
import {CATEGORY_SCENE} from '@/content/home';
import {STATS, countByApplication, countByCategory, thicknessesFor} from '@/data/stats';
import {CountUp} from '@/components/motion/CountUp';
import {SECTION, SectionHead} from './ui';

/**
 * 03 PRODUCT UNIVERSE — the range shown as data: image-led category tiles
 * with computed product counts, brand and thickness options, plus the
 * application index (product counts per application). Never "largest".
 */
export function ProductUniverse() {
  const figures = [
    {v: STATS.categories, l: 'Categories'},
    {v: STATS.products, l: 'Products'},
    {v: STATS.brands, l: 'Brands'},
    {v: STATS.decors, l: 'Prelam décors'}
  ];
  return (
    <section id="range" aria-labelledby="range-title" className={`${SECTION} bg-white`}>
      <div className="shell">
        <SectionHead
          id="range-title"
          eyebrow="Product universe"
          title="Six material categories, one supply desk."
          lead="Every figure on this page is counted from the live catalogue — open any category for grades, thicknesses and specifications."
          aside={
            <dl className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-4">
              {figures.map((f) => (
                <div key={f.l} className="flex flex-col gap-1">
                  <dt className="order-2 text-[12.5px] text-muted">{f.l}</dt>
                  <dd className="order-1 text-[clamp(1.7rem,1.3rem+1.3vw,2.4rem)] font-semibold leading-none tracking-tight text-indigo">
                    <CountUp value={String(f.v)} />
                  </dd>
                </div>
              ))}
            </dl>
          }
        />

        <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c, i) => {
            const copy = CATEGORY_COPY[c.slug];
            const brands = [...new Set(PRODUCTS.filter((p) => p.category === c.slug).map((p) => p.brand))];
            const t = thicknessesFor(c.slug);
            return (
              <li key={c.slug} data-reveal="up" style={{['--d' as string]: `${(i % 3) * 90}ms`}}>
                <Link href={categoryHref(c.slug)} className="tile-lift group flex h-full flex-col rounded-[10px] border border-line bg-white">
                  <span className="tile-zoom relative block aspect-[16/10] overflow-hidden rounded-t-[10px] bg-bg-soft" data-reveal="mask">
                    <Image src={CATEGORY_SCENE[c.slug] ?? c.image} alt="" fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover" />
                  </span>
                  <span className="flex flex-1 flex-col gap-2 p-5">
                    <span className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                      <span className="text-[18px] font-semibold leading-snug text-ink group-hover:text-indigo">{copy.name}</span>
                      <span className="t-label text-orange-ink">{countByCategory(c.slug)} products</span>
                    </span>
                    <span className="text-[14px] leading-relaxed text-muted">{copy.what}</span>
                    <span className="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-2 text-[12.5px] text-steel">
                      <span>{brands.join(' · ')}</span>
                      {t.length > 0 && <span>{t.length} thickness options</span>}
                      {c.subs.length > 1 && <span>{c.subs.length} types</span>}
                    </span>
                    <span className="arrow-nudge inline-flex items-center gap-1.5 pt-1 text-[13.5px] font-semibold text-indigo">
                      View {copy.short} <ArrowRight className="h-4 w-4" aria-hidden />
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-10 rounded-[10px] border border-line bg-bg-soft p-5 sm:p-6" data-reveal="up">
          <h3 className="t-label text-steel">Browse by application</h3>
          <ul className="mt-4 flex flex-wrap gap-2">
            {APPLICATIONS.map((a) => (
              <li key={a.key}>
                <Link
                  href={{pathname: '/products', query: {app: a.key}}}
                  className="inline-flex min-h-11 items-center gap-2 rounded-[6px] border border-line bg-white px-3.5 py-2 text-[14px] font-medium text-ink hover:border-indigo/40 hover:text-indigo"
                >
                  {a.label} <span className="t-label text-steel">{countByApplication(a.key)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
