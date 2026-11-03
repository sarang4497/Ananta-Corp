import {ArrowRight, Calculator, ClipboardList, Columns2, Layers, Palette} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {TOOLS, type Tool} from '@/content/tools';
import {CATEGORIES, categoryHref} from '@/data/products';
import {CATEGORY_COPY} from '@/content/categories';
import {countByCategory} from '@/data/stats';
import {cn} from '@/lib/cn';

export const TOOL_ICON: Record<Tool['icon'], typeof Layers> = {Layers, Columns2, ClipboardList, Calculator, Palette};

export function ToolLinks({tools = TOOLS, dark = false}: {tools?: Tool[]; dark?: boolean}) {
  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {tools.map((t, i) => {
        const Icon = TOOL_ICON[t.icon];
        return (
          <li key={t.slug} data-reveal="up" style={{['--d' as string]: `${i * 60}ms`}}>
            <Link
              href={t.href}
              className={cn('tile-lift group flex h-full min-h-11 gap-3 rounded-[8px] border p-4', dark ? 'border-white/12 bg-white/5 hover:border-white/40' : 'border-line bg-white hover:border-indigo/40')}
              data-tool-link={t.slug}
            >
              <span className={cn('grid h-10 w-10 shrink-0 place-items-center rounded-[6px]', dark ? 'bg-white/10 text-white' : 'bg-surface-blue text-indigo')}>
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className={cn('flex items-center gap-1.5 text-[15px] font-semibold', dark ? 'text-white' : 'text-ink group-hover:text-indigo')}>
                  {t.name}
                  <ArrowRight className="arrow-nudge h-3.5 w-3.5 shrink-0" aria-hidden />
                </span>
                <span className={cn('mt-0.5 block text-[13px] leading-snug', dark ? 'text-white/65' : 'text-muted')}>{t.short}</span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function CategoryLinks() {
  return (
    <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {CATEGORIES.map((c, i) => (
        <li key={c.slug} data-reveal="up" style={{['--d' as string]: `${i * 50}ms`}}>
          <Link
            href={categoryHref(c.slug)}
            className="group flex min-h-12 items-center justify-between gap-3 rounded-[6px] border border-white/12 px-4 py-2.5 text-[14.5px] font-medium text-white hover:border-white/40 hover:bg-white/5"
          >
            <span>{CATEGORY_COPY[c.slug].name}</span>
            <span className="tabular text-[12.5px] text-white/60">{countByCategory(c.slug)}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
