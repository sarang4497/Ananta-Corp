import {Reveal, RevealItem} from '@/components/ui/Reveal';
import {Card} from '@/components/ui/Card';
import {SectionHeading} from '@/components/ui/SectionHeading';

type Block = {title: string; body: string};

// One palette accent per block, in order.
const ACCENTS = ['blue', 'indigo', 'orange', 'green', 'red'] as const;

/**
 * Shared placeholder content section for the nav landing pages: a section
 * heading plus a responsive grid of 2–3 TODO blocks. Design-system styling,
 * reused so every nav page looks intentional rather than empty.
 */
export function PlaceholderSection({
  eyebrow,
  heading,
  blocks
}: {
  eyebrow: string;
  heading: string;
  blocks: Block[];
}) {
  return (
    <section className="shell py-16 sm:py-24">
      <Reveal>
        <SectionHeading eyebrow={eyebrow} title={heading} />
      </Reveal>
      <Reveal stagger={0.08} className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {blocks.map((block, i) => (
          <RevealItem key={block.title}>
            <Card accent={ACCENTS[i % ACCENTS.length]} className="h-full gap-3">
              <span className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-muted">
                TODO
              </span>
              <h3 className="text-lg font-semibold text-ink">{block.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{block.body}</p>
            </Card>
          </RevealItem>
        ))}
      </Reveal>
    </section>
  );
}
