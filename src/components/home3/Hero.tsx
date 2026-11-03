import Image from 'next/image';
import {ArrowRight} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {BRAND_ASSETS} from '@/content/site';
import {DEPTH, HOME_HERO} from '@/content/home';
import {BrandLogo} from '@/components/site/BrandLogo';
import {Parallax} from '@/components/motion/Parallax';
import {WhatsAppIcon} from '@/components/ui/Button';
import {quoteWhatsappUrl} from '@/lib/quote';
import {cta} from './ui';

const at = (ms: number) => ({['--d' as string]: `${ms}ms`}) as React.CSSProperties;

/*
 * Hero choreography — CSS only (plays before hydration), gated by html.js
 * (set by the inline head script) so no-JS visitors get static content, and
 * switched off under prefers-reduced-motion. Lines rise from a clip-path mask
 * (no overflow-hidden around text); the photo is painted from frame one
 * (LCP-safe) while a navy curtain lifts off it and the image settles.
 */
const CSS = `
.js .h3-line{display:block;animation:h3-mask 1000ms cubic-bezier(.22,1,.36,1) both;animation-delay:var(--d,0ms)}
.js .h3-line>span{display:block;animation:h3-up 1000ms cubic-bezier(.22,1,.36,1) both;animation-delay:var(--d,0ms)}
.js .h3-rise{animation:h3-rise 700ms cubic-bezier(.22,1,.36,1) both;animation-delay:var(--d,0ms)}
.h3-curtain{transform:scaleY(0);transform-origin:top}
.js .h3-curtain{animation:h3-curtain 1100ms cubic-bezier(.76,0,.24,1) 250ms both}
.js .h3-settle{animation:h3-settle 2200ms cubic-bezier(.22,1,.36,1) both}
@keyframes h3-mask{from{clip-path:inset(0 0 0 0)}to{clip-path:inset(-40% -10% -40% -10%)}}
@keyframes h3-up{from{transform:translate3d(0,105%,0)}to{transform:none}}
@keyframes h3-rise{from{opacity:0;transform:translate3d(0,12px,0)}to{opacity:1;transform:none}}
@keyframes h3-curtain{from{transform:scaleY(1)}to{transform:scaleY(0)}}
@keyframes h3-settle{from{transform:scale(1.12)}to{transform:none}}
@media (prefers-reduced-motion:reduce){.js .h3-line,.js .h3-line>span,.js .h3-rise,.js .h3-curtain,.js .h3-settle{animation:none}}
`;

/**
 * 02 PREMIUM HERO — strong headline over a large interior photograph,
 * positioning, Explore + WhatsApp CTAs, real brand logos and computed
 * material-depth figures. No carousel, no badge clutter.
 */
export function Hero() {
  return (
    <section className="relative border-b border-line bg-white" aria-labelledby="hero-title">
      <style>{CSS}</style>
      <div className="shell grid grid-cols-1 items-center gap-8 pb-10 pt-8 sm:pt-12 lg:grid-cols-12 lg:gap-12 lg:pb-16 lg:pt-14">
        <div className="min-w-0 lg:col-span-7">
          <p className="h3-rise t-label flex items-center gap-2 text-orange-ink" style={at(0)}>
            <span className="inline-block h-px w-6 bg-orange" aria-hidden />
            {HOME_HERO.eyebrow}
          </p>
          <h1 id="hero-title" className="mt-4 text-[clamp(2.05rem,1.3rem+2.8vw,3.6rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-ink">
            {HOME_HERO.lines.map((l, i) => (
              <span key={l} className="h3-line pb-[0.06em]" style={at(120 + i * 140)}>
                <span>
                  {l}
                  {i < HOME_HERO.lines.length - 1 ? ' ' : ''}
                </span>
              </span>
            ))}
          </h1>
          <p className="h3-rise t-lead mt-5 max-w-[54ch] text-muted" style={at(420)}>
            {HOME_HERO.sub} {HOME_HERO.audience}
          </p>
          <div className="h3-rise mt-7 flex flex-col gap-3 min-[420px]:flex-row min-[420px]:flex-wrap" style={at(540)}>
            <Link href="/products" className={cta('primary', 'arrow-nudge')}>
              {HOME_HERO.ctaPrimary} <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
            </Link>
            <a href={quoteWhatsappUrl({source: 'Home hero'})} target="_blank" rel="noopener noreferrer" className={cta('wa')} data-testid="hero-whatsapp">
              <WhatsAppIcon className="h-4 w-4 shrink-0 text-wa" /> {HOME_HERO.ctaSecondary}
            </a>
          </div>

          <div className="h3-rise mt-8 grid grid-cols-1 gap-4 border-t border-line pt-5 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-6" style={at(640)}>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <span className="t-label w-full text-steel min-[480px]:w-auto">{BRAND_ASSETS.Duroply.relation}</span>
              <BrandLogo brand="Duroply" height={24} />
              <BrandLogo brand="Action TESA" height={34} />
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 sm:border-l sm:border-line sm:pl-6">
              <span className="t-label text-steel">{BRAND_ASSETS['Tenon Smart Lock'].relation}</span>
              <BrandLogo brand="Tenon Smart Lock" height={18} />
            </div>
          </div>

          <dl className="h3-rise mt-6 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-4" style={at(740)}>
            {DEPTH.map((d) => (
              <div key={d.l} className="flex flex-col gap-1 bg-white px-3.5 py-3">
                <dt className="order-2 text-[12.5px] leading-snug text-muted">{d.l}</dt>
                <dd className="order-1 text-[clamp(1.35rem,1.1rem+0.9vw,1.75rem)] font-semibold leading-none tracking-tight text-indigo tabular-nums">{d.v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative min-w-0 lg:col-span-5">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[12px] bg-bg-warm sm:aspect-[16/10] lg:aspect-[4/4.4]">
            <Parallax depth={24} className="absolute inset-[-24px_0]">
              <div className="h3-settle absolute inset-0">
                <Image
                  src="/images/scenes/living-wood.webp"
                  alt={HOME_HERO.imageAlt}
                  fill
                  preload
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover object-[62%_50%]"
                />
              </div>
            </Parallax>
            <div aria-hidden className="h3-curtain absolute inset-0 bg-navy" />
            <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-navy/50 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
