import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {setRequestLocale} from 'next-intl/server';
import {CATEGORIES, categoryBySlug, productsByCategory, type CategorySlug} from '@/data/products';
import {CATEGORY_COPY} from '@/content/categories';
import {CategoryView} from '@/components/catalog2/CategoryView';
import {buildAlternates} from '@/lib/metadata';

type Params = {params: Promise<{locale: string; category: string}>};

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({category: c.slug}));
}

export async function generateMetadata({params}: Params): Promise<Metadata> {
  const {locale, category} = await params;
  const cat = categoryBySlug(category);
  if (!cat) return {};
  const copy = CATEGORY_COPY[cat.slug];
  return {
    title: copy.seoTitle,
    description: copy.seoDescription,
    alternates: buildAlternates({pathname: '/products/[category]', params: {category}}, locale)
  };
}

export default async function CategoryPage({params}: Params) {
  const {locale, category} = await params;
  const cat = categoryBySlug(category);
  if (!cat) notFound();
  setRequestLocale(locale);
  return (
    <CategoryView
      cat={cat}
      products={productsByCategory(category)}
      crumbs={[{label: 'Home', href: '/'}, {label: 'Products', href: '/products'}, {label: CATEGORY_COPY[cat.slug as CategorySlug].name}]}
    />
  );
}
