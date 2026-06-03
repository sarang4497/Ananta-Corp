import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Reveal, RevealItem} from '@/components/ui/Reveal';
import {Breadcrumbs} from '@/components/catalog/Breadcrumbs';
import {CatalogCard} from '@/components/catalog/CatalogCard';
import {CtaBand} from '@/components/home/CtaBand';
import {
  CATEGORIES,
  categoryBySlug,
  categoryHref,
  productsBySubcategory,
  type CategorySlug
} from '@/data/products';
import {buildAlternates} from '@/lib/metadata';

type Params = {params: Promise<{locale: string; category: string; sub: string}>};

export function generateStaticParams() {
  return CATEGORIES.flatMap((c) => c.subs.map((s) => ({category: c.slug, sub: s.slug})));
}

export async function generateMetadata({params}: Params): Promise<Metadata> {
  const {locale, category, sub} = await params;
  const cat = categoryBySlug(category);
  const subDef = cat?.subs.find((s) => s.slug === sub);
  if (!cat || !subDef) return {};
  setRequestLocale(locale);
  const tn = await getTranslations('nav');
  const tc = await getTranslations('catalog');
  return {
    title: tc('subcategory.metaTitle', {sub: tn(subDef.key), category: tn(cat.key)}),
    description: tc('subcategory.metaDescription', {sub: tn(subDef.key), category: tn(cat.key)}),
    alternates: buildAlternates(
      {pathname: '/products/[category]/[sub]', params: {category: cat.slug, sub}},
      locale
    )
  };
}

export default async function SubcategoryPage({params}: Params) {
  const {locale, category, sub} = await params;
  const cat = categoryBySlug(category);
  const subDef = cat?.subs.find((s) => s.slug === sub);
  if (!cat || !subDef) notFound();
  setRequestLocale(locale);

  const tn = await getTranslations('nav');
  const tc = await getTranslations('catalog');
  const products = productsBySubcategory(cat.slug, sub);

  return (
    <>
      <section className="shell flex flex-col gap-6 pb-4 pt-10 sm:pt-14">
        <Breadcrumbs
          items={[
            {label: tc('breadcrumb.home'), href: '/'},
            {label: tc('breadcrumb.products'), href: '/products'},
            {label: tn(cat.key), href: categoryHref(cat.slug as CategorySlug)},
            {label: tn(subDef.key)}
          ]}
        />
        <Reveal trigger="load" className="flex max-w-3xl flex-col items-start gap-3">
          <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight text-ink sm:text-5xl">
            {tc('subcategory.heading', {sub: tn(subDef.key)})}
          </h1>
          <p className="text-pretty text-lg leading-relaxed text-muted">
            {tc('subcategory.intro', {sub: tn(subDef.key), category: tn(cat.key)})}
          </p>
        </Reveal>
      </section>

      <section className="shell pb-8 pt-8">
        <Reveal
          stagger={0.07}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {products.map((p) => (
            <RevealItem key={p.slug} className="h-full">
              <CatalogCard
                product={p}
                categoryLabel={tn(subDef.key)}
                viewLabel={tc('card.view')}
                priceLabel={tc('card.price')}
              />
            </RevealItem>
          ))}
        </Reveal>
      </section>

      <div className="pt-8 sm:pt-12">
        <CtaBand
          heading={tc('cta.heading')}
          sub={tc('cta.sub')}
          note={tc('cta.note')}
          ctaWhatsapp={tc('card.price')}
          ctaContact={tc('cta.contact')}
        />
      </div>
    </>
  );
}
