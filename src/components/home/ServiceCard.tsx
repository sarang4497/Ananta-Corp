import type {ComponentProps} from 'react';
import type {LucideIcon} from 'lucide-react';
import {ArrowRight} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {accentChip, type Accent} from '@/components/demos/demoAccent';
import {cn} from '@/lib/cn';

// Accent-tinted hover glow. Literal class strings (Tailwind can't see runtime
// names), so each accent maps to a complete shadow utility.
const accentGlow: Record<Accent, string> = {
  blue: 'hover:shadow-[0_24px_60px_-24px_rgba(24,119,242,0.45)] hover:border-blue/30',
  indigo: 'hover:shadow-[0_24px_60px_-24px_rgba(79,70,229,0.45)] hover:border-indigo/30',
  orange: 'hover:shadow-[0_24px_60px_-24px_rgba(249,115,22,0.45)] hover:border-orange/30',
  green: 'hover:shadow-[0_24px_60px_-24px_rgba(34,197,94,0.45)] hover:border-green/30',
  red: 'hover:shadow-[0_24px_60px_-24px_rgba(239,68,68,0.45)] hover:border-red/30',
  brand: 'hover:shadow-[0_24px_60px_-24px_rgba(79,70,229,0.45)] hover:border-indigo/30'
};

/**
 * Clickable, accent-tinted icon card linking to a service/industry page.
 * Hover lift + glow + icon pop; design-system styled (no black).
 */
export function ServiceCard({
  icon: Icon,
  title,
  benefit,
  accent,
  href
}: {
  icon: LucideIcon;
  title: string;
  benefit: string;
  accent: Accent;
  href: ComponentProps<typeof Link>['href'];
}) {
  return (
    <Link
      href={href}
      className={cn(
        'group flex h-full flex-col items-center text-center rounded-2xl border border-border bg-bg p-6 no-underline shadow-card transition-all duration-300 hover:-translate-y-1 sm:items-start sm:p-7 sm:text-left',
        accentGlow[accent]
      )}
    >
      <span
        className={cn(
          'inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110',
          accentChip[accent]
        )}
      >
        <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden />
      </span>
      {/* Larger on mobile for readability; desktop (sm+) unchanged. */}
      <h3 className="mt-5 text-xl font-semibold tracking-tight text-ink sm:text-lg">{title}</h3>
      <p className="mt-2 flex-1 text-pretty text-base leading-relaxed text-muted">
        {benefit}
      </p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        Learn more
        <ArrowRight className="h-4 w-4" aria-hidden />
      </span>
    </Link>
  );
}
