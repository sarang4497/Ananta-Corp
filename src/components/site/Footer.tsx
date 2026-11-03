import type {ReactNode} from 'react';
import {ArrowUpRight, ChevronDown, Mail, MapPin, Phone} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {COMPANY} from '@/content/site';
import {NAV_APPLICATIONS, NAV_BRANDS, NAV_CATEGORIES, NAV_COMPANY, NAV_LEGAL, NAV_TOOLS, UTILITY} from '@/content/nav';
import {NAV_POSTS} from '@/content/nav-posts';
import {STATS} from '@/data/stats';
import {quoteContactHref, quoteWhatsappUrl} from '@/lib/quote';
import {WhatsAppIcon} from '@/components/ui/Button';
import {Logo} from './Logo';

/**
 * Navy footer with the full IA. Desktop: brand + contact block, then five
 * link columns (Products with counts, Brands, Applications, Resources,
 * Company), then the legal strip. Phones: each column is a native <details>
 * accordion (no JS, links never dropped); the contact block stays open.
 * data-dock-hide: the bottom utility bar / rail steps aside here.
 */
export function Footer() {
  const year = new Date().getFullYear();
  const link = 'inline-flex min-h-8 items-center gap-2 hover:text-white';
  return (
    <footer data-dock-hide className="bg-navy text-white/75" data-testid="site-footer">
      {/* Conversion row */}
      <div className="border-b border-navy-line">
        <div className="shell flex flex-col gap-5 py-9 md:flex-row md:items-center md:justify-between md:py-11">
          <div>
            <p className="t-label text-orange-light">Pricing &amp; availability</p>
            <p className="mt-2 max-w-xl text-[clamp(1.25rem,1rem+1vw,1.75rem)] font-semibold leading-tight tracking-tight text-white">
              Send your material list — get price and availability on WhatsApp.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <a
              href={quoteWhatsappUrl({source: 'Footer'})}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-[8px] bg-orange px-5 text-[14.5px] font-semibold text-white hover:bg-orange-deep"
            >
              <WhatsAppIcon className="h-4 w-4" /> Get Price
            </a>
            <Link
              href={quoteContactHref({source: 'Footer'})}
              className="inline-flex min-h-11 items-center gap-2 rounded-[8px] border border-white/25 px-5 text-[14.5px] font-semibold text-white hover:border-white/60"
            >
              Send an enquiry
            </Link>
          </div>
        </div>
      </div>

      <div className="shell grid grid-cols-1 gap-x-10 gap-y-0 py-10 md:gap-y-10 lg:grid-cols-5 lg:py-14 xl:grid-cols-[minmax(250px,1.3fr)_repeat(5,minmax(0,1fr))]">
        <div className="flex flex-col gap-4 pb-6 lg:col-span-full lg:pb-0 xl:col-span-1">
          <Logo variant="dark" />
          <p className="max-w-sm text-[13.5px] leading-relaxed">
            {STATS.products} products in {STATS.categories} categories from {STATS.brands} brands, supplied from {COMPANY.city} since {COMPANY.since}.
          </p>
          <address className="flex flex-col gap-1.5 text-[13.5px] not-italic">
            <a href={UTILITY.phoneHref} className={link}>
              <Phone className="h-4 w-4 shrink-0 text-orange-light" aria-hidden /> {UTILITY.phoneDisplay}
            </a>
            <a href={`mailto:${UTILITY.email}`} className={`${link} break-all`}>
              <Mail className="h-4 w-4 shrink-0 text-orange-light" aria-hidden /> {UTILITY.email}
            </a>
            <a href={quoteWhatsappUrl({source: 'Footer'})} target="_blank" rel="noopener noreferrer" className={link}>
              <WhatsAppIcon className="h-4 w-4 shrink-0 text-orange-light" /> WhatsApp
            </a>
            <a href={UTILITY.mapsHref} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-start gap-2 leading-relaxed hover:text-white">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-orange-light" aria-hidden />
              <span>
                {COMPANY.addressLines.join(', ')}
                <span className="mt-0.5 flex items-center gap-1 text-[12.5px] text-white/55">
                  Open in Maps <ArrowUpRight className="h-3 w-3" aria-hidden />
                </span>
              </span>
            </a>
          </address>
          <p className="t-label text-white/50">GSTIN {COMPANY.gstin}</p>
        </div>

        <FooterGroup title="Products">
          {NAV_CATEGORIES.map((c) => (
            <li key={c.slug}>
              <Link href={c.href} className={link}>
                {c.name} <span className="tabular text-white/40">{c.count}</span>
              </Link>
            </li>
          ))}
          <li>
            <Link href="/products" className={`${link} font-semibold text-white`}>
              All {STATS.products} products
            </Link>
          </li>
        </FooterGroup>

        <FooterGroup title="Brands">
          {NAV_BRANDS.map((b) => (
            <li key={b.brand}>
              <Link href={b.href} className={link}>
                {b.brand} <span className="tabular text-white/40">{b.count}</span>
              </Link>
            </li>
          ))}
        </FooterGroup>

        <FooterGroup title="Applications">
          {NAV_APPLICATIONS.map((a) => (
            <li key={a.key}>
              <Link href={a.href} className={link}>
                {a.label}
              </Link>
            </li>
          ))}
        </FooterGroup>

        <FooterGroup title="Resources">
          <li>
            <Link href="/blog" className={link}>
              Guides &amp; articles
            </Link>
          </li>
          {NAV_POSTS.slice(0, 2).map((p) => (
            <li key={p.slug}>
              <Link href={p.href} className={link}>
                {p.title}
              </Link>
            </li>
          ))}
          {NAV_TOOLS.map((t) => (
            <li key={t.slug}>
              <Link href={t.href} className={link}>
                {t.name}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/decor" className={link}>
              Décor library <span className="tabular text-white/40">{STATS.decors}</span>
            </Link>
          </li>
        </FooterGroup>

        <FooterGroup title="Company">
          {NAV_COMPANY.map((l) => (
            <li key={l.label}>
              <Link href={l.href} className={link}>
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <a href={COMPANY.instagram} target="_blank" rel="noopener noreferrer" className={link}>
              Instagram <ArrowUpRight className="h-3 w-3" aria-hidden />
            </a>
          </li>
          <li>
            <a href={COMPANY.facebook} target="_blank" rel="noopener noreferrer" className={link}>
              Facebook <ArrowUpRight className="h-3 w-3" aria-hidden />
            </a>
          </li>
        </FooterGroup>
      </div>

      <div className="border-t border-navy-line">
        <div className="shell flex flex-col gap-3 py-5 text-[12.5px] text-white/55 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <p>
            © {year} {COMPANY.name}. All rights reserved.
          </p>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-1">
            {NAV_LEGAL.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="inline-flex min-h-8 items-center hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

/** Collapsible on phones/tablets (native details), always open from lg up. */
function FooterGroup({title, children}: {title: string; children: ReactNode}) {
  return (
    <>
      <details className="group border-b border-navy-line lg:hidden">
        <summary className="flex min-h-12 items-center justify-between text-[15px] font-semibold text-white">
          {title}
          <ChevronDown className="h-4 w-4 transition-transform duration-200 group-open:rotate-180" aria-hidden />
        </summary>
        <ul className="flex flex-col gap-1 pb-4 text-[14px]">{children}</ul>
      </details>
      <div className="hidden lg:block">
        <p className="t-label text-white/50">{title}</p>
        <ul className="mt-4 flex flex-col gap-1 text-[13.5px]">{children}</ul>
      </div>
    </>
  );
}
