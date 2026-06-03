import type {ComponentProps} from 'react';
import {
  Layers,
  Boxes,
  Droplets,
  Palette,
  DoorClosed,
  Fingerprint,
  type LucideIcon
} from 'lucide-react';
import type {Link} from '@/i18n/navigation';
import {CATEGORIES, categoryHref, subcategoryHref} from '@/data/products';

type Href = ComponentProps<typeof Link>['href'];

/** Category icon per key — shared by the mega-menu, homepage grid and pages. */
export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  plywood: Layers,
  mdf: Boxes,
  moistMaster: Droplets,
  prelam: Palette,
  flushDoor: DoorClosed,
  smartLocks: Fingerprint
};

export type NavLeaf = {
  /** Translation key in the `nav` namespace. */
  key: string;
  href: Href;
};

export type ProductCategory = NavLeaf & {subs: NavLeaf[]};

/**
 * The six product categories + their subcategories for navigation — derived
 * from the catalog data so menus, footer and pages always agree.
 * Single-subcategory groups (Moist Master, Prelam, Flush Door, Smart Locks)
 * link straight to the category page without a redundant sub level.
 */
export const PRODUCT_CATEGORIES: ProductCategory[] = CATEGORIES.map((cat) => ({
  key: cat.key,
  href: categoryHref(cat.slug),
  subs:
    cat.subs.length > 1
      ? cat.subs.map((sub) => ({key: sub.key, href: subcategoryHref(cat.slug, sub.slug)}))
      : []
}));

/** Partner brands — shown in the Partners dropdown and on /partners. */
export const PARTNERS: NavLeaf[] = [
  {key: 'actionTesa', href: {pathname: '/partners', hash: 'action-tesa'} as Href},
  {key: 'duroply', href: {pathname: '/partners', hash: 'duroply'} as Href},
  {key: 'tenonSmartLock', href: {pathname: '/partners', hash: 'tenon-smart-lock'} as Href}
];
