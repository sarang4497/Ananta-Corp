import {describe, expect, it} from 'vitest';
import {PRODUCTS, type Product} from '@/data/products';
import {APPLICATIONS, EXPOSURE_LABEL} from '@/content/site';
import {specBlocksFor, uspsFor, type Usp} from '@/data/usps';

/** Same banned patterns as tests/unit/claims.test.ts (copy kept in sync). */
const BANNED = [
  /decades of experience/i,
  /\d+\+? years/i,
  /founded in 2024/i,
  /CARB/,
  /\bE1\b|\bE2\b/,
  /warranty/i,
  /100% (boiling )?water ?proof|100% BWP/i,
  /weather[- ]resistant/i,
  /melamine-fortified/i,
  /certified/i,
  /same[- ]day|within 24 hours/i,
  /\b(best in india|world[- ]class|unmatched|industry leader|leading supplier|largest stock)\b/i,
  /exclusive distributor|official (gujarat )?distributor/i,
  /german technology/i
];

/** A USP is verified when its value can be traced back to the product record. */
function traced(p: Product, u: Usp): boolean {
  switch (u.source) {
    case 'spec':
      return p.specs.some(([, v]) => v === u.value);
    case 'standard':
      return u.value.split(' · ').every((v) => p.standards.some((s) => s.label === v)) && p.standards.some((s) => u.note === `as stated by ${s.by}`);
    case 'exposure':
      return !!p.exposure && u.value === EXPOSURE_LABEL[p.exposure];
    case 'application':
      return u.value.split(' · ').every((l) => p.uses.includes(l) || APPLICATIONS.some((a) => a.label === l && p.applications.includes(a.key)));
    case 'size': {
      const nums = u.value.replace(' mm', '').split('–');
      return nums.every((n) => p.sizes.some((s) => s.replace(/\s*MM$/, '') === n));
    }
    case 'on-request':
      return !!p.specsOnRequest;
  }
}

describe('USPs are derived from product data only', () => {
  for (const p of PRODUCTS) {
    it(p.slug, () => {
      const usps = uspsFor(p);
      expect(usps.length).toBeGreaterThanOrEqual(2);
      expect(usps.length).toBeLessThanOrEqual(4);
      expect(new Set(usps.map((u) => u.key)).size).toBe(usps.length);
      for (const u of [...usps, ...specBlocksFor(p)]) {
        expect(u.value.trim(), u.key).not.toBe('');
        expect(traced(p, u), `${u.key}: ${u.value}`).toBe(true);
        for (const re of BANNED) expect(`${u.label} ${u.value} ${u.note ?? ''}`, re.source).not.toMatch(re);
      }
    });
  }

  it('respects max', () => {
    for (const p of PRODUCTS) expect(uspsFor(p, 2).length).toBeLessThanOrEqual(2);
  });

  it('no USP or block for missing data', () => {
    for (const p of PRODUCTS) {
      const all = [...uspsFor(p, 10), ...specBlocksFor(p)];
      if (!p.exposure) expect(all.some((u) => u.source === 'exposure'), p.slug).toBe(false);
      if (!p.standards.length) expect(all.some((u) => u.source === 'standard'), p.slug).toBe(false);
      if (!p.sizes.length) expect(all.some((u) => u.source === 'size'), p.slug).toBe(false);
      if (!p.specs.some(([k]) => k === 'Density')) expect(all.some((u) => u.key === 'density'), p.slug).toBe(false);
    }
  });

  it('locks with specs on request get only existing data plus "Specs on request"', () => {
    for (const p of PRODUCTS.filter((x) => x.specsOnRequest)) {
      const usps = uspsFor(p);
      expect(usps.some((u) => u.value === 'Specs on request'), p.slug).toBe(true);
      expect(usps.every((u) => ['spec', 'application', 'on-request'].includes(u.source)), p.slug).toBe(true);
      expect(specBlocksFor(p).some((b) => b.key === 'grade' || b.key === 'density' || b.key === 'thickness'), p.slug).toBe(false);
    }
  });

  it('standards are always attributed to the manufacturer', () => {
    for (const p of PRODUCTS)
      for (const u of [...uspsFor(p, 10), ...specBlocksFor(p)].filter((x) => x.source === 'standard')) expect(u.note).toMatch(/^as stated by (Duroply|Action TESA)$/);
  });
});
