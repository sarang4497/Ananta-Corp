import {WHY_PROOF} from '@/content/home';
import {SECTION, SectionHead} from './ui';

/**
 * 11 WHY ANANTA — proof, not adjectives: computed catalogue breadth, brand
 * relationships as stated, manufacturer-named standards, GST registration
 * and the warehouse location. No generic Quality/Service/Trust trio.
 */
export function WhyAnanta() {
  return (
    <section aria-labelledby="why-title" className={`${SECTION} relative bg-navy text-white`}>
      <div aria-hidden className="bg-grid-dark pointer-events-none absolute inset-0 opacity-50" />
      <div className="shell relative">
        <SectionHead dark id="why-title" eyebrow="Why Ananta" title="Proof you can check on this site." />
        <dl className="mt-10 grid grid-cols-1 gap-px border border-navy-line bg-navy-line sm:grid-cols-2 lg:grid-cols-3">
          {WHY_PROOF.map((w, i) => (
            <div key={w.t} className="flex flex-col gap-2 bg-navy p-6 sm:p-7" data-reveal="up" style={{['--d' as string]: `${(i % 3) * 90}ms`}}>
              <dt className="order-2 mt-2 text-[16px] font-semibold leading-snug">{w.t}</dt>
              <dd className="order-1 text-[clamp(2rem,1.5rem+1.6vw,2.8rem)] font-semibold leading-none tracking-tight text-orange-light">{w.k}</dd>
              <dd className="order-3 text-[14px] leading-relaxed text-white/70">{w.b}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
