import {PageIntro} from '@/components/catalog2/PageIntro';

export type PolicySection = {heading: string; body: string[]};

/** Legal pages — readable measure, quiet styling. */
export function PolicyPage({eyebrow, title, updated, sections}: {eyebrow: string; title: string; updated: string; sections: PolicySection[]}) {
  return (
    <>
      <PageIntro crumbs={[{label: 'Home', href: '/'}, {label: title}]} eyebrow={eyebrow} title={title} lead={updated} />
      <section className="bg-white py-10 sm:py-14">
        <div className="shell">
          <div className="flex max-w-3xl flex-col gap-8">
            {sections.map((s) => (
              <article key={s.heading} className="flex flex-col gap-3">
                <h2 className="text-[19px] font-semibold tracking-tight text-ink">{s.heading}</h2>
                {s.body.map((p, i) => (
                  <p key={i} className="text-[15px] leading-relaxed text-muted">
                    {p}
                  </p>
                ))}
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
