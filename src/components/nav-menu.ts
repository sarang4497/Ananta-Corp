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

type Href = ComponentProps<typeof Link>['href'];

/** Category icon per key — shared by the mega-menu and the homepage grid. */
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
 * The six product categories + their subcategories — one source of truth for
 * the Products mega-menu, the mobile drawer tree, and the footer links.
 * Routes match the catalog pages built in later batches.
 */
export const PRODUCT_CATEGORIES: ProductCategory[] = [
  {
    key: 'plywood',
    href: '/products/plywood',
    subs: [
      {key: 'moistureResistant', href: '/products/plywood/moisture-resistant'},
      {key: 'boilingWaterProof', href: '/products/plywood/boiling-water-proof'}
    ]
  },
  {
    key: 'mdf',
    href: '/products/mdf',
    subs: [
      {key: 'interiorGrade', href: '/products/mdf/interior-grade'},
      {key: 'exteriorGrade', href: '/products/mdf/exterior-grade'},
      {key: 'hdhmr', href: '/products/mdf/hdhmr'}
    ]
  },
  {
    key: 'moistMaster',
    href: '/products/high-moisture-resistant-board-moist-master',
    subs: []
  },
  {
    key: 'prelam',
    href: '/products/pre-laminated-particle-board',
    subs: []
  },
  {
    key: 'flushDoor',
    href: '/products/flush-door',
    subs: []
  },
  {
    key: 'smartLocks',
    href: '/products/smart-locks',
    subs: []
  }
];

/** Partner brands — shown in the Partners dropdown and on /partners. */
export const PARTNERS: NavLeaf[] = [
  {key: 'actionTesa', href: {pathname: '/partners', hash: 'action-tesa'} as Href},
  {key: 'duroply', href: {pathname: '/partners', hash: 'duroply'} as Href},
  {key: 'tenonSmartLock', href: {pathname: '/partners', hash: 'tenon-smart-lock'} as Href}
];
