import {
  FileStack,
  Gauge,
  MessagesSquare,
  Video,
  ListChecks,
  UserCheck,
  ArrowRight
} from 'lucide-react';

/**
 * The Lubi AI-assisted hiring pipeline shown as a visual flow — the "impact at a
 * glance" for that flagship case. Wraps cleanly on small screens. Brand indigo,
 * no black. Server component (pure JSX).
 */
const STEPS = [
  {Icon: FileStack, label: '10,000+ résumés'},
  {Icon: Gauge, label: 'AI fit score'},
  {Icon: MessagesSquare, label: 'Chat to hire'},
  {Icon: Video, label: 'AI interviews'},
  {Icon: ListChecks, label: 'Auto-shortlist'},
  {Icon: UserCheck, label: 'Best hire'}
];

export function HiringFlow() {
  return (
    <div className="rounded-2xl border border-indigo/20 bg-gradient-to-br from-indigo/10 to-indigo/[0.03] p-5 shadow-card sm:p-7">
      <p className="mb-4 text-center text-[11px] font-bold uppercase tracking-[0.14em] text-indigo">
        From inbox chaos to the right hire
      </p>
      <ol className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {STEPS.map(({Icon, label}, i) => (
          <li key={label} className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-indigo/20 bg-bg px-3 py-2 shadow-sm">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-indigo/10 text-indigo">
                <Icon className="h-4 w-4" strokeWidth={1.9} aria-hidden />
              </span>
              <span className="whitespace-nowrap text-[13px] font-semibold text-ink">{label}</span>
            </div>
            {i < STEPS.length - 1 ? (
              <ArrowRight className="h-4 w-4 shrink-0 text-indigo/50" aria-hidden />
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}
