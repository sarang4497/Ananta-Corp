import {Plus} from 'lucide-react';

/** Native <details> accordion — keyboard/screen-reader friendly, no JS. */
export function FaqList({items}: {items: {q: string; a: string}[]}) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((f) => (
        <details key={f.q} className="group">
          <summary className="flex min-h-14 items-center justify-between gap-4 py-3 text-[15px] font-semibold text-ink hover:text-indigo">
            {f.q}
            <Plus className="h-4 w-4 shrink-0 text-steel transition-transform duration-200 group-open:rotate-45" aria-hidden />
          </summary>
          <p className="pb-5 pr-8 text-[14.5px] leading-relaxed text-muted">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
