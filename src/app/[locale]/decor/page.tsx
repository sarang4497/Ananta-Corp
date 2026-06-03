import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {PageHero} from '@/components/PageHero';
import {Reveal} from '@/components/ui/Reveal';
import {Breadcrumbs} from '@/components/catalog/Breadcrumbs';
import {DecorGallery, type TypeChip} from '@/components/catalog/DecorGallery';
import {CtaBand} from '@/components/home/CtaBand';
import {buttonClassName} from '@/components/ui/Button';
import {DECORS} from '@/data/decors';
import {categoryHref} from '@/data/products';
import {buildAlternates} from '@/lib/metadata';

type Params = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: Params): Promise<Metadata> {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('decor.meta');
  return {
    title: t('title'),
    description: t('description'),
    alternates: buildAlternates('/decor', locale)
  };
}

export default async function DecorPage({params}: Params) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('decor');
  const tc = await getTranslations('catalog');

  const chips: TypeChip[] = [
    {key: 'all', label: t('filters.all')},
    {key: 'solid', label: t('filters.solid')},
    {key: 'woodgrain', label: t('filters.woodgrain')},
    {key: 'fabric', label: t('filters.fabric')},
    {key: 'stone', label: t('filters.stone')},
    {key: 'texture', label: t('filters.texture')}
  ];

  return (
    <>
      <div className="shell pt-8 sm:pt-10">
        <Breadcrumbs
          items={[
            {label: tc('breadcrumb.home'), href: '/'},
            {label: tc('breadcrumb.products'), href: '/products'},
            {label: t('breadcrumb')}
          ]}
        />
      </div>
      <PageHero eyebrow={t('eyebrow')} title={t('heading')} sub={t('intro')}>
        <Link
          href={categoryHref('pre-laminated-particle-board')}
          className={buttonClassName('secondary', 'md')}
        >
          {t('backToCategory')}
        </Link>
      </PageHero>

      <section className="shell pb-16 sm:pb-20">
        <Reveal>
          <DecorGallery
            decors={DECORS}
            chips={chips}
            searchPlaceholder={t('searchPlaceholder')}
            countTemplate={t.raw('count') as string}
            priceLabel={t('price')}
            emptyLabel={t('empty')}
          />
        </Reveal>
      </section>

      <CtaBand
        heading={tc('cta.heading')}
        sub={tc('cta.sub')}
        note={tc('cta.note')}
        ctaWhatsapp={tc('card.price')}
        ctaContact={tc('cta.contact')}
      />
    </>
  );
}
