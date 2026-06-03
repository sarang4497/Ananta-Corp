import type {LucideIcon} from 'lucide-react';
import {Check} from 'lucide-react';
import {accentChip, type Accent} from '@/components/demos/demoAccent';
import {buttonClassName} from '@/components/ui/Button';
import {whatsappUrl} from '@/lib/whatsapp';
import {cn} from '@/lib/cn';

const accentGlow: Record<Accent, string> = {
  blue: 'hover:shadow-[0_24px_60px_-24px_rgba(24,119,242,0.45)] hover:border-blue/30',
  indigo: 'hover:shadow-[0_24px_60px_-24px_rgba(79,70,229,0.45)] hover:border-indigo/30',
  orange: 'hover:shadow-[0_24px_60px_-24px_rgba(249,115,22,0.45)] hover:border-orange/30',
  green: 'hover:shadow-[0_24px_60px_-24px_rgba(34,197,94,0.45)] hover:border-green/30',
  red: 'hover:shadow-[0_24px_60px_-24px_rgba(239,68,68,0.45)] hover:border-red/30',
  brand: 'hover:shadow-[0_24px_60px_-24px_rgba(79,70,229,0.45)] hover:border-indigo/30'
};

export type ProductLabels = {
  starter: string;
  growth: string;
  enterprise: string;
  custom: string;
  cta: string;
  flagshipBadge: string;
};

/**
 * One AI-Assisted product card: icon + name, problem→solution description,
 * benefit bullets, three tier prices, and a WhatsApp "Let's Talk" CTA. The
 * flagship is visually emphasized. Server Component (no black).
 */
export function AiProductCard({
  icon: Icon,
  name,
  desc,
  benefits,
  starter,
  growth,
  accent,
  flagship = false,
  labels
}: {
  icon: LucideIcon;
  name: string;
  desc: string;
  benefits: string[];
  starter: string;
  growth: string;
  accent: Accent;
  flagship?: boolean;
  labels: ProductLabels;
}) {
  const prices = [
    {label: labels.starter, value: starter},
    {label: labels.growth, value: growth},
    {label: labels.enterprise, value: labels.custom}
  ];

  return (
    <div
      className={cn(
        'group relative flex h-full flex-col rounded-2xl bg-bg p-7 shadow-card transition-all duration-300 hover:-translate-y-1 sm:p-8',
        flagship
          ? 'border-2 border-indigo/40 shadow-glow ring-1 ring-indigo/20'
          : 'border border-border',
        accentGlow[accent]
      )}
    >
      {flagship && (
        <span className="absolute -top-3 left-6 inline-flex items-center rounded-full bg-gradient-brand px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-sm">
          {labels.flagshipBadge}
        </span>
      )}

      <div className="flex items-center justify-center gap-3.5 sm:justify-start">
        <span
          className={cn(
            'grid h-12 w-12 shrink-0 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-110',
            accentChip[accent]
          )}
        >
          <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden />
        </span>
        <h3 className="text-lg font-semibold leading-tight tracking-tight text-ink sm:text-xl">
          {name}
        </h3>
      </div>

      <p className="mt-4 text-base leading-relaxed text-muted">{desc}</p>

      <ul className="mt-5 flex flex-col gap-2.5">
        {benefits.map((b) => (
          <li key={b} className="flex items-start gap-2.5 text-[15px] leading-relaxed text-ink-soft">
            <Check className="mt-0.5 h-[18px] w-[18px] shrink-0 text-green" strokeWidth={2.4} aria-hidden />
            {b}
          </li>
        ))}
      </ul>

      <div className="mt-6 grid grid-cols-3 gap-2 border-t border-border pt-5">
        {prices.map((p) => (
          <div key={p.label} className="flex flex-col items-center text-center">
            <span className="text-[11px] font-medium uppercase tracking-wide text-muted">
              {p.label}
            </span>
            <span className="mt-1 text-base font-bold text-ink">{p.value}</span>
          </div>
        ))}
      </div>

      <a
        href={whatsappUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClassName('blue', 'md', 'mt-6 w-full font-bold')}
      >
        {labels.cta}
      </a>
    </div>
  );
}
