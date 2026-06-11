import {Quote, MapPin} from 'lucide-react';
import {Reveal, RevealItem} from '@/components/ui/Reveal';

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  location?: string;
  project?: string;
};

/**
 * Six project-backed customer quotes in a clean three-column grid (stacks on
 * mobile). Each carries a project-type tag, name, role and location — initials
 * avatar, no stock photos.
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
            <div className="flex items-center justify-between gap-3">
              <Quote className="h-6 w-6 -scale-x-100 text-orange" aria-hidden />
              {item.project && (
                <span className="inline-flex items-center rounded-full bg-indigo/8 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-indigo">
                  {item.project}
                </span>
              )}
            </div>
            <blockquote className="flex-1 text-pretty text-sm leading-relaxed text-ink">
              “{item.quote}”
            </blockquote>
            <figcaption className="flex items-center gap-3 border-t border-border pt-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-brand text-sm font-bold text-white">
                {initials(item.name)}
              </span>
              <span className="flex min-w-0 flex-col leading-tight">
                <span className="text-sm font-bold text-ink">{item.name}</span>
                <span className="text-xs text-muted">
                  {item.role}
                  {item.location && (
                    <>
                      {' · '}
                      <span className="inline-flex items-center gap-0.5">
                        <MapPin className="h-3 w-3 text-orange" aria-hidden />
                        {item.location}
                      </span>
                    </>
                  )}
                </span>
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
