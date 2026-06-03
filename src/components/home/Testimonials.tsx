import {Quote} from 'lucide-react';
import {Reveal, RevealItem} from '@/components/ui/Reveal';

export type Testimonial = {quote: string; name: string; role: string};

/**
 * Six real customer quotes in a clean three-column grid (stacks on mobile).
 * Initials avatar — no stock photos.
 */
export function Testimonials({items}: {items: Testimonial[]}) {
  return (
    <Reveal
      stagger={0.07}
      className="mt-10 grid grid-cols-1 gap-6 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3"
    >
      {items.map((item) => (
        <RevealItem key={item.name} className="h-full">
          <figure className="flex h-full flex-col gap-4 rounded-2xl border border-border bg-bg p-6 shadow-card transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-glow">
            <Quote className="h-6 w-6 -scale-x-100 text-orange" aria-hidden />
            <blockquote className="flex-1 text-pretty text-sm leading-relaxed text-ink">
              “{item.quote}”
            </blockquote>
            <figcaption className="flex items-center gap-3 border-t border-border pt-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-brand text-sm font-bold text-white">
                {initials(item.name)}
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-sm font-bold text-ink">{item.name}</span>
                <span className="text-xs text-muted">{item.role}</span>
              </span>
            </figcaption>
          </figure>
        </RevealItem>
      ))}
    </Reveal>
  );
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0] ?? '')
    .join('')
    .toUpperCase();
}
