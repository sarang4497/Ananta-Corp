/**
 * Deterministic assistant layer. Common questions are answered locally from
 * verified catalogue data (src/data, src/content) — no model call, so nothing
 * can be invented. Only questions this router cannot match fall through to the
 * fact-constrained /api/chat model.
 */
import {CATEGORIES, PRODUCTS, productPath} from '@/data/products';
import {CATEGORY_COPY} from '@/content/categories';
import {BRAND_ASSETS, COMPANY, SELECTOR, WA} from '@/content/site';
import {BRANDS, STATS, countByBrand, countByCategory} from '@/data/stats';
import {whatsappUrl} from '@/lib/whatsapp';

export type GuideIntent = {key: string; label: string; keywords: RegExp; answer: () => string};

const name = (slug: string) => PRODUCTS.find((p) => p.slug === slug)!;
const link = (slug: string) => `[${name(slug).short}](${productPath(name(slug))})`;

const selectorAnswer = (key: string) => () => {
  const a = SELECTOR.find((s) => s.key === key)!;
  return [
    `**${a.label}** — what Ananta's product guidance lists:`,
    ...a.zones.map((z) => `- **${z.label}:** ${z.picks.map(link).join(', ')}. ${z.why}`),
    '',
    `For sizes and today's price: [WhatsApp the team](${whatsappUrl(WA.project)}).`
  ].join('\n');
};

export const INTENTS: GuideIntent[] = [
  {
    key: 'kitchen',
    label: 'Which board for a kitchen?',
    keywords: /kitchen|sink|modular|carcass|shutter/i,
    answer: selectorAnswer('kitchen')
  },
  {key: 'wardrobe', label: 'Which board for a wardrobe?', keywords: /wardrobe|closet|almirah/i, answer: selectorAnswer('wardrobe')},
  {
    key: 'bathroom',
    label: 'Bathroom or humid areas?',
    keywords: /bath|vanity|humid|wet|balcony|moisture|water/i,
    answer: selectorAnswer('bathroom')
  },
  {
    key: 'range',
    label: 'What do you supply?',
    keywords: /what do you (sell|supply|have)|range|categories|products|catalog/i,
    answer: () =>
      [
        `${STATS.products} products in ${STATS.categories} categories:`,
        ...CATEGORIES.map((c) => `- [${CATEGORY_COPY[c.slug].name}](/products/${c.slug}) — ${countByCategory(c.slug)} listed. ${CATEGORY_COPY[c.slug].what}`),
        '',
        'Filter everything by brand, application or exposure at [/products](/products).'
      ].join('\n')
  },
  {
    key: 'brands',
    label: 'Which brands?',
    keywords: /brand|duroply|tesa|tenon|authori[sz]ed|dealer|distributor/i,
    answer: () =>
      [
        ...BRANDS.map((b) => `- **${b}** — ${BRAND_ASSETS[b].relation.toLowerCase()} · ${countByBrand(b)} products: ${BRAND_ASSETS[b].supplies}.`),
        '',
        'More on [/partners](/partners).'
      ].join('\n')
  },
  {
    key: 'decor',
    label: 'Prelam colours & décors',
    keywords: /d[eé]cor|colou?r|finish|shade|laminate|prelam|walnut|oak|marble/i,
    answer: () =>
      `The [décor library](/decor) has **${STATS.decors}** Action TESA pre-laminated finishes — woodgrains, solids, stone, fabric and textures — searchable by name or code. Each swatch has a WhatsApp price button.`
  },
  {
    key: 'price',
    label: 'Get a price',
    keywords: /price|rate|cost|quote|quotation|how much/i,
    answer: () =>
      `Prices aren't published — the team shares real-time pricing and stock on WhatsApp. Send product, thickness and quantity: [WhatsApp ${COMPANY.phoneDisplay}](${whatsappUrl(WA.default)}). Or use the [enquiry form](/contact).`
  },
  {
    key: 'contact',
    label: 'Address & contact',
    keywords: /address|where|location|visit|phone|call|email|contact|gst/i,
    answer: () =>
      `**${COMPANY.name}**\n${COMPANY.addressLines.join(', ')}\n\nPhone/WhatsApp: ${COMPANY.phoneDisplay} · Email: ${COMPANY.email} · GSTIN ${COMPANY.gstin}\n\nWorking hours aren't published — please call or WhatsApp before visiting.`
  },
  {
    key: 'custom',
    label: 'Custom furniture / sizes',
    keywords: /custom|drawing|cnc|cut|made to|furniture making|fabricat/i,
    answer: () =>
      `Ananta offers material supply plus custom furniture — custom sizes and designs, and furniture made to your drawings. Share the drawing on [WhatsApp](${whatsappUrl(WA.custom)}) for the team to quote.`
  },
  {
    key: 'delivery',
    label: 'Delivery',
    keywords: /deliver|dispatch|shipping|transport|how fast|when can/i,
    answer: () =>
      `Delivery is arranged as per location and availability — the team confirms timing with your quote on [WhatsApp](${whatsappUrl(WA.default)}). No fixed delivery times are promised on this site.`
  }
];

/** Chips shown before the first message. */
export const GUIDE_CHIPS = INTENTS.filter((i) => ['kitchen', 'wardrobe', 'range', 'brands', 'decor', 'price'].includes(i.key));

/**
 * Route a free-text question. Specific questions about warranties,
 * certificates, specs or stock levels are NOT matched here — they go to the
 * constrained model, whose prompt forbids inventing them.
 */
export function matchIntent(text: string): GuideIntent | undefined {
  if (/warrant|certif|density|spec|stock (of|level)|guarantee/i.test(text)) return undefined;
  return INTENTS.find((i) => i.keywords.test(text));
}
