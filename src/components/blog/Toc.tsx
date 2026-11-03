'use client';

import {useEffect, useState} from 'react';
import {cn} from '@/lib/cn';

/** Sticky "On this page" list; highlights the section currently in view. */
export function Toc({items}: {items: {id: string; text: string}[]}) {
  const [current, setCurrent] = useState(items[0]?.id ?? '');

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const els = items.map((i) => document.getElementById(i.id)).filter((e): e is HTMLElement => Boolean(e));
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setCurrent(visible[0].target.id);
      },
      {rootMargin: '-15% 0px -70% 0px'}
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [items]);

  return (
    <nav aria-label="On this page" data-toc>
      <p className="t-label text-steel">On this page</p>
      <ol className="mt-3 flex flex-col border-l border-line">
        {items.map((i) => (
          <li key={i.id}>
            <a
              href={`#${i.id}`}
              aria-current={current === i.id ? 'location' : undefined}
              className={cn(
                '-ml-px block border-l-2 py-1.5 pl-3 text-[13.5px] leading-snug transition-colors duration-150',
                current === i.id ? 'border-indigo font-medium text-indigo' : 'border-transparent text-muted hover:text-ink'
              )}
            >
              {i.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
