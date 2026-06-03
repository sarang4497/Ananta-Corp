'use client';

import {useState, type ComponentProps} from 'react';
import {useTranslations} from 'next-intl';
import {ChevronDown} from 'lucide-react';
import {Link, usePathname} from '@/i18n/navigation';
import {PRODUCT_CATEGORIES, PARTNERS} from './nav-menu';
import {buttonClassName} from './ui/Button';
import {whatsappUrl} from '@/lib/whatsapp';
import {cn} from '@/lib/cn';

type Section = 'products' | 'partners';

/** Hamburger + drawer for small screens with the full product tree. */
export function MobileNav() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState<Section | null>(null);
  const [openCat, setOpenCat] = useState<string | null>(null);

  function close() {
    setOpen(false);
    setSection(null);
    setOpenCat(null);
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
          <div className="flex max-h-[calc(100dvh-6.5rem)] flex-col gap-1 overflow-y-auto rounded-2xl border border-border bg-bg p-4 shadow-glow">
            {/* Products — full category → subcategory tree. */}
            <SectionToggle
              label={t('products')}
              open={section === 'products'}
              onToggle={() => setSection((s) => (s === 'products' ? null : 'products'))}
            />
            {section === 'products' && (
              <div className="mb-1 ml-2 flex flex-col gap-0.5 border-l border-border pl-2">
                {PRODUCT_CATEGORIES.map((cat) =>
                  cat.subs.length === 0 ? (
                    <Link
                      key={cat.key}
                      href={cat.href}
                      onClick={close}
                      className="rounded-xl px-3 py-2 text-sm font-semibold text-ink no-underline transition-colors hover:bg-bg-soft hover:text-indigo"
                    >
                      {t(cat.key)}
                    </Link>
                  ) : (
                    <div key={cat.key} className="flex flex-col">
                      <button
                        type="button"
                        onClick={() => setOpenCat((x) => (x === cat.key ? null : cat.key))}
                        aria-expanded={openCat === cat.key}
                        className="flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold text-ink transition-colors hover:bg-bg-soft"
                      >
                        {t(cat.key)}
                        <ChevronDown className={cn('h-3.5 w-3.5 transition-transform duration-200', openCat === cat.key && 'rotate-180')} aria-hidden />
                      </button>
                      {openCat === cat.key && (
                        <div className="mb-1 ml-2 flex flex-col gap-0.5 border-l border-border pl-2">
                          <Link
                            href={cat.href}
                            onClick={close}
                            className="rounded-lg px-3 py-1.5 text-[13px] font-semibold leading-snug text-ink no-underline transition-colors hover:bg-bg-soft hover:text-indigo"
                          >
                            {t('overview')}
                          </Link>
                          {cat.subs.map((sub) => (
                            <Link
                              key={sub.key}
                              href={sub.href}
                              onClick={close}
                              className="rounded-lg px-3 py-1.5 text-[13px] leading-snug text-muted no-underline transition-colors hover:bg-bg-soft hover:text-indigo"
                            >
                              {t(sub.key)}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                )}
                <Link
                  href="/products"
                  onClick={close}
                  className="rounded-xl px-3 py-2 text-sm font-bold text-indigo no-underline transition-colors hover:bg-bg-soft"
                >
                  {t('viewAllProducts')}
                </Link>
              </div>
            )}

            {/* Partners. */}
            <SectionToggle
              label={t('partners')}
              open={section === 'partners'}
              onToggle={() => setSection((s) => (s === 'partners' ? null : 'partners'))}
            />
            {section === 'partners' && (
              <div className="mb-1 ml-2 flex flex-col gap-0.5 border-l border-border pl-2">
                {PARTNERS.map((p) => (
                  <Link
                    key={p.key}
                    href={p.href}
                    onClick={close}
                    className="rounded-xl px-3 py-2 text-sm font-semibold text-ink no-underline transition-colors hover:bg-bg-soft hover:text-indigo"
                  >
                    {t(p.key)}
                  </Link>
                ))}
                <Link
                  href="/partners"
                  onClick={close}
                  className="rounded-xl px-3 py-2 text-sm font-bold text-indigo no-underline transition-colors hover:bg-bg-soft"
                >
                  {t('viewAllPartners')}
                </Link>
              </div>
            )}

            <DrawerLink href="/about" label={t('about')} active={pathname === '/about'} onClick={close} />
            <DrawerLink href="/contact" label={t('contact')} active={pathname === '/contact'} onClick={close} />

            <div className="mt-2 flex items-center justify-end gap-3 border-t border-border pt-3">
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={close}
                className={buttonClassName('orange', 'sm', 'font-bold')}
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

function SectionToggle({
  label,
  open,
  onToggle
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      className="flex items-center justify-between rounded-xl px-3 py-2.5 text-base font-semibold text-ink transition-colors hover:bg-bg-soft"
    >
      {label}
      <ChevronDown className={cn('h-4 w-4 transition-transform duration-200', open && 'rotate-180')} aria-hidden />
    </button>
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
        active ? 'bg-bg-soft text-indigo' : 'text-ink hover:bg-bg-soft hover:text-indigo'
      )}
    >
      {label}
    </Link>
  );
}
