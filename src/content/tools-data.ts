/**
 * Data + pure logic behind the interactive tools. Everything here is DERIVED
 * from src/data/products.ts (applications, exposure, specs, sizes) and
 * src/content/site.ts — no new facts, prices, stock or delivery promises.
 */
import {CATEGORIES, PRODUCTS, type Application, type CategorySlug, type Href, type Product} from '@/data/products';
import {CATEGORY_COPY} from '@/content/categories';
import {EXPOSURE_LABEL} from '@/content/site';
import {COMPARABLE, compare} from '@/data/stats';
import type {ToolSlug} from '@/content/tools';

// ── Shared links ─────────────────────────────────────────────────────────────

/** /tools/compare with the pair in the URL (?a=&b=). Product cards may link with only `a`. */
export function compareHref(a?: string, b?: string): Href {
  const query: Record<string, string> = {};
  if (a) query.a = a;
  if (b) query.b = b;
  return {pathname: '/tools/[tool]', params: {tool: 'compare'}, query} as Href;
}

export const bySlug = (slug: string): Product | undefined => PRODUCTS.find((p) => p.slug === slug);

// ── Material selector ────────────────────────────────────────────────────────

/** Short, data-derived reason chips for a recommended product. */
export function pickFacts(p: Product): string[] {
  const out: string[] = [];
  if (p.exposure) out.push(EXPOSURE_LABEL[p.exposure]);
  out.push(...p.uses.slice(0, 2));
  return out;
}

/** First comparable pair among the picks (compare() must yield ≥4 shared rows). */
export function comparablePair(slugs: string[]): [string, string] | null {
  const ok = slugs.filter((s) => COMPARABLE.some((c) => c.slug === s));
  for (let i = 0; i < ok.length; i++)
    for (let j = i + 1; j < ok.length; j++) {
      const a = bySlug(ok[i])!;
      const b = bySlug(ok[j])!;
      if (compare(a, b)) return [a.slug, b.slug];
    }
  return null;
}

// ── Board comparison ─────────────────────────────────────────────────────────

export const COMPARE_DEFAULT: [string, string] = ['duroply-mr-moisture-resistant-plywood', 'duroply-bwp-boiling-water-proof-plywood'];

/**
 * Resolve the pair to show from (possibly invalid) URL values. Unknown or
 * non-comparable slugs fall back to the defaults; a lone `a` gets the first
 * partner that compare() accepts.
 */
export function resolvePair(a?: string | null, b?: string | null): [string, string] {
  const valid = (s?: string | null) => !!s && COMPARABLE.some((p) => p.slug === s);
  const A = valid(a) ? a! : COMPARE_DEFAULT[0];
  if (valid(b) && b !== A) return [A, b!];
  const pa = bySlug(A)!;
  const pref = [COMPARE_DEFAULT[1], COMPARE_DEFAULT[0], ...COMPARABLE.map((p) => p.slug)];
  const partner = pref.find((s) => s !== A && compare(pa, bySlug(s)!)) ?? pref.find((s) => s !== A)!;
  return [A, partner];
}

// ── Requirement builder ──────────────────────────────────────────────────────

export type ProjectKey = 'furniture' | 'kitchen' | 'wardrobe' | 'office' | 'partitions' | 'doors' | 'bulk';
export type Unit = 'sheets' | 'doors' | 'pieces';
export const UNITS: Unit[] = ['sheets', 'doors', 'pieces'];

/**
 * Project → product applications (the `applications` field in products.ts).
 * A category is offered for a project when at least one of its products lists
 * one of these applications. "Bulk boards" = every category sold in mm
 * thicknesses (plywood, MDF/HDHMR, HMR, prelam), derived from `sizes`.
 */
export const PROJECTS: {key: ProjectKey; label: string; hint: string; applications: Application[] | 'boards'; unit: Unit}[] = [
  {key: 'furniture', label: 'Furniture', hint: 'Loose and built-in furniture', applications: ['furniture'], unit: 'sheets'},
  {key: 'kitchen', label: 'Kitchen', hint: 'Carcasses, shutters, sink units', applications: ['kitchens'], unit: 'sheets'},
  {key: 'wardrobe', label: 'Wardrobe', hint: 'Carcasses, interiors, shutters', applications: ['wardrobes'], unit: 'sheets'},
  {key: 'office', label: 'Office', hint: 'Workstations, storage, reception', applications: ['commercial'], unit: 'sheets'},
  {key: 'partitions', label: 'Partitions', hint: 'Wall panels and partitions', applications: ['panelling'], unit: 'sheets'},
  {key: 'doors', label: 'Doors', hint: 'Flush doors and smart locks', applications: ['doors'], unit: 'doors'},
  {key: 'bulk', label: 'Bulk boards', hint: 'Sheet material in quantity', applications: 'boards', unit: 'sheets'}
];

const isBoard = (p: Product) => p.sizes.some((s) => /MM$/.test(s));

export function productsForProject(key: ProjectKey, category?: CategorySlug): Product[] {
  const proj = PROJECTS.find((p) => p.key === key)!;
  return PRODUCTS.filter(
    (p) =>
      (!category || p.category === category) &&
      (proj.applications === 'boards' ? isBoard(p) : p.applications.some((a) => (proj.applications as Application[]).includes(a)))
  );
}

/** Categories (in catalogue order) that map to a project. */
export function categoriesForProject(key: ProjectKey): CategorySlug[] {
  const set = new Set(productsForProject(key).map((p) => p.category));
  return CATEGORIES.map((c) => c.slug).filter((s) => set.has(s));
}

export const categoryName = (slug: CategorySlug) => CATEGORY_COPY[slug].name;

/** Default unit for a set of categories: doors for flush doors, pieces for locks, else sheets. */
export function unitFor(categories: CategorySlug[], fallback: Unit): Unit {
  if (categories.length && categories.every((c) => c === 'flush-door')) return 'doors';
  if (categories.length && categories.every((c) => c === 'smart-locks')) return 'pieces';
  if (categories.some((c) => c !== 'flush-door' && c !== 'smart-locks')) return 'sheets';
  return fallback;
}

// ── Sheet quantity helper ────────────────────────────────────────────────────

/** The one verified sheet size (products.ts "Sheet size" rows). */
export const SHEET = {label: '8 × 4 ft', lengthFt: 8, widthFt: 4, areaSqFt: 32} as const;

/** Products whose spec lists the verified 8 × 4 ft sheet size. */
export const SHEET_PRODUCTS: Product[] = PRODUCTS.filter((p) =>
  p.specs.some(([k, v]) => k === 'Sheet size' && v === SHEET.label)
);

export type LengthUnit = 'ft' | 'in' | 'mm' | 'cm' | 'm';
export type AreaUnit = 'sqft' | 'sqm';

const TO_FT: Record<LengthUnit, number> = {ft: 1, in: 1 / 12, mm: 1 / 304.8, cm: 1 / 30.48, m: 1 / 0.3048};
const SQM_TO_SQFT = 1 / (0.3048 * 0.3048);

export function toFeet(value: number, unit: LengthUnit): number {
  return value * TO_FT[unit];
}

export function toSqFt(value: number, unit: AreaUnit): number {
  return unit === 'sqm' ? value * SQM_TO_SQFT : value;
}

export const sqFtToSqM = (v: number) => v / SQM_TO_SQFT;

export type Piece = {length: number; width: number; qty: number};

const pos = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);

/** Total area (sq ft) of a list of rectangular pieces; invalid rows count as 0. */
export function piecesAreaSqFt(pieces: Piece[], unit: LengthUnit): number {
  return pieces.reduce((sum, p) => sum + toFeet(pos(p.length), unit) * toFeet(pos(p.width), unit) * Math.floor(pos(p.qty)), 0);
}

/**
 * Approximate sheet count: ceil(area × (1 + wastage%) / 32 sq ft).
 * Area-based only — not a cutting plan.
 */
export function sheetsNeeded(areaSqFt: number, wastagePct: number): number {
  const a = pos(areaSqFt);
  if (!a) return 0;
  const w = Number.isFinite(wastagePct) && wastagePct > 0 ? wastagePct : 0;
  const raw = (a * (1 + w / 100)) / SHEET.areaSqFt;
  // Guard against floating-point noise (e.g. 31.999999 or 32.0000001).
  return Math.ceil(Math.round(raw * 1e6) / 1e6);
}

/** Round for display (max 2 decimals, trailing zeros dropped). */
export const fmt = (n: number, d = 2) => String(Math.round(n * 10 ** d) / 10 ** d);

// ── Tool pages: explanation, FAQ, related ────────────────────────────────────

export type ToolPage = {
  eyebrow: string;
  title: string;
  lead: string;
  steps: {title: string; body: string}[];
  faqs: {q: string; a: string}[];
  related: ToolSlug[];
  /** Prefill for the floating dock's WhatsApp button on this page. */
  wa: string;
};

const sheetNames = SHEET_PRODUCTS.map((p) => p.short).join(', ');

export const TOOL_PAGES: Record<ToolSlug, ToolPage> = {
  'material-selector': {
    eyebrow: 'Tool 01 · Material selector',
    title: 'Which board for which job?',
    lead: 'Pick the application and the exact zone. The selector shows the matching boards from the Ananta catalogue and why.',
    steps: [
      {title: 'Application', body: 'Kitchen, wardrobe, bathroom, office or doors.'},
      {title: 'Zone & exposure', body: 'Where the material sits, and how much moisture it sees there.'},
      {title: 'Matching products', body: 'Existing catalogue products, with the reason, a comparison and a price request.'}
    ],
    faqs: [
      {
        q: 'Where do the recommendations come from?',
        a: 'Each answer is a fixed mapping written from Ananta’s own product guidance. Every recommendation is a product in the current catalogue, shown with its listed exposure and uses.'
      },
      {
        q: 'Can pre-laminated board go near the kitchen sink?',
        a: 'Pre-laminated particle board is listed for dry interiors, not high-moisture zones. For carcasses in humid areas the catalogue points to HDHMR or HMR board, and for areas directly exposed to water, to BWP plywood.'
      },
      {
        q: 'Is this a price quote?',
        a: 'No. The selector suggests materials. Price and availability are confirmed by the Ananta team on WhatsApp or by written enquiry.'
      }
    ],
    related: ['compare', 'requirement-builder', 'sheet-calculator'],
    wa: "Hello! I'm choosing a board for my project. Please help me select and share price and availability."
  },
  compare: {
    eyebrow: 'Tool 02 · Board comparison',
    title: 'Two boards, side by side.',
    lead: 'Compare two products on the attributes both actually publish: brand, type, exposure, density, resin, surface, standards and thickness.',
    steps: [
      {title: 'Pick two products', body: 'Any two boards with published specifications.'},
      {title: 'Read the differences', body: 'Rows that differ are highlighted; rows only one product publishes are left out.'},
      {title: 'Share or ask for a price', body: 'The link keeps both products. Ask for a price on either one.'}
    ],
    faqs: [
      {
        q: 'Why do some rows not appear?',
        a: 'A row is shown only when both products publish that attribute. Nothing is estimated or filled in.'
      },
      {
        q: 'Why are smart locks not in the list?',
        a: 'Smart lock specifications are shared on request, so there is not enough published data for a fair side-by-side comparison.'
      },
      {
        q: 'Can I share a comparison?',
        a: 'Yes. The page address carries both products (?a= and ?b=). Use “Copy link” and send it to your carpenter, architect or client.'
      }
    ],
    related: ['material-selector', 'sheet-calculator', 'requirement-builder'],
    wa: "Hello! I'm comparing boards for my project. Please share price and availability details."
  },
  'requirement-builder': {
    eyebrow: 'Tool 03 · Requirement builder',
    title: 'What are you sourcing?',
    lead: 'Three short steps: project, material, quantity and city. Send it on WhatsApp or as a written enquiry, with everything filled in.',
    steps: [
      {title: 'Project', body: 'Furniture, kitchen, wardrobe, office, partitions, doors or bulk boards.'},
      {title: 'Material', body: 'Only the categories whose products list that application.'},
      {title: 'Quantity & city', body: 'Rough numbers are fine. The team confirms price and availability.'}
    ],
    faqs: [
      {
        q: 'What happens when I send it?',
        a: 'WhatsApp or the enquiry form opens with your project, materials, quantity and city already filled in. Nothing is sent until you press send.'
      },
      {
        q: 'Why are only some materials offered for my project?',
        a: 'Materials are filtered by the applications each product lists in the Ananta catalogue, so you only see categories that fit the job.'
      },
      {
        q: 'Do I need exact quantities?',
        a: 'No. An approximate quantity or a short description is enough to start. For sheet material, the Sheet Quantity Helper gives an area-based estimate.'
      }
    ],
    related: ['sheet-calculator', 'material-selector', 'finish-explorer'],
    wa: "Hello! I'm looking for material supply for a project. Can I share my requirement list?"
  },
  'sheet-calculator': {
    eyebrow: 'Tool 04 · Sheet quantity helper',
    title: 'How many 8 × 4 ft sheets?',
    lead: 'Enter your panel sizes or a total area, add a wastage allowance, and get an approximate sheet count to take into a quote.',
    steps: [
      {title: 'Panels or area', body: 'List pieces (length × width × quantity) in ft, in, mm, cm or m — or enter a total area.'},
      {title: 'Wastage', body: 'Starts at 10 %; change it to match your cutting and grain needs.'},
      {title: 'Approximate sheets', body: 'Area ÷ 32 sq ft, rounded up. Confirm with your carpenter or fabricator.'}
    ],
    faqs: [
      {
        q: 'Which sheet size does it use?',
        a: `8 × 4 ft (32 sq ft) — the sheet size listed for ${sheetNames}.`
      },
      {
        q: 'What is the wastage allowance?',
        a: 'An extra percentage added to the area for saw cuts, offcuts and grain direction. It starts at 10 % and you can change it.'
      },
      {
        q: 'Is this a cutting plan?',
        a: 'No. It is an area-based estimate and does not nest pieces on sheets. Confirm the final count with your carpenter or fabricator.'
      }
    ],
    related: ['requirement-builder', 'compare', 'material-selector'],
    wa: "Hello! I'm estimating sheets for a project. Please share price and availability details."
  },
  'finish-explorer': {
    eyebrow: 'Tool 05 · Finish explorer',
    title: 'Décors, by code.',
    lead: 'Browse the Action TESA prelam décor range by family, search by name or code, and shortlist finishes to send on WhatsApp.',
    steps: [],
    faqs: [],
    related: ['material-selector', 'requirement-builder'],
    wa: "Hello! I'm looking for a pre-laminated board décor. Please share price and availability."
  }
};
