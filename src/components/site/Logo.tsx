import Image from 'next/image';
import {Link} from '@/i18n/navigation';
import {cn} from '@/lib/cn';

/**
 * Ananta lockup: the official mark (trimmed transparent cut-out of
 * Ananta-Logo.png, never redrawn) + the existing "Ananta Corporation"
 * wordmark treatment. Mark rendered at fixed height for crisp scaling.
 */
export function Logo({className, variant = 'light'}: {className?: string; variant?: 'light' | 'dark'}) {
  const dark = variant === 'dark';
  return (
    <Link href="/" className={cn('group inline-flex shrink-0 items-center gap-2.5 no-underline', className)} aria-label="Ananta Corporation — home">
      <span className={cn('grid shrink-0 place-items-center', dark && 'rounded-[6px] bg-white px-1.5 py-1')}>
        <Image src="/images/logo/ananta-mark.png" alt="" width={46} height={36} priority={!dark} className="h-7 w-auto sm:h-8" />
      </span>
      <span className="whitespace-nowrap leading-none tracking-[-0.02em]">
        <span className={cn('text-[17px] font-bold sm:text-[19px]', dark ? 'text-white' : 'text-indigo')}>Ananta</span>{' '}
        <span className={cn('text-[17px] font-medium sm:text-[19px]', dark ? 'text-orange-light' : 'text-indigo-bright')}>Corporation</span>
      </span>
    </Link>
  );
}
