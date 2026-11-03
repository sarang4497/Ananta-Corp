import {describe, expect, it} from 'vitest';
import {quoteContactHref, quoteMessage, quoteWhatsappUrl} from '@/lib/quote';

describe('quote context', () => {
  it('builds a product message with every supplied field and no empty lines for missing ones', () => {
    const m = quoteMessage({product: 'Duroply BWP Plywood', size: '18 MM', quantity: '40 sheets', city: 'Ahmedabad', source: 'Product page'});
    expect(m).toContain("I'm interested in Duroply BWP Plywood");
    expect(m).toContain('Size / thickness: 18 MM');
    expect(m).toContain('Quantity: 40 sheets');
    expect(m).toContain('City: Ahmedabad');
    expect(m).toContain('(Sent from: Product page)');
    expect(m).not.toContain('Finish');
    expect(m).not.toMatch(/₹|price is|in stock|delivery in/i);
  });
  it('falls back to the default greeting', () => {
    expect(quoteMessage()).toMatch(/interested in your products/);
  });
  it('encodes into wa.me and /contact query', () => {
    expect(quoteWhatsappUrl({product: 'X'})).toMatch(/^https:\/\/wa\.me\/918320052838\?text=/);
    expect(quoteContactHref({product: 'X', size: '9 MM', source: 'Tile'})).toEqual({
      pathname: '/contact',
      query: {product: 'X', size: '9 MM', source: 'Tile'}
    });
  });
});
