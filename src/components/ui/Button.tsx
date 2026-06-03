import type {ComponentProps, ReactNode} from 'react';
import {Link} from '@/i18n/navigation';
import {cn} from '@/lib/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'green' | 'orange' | 'blue';
export type ButtonSize = 'sm' | 'md' | 'lg';

const base =
  'group inline-flex items-center justify-center gap-2 rounded-full font-semibold no-underline whitespace-nowrap ' +
  'transition-[transform,box-shadow,background-color] duration-200 will-change-transform ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue/40 focus-visible:ring-offset-2 ' +
  'active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none';

const sizes: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base'
};

const variants: Record<ButtonVariant, string> = {
  // Brand indigo gradient, white text, lift + glow on hover.
  primary:
    'bg-gradient-brand text-white shadow-[0_10px_30px_-12px_rgba(79,70,229,0.6)] ' +
    'hover:-translate-y-0.5 hover:shadow-glow',
  // White surface with an indigo border.
  secondary:
    'bg-bg text-ink border border-indigo/30 shadow-card ' +
    'hover:-translate-y-0.5 hover:border-indigo/60 hover:shadow-glow',
  // Minimal, text-only.
  ghost:
    'bg-transparent text-ink hover:-translate-y-0.5 hover:bg-bg-soft',
  // Solid green CTA (WhatsApp contexts), white text, lift on hover.
  green:
    'bg-green text-white shadow-[0_10px_30px_-12px_rgba(34,197,94,0.6)] ' +
    'hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-12px_rgba(34,197,94,0.55)]',
  // Action orange — the brand CTA ("Get Price on WhatsApp"), white text.
  orange:
    'bg-orange text-white shadow-orange ' +
    'hover:-translate-y-0.5 hover:bg-orange-deep hover:shadow-[0_18px_40px_-12px_rgba(234,88,12,0.55)]',
  // Brand indigo solid (legacy name kept for shared components).
  blue:
    'bg-blue text-white shadow-[0_10px_30px_-12px_rgba(79,70,229,0.6)] ' +
    'hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-12px_rgba(79,70,229,0.55)]'
};

/** Shared class string so interactive client leaves can reuse Button styling. */
export function buttonClassName(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  className?: string
) {
  return cn(base, sizes[size], variants[variant], className);
}

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
};

type AsLink = CommonProps & {
  href: ComponentProps<typeof Link>['href'];
} & Omit<ComponentProps<typeof Link>, 'href' | 'className' | 'children'>;

type AsButton = CommonProps &
  Omit<ComponentProps<'button'>, 'className' | 'children'> & {href?: undefined};

/**
 * Button primitive. Renders an i18n <Link> when `href` is provided, otherwise a
 * native <button>. Pure presentational Server Component — hover lift + glow are
 * CSS only, so no JS ships for it.
 */
export function Button(props: AsLink | AsButton) {
  const {variant, size, className, children} = props;
  const classes = buttonClassName(variant, size, className);

  if (props.href !== undefined) {
    const {variant: _v, size: _s, className: _c, children: _ch, ...rest} =
      props as AsLink;
    return (
      <Link className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  const {
    variant: _v,
    size: _s,
    className: _c,
    children: _ch,
    href: _h,
    ...rest
  } = props as AsButton;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
