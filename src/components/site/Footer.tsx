import {ArrowUpRight, ChevronDown, Mail, MapPin, Phone} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {CATEGORIES, categoryHref} from '@/data/products';
import {CATEGORY_COPY} from '@/content/categories';
import {COMPANY, WA} from '@/content/site';
import {STATS} from '@/data/stats';
import {WhatsAppIcon} from '@/components/ui/Button';
import {whatsappUrl} from '@/lib/whatsapp';
import {Logo} from './Logo';

const COMPANY_LINKS = [
  {label: 'About Ananta', href: '/about' as const},
  {label: 'Brands we supply', href: '/partners' as const},
  {label: 'Décor library', href: '/decor' as const},
  {label: 'Contact', href: '/contact' as const}
];

/**
 * Restrained navy footer. Desktop: four quiet columns. Phones: the contact
 * block stays open (it IS the conversion), product/company lists collapse into
 * native <details> (no JS), so the mobile footer is short.
 * data-dock-hide: the floating contact dock steps aside here (the footer
 * carries the same contacts).
 */
export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer data-dock-hide className="bg-navy text-white/75" data-testid="site-footer">
      {/* Pre-footer conversion row */}
      <div className="border-b border-navy-line">
        <div className="shell flex flex-col gap-5 py-9 md:flex-row md:items-center md:justify-between md:py-10">
          <div>
            <p className="t-label text-orange-light">Pricing &amp; availability</p>
            <p className="mt-2 max-w-xl text-[clamp(1.25rem,1rem+1vw,1.75rem)] font-semibold leading-tight tracking-tight text-white">
              Send your material list — get price and stock on WhatsApp.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <a
              href={whatsappUrl(WA.project)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-[6px] bg-orange px-5 text-[14.5px] font-semibold text-white hover:bg-orange-deep"
            >
              <WhatsAppIcon className="h-4 w-4" /> WhatsApp the team
            </a>
            <a
              href={COMPANY.phoneHref}
              className="inline-flex min-h-11 items-center gap-2 rounded-[6px] border border-white/25 px-5 text-[14.5px] font-semibold text-white hover:border-white/60"
            >
              <Phone className="h-4 w-4" aria-hidden /> {COMPANY.phoneDisplay}
            </a>
          </div>
        </div>
      </div>

      <div className="shell grid grid-cols-1 gap-8 py-10 md:grid-cols-[1.4fr_1fr_1fr] md:gap-10 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
        <div className="flex flex-col gap-4">
          <Logo variant="dark" />
          <p className="max-w-sm text-[13.5px] leading-relaxed">
            Plywood, MDF, HDHMR, Moist Master, pre-laminated boards, flush doors and smart locks — {STATS.products} products from{' '}
            {STATS.brands} brands, supplied from Ahmedabad since {COMPANY.since}.
          </p>
          <p className="t-label text-white/50">GSTIN {COMPANY.gstin}</p>
        </div>

        <FooterGroup title="Products">
          {CATEGORIES.map((c) => (
            <li key={c.slug}>
              <Link href={categoryHref(c.slug)} className="hover:text-white">
                {CATEGORY_COPY[c.slug].name}
              </Link>
            </li>
          ))}
        </FooterGroup>

        <FooterGroup title="Company">
          {COMPANY_LINKS.map((l) => (
            <li key={l.label}>
              <Link href={l.href} className="hover:text-white">
                {l.label}
              </Link>
            </li>
          ))}
        </FooterGroup>

        <address className="flex flex-col gap-3 text-[13.5px] not-italic md:col-span-3 lg:col-span-1">
          <p className="t-label hidden text-white/50 md:block">Contact</p>
          <a href={COMPANY.phoneHref} className="inline-flex items-center gap-2.5 hover:text-white">
            <Phone className="h-4 w-4 shrink-0 text-orange-light" aria-hidden /> {COMPANY.phoneDisplay}
          </a>
          <a href={`mailto:${COMPANY.email}`} className="inline-flex items-center gap-2.5 break-all hover:text-white">
            <Mail className="h-4 w-4 shrink-0 text-orange-light" aria-hidden /> {COMPANY.email}
          </a>
          <a href={whatsappUrl(WA.default)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 hover:text-white">
            <WhatsAppIcon className="h-4 w-4 shrink-0 text-orange-light" /> WhatsApp
          </a>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(COMPANY.mapsQuery)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-start gap-2.5 leading-relaxed hover:text-white"
          >
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-orange-light" aria-hidden />
            <span>{COMPANY.addressLines.join(', ')}</span>
          </a>
        </address>
      </div>

      <div className="border-t border-navy-line">
        <div className="shell flex flex-col gap-3 py-5 text-[12.5px] text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Ananta Corporation. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms
            </Link>
            <a href={COMPANY.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-white">
              Instagram <ArrowUpRight className="h-3 w-3" aria-hidden />
            </a>
            <a href={COMPANY.facebook} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-white">
              Facebook <ArrowUpRight className="h-3 w-3" aria-hidden />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/** Collapsible on phones (native details), always open from md up. */
function FooterGroup({title, children}: {title: string; children: React.ReactNode}) {
  return (
    <>
      <details className="group border-b border-navy-line md:hidden">
        <summary className="flex min-h-12 items-center justify-between text-[15px] font-semibold text-white">
          {title}
          <ChevronDown className="h-4 w-4 transition-transform duration-200 group-open:rotate-180" aria-hidden />
        </summary>
        <ul className="flex flex-col gap-3 pb-4 text-[14px]">{children}</ul>
      </details>
      <div className="hidden md:block">
        <p className="t-label text-white/50">{title}</p>
        <ul className="mt-4 flex flex-col gap-2.5 text-[13.5px]">{children}</ul>
      </div>
    </>
  );
}
