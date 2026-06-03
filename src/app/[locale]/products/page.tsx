import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {PageHero} from '@/components/PageHero';
import {Reveal, RevealItem} from '@/components/ui/Reveal';
import {Card} from '@/components/ui/Card';
import {buildAlternates} from '@/lib/metadata';

type Params = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: Params): Promise<Metadata> {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('products.meta');
  return {
    title: t('title'),
    description: t('description'),
    alternates: buildAlternates('/products', locale)
  };
}

export default async function ProductsPage({params}: Params) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('products');

  const items = t.raw('items') as {slug: string; name: string; tag: string}[];

  return (
    <>
      <PageHero
        eyebrow={t('hero.eyebrow')}
        title={t('hero.title')}
        sub={t('hero.sub')}
      />

      <section className="shell py-16">
        <Reveal stagger={0.06} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <RevealItem key={item.slug}>
              <Card
                href={{pathname: '/products/[slug]', params: {slug: item.slug}}}
                accent="indigo"
                className="h-full gap-3"
              >
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-border bg-bg-soft/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-indigo">
                  {t('placeholderBadge')}
                </span>
                <h2 className="text-lg font-semibold text-ink">{item.name}</h2>
                <p className="font-mono text-sm text-muted">{item.tag}</p>
                <span className="mt-auto pt-3 text-sm font-medium text-blue">
                  {t('viewDemo')} →
                </span>
              </Card>
            </RevealItem>
          ))}
        </Reveal>
      </section>
    </>
  );
}
