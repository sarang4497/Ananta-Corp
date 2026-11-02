import type {Brand, CategorySlug} from '@/data/products';

/**
 * Category copy. WHAT IT IS / BEST USE / KEY DIFFERENTIATOR / BRAND — every
 * line from A1 product copy or a verified manufacturer statement
 * (research/ANANTA_CONTENT_TRUTH.md). Original A1 page titles kept for SEO.
 */
export const CATEGORY_COPY: Record<
  CategorySlug,
  {
    name: string;
    short: string;
    what: string;
    bestFor: string;
    key: string;
    brands: Brand[];
    seoTitle: string;
    seoDescription: string;
  }
> = {
  plywood: {
    name: 'Plywood',
    short: 'Plywood',
    what: 'Duroply plywood in MR grade for dry interiors and BWP grade for kitchens and wet zones.',
    bestFor: 'Furniture, wardrobes, partitions, kitchen and bathroom cabinetry',
    key: 'MR to IS 303 · BWP to IS 710 (Duroply)',
    brands: ['Duroply'],
    seoTitle: 'Plywood Supplier in Ahmedabad, Gujarat — Duroply MR & BWP',
    seoDescription:
      'Duroply MR and BWP plywood from Ananta Corporation, Ahmedabad. Thickness options, grades and applications for furniture, kitchens and interior projects.'
  },
  mdf: {
    name: 'MDF & HDHMR',
    short: 'MDF',
    what: 'Action TESA interior and exterior grade MDF, plus high-density HDHMR board.',
    bestFor: 'Painted and laminated furniture, cabinetry, wall panels, modular kitchens',
    key: 'Homogeneous, layer-free board · HDHMR over 850 kg/m³ (Action TESA)',
    brands: ['Action TESA'],
    seoTitle: 'MDF Board Supplier in Ahmedabad, Gujarat — Action TESA MDF & HDHMR',
    seoDescription:
      'Action TESA interior grade MDF, exterior grade MDF and HDHMR boards from Ananta Corporation, Ahmedabad — thicknesses, applications and pricing on WhatsApp.'
  },
  'high-moisture-resistant-board-moist-master': {
    name: 'Moist Master HMR Board',
    short: 'HMR Board',
    what: 'Action TESA Moist Master — a high moisture resistant particle board.',
    bestFor: 'Modular kitchen carcasses, wardrobe interiors, bathroom and commercial furniture',
    key: 'Termite & borer resistant · density above 750 kg/m³ (Action TESA)',
    brands: ['Action TESA'],
    seoTitle: 'HMR Board Supplier in Ahmedabad, Gujarat — Action TESA Moist Master',
    seoDescription:
      'Action TESA Moist Master high moisture resistant (HMR) board from Ananta Corporation, Ahmedabad, for kitchens, wardrobes and humid interiors.'
  },
  'pre-laminated-particle-board': {
    name: 'Pre-Laminated Particle Board',
    short: 'Prelam Boards',
    what: 'Action TESA particle board with a factory melamine laminate on both faces.',
    bestFor: 'Wardrobes, office furniture, modular kitchens, commercial interiors',
    key: 'No separate lamination step · solid, wood, fabric, stone & texture décors',
    brands: ['Action TESA'],
    seoTitle: 'Pre-Laminated Board Supplier in Ahmedabad — Action TESA Prelam',
    seoDescription:
      'Action TESA pre-laminated particle boards and the full décor library at Ananta Corporation, Ahmedabad — browse finishes by code and colour family.'
  },
  'flush-door': {
    name: 'Flush Doors',
    short: 'Flush Doors',
    what: 'Duro Door flush doors in standard and custom sizes.',
    bestFor: 'Bedroom, bathroom and main doors in residential and commercial interiors',
    key: 'BWP grade to IS 2202 · termite treated (Duroply)',
    brands: ['Duroply'],
    seoTitle: 'Flush Door Supplier in Ahmedabad, Gujarat — Duro Door',
    seoDescription:
      'Duro Door flush doors from Ananta Corporation, Ahmedabad — standard and custom sizes, 30 mm and 35 mm, for homes, offices and projects.'
  },
  'smart-locks': {
    name: 'Smart Locks',
    short: 'Smart Locks',
    what: 'Tenon smart locks for main doors, interior doors and sliding doors.',
    bestFor: 'Main doors, bedrooms and interior doors, sliding doors',
    key: 'Fingerprint, app, WiFi, palm-vein & face recognition models',
    brands: ['Tenon Smart Lock'],
    seoTitle: 'Smart Locks Supplier in Ahmedabad — Tenon Smart Lock',
    seoDescription:
      'Tenon smart locks at Ananta Corporation, Ahmedabad — fingerprint, WiFi, app-controlled and sliding-door models. Specifications and pricing on request.'
  }
};

/** Subcategory display names (A1 wording). */
export const SUB_NAMES: Record<string, string> = {
  'moisture-resistant': 'Moisture Resistant (MR)',
  'boiling-water-proof': 'Boiling Water Proof (BWP)',
  'interior-grade': 'Interior Grade',
  'exterior-grade': 'Exterior Grade',
  hdhmr: 'HDHMR',
  'moist-master': 'Moist Master',
  boards: 'Boards',
  door: 'Doors',
  locks: 'Locks'
};
