import Image from 'next/image';
import {CheckCircle2} from 'lucide-react';
import {Reveal, RevealItem} from '@/components/ui/Reveal';
import {SectionHeading} from '@/components/ui/SectionHeading';

export type ProjectItem = {type: string; materials: string};

const IMAGES = [
  '/images/hero/plywood-slider.png',
  '/images/hero/mdf-slider.png',
  '/images/hero/door-slider.jpg'
];

/**
 * Mini case-study cards — project type, materials supplied and a consistent
 * outcome line. Frames Ananta as a supplier behind real project execution.
 */
export function ProjectProof({
  eyebrow,
  heading,
  sub,
  outcome,
  items
}: {
  eyebrow: string;
  heading: string;
  sub: string;
  outcome: string;
  items: ProjectItem[];
}) {
  return (
    <section id="projects" className="shell pt-14 sm:pt-20">
      <Reveal>
        <SectionHeading eyebrow={eyebrow} title={heading} sub={sub} />
      </Reveal>
      <Reveal stagger={0.08} className="mt-10 grid grid-cols-1 gap-6 sm:mt-12 lg:grid-cols-3">
        {items.map((item, i) => (
          <RevealItem key={item.type} className="h-full">
            <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-bg shadow-card transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-indigo/30 hover:shadow-glow">
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={IMAGES[i % IMAGES.length]}
                  alt={item.type}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute left-3 top-3 rounded-full bg-ink/75 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white backdrop-blur-sm">
                  {item.type}
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-3 p-5">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-indigo">
                    Materials supplied
                  </span>
                  <p className="text-sm font-semibold leading-snug text-ink">{item.materials}</p>
                </div>
                <p className="mt-auto inline-flex items-start gap-2 rounded-xl bg-bg-soft px-3.5 py-2.5 text-sm font-semibold leading-snug text-ink">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-orange" aria-hidden />
                  {outcome}
                </p>
              </div>
            </article>
          </RevealItem>
        ))}
      </Reveal>
    </section>
  );
}
