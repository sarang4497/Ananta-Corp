import {Play} from 'lucide-react';
import {cn} from '@/lib/cn';
import {accentBg, accentHex, type Accent} from './demoAccent';

/**
 * Lightweight static poster shown in a demo slot before its chunk loads — and
 * again if it scrolls far away. Deliberately renders no animation and pulls in
 * no demo JS: it's a "frozen first frame" with a clear play affordance.
 *
 * It mirrors the <Whiteboard> shell (same border, paper grid, layered shadow
 * and top-left mono label) so the hand-off to the live demo is seamless.
 *
 * TODO(posters): swap this generic frame for a real still image of each demo
 * once screenshot assets exist.
 */
export function DemoPoster({label, accent}: {label: string; accent: Accent}) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-3xl border border-border bg-bg shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_2px_4px_rgba(24,119,242,0.04),0_28px_60px_-30px_rgba(79,70,229,0.4),0_12px_28px_-22px_rgba(24,119,242,0.28)]">
      {/* paper grid — identical to the live stage */}
      <div aria-hidden className="demo-grid pointer-events-none absolute inset-0" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-3xl shadow-[inset_0_0_50px_rgba(79,70,229,0.05),inset_0_1px_0_rgba(255,255,255,0.8)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-1/3 rounded-t-3xl bg-gradient-to-b from-white/60 to-transparent"
      />

      {/* label chip — matches the live whiteboard, but the dot is static */}
      <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full border border-border bg-bg/80 px-2.5 py-1">
        <span className="h-[7px] w-[7px] rounded-full" style={{background: accentHex[accent]}} />
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-muted">
          {label}
        </span>
      </div>

      {/* centered play affordance */}
      <div className="absolute inset-0 grid place-items-center">
        <div className="flex flex-col items-center gap-3">
          <span
            className={cn('grid h-14 w-14 place-items-center rounded-full text-white', accentBg[accent])}
            style={{boxShadow: `0 16px 32px -12px ${accentHex[accent]}80`}}
          >
            <Play className="h-6 w-6 translate-x-[1px]" fill="currentColor" strokeWidth={0} aria-hidden />
          </span>
          <span className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
            Live demo
          </span>
        </div>
      </div>
    </div>
  );
}
