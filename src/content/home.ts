/**
 * Homepage V2 copy + derived content. Positioning lines are untagged; every
 * factual answer is composed from COMPANY / BRAND_ASSETS / OPERATIONS
 * (src/content/site.ts), product FAQs (src/data/products.ts) or computed STATS.
 * Nothing here states a price, stock count, delivery time, warranty or rating.
 */
import {PRODUCTS, type CategorySlug} from '@/data/products';
import {STATS} from '@/data/stats';
import {BRAND_ASSETS, COMPANY, OPERATIONS} from '@/content/site';

export const HOME_HERO = {
  eyebrow: `Ahmedabad · Material supply since ${COMPANY.since}`, // A1 "Trusted Since 2020"
  /** Rendered one line per mask (line-mask choreography). */
  lines: ['Plywood, MDF, HDHMR,', 'prelam boards, doors', '& smart locks.'],
  sub: 'Duroply, Action TESA and Tenon — supplied from ready stock in Ahmedabad.', // A1 brands + "ready-to-dispatch inventory"
  audience: 'For interior designers, architects, furniture manufacturers and contractors.', // A1 positioning
  ctaPrimary: 'Explore products',
  ctaSecondary: 'Get price on WhatsApp',
  imageAlt: 'Wood-panelled living room interior with a fluted feature wall and built-in media unit'
};

/** Material-depth cues — every value COMPUTED from the catalogue. */
export const DEPTH = [
  {v: STATS.products, l: 'Products listed'},
  {v: STATS.categories, l: 'Categories'},
  {v: STATS.decors, l: 'Prelam décors'},
  {v: STATS.sizeOptions, l: 'Thickness options'}
];

/** Section 06 — boards explained using ONLY catalogue specs + attributed standards. */
export const TECH_SLUGS = [
  'duroply-mr-moisture-resistant-plywood',
  'duroply-bwp-boiling-water-proof-plywood',
  'action-tesa-interior-grade-mdf',
  'action-tesa-hdhmr-board',
  'action-tesa-moist-master-hmr-board',
  'action-tesa-prelam-particle-board-1103-frosty-white'
];
/** Spec labels shown per board, in order, when the product publishes them. */
export const TECH_SPEC_LABELS = ['Grade', 'Board', 'Bonding resin', 'Density', 'Construction', 'Surface', 'Treatment'];

/** Section 05 — featured rail: one representative per category, then extras. */
export const FEATURED_SLUGS = [
  'duroply-bwp-boiling-water-proof-plywood',
  'action-tesa-hdhmr-board',
  'action-tesa-moist-master-hmr-board',
  'action-tesa-prelam-particle-board-3009-classic-planked-walnut',
  'duro-flush-door',
  'sliding-fingerprint-door-lock',
  'duroply-mr-moisture-resistant-plywood',
  'action-tesa-interior-grade-mdf'
];

/** Images for the product-universe tiles (existing Ananta renders). */
export const CATEGORY_SCENE: Partial<Record<CategorySlug, string>> = {
  'pre-laminated-particle-board': '/images/scenes/kitchen.webp',
  'flush-door': '/images/scenes/door.webp'
};

const faq = (slug: string, i: number) => {
  const p = PRODUCTS.find((x) => x.slug === slug);
  const f = p?.faqs[i];
  return f ? {q: f.q, a: f.a, source: p!.short} : null;
};

const MM = PRODUCTS.flatMap((p) => p.sizes.filter((x) => /MM$/.test(x)).map((x) => parseFloat(x)));
const IS_STANDARDS = [...new Set(PRODUCTS.flatMap((p) => p.standards.map((s) => s.label)).filter((l) => /^IS \d/.test(l)))];

const duroply = BRAND_ASSETS.Duroply.relation.toLowerCase();
const tenon = BRAND_ASSETS['Tenon Smart Lock'].relation.toLowerCase();

/**
 * Section 15 — FAQ. Company answers composed from site.ts facts; material
 * answers are the product FAQs verbatim from products.ts.
 */
export const HOME_FAQS: {q: string; a: string}[] = [
  {
    q: 'Which brands does Ananta Corporation supply?',
    a: `Ananta is an ${duroply} of Duroply (plywood and Duro Door flush doors) and Action TESA (MDF, HDHMR, Moist Master HMR and pre-laminated boards), and carries a ${tenon} of Tenon smart locks.`
  },
  {
    q: 'Where is Ananta located?',
    a: `The warehouse and office is at ${COMPANY.addressLines.join(', ')} — ${COMPANY.facility} of warehouse and workshop space.`
  },
  {
    q: 'How do I get a price?',
    a: `Send the product, thickness and quantity on WhatsApp (${COMPANY.phoneDisplay}) or through the enquiry form. Prices depend on grade, size and quantity, so the team quotes per requirement.`
  },
  ...[
    faq('duroply-bwp-boiling-water-proof-plywood', 1),
    faq('action-tesa-hdhmr-board', 0),
    faq('action-tesa-moist-master-hmr-board', 0),
    faq('action-tesa-interior-grade-mdf', 1)
  ].filter((x): x is {q: string; a: string; source: string} => !!x).map(({q, a}) => ({q, a})),
  {
    q: 'Do you supply custom sizes or furniture?',
    a: OPERATIONS.find((o) => o.title === 'Custom sizes')!.body
  },
  {
    q: 'How many prelam décors are available?',
    a: `The Action TESA pre-laminated range on this site lists ${STATS.decors} décors across woodgrains, solids, stone, fabric and texture finishes, searchable by name or code in the décor library.`
  },
  {
    q: 'Is Ananta a GST-registered business?',
    a: `Yes. GSTIN ${COMPANY.gstin}.`
  },
  {
    q: 'How is delivery arranged?',
    a: OPERATIONS.find((o) => o.title === 'Dispatch')!.body
  }
];

/** Section 11 — Why Ananta: proof points, each computed or sourced. */
export const WHY_PROOF = [
  {
    k: `${STATS.products}`,
    t: 'Products across the catalogue',
    b: `${STATS.categories} categories from plywood to smart locks, each with its own specification page.`
  },
  {
    k: `${STATS.brands}`,
    t: 'Manufacturer brands',
    b: `${BRAND_ASSETS.Duroply.relation} of Duroply and Action TESA; ${BRAND_ASSETS['Tenon Smart Lock'].relation.toLowerCase()} of Tenon smart locks.`
  },
  {
    k: `${STATS.sizeOptions}`,
    t: 'Thickness options listed',
    b: `Board thicknesses published per product, from ${Math.min(...MM)} mm to ${Math.max(...MM)} mm.`
  },
  {
    k: `${STATS.decors}`,
    t: 'Prelam décors',
    b: 'Woodgrain, solid, stone, fabric and texture finishes, searchable by code.'
  },
  {
    k: 'IS',
    t: 'Standards named by the manufacturer',
    b: `Where a grade carries a standard (${IS_STANDARDS.join(', ')}) it is shown as stated by Duroply or Action TESA.`
  },
  {
    k: 'GST',
    t: 'Registered business',
    b: `GSTIN ${COMPANY.gstin} · warehouse at Pirana Road, Piplaj, Ahmedabad.`
  }
];
