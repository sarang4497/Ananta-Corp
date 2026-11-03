import {afterAll, beforeAll, describe, expect, it, vi} from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import {FALLBACK_TEXT, GUIDE_CHIPS, hrefToPath, parseArea, respond, searchPosts, sheetsFor, type Action} from '@/lib/assistant/guide';
import {LANGS, enabledLangs, pickVoice, readTranscript, speechErrorMessage, stripMarkdown} from '@/lib/assistant/speech';
import {CATEGORIES, PRODUCTS, productPath} from '@/data/products';
import {TOOLS} from '@/content/tools';
import {POSTS} from '@/content/blog';
import {routing} from '@/i18n/routing';

// The assistant must be a pure function of its input: no network, no model.
const fetchSpy = vi.fn(() => {
  throw new Error('network call from the assistant');
});
beforeAll(() => vi.stubGlobal('fetch', fetchSpy));
afterAll(() => vi.unstubAllGlobals());

const CASES: [string, RegExp][] = [
  ['What is the price of BWP plywood?', /^price$/],
  ['rate for 18mm mr ply', /^price$/],
  ['Get price', /^price$/],
  ['Which board for a kitchen?', /^selector:kitchen$/],
  ['Find a board for kitchen', /^selector:kitchen$/],
  ['kichen cabnet board', /^selector:kitchen$/], // typos
  ['wardrobe', /^selector:wardrobe$/],
  ['bathroom vanity', /^selector:bathroom$/],
  ['wet zone boards', /^selector:bathroom$/],
  ['office workstations', /^selector:office$/],
  ['boards for furniture', /^application:furniture$/],
  ['wall panelling', /^application:panelling$/],
  ['thickness of hdhmr', /^product-size$/],
  ['hdhmr specs', /^product-specs$/],
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
  ['what categories do you have', /^range$/],
  ['décor colours', /^decor$/],
  ['finish explorer', /^decor$/],
  ['3009', /^product$/],
  ['Décor 3009', /^product$/],
  ['3471', /^decor-code$/],
  ['mr vs bwp', /^compare$/],
  ['Compare MR vs BWP', /^compare$/],
  ['difference between hdhmr and moist master', /^compare$/],
  ['compare boards', /^compare$/],
  ['what sizes', /^sizes$/],
  ['specifications', /^specs$/],
  ['how many sheets do I need', /^sheets$/],
  ['how many sheets for 400 sq ft', /^sheets$/],
  ['I need ply for 250 sqft', /^sheets$/],
  ['requirement builder', /^requirement-builder$/],
  ['bulk order for a project', /^requirement-builder$/],
  ['what tools do you have', /^tools$/],
  ['Read guides', /^guides$/],
  ['blog about plywood', /^guides$/],
  ['whatsapp number', /^whatsapp$/],
  ['phone', /^phone$/],
  ['email id', /^email$/],
  ['where is your address', /^address$/],
  ['gst number', /^gstin$/],
  ['opening hours', /^hours$/],
  ['custom furniture as per drawing', /^custom$/],
  ['delivery time to surat', /^delivery$/],
  ['logistics', /^delivery$/],
  ['do you have stock', /^stock$/],
  ['hdhmr warranty', /^standards$/],
  ['is it CARB certified', /^standards$/],
  ['hello', /^greeting$/],
  ['thanks', /^thanks$/],
  ['asdf qwer zxcv', /^fallback$/],
  ['🙂🙂', /^fallback$/],
  ['what is the meaning of life', /^fallback$/],
  ['', /^fallback$/]
];

// Every internal path the site really serves (derived from the data, never typed).
const STATIC = Object.keys(routing.pathnames).filter((p) => !p.includes('['));
const KNOWN = new Set<string>([
  ...STATIC,
  ...CATEGORIES.map((c) => `/products/${c.slug}`),
  ...CATEGORIES.flatMap((c) => c.subs.map((s) => `/products/${c.slug}/${s.slug}`)),
  ...PRODUCTS.map(productPath),
  ...TOOLS.map((t) => hrefToPath(t.href)),
  ...POSTS.map((p) => `/blog/${p.slug}`)
]);
const PARTNER_ANCHORS = new Set(['duroply', 'action-tesa', 'tenon-smart-lock']);
function resolves(p: string): boolean {
  const [noHash, hash] = p.split('#');
  const base = noHash.split('?')[0];
  if (!KNOWN.has(base)) return false;
  if (base === '/partners' && hash) return PARTNER_ANCHORS.has(hash);
  return true;
}
const linkPaths = (as: Action[]) => as.flatMap((a) => (a.kind === 'link' ? [hrefToPath(a.href)] : []));
/** Internal links written in reply markdown: [text](/path). */
const mdPaths = (t: string) => [...t.matchAll(/\]\((\/[^)\s]*)\)/g)].map((m) => m[1]);

const BANNED =
  /₹|rs\.?\s?\d|\d+\s?(year|yr)s?\s?(warranty|guarantee)|\d+\s?(sheets|pieces|units) in stock|within \d+\s?(hours|days)|within 24|same[- ]day|we (use|have) cnc|cnc machines|open (from|till|until)|\d{1,2}(:\d\d)?\s?(am|pm)|decades|\d+\+\s?years|founded in 2024|carb|\bE1\b|\bE2\b|100% (bwp|water)|weather[- ]resistant|melamine[- ]fortified|certified materials|best in india|world[- ]class|unmatched|industry leader|leading supplier|largest stock|exclusive distributor|official distributor|aggregaterating|tenon[^.]{0,40}authori[sz]ed/i;

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

  it('never invents prices, warranties, stock counts, delivery times, CNC capability, hours or banned claims', () => {
    const inputs = [...CASES.map(([q]) => q), ...PRODUCTS.map((p) => p.short), ...PRODUCTS.map((p) => `${p.short} specs`), ...GUIDE_CHIPS.map((c) => c.label)];
    for (const q of inputs) {
      const r = respond(q);
      expect(r.text, q).not.toMatch(BANNED);
      for (const a of r.actions) expect(a.label, q).not.toMatch(BANNED);
    }
  });

  it('every internal action link and markdown link resolves to a real page', () => {
    const inputs = [
      ...CASES.map(([q]) => q),
      ...PRODUCTS.map((p) => p.short),
      ...PRODUCTS.map((p) => `price of ${p.short}`),
      ...CATEGORIES.map((c) => c.slug.replace(/-/g, ' ')),
      ...GUIDE_CHIPS.map((c) => c.label),
      'blorp'
    ];
    let checked = 0;
    for (const q of inputs) {
      const r = respond(q);
      for (const p of [...linkPaths(r.actions), ...mdPaths(r.text)]) {
        expect(resolves(p), `${q} → ${p}`).toBe(true);
        checked++;
      }
    }
    expect(checked).toBeGreaterThan(50);
  });

  it('every "Get price" goes through the quote builder with source Assistant', () => {
    for (const q of ['Get price', 'price of hdhmr', 'hdhmr', 'kitchen', 'plywood', '3471']) {
      const price = respond(q).actions.find((a) => a.kind === 'external' && a.tone === 'price');
      expect(price, q).toBeDefined();
      const url = (price as {value: string}).value;
      expect(url).toContain('wa.me/918320052838');
      expect(decodeURIComponent(url)).toContain('(Sent from: Assistant)');
    }
    const hd = respond('hdhmr').actions.find((a) => a.kind === 'external' && a.tone === 'price') as {value: string};
    expect(decodeURIComponent(hd.value)).toContain('HDHMR');
    const enq = respond('hdhmr').actions.find((a) => a.kind === 'link' && a.label === 'Send enquiry');
    expect(enq && enq.kind === 'link' ? hrefToPath(enq.href) : '').toMatch(/^\/contact\?product=.*source=Assistant/);
  });

  it('useful replies offer next steps (view product / compare / category / tool / price)', () => {
    const p = respond('hdhmr').actions.map((a) => a.label);
    expect(p).toEqual(expect.arrayContaining(['View product', 'Get price', 'Send enquiry']));
    expect(p.some((l) => l.startsWith('Compare'))).toBe(true);
    expect(p.some((l) => l.startsWith('Explore'))).toBe(true);
    const k = respond('kitchen');
    expect(linkPaths(k.actions)).toContain('/tools/material-selector');
    expect(k.text).toMatch(/BWP/);
    const cmp = respond('mr vs bwp');
    expect(linkPaths(cmp.actions)).toContain('/tools/compare');
    expect(cmp.text).toMatch(/IS 303/);
  });

  it('application replies come from the products `applications` field', () => {
    const r = respond('boards for furniture');
    for (const p of PRODUCTS.filter((x) => x.applications.includes('furniture'))) expect(r.text).toContain(p.short);
    const wet = respond('wet zone');
    for (const p of PRODUCTS.filter((x) => x.applications.includes('wet-zones'))) expect(wet.text).toContain(p.short);
  });

  it('sheet maths: ceil(area / 32) plus a 10% wastage note, only when an area is given', () => {
    expect(parseArea('400 sq ft')).toBe(400);
    expect(parseArea('250sqft')).toBe(250);
    expect(parseArea('10 sqm')).toBeCloseTo(107.639, 2);
    expect(parseArea('18mm ply')).toBeUndefined();
    expect(sheetsFor(400)).toEqual({sheets: 13, withWastage: 14});
    expect(sheetsFor(32)).toEqual({sheets: 1, withWastage: 2});
    const r = respond('how many sheets for 400 sq ft');
    expect(r.text).toContain('13 sheets');
    expect(r.text).toContain('14 sheets');
    expect(r.text).toMatch(/estimate/i);
    expect(linkPaths(r.actions)).toContain('/tools/sheet-calculator');
    expect(respond('how many sheets').text).not.toMatch(/\d+ sheets/);
  });

  it('tools reply lists every tool from the registry', () => {
    const r = respond('tools');
    for (const t of TOOLS) {
      expect(r.text).toContain(t.name);
      expect(linkPaths(r.actions)).toContain(hrefToPath(t.href));
    }
  });

  it('guides: searches POSTS and handles an empty index', () => {
    const r = respond('Read guides');
    expect(linkPaths(r.actions)).toContain('/blog');
    if (!POSTS.length) {
      expect(searchPosts('plywood', ['plywood'])).toEqual([]);
      expect(r.text).toMatch(/being prepared/);
    } else {
      const p = POSTS[0];
      const found = searchPosts(p.title.toLowerCase(), p.title.toLowerCase().split(/\s+/));
      expect(found.map((x) => x.slug)).toContain(p.slug);
    }
  });

  it('hours: not invented (COMPANY has no hours field)', () => {
    expect(respond('opening hours').text).toMatch(/aren.t listed/);
  });

  it('delivery uses the verified OPERATIONS wording', () => {
    expect(respond('delivery').text).toContain('Delivery arranged as per location and availability.');
  });

  it('unknown input gets the safe fallback with search, WhatsApp + contact actions', () => {
    const r = respond('blorp');
    expect(r.text).toBe(FALLBACK_TEXT);
    expect(r.actions.some((a) => a.kind === 'external' && a.value.includes('wa.me/918320052838'))).toBe(true);
    expect(linkPaths(r.actions)).toContain('/contact');
    expect(r.actions).toContainEqual({kind: 'search', label: 'Search the site', value: 'blorp'});
  });

  it('welcome chips are the agreed quick starts', () => {
    expect(GUIDE_CHIPS.map((c) => c.label)).toEqual(['Find a board for kitchen', 'Compare MR vs BWP', 'Décor 3009', 'Read guides', 'Get price']);
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

  it('the chat UI makes no fetch/XHR/beacon calls (voice stays in the browser API)', () => {
    const dir = path.resolve(__dirname, '../../src/components/chat');
    const code = [...fs.readdirSync(dir).map((f) => fs.readFileSync(path.join(dir, f), 'utf8')), fs.readFileSync(path.resolve(__dirname, '../../src/lib/assistant/speech.ts'), 'utf8')].join('\n');
    expect(code).not.toMatch(/\bfetch\(|XMLHttpRequest|sendBeacon|WebSocket|getUserMedia/);
  });
});

describe('speech helpers', () => {
  it('only en-IN is enabled; hi-IN / gu-IN are prepared', () => {
    expect(enabledLangs()).toEqual(['en-IN']);
    expect(Object.keys(LANGS)).toEqual(expect.arrayContaining(['hi-IN', 'gu-IN']));
  });

  it('friendly error text for not-allowed, no-speech, network; silent on aborted', () => {
    expect(speechErrorMessage('not-allowed')).toMatch(/blocked/i);
    expect(speechErrorMessage('no-speech')).toMatch(/didn.t catch/i);
    expect(speechErrorMessage('network')).toMatch(/type/i);
    expect(speechErrorMessage('aborted')).toBe('');
    expect(speechErrorMessage('weird')).toMatch(/try again/i);
  });

  it('readTranscript splits final and interim results', () => {
    const results = Object.assign([Object.assign([{transcript: 'board for '}], {isFinal: true}), Object.assign([{transcript: 'kitch'}], {isFinal: false})]);
    expect(readTranscript({resultIndex: 0, results})).toEqual({final: 'board for', interim: 'kitch'});
  });

  it('pickVoice prefers en-IN, then any en-*', () => {
    expect(pickVoice([{lang: 'en-US'}, {lang: 'en-IN'}])?.lang).toBe('en-IN');
    expect(pickVoice([{lang: 'fr-FR'}, {lang: 'en_GB'}])?.lang).toBe('en_GB');
    expect(pickVoice([{lang: 'fr-FR'}])).toBeUndefined();
  });

  it('stripMarkdown removes bold, links, paths and bullets before speaking', () => {
    const s = stripMarkdown(respond('kitchen').text);
    expect(s).not.toMatch(/\*\*|\]\(|\/products\//);
    expect(stripMarkdown('**HDHMR** — see [HDHMR Board](/products/mdf/hdhmr/x)\n- a\n- b')).toBe('HDHMR — see HDHMR Board. a. b');
  });
});
