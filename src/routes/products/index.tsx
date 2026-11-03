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
        <ul className="shell rail gap-3 py-4 lg:grid lg:grid-cols-6">
          {CATEGORIES.map((c) => (
            <li key={c.slug} className="w-[150px] lg:w-auto">
              <Link href={categoryHref(c.slug)} className="tile-lift group flex items-center gap-3 rounded-[6px] border border-line p-2">
                <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-[4px] bg-bg-soft">
                  <Image src={c.image} alt="" fill sizes="44px" className="object-cover" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[13px] font-semibold text-ink group-hover:text-indigo">{CATEGORY_COPY[c.slug].short}</span>
                  <span className="t-label text-steel">{countByCategory(c.slug)}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <section className="bg-bg-soft py-8 sm:py-12">
        <div className="shell">
          <CatalogBrowser />
        </div>
      </section>
    </>
  );
}
