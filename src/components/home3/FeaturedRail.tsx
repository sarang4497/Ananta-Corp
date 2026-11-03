import {ArrowRight} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {PRODUCTS} from '@/data/products';
import {FEATURED_SLUGS} from '@/content/home';
import {ProductTile} from '@/components/catalog2/ProductTile';
import {SECTION, SectionHead} from './ui';

/** 05 FEATURED PRODUCTS — snap rail on phones, grid from lg. */
export function FeaturedRail() {
  const items = FEATURED_SLUGS.map((s) => PRODUCTS.find((p) => p.slug === s)).filter((p) => !!p);
  return (
    <section aria-labelledby="featured-title" className={`${SECTION} bg-white`}>
      <div className="shell">
        <SectionHead
          id="featured-title"
          eyebrow="Featured products"
          title="One product from every corner of the range."
          aside={
            <Link href="/products" className="arrow-nudge inline-flex min-h-11 items-center gap-1.5 text-[14.5px] font-semibold text-indigo">
              All {PRODUCTS.length} products <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          }
        />
        <ul className="rail -mx-[var(--side)] mt-8 gap-3 px-[var(--side)] pb-2 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-4 lg:overflow-visible lg:px-0" aria-label="Featured products">
          {items.map((p, i) => (
            <li key={p.slug} className="w-[72vw] max-w-[300px] shrink-0 snap-start lg:w-auto lg:max-w-none" data-reveal="up" style={{['--d' as string]: `${(i % 4) * 80}ms`}}>
              <ProductTile product={p} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
