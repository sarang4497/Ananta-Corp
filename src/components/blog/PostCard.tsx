import Image from 'next/image';
import {ArrowRight} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import type {BlogCategory} from '@/content/blog/types';
import {cn} from '@/lib/cn';

/** Serializable teaser data (safe to pass into the client browser). */
export type PostTeaser = {
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  categoryLabel: string;
  readingMinutes: number;
  published: string;
  image: string;
  imageAlt: string;
};

export function formatPostDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-IN', {day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC'});
}

export function PostCard({post, priority = false, className}: {post: PostTeaser; priority?: boolean; className?: string}) {
  return (
    <article className={cn('tile-lift tile-zoom group relative flex h-full flex-col overflow-hidden rounded-[8px] border border-line bg-white', className)} data-post-card={post.slug}>
      <div className="relative aspect-[16/10] overflow-hidden bg-bg-soft">
        <Image src={post.image} alt={post.imageAlt} fill priority={priority} sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 380px" className="object-cover" />
      </div>
      <div className="flex flex-1 flex-col gap-2.5 p-5">
        <p className="t-label text-orange-ink">{post.categoryLabel}</p>
        <h3 className="text-[1.1rem] font-semibold leading-snug tracking-[-0.01em] text-ink">
          <Link
            href={{pathname: '/blog/[slug]', params: {slug: post.slug}}}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none group-focus-within:text-indigo group-hover:text-indigo"
          >
            {post.title}
          </Link>
        </h3>
        <p className="text-[14px] leading-relaxed text-muted">{post.excerpt}</p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2 text-[12.5px] text-steel">
          <span>
            <time dateTime={post.published}>{formatPostDate(post.published)}</time> · {post.readingMinutes} min read
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-indigo">
            Read <ArrowRight className="arrow-nudge h-3.5 w-3.5" aria-hidden />
          </span>
        </div>
      </div>
    </article>
  );
}
