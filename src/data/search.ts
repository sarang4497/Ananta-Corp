/**
 * Site search — a deterministic, local index built from the shared data
 * modules (products, categories, brands, applications, tools, blog posts,
 * décors, key pages). No network, no AI. Matching: normalised tokens, exact /
 * prefix match, plus a Levenshtein ≤ 1 fuzzy match for words of 5+ letters.
 * Every query word must match somewhere in a document (AND semantics).
 */
import {CATEGORIES, PRODUCTS, categoryHref, productHref, subcategoryHref, type Href} from './products';
import {DECORS} from './decors';
import {BRANDS, STATS, countByApplication, countByBrand, countByCategory} from './stats';
import {CATEGORY_COPY, SUB_NAMES} from '@/content/categories';
import {APPLICATIONS, BRAND_ASSETS, EXPOSURE_LABEL} from '@/content/site';
import {TOOLS} from '@/content/tools';
import {POSTS, BLOG_CATEGORY_LABEL} from '@/content/blog';

export type SearchKind = 'product' | 'category' | 'subcategory' | 'brand' | 'application' | 'tool' | 'post' | 'decor' | 'page';
export type SearchGroup = 'Products' | 'Categories' | 'Brands' | 'Applications' | 'Tools' | 'Guides' | 'Décors' | 'Pages';

export const GROUP_ORDER: SearchGroup[] = ['Products', 'Categories', 'Brands', 'Applications', 'Tools', 'Guides', 'Décors', 'Pages'];

const GROUP_OF: Record<SearchKind, SearchGroup> = {
  product: 'Products',
  category: 'Categories',
  subcategory: 'Categories',
  brand: 'Brands',
  application: 'Applications',
  tool: 'Tools',
  post: 'Guides',
  decor: 'Décors',
  page: 'Pages'
};

/** Ranking weight per kind (ties broken by this, then title). */
const BOOST: Record<SearchKind, number> = {
  product: 3,
  category: 4,
  brand: 4,
  subcategory: 2,
  application: 2,
  tool: 2,
  post: 1,
  page: 1,
  decor: 0
};

export type SearchDoc = {
  id: string;
  kind: SearchKind;
  group: SearchGroup;
  title: string;
  subtitle: string;
  href: Href;
  image?: string;
  /** Normalised title tokens (weighted higher). */
  titleTokens: string[];
  /** All normalised tokens (title + keywords). */
  tokens: string[];
  /** Normalised full title, for phrase matching. */
  normTitle: string;
};

export type SearchResult = {doc: SearchDoc; score: number};

/** Lower-case, strip diacritics, unify separators. "Décor 3009–Walnut" → "decor 3009 walnut". */
export function normalise(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

export function tokenize(s: string): string[] {
  const n = normalise(s);
  return n ? n.split(' ') : [];
}

/** Levenshtein distance, early-exit once it exceeds `max`. */
export function levenshtein(a: string, b: string, max = Infinity): number {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = Array.from({length: b.length + 1}, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      const v = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      cur.push(v);
      if (v < rowMin) rowMin = v;
    }
    if (rowMin > max) return max + 1;
    prev = cur;
  }
  return prev[b.length];
}

function doc(kind: SearchKind, id: string, title: string, subtitle: string, href: Href, keywords: string[], image?: string): SearchDoc {
  const titleTokens = tokenize(title);
  const tokens = [...new Set([...titleTokens, ...keywords.flatMap(tokenize)])];
  return {id: `${kind}:${id}`, kind, group: GROUP_OF[kind], title, subtitle, href, image, titleTokens, tokens, normTitle: normalise(title)};
}

export function buildIndex(): SearchDoc[] {
  const docs: SearchDoc[] = [];

  for (const p of PRODUCTS) {
    const copy = CATEGORY_COPY[p.category];
    docs.push(
      doc(
        'product',
        p.slug,
        p.name,
        `${p.brand} · ${copy.name}`,
        productHref(p),
        [
          p.short,
          p.brand,
          copy.name,
          copy.short,
          SUB_NAMES[p.subcategory] ?? p.subcategory,
          p.decorCode ?? '',
          p.summary,
          ...p.uses,
          ...p.specs.map(([, v]) => v),
          ...p.standards.map((s) => s.label),
          ...p.sizes,
          p.exposure ? EXPOSURE_LABEL[p.exposure] : '',
          ...p.applications
        ],
        p.cardImage
      )
    );
  }

  for (const c of CATEGORIES) {
    const copy = CATEGORY_COPY[c.slug];
    docs.push(
      doc('category', c.slug, copy.name, `${countByCategory(c.slug)} products · ${copy.brands.join(', ')}`, categoryHref(c.slug), [copy.short, copy.what, copy.bestFor, ...copy.brands], c.image)
    );
    if (c.subs.length > 1) {
      for (const s of c.subs) {
        const name = SUB_NAMES[s.slug] ?? s.slug;
        const n = PRODUCTS.filter((p) => p.category === c.slug && p.subcategory === s.slug).length;
        docs.push(doc('subcategory', `${c.slug}/${s.slug}`, name, `${copy.name} · ${n} product${n === 1 ? '' : 's'}`, subcategoryHref(c.slug, s.slug), [copy.name, copy.short], c.image));
      }
    }
  }

  for (const b of BRANDS) {
    const a = BRAND_ASSETS[b];
    docs.push(doc('brand', a.slug, b, `${a.relation} · ${countByBrand(b)} products`, {pathname: '/partners', hash: a.slug} as Href, [a.supplies, a.relation], a.logo));
  }

  for (const a of APPLICATIONS) {
    const n = countByApplication(a.key);
    if (!n) continue;
    docs.push(doc('application', a.key, a.label, `${n} products · ${a.hint}`, {pathname: '/products', query: {app: a.key}} as Href, [a.hint, a.key]));
  }

  for (const t of TOOLS) docs.push(doc('tool', t.slug, t.name, t.short, t.href, [t.short, t.description, 'tool']));

  for (const p of POSTS) {
    docs.push(
      doc('post', p.slug, p.title, `${BLOG_CATEGORY_LABEL[p.category]} · ${p.readingMinutes} min read`, {pathname: '/blog/[slug]', params: {slug: p.slug}} as Href, [p.excerpt, BLOG_CATEGORY_LABEL[p.category], 'guide', 'article', ...(p.applications ?? [])], p.image)
    );
  }

  const seen = new Set<string>();
  for (const d of DECORS) {
    const key = `${d.code}-${d.name}`;
    if (seen.has(key)) continue;
    seen.add(key);
    docs.push(doc('decor', key, `${d.code} ${d.name}`, `Prelam décor · ${d.type}`, {pathname: '/decor', query: {q: d.code}} as Href, [d.type, 'decor', 'finish', 'laminate'], d.image));
  }

  const pages: [string, string, string, Href, string[]][] = [
    ['about', 'About Ananta', 'Company, warehouse and operations', '/about', ['company', 'warehouse', 'operations', 'custom furniture']],
    ['contact', 'Contact', 'Phone, WhatsApp, email and enquiry form', '/contact', ['enquiry', 'quote', 'price', 'address', 'phone', 'email', 'whatsapp', 'gstin']],
    ['partners', 'Brands we supply', 'Duroply, Action TESA and Tenon', '/partners', ['partners', 'brands', 'distributor']],
    ['products', 'All products', `${STATS.products} products in ${STATS.categories} categories`, '/products', ['catalogue', 'catalog', 'range']],
    ['decor', 'Décor library', `${STATS.decors} prelam finishes by code`, '/decor', ['finishes', 'laminates', 'colours', 'colors']],
    ['tools', 'Tools', 'Selector, comparison, quantity helper', '/tools', ['calculator', 'compare', 'selector']],
    ['blog', 'Guides & articles', 'Material guides and buying help', '/blog', ['blog', 'resources', 'guide']]
  ];
  for (const [id, title, sub, href, kw] of pages) docs.push(doc('page', id, title, sub, href, kw));

  return docs;
}

export const SEARCH_INDEX: SearchDoc[] = buildIndex();

/** Score of one query token against a document; 0 = no match. */
function tokenScore(q: string, d: SearchDoc): number {
  let best = 0;
  for (const t of d.titleTokens) {
    if (t === q) return 10;
    if (t.startsWith(q)) best = Math.max(best, 7);
  }
  for (const t of d.tokens) {
    if (t === q) best = Math.max(best, 6);
    else if (best < 4 && t.startsWith(q)) best = 4;
  }
  if (best) return best;
  if (q.length >= 5) {
    for (const t of d.tokens) if (t.length >= 5 && levenshtein(q, t, 1) <= 1) return d.titleTokens.includes(t) ? 3 : 2;
  }
  return 0;
}

export function search(query: string, {limit = 40, index = SEARCH_INDEX}: {limit?: number; index?: SearchDoc[]} = {}): SearchResult[] {
  const q = normalise(query);
  const qt = q ? [...new Set(q.split(' '))] : [];
  if (!qt.length) return [];
  const out: SearchResult[] = [];
  for (const d of index) {
    let score = 0;
    let ok = true;
    for (const t of qt) {
      const s = tokenScore(t, d);
      if (!s) {
        ok = false;
        break;
      }
      score += s;
    }
    if (!ok) continue;
    if (d.normTitle === q) score += 12;
    else if (d.normTitle.startsWith(q)) score += 6;
    else if (qt.length > 1 && d.normTitle.includes(q)) score += 4;
    score += BOOST[d.kind];
    out.push({doc: d, score});
  }
  out.sort((a, b) => b.score - a.score || BOOST[b.doc.kind] - BOOST[a.doc.kind] || a.doc.title.localeCompare(b.doc.title));
  return out.slice(0, limit);
}

/** Results grouped in display order; each group capped at `perGroup`. */
export function groupResults(results: SearchResult[], perGroup = 6): {group: SearchGroup; items: SearchResult[]}[] {
  return GROUP_ORDER.map((group) => ({group, items: results.filter((r) => r.doc.group === group).slice(0, perGroup)})).filter((g) => g.items.length);
}

/** Popular chips shown when the query is empty (category names + key codes). */
export const POPULAR_QUERIES: string[] = ['BWP plywood', 'HDHMR', 'Moist Master', 'Prelam', 'Flush door', 'Smart lock', 'Walnut'];
