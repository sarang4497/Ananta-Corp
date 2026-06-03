import {getTranslations} from 'next-intl/server';
import {Mail, Phone, MapPin} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {PRODUCT_CATEGORIES} from './nav-menu';
import {whatsappUrl} from '@/lib/whatsapp';

const INFO_LINKS = [
  {href: '/about', key: 'about'},
  {href: '/partners', key: 'partners'},
  {href: '/contact', key: 'contact'}
] as const;

const LEGAL = [
  {href: '/privacy', key: 'legalPrivacy'},
  {href: '/terms', key: 'legalTerms'}
] as const;

const SOCIALS = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/anantacorporation1',
    icon: InstagramGlyph
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/share/1CV5X8xETv/?mibextid=wwXIfr',
    icon: FacebookGlyph
  }
] as const;

// All white text; links use a subtle opacity hover. Tight line-height.
const linkCls =
  'text-sm leading-tight text-white no-underline transition-opacity hover:opacity-75';
const headingCls =
  'mb-1 text-xs font-bold uppercase tracking-[0.18em] text-orange-light';

/**
 * Deep-indigo footer, white text, orange column headings. Dense and premium.
 * Server Component; Inter throughout.
 */
export async function Footer() {
  const tn = await getTranslations('nav');
  const tf = await getTranslations('footer');
  const year = 2026;

  return (
    <footer
      className="relative mt-12 font-[family-name:var(--font-inter)] text-white sm:mt-16"
      style={{
        backgroundImage: 'linear-gradient(115deg, #312e81 0%, #4338CA 55%, #4F46E5 100%)'
      }}
    >
      {/* Thin orange brand line along the top edge. */}
      <div
        aria-hidden
        className="h-1 w-full"
        style={{backgroundImage: 'linear-gradient(90deg, #EA580C, #F97316, #FB923C)'}}
      />
      <div className="shell py-8 sm:py-10">
        <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.5fr] [&>*]:min-w-0">
          {/* Brand */}
          <div className="flex flex-col gap-2.5">
            <Link
              href="/"
              className="inline-flex items-center gap-2 no-underline"
              aria-label="Ananta Corporation — home"
            >
              <span className="text-lg font-bold tracking-tight text-white">
                Ananta Corporation
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-snug text-white/90">{tf('descriptor')}</p>
            <p className="text-xs leading-snug text-white/75">{tf('gstin')}</p>
            <div className="mt-1 flex items-center gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-orange"
                >
                  <s.icon />
                </a>
              ))}
            </div>
          </div>

          {/* Information */}
          <div className="flex flex-col gap-2">
            <span className={headingCls}>{tf('information')}</span>
            {INFO_LINKS.map((item) => (
              <Link key={item.key} href={item.href} className={linkCls}>
                {tn(item.key)}
              </Link>
            ))}
          </div>

          {/* Products */}
          <div className="flex flex-col gap-2">
            <span className={headingCls}>{tf('products')}</span>
            {PRODUCT_CATEGORIES.map((cat) => (
              <Link key={cat.key} href={cat.href} className={linkCls}>
                {tn(cat.key)}
              </Link>
            ))}
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-2">
            <span className={headingCls}>{tf('contact')}</span>
            <span className="flex gap-2 text-sm leading-snug text-white/90">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-orange-light" aria-hidden />
              {tf('address')}
            </span>
            <a href="tel:+918320052838" className={`inline-flex items-center gap-2 ${linkCls}`}>
              <Phone className="h-4 w-4 shrink-0 text-orange-light" aria-hidden />
              +91 83200 52838
            </a>
            <a href="mailto:info@anantacorporation.com" className={`flex items-center gap-2 ${linkCls}`}>
              <Mail className="h-4 w-4 shrink-0 text-orange-light" aria-hidden />
              <span className="min-w-0 break-all">info@anantacorporation.com</span>
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
      </div>

      {/* Legal row — slim bottom strip */}
      <div className="border-t border-white/15">
        <div className="flex flex-col items-center justify-between gap-1.5 shell py-3 text-center sm:flex-row sm:text-left">
          <span className="text-[11px] leading-snug text-white/85">
            © {year} Ananta Corporation. {tf('rights')}
          </span>
          <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1" aria-label="Legal">
            {LEGAL.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="text-[11px] text-white/85 no-underline transition-opacity hover:opacity-75"
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

function InstagramGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function FacebookGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function WhatsAppGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-orange-light" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}
