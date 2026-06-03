import {cn} from '@/lib/cn';

/**
 * The assistant's round avatar — a branded gradient "A" mark. Swap in a real
 * avatar image here once the Ananta assistant identity is designed.
 */
export function BellaAvatar({size = 44, className}: {size?: number; className?: string}) {
  return (
    <span
      aria-hidden
      className={cn(
        'grid shrink-0 place-items-center rounded-full bg-gradient-brand font-bold text-white',
        className
      )}
      style={{width: size, height: size, fontSize: Math.round(size * 0.45)}}
    >
      A
    </span>
  );
}
