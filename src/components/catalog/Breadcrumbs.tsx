import {Fragment} from 'react';
import {ChevronRight} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import type {Href} from '@/data/products';

export type Crumb = {label: string; href?: Href};

/** Slim breadcrumb trail used across the catalog pages. */
export function Breadcrumbs({items}: {items: Crumb[]}) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-[13px]">
      {items.map((item, i) => (
        <Fragment key={`${item.label}-${i}`}>
          {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-muted/60" aria-hidden />}
          {item.href ? (
            <Link
              href={item.href}
              className="text-muted no-underline transition-colors hover:text-indigo"
            >
              {item.label}
            </Link>
          ) : (
            <span aria-current="page" className="font-semibold text-ink">
              {item.label}
            </span>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
