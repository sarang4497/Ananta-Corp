import {TESTIMONIALS} from '@/content/site';

const initials = (n: string) =>
  n
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join('');

/**
 * 09 CUSTOMER PROOF — editorial: one large quote + a swipeable rail of the
 * others. Verbatim A1 text, names and roles only (no stars, no photos, no
 * "Google review" styling, no invented locations/projects).
 */
export function Voices({exclude}: {exclude?: string}) {
  const list = TESTIMONIALS.filter((t) => t.name !== exclude);
  const [lead, ...rest] = list;
  return (
    <section aria-labelledby="voices-title" className="bg-white py-14 sm:py-20">
      <div className="shell">
        <p className="t-label text-orange-ink" data-reveal="up">
          From the people who build with it
        </p>
        <h2 id="voices-title" className="sr-only">
          Customer feedback
        </h2>
        <figure className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12" data-reveal="up">
          <span aria-hidden className="font-serif text-[88px] leading-[0.6] text-orange lg:col-span-1">
            “
          </span>
          <div className="lg:col-span-10">
            <blockquote className="text-[clamp(1.35rem,1rem+1.5vw,2.25rem)] font-medium leading-[1.25] tracking-[-0.02em] text-ink">
              {lead.quote}
            </blockquote>
            <figcaption className="mt-5 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-navy text-[13px] font-semibold text-white">{initials(lead.name)}</span>
              <span>
                <span className="block text-[14.5px] font-semibold text-ink">{lead.name}</span>
                <span className="block text-[13px] text-muted">{lead.role}</span>
              </span>
            </figcaption>
          </div>
        </figure>

        <ul className="rail -mx-[var(--side)] mt-10 gap-3 px-[var(--side)] pb-2 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-4 lg:overflow-visible lg:px-0" aria-label="More customer feedback">
          {rest.map((t, i) => (
            <li key={t.name} className="flex w-[80vw] max-w-[340px] flex-col justify-between gap-5 border-t-2 border-line pt-5 lg:w-auto lg:max-w-none" data-reveal="up" style={{['--d' as string]: `${i * 70}ms`}}>
              <blockquote className="text-[14.5px] leading-relaxed text-ink">“{t.quote}”</blockquote>
              <p className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-surface-blue text-[11.5px] font-semibold text-indigo">{initials(t.name)}</span>
                <span className="text-[13px]">
                  <span className="font-semibold text-ink">{t.name}</span>
                  <span className="text-muted"> · {t.role}</span>
                </span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
