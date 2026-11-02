import {expect, type Page} from '@playwright/test';

// Permanent overflow guard (adapted from the Montagnese QA suite).
//  1. document scrollWidth ≤ innerWidth — no sideways scroll;
//  2. every visible text/media/control box stays inside the viewport after its
//     clipping ancestors;
//  3. text is never horizontally cut by an overflow-hidden/clip ancestor;
//  4. line-clamp never truncates copy;
//  5. no fixed-height box clips its own text vertically.
// Skipped: aria-hidden/inert/sr-only, invisible elements, intentional
// horizontal scrollers (overflow-x auto/scroll), [data-overflow-ok].
// It does NOT accept `overflow:hidden` on html/body as a fix: body uses
// overflow-x: clip only as a guard, and check 1 measures the document itself.
export async function findMeaningfulOverflow(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const out: string[] = [];
    const sw = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
    if (sw > window.innerWidth + 1) out.push(`document scrollWidth ${sw} > viewport ${window.innerWidth}`);
    const label = (el: Element) => {
      const cls = [...el.classList].slice(0, 3).join('.');
      const txt = (el.textContent || el.getAttribute('alt') || el.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ').slice(0, 40);
      return `${el.tagName.toLowerCase()}${cls ? '.' + cls : ''} "${txt}"`;
    };
    const invisible = (el: Element) => {
      for (let n: Element | null = el; n && n !== document.documentElement; n = n.parentElement) {
        const cs = getComputedStyle(n);
        if (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0') return true;
      }
      return false;
    };
    const seen = new Set<string>();
    for (const el of document.body.querySelectorAll('*')) {
      const ownText = [...el.childNodes].some((n) => n.nodeType === 3 && (n.textContent ?? '').trim().length > 1);
      const media = /^(img|video|svg|button|a|input|select|textarea)$/i.test(el.tagName);
      if (!ownText && !media) continue;
      if (el.closest('[aria-hidden="true"],[inert],[hidden],.sr-only,[data-overflow-ok]')) continue;
      const rc = el.getBoundingClientRect();
      if (rc.width < 2 || rc.height < 2) continue;
      let scroller = false;
      let clip: Element | null = null;
      let visL = -Infinity, visR = Infinity;
      for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
        const ps = getComputedStyle(p);
        if (/(auto|scroll)/.test(ps.overflowX) && p.scrollWidth > p.clientWidth + 1) {
          scroller = true;
          break;
        }
        if (/(hidden|clip)/.test(ps.overflowX) || ps.clipPath !== 'none') {
          if (!clip) clip = p;
          const pr = p.getBoundingClientRect();
          visL = Math.max(visL, pr.left);
          visR = Math.min(visR, pr.right);
        }
      }
      if (scroller || invisible(el)) continue;
      const cs = getComputedStyle(el);
      if (clip && ownText && !media && cs.textOverflow !== 'ellipsis') {
        const cr = clip.getBoundingClientRect();
        if (rc.left < cr.left - 2 || rc.right > cr.right + 2) {
          const k = 'clip ' + label(el);
          if (!seen.has(k)) {
            seen.add(k);
            out.push(`text cut by its container: ${label(el)}`);
          }
        }
      }
      const left = Math.max(rc.left, visL);
      const right = Math.min(rc.right, visR);
      if (right - left > 1 && (left < -1 || right > vw + 1)) {
        const k = 'vp ' + label(el);
        if (!seen.has(k)) {
          seen.add(k);
          out.push(`outside the viewport: ${label(el)} [${Math.round(left)}–${Math.round(right)}] of ${vw}`);
        }
      }
      if (ownText && cs.webkitLineClamp && cs.webkitLineClamp !== 'none' && el.scrollHeight > el.clientHeight + 2) out.push(`line-clamp truncates copy: ${label(el)}`);
      if (ownText && !media && /(hidden|clip)/.test(cs.overflowY) && el.scrollHeight > el.clientHeight + 2 && cs.textOverflow !== 'ellipsis')
        out.push(`fixed height clips text: ${label(el)}`);
    }
    return out;
  });
}

export async function assertNoMeaningfulOverflow(page: Page, where = '') {
  const problems = await findMeaningfulOverflow(page);
  expect(problems, `${where} ${page.url()}\n  ${problems.join('\n  ')}`).toEqual([]);
}

/** Scroll the whole page once so every reveal has played, then back to top. */
export async function revealWholePage(page: Page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 30));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(900);
}
