import type {Metadata} from 'next';
import {setRequestLocale} from 'next-intl/server';
import {TOOLS} from '@/content/tools';
import {STATS} from '@/data/stats';
import {PageIntro} from '@/components/catalog2/PageIntro';
import {ToolCard} from '@/components/tools/ToolCard';
import {buildAlternates} from '@/lib/metadata';
import {breadcrumbJsonLd} from '@/lib/jsonld';
import {siteUrl} from '@/config';

type Params = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: Params): Promise<Metadata> {
  const {locale} = await params;
  return {
    title: 'Material Tools — Selector, Comparison, Sheet Helper & Décor Explorer',
    description:
      'Interactive tools from Ananta Corporation, Ahmedabad: choose a board by application, compare two boards on published specs, estimate 8 × 4 ft sheets, build a requirement and shortlist prelam décors.',
    alternates: buildAlternates('/tools', locale)
  };
}

const PRINCIPLES = [
  {t: 'Catalogue data only', d: `Every answer comes from the ${STATS.products} products and ${STATS.decors} décors in the Ananta catalogue — nothing estimated or invented.`},
  {t: 'No sign-up', d: 'Nothing to register. Your choices stay in your browser until you send them.'},
  {t: 'Ends in a real request', d: 'Each tool carries your selection into WhatsApp or a written enquiry, so the team starts with the details.'}
];

export default async function ToolsHub({params}: Params) {
  const {locale} = await params;
  setRequestLocale(locale);
  return (
    <>
      <span hidden data-wa-context="Hello! I'm planning a project and would like help choosing materials. Please share price and availability details." />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              {name: 'Home', url: siteUrl},
              {name: 'Tools', url: `${siteUrl}/tools`}
            ])
          )
        }}
      />
      <PageIntro
        crumbs={[{label: 'Home', href: '/'}, {label: 'Tools'}]}
        eyebrow="Tools · plan, compare, estimate"
        title="Tools for choosing and ordering boards."
        lead="Pick the right board for the job, compare two products on published specs, estimate sheets, and send a complete requirement — in a few taps."
      />
      <section className="bg-bg-soft py-10 sm:py-14">
        <div className="shell">
          <h2 className="sr-only">All tools</h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {TOOLS.map((t, i) => (
              <li key={t.slug} data-reveal="up" style={{['--d' as string]: `${i * 70}ms`}}>
                <ToolCard tool={t} index={i} />
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="bg-navy py-12 text-white sm:py-16">
        <div className="shell grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <p className="t-label text-orange-light">How the tools work</p>
            <h2 className="t-h2 mt-3 text-balance" data-reveal="mask">
              Built on the catalogue, not on guesses.
            </h2>
          </div>
          <ol className="grid gap-6 sm:grid-cols-3 lg:col-span-8">
            {PRINCIPLES.map((p, i) => (
              <li key={p.t} className="border-t border-white/15 pt-4" data-reveal="up" style={{['--d' as string]: `${i * 90}ms`}}>
                <p className="t-label text-white/55">0{i + 1}</p>
                <h3 className="mt-2 text-[17px] font-semibold">{p.t}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-white/75">{p.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
