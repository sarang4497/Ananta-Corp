import type {ComponentProps} from 'react';
import {Link} from '@/i18n/navigation';
import {ImagePlaceholder} from './ImagePlaceholder';
import {buttonClassName} from '@/components/ui/Button';
import {whatsappUrl} from '@/lib/whatsapp';

type Href = ComponentProps<typeof Link>['href'];

/**
 * Featured SKU card — placeholder product shot, brand badge, name, and the
 * two actions every product gets: View Details + orange WhatsApp price ask.
 */
export function ProductCard({
  name,
  brand,
  href,
  viewLabel,
  priceLabel
}: {
  name: string;
  brand: string;
  href: Href;
  viewLabel: string;
  priceLabel: string;
}) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-bg shadow-card transition-[transform,box-shadow,border-color] duration-300 will-change-transform hover:-translate-y-1 hover:border-orange/30 hover:shadow-[0_24px_60px_-24px_rgba(249,115,22,0.4)]">
      <ImagePlaceholder label="Product photo" className="h-44 rounded-b-none border-0 border-b border-border" />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <span className="inline-flex w-fit items-center rounded-full bg-indigo/8 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-indigo">
          {brand}
        </span>
        <h3 className="text-base font-bold leading-snug text-ink">{name}</h3>
        <div className="mt-auto flex flex-col gap-2 pt-1">
          <Link href={href} className={buttonClassName('secondary', 'sm', 'w-full')}>
            {viewLabel}
          </Link>
          <a
            href={whatsappUrl(`Hello! I'm interested in ${name}. Please share price and availability details.`)}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClassName('orange', 'sm', 'w-full')}
          >
            {priceLabel}
          </a>
        </div>
      </div>
    </div>
  );
}
