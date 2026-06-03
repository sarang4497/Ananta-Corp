import {cn} from '@/lib/cn';

/** Lightweight loading placeholder shown while a demo chunk downloads. */
export function DemoSkeleton({className}: {className?: string}) {
  return (
    <div className={cn('grid gap-5 md:grid-cols-2', className)} aria-hidden>
      <div className="flex flex-col gap-3">
        <div className="h-3 w-28 rounded bg-bg-soft" />
        <div className="h-28 w-full animate-pulse rounded-xl border border-border bg-bg-soft/60" />
        <div className="h-10 w-40 rounded-full bg-bg-soft" />
      </div>
      <div className="rounded-xl border border-border bg-bg-soft/40 p-4">
        <div className="mb-3 h-3 w-32 rounded bg-bg-soft" />
        <div className="flex flex-col gap-2">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-11 w-full animate-pulse rounded-lg border border-border bg-bg"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
