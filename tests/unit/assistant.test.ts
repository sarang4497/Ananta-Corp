import {afterAll, beforeAll, describe, expect, it, vi} from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import {FALLBACK_TEXT, respond} from '@/lib/assistant/guide';

// The assistant must be a pure function of its input: no network, no model.
const fetchSpy = vi.fn(() => {
  throw new Error('network call from the assistant');
});
beforeAll(() => vi.stubGlobal('fetch', fetchSpy));
afterAll(() => vi.unstubAllGlobals());

const CASES: [string, RegExp][] = [
  ['What is the price of BWP plywood?', /^price$/],
  ['rate for 18mm mr ply', /^price$/],
  ['Which board for a kitchen?', /^selector:kitchen$/],
  ['kichen cabnet board', /^selector:kitchen$/], // typos
  ['wardrobe', /^selector:wardrobe$/],
  ['bathroom vanity', /^selector:bathroom$/],
  ['thickness of hdhmr', /^product-size$/],
  ['hdhmr', /^product$/],
  ['moist master', /^product$/],
  ['exterior mdf', /^product$/],
  ['plywod', /^category:plywood$/],
  ['particle board', /^category:pre-laminated-particle-board$/],
  ['flush doors', /^product$/],
  ['smart locks', /^category:smart-locks$/],
  ['wifi lock', /^product$/],
  ['Duroply', /^brand:Duroply$/],
  ['action tesa', /^brand:Action TESA$/],
  ['tenon', /^brand:Tenon Smart Lock$/],
  ['which brands do you have', /^brands$/],
  ['décor colours', /^decor$/],
  ['3009', /^product$/],
  ['3471', /^decor-code$/],
  ['mr vs bwp', /^compare$/],
  ['difference between hdhmr and moist master', /^compare$/],
  ['what sizes', /^sizes$/],
  ['whatsapp number', /^whatsapp$/],
  ['phone', /^phone$/],
  ['email id', /^email$/],
  ['where is your address', /^address$/],
  ['gst number', /^gstin$/],
  ['opening hours', /^hours$/],
  ['custom furniture as per drawing', /^custom$/],
  ['delivery time to surat', /^delivery$/],
  ['do you have stock', /^stock$/],
  ['hdhmr warranty', /^standards$/],
  ['is it CARB certified', /^standards$/],
  ['asdf qwer zxcv', /^fallback$/],
  ['🙂🙂', /^fallback$/],
  ['what is the meaning of life', /^fallback$/],
  ['', /^fallback$/]
];

describe('deterministic assistant', () => {
  for (const [q, re] of CASES)
    it(`"${q}"`, () => {
      const r = respond(q);
      expect(r.intent).toMatch(re);
      expect(r.text.length).toBeGreaterThan(10);
      expect(r.actions.length).toBeGreaterThan(0);
    });

  it('is a pure function (same input → same output)', () => {
    for (const [q] of CASES) expect(respond(q)).toEqual(respond(q));
  });

  it('never invents prices, warranty periods, stock quantities, delivery times, CNC capability or hours', () => {
    for (const [q] of CASES) {
      const t = respond(q).text;
      expect(t, q).not.toMatch(/₹|rs\.?\s?\d|\d+\s?(year|yr)s?\s?(warranty|guarantee)|\d+\s?(sheets|pieces|units) in stock|within \d+\s?(hours|days)|same[- ]day|we (use|have) cnc|cnc machines|open (from|till|until)|\d{1,2}(:\d\d)?\s?(am|pm)/i);
      expect(t, q).not.toMatch(/CARB|E1|E2|100% (BWP|water)/);
    }
  });

  it('unknown input gets the safe fallback with WhatsApp + contact actions', () => {
    const r = respond('blorp');
    expect(r.text).toBe(FALLBACK_TEXT);
    expect(r.actions.some((a) => a.value.includes('wa.me/918320052838'))).toBe(true);
    expect(r.actions.some((a) => a.value === '/contact')).toBe(true);
  });

  it('made zero network calls', () => expect(fetchSpy).not.toHaveBeenCalled());

  it('no AI/model code or endpoint remains in the app', () => {
    const root = path.resolve(__dirname, '../..');
    const walk = (d: string): string[] => fs.readdirSync(d, {withFileTypes: true}).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
    const src = walk(path.join(root, 'src')).map((f) => fs.readFileSync(f, 'utf8')).join('\n');
    expect(src).not.toMatch(/@anthropic-ai|anthropic\.com|openai|generativelanguage|\/api\/chat|claude-(opus|sonnet|haiku)/i);
    expect(fs.existsSync(path.join(root, 'src/app/api/chat'))).toBe(false);
    const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
    expect(Object.keys({...pkg.dependencies, ...pkg.devDependencies}).join(' ')).not.toMatch(/anthropic|openai|@ai-sdk|langchain/);
  });
});
