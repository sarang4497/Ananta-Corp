'use client';

import Image from 'next/image';
import {useState} from 'react';
import {cn} from '@/lib/cn';

/**
 * Product gallery: staged main image (technical grid backdrop, contain for
 * cut-outs) + thumbnails. Manufacturer imagery is captioned as such.
 */
export function Gallery({images, name}: {images: string[]; name: string}) {
  const [i, setI] = useState(0);
  const src = images[i];
  const cutout = src.includes('/products/');
  return (
    <div className="flex flex-col gap-3">
      <div className={cn('relative aspect-square overflow-hidden rounded-[12px] border border-line sm:aspect-[5/4]', cutout ? 'bg-grid bg-bg-soft' : 'bg-bg-soft')} data-reveal="image">
        <Image
          key={src}
          src={src}
          alt={`${name} — image ${i + 1} of ${images.length}`}
          fill
          priority={i === 0}
          sizes="(max-width: 1024px) 100vw, 50vw"
          className={cn(cutout ? 'object-contain p-6 mix-blend-multiply sm:p-10' : 'object-cover')}
        />
        {cutout && <span className="t-label absolute bottom-3 left-3 rounded-[4px] bg-white/90 px-2 py-1 text-muted">Manufacturer imagery</span>}
        {images.length > 1 && (
          <span className="t-label absolute right-3 top-3 rounded-[4px] bg-white/90 px-2 py-1 text-muted" aria-hidden>
            {i + 1} / {images.length}
          </span>
        )}
      </div>
      {images.length > 1 && (
        <ul className="flex flex-wrap gap-2" aria-label="Choose image">
          {images.map((im, n) => (
            <li key={im}>
              <button
                type="button"
                onClick={() => setI(n)}
                aria-label={`Show image ${n + 1}`}
                aria-pressed={n === i}
                className={cn(
                  'relative block h-16 w-16 overflow-hidden rounded-[8px] border bg-bg-soft transition-colors duration-150 sm:h-20 sm:w-20',
                  n === i ? 'border-indigo ring-2 ring-indigo/30' : 'border-line hover:border-indigo/40'
                )}
              >
                <Image src={im} alt="" fill sizes="80px" className={im.includes('/products/') ? 'object-contain p-1 mix-blend-multiply' : 'object-cover'} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
