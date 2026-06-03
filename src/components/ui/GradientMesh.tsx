import {cn} from '@/lib/cn';

type Props = {
  className?: string;
  /** When true, fixed to the viewport as a global ambient backdrop. */
  fixed?: boolean;
};

/**
 * Slowly drifting, blurred multi-color background. Pure CSS (animate-drift),
 * GPU-friendly transforms, low opacity. Decorative only — aria-hidden, and it
 * never intercepts pointer events.
 *
 * The fixed wrapper is promoted to its own composited, paint-contained layer
 * (translateZ + contain) so the expensive blur is rendered once and only
 * re-composited as the blobs drift — it never repaints while the page scrolls.
 */
export function GradientMesh({className, fixed = true}: Props) {
  return (
    <div
      aria-hidden
      style={fixed ? {transform: 'translateZ(0)', contain: 'layout paint'} : undefined}
      className={cn(
        'pointer-events-none -z-10 overflow-hidden',
        fixed ? 'fixed inset-0' : 'absolute inset-0',
        className
      )}
    >
      {/* Indigo-only ambient wash — keeps section backgrounds to white /
          light-indigo tints (no blue/orange/green section fills). */}
      <div
        className="absolute -left-[15%] -top-[20%] h-[55vmax] w-[55vmax] animate-drift rounded-full opacity-[0.14] blur-[90px]"
        style={{background: 'radial-gradient(circle at 30% 30%, #1d4ed8, transparent 60%)'}}
      />
      <div
        className="absolute right-[-10%] top-[5%] h-[48vmax] w-[48vmax] animate-drift-slow rounded-full opacity-[0.12] blur-[90px]"
        style={{background: 'radial-gradient(circle at 60% 40%, #1d4ed8, transparent 60%)'}}
      />
      <div
        className="absolute bottom-[-20%] left-[20%] h-[46vmax] w-[46vmax] animate-drift rounded-full opacity-[0.10] blur-[100px]"
        style={{background: 'radial-gradient(circle at 50% 50%, #1d4ed8, transparent 62%)'}}
      />
      <div
        className="absolute bottom-[-10%] right-[10%] h-[42vmax] w-[42vmax] animate-drift-slow rounded-full opacity-[0.08] blur-[100px]"
        style={{background: 'radial-gradient(circle at 50% 50%, #1d4ed8, transparent 62%)'}}
      />
    </div>
  );
}
