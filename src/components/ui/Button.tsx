import type {ComponentProps, ReactNode} from 'react';
import {Link} from '@/i18n/navigation';
import {cn} from '@/lib/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'green' | 'orange' | 'blue' | 'light' | 'outline-light';
export type ButtonSize = 'sm' | 'md' | 'lg';

/*
 * CTA hierarchy (docs: research/ANANTA_REDESIGN_DECISIONS.md):
 *   primary  — solid Ananta blue: the main action in a block
 *   orange   — reserved for the single highest-value moment (price/quote)
 *   secondary— hairline outline: the supporting action
 *   ghost    — text-weight action
 * Rectangular 6px radius — architectural, not pill-shaped.
 */
const base =
  'group inline-flex min-h-11 items-center justify-center gap-2 rounded-[6px] font-semibold no-underline whitespace-nowrap ' +
  'transition-[background-color,border-color,color,box-shadow,transform] duration-150 ease-out ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue ' +
  'active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none';

const sizes: Record<ButtonSize, string> = {
  sm: 'min-h-9 px-3.5 text-[13px]',
  md: 'px-5 text-sm',
  lg: 'px-6 text-[15px]'
};

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-indigo text-white hover:bg-blue shadow-[0_1px_0_rgba(255,255,255,0.15)_inset]',
  blue: 'bg-blue text-white hover:bg-indigo',
  orange: 'bg-orange text-white hover:bg-orange-deep',
  secondary: 'border border-ink/15 bg-white text-ink hover:border-indigo/50 hover:text-indigo',
  ghost: 'text-ink hover:bg-bg-soft',
  green: 'border border-wa/40 bg-white text-ink hover:border-wa hover:bg-wa/5',
  light: 'bg-white text-navy hover:bg-surface-blue',
  'outline-light': 'border border-white/25 text-white hover:border-white/60 hover:bg-white/5'
};

export function buttonClassName(variant: ButtonVariant = 'primary', size: ButtonSize = 'md', className?: string) {
  return cn(base, sizes[size], variants[variant], className);
}

type Common = {variant?: ButtonVariant; size?: ButtonSize; className?: string; children: ReactNode};
type AsLink = Common & {href: ComponentProps<typeof Link>['href']} & Omit<ComponentProps<typeof Link>, 'href' | 'className' | 'children'>;
type AsButton = Common & Omit<ComponentProps<'button'>, 'className' | 'children'> & {href?: undefined};

export function Button(props: AsLink | AsButton) {
  const {variant, size, className, children} = props;
  const classes = buttonClassName(variant, size, className);
  if (props.href !== undefined) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {variant: _v, size: _s, className: _c, children: _ch, ...rest} = props as AsLink;
    return (
      <Link {...rest} className={classes}>
        {children}
      </Link>
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {variant: _v, size: _s, className: _c, children: _ch, ...rest} = props as AsButton;
  return (
    <button {...rest} className={classes}>
      {children}
    </button>
  );
}

/** WhatsApp glyph (official shape), currentColor. */
export function WhatsAppIcon({className = 'h-4 w-4'}: {className?: string}) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}
