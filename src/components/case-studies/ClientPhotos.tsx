'use client';

import {useState} from 'react';
import Image from 'next/image';
import {cn} from '@/lib/cn';

/**
 * Real client photos from /public/clients/client-1..N.jpg. Each photo hides
 * itself if the file is missing (onError), so the page never shows a broken
 * image — they simply don't appear until the files are added. Rounded-2xl, soft
 * shadow, no black.
 */

function Photo({src, className, sizes}: {src: string; className?: string; sizes: string}) {
  const [ok, setOk] = useState(true);
  if (!ok) return null;
  return (
    <Image
      src={src}
      alt="Studio Marketing Italia with a client"
      width={320}
      height={320}
      sizes={sizes}
      onError={() => setOk(false)}
      className={className}
    />
  );
}

export function ClientPhotos({
  count = 5,
  variant = 'strip',
  className
}: {
  count?: number;
  variant?: 'strip' | 'avatars';
  className?: string;
}) {
  const srcs = Array.from({length: count}, (_, i) => `/clients/client-${i + 1}.jpg`);

  if (variant === 'avatars') {
    // Overlapping circular cluster — a warm human touch for the hero.
    return (
      <div className={cn('flex items-center -space-x-3', className)}>
        {srcs.map((src) => (
          <Photo
            key={src}
            src={src}
            sizes="56px"
            className="h-12 w-12 rounded-full border-2 border-bg object-cover shadow-sm sm:h-14 sm:w-14"
          />
        ))}
      </div>
    );
  }

  // Strip — a responsive row of rounded photos that breaks up the page.
  return (
    <div className={cn('grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5', className)}>
      {srcs.map((src, i) => (
        <Photo
          key={src}
          src={src}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className={cn(
            'aspect-square w-full rounded-2xl object-cover shadow-card',
            // Let the last odd photo span both columns on the 2-col mobile grid.
            i === srcs.length - 1 && srcs.length % 2 === 1 && 'col-span-2 sm:col-span-1'
          )}
        />
      ))}
    </div>
  );
}
