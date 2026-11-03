/**
 * Site copy + content registry.
 *
 * Every factual line carries a provenance tag in a comment:
 *   A1  = anantacorporation.com (Ananta first-party; docs/ananta-full-site.md)
 *   A2  = anantacorporation.com JSON-LD
 *   M-* = manufacturer site (see research/ANANTA_CONTENT_TRUTH.md)
 *   D   = computed from src/data (never hard-coded)
 * Copy that is pure positioning (no factual claim) is untagged.
 * Unit test tests/unit/claims.test.ts scans this file + data for banned /
 * unsupported claims.
 */
import type {Application, CategorySlug, Exposure} from '@/data/products';

export const COMPANY = {
  name: 'Ananta Corporation',
  // A1 footer + A2 postalCode. 382425 (A1 mobile menu) is a known conflict —
  // NEEDS OWNER CONFIRMATION; only 382405 is published.
  addressLines: ['293/2, Godown No. 17, Nanukaka Estate', 'Opp. Sub Station, Pirana Road, Piplaj', 'Ahmedabad, Gujarat 382405'],
  street: '293/2, Godown No. 17, Nanukaka Estate, Opp. Sub Station, Pirana Road, Piplaj',
  city: 'Ahmedabad',
  region: 'Gujarat',
  postalCode: '382405',
  phoneDisplay: '+91 83200 52838', // A1
  phoneHref: 'tel:+918320052838',
  email: 'info@anantacorporation.com', // A1
  gstin: '24ACDFA7104Q1ZB', // A1 footer
  since: '2020', // A1 "Trusted Since 2020" + A2 foundingDate
  facility: '11,000 sq. ft.', // A1 about: "11,000 sq. ft. of warehouse and workshop space"
  instagram: 'https://www.instagram.com/anantacorporation1', // A1
  facebook: 'https://www.facebook.com/share/1CV5X8xETv/?mibextid=wwXIfr', // A1
  mapsQuery: 'Nanukaka Estate, Pirana Road, Piplaj, Ahmedabad 382405'
} as const;

/** Google Maps search link for the warehouse (built from COMPANY.mapsQuery). */
export const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(COMPANY.mapsQuery)}`;

/** Official logo assets (manufacturer-supplied; never recoloured or stretched). */
export const BRAND_ASSETS = {
  Duroply: {
    logo: '/images/brands/duroply-official.png', // duroply.in/images/logo.png (150×50, largest published)
    w: 150,
    h: 50,
    slug: 'duroply',
    // A1 hero: "Authorized distributor of Duroply, Action Tesa" — FIRST-PARTY claim.
    relation: 'Authorized distributor',
    supplies: 'MR & BWP plywood, Duro Door flush doors'
  },
  'Action TESA': {
    logo: '/images/brands/action-tesa.png', // A1 / actiontesa.com
    w: 2139,
    h: 832,
    slug: 'action-tesa',
    relation: 'Authorized distributor',
    supplies: 'Interior, exterior & HDHMR MDF, Moist Master HMR, pre-laminated boards'
  },
  'Tenon Smart Lock': {
    logo: '/images/brands/tenon-smart-lock.png', // A1 (151×31)
    logoOnDark: '/images/brands/tenon-white.png', // tenonlock.com (400×139, white)
    w: 151,
    h: 31,
    slug: 'tenon-smart-lock',
    // A1 only says Ananta supplies Tenon — never "authorized".
    relation: 'Supplied range',
    supplies: 'Smart locks for main, interior and sliding doors'
  }
} as const;

export const HERO = {
  eyebrow: `Ahmedabad · Since ${COMPANY.since}`,
  title: 'Engineered boards, plywood & doors for interior projects.',
  sub: 'Duroply plywood and flush doors, Action TESA MDF, HDHMR, Moist Master and pre-laminated boards, and Tenon smart locks — supplied from ready stock in Ahmedabad.', // A1 brands/categories + A1 "ready-to-dispatch inventory"
  audience: 'For architects, interior designers, furniture manufacturers and contractors.', // A1 positioning
  partnerLabel: 'Authorized distributor', // A1 (first-party)
  ctaPrimary: 'Explore products',
  ctaSecondary: 'Get price on WhatsApp'
};

/** Application groups. Mappings live on each product (A1-sourced). */
export const APPLICATIONS: {key: Application; label: string; hint: string}[] = [
  {key: 'kitchens', label: 'Kitchens', hint: 'Carcasses, shutters, sink units'},
  {key: 'wardrobes', label: 'Wardrobes', hint: 'Carcasses, interiors, shutters'},
  {key: 'furniture', label: 'Furniture', hint: 'Loose & built-in furniture'},
  {key: 'wet-zones', label: 'Bathrooms & wet zones', hint: 'Vanities, humid & semi-outdoor areas'},
  {key: 'panelling', label: 'Partitions & panelling', hint: 'Wall panels, partitions'},
  {key: 'commercial', label: 'Office & commercial', hint: 'Workstations, reception, retail'},
  {key: 'doors', label: 'Doors & access', hint: 'Flush doors, smart locks'}
];

export const EXPOSURE_LABEL: Record<Exposure, string> = {
  dry: 'Dry interior',
  humid: 'Humid / moisture-prone',
  wet: 'Wet zones'
};

/**
 * Audience entry points — "what can I source here?" (A1 audiences: architects,
 * interior designers, furniture manufacturers, contractors; builders and
 * homeowners via A1 "residential and industrial projects" / "homeowners").
 * `key` matches BlogAudience in src/content/blog/types.ts. `applications`
 * picks the example products (from each product's own application mapping);
 * `tools` are ToolSlugs from src/content/tools.ts. No exclusive services.
 */
export const AUDIENCES: {
  key: 'interior-designer' | 'architect' | 'furniture-manufacturer' | 'contractor' | 'builder' | 'homeowner';
  label: string;
  line: string;
  categories: CategorySlug[];
  applications: Application[];
  tools: string[];
  extra?: string;
}[] = [
  {
    key: 'interior-designer',
    label: 'Interior Designer',
    line: 'Finishes, boards and doors for residential and commercial interiors.',
    categories: ['pre-laminated-particle-board', 'mdf', 'plywood', 'flush-door', 'smart-locks'],
    applications: ['wardrobes', 'kitchens', 'panelling'],
    tools: ['finish-explorer', 'material-selector', 'compare'],
    extra: 'Browse the full prelam décor library by family and code.'
  },
  {
    key: 'architect',
    label: 'Architect',
    line: 'Grades matched to exposure, with the manufacturer standard named on each product.',
    categories: ['plywood', 'mdf', 'high-moisture-resistant-board-moist-master', 'flush-door'],
    applications: ['wet-zones', 'commercial', 'panelling'],
    tools: ['material-selector', 'compare'],
    extra: 'Specify by exposure first, then compare the published attributes side by side.'
  },
  {
    key: 'furniture-manufacturer',
    label: 'Furniture Manufacturer',
    line: 'Carcass and shutter boards in the thicknesses production needs.',
    categories: ['mdf', 'high-moisture-resistant-board-moist-master', 'plywood', 'pre-laminated-particle-board'],
    applications: ['furniture', 'wardrobes', 'kitchens'],
    tools: ['compare', 'sheet-calculator', 'requirement-builder'],
    extra: 'Material supply plus custom furniture to your drawings.' // A1 "End-to-end: Material Supply + Custom Furniture"
  },
  {
    key: 'contractor',
    label: 'Contractor',
    line: 'Bulk requirements across plywood, MDF, boards and doors from one supplier.',
    categories: ['plywood', 'mdf', 'flush-door', 'high-moisture-resistant-board-moist-master', 'smart-locks'],
    applications: ['kitchens', 'wet-zones', 'doors'],
    tools: ['requirement-builder', 'sheet-calculator'],
    extra: 'Bulk orders and contractor partnerships available.' // A1 announcement bar
  },
  {
    key: 'builder',
    label: 'Builder',
    line: 'Boards, flush doors and smart locks for residential and commercial projects.',
    categories: ['flush-door', 'smart-locks', 'plywood', 'mdf'],
    applications: ['doors', 'kitchens', 'commercial'],
    tools: ['requirement-builder', 'sheet-calculator'],
    extra: 'Send a multi-category requirement list in one message.'
  },
  {
    key: 'homeowner',
    label: 'Homeowner',
    line: 'Plywood, finished boards, doors and smart locks for your own home interior.',
    categories: ['plywood', 'pre-laminated-particle-board', 'flush-door', 'smart-locks'],
    applications: ['wardrobes', 'kitchens', 'doors'],
    tools: ['material-selector', 'finish-explorer'],
    extra: 'Not sure which grade? Start with the material selector, then ask the team.'
  }
];

/**
 * Material selector — deterministic, built ONLY from Ananta's own FAQ/product
 * copy (A1). Each answer lists product slugs in recommendation order.
 */
export const SELECTOR: {
  key: string;
  label: string;
  zones: {key: string; label: string; exposure: Exposure; picks: string[]; why: string}[];
}[] = [
  {
    key: 'kitchen',
    label: 'Kitchen',
    zones: [
      {
        key: 'sink',
        label: 'Sink & wet zone',
        exposure: 'wet',
        picks: ['duroply-bwp-boiling-water-proof-plywood'],
        why: 'Areas directly exposed to water call for BWP plywood.' // A1 MR FAQ
      },
      {
        key: 'carcass',
        label: 'Carcass',
        exposure: 'humid',
        picks: ['action-tesa-hdhmr-board', 'action-tesa-moist-master-hmr-board', 'duroply-bwp-boiling-water-proof-plywood'],
        why: 'HDHMR is often preferred for modular kitchen carcasses; Moist Master HMR is a moisture-resistant particle-board option.' // A1 HDHMR + HMR FAQ
      },
      {
        key: 'shutters',
        label: 'Painted shutters',
        exposure: 'dry',
        picks: ['action-tesa-interior-grade-mdf', 'action-tesa-hdhmr-board'],
        why: 'Interior MDF’s smooth surface suits painted, laminated and veneered finishes.' // A1 MDF FAQ
      }
    ]
  },
  {
    key: 'wardrobe',
    label: 'Wardrobe',
    zones: [
      {
        key: 'carcass',
        label: 'Carcass & shelves',
        exposure: 'dry',
        picks: ['duroply-mr-moisture-resistant-plywood', 'action-tesa-hdhmr-board', 'action-tesa-moist-master-hmr-board'],
        why: 'MR plywood is the interior grade for wardrobes and shelving; HDHMR and HMR are used for wardrobe carcasses and interiors.' // A1
      },
      {
        key: 'ready-finish',
        label: 'Ready-finished panels',
        exposure: 'dry',
        picks: [
          'action-tesa-prelam-particle-board-1103-frosty-white',
          'action-tesa-prelam-particle-board-3009-classic-planked-walnut',
          'action-tesa-prelam-particle-board-1104-silver-grey'
        ],
        why: 'Pre-laminated boards arrive finished on both faces — no separate lamination step.' // A1 prelam FAQ
      }
    ]
  },
  {
    key: 'bathroom',
    label: 'Bathroom & humid areas',
    zones: [
      {
        key: 'vanity',
        label: 'Vanity',
        exposure: 'wet',
        picks: ['duroply-bwp-boiling-water-proof-plywood', 'action-tesa-hdhmr-board'],
        why: 'BWP plywood and HDHMR are the grades listed for bathroom vanities.' // A1
      },
      {
        key: 'semi-outdoor',
        label: 'Covered balcony / semi-outdoor',
        exposure: 'humid',
        picks: ['action-tesa-exterior-grade-mdf'],
        why: 'Exterior MDF suits covered, humid and semi-outdoor areas — not direct rain.' // A1 FAQ + M-AT
      }
    ]
  },
  {
    key: 'office',
    label: 'Office & commercial',
    zones: [
      {
        key: 'workstations',
        label: 'Workstations & storage',
        exposure: 'dry',
        picks: [
          'action-tesa-prelam-particle-board-1104-silver-grey',
          'action-tesa-prelam-particle-board-3018-mangfall-beech',
          'action-tesa-prelam-particle-board-1103-frosty-white'
        ],
        why: 'Pre-laminated boards in grey, beech and white are listed for office interiors and workstations.' // A1
      },
      {
        key: 'feature',
        label: 'Reception & feature pieces',
        exposure: 'dry',
        picks: ['action-tesa-prelam-particle-board-1142-pebble-beach', 'action-tesa-prelam-particle-board-3009-classic-planked-walnut'],
        why: 'Stone and walnut décors are listed for reception desks and executive furniture.' // A1
      }
    ]
  },
  {
    key: 'doors',
    label: 'Doors',
    zones: [
      {
        key: 'leaf',
        label: 'Door leaf',
        exposure: 'dry',
        picks: ['duro-flush-door'],
        why: 'Duro Door flush doors for bedrooms, bathrooms and main doors, in standard and custom sizes.' // A1 + M-DP
      },
      {
        key: 'lock',
        label: 'Smart lock',
        exposure: 'dry',
        picks: ['high-end-smart-main-door-lock', 'mini-smart-lever-lock-for-interior-doors', 'sliding-fingerprint-door-lock'],
        why: 'Tenon smart locks for main, interior and sliding doors.' // A1 product names
      }
    ]
  }
];

/** Customer feedback — VERBATIM from A1 (home + about). No stars, no photos. */
export const TESTIMONIALS = [
  {
    quote:
      'They provided us all the ordered material and maintain ready stock of a wide range of MDF, plywood, and flush doors. Very reliable for project execution timelines.',
    name: 'Nisarg Patel',
    role: 'Project Manager'
  },
  {
    quote:
      'They delivered customized MDF articles as per our drawings using CNC machines. Quality was 100% checked and finishing was precise. Great technical support.',
    name: 'Ketanbhai Shah',
    role: 'Furniture Fabricator'
  },
  {
    quote:
      'All MDF ranges and thicknesses for interior, exterior, and HDMR were readily available. It saved us a lot of coordination time and delays on site.',
    name: 'Narendrabhai Patel',
    role: 'Interior Contractor'
  },
  {
    quote:
      'We’ve been sourcing plywood and MDF from Ananta Corporation for over a year now. Consistent quality, accurate thickness, and on-time delivery every single time. Makes our execution work much smoother.',
    name: 'Rakesh Patel',
    role: 'Interior Contractor, Ahmedabad'
  },
  {
    quote:
      'As a furniture manufacturer, material quality matters the most. Their MR and BWP plywood quality is reliable and finishing is excellent. Very transparent pricing as well.',
    name: 'Ashok Vavadiya',
    role: 'Furniture Manufacturer'
  },
  {
    quote:
      'Delivery was quick and properly packed. No damaged sheets, no confusion in sizes. This level of professionalism is rare in material supply businesses.',
    name: 'Kunal Mehta',
    role: 'Site Supervisor'
  }
];

/** Operations flow — stock → dispatch. Steps described from A1 copy only. */
export const OPERATIONS = [
  {k: '01', title: 'Ready stock', body: `Ready-to-dispatch inventory held in ${COMPANY.facility} of warehouse and workshop space.`}, // A1
  {k: '02', title: 'Selection', body: 'Guidance on the right grade, thickness and finish for the application.'}, // A1 "the right materials, the right guidance"
  {k: '03', title: 'Custom sizes', body: 'Custom sizes and designs, and furniture made to your drawings.'}, // A1 "Custom Sizes & Designs" + "Material Supply + Custom Furniture"
  {k: '04', title: 'Dispatch', body: 'Delivery arranged as per location and availability.'} // A1 product pages, verbatim
];

/** Custom furniture flow (A1: "End-to-end: Material Supply + Custom Furniture"). */
export const CUSTOM_FLOW = ['Drawing', 'Material', 'Cutting & machining', 'Finishing', 'Delivery'];

/** WhatsApp preset messages (A1 has the first two verbatim). */
export const WA = {
  default: "Hello! I'm interested in your products. Please share price and availability details.", // A1
  custom: "Hello, I'm interested in Custom Interior Solutions", // A1
  product: (name: string) => `Hello! I'm interested in ${name}. Please share price and availability details.`,
  category: (name: string) => `Hello! I'm looking for ${name}. Please share the available range, price and availability.`,
  decor: (code: string, name: string) => `Hello! I'm interested in prelam décor ${code} – ${name}. Please share price and availability.`,
  project: "Hello! I'm looking for material supply for a project. Can I share my requirement list?"
};
