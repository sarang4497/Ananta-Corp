import {TESTIMONIALS} from '@/content/site';
import {SECTION} from './ui';

const initials = (n: string) =>
  n
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join('');

/**
 * 14 TESTIMONIALS — one hero quote + a horizontal rail of the others.
 * Verbatim A1 text; name + role only (no stars, photos or locations added).
 */
export function Voices({exclude, tone = 'white'}: {exclude?: string; tone?: 'white' | 'warm'}) {
  const list = TESTIMONIALS.filter((t) => t.name !== exclude);
  const [lead, ...rest] = list;
  return (
    <section aria-labelledby="voices-title" className={`${SECTION} ${tone === 'warm' ? 'bg-bg-warm' : 'bg-white'}`}>
      <div className="shell">
        <p className="t-label flex items-center gap-2 text-orange-ink" data-reveal="up">
          <span aria-hidden className="inline-block h-px w-6 bg-orange" data-reveal="line" />
          From the people who build with it
        </p>
        <h2 id="voices-title" className="sr-only">
          Customer feedback
        </h2>
        <figure className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6" data-reveal="up">
          <span aria-hidden className="font-serif text-[88px] leading-[0.6] text-orange lg:col-span-1">
            “
          </span>
          <div className="lg:col-span-10">
            <blockquote className="text-balance text-[clamp(1.35rem,1rem+1.5vw,2.25rem)] font-medium leading-[1.28] tracking-[-0.02em] text-ink">{lead.quote}</blockquote>
            <figcaption className="mt-5 flex items-center gap-3">
              <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-navy text-[13px] font-semibold text-white">
                {initials(lead.name)}
              </span>
              <span>
                <span className="block text-[14.5px] font-semibold text-ink">{lead.name}</span>
                <span className="block text-[13px] text-muted">{lead.role}</span>
              </span>
            </figcaption>
          </div>
        </figure>

        <ul className="rail -mx-[var(--side)] mt-10 gap-3 px-[var(--side)] pb-2" aria-label="More customer feedback" tabIndex={0}>
          {rest.map((t, i) => (
            <li key={t.name} className="flex w-[80vw] max-w-[360px] shrink-0 snap-start flex-col justify-between gap-5 rounded-[10px] border border-line bg-white p-5" data-reveal="up" style={{['--d' as string]: `${i * 70}ms`}}>
              <blockquote className="text-[14.5px] leading-relaxed text-ink">“{t.quote}”</blockquote>
              <p className="flex items-center gap-2.5">
                <span aria-hidden className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-surface-blue text-[11.5px] font-semibold text-indigo">
                  {initials(t.name)}
                </span>
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
