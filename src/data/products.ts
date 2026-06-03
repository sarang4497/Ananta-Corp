/**
 * The product catalog — single source of truth for listings, category pages,
 * subcategory pages and the 20 product detail pages. Facts (specs, sizes,
 * standards) come from docs/ananta-full-site.md; page copy lives in
 * messages/en.json.
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

export type Category = {
  slug: CategorySlug;
  /** Translation key in the `nav` namespace + `catalog.categories.*`. */
  key: string;
  /** Self-hosted category visual (downloaded from the original site). */
  image: string;
  subs: {slug: string; key: string}[];
};

export const CATEGORIES: Category[] = [
  {
    slug: 'plywood',
    key: 'plywood',
    image: '/images/categories/plywood.jpg',
    subs: [
      {slug: 'moisture-resistant', key: 'moistureResistant'},
      {slug: 'boiling-water-proof', key: 'boilingWaterProof'}
    ]
  },
  {
    slug: 'mdf',
    key: 'mdf',
    image: '/images/categories/mdf.jpg',
    subs: [
      {slug: 'interior-grade', key: 'interiorGrade'},
      {slug: 'exterior-grade', key: 'exteriorGrade'},
      {slug: 'hdhmr', key: 'hdhmr'}
    ]
  },
  {
    slug: 'high-moisture-resistant-board-moist-master',
    key: 'moistMaster',
    image: '/images/categories/high-moisture-resistant-board-moist-master.jpg',
    subs: [{slug: 'moist-master', key: 'moistMasterSub'}]
  },
  {
    slug: 'pre-laminated-particle-board',
    key: 'prelam',
    image: '/images/categories/pre-laminated-particle-board.jpg',
    subs: [{slug: 'boards', key: 'boards'}]
  },
  {
    slug: 'flush-door',
    key: 'flushDoor',
    image: '/images/categories/flush-door.jpg',
    subs: [{slug: 'door', key: 'door'}]
  },
  {
    slug: 'smart-locks',
    key: 'smartLocks',
    image: '/images/categories/smart-locks.png',
    subs: [{slug: 'locks', key: 'locks'}]
  }
];

export type Product = {
  slug: string;
  name: string;
  brand: Brand;
  category: CategorySlug;
  subcategory: string;
  /** Short positioning line shown under the name. */
  tagline: string;
  /** The full, factual description (from the master doc). */
  description: string;
  features: string[];
  /** Spec table rows, in display order. */
  specs: [string, string][];
  /** Thickness / size options (display strings). */
  sizes: string[];
  sizesNote?: string;
  standards: string[];
  useCases: string[];
  /**
   * Self-hosted product photos (downloaded from the original site's R2
   * bucket). First entry is the primary shot used on cards and the gallery.
   */
  images?: string[];
  /** Self-hosted décor swatch (prelam SKUs). */
  decorImage?: string;
  /** Smart locks: no fabricated specs — note that details come on request. */
  specsOnRequest?: boolean;
};

export const PRODUCTS: Product[] = [
  // ── PLYWOOD ────────────────────────────────────────────────────────────────
  {
    slug: 'duroply-mr-moisture-resistant-plywood',
    images: ['/images/products/duroply-mr-moisture-resistant-plywood.jpg', '/images/products/duroply-mr-moisture-resistant-plywood-2.webp'],
    name: 'Duroply - MR Moisture Resistant Plywood',
    brand: 'Duroply',
    category: 'plywood',
    subcategory: 'moisture-resistant',
    tagline:
      'The go-to interior plywood — reliable moisture resistance for furniture, partitions and shelving.',
    description:
      'Duroply MR (Moisture Resistant) Plywood is the go-to choice for interior furniture, partitions, and shelving. Bonded with urea formaldehyde resin, MR plywood offers reliable moisture resistance for indoor applications. It conforms to IS 303 standards and is available in multiple grades, sizes, and thicknesses for residential and commercial projects.',
    features: [
      'Bonded with urea formaldehyde resin for dependable indoor moisture resistance',
      'Conforms to IS 303 — consistent, certified quality sheet after sheet',
      'Accurate, calibrated thickness for clean joinery and finishing',
      'Available in multiple grades and sizes for residential and commercial work',
      'Ready stock for immediate bulk dispatch'
    ],
    specs: [
      ['Type', 'MR (Moisture Resistant) plywood'],
      ['Bonding resin', 'Urea formaldehyde'],
      ['Standard', 'IS 303'],
      ['Sheet size', '8 × 4 ft (standard)'],
      ['Thickness range', '4 mm – 25 mm'],
      ['Best for', 'Interior furniture and dry indoor areas']
    ],
    sizes: ['6 MM', '8 MM', '12 MM', '16 MM', '18 MM'],
    sizesNote: 'Thicknesses from 4 mm to 25 mm available in 8 × 4 ft sheets.',
    standards: ['IS 303'],
    useCases: [
      'Furniture and wardrobes',
      'Bed frames and shelving',
      'Wall partitions',
      'Commercial interiors'
    ]
  },
  {
    slug: 'duroply-bwp-boiling-water-proof-plywood',
    images: ['/images/products/duroply-bwp-boiling-water-proof-plywood.jpg', '/images/products/duroply-bwp-boiling-water-proof-plywood-2.webp'],
    name: 'Duroply - BWP Boiling Water Proof Plywood',
    brand: 'Duroply',
    category: 'plywood',
    subcategory: 'boiling-water-proof',
    tagline:
      'High-grade waterproof plywood for kitchens, bathrooms and anything that gets wet.',
    description:
      'Duroply BWP (Boiling Water Proof) Plywood is designed for areas exposed to constant moisture and water. Manufactured under high pressure with phenol formaldehyde resin, BWP plywood offers excellent water resistance, making it ideal for kitchen cabinets, bathroom vanities, and outdoor furniture. It meets IS 710 standards and comes in multiple thicknesses and sizes to suit diverse project requirements.',
    features: [
      'Phenol formaldehyde resin bonding — withstands prolonged boiling-water exposure',
      'Meets IS 710, the marine-grade plywood standard',
      'High-pressure manufacturing for dense, void-free construction',
      'The right choice wherever water contact is frequent or constant',
      'Multiple thicknesses and sizes, stocked for bulk supply'
    ],
    specs: [
      ['Type', 'BWP (Boiling Water Proof) plywood'],
      ['Bonding resin', 'Phenol formaldehyde'],
      ['Standard', 'IS 710'],
      ['Sheet size', '8 × 4 ft (standard, custom on bulk orders)'],
      ['Thickness range', '4 mm – 25 mm'],
      ['Best for', 'Wet areas — kitchens, bathrooms, exteriors']
    ],
    sizes: ['9 MM', '12 MM', '19 MM'],
    sizesNote: 'Thicknesses from 4 mm to 25 mm available; custom sizes on bulk orders.',
    standards: ['IS 710'],
    useCases: [
      'Kitchen cabinets and sink units',
      'Bathroom vanities',
      'Outdoor and semi-outdoor furniture',
      'Marine-adjacent applications'
    ]
  },
  // ── MDF ───────────────────────────────────────────────────────────────────
  {
    slug: 'action-tesa-interior-grade-mdf',
    images: ['/images/products/action-tesa-interior-grade-mdf.jpg', '/images/products/action-tesa-interior-grade-mdf-2.webp'],
    name: 'Action Tesa - Interior Grade MDF',
    brand: 'Action TESA',
    category: 'mdf',
    subcategory: 'interior-grade',
    tagline:
      'Premium interior MDF — German technology, homogeneous construction, CARB E1 & E2 certified.',
    description:
      'Action Tesa Interior Grade MDF (Medium Density Fibreboard) is engineered for indoor furniture, cabinetry, decorative wall panels, and modular kitchen components. Manufactured with German technology for homogeneous construction without layers, and CARB certified E1 & E2 grade for health-safe interior applications. With a smooth, uniform surface that accepts paint, veneer, and laminate finishes, interior MDF is the preferred choice for precision woodworking. Sourced directly from Action Tesa for guaranteed quality.',
    features: [
      'German-technology manufacturing — homogeneous, layer-free construction',
      'CARB E1 & E2 certified for health-safe interiors',
      'Smooth, uniform surface that takes paint, veneer and laminate beautifully',
      'Precise machining and routing — ideal for CNC and decorative work',
      'Sourced directly from Action Tesa, stocked in all popular thicknesses'
    ],
    specs: [
      ['Type', 'Interior grade MDF'],
      ['Construction', 'Homogeneous, layer-free (German technology)'],
      ['Certification', 'CARB E1 & E2'],
      ['Sheet size', '8 × 4 ft (standard)'],
      ['Thickness range', '1.90 mm – 25 mm'],
      ['Best for', 'Indoor furniture, panels, painted finishes']
    ],
    sizes: ['1.90 MM', '3.30 MM', '5.50 MM', '7.00 MM', '11 MM', '16.50 MM', '25 MM'],
    standards: ['CARB E1', 'CARB E2', 'German technology'],
    useCases: [
      'Furniture and kitchen cabinets',
      'Wardrobes and shelving',
      'Decorative wall panels and display units',
      'CNC-routed and painted components'
    ]
  },
  {
    slug: 'action-tesa-exterior-grade-mdf',
    images: ['/images/products/action-tesa-exterior-grade-mdf.jpg', '/images/products/action-tesa-exterior-grade-mdf-2.jpg'],
    name: 'Action Tesa - Exterior Grade MDF',
    brand: 'Action TESA',
    category: 'mdf',
    subcategory: 'exterior-grade',
    tagline:
      'Rugged, weather-resistant MDF for semi-outdoor and high-humidity applications.',
    description:
      'Action Tesa Exterior Grade MDF is specially engineered with moisture-resistant resins for semi-outdoor and high-humidity applications. Homogeneous, layer-free construction with CARB E2 certification for weather-resistant outdoor use. Ideal for signage, exterior wall cladding, outdoor furniture, and areas prone to dampness — it offers the smooth finish of standard MDF with enhanced durability.',
    features: [
      'Moisture-resistant resin system built for humidity and damp environments',
      'CARB E2 certified, homogeneous layer-free construction',
      'Keeps the smooth MDF surface and workability outdoors',
      'For fully exposed applications, pairs with a protective coating',
      'Stocked in six thicknesses for bulk supply'
    ],
    specs: [
      ['Type', 'Exterior grade MDF'],
      ['Construction', 'Homogeneous, layer-free'],
      ['Certification', 'CARB E2'],
      ['Sheet size', '8 × 4 ft (standard)'],
      ['Thickness range', '3.30 mm – 25 mm'],
      ['Best for', 'Semi-outdoor, signage, humid areas']
    ],
    sizes: ['3.30 MM', '5.50 MM', '7.30 MM', '11 MM', '17 MM', '25 MM'],
    standards: ['CARB E2'],
    useCases: [
      'Signage and display boards',
      'Exterior wall cladding and panelling',
      'Outdoor and balcony furniture',
      'Bathrooms and damp-prone areas'
    ]
  },
  {
    slug: 'action-tesa-hdhmr-board',
    images: ['/images/products/action-tesa-hdhmr-board.jpg'],
    name: 'Action Tesa - HDHMR Board',
    brand: 'Action TESA',
    category: 'mdf',
    subcategory: 'hdhmr',
    tagline:
      "India's premium HDHMR — 850+ kg/m³ density, moisture resistant, 10-year warranty.",
    description:
      "Action Tesa HDHMR (High Density High Moisture Resistant) Board combines the strength of high-density fibreboard with exceptional moisture resistance. Engineered with German technology for superior density (850+ kg/m³), moisture resistance, and a ready-to-use smooth surface with 10-year warranty protection. HDHMR boards are the preferred material for modular kitchens, bathroom vanities, and commercial interiors where both durability and water resistance are critical — they hold screws firmly, resist termites, and offer a smooth surface for laminate and veneer finishes.",
    features: [
      'Superior 850+ kg/m³ density — outstanding screw-holding and structural rigidity',
      'High moisture resistance for kitchens, vanities and commercial interiors',
      'German-technology manufacturing with a ready-to-use smooth surface',
      '10-year warranty protection',
      'Termite-resistant; takes laminate and veneer finishes cleanly'
    ],
    specs: [
      ['Type', 'HDHMR (High Density High Moisture Resistant) board'],
      ['Density', '850+ kg/m³'],
      ['Warranty', '10 years'],
      ['Sheet size', '8 × 4 ft (standard)'],
      ['Thickness range', '3 mm – 25 mm'],
      ['Best for', 'Modular kitchens, heavy-duty furniture']
    ],
    sizes: ['3 MM', '5.50 MM', '7.50 MM', '11 MM', '16.75 MM', '18 MM', '25 MM'],
    standards: ['German technology', '10-year warranty'],
    useCases: [
      'Modular kitchen carcasses and shutters',
      'Bathroom vanities',
      'Commercial interiors',
      'Heavy-duty furniture needing strong screw-holding'
    ]
  },
  // ── MOIST MASTER HMR ──────────────────────────────────────────────────────
  {
    slug: 'action-tesa-moist-master-hmr-board',
    images: ['/images/products/action-tesa-moist-master-hmr-board.jpg', '/images/products/action-tesa-moist-master-hmr-board-2.webp'],
    name: 'Action Tesa - Moist Master HMR Board',
    brand: 'Action TESA',
    category: 'high-moisture-resistant-board-moist-master',
    subcategory: 'moist-master',
    tagline:
      'Melamine-fortified HMR board for modular kitchens and humid environments.',
    description:
      'Action Tesa Moist Master HMR (High Moisture Resistant) Board is engineered with melamine-fortified resin, giving it excellent resistance to moisture and humidity. HMR boards are widely used in modular kitchens, bathroom furniture, commercial interiors, and any application where humidity levels are above normal. Available in various thicknesses with a smooth surface ready for laminate application, and treated for resistance against termites and borers.',
    features: [
      'Melamine-fortified resin for excellent moisture and humidity resistance',
      'Treated against termites and borers for long furniture life',
      'Smooth surface ready for direct laminate application',
      'The cost-effective choice for kitchen carcasses and wardrobe interiors',
      'Stocked in 9 / 12 / 18 mm for immediate supply'
    ],
    specs: [
      ['Type', 'HMR (High Moisture Resistant) particle board'],
      ['Resin', 'Melamine-fortified'],
      ['Protection', 'Termite & borer treated'],
      ['Sheet size', '8 × 4 ft (standard)'],
      ['Thicknesses', '9 / 12 / 18 mm'],
      ['Best for', 'Kitchens, bathroom furniture, humid interiors']
    ],
    sizes: ['9 MM', '12 MM', '18 MM'],
    standards: ['Termite & borer treated'],
    useCases: [
      'Modular kitchen carcasses',
      'Bathroom furniture',
      'Wardrobe interiors',
      'Commercial interiors with above-normal humidity'
    ]
  },
  // ── PRE-LAMINATED PARTICLE BOARD (5 SKUs) ─────────────────────────────────
  {
    slug: 'action-tesa-prelam-particle-board-1103-frosty-white',
    images: ['/images/products/action-tesa-prelam-particle-board-1103-frosty-white.jpg'],
    name: 'Action Tesa - Prelam Particle Board 1103 – Frosty White',
    brand: 'Action TESA',
    category: 'pre-laminated-particle-board',
    subcategory: 'boards',
    tagline:
      'Clean, modern Frosty White — the workhorse finish for wardrobes and office furniture.',
    description:
      'Action Tesa Pre-Laminated Particle Board in Frosty White (Code 1103) offers a clean, modern aesthetic for furniture and interior projects. The pre-applied melamine laminate eliminates the need for separate lamination, reducing production time and cost. Ideal for wardrobes, office furniture, modular kitchens, and commercial interiors.',
    features: [
      'Factory-applied melamine laminate on both sides — no separate lamination step',
      'Consistent, scratch-resistant, easy-clean surface',
      'Cuts production time and cost on volume furniture work',
      'Part of a 150+ design catalog of solids, woodgrains and textures'
    ],
    specs: [
      ['Type', 'Pre-laminated particle board'],
      ['Design', '1103 – Frosty White (solid)'],
      ['Surface', 'Melamine laminate, both sides'],
      ['Sheet size', '8 × 4 ft (standard)'],
      ['Thicknesses', '9 / 11 / 17 / 25 mm']
    ],
    sizes: ['9 MM', '11 MM', '17 MM', '25 MM'],
    standards: [],
    useCases: ['Wardrobes', 'Office furniture', 'Modular kitchens', 'Commercial interiors'],
    decorImage: '/images/decor/1103-frosty-white.avif'
  },
  {
    slug: 'action-tesa-prelam-particle-board-1104-silver-grey',
    images: ['/images/products/action-tesa-prelam-particle-board-1104-silver-grey.jpg'],
    name: 'Action Tesa - Prelam Particle Board 1104 – Silver Grey',
    brand: 'Action TESA',
    category: 'pre-laminated-particle-board',
    subcategory: 'boards',
    tagline: 'Sleek Silver Grey — a contemporary staple for office interiors.',
    description:
      'Action Tesa Pre-Laminated Particle Board in Silver Grey (Code 1104) is a popular choice for modern office interiors, wardrobes, and commercial furniture. The sleek grey finish delivers a contemporary look without additional lamination costs.',
    features: [
      'Factory-applied melamine laminate on both sides',
      'Contemporary grey that pairs cleanly with whites and woodgrains',
      'Scratch-resistant, easy-clean working surface',
      'Ready to cut, edge-band and assemble'
    ],
    specs: [
      ['Type', 'Pre-laminated particle board'],
      ['Design', '1104 – Silver Grey (solid)'],
      ['Surface', 'Melamine laminate, both sides'],
      ['Sheet size', '8 × 4 ft (standard)'],
      ['Thicknesses', '9 / 11 / 17 / 25 mm']
    ],
    sizes: ['9 MM', '11 MM', '17 MM', '25 MM'],
    standards: [],
    useCases: ['Office furniture and workstations', 'Wardrobes', 'Commercial furniture'],
    decorImage: '/images/decor/1104-silver-grey.avif'
  },
  {
    slug: 'action-tesa-prelam-particle-board-1142-pebble-beach',
    images: ['/images/products/action-tesa-prelam-particle-board-1142-pebble-beach.jpg'],
    name: 'Action Tesa - Prelam Particle Board 1142 - Pebble Beach',
    brand: 'Action TESA',
    category: 'pre-laminated-particle-board',
    subcategory: 'boards',
    tagline: 'Stone-inspired Pebble Beach texture for premium, designer interiors.',
    description:
      'Action Tesa Pre-Laminated Particle Board in Pebble Beach (Code 1142) features a sophisticated stone-inspired texture ideal for premium furniture, reception desks, and designer interiors.',
    features: [
      'Sophisticated stone-inspired texture',
      'Factory melamine laminate on both sides',
      'Premium look without premium lamination cost',
      'Pairs well with solid colours for two-tone designs'
    ],
    specs: [
      ['Type', 'Pre-laminated particle board'],
      ['Design', '1142 – Pebble Beach (textured)'],
      ['Surface', 'Melamine laminate, both sides'],
      ['Sheet size', '8 × 4 ft (standard)'],
      ['Thicknesses', '9 / 11 / 17 / 25 mm']
    ],
    sizes: ['9 MM', '11 MM', '17 MM', '25 MM'],
    standards: [],
    useCases: ['Reception desks', 'Premium furniture', 'Designer interiors'],
    decorImage: '/images/decor/1142-pebble-beach.avif'
  },
  {
    slug: 'action-tesa-prelam-particle-board-3009-classic-planked-walnut',
    images: ['/images/products/action-tesa-prelam-particle-board-3009-classic-planked-walnut.jpg'],
    name: 'Action Tesa - Prelam Particle Board 3009 – Classic Planked Walnut',
    brand: 'Action TESA',
    category: 'pre-laminated-particle-board',
    subcategory: 'boards',
    tagline: 'Rich planked-walnut grain — natural wood character at board prices.',
    description:
      'Action Tesa Pre-Laminated Particle Board in Classic Planked Walnut (Code 3009) delivers a rich wood-grain finish that replicates natural walnut using advanced printing technology — realistic grain patterns and texture at a fraction of the cost of solid wood. Perfect for wardrobes, TV units, and executive office furniture.',
    features: [
      'Advanced grain printing replicates natural walnut convincingly',
      'Factory melamine laminate on both sides',
      'Warm, executive look for feature furniture',
      'Consistent pattern across sheets for large runs'
    ],
    specs: [
      ['Type', 'Pre-laminated particle board'],
      ['Design', '3009 – Classic Planked Walnut (woodgrain)'],
      ['Surface', 'Melamine laminate, both sides'],
      ['Sheet size', '8 × 4 ft (standard)'],
      ['Thicknesses', '9 / 11 / 17 / 25 mm']
    ],
    sizes: ['9 MM', '11 MM', '17 MM', '25 MM'],
    standards: [],
    useCases: ['Wardrobes', 'TV units', 'Executive office furniture'],
    decorImage: '/images/decor/3009-classic-planked-walnut.avif'
  },
  {
    slug: 'action-tesa-prelam-particle-board-3018-mangfall-beech',
    images: ['/images/products/action-tesa-prelam-particle-board-3018-mangfall-beech.jpg'],
    name: 'Action Tesa - Prelam Particle Board 3018 – Mangfall Beech',
    brand: 'Action TESA',
    category: 'pre-laminated-particle-board',
    subcategory: 'boards',
    tagline: 'Light, warm Mangfall Beech — made for bright, Scandinavian-style spaces.',
    description:
      "Action Tesa Pre-Laminated Particle Board in Mangfall Beech (Code 3018) offers a light, warm wood-grain finish ideal for Scandinavian-style interiors, children's furniture, and modern workstations.",
    features: [
      'Light, warm beech grain that brightens compact rooms',
      'Factory melamine laminate on both sides',
      "A natural fit for children's rooms, studies and workstations",
      'Part of the 150+ design Action Tesa décor catalog'
    ],
    specs: [
      ['Type', 'Pre-laminated particle board'],
      ['Design', '3018 – Mangfall Beech (woodgrain)'],
      ['Surface', 'Melamine laminate, both sides'],
      ['Sheet size', '8 × 4 ft (standard)'],
      ['Thicknesses', '9 / 11 / 17 / 25 mm']
    ],
    sizes: ['9 MM', '11 MM', '17 MM', '25 MM'],
    standards: [],
    useCases: ["Children's furniture", 'Study tables and workstations', 'Modern interiors'],
    decorImage: '/images/decor/3018-mangfall-beech.avif'
  },
  // ── FLUSH DOOR ────────────────────────────────────────────────────────────
  {
    slug: 'duro-flush-door',
    images: ['/images/products/duro-flush-door.jpg', '/images/products/duro-flush-door-2.webp'],
    name: 'Duro - Flush Door',
    brand: 'Duroply',
    category: 'flush-door',
    subcategory: 'door',
    tagline:
      '100% boiling water proof flush doors with a solid block-board core — built for decades of use.',
    description:
      'DURODOOR Flush Doors feature a solid block-board core, seasoned hardwood battens, and high-pressure bonded veneers. 100% boiling water proof and termite-resistant — ideal for bedrooms, bathrooms, and main doors. Manufactured with robust frame construction and calibrated timber for excellent dimensional stability and a smooth surface for painting or veneer application. Meets IS 2202 standards; available in standard and custom sizes.',
    features: [
      'Solid block-board core with seasoned hardwood battens',
      'High-pressure bonded veneers — smooth surface for paint or veneer',
      '100% boiling water proof; fit for bathrooms and main doors',
      'Anti-termite treated during manufacturing',
      'Meets IS 2202; standard and custom sizes on bulk orders'
    ],
    specs: [
      ['Type', 'Flush door, solid block-board core'],
      ['Core', 'Block board with seasoned hardwood battens'],
      ['Face', 'High-pressure bonded veneers'],
      ['Water resistance', '100% boiling water proof'],
      ['Standard', 'IS 2202'],
      ['Thickness options', '30 mm / 35 mm'],
      ['Standard sizes', '7 × 3 ft and 8 × 4 ft; custom on bulk orders']
    ],
    sizes: ['Custom', '48×96', '36×93', '33×93', '33×90', '33×80', '30×80'],
    sizesNote: 'Sizes in inches (width × height). Custom sizes available on bulk orders.',
    standards: ['IS 2202'],
    useCases: ['Bedroom doors', 'Bathroom doors', 'Main doors', 'Commercial buildings']
  },
  // ── SMART LOCKS (8 SKUs — honest, type-based copy; no fabricated specs) ───
  {
    slug: 'automatic-sliding-smart-lock',
    images: ['/images/products/automatic-sliding-smart-lock.jpg', '/images/products/automatic-sliding-smart-lock-2.jpg'],
    name: 'Automatic Sliding Smart Lock',
    brand: 'Tenon Smart Lock',
    category: 'smart-locks',
    subcategory: 'locks',
    tagline: 'Motorised smart locking for sliding doors — closes and secures automatically.',
    description:
      'A Tenon smart lock purpose-built for sliding doors: it locks automatically as the door closes, replacing latches and aftermarket bolts with keyless, motorised security. Suited to residential sliding doors and commercial partitions where a clean, automatic locking action is wanted.',
    features: [
      'Designed specifically for sliding doors',
      'Automatic locking on close — no manual latching',
      'Keyless entry replaces loose keys for shared spaces',
      'Clean, minimal hardware that suits modern interiors'
    ],
    specs: [
      ['Type', 'Automatic smart lock for sliding doors'],
      ['Brand', 'Tenon Smart Lock'],
      ['Application', 'Sliding doors — residential & commercial']
    ],
    sizes: [],
    standards: [],
    useCases: ['Sliding doors', 'Wardrobe and partition doors', 'Offices'],
    specsOnRequest: true
  },
  {
    slug: 'fingerprint-smart-door-lock-with-app',
    images: ['/images/products/fingerprint-smart-door-lock-with-app.jpg', '/images/products/fingerprint-smart-door-lock-with-app-2.jpg'],
    name: 'Fingerprint Smart Door Lock with App',
    brand: 'Tenon Smart Lock',
    category: 'smart-locks',
    subcategory: 'locks',
    tagline: 'Fingerprint access plus full app control — manage entry from your phone.',
    description:
      'A Tenon fingerprint smart lock paired with a companion app: unlock with a fingerprint at the door, and manage access, users and entry records from your phone. A practical fit for homes and rental properties where access needs to be granted and revoked easily.',
    features: [
      'Fingerprint unlock at the door',
      'Companion app for managing users and access',
      'Keyless convenience for families and rentals',
      'Suits residential main doors and interior doors'
    ],
    specs: [
      ['Type', 'Fingerprint smart lock with app control'],
      ['Brand', 'Tenon Smart Lock'],
      ['Application', 'Homes, rentals, offices']
    ],
    sizes: [],
    standards: [],
    useCases: ['Main doors', 'Rental properties', 'Home offices'],
    specsOnRequest: true
  },
  {
    slug: 'high-end-smart-main-door-lock',
    images: ['/images/products/high-end-smart-main-door-lock.jpg', '/images/products/high-end-smart-main-door-lock-2.jpg'],
    name: 'High-End Smart Main Door Lock',
    brand: 'Tenon Smart Lock',
    category: 'smart-locks',
    subcategory: 'locks',
    tagline: "Tenon's flagship main-door lock — premium build for the front of the house.",
    description:
      "Tenon's premium main-door smart lock: a substantial, full-featured unit built for the most important door in the home. Multiple keyless entry options in a flagship-grade body designed for villa and apartment main doors.",
    features: [
      'Flagship-grade build quality for main doors',
      'Multiple keyless entry options',
      'Substantial hardware with a premium feel',
      'Designed for villas and apartment entrances'
    ],
    specs: [
      ['Type', 'Premium smart main-door lock'],
      ['Brand', 'Tenon Smart Lock'],
      ['Application', 'Villa & apartment main doors']
    ],
    sizes: [],
    standards: [],
    useCases: ['Villa main doors', 'Apartment entrances', 'Premium residences'],
    specsOnRequest: true
  },
  {
    slug: 'mini-smart-lever-lock-for-interior-doors',
    images: ['/images/products/mini-smart-lever-lock-for-interior-doors.webp', '/images/products/mini-smart-lever-lock-for-interior-doors-2.webp'],
    name: 'Mini Smart Lever Lock for Interior Doors',
    brand: 'Tenon Smart Lock',
    category: 'smart-locks',
    subcategory: 'locks',
    tagline: 'Compact smart lever for bedrooms, studies and interior doors.',
    description:
      'A compact Tenon smart lever lock sized for interior doors — bedrooms, studies and home offices. Brings keyless convenience to rooms inside the home without the bulk of a main-door unit.',
    features: [
      'Compact lever format sized for interior doors',
      'Keyless entry for bedrooms and studies',
      'Neat, unobtrusive hardware',
      'Easy retrofit to standard interior doors'
    ],
    specs: [
      ['Type', 'Compact smart lever lock'],
      ['Brand', 'Tenon Smart Lock'],
      ['Application', 'Interior doors']
    ],
    sizes: [],
    standards: [],
    useCases: ['Bedrooms', 'Studies and home offices', 'Interior doors'],
    specsOnRequest: true
  },
  {
    slug: 'palm-vein-face-recognition-smart-lock',
    images: ['/images/products/palm-vein-face-recognition-smart-lock.jpg', '/images/products/palm-vein-face-recognition-smart-lock-2.jpg'],
    name: 'Palm Vein & Face Recognition Smart Lock',
    brand: 'Tenon Smart Lock',
    category: 'smart-locks',
    subcategory: 'locks',
    tagline: 'Hands-free biometrics — palm-vein and face recognition at the door.',
    description:
      'A Tenon biometric smart lock using palm-vein and face recognition — two of the most secure, hands-free biometric methods available. The door recognises you and unlocks without touching a keypad, suited to premium homes that want top-tier keyless security.',
    features: [
      'Palm-vein recognition — biometrics that are extremely hard to spoof',
      'Face recognition for hands-free unlocking',
      'No keys, cards or codes needed day to day',
      'Premium choice for security-conscious homes'
    ],
    specs: [
      ['Type', 'Biometric smart lock (palm vein + face recognition)'],
      ['Brand', 'Tenon Smart Lock'],
      ['Application', 'Premium residential main doors']
    ],
    sizes: [],
    standards: [],
    useCases: ['Premium main doors', 'Security-conscious homes', 'Elderly-friendly hands-free entry'],
    specsOnRequest: true
  },
  {
    slug: 'sliding-fingerprint-door-lock',
    name: 'Sliding Fingerprint Door Lock',
    brand: 'Tenon Smart Lock',
    category: 'smart-locks',
    subcategory: 'locks',
    tagline: 'Touch-activated sliding lock with OLED screen and automatic closing.',
    description:
      'A touch-activated sliding smart lock with OLED screen and automatic closing. Ideal for bedroom and interior sliding doors with keyless access.',
    features: [
      'Touch-activated fingerprint unlocking',
      'OLED screen for status and interaction',
      'Automatic closing action',
      'Built for bedroom and interior sliding doors'
    ],
    specs: [
      ['Type', 'Fingerprint smart lock for sliding doors'],
      ['Display', 'OLED screen'],
      ['Closing', 'Automatic'],
      ['Brand', 'Tenon Smart Lock'],
      ['Application', 'Bedroom & interior sliding doors']
    ],
    sizes: [],
    standards: [],
    useCases: ['Bedroom sliding doors', 'Interior sliding doors'],
    specsOnRequest: true
  },
  {
    slug: 'smart-lever-handle-lock',
    images: ['/images/products/smart-lever-handle-lock.jpg', '/images/products/smart-lever-handle-lock-2.jpg'],
    name: 'Smart Lever Handle Lock',
    brand: 'Tenon Smart Lock',
    category: 'smart-locks',
    subcategory: 'locks',
    tagline: 'A familiar lever handle, upgraded with keyless smart entry.',
    description:
      'A Tenon smart lock in the classic lever-handle format — the familiar action of a lever handle with keyless smart entry built in. An easy upgrade path from conventional mortise handles on residential and office doors.',
    features: [
      'Classic lever-handle format — familiar to every user',
      'Keyless smart entry built into the handle',
      'Straightforward upgrade from conventional handles',
      'Suits homes and offices alike'
    ],
    specs: [
      ['Type', 'Smart lever-handle lock'],
      ['Brand', 'Tenon Smart Lock'],
      ['Application', 'Residential & office doors']
    ],
    sizes: [],
    standards: [],
    useCases: ['Home doors', 'Office doors', 'Upgrades from conventional handles'],
    specsOnRequest: true
  },
  {
    slug: 'wifi-smart-door-lock',
    images: ['/images/products/wifi-smart-door-lock.jpg', '/images/products/wifi-smart-door-lock-2.jpg'],
    name: 'WiFi Smart Door Lock',
    brand: 'Tenon Smart Lock',
    category: 'smart-locks',
    subcategory: 'locks',
    tagline: 'Connected over WiFi — control and monitor your door from anywhere.',
    description:
      'A Tenon smart lock with built-in WiFi connectivity: monitor the door, manage access and unlock remotely from anywhere. The right pick for connected homes and hosts who manage access for guests or staff.',
    features: [
      'Built-in WiFi — no separate hub required',
      'Remote unlocking and access management',
      'Entry visibility wherever you are',
      'Great for hosts, rentals and connected homes'
    ],
    specs: [
      ['Type', 'WiFi-connected smart lock'],
      ['Brand', 'Tenon Smart Lock'],
      ['Application', 'Connected homes, rentals']
    ],
    sizes: [],
    standards: [],
    useCases: ['Connected homes', 'Guest and rental access', 'Remote monitoring'],
    specsOnRequest: true
  }
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
  return PRODUCTS.find(
    (p) => p.category === category && p.subcategory === sub && p.slug === slug
  );
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

/** Related products: same category first, then same brand, excluding self. */
export function relatedProducts(p: Product, count = 4): Product[] {
  const same = PRODUCTS.filter((x) => x.slug !== p.slug && x.category === p.category);
  const brand = PRODUCTS.filter(
    (x) => x.slug !== p.slug && x.category !== p.category && x.brand === p.brand
  );
  const rest = PRODUCTS.filter(
    (x) => x.slug !== p.slug && x.category !== p.category && x.brand !== p.brand
  );
  return [...same, ...brand, ...rest].slice(0, count);
}
