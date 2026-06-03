import Image from 'next/image';
import {Link} from '@/i18n/navigation';
import {cn} from '@/lib/cn';

/**
 * Brand lockup — the /logo.png mark plus the "Studio Marketing Italia" gradient
 * wordmark, linking home. Reads on the white navbar and footer.
 */
export function Logo({className}: {className?: string}) {
  return (
    <Link
      href="/"
      className={cn('group inline-flex items-center gap-2.5 no-underline', className)}
      aria-label="Studio Marketing Italia — home"
    >
      <Image
        src="/logo.png"
        alt=""
        width={40}
        height={40}
        priority
        className="h-9 w-auto shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 sm:h-10"
      />
      <span className="text-gradient-wordmark whitespace-nowrap text-sm font-bold leading-none tracking-tight sm:text-lg lg:text-xl">
        Studio Marketing Italia
      </span>
    </Link>
  );
}
