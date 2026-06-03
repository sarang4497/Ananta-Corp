import Image from 'next/image';
import {Link} from '@/i18n/navigation';
import {ImagePlaceholder} from '@/components/home/ImagePlaceholder';
import {buttonClassName} from '@/components/ui/Button';
import {whatsappUrl} from '@/lib/whatsapp';
import {productHref, type Product} from '@/data/products';

/**
 * The standard product card used on /products, category, subcategory and
 * related-products rows. Prelam SKUs show their real (self-hosted) décor
 * swatch; everything else gets the styled placeholder until photography lands.
 */
export function CatalogCard({
  product,
  categoryLabel,
  viewLabel,
  priceLabel
}: {
  product: Product;
  categoryLabel: string;
  viewLabel: string;
  priceLabel: string;
}) {
  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-bg shadow-card transition-[transform,box-shadow,border-color] duration-300 will-change-transform hover:-translate-y-1 hover:border-orange/30 hover:shadow-[0_24px_60px_-24px_rgba(249,115,22,0.4)]">
      {product.decorImage ? (
        <div className="relative h-44 w-full overflow-hidden border-b border-border">
          <Image
            src={product.decorImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      ) : (
        <ImagePlaceholder
          label="Product photo"
          className="h-44 rounded-b-none border-0 border-b border-border"
        />
      )}
      <div className="flex flex-1 flex-col gap-2.5 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-indigo/8 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-indigo">
            {product.brand}
          </span>
          <span className="inline-flex items-center rounded-full bg-orange/10 px-2.5 py-1 text-[11px] font-semibold text-orange-deep">
            {categoryLabel}
          </span>
        </div>
        <h3 className="text-base font-bold leading-snug text-ink">{product.name}</h3>
        <p className="line-clamp-2 text-[13px] leading-relaxed text-muted">{product.tagline}</p>
        <div className="mt-auto flex flex-col gap-2 pt-2">
          <Link href={productHref(product)} className={buttonClassName('secondary', 'sm', 'w-full')}>
            {viewLabel}
          </Link>
          <a
            href={whatsappUrl(`Hello! I'm interested in ${product.name}. Please share price and availability details.`)}
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
