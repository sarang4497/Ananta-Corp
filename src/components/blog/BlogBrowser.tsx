'use client';

import {useEffect, useState} from 'react';
import type {BlogCategory} from '@/content/blog/types';
import {cn} from '@/lib/cn';
import {PostCard, type PostTeaser} from './PostCard';

/**
 * Category chips + post grid. The server renders the full grid; the
 * ?category= deep link is applied after hydration and kept in the URL so a
 * filtered view can be shared.
 */
export function BlogBrowser({posts, categories}: {posts: PostTeaser[]; categories: {category: BlogCategory; label: string; count: number}[]}) {
  const [active, setActive] = useState<BlogCategory | ''>('');

  useEffect(() => {
    const c = new URLSearchParams(window.location.search).get('category') ?? '';
    if (!c || !categories.some((x) => x.category === c)) return;
    const id = requestAnimationFrame(() => setActive(c as BlogCategory));
    return () => cancelAnimationFrame(id);
  }, [categories]);

  const choose = (c: BlogCategory | '') => {
    setActive(c);
    const sp = new URLSearchParams(window.location.search);
    if (c) sp.set('category', c);
    else sp.delete('category');
    const qs = sp.toString();
    window.history.replaceState(null, '', qs ? `?${qs}` : window.location.pathname);
  };

  const shown = active ? posts.filter((p) => p.category === active) : posts;
  const chip = (on: boolean) =>
    cn(
      'inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-[13.5px] font-medium text-balance transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue',
      on ? 'border-indigo bg-indigo text-white' : 'border-line bg-white text-ink hover:border-indigo/50 hover:text-indigo'
    );

  return (
    <div>
      <div role="group" aria-label="Filter guides by topic" className="flex flex-wrap gap-2">
        <button type="button" className={chip(active === '')} aria-pressed={active === ''} onClick={() => choose('')}>
          All topics <span className={cn('tabular text-[12px]', active === '' ? 'text-white/75' : 'text-steel')}>{posts.length}</span>
        </button>
        {categories.map((c) => (
          <button key={c.category} type="button" className={chip(active === c.category)} aria-pressed={active === c.category} onClick={() => choose(c.category)} data-category={c.category}>
            {c.label} <span className={cn('tabular text-[12px]', active === c.category ? 'text-white/75' : 'text-steel')}>{c.count}</span>
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        {shown.length} {shown.length === 1 ? 'guide' : 'guides'} shown
      </p>
      <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" data-blog-grid>
        {shown.map((p, i) => (
          <li key={p.slug} data-reveal="up" style={{['--d' as string]: `${(i % 3) * 80}ms`}}>
            <PostCard post={p} />
          </li>
        ))}
      </ul>
    </div>
  );
}
