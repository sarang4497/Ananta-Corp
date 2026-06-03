import type {ReactNode} from 'react';
import type {LucideIcon} from 'lucide-react';
import {Reveal} from '@/components/ui/Reveal';
import {accentChip, accentText, type Accent} from '@/components/demos/demoAccent';
import {cn} from '@/lib/cn';

// Soft accent gradient panel per accent (literal class strings).
const PANEL: Record<Accent, string> = {
  blue: 'border-blue/20 from-blue/12 to-blue/4',
  indigo: 'border-indigo/20 from-indigo/12 to-indigo/4',
  orange: 'border-orange/20 from-orange/12 to-orange/4',
  green: 'border-green/20 from-green/12 to-green/4',
  red: 'border-red/20 from-red/12 to-red/4',
  brand: 'border-indigo/20 from-indigo/12 to-indigo/4'
};

export type Impact = {value?: string; label: string; chips?: string[]};

export type CaseLabels = {problem: string; did: string};

export type CaseStudyProps = {
  index: number;
  accent: Accent;
  Icon: LucideIcon;
  tag: string;
  title: string;
  tagline: string;
  problem: string;
  did: string;
  bullets?: string[];
  impact: Impact;
  labels: CaseLabels;
  jarvisCredit?: string;
  media?: ReactNode;
  layout?: 'split' | 'feature';
};

// Small rising-bars flourish so a stat reads as a diagram, not a sentence.
function MiniBars({className}: {className?: string}) {
  return (
    <svg viewBox="0 0 64 28" className={className} fill="currentColor" aria-hidden>
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={i * 16 + 2} y={24 - (i + 1) * 5} width={11} height={(i + 1) * 5} rx={2} opacity={0.5 + i * 0.16} />
      ))}
    </svg>
  );
}

function Chip({children}: {children: ReactNode}) {
  return (
    <span className="inline-flex items-center rounded-full border border-border bg-bg px-3 py-1 text-[13px] font-medium text-ink shadow-sm">
      {children}
    </span>
  );
}

function ImpactVisual({accent, Icon, impact}: {accent: Accent; Icon: LucideIcon; impact: Impact}) {
  return (
    <div
      className={cn(
        'relative h-full overflow-hidden rounded-2xl border bg-gradient-to-br p-8 shadow-card sm:p-10',
        PANEL[accent]
      )}
    >
      {/* Faint watermark icon for depth. */}
      <Icon
        className={cn('pointer-events-none absolute -right-4 -top-4 h-28 w-28 opacity-10', accentText[accent])}
        strokeWidth={1.25}
        aria-hidden
      />
      <div className="relative flex flex-col items-center gap-3 text-center sm:items-start sm:text-left">
        <span className={cn('grid h-12 w-12 place-items-center rounded-xl', accentChip[accent])}>
          <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden />
        </span>
        {impact.value ? (
          <>
            <span className={cn('text-5xl font-extrabold leading-none tracking-tight sm:text-6xl', accentText[accent])}>
              {impact.value}
            </span>
            <span className="text-[15px] font-semibold text-ink">{impact.label}</span>
            <MiniBars className={cn('mt-1 h-7 w-16', accentText[accent])} />
          </>
        ) : (
          <>
            <span className="text-xl font-bold tracking-tight text-ink sm:text-2xl">{impact.label}</span>
            {impact.chips ? (
              <div className="mt-1 flex flex-wrap justify-center gap-2 sm:justify-start">
                {impact.chips.map((c) => (
                  <Chip key={c}>{c}</Chip>
                ))}
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}

function TextBlock({
  accent,
  Icon,
  tag,
  title,
  tagline,
  problem,
  did,
  bullets,
  labels,
  jarvisCredit,
  impactHighlight,
  centered
}: {
  accent: Accent;
  Icon: LucideIcon;
  tag: string;
  title: string;
  tagline: string;
  problem: string;
  did: string;
  bullets?: string[];
  labels: CaseLabels;
  jarvisCredit?: string;
  impactHighlight?: Impact;
  centered?: boolean;
}) {
  return (
    <div className={cn('flex flex-col gap-4', centered && 'items-center text-center')}>
      <span
        className={cn(
          'inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em]',
          accentChip[accent]
        )}
      >
        <Icon className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
        {tag}
      </span>
      <h3 className="text-balance text-2xl font-semibold leading-tight tracking-tight text-ink sm:text-3xl">
        {title}
      </h3>
      <p className={cn('text-pretty text-lg font-medium leading-snug', accentText[accent])}>{tagline}</p>

      <div className={cn('flex flex-col gap-3', centered ? 'text-left' : '')}>
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-red/80">{labels.problem}</span>
          <p className="mt-0.5 text-[15px] leading-relaxed text-muted">{problem}</p>
        </div>
        <div>
          <span className={cn('text-[11px] font-bold uppercase tracking-[0.14em]', accentText[accent])}>
            {labels.did}
          </span>
          <p className="mt-0.5 text-[15px] leading-relaxed text-muted">{did}</p>
          {bullets && bullets.length ? (
            <ul className="mt-2 flex flex-col gap-1.5">
              {bullets.map((b) => (
                <li key={b} className="flex gap-2 text-[15px] leading-relaxed text-muted">
                  <span className={cn('font-bold leading-relaxed', accentText[accent])} aria-hidden>
                    •
                  </span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      {impactHighlight ? (
        <div className={cn('flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border bg-gradient-to-br px-4 py-3', PANEL[accent])}>
          {impactHighlight.value ? (
            <span className={cn('text-2xl font-extrabold tracking-tight', accentText[accent])}>
              {impactHighlight.value}
            </span>
          ) : null}
          <span className="text-sm font-semibold text-ink">{impactHighlight.label}</span>
        </div>
      ) : null}

      {jarvisCredit ? (
        <p className="text-xs font-medium italic text-muted">{jarvisCredit}</p>
      ) : null}
    </div>
  );
}

/**
 * One case study — a mini story with a visual payoff. `split` alternates text /
 * visual left-right per index for rhythm; `feature` stacks centered text above
 * a full-width media slot (for the richest featured cases). Scroll-in reveal.
 */
export function CaseStudy(props: CaseStudyProps) {
  const {index, accent, Icon, tag, title, tagline, problem, did, bullets, impact, labels, jarvisCredit, media, layout = 'split'} = props;

  if (layout === 'feature') {
    return (
      <Reveal className="flex flex-col gap-8">
        <div className="mx-auto max-w-3xl">
          <TextBlock
            accent={accent}
            Icon={Icon}
            tag={tag}
            title={title}
            tagline={tagline}
            problem={problem}
            did={did}
            bullets={bullets}
            labels={labels}
            jarvisCredit={jarvisCredit}
            impactHighlight={impact}
            centered
          />
        </div>
        {media ? <div className="w-full">{media}</div> : null}
      </Reveal>
    );
  }

  const textFirst = index % 2 === 0;
  return (
    <Reveal className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
      <div className={cn(textFirst ? 'lg:order-1' : 'lg:order-2')}>
        <TextBlock
          accent={accent}
          Icon={Icon}
          tag={tag}
          title={title}
          tagline={tagline}
          problem={problem}
          did={did}
          bullets={bullets}
          labels={labels}
          jarvisCredit={jarvisCredit}
          impactHighlight={media ? impact : undefined}
        />
      </div>
      <div className={cn('h-full', textFirst ? 'lg:order-2' : 'lg:order-1')}>
        {media ?? <ImpactVisual accent={accent} Icon={Icon} impact={impact} />}
      </div>
    </Reveal>
  );
}
