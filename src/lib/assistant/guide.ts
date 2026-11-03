/**
 * Ananta materials guide — a 100% DETERMINISTIC assistant.
 *
 * No model, no network: every reply is assembled from verified data
 * (src/data/*, src/content/site.ts, src/content/categories.ts, the TOOLS
 * registry and the POSTS index) by a fixed, typo-tolerant intent router.
 * Unknown input gets a safe fallback + buttons. Never states stock
 * quantities, prices, warranties, certifications beyond the attributed
 * product standards, delivery times, CNC capability or hours.
 *
 * Every useful reply carries next-step actions (view product, compare,
 * explore category, read guide, open tool, get price, WhatsApp, call,
 * send enquiry). "Get price" always goes through src/lib/quote.ts.
 */
import {
  CATEGORIES,
  PRODUCTS,
  categoryHref,
  productHref,
  productPath,
  type Application,
  type Brand,
  type CategorySlug,
  type Href,
  type Product
} from '@/data/products';
import {DECORS} from '@/data/decors';
import {CATEGORY_COPY} from '@/content/categories';
import {APPLICATIONS, BRAND_ASSETS, COMPANY, EXPOSURE_LABEL, OPERATIONS, SELECTOR, WA} from '@/content/site';
import {TOOLS, type ToolSlug} from '@/content/tools';
import {BLOG_CATEGORY_LABEL, POSTS, type Post} from '@/content/blog';
import {BRANDS, STATS, compare, countByBrand, countByCategory, thicknessesFor} from '@/data/stats';
import {quoteContactHref, quoteWhatsappUrl, type QuoteContext} from '@/lib/quote';
import {whatsappUrl} from '@/lib/whatsapp';

// ── Actions ──────────────────────────────────────────────────────────────────
/** Visual weight: `price` = the orange primary moment; `whatsapp`/`call` are contact; `default` is neutral. */
export type ActionTone = 'default' | 'price' | 'whatsapp' | 'call';

export type Action =
  /** Sends `value` as the next user message. */
  | {kind: 'ask'; label: string; value: string}
  /** Internal, locale-aware navigation (typed next-intl Href). */
  | {kind: 'link'; label: string; href: Href; tone?: ActionTone}
  /** wa.me / tel: / mailto: / maps — opens outside the site. */
  | {kind: 'external'; label: string; value: string; tone?: ActionTone}
  /** Opens site search (window `open-search` event) with `value` as the query. */
  | {kind: 'search'; label: string; value: string};

export type Reply = {intent: string; text: string; actions: Action[]};

/** Plain path for an internal Href (tests, keys, markdown). */
export function hrefToPath(h: Href): string {
  if (typeof h === 'string') return h;
  const o = h as {pathname: string; params?: Record<string, string>; query?: Record<string, string>; hash?: string};
  let p = o.pathname.replace(/\[(\w+)\]/g, (_, k: string) => o.params?.[k] ?? `[${k}]`);
  const q = o.query ? new URLSearchParams(o.query).toString() : '';
  if (q) p += `?${q}`;
  if (o.hash) p += `#${o.hash}`;
  return p;
}

/** A stable identity for an action (React keys, tests). */
export function actionKey(a: Action): string {
  return `${a.kind}:${a.label}:${a.kind === 'link' ? hrefToPath(a.href) : a.value}`;
}

// ── Text normalisation + fuzzy matching ──────────────────────────────────────
export function normalise(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9.\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
function lev(a: string, b: string): number {
  if (Math.abs(a.length - b.length) > 2) return 3;
  const d = Array.from({length: a.length + 1}, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}
/** Does the text contain the term (phrase match, or a fuzzy single-token match)? */
function has(text: string, tokens: string[], term: string): boolean {
  if (term.includes(' ')) return ` ${text} `.includes(` ${term} `);
  if (tokens.includes(term)) return true;
  if (term.length < 5) return false; // short words must match exactly
  const max = term.length >= 8 ? 2 : 1;
  return tokens.some((t) => t.length >= 4 && lev(t, term) <= max);
}
const any = (text: string, tokens: string[], terms: string[]) => terms.some((t) => has(text, tokens, t));

// ── Action builders ──────────────────────────────────────────────────────────
const SOURCE = 'Assistant';
const ask = (label: string, value = label): Action => ({kind: 'ask', label, value});
const go = (label: string, href: Href, tone?: ActionTone): Action => ({kind: 'link', label, href, ...(tone ? {tone} : {})});
const ext = (label: string, value: string, tone?: ActionTone): Action => ({kind: 'external', label, value, ...(tone ? {tone} : {})});
const wa = (label: string, msg: string): Action => ext(label, whatsappUrl(msg), 'whatsapp');
const call = (): Action => ext(`Call ${COMPANY.phoneDisplay}`, COMPANY.phoneHref, 'call');
const getPrice = (ctx: QuoteContext = {}, label = 'Get price'): Action => ext(label, quoteWhatsappUrl({...ctx, source: SOURCE}), 'price');
const enquiry = (ctx: QuoteContext = {}, label = 'Send enquiry'): Action => go(label, quoteContactHref({...ctx, source: SOURCE}));
const tool = (slug: ToolSlug, label?: string): Action => {
  const t = TOOLS.find((x) => x.slug === slug)!;
  return go(label ?? `Open ${t.name}`, t.href);
};
const viewProduct = (p: Product, label = 'View product'): Action => go(label, productHref(p));
const exploreCategory = (slug: CategorySlug, label?: string): Action => go(label ?? `Explore ${CATEGORY_COPY[slug].short}`, categoryHref(slug));
const postHref = (p: Post): Href => ({pathname: '/blog/[slug]', params: {slug: p.slug}}) as Href;
const BLOG_HUB = '/blog' as Href;
const DECOR_LIB = '/decor' as Href;
const CONTACT = '/contact' as Href;
const PRODUCTS_HUB = '/products' as Href;
const TOOLS_HUB = '/tools' as Href;

const md = (p: Product) => `[${p.short}](${productPath(p)})`;
const bySlug = (s: string) => PRODUCTS.find((p) => p.slug === s)!;
const uniq = <T>(xs: T[]) => [...new Set(xs)];

/** Chips on the welcome state. Labels are sent as the first message. */
export const MENU: Action[] = [
  ask('Find a board for kitchen'),
  ask('Compare MR vs BWP'),
  ask('Décor 3009'),
  ask('Read guides'),
  ask('Get price')
];

/** Topic chips used in fallback / greeting replies. */
const TOPICS: Action[] = [ask('What do you supply?'), ask('Which brands?'), ask('Thickness options'), ask('Décor finishes')];

// ── Aliases ──────────────────────────────────────────────────────────────────
/** Product aliases (most specific first). */
const PRODUCT_ALIASES: [string[], string][] = [
  [['hdhmr', 'hdmr', 'high density'], 'action-tesa-hdhmr-board'],
  [['moist master', 'moistmaster', 'hmr board', 'hmr'], 'action-tesa-moist-master-hmr-board'],
  [['exterior mdf', 'exterior grade', 'exterior'], 'action-tesa-exterior-grade-mdf'],
  [['interior mdf', 'interior grade'], 'action-tesa-interior-grade-mdf'],
  [['bwp', 'boiling water', 'boiling', 'waterproof', 'water proof', 'marine'], 'duroply-bwp-boiling-water-proof-plywood'],
  [['mr plywood', 'mr ply', 'mr grade', 'moisture resistant plywood', 'mr'], 'duroply-mr-moisture-resistant-plywood'],
  [['flush door', 'flush doors', 'duro door', 'durodoor'], 'duro-flush-door'],
  [['palm vein', 'face recognition', 'palm'], 'palm-vein-face-recognition-smart-lock'],
  [['wifi', 'wi fi'], 'wifi-smart-door-lock'],
  [['sliding fingerprint'], 'sliding-fingerprint-door-lock'],
  [['automatic sliding', 'auto slide'], 'automatic-sliding-smart-lock'],
  [['fingerprint'], 'fingerprint-smart-door-lock-with-app'],
  [['mini lever', 'mini smart'], 'mini-smart-lever-lock-for-interior-doors'],
  [['lever handle', 'lever lock'], 'smart-lever-handle-lock'],
  [['main door lock', 'main door'], 'high-end-smart-main-door-lock'],
  ...PRODUCTS.filter((p) => p.decorCode).map((p) => [[p.decorCode!, p.short.toLowerCase().replace(/^\d+\s/, '')], p.slug] as [string[], string])
];

const CATEGORY_ALIASES: [string[], CategorySlug][] = [
  [['plywood', 'ply', 'plywoods'], 'plywood'],
  [['mdf', 'fibreboard', 'fiberboard'], 'mdf'],
  [['particle board', 'particleboard', 'prelam', 'pre laminated', 'prelaminated', 'laminated board'], 'pre-laminated-particle-board'],
  [['door', 'doors'], 'flush-door'],
  [['lock', 'locks', 'smart lock', 'smartlock', 'digital lock'], 'smart-locks']
];

const BRAND_ALIASES: [string[], Brand][] = [
  [['duroply', 'duro'], 'Duroply'],
  [['action tesa', 'tesa', 'actiontesa'], 'Action TESA'],
  [['tenon'], 'Tenon Smart Lock']
];

/** Application words → the `applications` field + the selector group (if one exists). */
const APPLICATION_ALIASES: [string[], Application, string | undefined][] = [
  [['kitchen', 'kitchens', 'kichen', 'sink', 'modular', 'carcass', 'shutter', 'shutters'], 'kitchens', 'kitchen'],
  [['wardrobe', 'wardrobes', 'closet', 'almirah', 'cupboard'], 'wardrobes', 'wardrobe'],
  [['bathroom', 'bath', 'vanity', 'washroom', 'balcony', 'humid', 'wet', 'wet zone', 'wet zones', 'wet area'], 'wet-zones', 'bathroom'],
  [['office', 'workstation', 'workstations', 'reception', 'commercial', 'retail', 'shop'], 'commercial', 'office'],
  [['furniture', 'bed', 'table', 'tv unit', 'shelf', 'shelves'], 'furniture', undefined],
  [['panelling', 'paneling', 'partition', 'partitions', 'wall panel', 'wall panels', 'cladding'], 'panelling', undefined]
];

function detectProducts(text: string, tokens: string[]): Product[] {
  const found: Product[] = [];
  for (const [aliases, slug] of PRODUCT_ALIASES) if (any(text, tokens, aliases) && !found.some((p) => p.slug === slug)) found.push(bySlug(slug));
  return found;
}
const detectCategory = (text: string, tokens: string[]) => CATEGORY_ALIASES.find(([a]) => any(text, tokens, a))?.[1];
const detectBrand = (text: string, tokens: string[]) => BRAND_ALIASES.find(([a]) => any(text, tokens, a))?.[1];
const detectApplication = (text: string, tokens: string[]) => APPLICATION_ALIASES.find(([a]) => any(text, tokens, a));

// ── Answers ──────────────────────────────────────────────────────────────────
function productActions(p: Product): Action[] {
  const peer = PRODUCTS.find((x) => x.slug !== p.slug && x.category === p.category && compare(p, x));
  return [
    viewProduct(p),
    ...(peer ? [ask(`Compare ${p.short} vs ${peer.short}`)] : []),
    exploreCategory(p.category),
    getPrice({product: p.name, category: CATEGORY_COPY[p.category].name}),
    enquiry({product: p.name})
  ];
}

function productReply(p: Product, focus: 'all' | 'size' | 'specs' = 'all'): Reply {
  const lines = [`**${p.name}** — ${p.summary}`];
  if (p.sizes.length) lines.push(`${p.sizesLabel ?? 'Sizes'}: ${p.sizes.join(' · ')}${p.sizesNote ? ` — ${p.sizesNote}` : ''}`);
  if (focus === 'specs') {
    if (p.specs.length) lines.push(p.specs.map(([k, v]) => `- ${k}: ${v}`).join('\n'));
    if (p.standards.length) lines.push(`As stated by ${p.brand}: ${p.standards.map((s) => s.label).join(', ')}.`);
    if (p.specsOnRequest || !p.specs.length) lines.push('Detailed specifications are shared by the team on request.');
  }
  if (focus === 'all') {
    if (p.exposure) lines.push(`Exposure: ${EXPOSURE_LABEL[p.exposure]}.`);
    if (p.standards.length) lines.push(`As stated by ${p.brand}: ${p.standards.map((s) => s.label).join(', ')}.`);
    if (p.uses.length) lines.push(`Used for: ${p.uses.join(', ')}.`);
    if (p.notFor) lines.push(`Not for: ${p.notFor}`);
    if (p.specsOnRequest) lines.push('Detailed specifications are shared by the team on request.');
  }
  return {intent: focus === 'all' ? 'product' : `product-${focus}`, text: lines.join('\n\n'), actions: productActions(p)};
}

function categoryReply(slug: CategorySlug): Reply {
  const c = CATEGORY_COPY[slug];
  const items = PRODUCTS.filter((p) => p.category === slug);
  const t = thicknessesFor(slug);
  return {
    intent: `category:${slug}`,
    text: [
      `**${c.name}** — ${c.what}`,
      `Best for: ${c.bestFor}.`,
      `${c.key}.`,
      `${items.length} listed: ${items.slice(0, 8).map(md).join(', ')}${items.length > 8 ? '…' : ''}`,
      t.length ? `Thicknesses listed: ${t.map((x) => x.replace(' MM', '')).join(' · ')} mm.` : ''
    ]
      .filter(Boolean)
      .join('\n\n'),
    actions: [
      exploreCategory(slug, `All ${c.short}`),
      ...(items.length === 1 ? [viewProduct(items[0])] : []),
      ...(slug === 'pre-laminated-particle-board' ? [tool('finish-explorer')] : []),
      getPrice({category: c.name}),
      enquiry({category: c.name})
    ]
  };
}

function brandReply(b: Brand): Reply {
  const a = BRAND_ASSETS[b];
  const items = PRODUCTS.filter((p) => p.brand === b);
  const cats = uniq(items.map((p) => p.category));
  return {
    intent: `brand:${b}`,
    text: `**${b}** — ${a.relation.toLowerCase()} (${countByBrand(b)} products): ${a.supplies}.\n\n${items.slice(0, 8).map(md).join(', ')}${items.length > 8 ? '…' : ''}`,
    actions: [
      go(`${b} range`, `/partners#${a.slug}` as Href),
      ...cats.slice(0, 2).map((c) => exploreCategory(c)),
      getPrice({product: `${b} products`}, `Get ${b} price`)
    ]
  };
}

function applicationProducts(app: Application, exclude: string[] = []): Product[] {
  return PRODUCTS.filter((p) => p.applications.includes(app) && !exclude.includes(p.slug));
}

function selectorReply(key: string, app: Application): Reply {
  const a = SELECTOR.find((s) => s.key === key)!;
  const picks = uniq(a.zones.flatMap((z) => z.picks));
  const more = applicationProducts(app, picks);
  const label = APPLICATIONS.find((x) => x.key === app)!.label;
  const first = bySlug(picks[0]);
  return {
    intent: `selector:${key}`,
    text: [
      `**${a.label}** — from Ananta's product guidance:`,
      ...a.zones.map((z) => `- **${z.label}** (${EXPOSURE_LABEL[z.exposure].toLowerCase()}): ${z.picks.map((s) => md(bySlug(s))).join(', ')}. ${z.why}`),
      ...(more.length ? ['', `Also listed for ${label.toLowerCase()}: ${more.map(md).join(', ')}.`] : [])
    ].join('\n'),
    actions: [
      viewProduct(first, `View ${first.short}`),
      tool('material-selector'),
      ...(key === 'kitchen' ? [ask('Compare MR vs BWP')] : []),
      getPrice({requirement: `${a.label} materials`}),
      enquiry({requirement: `${a.label} materials`})
    ]
  };
}

function applicationReply(app: Application): Reply {
  const meta = APPLICATIONS.find((x) => x.key === app)!;
  const items = applicationProducts(app);
  return {
    intent: `application:${app}`,
    text: [`**${meta.label}** (${meta.hint.toLowerCase()}) — boards listed for this use:`, ...items.map((p) => `- ${md(p)} — ${CATEGORY_COPY[p.category].short}`)].join('\n'),
    actions: [
      ...(items[0] ? [viewProduct(items[0], `View ${items[0].short}`)] : []),
      tool('material-selector'),
      getPrice({requirement: `${meta.label} materials`}),
      enquiry({requirement: `${meta.label} materials`})
    ]
  };
}

function compareReply(a: Product | undefined, b: Product | undefined): Reply {
  const rows = a && b ? compare(a, b) : null;
  if (a && b && rows)
    return {
      intent: 'compare',
      text: [`**${a.short}** vs **${b.short}** (verified fields only):`, ...rows.map((r) => `- ${r.label}: ${r.a} | ${r.b}`)].join('\n'),
      actions: [
        tool('compare', 'Open Board Comparison'),
        viewProduct(a, `View ${a.short}`),
        viewProduct(b, `View ${b.short}`),
        getPrice({product: `${a.name} / ${b.name}`})
      ]
    };
  if (a && b)
    return {
      intent: 'compare',
      text: `**${a.short}** and **${b.short}** don't share enough published attributes for a fair side-by-side. Open each product for its own details, or ask the team.`,
      actions: [viewProduct(a, `View ${a.short}`), viewProduct(b, `View ${b.short}`), wa('Ask the team', WA.default)]
    };
  return {
    intent: 'compare',
    text: 'The comparison tool puts two boards side by side — it only shows attributes both products actually publish. Try “MR vs BWP” or “HDHMR vs Moist Master”.',
    actions: [tool('compare', 'Open Board Comparison'), ask('Compare MR vs BWP'), ask('HDHMR vs Moist Master')]
  };
}

// ── Sheet maths (8 × 4 ft = 32 sq ft) ────────────────────────────────────────
const SHEET_SQFT = 32;
/** Parse an area like "400 sq ft", "400sqft", "37 sqm", "50 square metres" → sq ft. */
export function parseArea(text: string): number | undefined {
  const m = text.match(/(\d+(?:\.\d+)?)\s?(sq\.? ?ft|sqft|sft|square feet|square foot|sq\.? ?feet|sq\.? ?m|sqm|square met(?:er|re)s?|m2)\b/);
  if (!m) return undefined;
  const n = parseFloat(m[1]);
  if (!Number.isFinite(n) || n <= 0 || n > 1_000_000) return undefined;
  return /m|met/.test(m[2]) && !/ft|feet|foot/.test(m[2]) ? n * 10.7639 : n;
}
export function sheetsFor(areaSqft: number): {sheets: number; withWastage: number} {
  return {sheets: Math.ceil(areaSqft / SHEET_SQFT), withWastage: Math.ceil((areaSqft * 1.1) / SHEET_SQFT)};
}
function sheetReply(area: number | undefined): Reply {
  if (area === undefined)
    return {
      intent: 'sheets',
      text: 'The Sheet Quantity Helper turns a panel area into an approximate count of standard 8 × 4 ft sheets (32 sq ft each), with a wastage allowance. Tell me the area — e.g. “how many sheets for 400 sq ft” — and I’ll do the basic maths.',
      actions: [tool('sheet-calculator'), ask('How many sheets for 400 sq ft?'), getPrice()]
    };
  const {sheets, withWastage} = sheetsFor(area);
  const a = Math.round(area * 10) / 10;
  return {
    intent: 'sheets',
    text: `**${a} sq ft** ÷ 32 sq ft per 8 × 4 ft sheet ≈ **${sheets} sheets**.\n\nWith a 10% wastage allowance: about **${withWastage} sheets**. This is an estimate, not a cutting plan — grain direction, cut sizes and edge losses change the real count.`,
    actions: [tool('sheet-calculator'), getPrice({quantity: `About ${withWastage} sheets (8 × 4 ft)`}), enquiry({quantity: `About ${withWastage} sheets (8 × 4 ft)`})]
  };
}

// ── Guides / blog ────────────────────────────────────────────────────────────
const GUIDE_WORDS = ['blog', 'blogs', 'guide', 'guides', 'article', 'articles', 'resources', 'insights', 'learn', 'tips', 'read guides'];
/** Search POSTS by title, category label and related products. Pure. */
export function searchPosts(text: string, tokens: string[], products: Product[] = []): Post[] {
  const stop = new Set([...GUIDE_WORDS, 'read', 'the', 'a', 'an', 'on', 'about', 'for', 'and', 'any', 'show', 'me', 'your', 'some', 'do', 'you', 'have', 'is', 'of', 'to', 'in']);
  const terms = tokens.filter((t) => !stop.has(t) && t.length >= 3);
  const scored = POSTS.map((p) => {
    const hay = normalise(`${p.title} ${BLOG_CATEGORY_LABEL[p.category]} ${p.excerpt}`);
    const hayTokens = hay.split(' ');
    let score = terms.filter((t) => has(hay, hayTokens, t)).length;
    score += products.filter((x) => p.relatedProducts.includes(x.slug)).length * 2;
    return {p, score};
  });
  if (!terms.length && !products.length) return POSTS.slice(0, 3);
  return scored
    .filter((s) => s.score > 0)
    .sort((x, y) => y.score - x.score)
    .slice(0, 3)
    .map((s) => s.p);
}
function guidesReply(text: string, tokens: string[], products: Product[]): Reply {
  if (!POSTS.length)
    return {
      intent: 'guides',
      text: 'Ananta’s buying guides are being prepared. Meanwhile, the tools answer the common questions — which board for which room, how two boards compare, and how many sheets you need.',
      actions: [go('Resources', BLOG_HUB), tool('material-selector'), tool('compare', 'Open Board Comparison'), go('All tools', TOOLS_HUB)]
    };
  const found = searchPosts(text, tokens, products);
  if (!found.length)
    return {
      intent: 'guides',
      text: 'No guide matches that yet. Browse all resources, or ask about a product or application.',
      actions: [go('All resources', BLOG_HUB), ...POSTS.slice(0, 2).map((p) => go(`Read: ${p.title}`, postHref(p)))]
    };
  return {
    intent: 'guides',
    text: ['Guides from Ananta’s resources:', ...found.map((p) => `- [${p.title}](/blog/${p.slug}) — ${p.excerpt}`)].join('\n'),
    actions: [...found.map((p) => go(`Read: ${p.title}`, postHref(p))), go('All resources', BLOG_HUB)]
  };
}

function toolsReply(): Reply {
  return {
    intent: 'tools',
    text: ['Interactive tools:', ...TOOLS.map((t) => `- **${t.name}** — ${t.short}.`)].join('\n'),
    actions: [...TOOLS.map((t) => go(t.name, t.href)), go('All tools', TOOLS_HUB)]
  };
}

export const FALLBACK_TEXT =
  'I can help you with products, brands, specifications, sizes, applications, pricing enquiries, delivery information and contact details. Pick a topic below, or message the team on WhatsApp.';

const DELIVERY = OPERATIONS.find((o) => o.k === '04')!.body;

/** The deterministic router. Pure function: same input → same reply. */
export function respond(input: string): Reply {
  const text = normalise(input);
  const tokens = text.split(' ').filter(Boolean);
  const k = (...t: string[]) => any(text, tokens, t);

  if (!tokens.length) return {intent: 'fallback', text: FALLBACK_TEXT, actions: [...MENU, wa('WhatsApp the team', WA.default), go('Contact', CONTACT)]};

  // Contact & company facts
  if (k('gst', 'gstin', 'gst number'))
    return {intent: 'gstin', text: `GSTIN: **${COMPANY.gstin}** (${COMPANY.name}).`, actions: [go('Contact page', CONTACT), enquiry()]};
  if (k('hours', 'timing', 'timings', 'opening', 'open time', 'closed', 'sunday', 'working hours'))
    return {intent: 'hours', text: 'Working hours aren’t listed on the site — please call or WhatsApp the team before visiting.', actions: [call(), wa('WhatsApp', WA.default)]};
  if (k('address', 'location', 'located', 'where are', 'visit', 'map', 'warehouse location', 'directions'))
    return {
      intent: 'address',
      text: `**${COMPANY.name}**\n${COMPANY.addressLines.join(', ')}`,
      actions: [ext('Open in Google Maps', `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(COMPANY.mapsQuery)}`), go('Contact page', CONTACT), call()]
    };
  if (k('email', 'mail', 'e mail')) return {intent: 'email', text: `Email: **${COMPANY.email}**`, actions: [ext('Write an email', `mailto:${COMPANY.email}`), enquiry({}, 'Enquiry form')]};
  if (k('whatsapp', 'whats app', 'watsapp'))
    return {intent: 'whatsapp', text: `WhatsApp: **${COMPANY.phoneDisplay}** — the fastest way to get price and availability.`, actions: [wa('Open WhatsApp', WA.default), call()]};
  if (k('phone', 'call', 'number', 'mobile', 'contact'))
    return {intent: 'phone', text: `Phone / WhatsApp: **${COMPANY.phoneDisplay}** · Email: ${COMPANY.email}`, actions: [call(), wa('WhatsApp', WA.default), enquiry()]};

  // Things we never invent
  if (k('warranty', 'guarantee', 'certificate', 'certification', 'certified', 'carb', 'isi', 'iso', 'fire', 'fire retardant')) {
    const ps = detectProducts(text, tokens).filter((p) => p.standards.length);
    return {
      intent: 'standards',
      text: ps.length
        ? `${ps.map((p) => `${md(p)} — as stated by ${p.brand}: ${p.standards.map((s) => s.label).join(', ')}`).join('\n\n')}\n\nWarranty terms and certificates aren't published here — the team can share the manufacturer's documents.`
        : 'Standards are listed per product, as stated by the manufacturer (for example IS 303 for Duroply MR, IS 710 for Duroply BWP, IS 2202 for Duro Door). Warranty terms and certificates aren’t published here — the team can share the manufacturer’s documents.',
      actions: [...(ps[0] ? [viewProduct(ps[0])] : []), wa('Ask the team', WA.default), go('All products', PRODUCTS_HUB)]
    };
  }

  // Sheet quantity (before price: "how many sheets" is not a price question)
  const area = parseArea(text);
  if (k('how many sheets', 'sheet calculator', 'sheet quantity', 'number of sheets', 'sheets', 'sheet count', 'wastage') || area !== undefined)
    return sheetReply(area);

  if (k('price', 'prices', 'rate', 'rates', 'cost', 'quote', 'quotation', 'how much', 'discount', 'get price', 'get a price')) {
    const p = detectProducts(text, tokens)[0];
    const cat = p ? undefined : detectCategory(text, tokens);
    const ctx: QuoteContext = p ? {product: p.name} : cat ? {category: CATEGORY_COPY[cat].name} : {};
    const what = p ? ` for **${p.name}**` : cat ? ` for **${CATEGORY_COPY[cat].name}**` : '';
    return {
      intent: 'price',
      text: `Prices aren't published — the team shares current pricing and availability on WhatsApp${what}. Include product, thickness and quantity.`,
      actions: [getPrice(ctx, 'Get price on WhatsApp'), enquiry(ctx), ...(p ? [viewProduct(p)] : [tool('requirement-builder')])]
    };
  }
  if (k('stock', 'available', 'availability', 'in stock', 'inventory'))
    return {
      intent: 'stock',
      text: `Ananta keeps ready-to-dispatch inventory in ${COMPANY.facility} of warehouse and workshop space in Ahmedabad. Current availability for a specific item is confirmed by the team.`,
      actions: [wa('Check availability', WA.default), go('Browse products', PRODUCTS_HUB)]
    };
  if (k('delivery', 'deliver', 'dispatch', 'shipping', 'transport', 'courier', 'logistics'))
    return {intent: 'delivery', text: `${DELIVERY} The team confirms it with your quote — no fixed delivery times are promised.`, actions: [wa('Ask about delivery', WA.default), enquiry()]};
  if (k('custom', 'customised', 'customized', 'drawing', 'cnc', 'made to', 'fabrication', 'carpentry', 'furniture making'))
    return {
      intent: 'custom',
      text: 'Ananta offers material supply plus custom furniture — custom sizes and designs, and furniture made to your drawings. Share the drawing with the team for a quote.',
      actions: [wa('Discuss a custom job', WA.custom), go('About custom work', '/about#custom' as Href), enquiry({requirement: 'Custom furniture / sizes'})]
    };

  // Tools
  if (k('requirement builder', 'requirement', 'requirements', 'boq', 'bill of quantities', 'material list', 'bulk order', 'bulk'))
    return {
      intent: 'requirement-builder',
      text: 'The Requirement Builder lets you pick the project, material and quantity, then sends the requirement to the team on WhatsApp or by enquiry.',
      actions: [tool('requirement-builder'), wa('Share a requirement list', WA.project), enquiry()]
    };
  if (k('finish explorer')) return {intent: 'decor', text: `The Finish Explorer searches the **${STATS.decors}** Action TESA prelam décors by family, name or code, and lets you shortlist them.`, actions: [tool('finish-explorer'), go('Décor library', DECOR_LIB)]};
  if (k('tool', 'tools', 'calculator', 'calculators')) return toolsReply();

  // Guides / blog
  const prods = detectProducts(text, tokens);
  // exact tokens only: "particle" must not fuzzy-match "article"
  if (GUIDE_WORDS.some((w) => (w.includes(' ') ? has(text, tokens, w) : tokens.includes(w)))) return guidesReply(text, tokens, prods);

  // Décor
  const code = tokens.find((t) => /^\d{4}$/.test(t));
  const decorProduct = code ? PRODUCTS.find((p) => p.decorCode === code) : undefined;
  if (decorProduct && prods.length <= 1) return productReply(decorProduct);
  const decor = code ? DECORS.find((d) => d.code === code) : undefined;
  if (decor)
    return {
      intent: 'decor-code',
      text: `Décor **${decor.code} – ${decor.name}** (Action TESA pre-laminated, ${decor.type}).`,
      actions: [
        go('See it in the library', {pathname: '/decor', query: {q: decor.code}} as Href),
        ext('Get price', quoteWhatsappUrl({finish: `${decor.code} – ${decor.name}`, category: CATEGORY_COPY['pre-laminated-particle-board'].name, source: SOURCE}), 'price'),
        exploreCategory('pre-laminated-particle-board')
      ]
    };
  if (k('decor', 'decors', 'colour', 'colours', 'color', 'colors', 'finish', 'finishes', 'shade', 'shades', 'design', 'designs', 'texture', 'laminate', 'laminates'))
    return {
      intent: 'decor',
      text: `The décor library has **${STATS.decors}** Action TESA pre-laminated finishes — woodgrains, solids, stone & marble, fabric and textures — searchable by name or code.`,
      actions: [go('Open the décor library', DECOR_LIB), tool('finish-explorer'), exploreCategory('pre-laminated-particle-board'), getPrice({category: CATEGORY_COPY['pre-laminated-particle-board'].name})]
    };

  // Comparison
  const cmpWord = k('compare', 'comparison', 'difference', 'versus', 'vs', 'better');
  if (prods.length >= 2 || (cmpWord && prods.length >= 1)) return compareReply(prods[0], prods[1]);
  if (cmpWord) return compareReply(undefined, undefined);

  // Applications → selector + `applications` field
  const app = detectApplication(text, tokens);
  if (app) return app[2] ? selectorReply(app[2], app[1]) : applicationReply(app[1]);
  if (k('which board', 'which material', 'recommend', 'suggest', 'selector', 'material selector', 'best board', 'what should i use'))
    return {
      intent: 'selector',
      text: 'Tell me the application — kitchen, wardrobe, bathroom, office or doors — and I’ll list the boards Ananta’s guidance names for it.',
      actions: [ask('Find a board for kitchen'), ask('Which board for a wardrobe?'), ask('Bathroom or humid areas?'), tool('material-selector')]
    };

  // Product / size / spec questions
  const sizeQ = k('size', 'sizes', 'thickness', 'thick', 'mm', 'dimension', 'dimensions', '8x4', '8 x 4');
  const specQ = k('spec', 'specs', 'specification', 'specifications', 'density', 'technical', 'details', 'properties');
  if (prods.length === 1) return productReply(prods[0], sizeQ ? 'size' : specQ ? 'specs' : 'all');

  const brand = detectBrand(text, tokens);
  if (brand) return brandReply(brand);
  const cat = detectCategory(text, tokens);
  if (cat) return categoryReply(cat);

  if (sizeQ)
    return {
      intent: 'sizes',
      text: CATEGORIES.filter((c) => thicknessesFor(c.slug).length)
        .map((c) => `- **${CATEGORY_COPY[c.slug].short}:** ${thicknessesFor(c.slug).map((x) => x.replace(' MM', '')).join(' · ')} mm`)
        .concat(`- **Flush doors:** ${bySlug('duro-flush-door').sizes.join(' · ')} in`)
        .join('\n'),
      actions: [go('All products', PRODUCTS_HUB), tool('sheet-calculator'), wa('Ask about sizes', WA.default)]
    };
  if (specQ)
    return {
      intent: 'specs',
      text: 'Specifications are listed per product, with the manufacturer named for each standard. Name a product — e.g. “HDHMR specs” or “BWP plywood details”.',
      actions: [ask('HDHMR specs'), ask('BWP plywood details'), tool('compare', 'Open Board Comparison')]
    };

  if (k('supply', 'sell', 'products', 'product', 'range', 'catalogue', 'catalog', 'what do you', 'materials', 'board', 'boards', 'categories', 'category'))
    return {
      intent: 'range',
      text: [`${STATS.products} products in ${STATS.categories} categories:`, ...CATEGORIES.map((c) => `- [${CATEGORY_COPY[c.slug].name}](/products/${c.slug}) — ${countByCategory(c.slug)} listed`)].join('\n'),
      actions: [go('Open the catalogue', PRODUCTS_HUB), ask('Which brands?'), tool('material-selector'), getPrice()]
    };
  if (k('brand', 'brands', 'company', 'companies', 'manufacturer', 'authorized', 'authorised', 'dealer', 'distributor'))
    return {
      intent: 'brands',
      text: BRANDS.map((b) => `- **${b}** — ${BRAND_ASSETS[b].relation.toLowerCase()}: ${BRAND_ASSETS[b].supplies}.`).join('\n'),
      actions: [go('Brands', '/partners' as Href), ...BRANDS.map((b) => ask(b))]
    };
  if (k('hi', 'hello', 'hey', 'namaste', 'help', 'menu', 'start')) return {intent: 'greeting', text: 'Hello! What can I help you find?', actions: [...MENU, ...TOPICS.slice(0, 2)]};
  if (k('thanks', 'thank', 'ok', 'okay')) return {intent: 'thanks', text: 'You’re welcome. For price and availability, the team is on WhatsApp.', actions: [wa('WhatsApp the team', WA.default), call()]};

  return {
    intent: 'fallback',
    text: FALLBACK_TEXT,
    actions: [...TOPICS, {kind: 'search', label: 'Search the site', value: input.trim().slice(0, 80)}, wa('WhatsApp the team', WA.default), go('Contact', CONTACT)]
  };
}

/** Chips shown before the first message. */
export const GUIDE_CHIPS = MENU;
