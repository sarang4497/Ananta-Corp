import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {Reveal} from '@/components/ui/Reveal';
import {Button} from '@/components/ui/Button';
import {Playground} from '@/components/ui/Playground';
import {ProductDemoLazy} from '@/components/demos/ProductDemoLazy';
import {buildAlternates} from '@/lib/metadata';

type Params = {params: Promise<{locale: string; slug: string}>};

const SLUGS = [
  'product-one',
  'product-two',
  'product-three',
  'product-four',
  'product-five',
  'product-six'
] as const;

export function generateStaticParams() {
  return SLUGS.map((slug) => ({slug}));
}

async function getProduct(locale: string, slug: string) {
  const t = await getTranslations({locale, namespace: 'products'});
  const items = t.raw('items') as {slug: string; name: string; tag: string}[];
  return items.find((p) => p.slug === slug) ?? null;
}

export async function generateMetadata({params}: Params): Promise<Metadata> {
  const {locale, slug} = await params;
  setRequestLocale(locale);
  const product = await getProduct(locale, slug);
  const t = await getTranslations('products.detail');
  if (!product) return {};
  return {
    title: `${product.name} — Studio Marketing Italia`,
    description: t('description'),
    alternates: buildAlternates(
      {pathname: '/products/[slug]', params: {slug}},
      locale
    )
  };
}

export default async function ProductDetailPage({params}: Params) {
  const {locale, slug} = await params;
  setRequestLocale(locale);

  const product = await getProduct(locale, slug);
  if (!product) notFound();

  const t = await getTranslations('products.detail');

  return (
    <section className="shell py-20">
      <Reveal trigger="load" className="flex flex-col gap-6">
        <Link
          href="/products"
          className="w-fit text-sm font-medium text-muted no-underline transition-colors hover:text-ink"
        >
          ← {t('back')}
        </Link>

        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-border bg-bg-soft/70 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-indigo">
          {t('badge')}
        </span>

        <h1 className="text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          {product.name}
        </h1>
        <p className="font-mono text-sm text-muted">{product.tag}</p>
        <p className="max-w-2xl text-lg leading-relaxed text-muted">
          {t('description')}
        </p>
      </Reveal>

      <Reveal className="mt-10">
        <Playground title={t('demoTitle')}>
          <ProductDemoLazy productName={product.name} launchLabel={t('launch')} />
        </Playground>
      </Reveal>

      <Reveal className="mt-10 flex justify-center">
        <Button href="/contact" size="lg">
          {t('cta')}
        </Button>
      </Reveal>
    </section>
  );
}
