import {Link} from '@/i18n/navigation';
import {cn} from '@/lib/cn';

/**
 * Brand lockup — the "Ananta Corporation" gradient wordmark, linking home.
 * Text-only for now; swap in the logo mark once the Ananta asset is ready.
 */
export function Logo({className}: {className?: string}) {
  return (
    <Link
      href="/"
      className={cn('group inline-flex items-center gap-2.5 no-underline', className)}
      aria-label="Ananta Corporation — home"
    >
      <span className="text-gradient-wordmark whitespace-nowrap text-sm font-bold leading-none tracking-tight sm:text-lg lg:text-xl">
        Ananta Corporation
      </span>
    </Link>
  );
}
