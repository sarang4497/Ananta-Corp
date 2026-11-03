import type {Metadata} from 'next';
import {setRequestLocale} from 'next-intl/server';
import {ArrowRight} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {PRODUCTS, categoryHref} from '@/data/products';
import {CATEGORY_COPY} from '@/content/categories';
import {BRAND_ASSETS, WA} from '@/content/site';
import {BRANDS, countByBrand} from '@/data/stats';
import {PageIntro} from '@/components/catalog2/PageIntro';
import {ProductTile} from '@/components/catalog2/ProductTile';
import {BrandLogo} from '@/components/site/BrandLogo';
import {WhatsAppIcon} from '@/components/ui/Button';
import {whatsappUrl} from '@/lib/whatsapp';
import {buildAlternates} from '@/lib/metadata';

type Params = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: Params): Promise<Metadata> {
  const {locale} = await params;
  return {
    title: 'Brands — Duroply, Action TESA & Tenon Smart Lock in Ahmedabad',
    description:
      'Ananta Corporation, Ahmedabad: authorized distributor of Duroply and Action TESA, and supplier of Tenon smart locks. See what we supply from each brand.',
    alternates: buildAlternates('/partners', locale)
  };
}

/** Neutral, factual brand descriptors (no manufacturer marketing copy). */
const INTRO: Record<string, string> = {
  Duroply: 'Plywood and flush doors. Ananta supplies Duroply MR and BWP plywood and Duro Door flush doors.',
  'Action TESA': 'Engineered panel boards. Ananta supplies Action TESA MDF (interior, exterior, HDHMR), Moist Master HMR and pre-laminated particle board with its décor range.',
  'Tenon Smart Lock': 'Smart door locks. Ananta supplies Tenon models for main doors, interior doors and sliding doors.'
};

export default async function PartnersPage({params}: Params) {
  const {locale} = await params;
  setRequestLocale(locale);
  return (
    <>
      <PageIntro
        crumbs={[{label: 'Home', href: '/'}, {label: 'Brands'}]}
        eyebrow="Brands & partners"
        title="The manufacturers behind the range."
        lead="Authorized distributor of Duroply and Action TESA, and supplier of Tenon smart locks — what we supply from each, and where to find it."
      />
      {BRANDS.map((b, i) => {
        const a = BRAND_ASSETS[b];
        const items = PRODUCTS.filter((p) => p.brand === b);
        const cats = [...new Set(items.map((p) => p.category))];
        return (
          <section key={b} id={a.slug} aria-labelledby={`${a.slug}-title`} className={i % 2 ? 'bg-bg-soft py-12 sm:py-16' : 'bg-white py-12 sm:py-16'}>
            <div className="shell grid grid-cols-1 gap-8 lg:grid-cols-12">
              <div className="lg:col-span-4" data-reveal="up">
                <div className="flex h-24 items-center justify-center rounded-[10px] border border-line bg-white px-6">
                  <BrandLogo brand={b} height={b === 'Action TESA' ? 52 : b === 'Duroply' ? 25 : 24} />
                </div>
                <p className="t-label mt-5 text-orange-ink">
                  {a.relation} · {countByBrand(b)} products
                </p>
                <h2 id={`${a.slug}-title`} className="t-h3 mt-2 text-ink">
                  {b}
                </h2>
                <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{INTRO[b]}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {cats.map((c) => (
                    <li key={c}>
                      <Link href={categoryHref(c)} className="arrow-nudge inline-flex min-h-10 items-center gap-1.5 rounded-[5px] border border-line bg-white px-3 text-[13px] font-medium text-ink hover:border-indigo/40">
                        {CATEGORY_COPY[c].short} <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                      </Link>
                    </li>
                  ))}
                </ul>
                <a
                  href={whatsappUrl(WA.category(`${b} products`))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex min-h-11 items-center gap-2 text-[14px] font-semibold text-indigo hover:underline"
                >
                  <WhatsAppIcon className="h-4 w-4 text-wa" /> Ask for {b} pricing
                </a>
              </div>
              <ul className="rail -mx-[var(--side)] gap-3 px-[var(--side)] pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 md:grid-cols-3 lg:col-span-8 lg:grid-cols-3 xl:grid-cols-4">
                {items.map((p) => (
                  <li key={p.slug} className="w-[60vw] max-w-[240px] sm:w-auto sm:max-w-none" data-reveal="up">
                    <ProductTile product={p} size="sm" />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        );
      })}
    </>
  );
}
