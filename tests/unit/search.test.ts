import {describe, expect, it} from 'vitest';
import {GROUP_ORDER, POPULAR_QUERIES, SEARCH_INDEX, groupResults, levenshtein, normalise, search, tokenize} from '@/data/search';
import {PRODUCTS, CATEGORIES} from '@/data/products';
import {DECORS} from '@/data/decors';
import {TOOLS} from '@/content/tools';

const top = (q: string) => search(q)[0]?.doc;

describe('normalise / tokenize', () => {
  it('lower-cases, strips diacritics and separators', () => {
    expect(normalise('Décor 3009–Walnut & Oak')).toBe('decor 3009 walnut and oak');
    expect(tokenize('  MR/BWP  ')).toEqual(['mr', 'bwp']);
    expect(tokenize('')).toEqual([]);
  });
});

describe('levenshtein', () => {
  it('computes edit distance with early exit', () => {
    expect(levenshtein('plywood', 'plywood')).toBe(0);
    expect(levenshtein('plywod', 'plywood')).toBe(1);
    expect(levenshtein('kitten', 'sitting')).toBe(3);
    expect(levenshtein('abcdef', 'uvwxyz', 1)).toBeGreaterThan(1);
  });
});

describe('index', () => {
  it('covers every product, category, tool and unique décor', () => {
    const ids = new Set(SEARCH_INDEX.map((d) => d.id));
    for (const p of PRODUCTS) expect(ids.has(`product:${p.slug}`)).toBe(true);
    for (const c of CATEGORIES) expect(ids.has(`category:${c.slug}`)).toBe(true);
    for (const t of TOOLS) expect(ids.has(`tool:${t.slug}`)).toBe(true);
    const uniqueDecors = new Set(DECORS.map((d) => `${d.code}-${d.name}`)).size;
    expect(SEARCH_INDEX.filter((d) => d.kind === 'decor')).toHaveLength(uniqueDecors);
    expect(ids.size).toBe(SEARCH_INDEX.length);
  });
  it('has brands, applications and key pages', () => {
    const kinds = new Set(SEARCH_INDEX.map((d) => d.kind));
    for (const k of ['brand', 'application', 'page', 'subcategory']) expect(kinds.has(k as never)).toBe(true);
  });
});

describe('search', () => {
  it('BWP → Duroply BWP plywood first', () => {
    expect(top('BWP')?.id).toBe('product:duroply-bwp-boiling-water-proof-plywood');
    expect(top('bwp plywood')?.id).toBe('product:duroply-bwp-boiling-water-proof-plywood');
  });
  it('is case and accent insensitive', () => {
    expect(top('hdhmr')?.id).toBe(top('HDHMR')?.id);
    expect(search('decor').length).toBe(search('décor').length);
  });
  it('matches prefixes', () => {
    expect(search('plyw').some((r) => r.doc.id === 'category:plywood')).toBe(true);
  });
  it('tolerates one typo in words of 5+ letters', () => {
    expect(search('plywod').some((r) => r.doc.id === 'category:plywood')).toBe(true);
    expect(search('moist mastr').some((r) => r.doc.id === 'product:action-tesa-moist-master-hmr-board')).toBe(true);
  });
  it('does not fuzz short words', () => {
    // "mdx" is not "mdf"
    expect(search('mdx')).toEqual([]);
  });
  it('finds a décor and the prelam product by code', () => {
    const r = search('3009');
    expect(r.some((x) => x.doc.kind === 'decor')).toBe(true);
    expect(r.some((x) => x.doc.kind === 'product' && x.doc.id.includes('3009'))).toBe(true);
  });
  it('finds brands, applications and tools', () => {
    expect(search('tenon').some((r) => r.doc.kind === 'brand')).toBe(true);
    expect(search('kitchens').some((r) => r.doc.kind === 'application')).toBe(true);
    expect(search('compare').some((r) => r.doc.kind === 'tool')).toBe(true);
  });
  it('AND semantics: every word must match', () => {
    expect(search('plywood zzzz')).toEqual([]);
    expect(search('')).toEqual([]);
    expect(search('   ')).toEqual([]);
  });
  it('is deterministic', () => {
    expect(search('board').map((r) => r.doc.id)).toEqual(search('board').map((r) => r.doc.id));
  });
  it('groups in display order with a per-group cap', () => {
    const g = groupResults(search('board'), 3);
    const order = g.map((x) => GROUP_ORDER.indexOf(x.group));
    expect([...order].sort((a, b) => a - b)).toEqual(order);
    for (const x of g) expect(x.items.length).toBeLessThanOrEqual(3);
  });
  it('every popular chip returns results', () => {
    for (const q of POPULAR_QUERIES) expect(search(q).length, q).toBeGreaterThan(0);
  });
});
