/**
 * Verified key attributes ("USPs") and visual spec blocks — DERIVED from the
 * product record, never written by hand. Every value returned here is a
 * substring of (or a direct lookup on) that product's own data:
 *   - `spec`        → a row in `product.specs`
 *   - `standard`    → `product.standards[].label`, attributed "as stated by <brand>"
 *   - `exposure`    → EXPOSURE_LABEL[product.exposure] (src/content/site.ts)
 *   - `application` → APPLICATIONS labels for `product.applications`, or `product.uses`
 *   - `size`        → values from `product.sizes`
 *   - `on-request`  → products flagged `specsOnRequest`
 * Missing data yields no USP and no block — never a placeholder.
 */
import {APPLICATIONS, EXPOSURE_LABEL} from '@/content/site';
import type {Product} from './products';

/** lucide-react icon names (rendered by components/catalog2/product/UspIcon). */
export type UspIcon =
  | 'BadgeCheck'
  | 'Gauge'
  | 'ShieldCheck'
  | 'Droplets'
  | 'FlaskConical'
  | 'Bug'
  | 'Layers'
  | 'Ruler'
  | 'Maximize2'
  | 'FingerprintPattern'
  | 'Monitor'
  | 'DoorClosed'
  | 'Palette'
  | 'LayoutGrid'
  | 'KeyRound'
  | 'Info';

export type UspSource = 'spec' | 'standard' | 'exposure' | 'application' | 'size' | 'on-request';

export type Usp = {
  key: string;
  label: string;
  value: string;
  icon: UspIcon;
  source: UspSource;
  /** Attribution, e.g. "as stated by Duroply". */
  note?: string;
};

export type SpecBlock = Usp;

const spec = (p: Product, ...labels: string[]): [string, string] | undefined => {
  for (const l of labels) {
    const row = p.specs.find(([k]) => k === l);
    if (row) return row;
  }
  return undefined;
};

const fromSpec = (p: Product, key: string, icon: UspIcon, labels: string[], label?: string): Usp | undefined => {
  const row = spec(p, ...labels);
  return row ? {key, label: label ?? row[0], value: row[1], icon, source: 'spec'} : undefined;
};

const isCode = (label: string) => /^IS\s/.test(label);

/**
 * Standards, published codes (IS …) first. A non-code property that merely
 * repeats a spec row (e.g. "Density > 850 kg/m³" next to the Density row) is
 * dropped so the same fact is never shown twice.
 */
const standards = (p: Product) => {
  const specText = p.specs.flat().join(' ').toLowerCase();
  return p.standards
    .filter((s) => isCode(s.label) || !specText.includes(s.label.split(/\s/)[0].toLowerCase()))
    .sort((a, b) => Number(isCode(b.label)) - Number(isCode(a.label)));
};

const standardUsp = (p: Product, i = 0): Usp | undefined => {
  const s = standards(p)[i];
  return s ? {key: `standard-${i}`, label: isCode(s.label) ? 'Standard' : 'Property', value: s.label, icon: 'ShieldCheck', source: 'standard', note: `as stated by ${s.by}`} : undefined;
};

const exposureUsp = (p: Product): Usp | undefined =>
  p.exposure ? {key: 'exposure', label: 'Exposure', value: EXPOSURE_LABEL[p.exposure], icon: 'Droplets', source: 'exposure'} : undefined;

export const applicationLabels = (p: Product): string[] =>
  p.applications.map((a) => APPLICATIONS.find((x) => x.key === a)?.label).filter((l): l is string => !!l);

const applicationUsp = (p: Product, n = 2): Usp | undefined => {
  const labels = applicationLabels(p).slice(0, n);
  return labels.length ? {key: 'application', label: 'Application', value: labels.join(' · '), icon: 'LayoutGrid', source: 'application'} : undefined;
};

/** Millimetre sizes listed for the product, numerically sorted. */
export const mmSizes = (p: Product): string[] =>
  p.sizes.filter((s) => /MM$/.test(s)).sort((a, b) => parseFloat(a) - parseFloat(b));

const fmtMm = (s: string) => s.replace(/\s*MM$/, '');

const thicknessUsp = (p: Product): Usp | undefined => {
  const mm = mmSizes(p);
  if (mm.length) {
    const value = mm.length === 1 ? `${fmtMm(mm[0])} mm` : `${fmtMm(mm[0])}–${fmtMm(mm[mm.length - 1])} mm`;
    return {key: 'thickness', label: 'Thickness', value, icon: 'Ruler', source: 'size', note: `${mm.length} option${mm.length > 1 ? 's' : ''} listed`};
  }
  return fromSpec(p, 'thickness', 'Ruler', ['Thickness'], 'Thickness');
};

const ON_REQUEST: Usp = {key: 'on-request', label: 'Details', value: 'Specs on request', icon: 'Info', source: 'on-request'};

function candidates(p: Product): (Usp | undefined)[] {
  if (p.specsOnRequest) {
    return [
      fromSpec(p, 'access', 'FingerprintPattern', ['Access']),
      fromSpec(p, 'display', 'Monitor', ['Display']),
      fromSpec(p, 'closing', 'DoorClosed', ['Closing']),
      p.uses.length ? {key: 'use', label: 'Used for', value: p.uses.slice(0, 2).join(' · '), icon: 'DoorClosed', source: 'application'} : undefined,
      fromSpec(p, 'brand', 'KeyRound', ['Brand']),
      ON_REQUEST
    ];
  }
  return [
    fromSpec(p, 'grade', 'BadgeCheck', ['Grade']),
    fromSpec(p, 'decor', 'Palette', ['Décor']),
    fromSpec(p, 'density', 'Gauge', ['Density']),
    standardUsp(p),
    exposureUsp(p),
    fromSpec(p, 'treatment', 'Bug', ['Treatment']),
    fromSpec(p, 'resin', 'FlaskConical', ['Bonding resin']),
    fromSpec(p, 'construction', 'Layers', ['Construction']),
    fromSpec(p, 'surface', 'Layers', ['Surface', 'Finishes']),
    thicknessUsp(p),
    applicationUsp(p)
  ];
}

/**
 * 2–4 verified key attributes for cards, tabs and the product hero. Locks with
 * `specsOnRequest` get only what exists plus "Specs on request".
 */
export function uspsFor(p: Product, max = 4): Usp[] {
  const out: Usp[] = [];
  for (const u of candidates(p)) {
    if (!u || out.some((x) => x.key === u.key || x.value === u.value)) continue;
    out.push(u);
    if (out.length >= max) break;
  }
  if (p.specsOnRequest && !out.some((u) => u.key === ON_REQUEST.key)) out[out.length - 1] = ON_REQUEST;
  return out;
}

/**
 * Visual spec blocks for the product page (Thickness, Size, Grade, Standard,
 * Density, Exposure, Application) — only the ones with a value.
 */
export function specBlocksFor(p: Product): SpecBlock[] {
  const std = standards(p).filter((s) => isCode(s.label));
  const blocks: (SpecBlock | undefined)[] = [
    thicknessUsp(p),
    fromSpec(p, 'size', 'Maximize2', ['Sheet size', 'Standard sizes'], 'Size'),
    fromSpec(p, 'grade', 'BadgeCheck', ['Grade', 'Board'], 'Grade'),
    std.length
      ? {key: 'standard', label: 'Standard', value: std.map((s) => s.label).join(' · '), icon: 'ShieldCheck', source: 'standard', note: `as stated by ${std[0].by}`}
      : undefined,
    fromSpec(p, 'density', 'Gauge', ['Density'], 'Density'),
    exposureUsp(p),
    applicationUsp(p, 3)
  ];
  return blocks.filter((b): b is SpecBlock => !!b);
}

/** One readable line of uses for cards (A1 wording, first three). */
export const usesLine = (p: Product, n = 3): string => p.uses.slice(0, n).join(', ');
