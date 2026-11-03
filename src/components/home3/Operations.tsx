import Image from 'next/image';
import {ArrowUpRight} from 'lucide-react';
import {COMPANY, MAPS_URL, CUSTOM_FLOW, OPERATIONS, TESTIMONIALS, WA} from '@/content/site';
import {CountUp} from '@/components/motion/CountUp';
import {WhatsAppIcon} from '@/components/ui/Button';
import {whatsappUrl} from '@/lib/whatsapp';
import {SECTION, SectionHead, cta} from './ui';

const mapsUrl = MAPS_URL;

/**
 * 10 READY STOCK / OPERATIONS — image-led. Only A1 wording: the facility
 * figure, the four OPERATIONS steps and the warehouse address. Material
 * collage uses Ananta's own renders (no invented warehouse photos).
 */
export function Operations() {
  return (
    <section id="operations" aria-labelledby="ops-title" className={`${SECTION} bg-white`}>
      <div className="shell grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <div className="grid grid-cols-6 grid-rows-2 gap-2" aria-hidden>
            <div className="relative col-span-4 row-span-2 aspect-[4/5] overflow-hidden rounded-[8px] bg-bg-soft" data-reveal="image">
              <Image src="/images/materials/plywood.webp" alt="" fill sizes="(max-width:1024px) 60vw, 25vw" className="object-cover" />
            </div>
            <div className="relative col-span-2 overflow-hidden rounded-[8px] bg-bg-soft" data-reveal="image" style={{['--d' as string]: '120ms'}}>
              <Image src="/images/materials/prelam.webp" alt="" fill sizes="20vw" className="object-cover" />
            </div>
            <div className="relative col-span-2 overflow-hidden rounded-[8px] bg-bg-soft" data-reveal="image" style={{['--d' as string]: '240ms'}}>
              <Image src="/images/materials/hmr.webp" alt="" fill sizes="20vw" className="object-cover" />
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <SectionHead id="ops-title" eyebrow="Ready stock · Ahmedabad" title="Material on hand, not on order." />
          <div className="mt-7 flex flex-wrap items-end gap-x-4 gap-y-2 border-l-2 border-orange pl-5" data-reveal="up">
            <span className="text-[clamp(2.8rem,2rem+3vw,4.4rem)] font-semibold leading-none tracking-tight text-indigo">
              <CountUp value={COMPANY.facility.replace(' sq. ft.', '')} />
            </span>
            <span className="pb-1.5 text-[14px] leading-snug text-muted">sq. ft. of warehouse and workshop space</span>
          </div>

          <ol className="relative mt-10 grid grid-cols-1 gap-x-5 min-[480px]:grid-cols-2 lg:grid-cols-4">
            <span aria-hidden className="absolute left-0 right-0 top-4 hidden h-px bg-line lg:block" />
            <span aria-hidden data-reveal="line" className="absolute left-0 right-0 top-4 hidden h-px bg-orange lg:block" style={{['--d' as string]: '200ms', transitionDuration: '1400ms'}} />
            {OPERATIONS.map((s, i) => (
              <li key={s.k} className="relative border-l border-line py-4 pl-5 lg:border-l-0 lg:pl-0 lg:pr-4 lg:pt-0" data-reveal="up" style={{['--d' as string]: `${200 + i * 160}ms`}}>
                <span className="relative z-10 inline-grid min-h-8 min-w-8 place-items-center rounded-full border border-line bg-white px-1 font-mono text-[11px] text-indigo">{s.k}</span>
                <p className="mt-3 text-[15.5px] font-semibold text-ink">{s.title}</p>
                <p className="mt-1 text-[13.5px] leading-relaxed text-muted">{s.body}</p>
              </li>
            ))}
          </ol>

          <div className="mt-8 flex flex-col gap-4 rounded-[10px] bg-bg-soft p-5 sm:flex-row sm:items-center sm:justify-between" data-reveal="up">
            <address className="text-[14px] not-italic leading-relaxed text-ink">
              {COMPANY.addressLines.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
            </address>
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className={cta('outline')}>
              Open in Google Maps <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden />
            </a>
          </div>
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
    <section id="custom" aria-labelledby="custom-title" className={`${SECTION} bg-surface-blue`}>
      <div className="shell grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-5">
          <SectionHead
            id="custom-title"
            eyebrow="Material supply + custom furniture"
            title="From your drawing to finished articles."
            lead="Beyond sheet supply, Ananta takes on custom sizes, custom designs and furniture made to drawings — using the same boards you specify."
          />
          <a href={whatsappUrl(WA.custom)} target="_blank" rel="noopener noreferrer" className={cta('primary', 'mt-6')}>
            <WhatsAppIcon className="h-4 w-4 shrink-0" /> Discuss a custom job
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
