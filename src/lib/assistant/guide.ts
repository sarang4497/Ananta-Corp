/**
 * Ananta materials guide — a 100% DETERMINISTIC assistant.
 *
 * No model, no network: every reply is assembled from verified data
 * (src/data/*, src/content/site.ts, src/content/categories.ts) by a fixed,
 * typo-tolerant intent router. Unknown input gets a safe fallback + buttons.
 * Never states stock quantities, prices, warranties, certifications beyond
 * the attributed product standards, delivery times, CNC capability or hours.
 */
import {CATEGORIES, PRODUCTS, productPath, type CategorySlug, type Product} from '@/data/products';
import {DECORS} from '@/data/decors';
import {CATEGORY_COPY} from '@/content/categories';
import {BRAND_ASSETS, COMPANY, EXPOSURE_LABEL, SELECTOR, WA} from '@/content/site';
import {BRANDS, STATS, compare, countByBrand, countByCategory, thicknessesFor} from '@/data/stats';
import type {Brand} from '@/data/products';
import {whatsappUrl} from '@/lib/whatsapp';

export type Action = {label: string; kind: 'ask' | 'link' | 'external'; value: string};
export type Reply = {intent: string; text: string; actions: Action[]};

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

// ── Helpers ──────────────────────────────────────────────────────────────────
const wa = (label: string, msg: string): Action => ({label, kind: 'external', value: whatsappUrl(msg)});
const link = (label: string, href: string): Action => ({label, kind: 'link', value: href});
const ask = (label: string): Action => ({label, kind: 'ask', value: label});
const md = (p: Product) => `[${p.short}](${productPath(p)})`;
const bySlug = (s: string) => PRODUCTS.find((p) => p.slug === s)!;

export const MENU: Action[] = [
  ask('Which board for a kitchen?'),
  ask('What do you supply?'),
  ask('Which brands?'),
  ask('Thickness options'),
  ask('Décor finishes'),
  ask('Get a price')
];

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

function detectProducts(text: string, tokens: string[]): Product[] {
  const found: Product[] = [];
  for (const [aliases, slug] of PRODUCT_ALIASES) if (any(text, tokens, aliases) && !found.some((p) => p.slug === slug)) found.push(bySlug(slug));
  // "mr" alone is too short to fuzzy-match; it only counts as an exact token (handled by has()).
  return found;
}
const detectCategory = (text: string, tokens: string[]) => CATEGORY_ALIASES.find(([a]) => any(text, tokens, a))?.[1];
const detectBrand = (text: string, tokens: string[]) => BRAND_ALIASES.find(([a]) => any(text, tokens, a))?.[1];

// ── Answers ──────────────────────────────────────────────────────────────────
function productReply(p: Product, focus: 'all' | 'size' = 'all'): Reply {
  const lines = [`**${p.name}** — ${p.summary}`];
  if (p.sizes.length) lines.push(`${p.sizesLabel ?? 'Sizes'}: ${p.sizes.join(' · ')}${p.sizesNote ? ` — ${p.sizesNote}` : ''}`);
  if (focus === 'all') {
    if (p.exposure) lines.push(`Exposure: ${EXPOSURE_LABEL[p.exposure]}.`);
    if (p.standards.length) lines.push(`As stated by ${p.brand}: ${p.standards.map((s) => s.label).join(', ')}.`);
    if (p.uses.length) lines.push(`Used for: ${p.uses.join(', ')}.`);
    if (p.notFor) lines.push(`Not for: ${p.notFor}`);
    if (p.specsOnRequest) lines.push('Detailed specifications are shared by the team on request.');
  }
  return {intent: focus === 'size' ? 'product-size' : 'product', text: lines.join('\n\n'), actions: [link('View product', productPath(p)), wa('Get price on WhatsApp', WA.product(p.name))]};
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
    actions: [link(`All ${c.short}`, `/products/${slug}`), wa('Get price on WhatsApp', WA.category(c.name))]
  };
}

function brandReply(b: Brand): Reply {
  const a = BRAND_ASSETS[b];
  const items = PRODUCTS.filter((p) => p.brand === b);
  return {
    intent: `brand:${b}`,
    text: `**${b}** — ${a.relation.toLowerCase()} (${countByBrand(b)} products): ${a.supplies}.\n\n${items.slice(0, 8).map(md).join(', ')}`,
    actions: [link(`${b} range`, `/partners#${a.slug}`), wa(`Ask for ${b} pricing`, WA.category(`${b} products`))]
  };
}

function selectorReply(key: string): Reply {
  const a = SELECTOR.find((s) => s.key === key)!;
  return {
    intent: `selector:${key}`,
    text: [`**${a.label}** — from Ananta's product guidance:`, ...a.zones.map((z) => `- **${z.label}** (${EXPOSURE_LABEL[z.exposure].toLowerCase()}): ${z.picks.map((s) => md(bySlug(s))).join(', ')}. ${z.why}`)].join('\n'),
    actions: [link('Open the material selector', '/#selector'), wa('Get price for this', WA.project)]
  };
}

export const FALLBACK_TEXT =
  'I can help you with products, brands, specifications, sizes, applications, pricing enquiries, delivery information and contact details. Pick a topic below, or message the team on WhatsApp.';

/** The deterministic router. Pure function: same input → same reply. */
export function respond(input: string): Reply {
  const text = normalise(input);
  const tokens = text.split(' ').filter(Boolean);
  const k = (...t: string[]) => any(text, tokens, t);

  if (!tokens.length) return {intent: 'fallback', text: FALLBACK_TEXT, actions: MENU};

  // Contact & company facts
  if (k('gst', 'gstin', 'gst number')) return {intent: 'gstin', text: `GSTIN: **${COMPANY.gstin}** (${COMPANY.name}).`, actions: [link('Contact page', '/contact')]};
  if (k('hours', 'timing', 'timings', 'opening', 'open time', 'closed', 'sunday', 'working hours'))
    return {intent: 'hours', text: 'Working hours aren’t published on the site — please call or WhatsApp the team before visiting.', actions: [{label: `Call ${COMPANY.phoneDisplay}`, kind: 'external', value: COMPANY.phoneHref}, wa('WhatsApp', WA.default)]};
  if (k('address', 'location', 'located', 'where are', 'visit', 'map', 'warehouse location', 'directions'))
    return {intent: 'address', text: `**${COMPANY.name}**\n${COMPANY.addressLines.join(', ')}`, actions: [{label: 'Open in Google Maps', kind: 'external', value: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(COMPANY.mapsQuery)}`}, link('Contact page', '/contact')]};
  if (k('email', 'mail', 'e mail')) return {intent: 'email', text: `Email: **${COMPANY.email}**`, actions: [{label: 'Write an email', kind: 'external', value: `mailto:${COMPANY.email}`}, link('Enquiry form', '/contact')]};
  if (k('whatsapp', 'whats app', 'watsapp')) return {intent: 'whatsapp', text: `WhatsApp: **${COMPANY.phoneDisplay}** — the fastest way to get price and availability.`, actions: [wa('Open WhatsApp', WA.default)]};
  if (k('phone', 'call', 'number', 'mobile', 'contact'))
    return {intent: 'phone', text: `Phone / WhatsApp: **${COMPANY.phoneDisplay}** · Email: ${COMPANY.email}`, actions: [{label: `Call ${COMPANY.phoneDisplay}`, kind: 'external', value: COMPANY.phoneHref}, wa('WhatsApp', WA.default)]};

  // Things we never invent
  if (k('warranty', 'guarantee', 'certificate', 'certification', 'certified', 'carb', 'isi', 'iso', 'fire', 'fire retardant')) {
    const ps = detectProducts(text, tokens).filter((p) => p.standards.length);
    return {
      intent: 'standards',
      text: ps.length
        ? `${ps.map((p) => `${md(p)} — as stated by ${p.brand}: ${p.standards.map((s) => s.label).join(', ')}`).join('\n\n')}\n\nWarranty terms and certificates aren't published here — the team can share the manufacturer's documents.`
        : 'Standards are listed per product, as stated by the manufacturer (for example IS 303 for Duroply MR, IS 710 for Duroply BWP, IS 2202 for Duro Door). Warranty terms and certificates aren’t published here — the team can share the manufacturer’s documents.',
      actions: [wa('Ask the team', WA.default), link('All products', '/products')]
    };
  }
  if (k('price', 'prices', 'rate', 'rates', 'cost', 'quote', 'quotation', 'how much', 'discount')) {
    const p = detectProducts(text, tokens)[0];
    return {
      intent: 'price',
      text: `Prices aren't published — the team shares real-time pricing and stock on WhatsApp${p ? ` for **${p.name}**` : ''}. Include product, thickness and quantity.`,
      actions: [wa('Get price on WhatsApp', p ? WA.product(p.name) : WA.default), link('Enquiry form', p ? `/contact?product=${encodeURIComponent(p.name)}` : '/contact')]
    };
  }
  if (k('stock', 'available', 'availability', 'in stock', 'inventory'))
    return {intent: 'stock', text: `Ananta keeps ready-to-dispatch inventory in ${COMPANY.facility} of warehouse and workshop space in Ahmedabad. Current availability for a specific item is confirmed by the team.`, actions: [wa('Check availability', WA.default)]};
  if (k('delivery', 'deliver', 'dispatch', 'shipping', 'transport', 'courier'))
    return {intent: 'delivery', text: 'Delivery is arranged as per location and availability — the team confirms it with your quote. No fixed delivery times are promised.', actions: [wa('Ask about delivery', WA.default)]};
  if (k('custom', 'customised', 'customized', 'drawing', 'cnc', 'made to', 'fabrication', 'carpentry', 'furniture making'))
    return {intent: 'custom', text: 'Ananta offers material supply plus custom furniture — custom sizes and designs, and furniture made to your drawings. Share the drawing with the team for a quote.', actions: [wa('Discuss a custom job', WA.custom), link('About custom work', '/about#custom')]};

  // Décor
  const code = tokens.find((t) => /^\d{4}$/.test(t));
  const decor = code ? DECORS.find((d) => d.code === code) : undefined;
  if (decor && !PRODUCTS.some((p) => p.decorCode === decor.code))
    return {intent: 'decor-code', text: `Décor **${decor.code} – ${decor.name}** (Action TESA pre-laminated, ${decor.type}).`, actions: [link('See it in the library', `/decor?q=${decor.code}`), wa('Get price', WA.decor(decor.code, decor.name))]};
  if (k('decor', 'decors', 'colour', 'colours', 'color', 'colors', 'finish', 'finishes', 'shade', 'shades', 'design', 'designs', 'texture'))
    return {intent: 'decor', text: `The décor library has **${STATS.decors}** Action TESA pre-laminated finishes — woodgrains, solids, stone & marble, fabric and textures — searchable by name or code.`, actions: [link('Open the décor library', '/decor'), wa('Ask about a décor', WA.default)]};

  // Comparison
  const prods = detectProducts(text, tokens);
  if (prods.length >= 2 || (k('compare', 'comparison', 'difference', 'versus', 'vs', 'better') && prods.length >= 1)) {
    const [a, b] = prods.length >= 2 ? prods : [prods[0], undefined];
    const rows = a && b ? compare(a, b) : null;
    if (a && b && rows)
      return {intent: 'compare', text: [`**${a.short}** vs **${b.short}** (verified fields only):`, ...rows.map((r) => `- ${r.label}: ${r.a} | ${r.b}`)].join('\n'), actions: [link('Open the compare tool', '/#compare'), link(a.short, productPath(a)), link(b.short, productPath(b))]};
    return {intent: 'compare', text: 'Use the compare tool to put two boards side by side — it only shows attributes both products actually have.', actions: [link('Open the compare tool', '/#compare')]};
  }
  if (k('compare', 'comparison', 'difference', 'versus')) return {intent: 'compare', text: 'Use the compare tool to put two boards side by side — it only shows attributes both products actually have.', actions: [link('Open the compare tool', '/#compare')]};

  // Applications → selector
  if (k('kitchen', 'kitchens', 'sink', 'modular', 'carcass', 'shutter')) return selectorReply('kitchen');
  if (k('wardrobe', 'wardrobes', 'closet', 'almirah', 'cupboard')) return selectorReply('wardrobe');
  if (k('bathroom', 'bath', 'vanity', 'washroom', 'balcony', 'humid', 'wet')) return selectorReply('bathroom');
  if (k('office', 'workstation', 'reception', 'commercial')) return selectorReply('office');
  if (k('which board', 'which material', 'recommend', 'suggest', 'selector', 'best board', 'what should i use'))
    return {intent: 'selector', text: 'Tell me the application — kitchen, wardrobe, bathroom, office or doors — and I’ll list the boards Ananta’s guidance names for it.', actions: [ask('Which board for a kitchen?'), ask('Which board for a wardrobe?'), ask('Bathroom or humid areas?'), link('Material selector', '/#selector')]};

  // Size questions
  const sizeQ = k('size', 'sizes', 'thickness', 'thick', 'mm', 'dimension', 'dimensions', '8x4', '8 x 4');
  if (prods.length === 1) return productReply(prods[0], sizeQ ? 'size' : 'all');

  const brand = detectBrand(text, tokens);
  if (brand) return brandReply(brand);
  const cat = detectCategory(text, tokens);
  if (cat) return categoryReply(cat);

  if (sizeQ)
    return {
      intent: 'sizes',
      text: CATEGORIES.filter((c) => thicknessesFor(c.slug).length)
        .map((c) => `- **${CATEGORY_COPY[c.slug].short}:** ${thicknessesFor(c.slug).map((x) => x.replace(' MM', '')).join(' · ')} mm`)
        .concat('- **Flush doors:** 30×80 to 48×96 in, plus custom sizes')
        .join('\n'),
      actions: [link('All products', '/products'), wa('Ask about sizes', WA.default)]
    };

  if (k('supply', 'sell', 'products', 'product', 'range', 'catalogue', 'catalog', 'what do you', 'materials', 'board', 'boards'))
    return {
      intent: 'range',
      text: [`${STATS.products} products in ${STATS.categories} categories:`, ...CATEGORIES.map((c) => `- [${CATEGORY_COPY[c.slug].name}](/products/${c.slug}) — ${countByCategory(c.slug)} listed`)].join('\n'),
      actions: [link('Open the catalogue', '/products'), ask('Which brands?')]
    };
  if (k('brand', 'brands', 'company', 'companies', 'manufacturer', 'authorized', 'authorised', 'dealer', 'distributor'))
    return {intent: 'brands', text: BRANDS.map((b) => `- **${b}** — ${BRAND_ASSETS[b].relation.toLowerCase()}: ${BRAND_ASSETS[b].supplies}.`).join('\n'), actions: [link('Brands', '/partners')]};
  if (k('hi', 'hello', 'hey', 'namaste', 'help', 'menu', 'start')) return {intent: 'greeting', text: 'Hello! What can I help you find?', actions: MENU};
  if (k('thanks', 'thank', 'ok', 'okay')) return {intent: 'thanks', text: 'You’re welcome. For price and availability, the team is on WhatsApp.', actions: [wa('WhatsApp the team', WA.default)]};

  return {intent: 'fallback', text: FALLBACK_TEXT, actions: [...MENU.slice(0, 4), wa('WhatsApp the team', WA.default), link('Contact', '/contact')]};
}

/** Labels of the chips shown before the first message. */
export const GUIDE_CHIPS = MENU;
