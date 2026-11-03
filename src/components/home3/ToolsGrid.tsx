import {ArrowRight} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {TOOLS} from '@/content/tools';
import {ToolIcon} from './ToolIcon';
import {SECTION, SectionHead} from './ui';

/** 12 TOOLS / UTILITIES — one card per TOOLS registry entry. */
export function ToolsGrid() {
  return (
    <section aria-labelledby="toolkit-title" className={`${SECTION} bg-white`}>
      <div className="shell">
        <SectionHead
          id="toolkit-title"
          eyebrow="Tools & utilities"
          title="Plan the material before you call."
          aside={
            <Link href="/tools" className="arrow-nudge inline-flex min-h-11 items-center gap-1.5 text-[14.5px] font-semibold text-indigo">
              Tools hub <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          }
        />
        <ul className="mt-9 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {TOOLS.map((t, i) => (
            <li key={t.slug} data-reveal="up" style={{['--d' as string]: `${i * 70}ms`}}>
              <Link href={t.href} className="tile-lift group flex h-full flex-col gap-3 rounded-[10px] border border-line bg-white p-5">
                <span className="grid h-11 w-11 place-items-center rounded-[8px] bg-surface-blue text-indigo">
                  <ToolIcon icon={t.icon} className="h-5 w-5" />
                </span>
                <span className="text-[16px] font-semibold leading-snug text-ink group-hover:text-indigo">{t.name}</span>
                <span className="text-[13.5px] leading-relaxed text-muted">{t.description}</span>
                <span className="arrow-nudge mt-auto inline-flex items-center gap-1.5 pt-1 text-[13.5px] font-semibold text-indigo">
                  Open <ArrowRight className="h-4 w-4" aria-hidden />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
