import {Fragment} from 'react';
import {Link} from '@/i18n/navigation';
import type {Href} from '@/data/products';

export type Crumb = {label: string; href?: Href};

/** Slim mono breadcrumb; wraps on phones, never overflows. */
export function Breadcrumbs({items}: {items: Crumb[]}) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12.5px]">
        {items.map((item, i) => (
          <Fragment key={`${item.label}-${i}`}>
            {i > 0 && (
              <li aria-hidden className="text-steel">
                /
              </li>
            )}
            <li className="min-w-0">
              {item.href ? (
                <Link href={item.href} className="text-muted hover:text-indigo">
                  {item.label}
                </Link>
              ) : (
                <span aria-current="page" className="font-medium text-ink">
                  {item.label}
                </span>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
