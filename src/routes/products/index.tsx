import type {CSSProperties} from 'react';
import type {Metadata} from 'next';
import Image from 'next/image';
import {setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {CATEGORIES, categoryHref} from '@/data/products';
import {CATEGORY_COPY} from '@/content/categories';
import {STATS, countByCategory} from '@/data/stats';
import {PageIntro} from '@/components/catalog2/PageIntro';
import {CatalogBrowser} from '@/components/catalog2/CatalogBrowser';
import {buildAlternates} from '@/lib/metadata';

type Params = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: Params): Promise<Metadata> {
  const {locale} = await params;
  return {
    title: 'All Products — Plywood, MDF, HDHMR, Prelam, Flush Doors & Smart Locks',
    description: `Browse all ${STATS.products} products at Ananta Corporation, Ahmedabad: Duroply plywood and flush doors, Action TESA MDF, HDHMR, Moist Master and pre-laminated boards, Tenon smart locks. Filter by brand, application and exposure.`,
    alternates: buildAlternates('/products', locale)
  };
}

export default async function ProductsPage({params}: Params) {
  const {locale} = await params;
  setRequestLocale(locale);
  return (
    <>
      <PageIntro
        crumbs={[{label: 'Home', href: '/'}, {label: 'Products'}]}
        eyebrow="Material library"
        title="The full catalogue"
        lead={`${STATS.products} products across ${STATS.categories} categories from ${STATS.brands} brands — filter by brand, application or exposure, or search by grade, thickness or décor code.`}
      />
      <nav aria-label="Categories" className="border-b border-line bg-white">
        <ul className="shell rail gap-3 py-4 lg:grid lg:grid-cols-6 lg:overflow-visible">
          {CATEGORIES.map((c, i) => (
            <li key={c.slug} className="w-[168px] shrink-0 snap-start lg:w-auto" data-reveal="up" style={{'--d': `${i * 40}ms`} as CSSProperties}>
              <Link href={categoryHref(c.slug)} className="tile-lift tile-zoom group flex h-full items-center gap-3 rounded-[10px] border border-line bg-white p-2.5">
                <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-[6px] bg-bg-soft">
                  <Image src={c.image} alt="" fill sizes="48px" className="object-cover" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[13px] font-semibold leading-snug text-ink group-hover:text-indigo">{CATEGORY_COPY[c.slug].short}</span>
                  <span className="t-label text-steel">
                    {countByCategory(c.slug)} product{countByCategory(c.slug) === 1 ? '' : 's'}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <section className="bg-bg-soft pb-[calc(3rem+env(safe-area-inset-bottom))] pt-6 sm:py-12">
        <div className="shell">
          <CatalogBrowser />
        </div>
      </section>
    </>
  );
}
