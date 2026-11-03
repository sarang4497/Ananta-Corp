import {describe, expect, it} from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import {BLOG_CATEGORY_LABEL, POSTS, blogCategoriesInUse, postBySlug, postsForProduct, relatedPostsFor, tocFor} from '@/content/blog';
import {blockText, stripInline, wordCount} from '@/content/blog/define';
import {PRODUCTS, productPath} from '@/data/products';
import {TOOLS} from '@/content/tools';
import {articleJsonLd, faqJsonLd} from '@/lib/jsonld-article';

const ROOT = path.resolve(__dirname, '../..');
const PUBLIC_DIR = path.join(ROOT, 'public');
const productSlugs = new Set(PRODUCTS.map((p) => p.slug));
const toolSlugs = new Set(TOOLS.map((t) => t.slug));

/** Same banned-claim list as tests/unit/claims.test.ts, plus blog-specific overstatements. */
const BANNED: RegExp[] = [
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
  /\b(best in india|world[- ]class|unmatched|game[- ]changing|revolutionary|industry leader|leading supplier|largest stock|number one|no\. ?1)\b/i,
  /exclusive distributor|official (gujarat )?distributor|authori[sz]ed (dealer|distributor)/i,
  /german technology/i,
  /₹|\bRs\.?\s?\d|\bINR\b|per sq ?ft price/i,
  /lifespan|lasts? for \d+|lifetime/i
];

/** Every string a visitor can read in a post. */
function allText(p: (typeof POSTS)[number]): string {
  return [
    p.title,
    p.description,
    p.excerpt,
    p.imageAlt,
    ...p.blocks.map(blockText),
    ...p.blocks.flatMap((b) => (b.type === 'products' && b.title ? [b.title] : [])),
    ...p.faqs.flatMap((f) => [f.q, f.a]),
    ...p.sources.map((s) => s.label)
  ].join('\n');
}

/** Inline [label](href) targets used in body copy. */
function inlineLinks(p: (typeof POSTS)[number]): string[] {
  const out: string[] = [];
  for (const b of p.blocks) for (const m of blockText(b).matchAll(/\]\(([^)]+)\)/g)) out.push(m[1]);
  return out;
}

const VALID_PATHS = new Set<string>([
  '/products',
  '/decor',
  '/contact',
  '/tools',
  '/blog',
  ...PRODUCTS.map(productPath),
  ...PRODUCTS.map((p) => `/products/${p.category}`),
  ...TOOLS.filter((t) => t.route).map((t) => `/tools/${t.slug}`),
  ...POSTS.map((p) => `/blog/${p.slug}`)
]);

describe('blog registry', () => {
  it('has 8–12 posts with unique slugs, newest first', () => {
    expect(POSTS.length).toBeGreaterThanOrEqual(8);
    expect(POSTS.length).toBeLessThanOrEqual(12);
    expect(new Set(POSTS.map((p) => p.slug)).size).toBe(POSTS.length);
    const dates = POSTS.map((p) => p.published);
    expect([...dates].sort().reverse()).toEqual(dates);
  });

  it('includes mdf-vs-plywood (e2e route depends on it)', () => {
    expect(postBySlug('mdf-vs-plywood')).toBeDefined();
  });

  it('derives category chips from posts', () => {
    const cats = blogCategoriesInUse();
    expect(cats.reduce((n, c) => n + c.count, 0)).toBe(POSTS.length);
    for (const c of cats) expect(BLOG_CATEGORY_LABEL[c.category]).toBe(c.label);
  });

  it('postsForProduct and relatedPostsFor are consistent', () => {
    expect(postsForProduct('action-tesa-hdhmr-board').length).toBeGreaterThan(0);
    for (const p of POSTS) {
      const rel = relatedPostsFor(p, 3);
      expect(rel.map((r) => r.slug)).not.toContain(p.slug);
      expect(new Set(rel.map((r) => r.slug)).size).toBe(rel.length);
    }
  });
});

describe.each(POSTS.map((p) => [p.slug, p] as const))('post %s', (_slug, p) => {
  it('has valid metadata', () => {
    expect(p.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    expect(p.description.length).toBeLessThanOrEqual(160);
    expect(p.description.length).toBeGreaterThan(50);
    expect(p.title.length).toBeLessThanOrEqual(70);
    expect(p.published).toMatch(/^2026-(10|11)-\d{2}$/);
    expect(p.audiences.length).toBeGreaterThan(0);
    expect(p.readingMinutes).toBeGreaterThan(0);
  });

  it('is a substantial article (≈700–1300 words)', () => {
    const words = wordCount(p.blocks, p.faqs);
    expect(words).toBeGreaterThanOrEqual(700);
    expect(words).toBeLessThanOrEqual(1400);
  });

  it('every product slug exists in the catalogue', () => {
    expect(p.relatedProducts.length).toBeGreaterThan(0);
    for (const s of p.relatedProducts) expect(productSlugs.has(s), s).toBe(true);
    for (const b of p.blocks) if (b.type === 'products') for (const s of b.slugs) expect(productSlugs.has(s), s).toBe(true);
    expect(p.blocks.some((b) => b.type === 'products')).toBe(true);
  });

  it('related tools and posts exist', () => {
    for (const t of p.relatedTools ?? []) expect(toolSlugs.has(t as never), t).toBe(true);
    for (const s of p.relatedPosts ?? []) {
      expect(postBySlug(s), s).toBeDefined();
      expect(s).not.toBe(p.slug);
    }
  });

  it('images exist under public/', () => {
    const imgs = [p.image, ...p.blocks.flatMap((b) => (b.type === 'figure' ? [b.src] : []))];
    for (const src of imgs) {
      expect(src.startsWith('/images/'), src).toBe(true);
      expect(fs.existsSync(path.join(PUBLIC_DIR, src)), src).toBe(true);
    }
    expect(p.imageAlt.length).toBeGreaterThan(5);
  });

  it('h2 ids are unique slugs and build a table of contents', () => {
    const ids = tocFor(p).map((t) => t.id);
    expect(ids.length).toBeGreaterThanOrEqual(4);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    // ids reserved by the post page itself
    for (const id of ids) expect(['faq-title', 'sources-title', 'quote-title', 'related-products']).not.toContain(id);
  });

  it('has ≥3 FAQs, ≥1 source and a comparison table', () => {
    expect(p.faqs.length).toBeGreaterThanOrEqual(3);
    expect(new Set(p.faqs.map((f) => f.q)).size).toBe(p.faqs.length);
    expect(p.sources.length).toBeGreaterThanOrEqual(1);
    for (const s of p.sources) if (s.url) expect(s.url).toMatch(/^https:\/\//);
    expect(p.blocks.some((b) => b.type === 'table')).toBe(true);
  });

  it('tables are rectangular', () => {
    for (const b of p.blocks) if (b.type === 'table') for (const r of b.rows) expect(r.length).toBe(b.head.length);
  });

  it('separates general guidance from Ananta-specific copy', () => {
    const tones = new Set(p.blocks.flatMap((b) => (b.type === 'callout' ? [b.tone] : [])));
    expect(tones.has('general') || tones.has('ananta')).toBe(true);
  });

  it('inline links point at real internal routes', () => {
    for (const href of inlineLinks(p)) expect(VALID_PATHS.has(href), href).toBe(true);
  });

  it('contains no banned or invented claims', () => {
    const text = stripInline(allText(p));
    const hits = BANNED.filter((re) => re.test(text)).map(String);
    expect(hits).toEqual([]);
  });

  it('builds Article + FAQPage JSON-LD', () => {
    const a = articleJsonLd(p, `https://example.test/blog/${p.slug}`);
    expect(a['@type']).toBe('Article');
    expect(a.headline).toBe(p.title);
    expect(a.datePublished).toBe(p.published);
    expect(faqJsonLd(p.faqs).mainEntity).toHaveLength(p.faqs.length);
  });
});

describe('Ananta-specific numbers match the catalogue', () => {
  // Any "N mm" thickness list attributed to a product in a table row must be a subset of that product's sizes.
  const SIZE_ROWS: [RegExp, string][] = [
    [/Interior Grade MDF/, 'action-tesa-interior-grade-mdf'],
    [/Exterior Grade MDF/, 'action-tesa-exterior-grade-mdf'],
    [/HDHMR Board/, 'action-tesa-hdhmr-board']
  ];
  const num = (s: string) => Number.parseFloat(s);
  it('MDF thickness table rows', () => {
    const post = postBySlug('mdf-thickness-guide')!;
    const table = post.blocks.find((b) => b.type === 'table' && b.head[1] === 'Listed thicknesses');
    expect(table).toBeDefined();
    if (table?.type !== 'table') return;
    for (const [re, slug] of SIZE_ROWS) {
      const row = table.rows.find((r) => re.test(stripInline(r[0])))!;
      const listed = row[1].replace(' mm', '').split(',').map((x) => num(x.trim()));
      const sizes = PRODUCTS.find((p) => p.slug === slug)!.sizes.map(num);
      expect(listed).toEqual(sizes);
    }
  });

  it('density figures appear only as stated in products.ts', () => {
    for (const p of POSTS) {
      for (const m of allText(p).matchAll(/(\d{3,4})\s?kg\/m³/g)) {
        expect(['850', '750'], `${p.slug}: ${m[0]}`).toContain(m[1]);
      }
    }
    const hd = PRODUCTS.find((p) => p.slug === 'action-tesa-hdhmr-board')!;
    const hmr = PRODUCTS.find((p) => p.slug === 'action-tesa-moist-master-hmr-board')!;
    expect(hd.specs.some(([, v]) => v.includes('850'))).toBe(true);
    expect(hmr.specs.some(([, v]) => v.includes('750'))).toBe(true);
  });
});
