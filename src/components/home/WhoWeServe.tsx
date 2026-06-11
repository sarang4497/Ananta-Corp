import Image from 'next/image';
import {Palette, Compass, HardHat, Factory, Home, type LucideIcon} from 'lucide-react';
import {Reveal, RevealItem} from '@/components/ui/Reveal';
import {SectionHeading} from '@/components/ui/SectionHeading';

export type ServeItem = {title: string; pain: string; promise: string};

const VISUALS: {icon: LucideIcon; image: string}[] = [
  {icon: Palette, image: '/images/decor/3018-mangfall-beech.avif'},
  {icon: Compass, image: '/images/hero/door-slider.jpg'},
  {icon: HardHat, image: '/images/categories/plywood.jpg'},
  {icon: Factory, image: '/images/categories/mdf.jpg'},
  {icon: Home, image: '/images/categories/flush-door.jpg'}
];

/**
 * "Who we serve" — five audience cards, each pairing a pain point with the
 * promise that answers it. Image header + icon badge + two-line copy.
 */
export function WhoWeServe({
  eyebrow,
  heading,
  sub,
  items
}: {
  eyebrow: string;
  heading: string;
  sub: string;
  items: ServeItem[];
}) {
  return (
    <section id="who-we-serve" className="shell pt-14 sm:pt-20">
      <Reveal>
        <SectionHeading eyebrow={eyebrow} title={heading} sub={sub} />
      </Reveal>
      <Reveal
        stagger={0.07}
        className="mt-10 grid grid-cols-1 gap-6 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3"
      >
        {items.map((item, i) => {
          const {icon: Icon, image} = VISUALS[i % VISUALS.length];
          return (
            <RevealItem key={item.title} className="h-full">
              <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-bg shadow-card transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-indigo/30 hover:shadow-glow">
                <div className="relative h-36 w-full overflow-hidden">
                  <Image
                    src={image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{backgroundImage: 'linear-gradient(180deg, rgba(30,27,58,0) 40%, rgba(30,27,58,0.55) 100%)'}}
                  />
                  <span className="absolute bottom-3 left-3 grid h-11 w-11 place-items-center rounded-xl border border-white/30 bg-bg/95 text-indigo shadow-card">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <h3 className="text-lg font-bold leading-snug text-ink">{item.title}</h3>
                  <p className="text-sm font-semibold leading-snug text-orange-deep">{item.pain}</p>
                  <p className="text-sm leading-relaxed text-muted">{item.promise}</p>
                </div>
              </div>
            </RevealItem>
          );
        })}
      </Reveal>
    </section>
  );
}
