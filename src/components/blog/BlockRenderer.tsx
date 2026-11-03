import type {CSSProperties} from 'react';
import Image from 'next/image';
import {BookOpen, Info, TriangleAlert} from 'lucide-react';
import type {Block} from '@/content/blog/types';
import {PRODUCTS, type Product} from '@/data/products';
import {ProductTile} from '@/components/catalog2/ProductTile';
import {cn} from '@/lib/cn';
import {Inline} from './Inline';

const CALLOUT = {
  general: {
    label: 'General guidance',
    icon: BookOpen,
    box: 'border-l-[3px] border-steel/60 bg-bg-soft',
    head: 'text-muted'
  },
  ananta: {
    label: 'From the Ananta catalogue',
    icon: Info,
    box: 'border-l-[3px] border-indigo bg-surface-blue',
    head: 'text-indigo'
  },
  caution: {
    label: 'Caution',
    icon: TriangleAlert,
    box: 'border-l-[3px] border-orange bg-orange/5',
    head: 'text-orange-ink'
  }
} as const;

function productsFor(slugs: string[]): Product[] {
  return slugs.map((s) => PRODUCTS.find((p) => p.slug === s)).filter((p): p is Product => Boolean(p));
}

export function BlockRenderer({blocks}: {blocks: Block[]}) {
  return (
    <div className="post-body flex flex-col gap-5 text-[16.5px] leading-[1.75] text-ink/90">
      {blocks.map((b, i) => {
        const key = `${b.type}-${i}`;
        switch (b.type) {
          case 'p':
            return (
              <p key={key} data-reveal="up">
                <Inline text={b.text} />
              </p>
            );
          case 'h2':
            return (
              <h2 key={key} id={b.id} className="t-h3 mt-8 scroll-mt-32 text-[clamp(1.35rem,1.1rem+0.9vw,1.75rem)] tracking-[-0.02em] text-ink" data-reveal="up">
                <a href={`#${b.id}`} className="group/h hover:text-indigo">
                  {b.text}
                  <span aria-hidden className="ml-2 text-steel opacity-0 transition-opacity group-hover/h:opacity-100">
                    #
                  </span>
                </a>
              </h2>
            );
          case 'h3':
            return (
              <h3 key={key} className="mt-3 text-[1.1rem] font-semibold leading-snug text-ink" data-reveal="up">
                {b.text}
              </h3>
            );
          case 'list': {
            const Tag = b.ordered ? 'ol' : 'ul';
            return (
              <Tag key={key} className={cn('flex flex-col gap-2 pl-5', b.ordered ? 'list-decimal marker:font-semibold marker:text-indigo' : 'list-disc marker:text-indigo')} data-reveal="up">
                {b.items.map((it) => (
                  <li key={it} className="pl-1">
                    <Inline text={it} />
                  </li>
                ))}
              </Tag>
            );
          }
          case 'table':
            return (
              <figure key={key} className="my-2" data-reveal="up">
                <div
                  className="overflow-x-auto rounded-[8px] border border-line bg-white"
                  role="region"
                  aria-label={b.caption ? `${b.caption} (scrolls sideways)` : 'Comparison table (scrolls sideways)'}
                  tabIndex={0}
                >
                  <table className="w-full min-w-[560px] border-collapse text-left text-[14px] leading-snug">
                    <thead className="bg-bg-soft">
                      <tr>
                        {b.head.map((h) => (
                          <th key={h} scope="col" className="border-b border-line px-4 py-3 align-bottom font-semibold text-ink">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {b.rows.map((r, ri) => (
                        <tr key={ri} className="border-b border-line last:border-b-0">
                          {r.map((c, ci) =>
                            ci === 0 ? (
                              <th key={ci} scope="row" className="px-4 py-3 align-top font-medium text-ink">
                                <Inline text={c} />
                              </th>
                            ) : (
                              <td key={ci} className="px-4 py-3 align-top text-muted">
                                <Inline text={c} />
                              </td>
                            )
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {b.caption && <figcaption className="mt-2 text-[13px] text-steel">{b.caption}</figcaption>}
              </figure>
            );
          case 'callout': {
            const c = CALLOUT[b.tone];
            const Icon = c.icon;
            return (
              <aside key={key} className={cn('rounded-r-[8px] px-5 py-4', c.box)} data-callout={b.tone} data-reveal="up">
                <p className={cn('t-label flex items-center gap-2', c.head)}>
                  <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  {c.label}
                </p>
                {b.title && <p className="mt-2 text-[15.5px] font-semibold leading-snug text-ink">{b.title}</p>}
                <p className="mt-1.5 text-[15px] leading-relaxed text-ink/85">
                  <Inline text={b.text} />
                </p>
              </aside>
            );
          }
          case 'products': {
            const items = productsFor(b.slugs);
            if (!items.length) return null;
            return (
              <section key={key} className="my-3" aria-label={b.title ?? 'Products from the Ananta catalogue'} data-products-block>
                <p className="t-label text-indigo">{b.title ?? 'From the Ananta catalogue'}</p>
                <ul className="mt-3 grid grid-cols-1 gap-3 min-[480px]:grid-cols-2">
                  {items.map((p, pi) => (
                    <li key={p.slug} data-reveal="up" style={{'--d': `${pi * 80}ms`} as CSSProperties}>
                      <ProductTile product={p} />
                    </li>
                  ))}
                </ul>
              </section>
            );
          }
          case 'figure':
            return (
              <figure key={key} className="my-2" data-reveal="image">
                <div className="relative aspect-[16/9] overflow-hidden rounded-[8px] bg-bg-soft">
                  <Image src={b.src} alt={b.alt} fill sizes="(max-width: 768px) 92vw, 680px" className="object-cover" />
                </div>
                {b.caption && <figcaption className="mt-2 text-[13px] text-steel">{b.caption}</figcaption>}
              </figure>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
