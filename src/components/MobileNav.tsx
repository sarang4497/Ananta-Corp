'use client';

import {useState, type ComponentProps} from 'react';
import {useTranslations} from 'next-intl';
import {Link, usePathname} from '@/i18n/navigation';
import {navItems} from './nav-items';
import {buttonClassName} from './ui/Button';
import {whatsappUrl} from '@/lib/whatsapp';
import {cn} from '@/lib/cn';

/** Hamburger + drawer for small screens. Client leaf. Groundwork: flat link
 *  list; the nested product/category accordions return with the new pages. */
export function MobileNav() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function close() {
    setOpen(false);
  }

  return (
    <div className="nav:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? t('closeMenu') : t('openMenu')}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-bg text-ink transition-colors hover:bg-bg-soft"
      >
        <span className="relative block h-3.5 w-5">
          <span className={cn('absolute left-0 top-0 h-0.5 w-5 rounded-full bg-ink transition-transform duration-300', open && 'translate-y-[6px] rotate-45')} />
          <span className={cn('absolute left-0 top-1/2 h-0.5 w-5 -translate-y-1/2 rounded-full bg-ink transition-opacity duration-200', open && 'opacity-0')} />
          <span className={cn('absolute bottom-0 left-0 h-0.5 w-5 rounded-full bg-ink transition-transform duration-300', open && '-translate-y-[6px] -rotate-45')} />
        </span>
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full mt-2 px-4">
          <div className="flex flex-col gap-1 rounded-2xl border border-border bg-bg p-4 shadow-glow">
            {navItems.map((item) => (
              <DrawerLink
                key={item.key}
                href={item.href}
                label={t(item.key)}
                active={pathname === item.href}
                onClick={close}
              />
            ))}

            <div className="mt-2 flex items-center justify-end gap-3 border-t border-border pt-3">
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={close}
                className={buttonClassName('blue', 'sm', 'font-bold')}
              >
                {t('cta')}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DrawerLink({
  href,
  label,
  active,
  onClick
}: {
  href: ComponentProps<typeof Link>['href'];
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'rounded-xl px-3 py-2.5 text-base font-semibold no-underline transition-colors',
        active ? 'bg-bg-soft text-blue' : 'text-ink hover:bg-bg-soft hover:text-blue'
      )}
    >
      {label}
    </Link>
  );
}
