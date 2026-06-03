import {PageHero} from '@/components/PageHero';
import {Reveal} from '@/components/ui/Reveal';

export type PolicySection = {heading: string; body: string[]};

/** Shared layout for the legal pages — readable measure, quiet styling. */
export function PolicyPage({
  eyebrow,
  title,
  updated,
  sections
}: {
  eyebrow: string;
  title: string;
  updated: string;
  sections: PolicySection[];
}) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} sub={updated} />
      <section className="shell pb-20">
        <Reveal className="mx-auto flex max-w-3xl flex-col gap-8">
          {sections.map((section) => (
            <article key={section.heading} className="flex flex-col gap-3">
              <h2 className="text-xl font-bold tracking-tight text-ink">{section.heading}</h2>
              {section.body.map((p, i) => (
                <p key={i} className="text-pretty text-[15px] leading-relaxed text-muted">
                  {p}
                </p>
              ))}
            </article>
          ))}
        </Reveal>
      </section>
    </>
  );
}
