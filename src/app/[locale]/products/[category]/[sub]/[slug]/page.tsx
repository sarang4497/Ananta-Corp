import type {Metadata} from 'next';
import Image from 'next/image';
import {notFound} from 'next/navigation';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {BadgeCheck, CheckCircle2, MessageCircle, ShieldCheck} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {Reveal, RevealItem} from '@/components/ui/Reveal';
import {SectionHeading} from '@/components/ui/SectionHeading';
import {Breadcrumbs} from '@/components/catalog/Breadcrumbs';
import {CatalogCard} from '@/components/catalog/CatalogCard';
import {SizeChips} from '@/components/catalog/SizeChips';
import {ImagePlaceholder} from '@/components/home/ImagePlaceholder';
import {buttonClassName} from '@/components/ui/Button';
import {
  CATEGORIES,
  PRODUCTS,
  categoryBySlug,
  categoryHref,
  productByPath,
  relatedProducts,
  subcategoryHref,
  type CategorySlug
} from '@/data/products';
import {buildAlternates} from '@/lib/metadata';
import {whatsappUrl} from '@/lib/whatsapp';

type Params = {
  params: Promise<{locale: string; category: string; sub: string; slug: string}>;
};

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({category: p.category, sub: p.subcategory, slug: p.slug}));
}

export async function generateMetadata({params}: Params): Promise<Metadata> {
  const {locale, category, sub, slug} = await params;
  const product = productByPath(category, sub, slug);
  if (!product) return {};
  setRequestLocale(locale);
  return {
    title: `${product.name} | Ananta Corporation`,
    description: product.tagline,
    alternates: buildAlternates(
      {
        pathname: '/products/[category]/[sub]/[slug]',
        params: {category, sub, slug}
      },
      locale
    )
  };
}

export default async function ProductDetailPage({params}: Params) {
  const {locale, category, sub, slug} = await params;
  const product = productByPath(category, sub, slug);
  const cat = categoryBySlug(category);
  const subDef = cat?.subs.find((s) => s.slug === sub);
  if (!product || !cat || !subDef) notFound();
  setRequestLocale(locale);

  const tn = await getTranslations('nav');
  const tc = await getTranslations('catalog');
  const t = await getTranslations('catalog.detail');
  const related = relatedProducts(product);
  const isPrelam = product.category === 'pre-laminated-particle-board';

  const enquiry = whatsappUrl(
    `Hello! I'm interested in ${product.name}. Please share price and availability details.`
  );

  return (
    <>
      <section className="shell pt-8 sm:pt-10">
        <Breadcrumbs
          items={[
            {label: tc('breadcrumb.home'), href: '/'},
            {label: tc('breadcrumb.products'), href: '/products'},
            {label: tn(cat.key), href: categoryHref(cat.slug as CategorySlug)},
            {label: tn(subDef.key), href: subcategoryHref(cat.slug as CategorySlug, sub)},
            {label: product.name}
          ]}
        />
      </section>

      {/* Top: gallery + buy box */}
      <section className="shell grid gap-10 pb-14 pt-8 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
        {/* Gallery placeholder (real swatch for prelam SKUs). */}
        <Reveal trigger="load" className="flex flex-col gap-3">
          {product.decorImage ? (
            <div className="relative h-80 w-full overflow-hidden rounded-2xl border border-border sm:h-[26rem]">
              <Image
                src={product.decorImage}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          ) : (
            <ImagePlaceholder
              label={t('galleryLabel')}
              className="h-80 w-full sm:h-[26rem]"
              iconSize={40}
            />
          )}
          <div className="grid grid-cols-4 gap-3">
            {[0, 1, 2, 3].map((i) =>
              product.decorImage && i === 0 ? (
                <div key={i} className="relative h-20 overflow-hidden rounded-xl border-2 border-orange">
                  <Image
                    src={product.decorImage}
                    alt=""
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <ImagePlaceholder key={i} label="" className="h-20 rounded-xl" iconSize={18} />
              )
            )}
          </div>
        </Reveal>

        {/* Buy box */}
        <Reveal trigger="load" delay={0.1} className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-indigo/8 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-indigo">
              {product.brand}
            </span>
            <span className="inline-flex items-center rounded-full bg-orange/10 px-3 py-1 text-xs font-semibold text-orange-deep">
              {tn(cat.key)}
            </span>
          </div>
          <h1 className="text-balance text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">
            {product.name}
          </h1>
          <p className="text-pretty text-base leading-relaxed text-muted">{product.tagline}</p>

          {product.standards.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.standards.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1.5 rounded-full border border-green/30 bg-green/5 px-3 py-1 text-xs font-bold text-ink"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-green" aria-hidden />
                  {s}
                </span>
              ))}
            </div>
          )}

          <SizeChips sizes={product.sizes} label={t('sizesLabel')} note={product.sizesNote} />

          <div className="flex flex-col gap-2.5 pt-1 sm:flex-row">
            <a
              href={enquiry}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClassName('orange', 'lg', 'btn-sheen flex-1 font-bold')}
            >
              <MessageCircle className="h-4.5 w-4.5" aria-hidden />
              {tc('card.price')}
            </a>
            <Link href="/contact" className={buttonClassName('secondary', 'lg', 'flex-1')}>
              {t('enquiry')}
            </Link>
          </div>
          <p className="text-xs leading-relaxed text-muted">{t('whatsappNote')}</p>

          {product.specsOnRequest && (
            <p className="rounded-xl border border-border bg-bg-soft px-4 py-3 text-sm leading-relaxed text-muted">
              {t('specsOnRequest')}
            </p>
          )}
        </Reveal>
      </section>

      {/* Description + features + spec table */}
      <section className="border-y border-border bg-bg-soft">
        <div className="shell grid gap-10 py-14 lg:grid-cols-[1.2fr_1fr] lg:gap-14">
          <Reveal className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold tracking-tight text-ink">
              {t('aboutHeading', {name: product.name})}
            </h2>
            <p className="text-pretty text-[15px] leading-relaxed text-muted">
              {product.description}
            </p>
            <div className="flex flex-col gap-3">
              <h3 className="text-base font-bold text-ink">{t('featuresHeading')}</h3>
              <ul className="flex flex-col gap-2.5">
                {product.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink">
                    <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-orange" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            {product.useCases.length > 0 && (
              <div className="flex flex-col gap-3">
                <h3 className="text-base font-bold text-ink">{t('useCasesHeading')}</h3>
                <div className="flex flex-wrap gap-2">
                  {product.useCases.map((u) => (
                    <span
                      key={u}
                      className="rounded-full border border-indigo/20 bg-bg px-3.5 py-1.5 text-[13px] font-semibold text-ink"
                    >
                      {u}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Reveal>

          {/* Spec table */}
          <Reveal delay={0.08}>
            <div className="overflow-hidden rounded-2xl border border-border bg-bg shadow-card">
              <div className="flex items-center gap-2.5 border-b border-border bg-gradient-to-r from-indigo/8 to-orange/5 px-5 py-3.5">
                <BadgeCheck className="h-5 w-5 text-indigo" aria-hidden />
                <h3 className="text-base font-bold text-ink">{t('specsHeading')}</h3>
              </div>
              <table className="w-full text-sm">
                <tbody>
                  {product.specs.map(([label, value], i) => (
                    <tr key={label} className={i % 2 === 1 ? 'bg-bg-soft/60' : undefined}>
                      <th
                        scope="row"
                        className="w-[42%] px-5 py-3 text-left align-top text-[13px] font-bold uppercase tracking-wide text-muted"
                      >
                        {label}
                      </th>
                      <td className="px-5 py-3 align-top font-medium leading-relaxed text-ink">
                        {value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Related products */}
      <section className="shell pb-16 pt-14 sm:pb-20 sm:pt-16">
        <Reveal>
          <SectionHeading title={t('relatedHeading')} />
        </Reveal>
        <Reveal
          stagger={0.07}
          className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {related.map((p) => {
            const rCat = CATEGORIES.find((c) => c.slug === p.category)!;
            return (
              <RevealItem key={p.slug} className="h-full">
                <CatalogCard
                  product={p}
                  categoryLabel={tn(rCat.key)}
                  viewLabel={tc('card.view')}
                  priceLabel={tc('card.price')}
                />
              </RevealItem>
            );
          })}
        </Reveal>
        {isPrelam && (
          <Reveal className="mt-10 text-center">
            <Link
              href="/decor"
              className="inline-flex items-center gap-1.5 text-base font-bold text-indigo no-underline transition-colors hover:text-orange-deep"
            >
              {tc('decorPromo.cta')} →
            </Link>
          </Reveal>
        )}
      </section>
    </>
  );
}
