/**
 * Quote context — carries what the visitor was looking at (product, size,
 * finish, quantity, city, source page) into WhatsApp or the enquiry form.
 * ONE builder for every "Get price" CTA. No prices, stock or delivery promises.
 */
import type {Href} from '@/data/products';
import {whatsappUrl} from '@/lib/whatsapp';

export type QuoteContext = {
  product?: string;
  category?: string;
  size?: string;
  finish?: string;
  quantity?: string;
  city?: string;
  /** Free-text requirement, e.g. from the Requirement Builder. */
  requirement?: string;
  /** Where the request came from, e.g. "Product page", "Requirement Builder". */
  source?: string;
};

const FIELDS: [keyof QuoteContext, string][] = [
  ['product', 'Product'],
  ['category', 'Category'],
  ['size', 'Size / thickness'],
  ['finish', 'Finish / décor'],
  ['quantity', 'Quantity'],
  ['city', 'City'],
  ['requirement', 'Requirement']
];

export function quoteMessage(ctx: QuoteContext = {}): string {
  const lines = FIELDS.filter(([k]) => ctx[k]?.trim()).map(([k, label]) => `${label}: ${ctx[k]!.trim()}`);
  const head = ctx.product
    ? `Hello! I'm interested in ${ctx.product}. Please share price and availability details.`
    : "Hello! I'm interested in your products. Please share price and availability details.";
  const body = lines.filter((l) => !(ctx.product && l.startsWith('Product:')));
  const tail = ctx.source ? [`(Sent from: ${ctx.source})`] : [];
  return [head, ...(body.length ? ['', ...body] : []), ...(tail.length ? ['', ...tail] : [])].join('\n');
}

export function quoteWhatsappUrl(ctx: QuoteContext = {}): string {
  return whatsappUrl(quoteMessage(ctx));
}

/** Link to /contact with the context prefilled (ContactLeadForm reads these query keys). */
export function quoteContactHref(ctx: QuoteContext = {}): Href {
  const query: Record<string, string> = {};
  for (const [k] of FIELDS) if (ctx[k]?.trim()) query[k] = ctx[k]!.trim();
  if (ctx.source) query.source = ctx.source;
  return {pathname: '/contact', query} as Href;
}

export const QUOTE_QUERY_KEYS = [...FIELDS.map(([k]) => k), 'source'] as const;
