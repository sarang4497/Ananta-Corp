/**
 * Computed catalogue truth. Every number the site shows about range depth is
 * derived here from the data — never hard-coded in copy.
 */
import {CATEGORIES, PRODUCTS, type Application, type Brand, type CategorySlug, type Product} from './products';
import {DECORS, type DecorType} from './decors';
import {EXPOSURE_LABEL} from '@/content/site';

export const STATS = {
  products: PRODUCTS.length,
  categories: CATEGORIES.length,
  brands: new Set(PRODUCTS.map((p) => p.brand)).size,
  decors: DECORS.length,
  sizeOptions: new Set(PRODUCTS.flatMap((p) => p.sizes.filter((s) => /MM$/.test(s)))).size
};

export const countByCategory = (slug: CategorySlug) => PRODUCTS.filter((p) => p.category === slug).length;
export const countByBrand = (brand: Brand) => PRODUCTS.filter((p) => p.brand === brand).length;
export const countByApplication = (a: Application) => PRODUCTS.filter((p) => p.applications.includes(a)).length;
export const decorCountByType = (t: DecorType) => DECORS.filter((d) => d.type === t).length;

export const BRANDS: Brand[] = ['Duroply', 'Action TESA', 'Tenon Smart Lock'];

/** Distinct thickness options per category (for the library preview). */
export function thicknessesFor(slug: CategorySlug): string[] {
  const all = PRODUCTS.filter((p) => p.category === slug).flatMap((p) => p.sizes.filter((s) => /MM$/.test(s)));
  return [...new Set(all)].sort((a, b) => parseFloat(a) - parseFloat(b));
}

// ── Comparison (real structured attributes only) ─────────────────────────────

export type CompareRow = {label: string; a: string; b: string};

function specValue(p: Product, label: string): string | undefined {
  return p.specs.find(([k]) => k === label)?.[1];
}

/** Attribute extractors — each returns undefined when the value is unknown. */
const FIELDS: {label: string; get: (p: Product) => string | undefined}[] = [
  {label: 'Brand', get: (p) => p.brand},
  {label: 'Type', get: (p) => specValue(p, 'Grade') ?? specValue(p, 'Board')},
  {label: 'Exposure', get: (p) => (p.exposure ? EXPOSURE_LABEL[p.exposure] : undefined)},
  {label: 'Density', get: (p) => specValue(p, 'Density')},
  {label: 'Bonding resin', get: (p) => specValue(p, 'Bonding resin')},
  {label: 'Construction', get: (p) => specValue(p, 'Construction')},
  {label: 'Surface', get: (p) => specValue(p, 'Surface') ?? specValue(p, 'Finishes')},
  {
    label: 'Standard / property',
    get: (p) => (p.standards.length ? p.standards.map((s) => `${s.label} (${s.by})`).join(', ') : undefined)
  },
  {
    label: 'Thickness options',
    get: (p) => (p.sizes.some((s) => /MM$/.test(s)) ? p.sizes.map((s) => s.replace(' MM', '')).join(' · ') + ' mm' : undefined)
  },
  {label: 'Best for', get: (p) => (p.uses.length ? p.uses.slice(0, 4).join(', ') : undefined)}
];

/** Products that have enough verified structured data to be compared. */
export const COMPARABLE = PRODUCTS.filter(
  (p) => !p.specsOnRequest && FIELDS.filter((f) => f.get(p) !== undefined).length >= 5
);

/**
 * Rows where BOTH products have a value. If fewer than 4 fields overlap the
 * pair is not comparable and the UI says so (no invented comparisons).
 */
export function compare(a: Product, b: Product): CompareRow[] | null {
  const rows = FIELDS.map((f) => ({label: f.label, a: f.get(a), b: f.get(b)})).filter(
    (r): r is CompareRow => r.a !== undefined && r.b !== undefined
  );
  return rows.length >= 4 ? rows : null;
}
