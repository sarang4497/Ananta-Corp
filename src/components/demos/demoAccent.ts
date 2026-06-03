/**
 * Per-offering palette accents. Literal class strings only (Tailwind can't see
 * runtime-built names like `bg-${x}`), plus raw hex for inline gradients/SVG.
 */

export type Accent = 'blue' | 'indigo' | 'orange' | 'green' | 'red' | 'brand';

export const accentHex: Record<Accent, string> = {
  blue: '#1877f2',
  indigo: '#4f46e5',
  orange: '#f97316',
  green: '#22c55e',
  red: '#ef4444',
  brand: '#4f46e5'
};

/** A complementary second hue for "brand" gradient rows; identity otherwise. */
export const accentHex2: Record<Accent, string> = {
  blue: '#1877f2',
  indigo: '#4f46e5',
  orange: '#f97316',
  green: '#22c55e',
  red: '#ef4444',
  brand: '#1877f2'
};

export const accentText: Record<Accent, string> = {
  blue: 'text-blue',
  indigo: 'text-indigo',
  orange: 'text-orange',
  green: 'text-green',
  red: 'text-red',
  brand: 'text-indigo'
};

export const accentBg: Record<Accent, string> = {
  blue: 'bg-blue',
  indigo: 'bg-indigo',
  orange: 'bg-orange',
  green: 'bg-green',
  red: 'bg-red',
  brand: 'bg-gradient-brand'
};

export const accentBgSoft: Record<Accent, string> = {
  blue: 'bg-blue/10',
  indigo: 'bg-indigo/10',
  orange: 'bg-orange/10',
  green: 'bg-green/10',
  red: 'bg-red/10',
  brand: 'bg-indigo/10'
};

export const accentBorder: Record<Accent, string> = {
  blue: 'border-blue/30',
  indigo: 'border-indigo/30',
  orange: 'border-orange/30',
  green: 'border-green/30',
  red: 'border-red/30',
  brand: 'border-indigo/30'
};

/** Eyebrow chip: soft tinted background + accent text. */
export const accentChip: Record<Accent, string> = {
  blue: 'bg-blue/10 text-blue',
  indigo: 'bg-indigo/10 text-indigo',
  orange: 'bg-orange/10 text-orange',
  green: 'bg-green/10 text-green',
  red: 'bg-red/10 text-red',
  brand: 'bg-indigo/10 text-indigo'
};
