import {CountUp} from '@/components/motion/CountUp';
import {COMPANY} from '@/content/site';
import {STATS} from '@/data/stats';

/**
 * 02 TRUST / MATERIAL CAPABILITY — a technical index row. Every figure is
 * COMPUTED from the catalogue data or a first-party A1 statement (facility
 * size, start year). No certification-looking badges.
 */
export function RangeIndex() {
  const items = [
    {v: String(STATS.products), l: 'Products listed', s: 'Across the full catalogue'},
    {v: String(STATS.categories), l: 'Material categories', s: 'Plywood to smart locks'},
    {v: String(STATS.decors), l: 'Prelam décors', s: 'Searchable by code'},
    {v: String(STATS.brands), l: 'Brands', s: 'Duroply · Action TESA · Tenon'},
    {v: COMPANY.facility.replace(' sq. ft.', ''), l: 'Sq. ft. warehouse & workshop', s: 'Ahmedabad'},
    {v: COMPANY.since, l: 'Supplying since', s: 'Pirana Road, Piplaj'}
  ];
  return (
    <section aria-label="Range at a glance" className="bg-white">
      <div className="shell">
        <dl className="grid grid-cols-2 gap-px border-b border-line bg-line sm:grid-cols-3 lg:grid-cols-6">
          {items.map((it, i) => (
            <div
              key={it.l}
              data-reveal="up"
              style={{['--d' as string]: `${i * 60}ms`}}
              className="flex flex-col gap-1 bg-white px-3 py-6 sm:px-5"
            >
              <dt className="order-2 text-[13px] font-medium leading-snug text-ink">{it.l}</dt>
              <dd className="order-1 text-[clamp(1.9rem,1.4rem+1.6vw,2.6rem)] font-semibold leading-none tracking-tight text-indigo">
                <CountUp value={it.v} />
              </dd>
              <dd className="order-3 t-label text-steel">{it.s}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
