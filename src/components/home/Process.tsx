import {
  FileText,
  SwatchBook,
  PackageCheck,
  Warehouse,
  Cog,
  Sofa,
  ShieldCheck,
  ArrowRight,
  type LucideIcon
} from 'lucide-react';
import {Reveal, RevealItem} from '@/components/ui/Reveal';
import {SectionHeading} from '@/components/ui/SectionHeading';

export type ProcessStep = {title: string};
export type ProcessCard = {title: string; body: string};

const STEP_ICONS: LucideIcon[] = [FileText, SwatchBook, PackageCheck];
const CARD_ICONS: LucideIcon[] = [Warehouse, Cog, Sofa, ShieldCheck];

/**
 * "Raw boards → finished furniture" — a 3-step process strip followed by four
 * capability cards. Communicates that Ananta handles both supply and execution.
 */
export function Process({
  eyebrow,
  heading,
  sub,
  steps,
  cards
}: {
  eyebrow: string;
  heading: string;
  sub: string;
  steps: ProcessStep[];
  cards: ProcessCard[];
}) {
  return (
    <section id="process" className="shell pt-14 sm:pt-20">
      <Reveal>
        <SectionHeading eyebrow={eyebrow} title={heading} sub={sub} />
      </Reveal>

      {/* 3-step strip */}
      <Reveal stagger={0.08} className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 md:grid-cols-3">
        {steps.map((step, i) => {
          const Icon = STEP_ICONS[i % STEP_ICONS.length];
          return (
            <RevealItem key={step.title} className="relative h-full">
              <div className="flex h-full items-start gap-4 rounded-2xl border border-border bg-bg p-5 shadow-card">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-brand text-white">
                  <Icon className="h-6 w-6" aria-hidden />
                </span>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-mono font-bold uppercase tracking-[0.16em] text-orange-deep">
                    Step {i + 1}
                  </span>
                  <span className="text-[15px] font-bold leading-snug text-ink">{step.title}</span>
                </div>
              </div>
              {i < steps.length - 1 && (
                <span
                  aria-hidden
                  className="absolute -right-3 top-1/2 z-10 hidden h-6 w-6 -translate-y-1/2 place-items-center rounded-full border border-border bg-bg text-indigo shadow-card md:grid"
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              )}
            </RevealItem>
          );
        })}
      </Reveal>

      {/* Capability cards */}
      <Reveal
        stagger={0.07}
        className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {cards.map((card, i) => {
          const Icon = CARD_ICONS[i % CARD_ICONS.length];
          return (
            <RevealItem key={card.title} className="h-full">
              <div className="flex h-full flex-col gap-3 rounded-2xl border border-border bg-bg-soft p-6 shadow-card transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-orange/30 hover:shadow-[0_24px_60px_-24px_rgba(249,115,22,0.4)]">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-orange/10 text-orange-deep">
                  <Icon className="h-5.5 w-5.5" aria-hidden />
                </span>
                <h3 className="text-base font-bold leading-snug text-ink">{card.title}</h3>
                <p className="text-sm leading-relaxed text-muted">{card.body}</p>
              </div>
            </RevealItem>
          );
        })}
      </Reveal>
    </section>
  );
}
