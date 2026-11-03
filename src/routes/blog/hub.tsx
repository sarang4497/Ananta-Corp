import type {Metadata} from 'next';
import Image from 'next/image';
import {setRequestLocale} from 'next-intl/server';
import {ArrowRight} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {BLOG_CATEGORY_LABEL, POSTS, blogCategoriesInUse} from '@/content/blog';
import {PageIntro} from '@/components/catalog2/PageIntro';
import {BlogBrowser} from '@/components/blog/BlogBrowser';
import {CategoryLinks, ToolLinks} from '@/components/blog/CrossLinks';
import {formatPostDate, type PostTeaser} from '@/components/blog/PostCard';
import {buttonClassName} from '@/components/ui/Button';
import {buildAlternates} from '@/lib/metadata';
import {breadcrumbJsonLd} from '@/lib/jsonld';
import {siteUrl} from '@/config';

type Params = {params: Promise<{locale: string}>};

const TITLE = 'Resources & Insights — Plywood, MDF and Board Guides';
const DESCRIPTION = 'Practical guides on plywood, MDF, HDHMR, HMR and pre-laminated boards for designers, architects, contractors and furniture makers.';

export async function generateMetadata({params}: Params): Promise<Metadata> {
  const {locale} = await params;
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: buildAlternates('/blog', locale),
    openGraph: {title: TITLE, description: DESCRIPTION, type: 'website', images: POSTS[0] ? [{url: POSTS[0].image}] : undefined}
  };
}

export default async function BlogHub({params}: Params) {
  const {locale} = await params;
  setRequestLocale(locale);

  const teasers: PostTeaser[] = POSTS.map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    category: p.category,
    categoryLabel: BLOG_CATEGORY_LABEL[p.category],
    readingMinutes: p.readingMinutes,
    published: p.published,
    image: p.image,
    imageAlt: p.imageAlt
  }));
  const featured = POSTS[0];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              {name: 'Home', url: siteUrl},
              {name: 'Resources', url: `${siteUrl}/blog`}
            ])
          )
        }}
      />
      <PageIntro
        crumbs={[{label: 'Home', href: '/'}, {label: 'Resources'}]}
        eyebrow="Resources & insights"
        title="Material guides for people who specify and build"
        lead="Plain-language guides on boards, grades and finishes — general industry principles kept separate from what the Ananta catalogue actually lists, so you can tell the two apart."
      />

      {featured && (
        <section className="bg-white pt-10 sm:pt-14" aria-labelledby="featured-title">
          <div className="shell">
            <p className="t-label text-steel" data-reveal="fade">
              Featured guide
            </p>
            <article className="group relative mt-4 grid grid-cols-1 overflow-hidden rounded-[10px] border border-line bg-white lg:grid-cols-2" data-featured-post={featured.slug}>
              <div className="relative aspect-[16/10] overflow-hidden bg-bg-soft lg:aspect-auto lg:min-h-[360px]" data-reveal="image">
                <Image src={featured.image} alt={featured.imageAlt} fill priority sizes="(max-width: 1024px) 92vw, 640px" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
              </div>
              <div className="flex flex-col justify-center gap-4 p-6 sm:p-8 lg:p-10">
                <p className="t-label text-orange-ink">{BLOG_CATEGORY_LABEL[featured.category]}</p>
                <h2 id="featured-title" className="t-h2 text-[clamp(1.5rem,1.1rem+1.6vw,2.3rem)] text-ink" data-reveal="mask">
                  <Link
                    href={{pathname: '/blog/[slug]', params: {slug: featured.slug}}}
                    className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none group-hover:text-indigo"
                  >
                    {featured.title}
                  </Link>
                </h2>
                <p className="max-w-[56ch] text-[15.5px] leading-relaxed text-muted">{featured.excerpt}</p>
                <p className="text-[13px] text-steel">
                  <time dateTime={featured.published}>{formatPostDate(featured.published)}</time> · {featured.readingMinutes} min read
                </p>
                <span className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-indigo">
                  Read the guide <ArrowRight className="arrow-nudge h-4 w-4" aria-hidden />
                </span>
              </div>
            </article>
          </div>
        </section>
      )}

      <section className="bg-white py-12 sm:py-16" aria-labelledby="all-guides">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="all-guides" className="t-h2 text-ink" data-reveal="mask">
              All guides
            </h2>
            <span aria-hidden className="block h-px w-full origin-left bg-line" data-reveal="line" />
          </div>
          <div className="mt-6">
            <BlogBrowser posts={teasers} categories={blogCategoriesInUse()} />
          </div>
        </div>
      </section>

      <section className="bg-navy py-14 text-white sm:py-20" aria-labelledby="blog-next">
        <div className="shell grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <p className="t-label text-orange-light">Tools</p>
            <h2 id="blog-next" className="t-h2 mt-3 text-white" data-reveal="mask">
              Put a guide to work
            </h2>
            <p className="mt-3 max-w-[52ch] text-[15px] leading-relaxed text-white/70">Narrow down a board, compare two side by side, or estimate sheets before you ask for a price.</p>
            <div className="mt-6">
              <ToolLinks dark />
            </div>
            <Link href="/tools" className={buttonClassName('outline-light', 'md', 'mt-6 whitespace-normal text-balance')}>
              All tools <ArrowRight className="arrow-nudge h-4 w-4" aria-hidden />
            </Link>
          </div>
          <div>
            <p className="t-label text-orange-light">Catalogue</p>
            <h2 className="t-h2 mt-3 text-white" data-reveal="mask">
              Browse products
            </h2>
            <p className="mt-3 max-w-[52ch] text-[15px] leading-relaxed text-white/70">Every guide links back to the boards, doors and locks Ananta actually supplies.</p>
            <div className="mt-6">
              <CategoryLinks />
            </div>
            <Link href="/products" className={buttonClassName('light', 'md', 'mt-6 whitespace-normal text-balance')}>
              View the catalogue <ArrowRight className="arrow-nudge h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
