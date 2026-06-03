import {Reveal} from '@/components/ui/Reveal';
import {Card} from '@/components/ui/Card';

/**
 * On-brand placeholder "content coming soon" note used by shell pages
 * (Pricing, Industries) until their real content lands.
 */
export function ComingSoon({heading, body}: {heading: string; body: string}) {
  return (
    <section className="shell pb-12 sm:pb-16">
      <Reveal>
        <Card className="mx-auto max-w-2xl items-center gap-3 text-center">
          <span className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-muted">
            TODO
          </span>
          <h2 className="text-xl font-semibold text-ink">{heading}</h2>
          <p className="text-sm leading-relaxed text-muted">{body}</p>
        </Card>
      </Reveal>
    </section>
  );
}
