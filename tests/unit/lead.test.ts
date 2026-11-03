import {describe, expect, it, vi} from 'vitest';
import {DEFAULT_RECIPIENT, leadEmail, sendLeadEmail, validateLead} from '@/lib/leads/lead';

const base = {name: 'Ravi Shah', phone: '+91 98765 43210', email: 'Ravi@Example.com'};
const now = new Date('2026-11-02T10:00:00Z');

describe('lead validation', () => {
  it('accepts a complete lead and normalises email', () => {
    const v = validateLead({...base, product: 'Duroply BWP Boiling Water Proof Plywood', size: '12 MM', quantity: '40 sheets', city: 'Ahmedabad', page: '/contact?product=x'}, now, 'L-1');
    expect(v.ok).toBe(true);
    if (v.ok) expect(v.lead).toMatchObject({id: 'L-1', email: 'ravi@example.com', size: '12 MM', at: now.toISOString()});
  });
  it('keeps quote-context fields (finish, origin) and omits empty ones', () => {
    const v = validateLead({...base, finish: '  1103 Frosty White ', origin: 'Requirement Builder'}, now, 'L-3');
    expect(v.ok).toBe(true);
    if (v.ok) {
      expect(v.lead).toMatchObject({finish: '1103 Frosty White', origin: 'Requirement Builder'});
      expect(v.lead.size).toBeUndefined();
      expect(leadEmail(v.lead).text).toContain('Request origin: Requirement Builder');
    }
  });
  it.each([
    [{...base, name: ''}, 'missing-name'],
    [{...base, phone: '123'}, 'invalid-phone'],
    [{...base, email: 'nope'}, 'invalid-email'],
    [{...base, website: 'http://spam'}, 'spam']
  ])('rejects %j', (input, err) => {
    const v = validateLead(input as never);
    expect(v.ok).toBe(false);
    if (!v.ok) expect(v.error).toBe(err);
  });
});

describe('notification email', () => {
  const v = validateLead({...base, company: 'Shah Interiors', product: 'Action TESA HDHMR Board', size: '18 MM', finish: '3009 Classic Planked Walnut', origin: 'Product page', category: 'MDF', quantity: '20', city: 'Surat', message: 'Need <b>fast</b>', page: '/products/mdf'}, now, 'L-2');
  const lead = v.ok ? v.lead : (null as never);
  it('subject + all available fields, escaped html', () => {
    const m = leadEmail(lead);
    expect(m.subject).toBe('ANANTA — New Enquiry — Ravi Shah / Shah Interiors');
    for (const s of ['Ravi Shah', 'Shah Interiors', '+91 98765 43210', 'ravi@example.com', 'Action TESA HDHMR Board', '18 MM', '3009 Classic Planked Walnut', 'Product page', 'MDF', 'Surat', '/products/mdf', '2026-11-02T10:00:00.000Z', 'L-2'])
      expect(m.text).toContain(s);
    expect(m.html).toContain('&lt;b&gt;fast&lt;/b&gt;');
    expect(m.replyTo).toBe('ravi@example.com');
  });
  it('default recipient is info@anantacorporation.com', async () => {
    const f = vi.fn(async () => new Response(JSON.stringify({id: 're_1'}), {status: 200}));
    const r = await sendLeadEmail(lead, {RESEND_API_KEY: 'k', LEAD_EMAIL_FROM: 'Ananta <leads@anantacorporation.com>'}, f as never);
    expect(r).toEqual({status: 'sent', providerId: 're_1'});
    const body = JSON.parse((f.mock.calls[0] as unknown as [string, RequestInit])[1].body as string);
    expect(DEFAULT_RECIPIENT).toBe('info@anantacorporation.com');
    expect(body.to).toEqual(['info@anantacorporation.com']);
    expect(body.from).toBe('Ananta <leads@anantacorporation.com>');
  });
  it('not configured → no network call, truthful state', async () => {
    const f = vi.fn();
    expect(await sendLeadEmail(lead, {}, f as never)).toEqual({status: 'not-configured'});
    expect(f).not.toHaveBeenCalled();
  });
  it('provider error / network error → failed (never throws)', async () => {
    const bad = vi.fn(async () => new Response('domain not verified', {status: 403}));
    const r1 = await sendLeadEmail(lead, {RESEND_API_KEY: 'k'}, bad as never);
    expect(r1.status).toBe('failed');
    const boom = vi.fn(async () => {
      throw new Error('ECONNRESET');
    });
    expect(await sendLeadEmail(lead, {RESEND_API_KEY: 'k'}, boom as never)).toEqual({status: 'failed', error: 'ECONNRESET'});
  });
});

describe('POST /api/lead', () => {
  it('records the lead even when email fails, and reports the real state', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    const err = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.stubEnv('RESEND_API_KEY', 'k');
    vi.stubGlobal('fetch', vi.fn(async () => new Response('fail', {status: 500})));
    const {POST} = await import('@/app/api/lead/route');
    const res = await POST(new Request('http://x/api/lead', {method: 'POST', body: JSON.stringify(base)}));
    const json = await res.json();
    expect(json).toMatchObject({ok: true, email: 'failed'});
    expect(log.mock.calls.some((c) => c[0] === '[lead:received]' && String(c[1]).includes('ravi@example.com'))).toBe(true);
    expect(err.mock.calls.some((c) => c[0] === '[lead:email-failed]' && String(c[1]).includes(json.id))).toBe(true);
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });
  it('invalid input → 400, nothing recorded', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    log.mockClear();
    const {POST} = await import('@/app/api/lead/route');
    const res = await POST(new Request('http://x/api/lead', {method: 'POST', body: JSON.stringify({...base, email: 'x'})}));
    expect(res.status).toBe(400);
    expect(log.mock.calls.some((c) => c[0] === '[lead:received]')).toBe(false);
  });
});
