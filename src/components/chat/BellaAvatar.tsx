'use client';

import {useState} from 'react';
import Image from 'next/image';
import {cn} from '@/lib/cn';

/**
 * Bella's round avatar — the real image (/public/chatbot/bella.png), falling
 * back to a branded gradient "B" if the file is ever missing. object-cover
 * centers on her face at small sizes; the bg tint fills any transparent edges so
 * the circle reads cleanly.
 */
export function BellaAvatar({size = 44, className}: {size?: number; className?: string}) {
  const [broken, setBroken] = useState(false);

  if (broken) {
    return (
      <span
        aria-hidden
        className={cn(
          'grid shrink-0 place-items-center rounded-full bg-gradient-brand font-bold text-white',
          className
        )}
        style={{width: size, height: size, fontSize: Math.round(size * 0.45)}}
      >
        B
      </span>
    );
  }

  return (
    <Image
      src="/chatbot/bella.png"
      alt="Bella"
      width={size}
      height={size}
      onError={() => setBroken(true)}
      className={cn('shrink-0 rounded-full bg-bg-soft object-cover', className)}
      style={{width: size, height: size, objectPosition: '60% 22%'}}
    />
  );
}
