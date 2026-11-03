import Image from 'next/image';
import {ArrowRight, BookOpen} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {CATEGORIES, PRODUCTS, categoryHref, productHref} from '@/data/products';
import {CATEGORY_COPY} from '@/content/categories';
import {AUDIENCES} from '@/content/site';
import {TOOLS} from '@/content/tools';
import {POSTS} from '@/content/blog';
import {countByCategory} from '@/data/stats';
import {WhatsAppIcon} from '@/components/ui/Button';
import {quoteContactHref, quoteWhatsappUrl} from '@/lib/quote';
import {ToolIcon} from './ToolIcon';
import {Tabs} from './Tabs';
import {SECTION, SectionHead, cta} from './ui';

function Panel({a}: {a: (typeof AUDIENCES)[number]}) {
  const tools = a.tools.map((s) => TOOLS.find((t) => t.slug === s)).filter((t) => !!t);
  const posts = POSTS.filter((p) => p.audiences.includes(a.key)).slice(0, 3);
  const examples = PRODUCTS.filter((p) => p.applications.some((x) => a.applications.includes(x)) && !p.specsOnRequest).slice(0, 4);
  return (
    <div className="grid grid-cols-1 gap-6 rounded-[12px] border border-line bg-white p-5 sm:p-7 lg:grid-cols-12 lg:gap-8">
      <div className="lg:col-span-7">
        <p className="text-[clamp(1.1rem,1rem+0.5vw,1.4rem)] font-semibold leading-snug text-ink">{a.line}</p>
        {a.extra && <p className="mt-2 text-[14px] leading-relaxed text-muted">{a.extra}</p>}
        <h3 className="t-label mt-6 text-steel">Recommended categories</h3>
        <ul className="mt-3 grid grid-cols-1 gap-2.5 min-[420px]:grid-cols-2 xl:grid-cols-3">
          {a.categories.map((slug) => {
            const c = CATEGORIES.find((x) => x.slug === slug)!;
            return (
              <li key={slug}>
                <Link href={categoryHref(slug)} className="tile-lift group flex min-h-16 items-center gap-3 rounded-[8px] border border-line bg-white p-2.5">
                  <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-[5px] bg-bg-soft">
                    <Image src={c.image} alt="" fill sizes="48px" className="object-cover" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[14px] font-semibold leading-tight text-ink group-hover:text-indigo">{CATEGORY_COPY[slug].short}</span>
                    <span className="t-label text-steel">{countByCategory(slug)} listed</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        {examples.length > 0 && (
          <>
            <h3 className="t-label mt-6 text-steel">Example products for this work</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {examples.map((p) => (
                <li key={p.slug}>
                  <Link href={productHref(p)} className="inline-flex min-h-10 items-center rounded-[5px] bg-surface-blue px-3 py-1.5 text-[13px] font-medium text-indigo hover:bg-indigo hover:text-white">
                    {p.short}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <div className="flex flex-col gap-6 lg:col-span-5 lg:border-l lg:border-line lg:pl-8">
        <div>
          <h3 className="t-label text-steel">Useful tools</h3>
          <ul className="mt-3 flex flex-col gap-2">
            {tools.map((t) => (
              <li key={t.slug}>
                <Link href={t.href} className="group flex min-h-12 items-start gap-3 rounded-[6px] border border-line px-3.5 py-2.5 hover:border-indigo/40">
                  <ToolIcon icon={t.icon} className="mt-0.5 h-5 w-5 shrink-0 text-indigo" />
                  <span>
                    <span className="block text-[14px] font-semibold text-ink group-hover:text-indigo">{t.name}</span>
                    <span className="block text-[12.5px] leading-snug text-muted">{t.short}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {posts.length > 0 && (
          <div>
            <h3 className="t-label text-steel">Guides</h3>
            <ul className="mt-3 flex flex-col gap-2">
              {posts.map((p) => (
                <li key={p.slug}>
                  <Link href={{pathname: '/blog/[slug]', params: {slug: p.slug}}} className="group flex items-start gap-2.5 py-1 text-[14px] font-medium leading-snug text-ink hover:text-indigo">
                    <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-steel" aria-hidden /> {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="mt-auto flex flex-col gap-2.5">
          <a href={quoteWhatsappUrl({source: `Home — ${a.label}`})} target="_blank" rel="noopener noreferrer" className={cta('orange')}>
            <WhatsAppIcon className="h-4 w-4 shrink-0" /> Get a quote on WhatsApp
          </a>
          <Link href={quoteContactHref({source: `Home — ${a.label}`})} className={cta('outline', 'arrow-nudge')}>
            Send a written requirement <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * 04 AUDIENCE / APPLICATION SELECTOR — "I'm a…". Each role maps to catalogue
 * categories, example products (from their own application tags), TOOLS
 * registry entries and POSTS tagged for that audience (hidden when none).
 */
export function AudienceSelector() {
  return (
    <section id="audiences" aria-labelledby="aud-title" className={`${SECTION} bg-surface-blue`}>
      <div className="shell">
        <SectionHead id="aud-title" eyebrow="Who sources here" title="I’m a…" lead="Pick your role to see the categories, tools and guides that fit how you buy material." />
        <div data-reveal="up" className="mt-8">
          <Tabs label="Choose your role" tabs={AUDIENCES.map((a) => ({key: a.key, label: a.label, panel: <Panel a={a} />}))} />
        </div>
      </div>
    </section>
  );
}
