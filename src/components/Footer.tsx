import Image from 'next/image';
import {getTranslations} from 'next-intl/server';
import {Mail, Phone, MapPin} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {SERVICES_MENU, INDUSTRIES_MENU} from './nav-menu';
import {FooterCol} from './FooterCol';
import {whatsappUrl} from '@/lib/whatsapp';

const LEGAL = [
  {href: '/privacy-policy', key: 'legalPrivacy'},
  {href: '/refund-policy', key: 'legalRefund'},
  {href: '/terms', key: 'legalTerms'},
  {href: '/disclaimer', key: 'legalDisclaimer'}
] as const;

// All white text; links use a subtle opacity hover. Tight line-height.
const linkCls =
  'text-sm leading-tight text-white no-underline transition-opacity hover:opacity-75';
const headingCls =
  'mb-0.5 text-xs font-bold uppercase tracking-[0.18em] text-white';

/**
 * Compact, gradient footer (matches the Next-Gen banner blue→indigo→mauve).
 * All-white, bold-headed, dense. Server Component; Inter throughout.
 */
export async function Footer() {
  const tn = await getTranslations('nav');
  const tf = await getTranslations('footer');
  const year = 2026;

  // USA first, then Italy, then India.
  const offices = [
    {label: tf('officeUsa'), address: tf('addressUsa')},
    {label: tf('officeItaly'), address: tf('addressItaly')},
    {label: tf('officeIndia'), address: tf('addressIndia')}
  ];

  return (
    <footer
      className="relative mt-12 font-[family-name:var(--font-inter)] text-white sm:mt-16"
      style={{
        backgroundImage:
          'linear-gradient(110deg, #2563EB 0%, #4F46E5 45%, #6D5BD0 70%, #B06A9E 100%)'
      }}
    >
      <div className="shell py-6 sm:py-7">
        <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2 sm:gap-y-7 lg:grid-cols-[1.6fr_1fr_1fr_1.4fr] [&>*]:min-w-0">
          {/* Brand */}
          <div className="flex flex-col gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 no-underline"
              aria-label="Studio Marketing Italia — home"
            >
              <Image src="/logo.png" alt="" width={36} height={36} className="h-9 w-auto" />
              <span className="text-base font-bold tracking-tight text-white">
                Studio Marketing Italia
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-snug text-white">{tf('descriptor')}</p>
          </div>

          {/* Services — accordion on mobile, open on desktop */}
          <FooterCol heading={tf('services')}>
            {SERVICES_MENU.map((item) => (
              <Link key={item.key} href={item.href} className={linkCls}>
                {tn(item.key)}
              </Link>
            ))}
          </FooterCol>

          {/* Industries + company links */}
          <FooterCol heading={tf('industries')}>
            {INDUSTRIES_MENU.map((item) => (
              <Link key={item.key} href={item.href} className={linkCls}>
                {tn(item.key)}
              </Link>
            ))}
            <Link href="/case-studies" className={linkCls}>{tn('caseStudies')}</Link>
            <Link href="/pricing" className={linkCls}>{tn('pricing')}</Link>
          </FooterCol>

          {/* Contact */}
          <div className="flex flex-col gap-1.5">
            <span className={headingCls}>{tf('contact')}</span>
            <a href="mailto:info@studiomarketingitalia.it" className={`flex items-center gap-2 ${linkCls}`}>
              <Mail className="h-4 w-4 shrink-0" aria-hidden />
              <span className="min-w-0 break-all">info@studiomarketingitalia.it</span>
            </a>
            <a href="tel:+393493262657" className={`inline-flex items-center gap-2 ${linkCls}`}>
              <Phone className="h-4 w-4 shrink-0" aria-hidden />
              +39 349 326 2657
            </a>
            <a href="tel:+919173474378" className={`inline-flex items-center gap-2 ${linkCls}`}>
              <Phone className="h-4 w-4 shrink-0" aria-hidden />
              +91 91734 74378
            </a>
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 ${linkCls}`}
            >
              <WhatsAppGlyph />
              {tf('whatsapp')}
            </a>
          </div>
        </div>

        {/* Offices — accordion on mobile, row on desktop */}
        <div className="mt-4 border-t border-white/20 pt-3 sm:pt-4">
          <FooterCol heading={tf('offices')}>
            <div className="grid gap-x-6 gap-y-2.5 sm:grid-cols-3">
              {offices.map((office) => (
                <div key={office.label} className="flex gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-white" aria-hidden />
                  <div className="flex flex-col">
                    <span className="text-[13px] font-bold leading-tight text-white">{office.label}</span>
                    <span className="text-xs leading-snug text-white/90">{office.address}</span>
                  </div>
                </div>
              ))}
            </div>
          </FooterCol>
        </div>
      </div>

      {/* Legal row — slim bottom strip */}
      <div className="border-t border-white/20">
        <div className="flex flex-col items-center justify-between gap-1.5 shell py-3 text-center sm:flex-row sm:text-left">
          <span className="text-[11px] leading-snug text-white">
            © {year} Studio Marketing Italia. {tf('rights')} · {tf('companyLine')}
          </span>
          <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1" aria-label="Legal">
            {LEGAL.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="text-[11px] text-white no-underline transition-opacity hover:opacity-75"
              >
                {tf(item.key)}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}

function WhatsAppGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}
