import Image from 'next/image';
import {ArrowRight, Columns2} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {productHref, type Href, type Product} from '@/data/products';
import {COMPARABLE} from '@/data/stats';
import {uspsFor, usesLine} from '@/data/usps';
import {CATEGORY_COPY, SUB_NAMES} from '@/content/categories';
import {BrandLogo} from '@/components/site/BrandLogo';
import {WhatsAppIcon} from '@/components/ui/Button';
import {quoteWhatsappUrl} from '@/lib/quote';
import {cn} from '@/lib/cn';
import {UspChips} from './product/UspIcon';

/** Is this visual a cut-out on white (stage it) or a full-bleed material shot? */
function staged(p: Product) {
  return p.category === 'smart-locks' || p.cardImage.includes('/products/') || p.cardImage.includes('/decor-thumbs/');
}

/** Verified type label: the grade for plywood/MDF, the category otherwise. */
export function productTypeLabel(p: Product): string {
  return p.category === 'mdf' || p.category === 'plywood' ? `${CATEGORY_COPY[p.category].short} · ${SUB_NAMES[p.subcategory]}` : CATEGORY_COPY[p.category].short;
}

/** Link to the compare tool with this product preselected (?a=slug). */
export function compareHref(p: Product): Href {
  return {pathname: '/tools/[tool]', params: {tool: 'compare'}, query: {a: p.slug}} as Href;
}

export const isComparable = (p: Product) => COMPARABLE.some((c) => c.slug === p.slug);

const action =
  'relative z-10 inline-flex min-h-11 items-center justify-center gap-1.5 rounded-[6px] px-2 text-center text-[12.5px] font-semibold leading-tight text-balance transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue';

/**
 * Product card: staged image on a soft panel, real brand logo, verified type,
 * the product name (full name on 'md', compact name on 'sm'; always wraps,
 * never truncated), 2–3 verified attribute chips
 * (src/data/usps.ts), a uses line and actions — Details, Compare, Get price.
 * The whole card links to the product (stretched link); actions sit above it.
 *
 * size 'md' (catalogue grids): phones lay the card out horizontally (image
 * beside text, actions full-width below) so several fit on screen; ≥640px it
 * stacks. size 'sm' (rails, tools): compact, chips + price only.
 */
export function ProductTile({
  product: p,
  size = 'md',
  priority = false,
  className,
  showActions
}: {
  product: Product;
  size?: 'sm' | 'md';
  priority?: boolean;
  className?: string;
  showActions?: boolean;
}) {
  const isStaged = staged(p);
  const md = size === 'md';
  const actions = showActions ?? md;
  const usps = uspsFor(p, md ? 3 : 2);
  const quote = quoteWhatsappUrl({product: p.name, source: 'Product card'});
  const comparable = isComparable(p);

  return (
    <article
      className={cn(
        'tile-lift tile-zoom group relative grid h-full rounded-[10px] border border-line bg-white',
        md ? 'grid-cols-[minmax(0,38%)_minmax(0,1fr)] grid-rows-[1fr_auto] sm:grid-cols-1 sm:grid-rows-[auto_1fr_auto]' : 'grid-cols-1 grid-rows-[auto_1fr]',
        className
      )}
    >
      <div
        className={cn(
          'relative overflow-hidden bg-bg-soft',
          md ? 'm-2 aspect-square rounded-[7px] sm:m-0 sm:aspect-[4/3] sm:rounded-b-none sm:rounded-t-[9px]' : 'aspect-[4/3] rounded-t-[9px]',
          isStaged && 'bg-grid'
        )}
        data-reveal="image"
      >
        <Image
          src={p.cardImage}
          alt={p.name}
          fill
          priority={priority}
          sizes={md ? '(max-width: 640px) 38vw, (max-width: 1280px) 33vw, 320px' : '(max-width: 768px) 60vw, 240px'}
          className={cn(isStaged ? 'object-contain p-3 mix-blend-multiply sm:p-5' : 'object-cover')}
        />
        {p.decorCode && <span className="t-label absolute left-2 top-2 rounded-[3px] bg-white/90 px-1.5 py-0.5 text-ink">{p.decorCode}</span>}
      </div>

      <div className={cn('flex min-w-0 flex-col', md ? 'gap-2 py-3 pr-3 sm:p-4' : 'gap-2 p-3')}>
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <BrandLogo brand={p.brand} height={p.brand === 'Action TESA' ? (md ? 20 : 18) : md ? 15 : 14} />
          <span className="t-label text-steel">{productTypeLabel(p)}</span>
        </div>
        <h3 className={cn('font-semibold leading-snug text-ink text-pretty', md ? 'text-[15px] sm:text-[16px]' : 'text-[14px]')}>
          <Link
            href={productHref(p)}
            className="after:absolute after:inset-0 after:rounded-[10px] after:content-[''] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-blue group-hover:text-indigo"
          >
            {md ? p.name : p.short}
          </Link>
        </h3>
        <UspChips usps={usps} size="sm" />
        {md && p.uses.length > 0 && (
          <p className="text-[12.5px] leading-snug text-muted">
            <span className="font-medium text-ink">For </span>
            {usesLine(p)}
          </p>
        )}
        {!actions && (
          <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-1">
            <span className="text-[12.5px] font-semibold text-indigo">Details →</span>
            <a
              href={quote}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Get price for ${p.name} on WhatsApp`}
              className={cn(action, 'border border-line text-ink hover:border-wa hover:text-wa')}
            >
              <WhatsAppIcon className="h-3.5 w-3.5 text-wa" />
              Price
            </a>
          </div>
        )}
      </div>

      {actions && (
        <div className={cn('flex flex-wrap gap-1.5 border-t border-line p-2', md && 'col-span-2 sm:col-span-1 sm:p-3')} data-testid="tile-actions">
          <Link href={productHref(p)} className={cn(action, 'flex-1 text-indigo hover:bg-surface-blue')} aria-label={`Details: ${p.name}`}>
            Details <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
          {comparable && (
            <Link href={compareHref(p)} className={cn(action, 'flex-1 text-ink hover:bg-bg-soft hover:text-indigo')} aria-label={`Compare ${p.name}`}>
              <Columns2 className="h-3.5 w-3.5" aria-hidden /> Compare
            </Link>
          )}
          <a
            href={quote}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Get price for ${p.name} on WhatsApp`}
            className={cn(action, 'flex-1 border border-orange/40 text-orange-ink hover:border-orange hover:bg-orange hover:text-white')}
          >
            <WhatsAppIcon className="h-3.5 w-3.5" /> Get price
          </a>
        </div>
      )}
    </article>
  );
}
