import {describe, expect, it} from 'vitest';
import {PRODUCTS} from '@/data/products';
import {DECORS} from '@/data/decors';
import {COMPARABLE, compare} from '@/data/stats';
import {SELECTOR} from '@/content/site';
import {TOOLS} from '@/content/tools';
import {
  PROJECTS,
  SHEET,
  SHEET_PRODUCTS,
  TOOL_PAGES,
  categoriesForProject,
  comparablePair,
  piecesAreaSqFt,
  productsForProject,
  resolvePair,
  sheetsNeeded,
  sqFtToSqM,
  toFeet,
  toSqFt
} from '@/content/tools-data';

describe('sheet helper — unit conversion', () => {
  it('converts lengths to feet', () => {
    expect(toFeet(1, 'ft')).toBe(1);
    expect(toFeet(12, 'in')).toBeCloseTo(1, 10);
    expect(toFeet(304.8, 'mm')).toBeCloseTo(1, 10);
    expect(toFeet(30.48, 'cm')).toBeCloseTo(1, 10);
    expect(toFeet(2438.4, 'mm')).toBeCloseTo(8, 10);
    expect(toFeet(0.3048, 'm')).toBeCloseTo(1, 10);
  });
  it('converts areas to sq ft and back', () => {
    expect(toSqFt(10, 'sqft')).toBe(10);
    expect(toSqFt(1, 'sqm')).toBeCloseTo(10.7639, 4);
    expect(sqFtToSqM(toSqFt(7.5, 'sqm'))).toBeCloseTo(7.5, 10);
  });
});

describe('sheet helper — area and sheet maths', () => {
  it('sums piece areas with quantities', () => {
    expect(piecesAreaSqFt([{length: 8, width: 4, qty: 1}], 'ft')).toBe(32);
    expect(piecesAreaSqFt([{length: 2, width: 1.5, qty: 4}, {length: 6, width: 2, qty: 2}], 'ft')).toBe(36);
    // 2440 × 1220 mm ≈ one 8 × 4 ft sheet.
    expect(piecesAreaSqFt([{length: 2440, width: 1220, qty: 1}], 'mm')).toBeCloseTo(32.04, 2);
    expect(piecesAreaSqFt([{length: 60, width: 45, qty: 10}], 'cm')).toBeCloseTo(29.06, 2);
  });
  it('ignores invalid rows', () => {
    expect(piecesAreaSqFt([{length: NaN, width: 4, qty: 1}, {length: -2, width: 4, qty: 1}, {length: 2, width: 2, qty: 0}], 'ft')).toBe(0);
  });
  it('sheets = ceil(area × (1 + wastage) / 32)', () => {
    expect(SHEET.areaSqFt).toBe(SHEET.lengthFt * SHEET.widthFt);
    expect(sheetsNeeded(32, 0)).toBe(1);
    expect(sheetsNeeded(32, 10)).toBe(2);
    expect(sheetsNeeded(100, 10)).toBe(4); // 110 / 32 = 3.44
    expect(sheetsNeeded(320, 0)).toBe(10);
    expect(sheetsNeeded(320, 10)).toBe(11);
    expect(sheetsNeeded(29.0909, 10)).toBe(1); // 31.99999 → floating noise must not add a sheet
    expect(sheetsNeeded(0, 10)).toBe(0);
    expect(sheetsNeeded(-5, 10)).toBe(0);
    expect(sheetsNeeded(10, NaN)).toBe(1);
  });
});

describe('sheet helper — only the verified sheet size', () => {
  it('offers only products whose specs list 8 × 4 ft', () => {
    expect(SHEET_PRODUCTS.length).toBeGreaterThan(0);
    for (const p of SHEET_PRODUCTS) expect(p.specs).toContainEqual(['Sheet size', '8 × 4 ft']);
    expect(SHEET_PRODUCTS.some((p) => p.category === 'flush-door')).toBe(false);
  });
});

describe('requirement builder mapping', () => {
  it('every project maps to at least one category, derived from product applications', () => {
    for (const proj of PROJECTS) {
      const cats = categoriesForProject(proj.key);
      expect(cats.length, proj.key).toBeGreaterThan(0);
      for (const c of cats) expect(productsForProject(proj.key, c).length).toBeGreaterThan(0);
    }
  });
  it('doors never offer sheet boards; bulk boards never offer doors or locks', () => {
    expect(categoriesForProject('doors')).toEqual(['flush-door', 'smart-locks']);
    expect(categoriesForProject('bulk')).not.toContain('flush-door');
    expect(categoriesForProject('bulk')).not.toContain('smart-locks');
  });
  it('kitchen offers only categories with a kitchen product', () => {
    for (const c of categoriesForProject('kitchen'))
      expect(PRODUCTS.some((p) => p.category === c && p.applications.includes('kitchens'))).toBe(true);
  });
});

describe('compare + selector helpers', () => {
  it('resolvePair falls back safely', () => {
    const [a, b] = resolvePair('nope', 'also-nope');
    expect(a).not.toBe(b);
    expect(COMPARABLE.some((p) => p.slug === a)).toBe(true);
    const [x, y] = resolvePair('action-tesa-hdhmr-board', null);
    expect(x).toBe('action-tesa-hdhmr-board');
    expect(y).not.toBe(x);
    expect(resolvePair('action-tesa-hdhmr-board', 'action-tesa-hdhmr-board')[1]).not.toBe('action-tesa-hdhmr-board');
  });
  it('comparablePair returns only pairs compare() accepts', () => {
    for (const app of SELECTOR)
      for (const z of app.zones) {
        const pair = comparablePair(z.picks);
        if (pair) {
          const [a, b] = pair.map((s) => PRODUCTS.find((p) => p.slug === s)!);
          expect(compare(a, b)).not.toBeNull();
        }
      }
  });
});

describe('tools registry + décor data', () => {
  it('every tool has page copy; routed tools have FAQs', () => {
    for (const t of TOOLS) {
      expect(TOOL_PAGES[t.slug]).toBeTruthy();
      if (t.route) expect(TOOL_PAGES[t.slug].faqs.length).toBeGreaterThanOrEqual(2);
    }
  });
  it('décor codes are unique', () => {
    expect(new Set(DECORS.map((d) => d.code)).size).toBe(DECORS.length);
  });
});
