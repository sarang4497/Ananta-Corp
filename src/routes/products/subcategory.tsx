import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {setRequestLocale} from 'next-intl/server';
import {CATEGORIES, categoryBySlug, categoryHref, productsBySubcategory} from '@/data/products';
import {CATEGORY_COPY, SUB_NAMES} from '@/content/categories';
import {CategoryView} from '@/components/catalog2/CategoryView';
import {buildAlternates} from '@/lib/metadata';

type Params = {params: Promise<{locale: string; category: string; sub: string}>};

export function generateStaticParams() {
  return CATEGORIES.flatMap((c) => c.subs.map((s) => ({category: c.slug, sub: s.slug})));
}

export async function generateMetadata({params}: Params): Promise<Metadata> {
  const {locale, category, sub} = await params;
  const cat = categoryBySlug(category);
  if (!cat || !cat.subs.some((s) => s.slug === sub)) return {};
  const copy = CATEGORY_COPY[cat.slug];
  return {
    title: `${SUB_NAMES[sub]} ${copy.short} Supplier in Ahmedabad`,
    description: `${SUB_NAMES[sub]} ${copy.short.toLowerCase()} at Ananta Corporation, Ahmedabad. ${copy.what}`,
    alternates: buildAlternates({pathname: '/products/[category]/[sub]', params: {category, sub}}, locale)
  };
}

export default async function SubcategoryPage({params}: Params) {
  const {locale, category, sub} = await params;
  const cat = categoryBySlug(category);
  if (!cat || !cat.subs.some((s) => s.slug === sub)) notFound();
  setRequestLocale(locale);
  const copy = CATEGORY_COPY[cat.slug];
  return (
    <CategoryView
      cat={cat}
      sub={sub}
      products={productsBySubcategory(category, sub)}
      crumbs={[
        {label: 'Home', href: '/'},
        {label: 'Products', href: '/products'},
        {label: copy.name, href: categoryHref(cat.slug)},
        {label: SUB_NAMES[sub]}
      ]}
    />
  );
}
