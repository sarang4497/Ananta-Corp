'use client';

import type {ComponentProps} from 'react';
import {useTranslations} from 'next-intl';
import {Sparkles} from 'lucide-react';
import {Link, usePathname} from '@/i18n/navigation';
import {NavDropdown} from './NavDropdown';
import {PRODUCT_CATEGORIES, PARTNERS, CATEGORY_ICONS} from './nav-menu';
import {buttonClassName} from './ui/Button';
import {whatsappUrl} from '@/lib/whatsapp';
import {cn} from '@/lib/cn';

type Href = ComponentProps<typeof Link>['href'];

/**
 * Desktop nav row: Products (mega-menu) · Partners (dropdown) · About ·
 * Contact · orange "Get Price on WhatsApp" CTA. Client leaf so it can mark
 * the active item.
 */
export function NavLinks({className}: {className?: string}) {
  const t = useTranslations('nav');
  const pathname = usePathname();

  return (
    <div className={cn('flex items-center justify-end gap-5', className)}>
      {/* Products — mega-menu with the 6 categories + subcategories. */}
      <NavDropdown label={t('products')} wide>
        {(close) => (
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-1 lg:grid-cols-3">
              {PRODUCT_CATEGORIES.map((cat) => {
                const Icon = CATEGORY_ICONS[cat.key as keyof typeof CATEGORY_ICONS];
                return (
                  <div key={cat.key} className="flex flex-col rounded-xl p-2">
                    <Link
                      href={cat.href}
                      onClick={close}
                      className="group/cat flex items-center gap-2.5 rounded-lg px-2 py-1.5 no-underline transition-colors hover:bg-bg-soft"
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-indigo/8 text-indigo transition-colors group-hover/cat:bg-orange/10 group-hover/cat:text-orange-deep">
                        <Icon className="h-4.5 w-4.5" aria-hidden />
                      </span>
                      <span className="text-sm font-bold leading-tight text-ink group-hover/cat:text-indigo">
                        {t(cat.key)}
                      </span>
                    </Link>
                    {cat.subs.length > 0 && (
                      <div className="ml-[2.9rem] mt-0.5 flex flex-col">
                        {cat.subs.map((sub) => (
                          <Link
                            key={sub.key}
                            href={sub.href}
                            onClick={close}
                            className="rounded-md px-2 py-1 text-[13px] leading-snug text-muted no-underline transition-colors hover:bg-bg-soft hover:text-indigo"
                          >
                            {t(sub.key)}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <Link
              href="/products"
              onClick={close}
              className="flex items-center justify-center gap-2 rounded-xl border border-border bg-bg-soft px-3 py-2.5 text-sm font-bold text-indigo no-underline transition-colors hover:bg-indigo/5"
            >
              <Sparkles className="h-4 w-4" aria-hidden />
              {t('viewAllProducts')}
            </Link>
          </div>
        )}
      </NavDropdown>

      {/* Partners — simple dropdown. */}
      <NavDropdown label={t('partners')}>
        {(close) => (
          <div className="flex flex-col gap-0.5">
            {PARTNERS.map((p) => (
              <Link
                key={p.key}
                href={p.href}
                onClick={close}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-ink no-underline transition-colors hover:bg-bg-soft hover:text-indigo"
              >
                {t(p.key)}
              </Link>
            ))}
            <Link
              href="/partners"
              onClick={close}
              className="mt-1 rounded-lg border-t border-border px-3 pb-1.5 pt-2.5 text-sm font-bold text-indigo no-underline transition-colors hover:bg-bg-soft"
            >
              {t('viewAllPartners')}
            </Link>
          </div>
        )}
      </NavDropdown>

      <TopLink href="/about" label={t('about')} active={pathname === '/about'} />
      <TopLink href="/contact" label={t('contact')} active={pathname === '/contact'} />

      {/* Orange CTA — Get Price on WhatsApp. */}
      <a
        href={whatsappUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClassName('orange', 'sm', 'btn-sheen font-bold')}
      >
        {t('cta')}
      </a>
    </div>
  );
}

/** Plain top-level nav link with the underline-grow indicator. */
function TopLink({
  href,
  label,
  active
}: {
  href: Href;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'group relative whitespace-nowrap rounded-full px-1.5 py-2 font-[family-name:var(--font-inter)] text-base font-semibold tracking-[-0.01em] no-underline transition-colors',
        active ? 'text-indigo' : 'text-ink hover:text-indigo'
      )}
    >
      {label}
      <span
        className={cn(
          'pointer-events-none absolute inset-x-1.5 bottom-1 h-0.5 origin-left rounded-full bg-orange transition-transform duration-300 ease-out',
          active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
        )}
      />
    </Link>
  );
}
