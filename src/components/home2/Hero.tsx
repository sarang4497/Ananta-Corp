import Image from 'next/image';
import {ArrowRight} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {HERO, WA} from '@/content/site';
import {CATEGORY_COPY} from '@/content/categories';
import {CATEGORIES} from '@/data/products';
import {DECORS} from '@/data/decors';
import {STATS} from '@/data/stats';
import {BrandLogo} from '@/components/site/BrandLogo';
import {Parallax} from '@/components/motion/Parallax';
import {WhatsAppIcon, buttonClassName} from '@/components/ui/Button';
import {whatsappUrl} from '@/lib/whatsapp';

// Five real décor swatches for the material strip (codes from the catalogue).
const STRIP = ['3009', '1104', '3018', '1142', '1103'].map((c) => DECORS.find((d) => d.code === c)!);

/**
 * 01 HERO — editorial split. Left: proof eyebrow, headline, positioning,
 * CTA pair (primary Explore / secondary WhatsApp), authorized-distributor
 * logos, category index. Right: the warm wood interior (Ananta's own render)
 * revealed by a navy wipe, with layered material plates (real décor swatches,
 * the MDF edge render) carrying verified technical labels, drifting in and
 * moving with a gentle parallax.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line bg-white" aria-labelledby="hero-title">
      <div aria-hidden className="bg-grid pointer-events-none absolute inset-y-0 right-0 hidden w-[46%] opacity-70 lg:block" />
      <div className="shell relative grid grid-cols-1 items-center gap-8 pb-10 pt-8 sm:pt-12 lg:grid-cols-12 lg:gap-10 lg:pb-16 lg:pt-14">
        <div className="lg:col-span-6 xl:col-span-6">
          <p className="hero-in t-label flex items-center gap-2 text-orange-ink" style={{['--d' as string]: '0ms'}}>
            <span className="inline-block h-px w-6 bg-orange" aria-hidden />
            {HERO.eyebrow}
          </p>
          <h1 id="hero-title" className="hero-in t-display mt-4 max-w-[17ch] text-ink" style={{['--d' as string]: '80ms'}}>
            {HERO.title}
          </h1>
          <p className="hero-in t-lead mt-5 max-w-[56ch] text-muted" style={{['--d' as string]: '160ms'}}>
            {HERO.sub} <span className="hidden sm:inline">{HERO.audience}</span>
          </p>
          <div className="hero-in mt-7 flex flex-wrap items-center gap-3" style={{['--d' as string]: '240ms'}}>
            <Link href="/products" className={buttonClassName('primary', 'lg', 'arrow-nudge')}>
              {HERO.ctaPrimary} <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <a href={whatsappUrl(WA.default)} target="_blank" rel="noopener noreferrer" className={buttonClassName('green', 'lg', 'max-sm:hidden')}>
              <WhatsAppIcon className="h-4 w-4 text-wa" /> {HERO.ctaSecondary}
            </a>
          </div>

          {/* Partner logos — official assets, never text pills (A1 first-party wording). */}
          <div className="hero-in mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line pt-5" style={{['--d' as string]: '320ms'}}>
            <span className="t-label text-steel">{HERO.partnerLabel}</span>
            <div className="flex items-center gap-6">
              <BrandLogo brand="Duroply" height={24} />
              <span className="h-6 w-px bg-line" aria-hidden />
              <BrandLogo brand="Action TESA" height={34} />
            </div>
          </div>
        </div>

        {/* Visual composition */}
        <div className="relative lg:col-span-6">
          <div className="hero-wipe relative aspect-[4/3] overflow-hidden rounded-[10px] bg-bg-warm sm:aspect-[16/10] lg:aspect-[5/4.6]">
            <Image
              src="/images/scenes/living-wood.webp"
              alt="Wood-panelled living room interior with a fluted feature wall and built-in media unit"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-[62%_50%]"
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy/55 via-transparent to-transparent" />
            <p className="t-label absolute bottom-3 left-3 rounded-[3px] bg-white/90 px-2 py-1 text-ink sm:bottom-4 sm:left-4">
              Plywood · MDF · Prelam · Doors
            </p>
          </div>

          {/* Plate 1: real décor swatch strip */}
          <Parallax depth={18} className="absolute -bottom-5 right-3 hidden w-[58%] sm:block lg:-left-10 lg:right-auto lg:w-[64%]">
            <div className="hero-layer rounded-[8px] border border-line bg-white p-2.5 shadow-lift" style={{['--d' as string]: '650ms'}}>
              <div className="grid grid-cols-5 gap-1.5">
                {STRIP.map((d) => (
                  <div key={d.code} className="relative aspect-[3/4] overflow-hidden rounded-[3px] bg-bg-soft">
                    <Image src={d.image} alt={`${d.code} ${d.name} décor`} fill sizes="80px" className="object-cover" />
                  </div>
                ))}
              </div>
              <div className="mt-2 flex items-center justify-between gap-2 px-0.5">
                <span className="t-label text-ink">Prelam décors</span>
                <span className="t-label text-orange-ink">{STATS.decors} in library</span>
              </div>
            </div>
          </Parallax>

          {/* Plate 2: technical label card (verified, product-level) */}
          <Parallax depth={28} className="absolute -top-4 right-4 hidden w-[200px] lg:block xl:-right-4">
            <div className="hero-layer rounded-[8px] border border-line bg-white p-3 shadow-lift" style={{['--d' as string]: '820ms'}}>
              <div className="relative aspect-[16/9] overflow-hidden rounded-[4px] bg-bg-soft">
                <Image src="/images/materials/mdf.webp" alt="" fill sizes="200px" className="object-cover" />
              </div>
              <p className="mt-2 text-[12.5px] font-semibold text-ink">Action TESA HDHMR</p>
              <p className="t-label text-muted">Density &gt; 850 kg/m³</p>
            </div>
          </Parallax>
        </div>
      </div>

      {/* Category index — scrolls on phones, fits on desktop */}
      <nav aria-label="Product categories" className="border-t border-line bg-white">
        <ul className="shell rail gap-0 lg:grid lg:grid-cols-6">
          {CATEGORIES.map((c, i) => (
            <li key={c.slug} className="border-line lg:border-r lg:last:border-r-0">
              <Link
                href={{pathname: '/products/[category]', params: {category: c.slug}}}
                className="group flex h-14 items-center gap-3 pr-6 text-[14px] font-medium text-ink hover:text-indigo lg:px-4"
              >
                <span className="t-label text-steel group-hover:text-orange-ink">0{i + 1}</span>
                <span className="whitespace-nowrap">{CATEGORY_COPY[c.slug].short}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
