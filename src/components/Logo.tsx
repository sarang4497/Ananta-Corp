import Image from 'next/image';
import {Link} from '@/i18n/navigation';
import {cn} from '@/lib/cn';

/**
 * Brand lockup — the Ananta logo mark + styled "Ananta Corporation" wordmark,
 * linking home. The mark is the trimmed transparent cut-out at
 * public/images/logo/ananta-mark.png (derived from Ananta-Logo.png).
 *
 * variant="light" (default): for white backgrounds (navbar) — navy-blue text,
 * "Ananta" extrabold + "Corporation" in a lighter weight/brighter blue.
 * variant="dark": for the navy footer — white "Ananta" + orange-light
 * "Corporation" for contrast; the mark sits on a soft white chip so its blue
 * stays visible against the blue background.
 */
export function Logo({
  className,
  variant = 'light'
}: {
  className?: string;
  variant?: 'light' | 'dark';
}) {
  const dark = variant === 'dark';
  return (
    <Link
      href="/"
      className={cn('group inline-flex items-center gap-2.5 no-underline', className)}
      aria-label="Ananta Corporation — home"
    >
      <span className={cn('shrink-0', dark && 'rounded-lg bg-white/90 px-1 py-0.5')}>
        <Image
          src="/images/logo/ananta-mark.png"
          alt=""
          width={46}
          height={36}
          priority={!dark}
          className="h-8 w-auto sm:h-9"
        />
      </span>
      <span className="whitespace-nowrap text-sm leading-none tracking-tight sm:text-lg lg:text-xl">
        <span className={cn('font-extrabold', dark ? 'text-white' : 'text-indigo')}>
          Ananta
        </span>{' '}
        <span className={cn('font-medium', dark ? 'text-orange-light' : 'text-indigo-bright')}>
          Corporation
        </span>
      </span>
    </Link>
  );
}
