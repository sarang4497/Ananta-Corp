import Image from 'next/image';
import {ArrowRight} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {BLOG_CATEGORY_LABEL, POSTS} from '@/content/blog';
import {SECTION, SectionHead} from './ui';

/** 13 INSIGHTS — latest 3 POSTS; the whole section is hidden when there are none. */
export function Insights() {
  const posts = [...POSTS].sort((a, b) => b.published.localeCompare(a.published)).slice(0, 3);
  if (!posts.length) return null;
  return (
    <section aria-labelledby="insights-title" className={`${SECTION} bg-bg-warm`}>
      <div className="shell">
        <SectionHead
          id="insights-title"
          eyebrow="Insights"
          title="Guides for specifying and buying material."
          aside={
            <Link href="/blog" className="arrow-nudge inline-flex min-h-11 items-center gap-1.5 text-[14.5px] font-semibold text-indigo">
              All guides <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          }
        />
        <ul className="mt-9 grid grid-cols-1 gap-4 md:grid-cols-3">
          {posts.map((p, i) => (
            <li key={p.slug} data-reveal="up" style={{['--d' as string]: `${i * 90}ms`}}>
              <Link href={{pathname: '/blog/[slug]', params: {slug: p.slug}}} className="tile-lift group flex h-full flex-col rounded-[10px] border border-line bg-white">
                <span className="tile-zoom relative block aspect-[16/10] overflow-hidden rounded-t-[10px] bg-bg-soft">
                  <Image src={p.image} alt={p.imageAlt} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                </span>
                <span className="flex flex-1 flex-col gap-2 p-5">
                  <span className="t-label text-orange-ink">
                    {BLOG_CATEGORY_LABEL[p.category]} · {p.readingMinutes} min read
                  </span>
                  <span className="text-[17px] font-semibold leading-snug text-ink group-hover:text-indigo">{p.title}</span>
                  <span className="text-[14px] leading-relaxed text-muted">{p.excerpt}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
