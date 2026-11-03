'use client';

import Image from 'next/image';
import {useState} from 'react';
import {ArrowRight, ArrowUpRight} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {NAV_APPLICATIONS, NAV_BRANDS, NAV_CATEGORIES, NAV_POSTS, NAV_TOOLS, NAV_TOTAL, type MenuId} from '@/content/nav';
import {STATS} from '@/data/stats';
import {quoteWhatsappUrl} from '@/lib/quote';
import {WhatsAppIcon} from '@/components/ui/Button';
import {cn} from '@/lib/cn';
import {BrandLogo} from './BrandLogo';
import {ToolIcon} from './ToolIcon';

/**
 * Desktop mega-panel bodies. Rendered by Header only after a panel is first
 * opened (imagery therefore loads lazily, on demand). Every count and label
 * comes from src/content/nav.ts (derived from the shared data modules).
 */
export function MegaPanel({id}: {id: MenuId}) {
  switch (id) {
    case 'products':
      return <ProductsPanel />;
    case 'brands':
      return <BrandsPanel />;
    case 'applications':
      return <ApplicationsPanel />;
    case 'tools':
      return <ToolsPanel />;
    case 'resources':
      return <ResourcesPanel />;
  }
}

const label = 't-label text-steel';
const footRow = 'mt-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-line pt-4';

function ProductsPanel() {
  const [active, setActive] = useState(NAV_CATEGORIES[0].slug);
  const cat = NAV_CATEGORIES.find((c) => c.slug === active)!;
  return (
    <div className="py-7">
      <div className="grid grid-cols-[minmax(250px,290px)_1fr] gap-8 xl:grid-cols-[300px_1fr_250px]">
        <ul className="flex flex-col" aria-label="Product categories">
          {NAV_CATEGORIES.map((c) => (
            <li key={c.slug}>
              <Link
                href={c.href}
                onPointerEnter={() => setActive(c.slug)}
                onFocus={() => setActive(c.slug)}
                data-active={active === c.slug || undefined}
                className={cn(
                  'flex min-h-12 items-center justify-between gap-3 rounded-[6px] border-l-2 px-3 py-2 text-[14.5px] transition-colors duration-150',
                  active === c.slug ? 'border-orange bg-bg-soft font-semibold text-indigo' : 'border-transparent text-ink hover:text-indigo'
                )}
              >
                <span className="min-w-0">
                  <span className="block">{c.name}</span>
                  <span className="block text-[12px] font-normal text-muted">{c.brands.join(' · ')}</span>
                </span>
                <span className="t-label tabular shrink-0 text-steel">{c.count}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Preview of the hovered / focused category */}
        <div className="grid min-w-0 grid-cols-[minmax(180px,240px)_1fr] gap-6" aria-live="polite">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[8px] bg-bg-soft">
            <Image key={cat.slug} src={cat.image} alt="" fill sizes="240px" className="panel-in object-cover" />
          </div>
          <div className="flex min-w-0 flex-col">
            <div className="flex flex-wrap items-center gap-3">
              {cat.brands.map((b) => (
                <BrandLogo key={b} brand={b} height={b === 'Action TESA' ? 28 : 20} />
              ))}
            </div>
            <p className="mt-3 text-[20px] font-semibold tracking-tight text-ink">{cat.name}</p>
            <p className="mt-1.5 text-[14px] leading-relaxed text-muted">{cat.what}</p>
            <p className="mt-3 text-[13px] leading-relaxed text-muted">
              <span className="font-semibold text-ink">Best for:</span> {cat.bestFor}
            </p>
            <p className={cn(label, 'mt-4')}>{cat.subs.length ? 'Grades' : 'Products'}</p>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {(cat.subs.length ? cat.subs : cat.top).map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="inline-flex min-h-8 items-center gap-1.5 rounded-[4px] border border-line px-2.5 py-1 text-[12.5px] text-ink hover:border-indigo/40 hover:text-indigo"
                  >
                    {l.label}
                    {l.count !== undefined && <span className="tabular text-steel">{l.count}</span>}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href={cat.href} className="arrow-nudge mt-auto inline-flex min-h-11 items-center gap-1.5 pt-4 text-[14px] font-semibold text-indigo">
              View all {cat.count} <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>

        <div className="hidden flex-col gap-1 border-l border-line pl-6 xl:flex">
          <p className={label}>Choose faster</p>
          {NAV_TOOLS.slice(0, 4).map((t) => (
            <Link key={t.slug} href={t.href} className="group flex gap-3 rounded-[6px] p-2 hover:bg-bg-soft">
              <span className="mt-0.5 text-indigo">
                <ToolIcon icon={t.icon} className="h-4 w-4" />
              </span>
              <span>
                <span className="block text-[13.5px] font-semibold text-ink group-hover:text-indigo">{t.name}</span>
                <span className="block text-[12.5px] leading-snug text-muted">{t.short}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
      <div className={footRow}>
        <Link href="/products" className="arrow-nudge inline-flex min-h-11 items-center gap-1.5 text-[14px] font-semibold text-indigo">
          View complete range ({NAV_TOTAL} products) <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13.5px]">
          <Link href="/decor" className="text-ink hover:text-indigo">
            {STATS.decors} prelam décors
          </Link>
          <a
            href={quoteWhatsappUrl({source: 'Header — products menu'})}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-semibold text-orange-ink hover:text-orange-deep"
          >
            <WhatsAppIcon className="h-4 w-4" /> Get price on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

function BrandsPanel() {
  return (
    <div className="grid grid-cols-3 gap-5 py-7">
      {NAV_BRANDS.map((b) => (
        <div key={b.brand} className="flex flex-col rounded-[8px] border border-line p-5">
          <div className="flex min-h-11 items-center">
            <BrandLogo brand={b.brand} height={b.brand === 'Action TESA' ? 36 : 24} />
          </div>
          <p className="t-label mt-3 text-orange-ink">
            {b.relation} · {b.count} products
          </p>
          <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{b.supplies}</p>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {b.categories.map((c) => (
              <li key={c.label}>
                <Link href={c.href} className="inline-flex min-h-8 items-center gap-1.5 rounded-[4px] border border-line px-2.5 py-1 text-[12.5px] text-ink hover:border-indigo/40 hover:text-indigo">
                  {c.label} <span className="tabular text-steel">{c.count}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-auto flex flex-wrap gap-x-5 gap-y-1 pt-4 text-[13.5px] font-semibold">
            <Link href={b.productsHref} className="arrow-nudge inline-flex min-h-11 items-center gap-1.5 text-indigo">
              View {b.count} products <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link href={b.href} className="inline-flex min-h-11 items-center text-ink hover:text-indigo">
              About the brand
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

function ApplicationsPanel() {
  return (
    <div className="grid grid-cols-[1fr_280px] gap-8 py-7">
      <ul className="grid grid-cols-3 gap-2 xl:grid-cols-4">
        {NAV_APPLICATIONS.map((a, i) => (
          <li key={a.key}>
            <Link href={a.href} className="group flex h-full min-h-24 flex-col rounded-[8px] border border-line p-4 transition-colors duration-150 hover:border-indigo/40 hover:bg-bg-soft">
              <span className="t-label text-steel">{String(i + 1).padStart(2, '0')}</span>
              <span className="mt-1.5 flex items-baseline justify-between gap-2">
                <span className="text-[15px] font-semibold text-ink group-hover:text-indigo">{a.label}</span>
                <span className="tabular shrink-0 text-[12.5px] text-steel">{a.count}</span>
              </span>
              <span className="mt-1 text-[12.5px] leading-snug text-muted">{a.hint}</span>
            </Link>
          </li>
        ))}
      </ul>
      <MaterialSelectorCard />
    </div>
  );
}

function MaterialSelectorCard() {
  const t = NAV_TOOLS.find((x) => x.slug === 'material-selector') ?? NAV_TOOLS[0];
  return (
    <Link href={t.href} className="group flex flex-col justify-between gap-4 rounded-[8px] bg-navy p-5 text-white">
      <span>
        <span className="t-label text-orange-light">Not sure which board?</span>
        <span className="mt-2 block text-[17px] font-semibold leading-snug">{t.name}</span>
        <span className="mt-1.5 block text-[13px] leading-relaxed text-white/70">{t.description}</span>
      </span>
      <span className="arrow-nudge inline-flex items-center gap-1.5 text-[13.5px] font-semibold">
        Open the selector <ArrowRight className="h-4 w-4" aria-hidden />
      </span>
    </Link>
  );
}

function ToolsPanel() {
  return (
    <div className="py-7">
      <ul className="grid grid-cols-3 gap-3 xl:grid-cols-5">
        {NAV_TOOLS.map((t) => (
          <li key={t.slug}>
            <Link href={t.href} className="group flex h-full flex-col gap-3 rounded-[8px] border border-line p-4 transition-colors duration-150 hover:border-indigo/40 hover:bg-bg-soft">
              <span className="grid h-10 w-10 place-items-center rounded-[6px] bg-surface-blue text-indigo">
                <ToolIcon icon={t.icon} />
              </span>
              <span className="text-[15px] font-semibold text-ink group-hover:text-indigo">{t.name}</span>
              <span className="text-[12.5px] leading-snug text-muted">{t.short}</span>
            </Link>
          </li>
        ))}
      </ul>
      <div className={footRow}>
        <Link href="/tools" className="arrow-nudge inline-flex min-h-11 items-center gap-1.5 text-[14px] font-semibold text-indigo">
          All tools <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </div>
  );
}

function ResourcesPanel() {
  const explorer = NAV_TOOLS.find((t) => t.slug === 'finish-explorer');
  return (
    <div className="grid grid-cols-[1fr_300px] gap-8 py-7">
      <div className="min-w-0">
        <p className={label}>Latest guides</p>
        {NAV_POSTS.length ? (
          <ul className="mt-3 grid grid-cols-3 gap-4">
            {NAV_POSTS.map((p) => (
              <li key={p.slug}>
                <Link href={p.href} className="group flex flex-col gap-2.5">
                  <span className="relative block aspect-[16/10] overflow-hidden rounded-[6px] bg-bg-soft">
                    <Image src={p.image} alt={p.imageAlt} fill sizes="280px" className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                  </span>
                  <span className="t-label text-orange-ink">
                    {p.category} · {p.minutes} min
                  </span>
                  <span className="text-[14.5px] font-semibold leading-snug text-ink group-hover:text-indigo">{p.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 max-w-lg text-[14px] leading-relaxed text-muted">
            Material guides for plywood, MDF, moisture-resistant boards and finishes — linked to the products they cover.
          </p>
        )}
        <div className={footRow}>
          <Link href="/blog" className="arrow-nudge inline-flex min-h-11 items-center gap-1.5 text-[14px] font-semibold text-indigo">
            All guides &amp; articles <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-2 border-l border-line pl-6">
        <p className={label}>Finishes</p>
        <Link href="/decor" className="group rounded-[6px] p-2 hover:bg-bg-soft">
          <span className="flex items-center gap-1.5 text-[14px] font-semibold text-ink group-hover:text-indigo">
            Décor library <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </span>
          <span className="text-[12.5px] text-muted">{STATS.decors} prelam finishes by code and family</span>
        </Link>
        {explorer && (
          <Link href={explorer.href} className="group rounded-[6px] p-2 hover:bg-bg-soft">
            <span className="block text-[14px] font-semibold text-ink group-hover:text-indigo">{explorer.name}</span>
            <span className="text-[12.5px] text-muted">{explorer.short}</span>
          </Link>
        )}
        <Link href="/partners" className="group rounded-[6px] p-2 hover:bg-bg-soft">
          <span className="block text-[14px] font-semibold text-ink group-hover:text-indigo">Brands we supply</span>
          <span className="text-[12.5px] text-muted">{NAV_BRANDS.map((b) => b.brand).join(" · ")}</span>
        </Link>
      </div>
    </div>
  );
}
