import type {Metadata} from 'next';
import Image from 'next/image';
import {notFound} from 'next/navigation';
import {setRequestLocale} from 'next-intl/server';
import {ArrowRight, ChevronDown, ExternalLink} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {BLOG_AUDIENCE_LABEL, BLOG_CATEGORY_LABEL, POSTS, postBySlug, relatedPostsFor, tocFor} from '@/content/blog';
import {TOOLS} from '@/content/tools';
import {PRODUCTS, type Product} from '@/data/products';
import {Breadcrumbs} from '@/components/catalog2/Breadcrumbs';
import {FaqList} from '@/components/catalog2/FaqList';
import {ProductTile} from '@/components/catalog2/ProductTile';
import {BlockRenderer} from '@/components/blog/BlockRenderer';
import {Toc} from '@/components/blog/Toc';
import {PostCard, formatPostDate} from '@/components/blog/PostCard';
import {ToolLinks} from '@/components/blog/CrossLinks';
import {WhatsAppIcon, buttonClassName} from '@/components/ui/Button';
import {buildAlternates} from '@/lib/metadata';
import {breadcrumbJsonLd} from '@/lib/jsonld';
import {articleJsonLd, faqJsonLd} from '@/lib/jsonld-article';
import {quoteContactHref, quoteWhatsappUrl} from '@/lib/quote';
import {siteUrl} from '@/config';

type Params = {params: Promise<{locale: string; slug: string}>};

const SOURCE_KIND = {ananta: 'Ananta catalogue', manufacturer: 'Manufacturer', general: 'General reference'} as const;

export function generateStaticParams() {
  return POSTS.map((p) => ({slug: p.slug}));
}

export async function generateMetadata({params}: Params): Promise<Metadata> {
  const {locale, slug} = await params;
  const p = postBySlug(slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.description,
    alternates: buildAlternates({pathname: '/blog/[slug]', params: {slug}}, locale),
    openGraph: {
      type: 'article',
      title: p.title,
      description: p.description,
      publishedTime: p.published,
      modifiedTime: p.updated ?? p.published,
      images: [{url: p.image, alt: p.imageAlt}]
    }
  };
}

export default async function PostPage({params}: Params) {
  const {locale, slug} = await params;
  setRequestLocale(locale);
  const p = postBySlug(slug);
  if (!p) notFound();

  const url = `${siteUrl}/blog/${p.slug}`;
  const toc = tocFor(p);
  const products = p.relatedProducts.map((s) => PRODUCTS.find((x) => x.slug === s)).filter((x): x is Product => Boolean(x));
  const tools = (p.relatedTools ?? []).map((s) => TOOLS.find((t) => t.slug === s)).filter((t): t is (typeof TOOLS)[number] => Boolean(t));
  const related = relatedPostsFor(p, 3);
  const quote = {source: `Guide: ${p.title}`};

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            articleJsonLd(p, url),
            faqJsonLd(p.faqs),
            breadcrumbJsonLd([
              {name: 'Home', url: siteUrl},
              {name: 'Resources', url: `${siteUrl}/blog`},
              {name: p.title, url}
            ])
          ])
        }}
      />

      <header className="border-b border-line bg-white">
        <div className="shell pb-8 pt-6 sm:pt-8">
          <Breadcrumbs items={[{label: 'Home', href: '/'}, {label: 'Resources', href: '/blog'}, {label: p.title}]} />
          <div className="mt-6 max-w-[880px]">
            <Link
              href={{pathname: '/blog', query: {category: p.category}}}
              className="hero-in t-label inline-flex min-h-8 items-center text-orange-ink hover:text-orange-deep"
            >
              {BLOG_CATEGORY_LABEL[p.category]}
            </Link>
            <h1 className="hero-in mt-2 text-[clamp(1.85rem,1.2rem+2.6vw,3.2rem)] font-semibold leading-[1.06] tracking-[-0.03em] text-ink text-balance" style={{['--d' as string]: '60ms'}}>
              {p.title}
            </h1>
            <p className="hero-in t-lead mt-4 max-w-[64ch] text-muted" style={{['--d' as string]: '120ms'}}>
              {p.excerpt}
            </p>
            <div className="hero-in mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-steel" style={{['--d' as string]: '160ms'}}>
              <span>
                Published <time dateTime={p.published}>{formatPostDate(p.published)}</time>
              </span>
              <span aria-hidden>·</span>
              <span>{p.readingMinutes} min read</span>
              <span aria-hidden>·</span>
              <span>By Ananta Corporation</span>
            </div>
            <ul className="hero-in mt-4 flex flex-wrap gap-2" aria-label="Written for" style={{['--d' as string]: '200ms'}}>
              {p.audiences.map((a) => (
                <li key={a} className="inline-flex min-h-8 items-center rounded-[4px] bg-surface-blue px-2.5 text-[12.5px] font-medium text-indigo">
                  {BLOG_AUDIENCE_LABEL[a]}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-[10px] bg-bg-soft sm:aspect-[21/9]" data-reveal="image">
            <Image src={p.image} alt={p.imageAlt} fill priority sizes="(max-width: 1440px) 94vw, 1360px" className="object-cover" />
          </div>
        </div>
      </header>

      <div className="bg-white py-10 sm:py-14">
        <div className="shell grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <aside className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-28">
              <Toc items={toc} />
              <a href={quoteWhatsappUrl(quote)} target="_blank" rel="noopener noreferrer" className={buttonClassName('green', 'sm', 'mt-8 w-full whitespace-normal text-balance')}>
                <WhatsAppIcon className="h-4 w-4 text-wa" />
                Ask about this topic
              </a>
            </div>
          </aside>

          <article className="min-w-0 lg:col-span-9" data-post-body>
            <div className="max-w-[68ch]">
              <details className="group mb-8 rounded-[8px] border border-line bg-bg-soft lg:hidden" data-toc-mobile>
                <summary className="flex min-h-12 cursor-pointer items-center justify-between gap-3 px-4 text-[14px] font-semibold text-ink">
                  On this page
                  <ChevronDown className="h-4 w-4 shrink-0 text-steel transition-transform group-open:rotate-180" aria-hidden />
                </summary>
                <ol className="flex flex-col gap-1 px-4 pb-4">
                  {toc.map((t) => (
                    <li key={t.id}>
                      <a href={`#${t.id}`} className="block py-1.5 text-[14px] text-muted hover:text-indigo">
                        {t.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </details>

              <BlockRenderer blocks={p.blocks} />

              <section className="mt-14" aria-labelledby="faq-title" data-post-faq>
                <h2 id="faq-title" className="t-h3 text-[clamp(1.35rem,1.1rem+0.9vw,1.75rem)] text-ink" data-reveal="up">
                  Frequently asked questions
                </h2>
                <div className="mt-4" data-reveal="up">
                  <FaqList items={p.faqs} />
                </div>
              </section>

              <section className="mt-12" aria-labelledby="sources-title">
                <h2 id="sources-title" className="t-label text-steel">
                  Sources &amp; notes
                </h2>
                <ul className="mt-3 flex flex-col gap-2 text-[14px] leading-snug">
                  {p.sources.map((s) => (
                    <li key={s.label} className="flex flex-wrap gap-x-2">
                      <span className="text-steel">{SOURCE_KIND[s.kind]}:</span>
                      {s.url ? (
                        <a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-ink underline decoration-line underline-offset-[3px] hover:text-indigo">
                          {s.label}
                          <ExternalLink className="h-3 w-3 shrink-0" aria-hidden />
                        </a>
                      ) : (
                        <span className="text-ink">{s.label}</span>
                      )}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-[13px] leading-relaxed text-steel">
                  General guidance describes common industry practice and varies by manufacturer and site conditions. Product details are as listed in the Ananta catalogue and stated by the manufacturer; confirm current specifications before ordering.
                </p>
              </section>

              <section className="mt-12 overflow-visible rounded-[10px] bg-navy p-6 text-white sm:p-8" aria-labelledby="quote-title" data-reveal="up">
                <p className="t-label text-orange-light">Next step</p>
                <h2 id="quote-title" className="mt-2 text-[clamp(1.3rem,1.1rem+0.8vw,1.7rem)] font-semibold leading-tight text-white">
                  Need a price for your material list?
                </h2>
                <p className="mt-2 max-w-[56ch] text-[15px] leading-relaxed text-white/70">Send your sizes, thicknesses and quantities — the team replies with price and availability for your location.</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <a href={quoteWhatsappUrl(quote)} target="_blank" rel="noopener noreferrer" className={buttonClassName('orange', 'md', 'whitespace-normal text-balance')} data-quote-cta>
                    <WhatsAppIcon className="h-4 w-4" />
                    Get price on WhatsApp
                  </a>
                  <Link href={quoteContactHref(quote)} className={buttonClassName('outline-light', 'md', 'whitespace-normal text-balance')}>
                    Send an enquiry
                  </Link>
                </div>
              </section>
            </div>
          </article>
        </div>
      </div>

      {products.length > 0 && (
        <section className="border-t border-line bg-bg-soft py-12 sm:py-16" aria-labelledby="related-products">
          <div className="shell">
            <h2 id="related-products" className="t-h2 text-ink" data-reveal="mask">
              Products in this guide
            </h2>
            <ul className="mt-6 grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-4">
              {products.map((x, i) => (
                <li key={x.slug} data-reveal="up" style={{['--d' as string]: `${i * 70}ms`}}>
                  <ProductTile product={x} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {(tools.length > 0 || related.length > 0) && (
        <section className="bg-white py-12 sm:py-16" aria-label="Keep exploring">
          <div className="shell flex flex-col gap-12">
            {tools.length > 0 && (
              <div>
                <h2 className="t-h3 text-ink" data-reveal="up">
                  Related tools
                </h2>
                <div className="mt-4 max-w-4xl" data-related-tools>
                  <ToolLinks tools={tools} />
                </div>
              </div>
            )}
            {related.length > 0 && (
              <div>
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <h2 className="t-h3 text-ink" data-reveal="up">
                    More guides
                  </h2>
                  <Link href="/blog" className="inline-flex min-h-11 items-center gap-1.5 text-[14px] font-semibold text-indigo">
                    All guides <ArrowRight className="arrow-nudge h-4 w-4" aria-hidden />
                  </Link>
                </div>
                <ul className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {related.map((r, i) => (
                    <li key={r.slug} data-reveal="up" style={{['--d' as string]: `${i * 80}ms`}}>
                      <PostCard
                        post={{
                          slug: r.slug,
                          title: r.title,
                          excerpt: r.excerpt,
                          category: r.category,
                          categoryLabel: BLOG_CATEGORY_LABEL[r.category],
                          readingMinutes: r.readingMinutes,
                          published: r.published,
                          image: r.image,
                          imageAlt: r.imageAlt
                        }}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
}
