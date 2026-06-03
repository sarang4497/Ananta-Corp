import {Reveal, RevealItem} from '@/components/ui/Reveal';
import {OfferingDemo, type DemoId} from '@/components/demos/OfferingDemo';
import {accentChip, type Accent} from '@/components/demos/demoAccent';
import {cn} from '@/lib/cn';

/**
 * One offering: a tech eyebrow + benefit headline beside a live, autoplaying
 * demo. Layout alternates sides per row. Server Component — the demo (client +
 * lazy) is the only interactive part. Text is deliberately minimal; the demo
 * carries the message.
 */
export function OfferingRow({
  index,
  tech,
  benefit,
  accent,
  demoId,
  reversed
}: {
  index: number;
  tech: string;
  benefit: string;
  accent: Accent;
  demoId: DemoId;
  reversed: boolean;
}) {
  return (
    <Reveal stagger={0.12} className="grid items-center gap-8 md:grid-cols-2 md:gap-14">
      <RevealItem className={cn('flex flex-col items-start gap-4', reversed && 'md:order-2')}>
        <span
          className={cn(
            'inline-flex items-center gap-2 rounded-full px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-wider',
            accentChip[accent]
          )}
        >
          <span className="tabular-nums opacity-70">{String(index).padStart(2, '0')}</span>
          {tech}
        </span>
        <h3 className="text-balance text-2xl font-semibold leading-tight tracking-tight text-ink sm:text-3xl">
          {benefit}
        </h3>
      </RevealItem>

      <RevealItem className={cn('w-full', reversed && 'md:order-1')}>
        <OfferingDemo id={demoId} accent={accent} />
      </RevealItem>
    </Reveal>
  );
}
