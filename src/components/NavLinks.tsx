'use client';

import type {ComponentProps} from 'react';
import {useTranslations} from 'next-intl';
import {Link, usePathname} from '@/i18n/navigation';
import {navItems} from './nav-items';
import {buttonClassName} from './ui/Button';
import {whatsappUrl} from '@/lib/whatsapp';
import {cn} from '@/lib/cn';

type Href = ComponentProps<typeof Link>['href'];

/**
 * Desktop nav row. Groundwork: the nav-items links plus the WhatsApp CTA;
 * dropdown menus return when the Ananta product pages are designed.
 * Client leaf so it can mark the active item.
 */
export function NavLinks({className}: {className?: string}) {
  const t = useTranslations('nav');
  const pathname = usePathname();

  return (
    <div className={cn('flex items-center justify-end gap-5', className)}>
      {navItems.map((item) => (
        <TopLink
          key={item.key}
          href={item.href}
          label={t(item.key)}
          active={pathname === item.href}
        />
      ))}
      {/* WhatsApp CTA — styled as the blue button. */}
      <a
        href={whatsappUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClassName('blue', 'sm', 'font-bold')}
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
        active ? 'text-blue' : 'text-ink hover:text-blue'
      )}
    >
      {label}
      <span
        className={cn(
          'pointer-events-none absolute inset-x-1.5 bottom-1 h-0.5 origin-left rounded-full bg-blue transition-transform duration-300 ease-out',
          active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
        )}
      />
    </Link>
  );
}
