import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {setRequestLocale} from 'next-intl/server';
import {TOOLS, toolBySlug} from '@/content/tools';
import {TOOL_PAGES} from '@/content/tools-data';
import {PageIntro} from '@/components/catalog2/PageIntro';
import {FaqList} from '@/components/catalog2/FaqList';
import {RelatedTools} from '@/components/tools/RelatedTools';
import {ToolBody} from '@/components/tools/ToolBody';
import {buildAlternates} from '@/lib/metadata';
import {breadcrumbJsonLd} from '@/lib/jsonld';
import {siteUrl} from '@/config';

type Params = {params: Promise<{locale: string; tool: string}>};

export function generateStaticParams() {
  return TOOLS.filter((t) => t.route).map((t) => ({tool: t.slug}));
}

export async function generateMetadata({params}: Params): Promise<Metadata> {
  const {locale, tool} = await params;
  const t = toolBySlug(tool);
  if (!t || !t.route) return {};
  return {
    title: `${t.name} — Ananta Corporation Tools`,
    description: t.description,
    alternates: buildAlternates({pathname: '/tools/[tool]', params: {tool}}, locale)
  };
}

export default async function ToolPage({params}: Params) {
  const {locale, tool} = await params;
  setRequestLocale(locale);
  const t = toolBySlug(tool);
  if (!t || !t.route) notFound();
  const c = TOOL_PAGES[t.slug];
  return (
    <>
      <span hidden data-wa-context={c.wa} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              {name: 'Home', url: siteUrl},
              {name: 'Tools', url: `${siteUrl}/tools`},
              {name: t.name, url: `${siteUrl}/tools/${t.slug}`}
            ])
          )
        }}
      />
      <PageIntro
        crumbs={[{label: 'Home', href: '/'}, {label: 'Tools', href: '/tools'}, {label: t.name}]}
        eyebrow={c.eyebrow}
        title={c.title}
        lead={c.lead}
      >
        <ol className="mt-6 flex flex-wrap gap-x-6 gap-y-2" aria-label="How it works">
          {c.steps.map((s, i) => (
            <li key={s.title} className="hero-in flex items-center gap-2 text-[13.5px] text-muted" style={{['--d' as string]: `${180 + i * 60}ms`}}>
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-surface-blue text-[12px] font-semibold text-indigo">{i + 1}</span>
              <span className="font-semibold text-ink">{s.title}</span>
            </li>
          ))}
        </ol>
      </PageIntro>

      <section className="bg-bg-soft py-8 sm:py-12">
        <div className="shell">
          <ToolBody slug={t.slug} />
        </div>
      </section>

      <section className="bg-white py-12 sm:py-16">
        <div className="shell grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="t-h3 text-ink" data-reveal="up">
              How it works
            </h2>
            <ol className="mt-5 grid gap-4">
              {c.steps.map((s, i) => (
                <li key={s.title} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-3" data-reveal="up" style={{['--d' as string]: `${i * 80}ms`}}>
                  <span className="t-label pt-0.5 text-orange-ink">0{i + 1}</span>
                  <div>
                    <h3 className="text-[15px] font-semibold text-ink">{s.title}</h3>
                    <p className="mt-1 text-[14px] leading-relaxed text-muted">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="lg:col-span-7">
            <h2 className="t-h3 text-ink" data-reveal="up">
              Questions
            </h2>
            <div className="mt-5">
              <FaqList items={c.faqs} />
            </div>
          </div>
        </div>
      </section>

      <RelatedTools slugs={c.related} />
    </>
  );
}
