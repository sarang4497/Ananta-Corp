import Image from 'next/image';
import {ArrowRight, ChefHat, Shirt, Building2, Home, Store, KeyRound, type LucideIcon} from 'lucide-react';
import {Reveal, RevealItem} from '@/components/ui/Reveal';
import {SectionHeading} from '@/components/ui/SectionHeading';
import {whatsappUrl} from '@/lib/whatsapp';

export type SolutionItem = {title: string; materials: string};

const VISUALS: {icon: LucideIcon; image: string}[] = [
  {icon: ChefHat, image: '/images/hero/mdf-slider.png'},
  {icon: Shirt, image: '/images/decor/3009-classic-planked-walnut.avif'},
  {icon: Building2, image: '/images/decor/1104-silver-grey.avif'},
  {icon: Home, image: '/images/decor/3041-elegant-teak.avif'},
  {icon: Store, image: '/images/decor/3404-fab-grey.avif'},
  {icon: KeyRound, image: '/images/products/high-end-smart-main-door-lock.jpg'}
];

/**
 * Application-based solution tiles — sells outcomes, not SKUs. Each tile is a
 * finished-interior image under a navy gradient, with recommended materials and
 * a WhatsApp "ask for recommendation" CTA.
 */
export function Solutions({
  eyebrow,
  heading,
  sub,
  cta,
  items
}: {
  eyebrow: string;
  heading: string;
  sub: string;
  cta: string;
  items: SolutionItem[];
}) {
  return (
    <section id="solutions" className="mt-14 bg-bg-warm py-14 sm:mt-20 sm:py-20">
      <div className="shell">
        <Reveal>
          <SectionHeading eyebrow={eyebrow} title={heading} sub={sub} />
        </Reveal>
        <Reveal
          stagger={0.06}
          className="mt-10 grid grid-cols-1 gap-6 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3"
        >
          {items.map((item, i) => {
            const {icon: Icon, image} = VISUALS[i % VISUALS.length];
            const href = whatsappUrl(
              `Hello! I'm planning a ${item.title} project. Please recommend the right materials and share pricing.`
            );
            return (
              <RevealItem key={item.title} className="h-full">
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex h-64 flex-col justify-end overflow-hidden rounded-2xl border border-border no-underline shadow-card transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-orange/30 hover:shadow-[0_24px_60px_-24px_rgba(249,115,22,0.4)]"
                >
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
                    style={{backgroundImage: 'linear-gradient(180deg, rgba(30,27,58,0.05) 0%, rgba(30,27,58,0.45) 50%, rgba(23,37,84,0.92) 100%)'}}
                  />
                  <span className="absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-xl border border-white/25 bg-white/15 text-white backdrop-blur-sm">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <div className="relative flex flex-col gap-2 p-5 text-white">
                    <h3 className="text-xl font-bold leading-snug">{item.title}</h3>
                    <p className="text-[13px] font-semibold leading-snug text-white/85">{item.materials}</p>
                    <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-bold text-orange-light">
                      {cta}
                      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
                    </span>
                  </div>
                </a>
              </RevealItem>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
