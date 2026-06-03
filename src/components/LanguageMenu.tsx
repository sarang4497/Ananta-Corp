'use client';

import {useEffect, useRef, useState} from 'react';
import type {ComponentProps} from 'react';
import {useParams} from 'next/navigation';
import {useLocale} from 'next-intl';
import {Check, ChevronDown, Globe} from 'lucide-react';
import {Link, usePathname} from '@/i18n/navigation';
import {cn} from '@/lib/cn';

const short: Record<string, string> = {en: 'EN', it: 'IT'};

// English is the only working locale for now; the rest are shown as
// "(Coming soon)" placeholders — disabled, not clickable, no routes/translations.
// (Italian stays the system's second locale under the hood; here it's just listed
// as coming soon like the others.)
const LANGUAGES = [
  {label: 'English', soon: false},
  {label: 'Italiano', soon: true},
  {label: 'Deutsch', soon: true},
  {label: 'Français', soon: true},
  {label: 'Español', soon: true},
  {label: '中文', soon: true}
] as const;

type Href = ComponentProps<typeof Link>['href'];

/**
 * Compact globe + chevron language dropdown for the navy navbar. Selecting a
 * locale navigates to the SAME page in that locale — next-intl resolves the
 * localized slug from the current internal pathname + route params.
 */
export function LanguageMenu({className}: {className?: string}) {
  const pathname = usePathname();
  const params = useParams();
  const active = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointer(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Language"
        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-bg px-2.5 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-bg-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue/40"
      >
        <Globe className="h-3.5 w-3.5" aria-hidden />
        {short[active] ?? active.toUpperCase()}
        <ChevronDown
          className={cn('h-3.5 w-3.5 transition-transform duration-200', open && 'rotate-180')}
          aria-hidden
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 min-w-[13rem] overflow-hidden rounded-xl border border-border bg-bg p-1 shadow-card"
        >
          {LANGUAGES.map((lang) => {
            // Coming-soon placeholders — muted, not-allowed, non-interactive.
            if (lang.soon) {
              return (
                <div
                  key={lang.label}
                  role="menuitem"
                  aria-disabled="true"
                  tabIndex={-1}
                  className="flex cursor-not-allowed select-none items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm text-muted/50"
                >
                  <span>{lang.label}</span>
                  <span className="text-[11px] font-medium text-muted/50">(Coming soon)</span>
                </div>
              );
            }
            // English — the active, working locale.
            const isActive = active === 'en';
            return (
              <Link
                key={lang.label}
                role="menuitem"
                href={{pathname, params} as Href}
                locale="en"
                onClick={() => setOpen(false)}
                className={cn(
                  'flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm no-underline transition-colors',
                  isActive ? 'text-blue' : 'text-ink hover:bg-bg-soft hover:text-blue'
                )}
              >
                <span>{lang.label}</span>
                {isActive && <Check className="h-4 w-4" aria-hidden />}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
