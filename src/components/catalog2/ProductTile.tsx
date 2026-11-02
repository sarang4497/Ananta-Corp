import Image from 'next/image';
import {Link} from '@/i18n/navigation';
import {productHref, type Product} from '@/data/products';
import {CATEGORY_COPY, SUB_NAMES} from '@/content/categories';
import {WA} from '@/content/site';
import {BrandLogo} from '@/components/site/BrandLogo';
import {WhatsAppIcon} from '@/components/ui/Button';
import {whatsappUrl} from '@/lib/whatsapp';
import {cn} from '@/lib/cn';

/** Is this visual a cut-out on white (stage it) or a full-bleed material shot? */
function staged(p: Product) {
  return p.category === 'smart-locks' || p.cardImage.includes('/products/');
}

/**
 * Compact product tile: staged image, real brand logo, name, verified type,
 * one line, and a quote action. The whole tile links to the product (stretched
 * link); the WhatsApp quote button sits above it. ~280px tall at phone width
 * — several products visible per screen.
 */
export function ProductTile({
  product: p,
  size = 'md',
  priority = false,
  className
}: {
  product: Product;
  size?: 'sm' | 'md';
  priority?: boolean;
  className?: string;
}) {
  const isStaged = staged(p);
  const type = p.category === 'mdf' || p.category === 'plywood' ? SUB_NAMES[p.subcategory] : CATEGORY_COPY[p.category].short;
  return (
    <article
      className={cn(
        'tile-lift tile-zoom group relative flex h-full flex-col overflow-hidden rounded-[8px] border border-line bg-white',
        className
      )}
    >
      <div className={cn('relative aspect-[4/3] overflow-hidden', isStaged ? 'bg-grid bg-bg-soft' : 'bg-bg-soft')}>
        <Image
          src={p.cardImage}
          alt={p.name}
          fill
          priority={priority}
          sizes={size === 'sm' ? '(max-width: 768px) 45vw, 220px' : '(max-width: 640px) 70vw, (max-width: 1280px) 30vw, 300px'}
          className={cn(isStaged ? 'object-contain p-4 mix-blend-multiply' : 'object-cover')}
        />
        {p.decorCode && (
          <span className="t-label absolute left-2 top-2 rounded-[3px] bg-white/90 px-1.5 py-0.5 text-ink">{p.decorCode}</span>
        )}
      </div>
      <div className={cn('flex flex-1 flex-col', size === 'sm' ? 'gap-1.5 p-3' : 'gap-2 p-4')}>
        <div className="flex h-5 items-center justify-between gap-2">
          <BrandLogo brand={p.brand} height={p.brand === 'Action TESA' ? 20 : 15} />
          <span className="t-label truncate text-steel">{type}</span>
        </div>
        <h3 className={cn('font-semibold leading-snug text-ink', size === 'sm' ? 'text-[14px]' : 'text-[15.5px]')}>
          <Link href={productHref(p)} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none group-focus-within:text-indigo">
            {p.short}
          </Link>
        </h3>
        {size === 'md' && <p className="text-[13px] leading-snug text-muted">{p.summary}</p>}
        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <span className="text-[12.5px] font-semibold text-indigo">Details →</span>
          <a
            href={whatsappUrl(WA.product(p.name))}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Get price for ${p.name} on WhatsApp`}
            className="relative z-10 inline-flex h-9 items-center gap-1.5 rounded-[5px] border border-line px-2.5 text-[12px] font-semibold text-ink transition-colors duration-150 hover:border-wa hover:text-wa"
          >
            <WhatsAppIcon className="h-3.5 w-3.5 text-wa" />
            Price
          </a>
        </div>
      </div>
    </article>
  );
}
