import Image from 'next/image';
import {Link} from '@/i18n/navigation';
import {cn} from '@/lib/cn';

/**
 * Ananta lockup: the official mark (trimmed transparent cut-out of
 * Ananta-Logo.png, never redrawn) + a stacked wordmark — "Ananta" over a
 * tracked "CORPORATION" — so the lockup reads established at header size and
 * still fits a 320px phone next to two 44px icons.
 *   size="lg"  header: mark 36px (phones) → 48px (desktop)
 *   size="md"  footer / compact
 */
export function Logo({
  className,
  variant = 'light',
  size = 'md'
}: {
  className?: string;
  variant?: 'light' | 'dark';
  size?: 'md' | 'lg';
}) {
  const dark = variant === 'dark';
  const lg = size === 'lg';
  return (
    <Link
      href="/"
      className={cn('group inline-flex shrink-0 items-center no-underline', lg ? 'gap-2.5 nav:gap-3' : 'gap-2.5', className)}
      aria-label="Ananta Corporation — home"
      data-testid="site-logo"
    >
      <span className={cn('grid shrink-0 place-items-center', dark && 'rounded-[6px] bg-white px-1.5 py-1')}>
        <Image
          src="/images/logo/ananta-mark.png"
          alt=""
          width={62}
          height={48}
          priority={!dark}
          className={cn('w-auto', lg ? 'h-9 nav:h-11 min-[1280px]:h-12 transition-[height] duration-300' : 'h-8')}
        />
      </span>
      <span className="flex flex-col leading-none" aria-hidden>
        <span
          className={cn(
            'font-bold tracking-[-0.03em]',
            lg ? 'text-[21px] nav:text-[24px] min-[1280px]:text-[26px]' : 'text-[19px]',
            dark ? 'text-white' : 'text-indigo'
          )}
        >
          Ananta
        </span>
        <span
          className={cn(
            'mt-[3px] font-semibold uppercase tracking-[0.2em]',
            lg ? 'text-[9.5px] nav:text-[11px]' : 'text-[9.5px]',
            dark ? 'text-orange-light' : 'text-indigo-bright'
          )}
        >
          Corporation
        </span>
      </span>
    </Link>
  );
}
