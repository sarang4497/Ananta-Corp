import Image from 'next/image';
import {ArrowRight} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {DECORS, type DecorType} from '@/data/decors';
import {STATS, decorCountByType} from '@/data/stats';

const TYPES: {t: DecorType; l: string}[] = [
  {t: 'woodgrain', l: 'Woodgrains'},
  {t: 'solid', l: 'Solids'},
  {t: 'stone', l: 'Stone & marble'},
  {t: 'fabric', l: 'Fabric weaves'},
  {t: 'texture', l: 'Textures'}
];

// Two interleaved rows sampled across the whole library (every ~4th décor).
const ROW_A = DECORS.filter((_, i) => i % 4 === 0);
const ROW_B = DECORS.filter((_, i) => i % 4 === 2);

/**
 * 04 FINISH WALL — high-density visual moment: two slow, opposite-direction
 * rows of real Action TESA prelam swatches with their codes; pauses on
 * hover/focus, static under reduced motion. Family counts computed.
 */
export function FinishWall() {
  return (
    <section aria-labelledby="finish-title" className="overflow-hidden border-y border-line bg-white py-14 sm:py-20">
      <div className="shell grid grid-cols-1 gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <div data-reveal="up">
          <p className="t-label text-orange-ink">Pre-laminated finishes</p>
          <h2 id="finish-title" className="t-h2 mt-3 max-w-[20ch] text-ink">
            {STATS.decors} décors, searchable by code.
          </h2>
          <p className="mt-3 max-w-[52ch] text-[15px] leading-relaxed text-muted">
            Action TESA pre-laminated particle board — factory-finished on both faces, so the finish is chosen before the
            board is cut.
          </p>
        </div>
        <ul className="flex flex-wrap gap-2" data-reveal="up">
          {TYPES.map(({t, l}) => (
            <li key={t}>
              <Link
                href={{pathname: '/decor', query: {type: t}}}
                className="inline-flex min-h-10 items-center gap-2 rounded-[5px] border border-line px-3 text-[13px] font-medium text-ink hover:border-indigo/40 hover:text-indigo"
              >
                {l} <span className="t-label text-steel">{decorCountByType(t)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* data-overflow-ok: an intentional edge-to-edge ticker — partial swatches at the
          edges are by design (faded), and every décor is fully reachable at /decor. */}
      <div
        className="marquee mt-9 flex flex-col gap-2.5 [mask-image:linear-gradient(to_right,transparent,#000_6%,#000_94%,transparent)]"
        aria-label="Sample of the décor library"
        data-overflow-ok
      >
        {[ROW_A, ROW_B].map((row, r) => (
          <div key={r} className="relative overflow-hidden">
            <ul
              className="marquee-track flex w-max gap-2.5"
              style={{animationDirection: r ? 'reverse' : 'normal', animationDuration: r ? '110s' : '90s'}}
            >
              {[...row, ...row].map((d, i) => (
                <li key={`${d.code}-${i}`} aria-hidden={i >= row.length || undefined} className="w-[104px] shrink-0 sm:w-[132px]">
                  <Link href={{pathname: '/decor', query: {q: d.code}}} tabIndex={i >= row.length ? -1 : undefined} className="group block">
                    <span className="relative block aspect-[4/5] overflow-hidden rounded-[4px] bg-bg-soft">
                      <Image src={d.image} alt={`${d.code} ${d.name}`} fill sizes="132px" loading="lazy" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    </span>
                    <span className="mt-1.5 flex items-baseline gap-1.5 text-[11.5px]">
                      <span className="t-label text-ink">{d.code}</span>
                      <span className="truncate text-muted">{d.name}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="shell mt-8">
        <Link href="/decor" className="arrow-nudge inline-flex items-center gap-1.5 text-[14.5px] font-semibold text-indigo">
          Browse all {STATS.decors} décors <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </section>
  );
}
