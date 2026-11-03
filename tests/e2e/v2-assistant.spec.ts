import {test, expect, type Page} from '@playwright/test';
import {hydrated} from './helpers';

// V2 assistant: open via event, next-step actions, voice input (stubbed Web
// Speech API — transcript lands editable, never auto-sent), read-aloud only on
// click (stubbed speechSynthesis), layout (side panel ≥768 / bottom sheet <768),
// Escape + focus return. Zero /api or model calls throughout.
const AI = /\/api\/|anthropic|openai|generativelanguage|cohere|mistral|groq|huggingface/i;

function watchRequests(page: Page) {
  const seen: string[] = [];
  page.on('request', (r) => {
    if (AI.test(r.url()) || r.method() !== 'GET') seen.push(`${r.method()} ${r.url()}`);
  });
  return seen;
}

async function openViaEvent(page: Page, message?: string) {
  await page.evaluate((m) => window.dispatchEvent(new CustomEvent('open-bella', {detail: m ? {message: m} : undefined})), message);
  const panel = page.getByTestId('assistant-panel');
  await expect(panel).toBeVisible();
  return panel;
}

/** Fake SpeechRecognition: start → interim "board for" → final "board for kitchen" → end. */
const STUB_RECOGNITION = () => {
  class FakeRecognition {
    lang = '';
    interimResults = false;
    continuous = false;
    maxAlternatives = 1;
    onresult: ((e: unknown) => void) | null = null;
    onerror: ((e: unknown) => void) | null = null;
    onend: (() => void) | null = null;
    onstart: (() => void) | null = null;
    start() {
      (window as unknown as {__recLang: string}).__recLang = this.lang;
      const res = (t: string, isFinal: boolean) => Object.assign([{transcript: t}], {isFinal});
      setTimeout(() => this.onstart?.(), 20);
      setTimeout(() => this.onresult?.({resultIndex: 0, results: [res('board for', false)]}), 150);
      setTimeout(() => this.onresult?.({resultIndex: 0, results: [res('board for kitchen', true)]}), 700);
      setTimeout(() => this.onend?.(), 800);
    }
    stop() {
      setTimeout(() => this.onend?.(), 10);
    }
    abort() {
      this.stop();
    }
  }
  Object.defineProperty(window, 'SpeechRecognition', {value: FakeRecognition, configurable: true, writable: true});
  Object.defineProperty(window, 'webkitSpeechRecognition', {value: FakeRecognition, configurable: true, writable: true});
};

const STUB_SYNTHESIS = () => {
  const spoken: string[] = [];
  (window as unknown as {__spoken: string[]}).__spoken = spoken;
  class FakeUtterance {
    text: string;
    lang = '';
    rate = 1;
    voice: unknown = null;
    onend: (() => void) | null = null;
    onerror: (() => void) | null = null;
    constructor(t: string) {
      this.text = t;
    }
  }
  const synth = {
    speak: (u: FakeUtterance) => spoken.push(u.text),
    cancel: () => {},
    getVoices: () => [{lang: 'en-US', name: 'US'}, {lang: 'en-IN', name: 'India'}],
    speaking: false
  };
  Object.defineProperty(window, 'speechSynthesis', {value: synth, configurable: true});
  Object.defineProperty(window, 'SpeechSynthesisUtterance', {value: FakeUtterance, configurable: true, writable: true});
};

test.describe('v2 assistant', () => {
  test('opens via open-bella, focus moves in, Escape closes and focus returns to the launcher', async ({page}) => {
    await page.goto('/');
    await hydrated(page);
    const launcher = page.getByTestId(page.viewportSize()!.width < 768 ? 'assistant-launcher' : 'assistant-launcher-desktop');
    await launcher.click();
    const panel = page.getByTestId('assistant-panel');
    await expect(panel).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('data-chat-open', '1');
    // Desktop: the composer; phones: the sheet itself (no keyboard pop-up).
    await expect(page.viewportSize()!.width < 768 ? panel : panel.getByRole('textbox')).toBeFocused();
    await expect(panel.getByTestId('assistant-chips').getByRole('button', {name: 'Compare MR vs BWP'})).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(panel).toBeHidden();
    await expect(page.locator('html')).not.toHaveAttribute('data-chat-open', '1');
    await expect(page.getByTestId('assistant-holder')).toHaveAttribute('inert', '');
    await expect(launcher).toBeFocused();
  });

  test('layout: side panel on desktop, bottom sheet on phones, inside the viewport', async ({page}) => {
    await page.goto('/');
    await hydrated(page);
    const panel = await openViaEvent(page);
    await page.waitForTimeout(450);
    const vp = page.viewportSize()!;
    const box = (await panel.boundingBox())!;
    expect(box.y).toBeGreaterThanOrEqual(0);
    expect(box.y + box.height).toBeLessThanOrEqual(vp.height + 1);
    if (vp.width < 768) {
      expect(Math.round(box.width)).toBe(vp.width);
      expect(Math.round(box.y + box.height)).toBe(vp.height);
      expect(box.height).toBeLessThanOrEqual(vp.height * 0.86);
    } else {
      expect(box.width).toBeLessThanOrEqual(420);
      expect(box.x + box.width).toBeLessThanOrEqual(vp.width);
      expect(box.x + box.width).toBeGreaterThan(vp.width - 40);
    }
  });

  test('ask "kitchen" → next-step action links to real pages + Get price on WhatsApp', async ({page}) => {
    await page.goto('/');
    await hydrated(page);
    const seen = watchRequests(page);
    const panel = await openViaEvent(page);
    await panel.getByRole('textbox').fill('kitchen');
    await panel.getByRole('textbox').press('Enter');
    await expect(panel.locator('[data-intent="selector:kitchen"]')).toBeVisible();
    const actions = panel.getByTestId('assistant-actions');
    expect(await actions.getByRole('link', {name: /Material Selector/}).getAttribute('href')).toMatch(/\/tools\/material-selector$/);
    expect(await actions.getByRole('link', {name: /^View /}).getAttribute('href')).toMatch(/^\/products\/plywood\//);
    const price = await actions.getByRole('link', {name: /Get price/}).getAttribute('href');
    expect(price).toContain('wa.me/918320052838');
    expect(decodeURIComponent(price!)).toContain('Sent from: Assistant');
    expect(await actions.getByRole('link', {name: 'Send enquiry'}).getAttribute('href')).toMatch(/^\/contact\?.*source=Assistant/);
    // Seeded message via the event detail
    await page.keyboard.press('Escape');
    await openViaEvent(page, 'mr vs bwp');
    await expect(panel.locator('[data-intent="compare"]')).toBeVisible();
    await page.waitForTimeout(300);
    expect(seen).toEqual([]);
  });

  test('voice: mic shown when SpeechRecognition exists; transcript lands editable and is NOT auto-sent', async ({page}) => {
    await page.addInitScript(STUB_RECOGNITION);
    await page.goto('/');
    await hydrated(page);
    const seen = watchRequests(page);
    const panel = await openViaEvent(page);
    const mic = panel.getByTestId('assistant-mic');
    await expect(mic).toBeVisible();
    await mic.click();
    await expect(panel.getByTestId('assistant-listening')).toBeVisible();
    await expect(panel.getByTestId('assistant-listening')).toContainText('Listening…');
    await expect(panel.getByTestId('assistant-interim')).toContainText('board for');
    const box = panel.getByRole('textbox');
    await expect(box).toHaveValue('board for kitchen');
    await expect(panel.getByTestId('assistant-listening')).toBeHidden();
    expect(await page.evaluate(() => (window as unknown as {__recLang: string}).__recLang)).toBe('en-IN');
    // Not sent: no user message yet.
    await expect(panel.locator('[data-role="user"]')).toHaveCount(0);
    // Editable: the visitor can change it, then sends.
    await box.fill('board for kitchen sink');
    await panel.getByTestId('assistant-send').click();
    await expect(panel.locator('[data-role="user"]')).toHaveCount(1);
    await expect(panel.locator('[data-intent="selector:kitchen"]')).toBeVisible();
    expect(seen).toEqual([]);
  });

  test('voice: mic hidden when the browser has no SpeechRecognition', async ({page}) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, 'SpeechRecognition', {value: undefined, configurable: true});
      Object.defineProperty(window, 'webkitSpeechRecognition', {value: undefined, configurable: true});
    });
    await page.goto('/');
    await hydrated(page);
    const panel = await openViaEvent(page);
    await expect(panel.getByRole('textbox')).toBeVisible();
    await expect(panel.getByTestId('assistant-mic')).toHaveCount(0);
  });

  test('read aloud: never autoplays; speaks the plain reply only on click', async ({page}) => {
    await page.addInitScript(STUB_SYNTHESIS);
    await page.goto('/');
    await hydrated(page);
    const panel = await openViaEvent(page);
    await panel.getByRole('textbox').fill('hdhmr');
    await panel.getByRole('textbox').press('Enter');
    await expect(panel.locator('[data-intent="product"]')).toBeVisible();
    await page.waitForTimeout(300);
    expect(await page.evaluate(() => (window as unknown as {__spoken: string[]}).__spoken)).toEqual([]);
    await panel.locator('[data-intent="product"]').getByTestId('assistant-read').click();
    const spoken = await page.evaluate(() => (window as unknown as {__spoken: string[]}).__spoken);
    expect(spoken).toHaveLength(1);
    expect(spoken[0]).toContain('HDHMR');
    expect(spoken[0]).not.toMatch(/\*\*|\]\(/);
  });

  test('long words wrap inside bubbles (no horizontal overflow)', async ({page}) => {
    await page.goto('/');
    await hydrated(page);
    const panel = await openViaEvent(page);
    await panel.getByRole('textbox').fill('Supercalifragilisticexpialidocious'.repeat(4));
    await panel.getByRole('textbox').press('Enter');
    await expect(panel.locator('[data-role="user"]')).toHaveCount(1);
    const overflow = await panel.evaluate((el) => {
      const scroller = el.querySelector('[aria-live="polite"]') as HTMLElement;
      return scroller.scrollWidth - scroller.clientWidth;
    });
    expect(overflow).toBeLessThanOrEqual(1);
  });
});
