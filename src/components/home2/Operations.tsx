import Image from 'next/image';
import {COMPANY, CUSTOM_FLOW, OPERATIONS, TESTIMONIALS, WA} from '@/content/site';
import {CountUp} from '@/components/motion/CountUp';
import {WhatsAppIcon} from '@/components/ui/Button';
import {whatsappUrl} from '@/lib/whatsapp';

/** A1 "What Sets Us Apart" — first-party, tightened without changing meaning. */
const WHY = [
  {t: 'Technical expertise', b: 'Engineering-first thinking applied to detailing, material selection and long-term performance.'},
  {t: 'Design + execution support', b: 'Working with interior designers and architects to align design intent with practical execution.'},
  {t: 'Logistics network', b: 'Established supply-chain relationships for sourcing, delivery and consistent turnaround.'}
];

/**
 * 07/08 WHY ANANTA + READY STOCK — image-led proof: the facility figure (A1),
 * a material-stack collage (Ananta's own renders — no invented warehouse
 * photos), the stock → dispatch flow with a drawing line, then three A1
 * differentiators as compact rows (not six identical cards).
 */
export function Operations() {
  return (
    <section id="operations" aria-labelledby="ops-title" className="bg-white py-14 sm:py-20">
      <div className="shell grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <p className="t-label text-orange-ink" data-reveal="up">
            Ready stock · Ahmedabad
          </p>
          <h2 id="ops-title" className="t-h2 mt-3 text-ink" data-reveal="up">
            Material on hand, not on order.
          </h2>
          <div className="mt-7 flex items-end gap-3 border-l-2 border-orange pl-5" data-reveal="up">
            <span className="text-[clamp(2.8rem,2rem+3vw,4.4rem)] font-semibold leading-none tracking-tight text-indigo">
              <CountUp value={COMPANY.facility.replace(' sq. ft.', '')} />
            </span>
            <span className="pb-1.5 text-[14px] leading-tight text-muted">
              sq. ft. of warehouse
              <br /> and workshop space
            </span>
          </div>

          <div className="mt-8 grid grid-cols-6 grid-rows-2 gap-2" aria-hidden>
            <div className="relative col-span-4 row-span-2 aspect-[4/5] overflow-hidden rounded-[6px] bg-bg-soft" data-reveal="mask">
              <Image src="/images/materials/plywood.webp" alt="" fill sizes="(max-width:1024px) 60vw, 25vw" className="object-cover" />
            </div>
            <div className="relative col-span-2 overflow-hidden rounded-[6px] bg-bg-soft" data-reveal="mask" style={{['--d' as string]: '120ms'}}>
              <Image src="/images/materials/prelam.webp" alt="" fill sizes="20vw" className="object-cover" />
            </div>
            <div className="relative col-span-2 overflow-hidden rounded-[6px] bg-bg-soft" data-reveal="mask" style={{['--d' as string]: '240ms'}}>
              <Image src="/images/materials/hmr.webp" alt="" fill sizes="20vw" className="object-cover" />
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 lg:pt-12">
          <ol className="relative grid grid-cols-1 gap-0 sm:grid-cols-2 lg:grid-cols-4">
            <span aria-hidden className="absolute left-0 right-0 top-[15px] hidden h-px bg-line lg:block" />
            <span aria-hidden data-reveal="line" className="absolute left-0 right-0 top-[15px] hidden h-px bg-orange lg:block" style={{['--d' as string]: '200ms', transitionDuration: '1400ms'}} />
            {OPERATIONS.map((s, i) => (
              <li key={s.k} className="relative border-l border-line py-4 pl-5 lg:border-l-0 lg:pl-0 lg:pr-5 lg:pt-0" data-reveal="up" style={{['--d' as string]: `${200 + i * 160}ms`}}>
                <span className="relative z-10 grid h-[31px] w-[31px] place-items-center rounded-full border border-line bg-white font-mono text-[11px] text-indigo">{s.k}</span>
                <p className="mt-3 text-[15.5px] font-semibold text-ink">{s.title}</p>
                <p className="mt-1 text-[13.5px] leading-relaxed text-muted">{s.body}</p>
              </li>
            ))}
          </ol>

          <dl className="mt-10 divide-y divide-line border-y border-line">
            {WHY.map((w, i) => (
              <div key={w.t} className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-[220px_1fr] sm:gap-6" data-reveal="up" style={{['--d' as string]: `${i * 80}ms`}}>
                <dt className="text-[15px] font-semibold text-ink">{w.t}</dt>
                <dd className="text-[14px] leading-relaxed text-muted">{w.b}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

/**
 * CUSTOM FURNITURE / MADE-TO-DRAWING — A1 "End-to-end: Material Supply +
 * Custom Furniture" and "Custom Sizes & Designs". CNC is only cited inside
 * the customer's own words (NEEDS OWNER CONFIRMATION as a capability claim).
 */
export function CustomFurniture() {
  const quote = TESTIMONIALS.find((t) => t.name === 'Ketanbhai Shah')!;
  return (
    <section id="custom" aria-labelledby="custom-title" className="relative overflow-hidden bg-surface-blue py-14 sm:py-20">
      <div className="shell grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-5" data-reveal="up">
          <p className="t-label text-orange-ink">Material supply + custom furniture</p>
          <h2 id="custom-title" className="t-h2 mt-3 text-ink">
            From your drawing to finished articles.
          </h2>
          <p className="mt-4 max-w-[46ch] text-[15px] leading-relaxed text-muted">
            Beyond sheet supply, Ananta takes on custom sizes, custom designs and furniture made to drawings — using the
            same boards you specify.
          </p>
          <a
            href={whatsappUrl(WA.custom)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-[6px] bg-indigo px-5 text-[14.5px] font-semibold text-white hover:bg-blue"
          >
            <WhatsAppIcon className="h-4 w-4" /> Discuss a custom job
          </a>
        </div>
        <div className="lg:col-span-7">
          <ol className="grid grid-cols-1 gap-2 sm:grid-cols-5">
            {CUSTOM_FLOW.map((s, i) => (
              <li key={s} className="flex items-center gap-3 rounded-[6px] border border-indigo/15 bg-white px-4 py-3 sm:flex-col sm:items-start sm:gap-6 sm:py-4" data-reveal="up" style={{['--d' as string]: `${i * 110}ms`}}>
                <span className="font-mono text-[11px] text-orange-ink">0{i + 1}</span>
                <span className="text-[14px] font-semibold leading-tight text-ink">{s}</span>
              </li>
            ))}
          </ol>
          <figure className="mt-6 border-l-2 border-indigo pl-5" data-reveal="up">
            <blockquote className="text-[15.5px] leading-relaxed text-ink">“{quote.quote}”</blockquote>
            <figcaption className="mt-2 text-[13px] text-muted">
              {quote.name} · {quote.role}
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
