'use client';

import {useState, type ComponentProps} from 'react';
import {useTranslations} from 'next-intl';
import {ChevronDown} from 'lucide-react';
import {Link, usePathname} from '@/i18n/navigation';
import {SERVICES, INDUSTRIES} from './nav-menu';
import {slugify} from '@/lib/slug';
import {LanguageMenu} from './LanguageMenu';
import {buttonClassName} from './ui/Button';
import {whatsappUrl} from '@/lib/whatsapp';
import {cn} from '@/lib/cn';

type Section = 'services' | 'aiProducts' | 'industries';

/** Hamburger + drawer for small screens, with expandable submenus. Client leaf. */
export function MobileNav() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState<Section | null>(null);

  function close() {
    setOpen(false);
    setSection(null);
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
            {/* Services — nested: service → sub-services (accordion). */}
            <div className="flex flex-col">
              <button
                type="button"
                onClick={() => setSection((s) => (s === 'services' ? null : 'services'))}
                aria-expanded={section === 'services'}
                className="flex items-center justify-between rounded-xl px-3 py-2.5 text-base font-semibold text-ink transition-colors hover:bg-bg-soft"
              >
                {t('services')}
                <ChevronDown className={cn('h-4 w-4 transition-transform duration-200', section === 'services' && 'rotate-180')} aria-hidden />
              </button>
              {section === 'services' && <MobileServices onNavigate={close} />}
            </div>
            {/* AI Products — nested: categories → products (accordion). */}
            <div className="flex flex-col">
              <button
                type="button"
                onClick={() => setSection((s) => (s === 'aiProducts' ? null : 'aiProducts'))}
                aria-expanded={section === 'aiProducts'}
                className="flex items-center justify-between rounded-xl px-3 py-2.5 text-base font-semibold text-ink transition-colors hover:bg-bg-soft"
              >
                {t('aiProducts')}
                <ChevronDown className={cn('h-4 w-4 transition-transform duration-200', section === 'aiProducts' && 'rotate-180')} aria-hidden />
              </button>
              {section === 'aiProducts' && <MobileAiProducts onNavigate={close} />}
            </div>
            {/* Industries — nested: industry → services (accordion). */}
            <div className="flex flex-col">
              <button
                type="button"
                onClick={() => setSection((s) => (s === 'industries' ? null : 'industries'))}
                aria-expanded={section === 'industries'}
                className="flex items-center justify-between rounded-xl px-3 py-2.5 text-base font-semibold text-ink transition-colors hover:bg-bg-soft"
              >
                {t('industries')}
                <ChevronDown className={cn('h-4 w-4 transition-transform duration-200', section === 'industries' && 'rotate-180')} aria-hidden />
              </button>
              {section === 'industries' && <MobileIndustries onNavigate={close} />}
            </div>
            {/* About is a homepage section, not a page — scroll/redirect to /#about. */}
            <DrawerLink
              href={{pathname: '/', hash: 'about'} as ComponentProps<typeof Link>['href']}
              label={t('about')}
              active={false}
              onClick={close}
            />
            <DrawerLink href="/case-studies" label={t('caseStudies')} active={pathname === '/case-studies'} onClick={close} />

            <div className="mt-2 flex items-center justify-between gap-3 border-t border-border pt-3">
              <LanguageMenu />
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

/** Services mobile accordion: service → sub-services. */
function MobileServices({onNavigate}: {onNavigate: () => void}) {
  const tn = useTranslations('nav');
  const tp = useTranslations('pages');
  const [openKey, setOpenKey] = useState<string | null>(null);

  return (
    <div className="mb-1 ml-2 flex flex-col gap-0.5 border-l border-border pl-2">
      {SERVICES.map((s) => {
        const subs = tp.raw(`${s.key}.services`) as {name: string}[];
        return (
          <div key={s.key} className="flex flex-col">
            <button
              type="button"
              onClick={() => setOpenKey((x) => (x === s.key ? null : s.key))}
              aria-expanded={openKey === s.key}
              className="flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold text-ink transition-colors hover:bg-bg-soft"
            >
              {tn(s.key)}
              <ChevronDown className={cn('h-3.5 w-3.5 transition-transform duration-200', openKey === s.key && 'rotate-180')} aria-hidden />
            </button>
            {openKey === s.key && (
              <div className="mb-1 ml-2 flex flex-col gap-0.5 border-l border-border pl-2">
                {subs.map((sub) => (
                  <Link
                    key={sub.name}
                    href={
                      {pathname: s.match, hash: slugify(sub.name)} as ComponentProps<typeof Link>['href']
                    }
                    onClick={onNavigate}
                    className="rounded-lg px-3 py-1.5 text-[13px] leading-snug text-ink no-underline transition-colors hover:bg-bg-soft hover:text-blue"
                  >
                    {sub.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/** AI Products mobile accordion: categories → products. */
function MobileAiProducts({onNavigate}: {onNavigate: () => void}) {
  const t = useTranslations('aiProducts');
  const tn = useTranslations('nav');
  const categories = t.raw('categories') as {
    id: string;
    title: string;
    products: {name: string}[];
  }[];
  const [openCat, setOpenCat] = useState<string | null>(null);

  let offset = 0;
  const cats = categories.map((c) => {
    const base = offset;
    offset += c.products.length;
    return {...c, base};
  });

  return (
    <div className="mb-1 ml-2 flex flex-col gap-0.5 border-l border-border pl-2">
      <Link
        href="/ai-products"
        onClick={onNavigate}
        className="rounded-xl px-3 py-2 text-sm font-semibold text-ink no-underline transition-colors hover:bg-bg-soft hover:text-blue"
      >
        {tn('aiAll')}
      </Link>
      {cats.map((c) => (
        <div key={c.id} className="flex flex-col">
          <button
            type="button"
            onClick={() => setOpenCat((x) => (x === c.id ? null : c.id))}
            aria-expanded={openCat === c.id}
            className="flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold text-ink transition-colors hover:bg-bg-soft"
          >
            {c.title}
            <ChevronDown className={cn('h-3.5 w-3.5 transition-transform duration-200', openCat === c.id && 'rotate-180')} aria-hidden />
          </button>
          {openCat === c.id && (
            <div className="mb-1 ml-2 flex flex-col gap-0.5 border-l border-border pl-2">
              {c.products.map((p, j) => (
                <Link
                  key={p.name}
                  href={
                    {
                      pathname: '/ai-products',
                      hash: `product-${String(c.base + j + 1).padStart(2, '0')}`
                    } as ComponentProps<typeof Link>['href']
                  }
                  onClick={onNavigate}
                  className="rounded-lg px-3 py-1.5 text-[13px] leading-snug text-ink no-underline transition-colors hover:bg-bg-soft hover:text-blue"
                >
                  {p.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/** Industries mobile accordion: industry → services. */
function MobileIndustries({onNavigate}: {onNavigate: () => void}) {
  const tn = useTranslations('nav');
  const ti = useTranslations('pages.industries');
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  return (
    <div className="mb-1 ml-2 flex flex-col gap-0.5 border-l border-border pl-2">
      {INDUSTRIES.map((ind) => {
        const services = ti.raw(`${ind.key}.services`) as {name: string}[];
        return (
          <div key={ind.slug} className="flex flex-col">
            <button
              type="button"
              onClick={() => setOpenSlug((x) => (x === ind.slug ? null : ind.slug))}
              aria-expanded={openSlug === ind.slug}
              className="flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold text-ink transition-colors hover:bg-bg-soft"
            >
              {tn(ind.key)}
              <ChevronDown className={cn('h-3.5 w-3.5 transition-transform duration-200', openSlug === ind.slug && 'rotate-180')} aria-hidden />
            </button>
            {openSlug === ind.slug && (
              <div className="mb-1 ml-2 flex flex-col gap-0.5 border-l border-border pl-2">
                <Link
                  href={{pathname: '/industries/[slug]', params: {slug: ind.slug}} as ComponentProps<typeof Link>['href']}
                  onClick={onNavigate}
                  className="rounded-lg px-3 py-1.5 text-[13px] font-semibold text-ink no-underline transition-colors hover:bg-bg-soft hover:text-blue"
                >
                  Overview
                </Link>
                {services.map((s) => (
                  <Link
                    key={s.name}
                    href={
                      {
                        pathname: '/industries/[slug]',
                        params: {slug: ind.slug},
                        hash: slugify(s.name)
                      } as ComponentProps<typeof Link>['href']
                    }
                    onClick={onNavigate}
                    className="rounded-lg px-3 py-1.5 text-[13px] leading-snug text-ink no-underline transition-colors hover:bg-bg-soft hover:text-blue"
                  >
                    {s.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
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
