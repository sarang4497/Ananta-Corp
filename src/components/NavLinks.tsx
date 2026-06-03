'use client';

import type {ComponentProps} from 'react';
import {useTranslations} from 'next-intl';
import {Link, usePathname} from '@/i18n/navigation';
import {ServicesMenu} from './ServicesMenu';
import {AiProductsMenu} from './AiProductsMenu';
import {IndustriesMenu} from './IndustriesMenu';
import {LanguageMenu} from './LanguageMenu';
import {buttonClassName} from './ui/Button';
import {whatsappUrl} from '@/lib/whatsapp';
import {cn} from '@/lib/cn';

type Href = ComponentProps<typeof Link>['href'];

/**
 * Desktop nav row, evenly spaced: Services ▾ · AI Products ▾ · Industries ▾ ·
 * About · Case Studies · Let's Talk · language dropdown. Let's Talk is
 * an inline item (styled as the blue button) at the same gap as the rest; the
 * language dropdown comes last. Client leaf so it can mark the active item.
 */
export function NavLinks({className}: {className?: string}) {
  const t = useTranslations('nav');
  const pathname = usePathname();

  return (
    <div className={cn('flex items-center justify-between gap-5', className)}>
      <ServicesMenu />
      <AiProductsMenu />
      <IndustriesMenu />
      {/* About is a homepage section, not a page — scroll/redirect to /#about. */}
      <TopLink href={{pathname: '/', hash: 'about'} as Href} label={t('about')} active={false} />
      <TopLink href="/case-studies" label={t('caseStudies')} active={pathname === '/case-studies'} />
      {/* Let's Talk — inline at equal spacing, styled as the blue button. */}
      <a
        href={whatsappUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClassName('blue', 'sm', 'font-bold')}
      >
        {t('cta')}
      </a>
      <LanguageMenu />
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
