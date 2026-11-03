/**
 * The product catalogue — single source of truth for listings, category pages,
 * the material library, the selector/compare tools and the 20 product pages.
 *
 * CONTENT TRUTH RULES (research/ANANTA_CONTENT_TRUTH.md):
 * - Every value here is sourced. `A1` = Ananta's own site (anantacorporation.com,
 *   crawl in docs/ananta-full-site.md); `M-DP` = duroply.in; `M-AT` = actiontesa.com.
 * - Manufacturer standards/properties live in `standards` with the manufacturer
 *   named — they are product-level, never company-level badges.
 * - Unknown attributes are OMITTED, never filled in.
 * - Counts shown on the site are computed from these arrays (see stats.ts).
 */
import type {ComponentProps} from 'react';
import type {Link} from '@/i18n/navigation';

export type Href = ComponentProps<typeof Link>['href'];

export type Brand = 'Duroply' | 'Action TESA' | 'Tenon Smart Lock';

export type CategorySlug =
  | 'plywood'
  | 'mdf'
  | 'high-moisture-resistant-board-moist-master'
  | 'pre-laminated-particle-board'
  | 'flush-door'
  | 'smart-locks';

/** Where a board may sit, from Ananta's own product copy / FAQ (A1). */
export type Exposure = 'dry' | 'humid' | 'wet';

/** Application groups — each mapping below is taken from A1 product copy. */
export type Application =
  | 'kitchens'
  | 'wardrobes'
  | 'furniture'
  | 'wet-zones'
  | 'panelling'
  | 'commercial'
  | 'doors';

export type Category = {
  slug: CategorySlug;
  /** Translation key in `nav` + `catalog.categories.*`. */
  key: string;
  /** Watermark-free studio render (cropped from Ananta's own category image). */
  image: string;
  subs: {slug: string; key: string}[];
};

export type Standard = {
  /** Short label, e.g. "IS 303". */
  label: string;
  /** Who states it. Shown as "as stated by …". */
  by: 'Duroply' | 'Action TESA';
  detail?: string;
};

export type Product = {
  slug: string;
  name: string;
  /** Compact display name for tiles. */
  short: string;
  brand: Brand;
  category: CategorySlug;
  subcategory: string;
  /** One-line summary, A1 wording (tightened, meaning unchanged). */
  summary: string;
  /** About paragraph, A1 (claims that failed verification removed). */
  about: string;
  /** Spec rows. Only sourced values. */
  specs: [string, string][];
  /** Size / thickness options exactly as A1's size selector lists them. */
  sizes: string[];
  sizesLabel?: string;
  sizesNote?: string;
  standards: Standard[];
  exposure?: Exposure;
  applications: Application[];
  /** Human list of uses (A1). */
  uses: string[];
  /** Explicit limit from A1/M copy, shown as "Not for". */
  notFor?: string;
  faqs: {q: string; a: string}[];
  /** Clean visual for tiles (no people, no printed warranty badges). */
  cardImage: string;
  /** Detail-page gallery (manufacturer imagery included, captioned). */
  images: string[];
  decorCode?: string;
  specsOnRequest?: boolean;
};

export const CATEGORIES: Category[] = [
  {
    slug: 'plywood',
    key: 'plywood',
    image: '/images/materials/plywood.webp',
    subs: [
      {slug: 'moisture-resistant', key: 'moistureResistant'},
      {slug: 'boiling-water-proof', key: 'boilingWaterProof'}
    ]
  },
  {
    slug: 'mdf',
    key: 'mdf',
    image: '/images/materials/mdf.webp',
    subs: [
      {slug: 'interior-grade', key: 'interiorGrade'},
      {slug: 'exterior-grade', key: 'exteriorGrade'},
      {slug: 'hdhmr', key: 'hdhmr'}
    ]
  },
  {
    slug: 'high-moisture-resistant-board-moist-master',
    key: 'moistMaster',
    image: '/images/materials/hmr.webp',
    subs: [{slug: 'moist-master', key: 'moistMasterSub'}]
  },
  {
    slug: 'pre-laminated-particle-board',
    key: 'prelam',
    image: '/images/materials/prelam.webp',
    subs: [{slug: 'boards', key: 'boards'}]
  },
  {
    slug: 'flush-door',
    key: 'flushDoor',
    image: '/images/materials/flush-door.webp',
    subs: [{slug: 'door', key: 'door'}]
  },
  {
    slug: 'smart-locks',
    key: 'smartLocks',
    image: '/images/materials/smart-locks.webp',
    subs: [{slug: 'locks', key: 'locks'}]
  }
];

const P = '/images/products/';

const PRELAM_FAQ = [
  {
    q: 'What is a pre-laminated particle board?',
    a: 'A particle board that comes with a factory-applied decorative melamine laminate on both sides. It is ready to use for furniture manufacturing without separate lamination or finishing.'
  },
  {
    q: 'What are the advantages of pre-laminated boards?',
    a: 'They save time and labour by eliminating separate lamination, give a consistent factory finish, are scratch-resistant and easy to clean, and come in a wide range of colours and textures.'
  }
];

const prelam = (
  code: string,
  decor: string,
  slugTail: string,
  summary: string,
  about: string,
  uses: string[],
  applications: Application[],
  extraFaq: {q: string; a: string}[] = []
): Product => ({
  slug: `action-tesa-prelam-particle-board-${slugTail}`,
  name: `Action TESA Prelam Particle Board ${code} – ${decor}`,
  short: `${code} ${decor}`,
  brand: 'Action TESA',
  category: 'pre-laminated-particle-board',
  subcategory: 'boards',
  summary,
  about,
  specs: [
    ['Board', 'Pre-laminated particle board'],
    ['Décor', `${code} – ${decor}`],
    ['Surface', 'Factory melamine laminate, both sides']
  ],
  sizes: ['9 MM', '11 MM', '17 MM', '25 MM'],
  sizesLabel: 'Thickness',
  standards: [],
  exposure: 'dry',
  applications,
  uses,
  notFor: 'High-moisture zones — use HMR or HDHMR boards there.',
  faqs: [...PRELAM_FAQ, ...extraFaq],
  cardImage: `/images/decor-thumbs/${code}-${decor.toLowerCase().replace(/\s+/g, '-')}.webp`,
  images: [`${P}action-tesa-prelam-particle-board-${slugTail}.jpg`],
  decorCode: code
});

const lock = (
  slug: string,
  name: string,
  summary: string,
  uses: string[],
  imgs: string[],
  extra: Partial<Product> = {}
): Product => ({
  slug,
  name,
  short: name,
  brand: 'Tenon Smart Lock',
  category: 'smart-locks',
  subcategory: 'locks',
  summary,
  about: `${name} by Tenon Smart Lock, supplied by Ananta Corporation for retail and bulk project requirements. Ask our team for current specifications, finishes and availability.`,
  specs: [
    ['Brand', 'Tenon Smart Lock'],
    ['Type', name]
  ],
  sizes: [],
  standards: [],
  applications: ['doors'],
  uses,
  faqs: [],
  cardImage: imgs[0],
  images: imgs,
  specsOnRequest: true,
  ...extra
});

export const PRODUCTS: Product[] = [
  // ── PLYWOOD (Duroply) ──────────────────────────────────────────────────────
  {
    slug: 'duroply-mr-moisture-resistant-plywood',
    name: 'Duroply MR Moisture Resistant Plywood',
    short: 'Duroply MR Plywood',
    brand: 'Duroply',
    category: 'plywood',
    subcategory: 'moisture-resistant',
    summary: 'Interior-grade plywood for furniture, wardrobes, shelving and partitions.',
    about:
      'Duroply MR (Moisture Resistant) plywood is the go-to choice for interior furniture, partitions and shelving. Bonded with urea formaldehyde resin, it offers dependable moisture resistance in normal indoor conditions and is available in multiple thicknesses for residential and commercial work.',
    specs: [
      ['Grade', 'MR — moisture resistant'],
      ['Bonding resin', 'Urea formaldehyde'],
      ['Sheet size', '8 × 4 ft'],
      ['Overall thickness range', '4 – 25 mm']
    ],
    sizes: ['6 MM', '8 MM', '12 MM', '16 MM', '18 MM'],
    sizesLabel: 'Thickness',
    // Listed sizes = A1 size selector; 4–25 mm = A1 FAQ (first-party, not a Duroply statement).
    sizesNote: 'Thicknesses listed for this product: 6, 8, 12, 16 and 18 mm. Ananta quotes an overall 4–25 mm range in 8 × 4 ft sheets — ask the team about other thicknesses.',
    standards: [{label: 'IS 303', by: 'Duroply', detail: 'MR grade plywood for interior applications'}],
    exposure: 'dry',
    applications: ['wardrobes', 'furniture', 'panelling'],
    uses: ['Furniture', 'Wardrobes', 'Bed frames', 'Shelving', 'Wall partitions'],
    notFor: 'Areas directly exposed to water, such as sink cabinets — use BWP there.',
    faqs: [
      {
        q: 'What is MR grade plywood used for?',
        a: 'Interior applications such as furniture, wardrobes, bed frames, shelving and wall partitions. It offers good resistance to moisture in normal indoor conditions.'
      },
      {
        q: 'Is MR plywood suitable for kitchen cabinets?',
        a: 'It can be used for kitchen cabinets in areas with moderate moisture. For areas directly exposed to water, such as sink cabinets, BWP plywood is recommended.'
      }
    ],
    cardImage: '/images/materials/plywood.webp',
    images: [`${P}duroply-mr-moisture-resistant-plywood.jpg`, `${P}duroply-mr-moisture-resistant-plywood-2.webp`]
  },
  {
    slug: 'duroply-bwp-boiling-water-proof-plywood',
    name: 'Duroply BWP Boiling Water Proof Plywood',
    short: 'Duroply BWP Plywood',
    brand: 'Duroply',
    category: 'plywood',
    subcategory: 'boiling-water-proof',
    summary: 'Water-resistant plywood for kitchens, bathroom vanities and wet zones.',
    about:
      'Duroply BWP (Boiling Water Proof) plywood is designed for areas exposed to constant moisture and water. Manufactured under high pressure with phenol formaldehyde resin, it is suited to kitchen cabinets, bathroom vanities and exterior furniture.',
    specs: [
      ['Grade', 'BWP — boiling water proof'],
      ['Bonding resin', 'Phenol formaldehyde'],
      ['Sheet size', '8 × 4 ft'],
      ['Overall thickness range', '4 – 25 mm']
    ],
    sizes: ['9 MM', '12 MM', '19 MM'],
    sizesLabel: 'Thickness',
    // Listed sizes = A1 size selector; 4–25 mm = A1 copy (first-party).
    sizesNote: 'Thicknesses listed for this product: 9, 12 and 19 mm. Ananta quotes an overall 4–25 mm range in standard 8 × 4 ft sheets; custom sizes on request for bulk orders.',
    standards: [{label: 'IS 710', by: 'Duroply', detail: 'BWP / marine grade plywood'}],
    exposure: 'wet',
    applications: ['kitchens', 'wet-zones', 'furniture'],
    uses: ['Kitchen cabinets', 'Sink units', 'Bathroom vanities', 'Exterior furniture'],
    faqs: [
      {
        q: 'What is BWP plywood and where is it used?',
        a: 'BWP plywood is bonded with phenol formaldehyde resin, making it highly resistant to water and moisture. It is used in kitchens, bathrooms and exterior furniture where exposure to water is frequent.'
      },
      {
        q: 'What is the difference between BWP and MR plywood?',
        a: 'BWP uses phenol formaldehyde resin and suits wet areas. MR uses urea formaldehyde resin; it resists moisture but is not suitable for direct water exposure.'
      }
    ],
    cardImage: '/images/materials/plywood-edge.webp',
    images: [`${P}duroply-bwp-boiling-water-proof-plywood.jpg`, `${P}duroply-bwp-boiling-water-proof-plywood-2.webp`]
  },

  // ── MDF (Action TESA) ──────────────────────────────────────────────────────
  {
    slug: 'action-tesa-interior-grade-mdf',
    name: 'Action TESA Interior Grade MDF',
    short: 'Interior Grade MDF',
    brand: 'Action TESA',
    category: 'mdf',
    subcategory: 'interior-grade',
    summary: 'Smooth, uniform MDF for furniture, cabinetry and decorative panels.',
    about:
      'Action TESA Interior Grade MDF is engineered for indoor furniture, cabinetry, decorative wall panels and modular kitchen components. Its smooth, uniform surface takes paint, veneer and laminate finishes, which makes it the preferred board for precision woodworking.',
    specs: [
      ['Board', 'Medium density fibreboard — interior (regular) grade'],
      ['Construction', 'Homogeneous, without layers'],
      ['Finishes', 'Paint, veneer, laminate'],
      ['Sheet size', '8 × 4 ft'],
      ['Overall thickness range', '2.5 – 25 mm']
    ],
    sizes: ['1.90 MM', '3.30 MM', '5.50 MM', '7.00 MM', '11 MM', '16.50 MM', '25 MM'],
    sizesLabel: 'Thickness',
    sizesNote: 'The listed thicknesses are the options Ananta shows for this board; the overall 2.5–25 mm range is indicative — confirm the exact thickness with the team.',
    standards: [
      {label: 'German technology', by: 'Action TESA', detail: 'homogeneous structure, board to board'},
      {label: 'IS 12406', by: 'Action TESA', detail: 'MDF compliance'}
    ],
    exposure: 'dry',
    applications: ['furniture', 'wardrobes', 'kitchens', 'panelling'],
    uses: ['Furniture', 'Kitchen cabinets', 'Wardrobes', 'Decorative wall panels', 'Shelving', 'Display units'],
    faqs: [
      {
        q: 'What is interior grade MDF used for?',
        a: 'Furniture, kitchen cabinets, wardrobes, decorative wall panels, shelving and display units. Its smooth surface is ideal for painting, laminating and veneering.'
      },
      {
        q: 'What is the difference between MDF and plywood?',
        a: 'MDF is compressed wood fibre with a smooth, uniform surface ideal for painted finishes. Plywood is layered veneer with greater structural strength. MDF is preferred for decorative work, plywood for load-bearing applications.'
      }
    ],
    cardImage: `${P}action-tesa-interior-grade-mdf-2.webp`,
    images: [`${P}action-tesa-interior-grade-mdf-2.webp`, `${P}action-tesa-interior-grade-mdf.jpg`]
  },
  {
    slug: 'action-tesa-exterior-grade-mdf',
    name: 'Action TESA Exterior Grade MDF',
    short: 'Exterior Grade MDF',
    brand: 'Action TESA',
    category: 'mdf',
    subcategory: 'exterior-grade',
    summary: 'Moisture-resistant MDF for covered, humid and semi-outdoor areas.',
    about:
      'Action TESA Exterior Grade MDF is made with moisture-resistant resins for semi-outdoor and high-humidity applications. It keeps the smooth, workable surface of standard MDF while resisting swelling in damp conditions — for covered balconies, bathrooms and exterior wall panelling.',
    specs: [
      ['Board', 'Medium density fibreboard — MR / exterior grade'],
      ['Construction', 'Homogeneous, without layers'],
      ['Exposure', 'Covered, humid and semi-outdoor areas']
    ],
    sizes: ['3.30 MM', '5.50 MM', '7.30 MM', '11 MM', '17 MM', '25 MM'],
    sizesLabel: 'Thickness',
    standards: [
      {label: 'German technology', by: 'Action TESA', detail: 'homogeneous MDF structure'},
      {label: 'IS 12406', by: 'Action TESA', detail: 'MDF compliance'}
    ],
    exposure: 'humid',
    applications: ['wet-zones', 'panelling'],
    uses: ['Covered balconies', 'Bathrooms', 'Exterior wall panelling', 'High-humidity interiors'],
    notFor: 'Direct rain or standing water — fully exposed outdoor use needs a protective coating.',
    faqs: [
      {
        q: 'Can exterior MDF be used outdoors?',
        a: 'It is designed for semi-outdoor and high-humidity areas such as covered balconies, bathrooms and exterior wall panelling. For fully exposed outdoor applications, an additional protective coating is recommended.'
      },
      {
        q: 'What is the difference between interior and exterior MDF?',
        a: 'Interior MDF uses standard adhesives suited to dry indoor conditions. Exterior MDF uses moisture-resistant resins that resist swelling in humid or damp environments.'
      }
    ],
    cardImage: `${P}action-tesa-exterior-grade-mdf-2.jpg`,
    images: [`${P}action-tesa-exterior-grade-mdf-2.jpg`, `${P}action-tesa-exterior-grade-mdf.jpg`]
  },
  {
    slug: 'action-tesa-hdhmr-board',
    name: 'Action TESA HDHMR Board',
    short: 'HDHMR Board',
    brand: 'Action TESA',
    category: 'mdf',
    subcategory: 'hdhmr',
    summary: 'High-density, high-moisture-resistant board for kitchens and vanities.',
    about:
      'Action TESA HDHMR (High Density High Moisture Resistant) board combines the strength of high-density fibreboard with moisture resistance. It holds screws firmly, offers a smooth surface for laminate and veneer, and is the preferred material for modular kitchens, bathroom vanities and commercial interiors.',
    specs: [
      ['Board', 'High density, high moisture resistant'],
      ['Density', 'Over 850 kg/m³'],
      ['Surface', 'Smooth, ready for laminate or veneer'],
      ['Sheet size', '8 × 4 ft']
    ],
    sizes: ['3 MM', '5.50 MM', '7.50 MM', '11 MM', '16.75 MM', '18 MM', '25 MM'],
    sizesLabel: 'Thickness',
    standards: [
      {label: 'Density > 850 kg/m³', by: 'Action TESA'},
      {label: 'German mat-forming technology', by: 'Action TESA'}
    ],
    exposure: 'humid',
    applications: ['kitchens', 'wardrobes', 'wet-zones', 'commercial'],
    uses: ['Modular kitchens', 'Wardrobes', 'Bathroom vanities', 'Commercial furniture'],
    faqs: [
      {
        q: 'What is HDHMR board?',
        a: 'An engineered panel that combines high density for structural strength with moisture-resistant resins. It is widely used for modular kitchens, wardrobes and commercial furniture.'
      },
      {
        q: 'Is HDHMR better than plywood for kitchens?',
        a: 'HDHMR offers a smoother surface, good screw holding and consistent quality. For modular kitchen carcasses it is often preferred for its moisture resistance and uniform density.'
      }
    ],
    cardImage: '/images/materials/mdf.webp',
    images: ['/images/materials/mdf.webp']
  },

  // ── HMR (Action TESA Moist Master) ─────────────────────────────────────────
  {
    slug: 'action-tesa-moist-master-hmr-board',
    name: 'Action TESA Moist Master HMR Board',
    short: 'Moist Master HMR',
    brand: 'Action TESA',
    category: 'high-moisture-resistant-board-moist-master',
    subcategory: 'moist-master',
    summary: 'High-moisture-resistant particle board for kitchen carcasses and humid rooms.',
    about:
      'Action TESA Moist Master is a high moisture resistant (HMR) particle board for modular kitchens, bathroom furniture, commercial interiors and any application where humidity is above normal. It offers a smooth surface for laminate application.',
    specs: [
      ['Board', 'HMR particle board'],
      ['Density', 'Above 750 kg/m³'],
      ['Treatment', 'Termite and borer resistant']
    ],
    sizes: ['9 MM', '12 MM', '18 MM'],
    sizesLabel: 'Thickness',
    standards: [
      {label: 'Density > 750 kg/m³', by: 'Action TESA'},
      {label: 'Termite & borer resistance', by: 'Action TESA'}
    ],
    exposure: 'humid',
    applications: ['kitchens', 'wardrobes', 'wet-zones', 'commercial'],
    uses: ['Modular kitchen carcasses', 'Wardrobe interiors', 'Bathroom furniture', 'Commercial furniture'],
    faqs: [
      {
        q: 'What is the difference between HMR and HDHMR board?',
        a: 'HMR is a standard-density particle board with moisture resistance. HDHMR has higher density, giving better screw holding and rigidity in addition to moisture resistance — preferred for heavy-duty applications.'
      },
      {
        q: 'Is HMR board termite resistant?',
        a: 'Yes. Action TESA Moist Master boards are treated for resistance against termites and borers.'
      }
    ],
    cardImage: `${P}action-tesa-moist-master-hmr-board-2.webp`,
    images: [`${P}action-tesa-moist-master-hmr-board-2.webp`, `${P}action-tesa-moist-master-hmr-board.jpg`]
  },

  // ── PRE-LAMINATED PARTICLE BOARD (Action TESA) ─────────────────────────────
  prelam(
    '1103',
    'Frosty White',
    '1103-frosty-white',
    'Clean solid white for modular furniture and interiors.',
    'Action TESA pre-laminated particle board in Frosty White (code 1103). The pre-applied melamine laminate removes the separate lamination step, saving production time and cost — for wardrobes, office furniture, modular kitchens and commercial interiors.',
    ['Wardrobes', 'Office furniture', 'Modular kitchens', 'Commercial interiors'],
    ['wardrobes', 'kitchens', 'commercial', 'furniture']
  ),
  prelam(
    '1104',
    'Silver Grey',
    '1104-silver-grey',
    'Contemporary grey for offices, wardrobes and commercial furniture.',
    'Action TESA pre-laminated particle board in Silver Grey (code 1104) — a popular choice for modern office interiors, wardrobes and commercial furniture, without additional lamination cost.',
    ['Office interiors', 'Wardrobes', 'Commercial furniture', 'Pantry units'],
    ['commercial', 'wardrobes', 'furniture'],
    [
      {
        q: 'Is Silver Grey pre-laminated board suitable for modular kitchens?',
        a: 'It can be used for kitchen cabinets and pantry units. For areas with high moisture exposure, consider HMR or HDHMR boards with lamination.'
      }
    ]
  ),
  prelam(
    '1142',
    'Pebble Beach',
    '1142-pebble-beach',
    'Stone-inspired texture for reception desks and designer interiors.',
    'Action TESA pre-laminated particle board in Pebble Beach (code 1142) — a stone-inspired texture for feature furniture, reception desks and designer interiors.',
    ['Feature furniture', 'Reception desks', 'Designer interiors'],
    ['commercial', 'furniture']
  ),
  prelam(
    '3009',
    'Classic Planked Walnut',
    '3009-classic-planked-walnut',
    'Planked walnut grain for wardrobes, TV units and office furniture.',
    'Action TESA pre-laminated particle board in Classic Planked Walnut (code 3009) — a rich wood-grain finish that replicates natural walnut, for wardrobes, TV units and executive office furniture.',
    ['Wardrobes', 'TV units', 'Executive office furniture'],
    ['wardrobes', 'furniture', 'commercial']
  ),
  prelam(
    '3018',
    'Mangfall Beech',
    '3018-mangfall-beech',
    'Light, warm beech grain for workstations and bright interiors.',
    "Action TESA pre-laminated particle board in Mangfall Beech (code 3018) — a light, warm wood-grain finish for Scandinavian-style interiors, children's furniture, study tables and modern workstations.",
    ["Children's furniture", 'Study tables', 'Workstations', 'Office interiors'],
    ['furniture', 'commercial']
  ),

  // ── FLUSH DOOR (Duroply) ───────────────────────────────────────────────────
  {
    slug: 'duro-flush-door',
    name: 'Duro Door Flush Door',
    short: 'Duro Flush Door',
    brand: 'Duroply',
    category: 'flush-door',
    subcategory: 'door',
    summary: 'BWP-grade flush doors in standard and custom sizes.',
    about:
      'Duro Door flush doors are made with a robust frame construction and calibrated timber for dimensional stability, with a smooth surface for painting or veneer. They are treated for termite resistance and suit both residential and commercial interiors — bedrooms, bathrooms and main doors.',
    specs: [
      ['Grade', 'BWP grade'],
      ['Treatment', 'Termite resistant'],
      ['Surface', 'Smooth — for paint or veneer'],
      ['Standard sizes', '7 × 3 ft and 8 × 4 ft'],
      ['Thickness', '30 mm, 35 mm']
    ],
    sizes: ['30x80', '33x80', '33x90', '33x93', '36x93', '48x96', 'Custom'],
    sizesLabel: 'Size (in)',
    sizesNote: 'Custom sizes can be arranged on bulk orders.',
    standards: [
      {label: 'IS 2202', by: 'Duroply', detail: 'available in BWP grade conforming to IS 2202'},
      {label: 'Termite treatment', by: 'Duroply'}
    ],
    applications: ['doors'],
    uses: ['Bedroom doors', 'Bathroom doors', 'Main doors', 'Commercial interiors'],
    faqs: [
      {
        q: 'What is a flush door?',
        a: 'A flat door with a solid or hollow core, covered with plywood or MDF face panels — a smooth, even surface on both sides for homes, offices and commercial buildings.'
      },
      {
        q: 'What sizes of flush doors are available?',
        a: 'Standard 7 × 3 ft and 8 × 4 ft, in 30 mm and 35 mm thickness. Custom sizes can be arranged on bulk orders.'
      }
    ],
    cardImage: '/images/materials/flush-door.webp',
    images: ['/images/materials/flush-door.webp', `${P}duro-flush-door.jpg`, `${P}duro-flush-door-2.webp`]
  },

  // ── SMART LOCKS (Tenon) — names only; specs on request (A1 has none) ───────
  lock('automatic-sliding-smart-lock', 'Automatic Sliding Smart Lock', 'Smart lock for sliding doors.', ['Sliding doors'], [
    `${P}automatic-sliding-smart-lock-2.jpg`,
    `${P}automatic-sliding-smart-lock.jpg`
  ]),
  lock(
    'fingerprint-smart-door-lock-with-app',
    'Fingerprint Smart Door Lock with App',
    'Fingerprint smart door lock with app control.',
    ['Main doors', 'Interior doors'],
    [`${P}fingerprint-smart-door-lock-with-app.jpg`, `${P}fingerprint-smart-door-lock-with-app-2.jpg`]
  ),
  lock(
    'high-end-smart-main-door-lock',
    'High-End Smart Main Door Lock',
    'Smart lock for the main door.',
    ['Main doors'],
    [`${P}high-end-smart-main-door-lock.jpg`, `${P}high-end-smart-main-door-lock-2.jpg`]
  ),
  lock(
    'mini-smart-lever-lock-for-interior-doors',
    'Mini Smart Lever Lock for Interior Doors',
    'Compact smart lever lock for interior doors.',
    ['Interior doors'],
    [`${P}mini-smart-lever-lock-for-interior-doors-2.webp`, `${P}mini-smart-lever-lock-for-interior-doors.webp`]
  ),
  lock(
    'palm-vein-face-recognition-smart-lock',
    'Palm Vein & Face Recognition Smart Lock',
    'Smart lock with palm-vein and face recognition.',
    ['Main doors'],
    [`${P}palm-vein-face-recognition-smart-lock.jpg`, `${P}palm-vein-face-recognition-smart-lock-2.jpg`]
  ),
  lock(
    'sliding-fingerprint-door-lock',
    'Sliding Fingerprint Door Lock',
    'Touch-activated sliding lock with OLED screen and automatic closing.',
    ['Bedroom doors', 'Interior sliding doors'],
    [`${P}sliding-fingerprint-door-lock.webp`],
    {
      about:
        'A touch-activated sliding smart lock with OLED screen and automatic closing — keyless access for bedroom and interior sliding doors. Supplied by Ananta Corporation for retail and bulk project requirements.',
      specs: [
        ['Brand', 'Tenon Smart Lock'],
        ['Access', 'Fingerprint, keyless'],
        ['Display', 'OLED screen'],
        ['Closing', 'Automatic']
      ],
    }
  ),
  lock(
    'smart-lever-handle-lock',
    'Smart Lever Handle Lock',
    'Smart lock in a lever-handle format.',
    ['Interior doors', 'Main doors'],
    [`${P}smart-lever-handle-lock.jpg`, `${P}smart-lever-handle-lock-2.jpg`]
  ),
  lock('wifi-smart-door-lock', 'WiFi Smart Door Lock', 'WiFi-connected smart door lock.', ['Main doors'], [
    `${P}wifi-smart-door-lock.jpg`,
    `${P}wifi-smart-door-lock-2.jpg`
  ])
];

// ── Helpers ──────────────────────────────────────────────────────────────────

export function categoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function productsByCategory(category: string): Product[] {
  return PRODUCTS.filter((p) => p.category === category);
}

export function productsBySubcategory(category: string, sub: string): Product[] {
  return PRODUCTS.filter((p) => p.category === category && p.subcategory === sub);
}

export function productByPath(category: string, sub: string, slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.category === category && p.subcategory === sub && p.slug === slug);
}

export function categoryHref(slug: CategorySlug): Href {
  return {pathname: '/products/[category]', params: {category: slug}} as Href;
}

export function subcategoryHref(category: CategorySlug, sub: string): Href {
  return {pathname: '/products/[category]/[sub]', params: {category, sub}} as Href;
}

export function productHref(p: Product): Href {
  return {
    pathname: '/products/[category]/[sub]/[slug]',
    params: {category: p.category, sub: p.subcategory, slug: p.slug}
  } as Href;
}

/** Plain path string for client components / WhatsApp context. */
export function productPath(p: Product): string {
  return `/products/${p.category}/${p.subcategory}/${p.slug}`;
}

/** Related products: same category first, then same brand, excluding self. */
export function relatedProducts(p: Product, count = 4): Product[] {
  const same = PRODUCTS.filter((x) => x.slug !== p.slug && x.category === p.category);
  const brand = PRODUCTS.filter((x) => x.slug !== p.slug && x.category !== p.category && x.brand === p.brand);
  const rest = PRODUCTS.filter((x) => x.slug !== p.slug && x.category !== p.category && x.brand !== p.brand);
  return [...same, ...brand, ...rest].slice(0, count);
}
