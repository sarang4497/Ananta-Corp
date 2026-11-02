import Image from 'next/image';
import {BRAND_ASSETS} from '@/content/site';
import type {Brand} from '@/data/products';
import {cn} from '@/lib/cn';

/**
 * Official brand logo at a fixed HEIGHT (width follows the native ratio — never
 * stretched, never recoloured). Duroply's largest official file is 150×50, so
 * its rendered height is capped at 25px to stay crisp on 2× screens.
 */
export function BrandLogo({
  brand,
  height = 24,
  onDark = false,
  className
}: {
  brand: Brand;
  height?: number;
  onDark?: boolean;
  className?: string;
}) {
  const a = BRAND_ASSETS[brand];
  const darkSrc = onDark && 'logoOnDark' in a ? a.logoOnDark : undefined;
  const src = darkSrc ?? a.logo;
  const ratio = darkSrc ? 400 / 139 : a.w / a.h;
  const h = brand === 'Duroply' ? Math.min(height, 25) : height;
  return (
    <Image
      src={src}
      alt={`${brand} logo`}
      width={Math.round(h * ratio)}
      height={h}
      className={cn('block shrink-0 object-contain', className)}
      style={{height: h, width: Math.round(h * ratio)}}
      unoptimized={src.endsWith('.png') && brand === 'Duroply'}
    />
  );
}
