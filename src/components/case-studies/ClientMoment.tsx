import Image from 'next/image';
import {cn} from '@/lib/cn';

/**
 * A single warm "real us with real clients" photo moment, interspersed between
 * case-study sections. The client photos are portrait, so we render them at
 * their natural ratio inside a modest, centered rounded card (not huge), with a
 * soft shadow and a small caption. No black; mobile-responsive, no overflow.
 */
export function ClientMoment({
  src,
  width,
  height,
  caption = 'Our team with clients',
  className
}: {
  src: string;
  width: number;
  height: number;
  caption?: string;
  className?: string;
}) {
  return (
    <figure className={cn('mx-auto flex w-full max-w-[240px] flex-col items-center sm:max-w-[280px]', className)}>
      <div className="w-full overflow-hidden rounded-2xl border border-border bg-bg shadow-glow">
        <Image
          src={src}
          alt={caption}
          width={width}
          height={height}
          sizes="(max-width: 640px) 60vw, 280px"
          className="h-auto w-full"
        />
      </div>
      <figcaption className="mt-3 text-center text-sm font-medium text-muted">{caption}</figcaption>
    </figure>
  );
}
