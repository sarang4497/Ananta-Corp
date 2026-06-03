import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {PageHero} from '@/components/PageHero';
import {Reveal} from '@/components/ui/Reveal';
import {CatalogCard} from '@/components/catalog/CatalogCard';
import {ProductFilter} from '@/components/catalog/ProductFilter';
import {CtaBand} from '@/components/home/CtaBand';
import {CATEGORIES, PRODUCTS} from '@/data/products';
import {buildAlternates} from '@/lib/metadata';

type Params = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: Params): Promise<Metadata> {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('catalog.listing.meta');
  return {
    title: t('title'),
    description: t('description'),
    alternates: buildAlternates('/products', locale)
  };
}

export default async function ProductsPage({params}: Params) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('catalog');
  const tn = await getTranslations('nav');

  const chips = CATEGORIES.map((c) => ({key: c.slug, label: tn(c.key)}));

  // Server-render every card once; the client filter only toggles visibility.
  const cards = PRODUCTS.map((p) => {
    const cat = CATEGORIES.find((c) => c.slug === p.category)!;
    return {
      category: p.category,
      node: (
        <CatalogCard
          product={p}
          categoryLabel={tn(cat.key)}
          viewLabel={t('card.view')}
          priceLabel={t('card.price')}
        />
      )
    };
  });

  return (
    <>
      <PageHero
        eyebrow={t('listing.eyebrow')}
        title={t('listing.heading')}
        sub={t('listing.intro')}
      />

      <section className="shell pb-16 sm:pb-20">
        <Reveal>
          <ProductFilter
            chips={chips}
            allLabel={t('listing.all')}
            countTemplate={t.raw('listing.count') as string}
            cards={cards}
          />
        </Reveal>
      </section>

      <CtaBand
        heading={t('cta.heading')}
        sub={t('cta.sub')}
        note={t('cta.note')}
        ctaWhatsapp={t('card.price')}
        ctaContact={t('cta.contact')}
      />
    </>
  );
}
