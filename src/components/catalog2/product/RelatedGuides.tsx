import Image from 'next/image';
import {ArrowRight, BookOpen} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {BLOG_CATEGORY_LABEL, type Post} from '@/content/blog';
import type {Href} from '@/data/products';

const postHref = (slug: string) => ({pathname: '/blog/[slug]', params: {slug}}) as Href;

/**
 * Related guides from the blog (src/content/blog). Renders nothing when there
 * are no matching posts — never an empty shell.
 */
export function RelatedGuides({posts, title = 'Related guides', id = 'guides-title'}: {posts: Post[]; title?: string; id?: string}) {
  if (!posts.length) return null;
  return (
    <section className="bg-white py-10 sm:py-14" aria-labelledby={id}>
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id={id} className="t-h3 text-ink" data-reveal="up">
            {title}
          </h2>
          <Link href="/blog" className="arrow-nudge inline-flex min-h-11 items-center gap-1 text-[14px] font-semibold text-indigo">
            All guides <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
        <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.slice(0, 3).map((p) => (
            <li key={p.slug} data-reveal="up">
              <article className="tile-lift tile-zoom group relative flex h-full flex-col overflow-hidden rounded-[10px] border border-line bg-white">
                <div className="relative aspect-[16/9] bg-bg-soft" data-reveal="image">
                  <Image src={p.image} alt={p.imageAlt} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover" />
                </div>
                <div className="flex flex-1 flex-col gap-2 p-4">
                  <p className="t-label flex flex-wrap items-center gap-1.5 text-steel">
                    <BookOpen className="h-3.5 w-3.5" aria-hidden /> {BLOG_CATEGORY_LABEL[p.category]} · {p.readingMinutes} min read
                  </p>
                  <h3 className="text-[15.5px] font-semibold leading-snug text-ink text-pretty">
                    <Link href={postHref(p.slug)} className="after:absolute after:inset-0 after:content-[''] group-hover:text-indigo">
                      {p.title}
                    </Link>
                  </h3>
                  <p className="text-[13.5px] leading-relaxed text-muted">{p.excerpt}</p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
