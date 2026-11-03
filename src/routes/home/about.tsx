import type {Metadata} from 'next';
import Image from 'next/image';
import {setRequestLocale} from 'next-intl/server';
import {ArrowRight} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {CATEGORIES, categoryHref} from '@/data/products';
import {CATEGORY_COPY} from '@/content/categories';
import {COMPANY, WA} from '@/content/site';
import {STATS, countByCategory} from '@/data/stats';
import {PageIntro} from '@/components/catalog2/PageIntro';
import {Operations, CustomFurniture} from '@/components/home2/Operations';
import {Voices} from '@/components/home2/Voices';
import {BrandLogo} from '@/components/site/BrandLogo';
import {CountUp} from '@/components/motion/CountUp';
import {WhatsAppIcon} from '@/components/ui/Button';
import {whatsappUrl} from '@/lib/whatsapp';
import {buildAlternates} from '@/lib/metadata';

type Params = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: Params): Promise<Metadata> {
  const {locale} = await params;
  return {
    title: 'About — Plywood & Interior Material Supplier in Ahmedabad',
    description: `Ananta Corporation supplies plywood, MDF, boards, flush doors and smart locks from ${COMPANY.facility} of warehouse and workshop space in Ahmedabad — material supply, custom furniture and project support since ${COMPANY.since}.`,
    alternates: buildAlternates('/about', locale)
  };
}

/**
 * About — a story in sections: company → supply philosophy (A1 mission /
 * vision) → materials → ready stock (#operations) → custom furniture
 * (#custom) → project support (#support) → brands → customers.
 * Deliberately NOT used: "decades of experience" / "15+ years" (conflicts
 * with 2020, see research/ANANTA_CONTENT_TRUTH.md).
 */
export default async function AboutPage({params}: Params) {
  const {locale} = await params;
  setRequestLocale(locale);
  return (
    <>
      <PageIntro
        crumbs={[{label: 'Home', href: '/'}, {label: 'About'}]}
        eyebrow={`Ananta Corporation · Ahmedabad · since ${COMPANY.since}`}
        title="A material supply desk for interiors, furniture and projects."
        lead="A plywood and wood-based material supplier in Ahmedabad, combining ready stock, technical guidance and logistics for residential and industrial projects."
        aside={
          <div className="relative aspect-[16/11] overflow-hidden rounded-[10px] bg-bg-warm" data-reveal="mask">
            <Image src="/images/scenes/kitchen.webp" alt="Modular kitchen interior with wood-grain and white panels" fill priority sizes="(max-width:1024px) 100vw, 40vw" className="object-cover" />
          </div>
        }
      />

      <section aria-label="Key facts" className="border-b border-line bg-white">
        <dl className="shell grid grid-cols-2 gap-px bg-line lg:grid-cols-4">
          {[
            {v: COMPANY.since, l: 'Supplying since'},
            {v: COMPANY.facility.replace(' sq. ft.', ''), l: 'Sq. ft. warehouse & workshop'},
            {v: String(STATS.products), l: 'Products listed'},
            {v: String(STATS.decors), l: 'Prelam décors'}
          ].map((f) => (
            <div key={f.l} className="flex flex-col gap-1 bg-white px-4 py-6" data-reveal="up">
              <dd className="text-[clamp(1.8rem,1.4rem+1.4vw,2.5rem)] font-semibold leading-none tracking-tight text-indigo">
                <CountUp value={f.v} />
              </dd>
              <dt className="text-[13px] text-ink">{f.l}</dt>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="philosophy" className="bg-white py-14 sm:py-20">
        <div className="shell grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5" data-reveal="up">
            <p className="t-label text-orange-ink">Supply philosophy</p>
            <h2 id="philosophy" className="t-h2 mt-3 text-ink">
              The right material, the right guidance, ready for execution.
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-muted">
              The team brings experience across electronics, mechanical engineering and construction — a practical,
              engineering-first approach to detailing and material selection for architects and interior designers.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:col-span-7">
            <figure className="border-t-2 border-indigo pt-5" data-reveal="up">
              <figcaption className="t-label text-steel">Mission</figcaption>
              <blockquote className="mt-3 text-[15px] leading-relaxed text-ink">
                To deliver reliable wood and interior solutions through engineering-driven design, premium material sourcing and
                disciplined execution — helping homeowners, industries, architects and interior designers build with confidence.
              </blockquote>
            </figure>
            <figure className="border-t-2 border-orange pt-5" data-reveal="up" style={{['--d' as string]: '100ms'}}>
              <figcaption className="t-label text-steel">Vision</figcaption>
              <blockquote className="mt-3 text-[15px] leading-relaxed text-ink">
                To be a long-term partner for wood and wood-related products — recognised for technical excellence, dependable
                logistics and consistent quality, supported by a strong supply chain and ready stock.
              </blockquote>
            </figure>
          </div>
        </div>
      </section>

      <section aria-labelledby="materials" className="bg-bg-soft py-12 sm:py-16">
        <div className="shell">
          <h2 id="materials" className="t-h3 text-ink" data-reveal="up">
            What we supply
          </h2>
          <ul className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {CATEGORIES.map((c, i) => (
              <li key={c.slug} data-reveal="up" style={{['--d' as string]: `${i * 50}ms`}}>
                <Link href={categoryHref(c.slug)} className="tile-lift tile-zoom group block overflow-hidden rounded-[8px] border border-line bg-white">
                  <span className="relative block aspect-square overflow-hidden bg-bg-soft">
                    <Image src={c.image} alt="" fill sizes="(max-width:768px) 45vw, 16vw" className="object-cover" />
                  </span>
                  <span className="block p-3">
                    <span className="block text-[14px] font-semibold text-ink group-hover:text-indigo">{CATEGORY_COPY[c.slug].short}</span>
                    <span className="t-label text-steel">{countByCategory(c.slug)} products</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Operations />
      <CustomFurniture />

      <section id="support" aria-labelledby="support-title" className="bg-white py-14 sm:py-20">
        <div className="shell grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5" data-reveal="up">
            <p className="t-label text-orange-ink">Project support</p>
            <h2 id="support-title" className="t-h2 mt-3 text-ink">
              For contractors, builders and project teams.
            </h2>
            <a
              href={whatsappUrl(WA.project)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-[6px] bg-orange px-5 text-[14.5px] font-semibold text-white hover:bg-orange-deep"
            >
              <WhatsAppIcon className="h-4 w-4" /> Share a requirement list
            </a>
          </div>
          <dl className="divide-y divide-line border-y border-line lg:col-span-7">
            {[
              ['Bulk orders', 'Bulk orders and contractor partnerships available.'],
              ['Design + execution support', 'Close collaboration with interior designers and architects to align design intent with practical execution.'],
              ['Multi-category supply', 'Plywood, MDF, boards, flush doors and smart locks from one supplier.'],
              ['Delivery', 'Arranged as per location and availability.']
            ].map(([t, b]) => (
              <div key={t} className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-[220px_1fr] sm:gap-6" data-reveal="up">
                <dt className="text-[15px] font-semibold text-ink">{t}</dt>
                <dd className="text-[14px] leading-relaxed text-muted">{b}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section aria-label="Brands" className="border-y border-line bg-bg-soft">
        <div className="shell flex flex-col items-start gap-5 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            <span className="t-label text-steel">Authorized distributor</span>
            <BrandLogo brand="Duroply" height={24} />
            <BrandLogo brand="Action TESA" height={34} />
            <span className="t-label text-steel">Also supplying</span>
            <BrandLogo brand="Tenon Smart Lock" height={18} />
          </div>
          <Link href="/partners" className="arrow-nudge inline-flex items-center gap-1.5 text-[14px] font-semibold text-indigo">
            Brands <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </section>

      <Voices exclude="Ketanbhai Shah" />
    </>
  );
}
