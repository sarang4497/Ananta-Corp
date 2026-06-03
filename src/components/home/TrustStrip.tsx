import {CalendarDays, Warehouse, ShieldCheck, BadgeCheck, Cog, Truck, type LucideIcon} from 'lucide-react';
import {Reveal, RevealItem} from '@/components/ui/Reveal';

const ICONS: LucideIcon[] = [CalendarDays, Warehouse, ShieldCheck, BadgeCheck, Cog, Truck];

/**
 * Slim credibility band directly under the hero — compact badges
 * (since-2020, warehouse, IS standards, CARB, German technology, delivery).
 */
export function TrustStrip({items}: {items: string[]}) {
  return (
    <section className="border-y border-border bg-bg-soft">
      <Reveal
        stagger={0.06}
        className="shell flex flex-wrap items-center justify-center gap-x-8 gap-y-3 py-4 sm:py-5"
      >
        {items.map((label, i) => {
          const Icon = ICONS[i % ICONS.length];
          return (
            <RevealItem key={label} y={10} className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-indigo/8 text-indigo">
                <Icon className="h-4 w-4" aria-hidden />
              </span>
              <span className="whitespace-nowrap text-sm font-semibold text-ink">{label}</span>
            </RevealItem>
          );
        })}
      </Reveal>
    </section>
  );
}
