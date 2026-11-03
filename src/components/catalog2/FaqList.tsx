import {Plus} from 'lucide-react';

/** Native <details> accordion — keyboard/screen-reader friendly, no JS. */
export function FaqList({items}: {items: {q: string; a: string}[]}) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((f) => (
        <details key={f.q} className="group">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 text-[15px] font-semibold text-ink hover:text-indigo [&::-webkit-details-marker]:hidden">
            <span className="min-w-0 text-pretty">{f.q}</span>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line transition-colors duration-200 group-open:border-indigo group-open:bg-indigo group-open:text-white">
              <Plus className="h-4 w-4 transition-transform duration-200 group-open:rotate-45" aria-hidden />
            </span>
          </summary>
          <p className="max-w-[70ch] pb-5 pr-2 text-[14.5px] leading-relaxed text-muted sm:pr-12">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
