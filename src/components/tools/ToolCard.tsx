import {ArrowRight, Calculator, ClipboardList, Columns2, Layers, Palette, type LucideIcon} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import type {Tool} from '@/content/tools';
import {cn} from '@/lib/cn';

export const TOOL_ICONS: Record<Tool['icon'], LucideIcon> = {Layers, Columns2, ClipboardList, Calculator, Palette};

/** One tool in the hub grid / related-tools rail. Whole card is the link. */
export function ToolCard({tool, index, compact = false}: {tool: Tool; index?: number; compact?: boolean}) {
  const Icon = TOOL_ICONS[tool.icon];
  return (
    <article className="tile-lift group relative flex h-full flex-col rounded-[12px] border border-line bg-white p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[8px] bg-surface-blue text-indigo transition-colors duration-200 group-hover:bg-indigo group-hover:text-white">
          <Icon className="h-5 w-5" aria-hidden />
        </span>
        {index !== undefined && <span className="t-label text-steel">Tool {String(index + 1).padStart(2, '0')}</span>}
      </div>
      <h3 className={cn('mt-5 font-semibold leading-snug tracking-[-0.01em] text-ink', compact ? 'text-[16px]' : 'text-[19px]')}>
        <Link href={tool.href} className="after:absolute after:inset-0 after:rounded-[12px] after:content-[''] focus-visible:outline-none group-focus-within:text-indigo">
          {tool.name}
        </Link>
      </h3>
      <p className="mt-1.5 text-[13px] font-medium text-orange-ink">{tool.short}</p>
      {!compact && <p className="mt-3 text-[14px] leading-relaxed text-muted">{tool.description}</p>}
      <span className="arrow-nudge mt-auto inline-flex items-center gap-1.5 pt-5 text-[13.5px] font-semibold text-indigo">
        Open tool <ArrowRight className="h-4 w-4" aria-hidden />
      </span>
    </article>
  );
}
