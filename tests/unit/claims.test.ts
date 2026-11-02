import {describe, expect, it} from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

/**
 * CONTENT TRUTH GATE (research/ANANTA_CONTENT_TRUTH.md).
 * Scans every public-facing source for claims that were REMOVED as
 * unsupported. Product-level manufacturer claims are allowed only inside
 * src/data/products.ts `standards` with the manufacturer named.
 */
const ROOT = path.resolve(__dirname, '../..');
const walk = (d: string): string[] =>
  fs.readdirSync(d, {withFileTypes: true}).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const PUBLIC = [...walk(path.join(ROOT, 'src/app')), ...walk(path.join(ROOT, 'src/components')), ...walk(path.join(ROOT, 'src/content')), ...walk(path.join(ROOT, 'src/data')), ...walk(path.join(ROOT, 'src/lib')), path.join(ROOT, 'messages/en.json')].filter((f) =>
  /\.(tsx?|json|md)$/.test(f)
);
const read = (f: string) => fs.readFileSync(f, 'utf8');
// strip code comments (provenance notes legitimately name removed claims)
const strip = (s: string) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');

const BANNED: [RegExp, string][] = [
  [/decades of experience/i, 'conflicts with Since 2020'],
  [/15\+? years/i, 'unconfirmed experience claim'],
  [/founded in 2024/i, 'fabricated'],
  [/CARB/, 'unverified for the listed grades'],
  [/\bE1\b|\bE2\b/, 'unverified emission class'],
  [/10[- ]year warranty/i, 'contradicted by manufacturer'],
  [/100% (boiling )?water ?proof|100% BWP/i, 'overstated (Duroply: "BWP grade")'],
  [/weather[- ]resistant/i, 'contradicted for exterior MDF'],
  [/melamine-fortified/i, 'not on manufacturer source'],
  [/certified materials/i, 'generic badge removed'],
  [/same[- ]day|within 24 hours/i, 'invented response/delivery promise'],
  [/\b(best in india|world[- ]class|unmatched|game[- ]changing|revolutionary|industry leader|leading supplier|largest stock)\b/i, 'banned superlative'],
  [/exclusive distributor|official (gujarat )?distributor/i, 'overstated relationship'],
  [/aggregateRating|ratingValue/i, 'no invented ratings']
];

describe('no unsupported public claims', () => {
  for (const f of PUBLIC) {
    const rel = path.relative(ROOT, f);
    it(rel, () => {
      let text = strip(read(f));
      // Knowledge files may name removed claims inside "Do NOT …" instructions.
      if (rel.startsWith('src/content/knowledge')) text = text.replace(/Do NOT[^\n]*(\n  [^\n]*)?/g, '');
      const hits = BANNED.filter(([re]) => re.test(text)).map(([re, why]) => `${re} — ${why}`);
      expect(hits).toEqual([]);
    });
  }
});

describe('German technology appears only as an attributed Action TESA product claim', () => {
  it('not in global copy', () => {
    for (const f of PUBLIC) {
      if (f.includes('knowledge') || f.includes('src/data/products.ts')) continue;
      expect(strip(read(f)).match(/german technology/gi) ?? [], path.relative(ROOT, f)).toEqual([]);
    }
  });
});

describe('Tenon is never called authorized', () => {
  it('BRAND_ASSETS relation', async () => {
    const {BRAND_ASSETS} = await import('@/content/site');
    expect(BRAND_ASSETS['Tenon Smart Lock'].relation).not.toMatch(/authori/i);
  });
});
