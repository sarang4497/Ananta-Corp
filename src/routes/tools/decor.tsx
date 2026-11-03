import type {Metadata} from 'next';
import {setRequestLocale} from 'next-intl/server';
import {categoryHref} from '@/data/products';
import {STATS} from '@/data/stats';
import {PageIntro} from '@/components/catalog2/PageIntro';
import {DecorLibrary} from '@/components/catalog2/DecorLibrary';
import {RelatedTools} from '@/components/tools/RelatedTools';
import {TOOL_PAGES} from '@/content/tools-data';
import {buildAlternates} from '@/lib/metadata';

type Params = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: Params): Promise<Metadata> {
  const {locale} = await params;
  return {
    title: `Décor Library — ${STATS.decors} Action TESA Pre-Laminated Finishes`,
    description: `Browse ${STATS.decors} Action TESA pre-laminated board décors at Ananta Corporation, Ahmedabad — woodgrains, solids, stone, fabric and texture finishes, searchable by code.`,
    alternates: buildAlternates('/decor', locale)
  };
}

export default async function DecorPage({params}: Params) {
  const {locale} = await params;
  setRequestLocale(locale);
  return (
    <>
      <span hidden data-wa-context={TOOL_PAGES['finish-explorer'].wa} />
      <PageIntro
        crumbs={[
          {label: 'Home', href: '/'},
          {label: 'Products', href: '/products'},
          {label: 'Pre-Laminated Particle Board', href: categoryHref('pre-laminated-particle-board')},
          {label: 'Décor library'}
        ]}
        eyebrow="Action TESA · pre-laminated particle board"
        title={`${STATS.decors} décors, by code.`}
        lead="Woodgrains, solids, stone and marble looks, fabric weaves and textures. Search by name or design code, enlarge any swatch, and shortlist finishes to send on WhatsApp in one message."
      />
      <section className="bg-bg-soft py-8 sm:py-12">
        <div className="shell">
          <DecorLibrary />
        </div>
      </section>
      <RelatedTools slugs={TOOL_PAGES['finish-explorer'].related} />
    </>
  );
}
