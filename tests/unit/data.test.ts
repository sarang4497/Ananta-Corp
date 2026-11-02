import {describe, expect, it} from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import {CATEGORIES, PRODUCTS} from '@/data/products';
import {DECORS} from '@/data/decors';
import {COMPARABLE, STATS, compare} from '@/data/stats';
import {AUDIENCES, SELECTOR, TESTIMONIALS, COMPANY} from '@/content/site';

const pub = (p: string) => path.resolve(__dirname, '../../public', p.replace(/^\//, ''));

describe('catalogue integrity', () => {
  it('counts are computed from data', () => {
    expect(STATS.products).toBe(PRODUCTS.length);
    expect(STATS.decors).toBe(DECORS.length);
    expect(STATS.categories).toBe(CATEGORIES.length);
  });
  it('slugs are unique and preserve the original URLs', () => {
    expect(new Set(PRODUCTS.map((p) => p.slug)).size).toBe(PRODUCTS.length);
    for (const p of PRODUCTS) expect(CATEGORIES.find((c) => c.slug === p.category)?.subs.some((s) => s.slug === p.subcategory), p.slug).toBe(true);
  });
  it('every referenced image exists', () => {
    for (const p of PRODUCTS) for (const im of [p.cardImage, ...p.images]) expect(fs.existsSync(pub(im)), im).toBe(true);
    for (const c of CATEGORIES) expect(fs.existsSync(pub(c.image)), c.image).toBe(true);
    for (const d of DECORS) expect(fs.existsSync(pub(d.image)), d.image).toBe(true);
  });
  it('manufacturer standards always name the manufacturer that matches the brand', () => {
    for (const p of PRODUCTS) for (const s of p.standards) expect(p.brand.startsWith(s.by === 'Duroply' ? 'Duroply' : 'Action'), p.slug).toBe(true);
  });
  it('smart locks carry no invented specs', () => {
    for (const p of PRODUCTS.filter((x) => x.category === 'smart-locks' && x.slug !== 'sliding-fingerprint-door-lock')) {
      expect(p.specs.map(([k]) => k).sort()).toEqual(['Brand', 'Type']);
    }
  });
  it('HDHMR does not display the contradicted warranty image', () => {
    const h = PRODUCTS.find((p) => p.slug === 'action-tesa-hdhmr-board')!;
    expect([h.cardImage, ...h.images].some((i) => i.includes('action-tesa-hdhmr-board.jpg'))).toBe(false);
  });
});

describe('interactive tools use only real data', () => {
  it('selector picks exist', () => {
    for (const a of SELECTOR) for (const z of a.zones) for (const s of z.picks) expect(PRODUCTS.some((p) => p.slug === s), s).toBe(true);
  });
  it('audience paths map to real categories', () => {
    for (const a of AUDIENCES) for (const c of a.categories) expect(CATEGORIES.some((x) => x.slug === c)).toBe(true);
  });
  it('comparison only returns rows both products have', () => {
    for (const a of COMPARABLE)
      for (const b of COMPARABLE) {
        if (a === b) continue;
        const rows = compare(a, b);
        if (rows) for (const r of rows) expect(r.a && r.b).toBeTruthy();
      }
    // smart locks are never comparable
    expect(COMPARABLE.some((p) => p.category === 'smart-locks')).toBe(false);
  });
});

describe('first-party facts', () => {
  it('testimonials are the 6 originals, no extra fields', () => {
    expect(TESTIMONIALS).toHaveLength(6);
    for (const t of TESTIMONIALS) expect(Object.keys(t).sort()).toEqual(['name', 'quote', 'role']);
  });
  it('one postal code only', () => {
    expect(COMPANY.postalCode).toBe('382405');
    expect(COMPANY.addressLines.join(' ')).not.toContain('382425');
  });
});
