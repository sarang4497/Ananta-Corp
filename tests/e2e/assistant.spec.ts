import {test, expect, type Page} from '@playwright/test';
import {hydrated} from './helpers';

// PERMANENT: every assistant interaction makes ZERO model/API calls.
// Records every request the page makes while the assistant is used; nothing
// may hit an /api route or any AI provider, and nothing may be POSTed.
const AI = /\/api\/|anthropic|openai|generativelanguage|cohere|mistral|groq|huggingface/i;

async function openAssistant(page: Page) {
  await page.goto('/');
  await hydrated(page);
  await page.getByTestId(page.viewportSize()!.width < 768 ? 'assistant-launcher' : 'assistant-launcher-desktop').click();
  await expect(page.getByTestId('assistant-panel')).toBeVisible();
}

const INPUTS = [
  'What is the price of BWP plywood?', // pricing
  'kichen cabnet board', // typos
  'hdhmr thickness', // product
  'tell me about action tesa', // brand
  'asdkjh qwe zzz', // nonsense
  'what is the meaning of life', // unknown
  'mr vs bwp', // comparison
  'address',
  'hdhmr warranty'
];

test('assistant: known, unknown, typo, nonsense, product, brand, price → zero AI/API calls', async ({page}) => {
  await openAssistant(page);
  const seen: string[] = [];
  page.on('request', (r) => {
    if (AI.test(r.url()) || r.method() !== 'GET') seen.push(`${r.method()} ${r.url()}`);
  });
  const panel = page.getByTestId('assistant-panel');
  // chips
  await panel.getByRole('button', {name: 'Find a board for kitchen'}).click();
  await expect(panel.locator('[data-intent="selector:kitchen"]')).toBeVisible();
  // free text
  for (const q of INPUTS) {
    await panel.getByRole('textbox').fill(q);
    await panel.getByRole('textbox').press('Enter');
    await expect(panel.getByText(q, {exact: true})).toBeVisible();
  }
  await expect(panel.locator('[data-intent="fallback"]').first()).toContainText('I can help you with products, brands');
  await expect(panel.locator('[data-intent="price"]')).toContainText("Prices aren't published");
  await expect(panel).not.toContainText(/CARB|\d+[- ]year warranty|same day/i);
  await page.waitForTimeout(500);
  expect(seen).toEqual([]);
});

test('assistant fallback offers topic buttons + WhatsApp + contact', async ({page}) => {
  await openAssistant(page);
  const panel = page.getByTestId('assistant-panel');
  await panel.getByRole('textbox').fill('zzzz');
  await panel.getByRole('textbox').press('Enter');
  const actions = panel.getByTestId('assistant-actions');
  await expect(actions.getByRole('button', {name: 'Which brands?'})).toBeVisible();
  expect(await actions.getByRole('link', {name: 'WhatsApp the team'}).getAttribute('href')).toContain('wa.me/918320052838');
  await expect(actions.getByRole('link', {name: 'Contact'})).toBeVisible();
});

test('/api/chat no longer exists', async ({request}) => {
  const r = await request.post('/api/chat', {data: {messages: [{role: 'user', content: 'hi'}]}});
  expect(r.status()).toBe(404);
});
