import Image from 'next/image';
import {ArrowRight, BadgeCheck, Warehouse, Boxes, Wrench, Truck, type LucideIcon} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {Reveal, RevealItem} from '@/components/ui/Reveal';
import {buttonClassName} from '@/components/ui/Button';
import {whatsappUrl} from '@/lib/whatsapp';

const FLOAT_ICONS: LucideIcon[] = [Warehouse, Boxes, Wrench, Truck];

type Props = {
  badge: string;
  titlePre: string;
  titleAccent: string;
  sub: string;
  ctaWhatsapp: string;
  ctaProducts: string;
  pills: string[];
  rawLabel: string;
  finishedLabel: string;
  floating: string[];
};

/**
 * Split-layout hero. Left: positioning copy + dual CTA + trust bullets.
 * Right: a premium "raw materials → finished projects" split visual with
 * floating credibility cards overlaid.
 */
export function Hero({
  badge,
  titlePre,
  titleAccent,
  sub,
  ctaWhatsapp,
  ctaProducts,
  pills,
  rawLabel,
  finishedLabel,
  floating
}: Props) {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(160deg, rgba(29,78,216,0.07) 0%, rgba(255,255,255,0) 45%, rgba(249,115,22,0.06) 100%)'
        }}
      />
      <div className="shell relative grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        {/* Copy */}
        <Reveal trigger="load" stagger={0.09} className="flex flex-col items-start gap-5">
          <RevealItem>
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo/20 bg-bg px-4 py-1.5 text-sm font-semibold text-indigo shadow-card">
              <BadgeCheck className="h-4 w-4 text-orange" aria-hidden />
              {badge}
            </span>
          </RevealItem>
          <RevealItem>
            <h1 className="text-balance text-4xl font-bold leading-[1.06] tracking-tight text-ink sm:text-5xl lg:text-[3.75rem]">
              {titlePre}{' '}
              <span className="text-gradient-wordmark">{titleAccent}</span>
            </h1>
          </RevealItem>
          <RevealItem>
            <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted">{sub}</p>
          </RevealItem>
          <RevealItem className="mt-1 flex flex-wrap items-center gap-3">
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClassName('orange', 'lg', 'btn-sheen font-bold')}
            >
              {ctaWhatsapp}
            </a>
            <Link href="/products" className={buttonClassName('secondary', 'lg', 'font-bold')}>
              {ctaProducts}
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
            </Link>
          </RevealItem>
          <RevealItem className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1">
            {pills.map((pill) => (
              <span key={pill} className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-muted">
                <BadgeCheck className="h-4 w-4 text-orange" aria-hidden />
                {pill}
              </span>
            ))}
          </RevealItem>
        </Reveal>

        {/* Split visual: raw materials → finished project */}
        <Reveal trigger="load" delay={0.15}>
          <div className="relative">
            <div className="relative grid h-72 grid-cols-2 gap-1.5 overflow-hidden rounded-3xl border border-border bg-bg p-1.5 shadow-glow sm:h-96 lg:h-[30rem]">
              <div className="relative overflow-hidden rounded-2xl">
                <Image
                  src="/images/categories/plywood.jpg"
                  alt="Stacked plywood and board sheets in ready stock"
                  fill
                  priority
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
                <span className="absolute bottom-2 left-2 rounded-full bg-ink/75 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-sm">
                  {rawLabel}
                </span>
              </div>
              <div className="relative overflow-hidden rounded-2xl">
                <Image
                  src="/images/hero/plywood-slider.png"
                  alt="Finished wood-panelled interior built from premium boards"
                  fill
                  priority
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
                <span className="absolute bottom-2 right-2 rounded-full bg-orange/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-sm">
                  {finishedLabel}
                </span>
              </div>
              {/* Center arrow chip: raw → finished */}
              <span
                aria-hidden
                className="absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-border bg-bg text-indigo shadow-card"
              >
                <ArrowRight className="h-5 w-5" />
              </span>
            </div>

            {/* Floating credibility cards */}
            <div className="pointer-events-none absolute -left-3 top-6 hidden sm:block">
              <FloatCard icon={FLOAT_ICONS[0]} label={floating[0]} />
            </div>
            <div className="pointer-events-none absolute -right-3 top-1/3 hidden sm:block">
              <FloatCard icon={FLOAT_ICONS[1]} label={floating[1]} />
            </div>
            <div className="pointer-events-none absolute -left-3 bottom-10 hidden lg:block">
              <FloatCard icon={FLOAT_ICONS[2]} label={floating[2]} />
            </div>
            <div className="pointer-events-none absolute -bottom-4 right-6 hidden sm:block">
              <FloatCard icon={FLOAT_ICONS[3]} label={floating[3]} />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FloatCard({icon: Icon, label}: {icon: LucideIcon; label: string}) {
  return (
    <span className="flex items-center gap-2 rounded-xl border border-border bg-bg/95 px-3.5 py-2 text-sm font-bold text-ink shadow-card backdrop-blur-sm">
      <span className="grid h-7 w-7 place-items-center rounded-lg bg-indigo/10 text-indigo">
        <Icon className="h-4 w-4" aria-hidden />
      </span>
      {label}
    </span>
  );
}
