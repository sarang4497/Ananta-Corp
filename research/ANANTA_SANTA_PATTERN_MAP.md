# Santa-Caterina-Landing: motion and interaction patterns to port

All paths below are under `/Users/sarang/Websites/Santa-Caterina-Landing/`.

**Tailwind version:** this site runs Tailwind 3. It uses `@tailwind base/components/utilities` and `tailwind.config.ts`, and the custom easing is set there as `ease-premium: cubic-bezier(0.22,1,0.36,1)`. For Tailwind 4, move the tokens into `@theme` (for example `--ease-premium`) and the `@layer components` classes into `@utility` or plain CSS.

**Shared easings:**
- Enter: `cubic-bezier(0.22,1,0.36,1)`.
- Mask and curtain: `cubic-bezier(0.76,0,0.24,1)`.

## 1. Hero load sequence, mask reveal and staggered headline

- **Files:** `src/components/site/Hero.tsx`; keyframes in `src/app/globals.css` (lines 342–420).
- **CSS only, so it plays before hydration.** Each delay is set inline with `at(ms)` (`animationDelay`).
  - Eyebrow: `.rise` at 0 ms, plus `.eyebrow-draw`, where the `::before` hairline runs `draw-x` for 1100 ms starting at 150 ms.
  - Headline: each line sits in a `.line-mask` (overflow hidden). Its inner span runs `line-up` (translateY 105% → 0) for 1000 ms. Delays are `120 + i*140` ms.
  - Subhead, CTAs, reassurance and trust row: `.rise` (700 ms, 12px rise) at 420, 540, 640 and 740 ms.
  - Photo: the image is painted from the first frame, so LCP isn't delayed. `.photo-settle` scales it 1.12 → 1 over 2200 ms. An ivory `.photo-curtain` overlay runs `scaleY(1→0)` with `origin-top` for 1100 ms, starting at 250 ms, on the mask easing.
  - Floating chips and the offset frame: `.float-in` (900 ms, 18px plus scale .98) at 700, 1050 and 1150 ms.
  - Background: `.glow-drift` runs an 18 s infinite radial glow.
  - Parallax: `src/lib/use-parallax.ts` uses strength 0.05, only at ≥1024px with motion allowed. It's rAF-throttled and transform-only.

```css
.line-mask { display:block; overflow:hidden; padding-bottom:.08em; margin-bottom:-.08em; }
.line-mask > span { display:block; animation: line-up 1000ms cubic-bezier(.22,1,.36,1) both; }
.photo-curtain { animation: curtain-up 1100ms cubic-bezier(.76,0,.24,1) 250ms both; transform-origin: top; }
```
```tsx
<span className="line-mask">{i>0 && <span className="sr-only"> </span>}
  <span style={at(120 + i*140)}>{text}</span></span>
```

## 2. Scroll reveal, image mask reveal and line draw

- **Files:** `src/components/ui/Reveal.tsx`, `src/components/ui/RevealGroup.tsx`, CSS in `globals.css` (lines 365–373 and 489–532). The gate is in `src/app/layout.tsx`: an inline `<script>` runs `document.documentElement.classList.add('js')`. Without JS, nothing is ever hidden.
- **`Reveal` (whole blocks):**
  - `.js .reveal` starts at opacity 0 and translateY 22px, then transitions for 800 ms.
  - The observer uses `rootMargin: "0px 0px -60px 0px"`.
  - It adds `.is-visible` on entry and removes it only when the block leaves below the viewport, so it replays on scroll-down and doesn't flicker on scroll-up.
  - The `delay` prop is in seconds and is applied as `transitionDelay`.
- **`RevealGroup` (images):**
  - Sets a `data-rv` state of `out`, `in` or `leaving`. Thresholds are `[0, 0.01, enter(0.15), 0.3]`. It counts as "in" when the ratio is ≥ `enter` or more than 30% of the viewport height is covered.
  - `.rv-frame`: opacity plus 20px rise, 800 and 900 ms.
  - The image settles from scale 1.04 over 1100 ms.
  - With `data-rv-mask`, the image goes from `clip-path: inset(18% 0 0 0)` to `inset(0)` over 950 ms on the mask easing.
  - `.rv-rule`: scaleX 0 → 1 over 700 ms.
  - `.rv-line`: 8px rise over 600–700 ms.
  - Stagger comes from `--rv-d` on each child.
  - `leaving` sets opacity .82 and scale .985. `out` sets `transition:none`, so the reset happens off-screen.

```ts
const io = new IntersectionObserver(([e]) => {
  const rootH = e.rootBounds?.height ?? innerHeight;
  if (!e.isIntersecting) el.dataset.rv = "out";
  else if (e.intersectionRatio >= enter || e.intersectionRect.height >= rootH*0.3) el.dataset.rv = "in";
  else if (el.dataset.rv === "in") el.dataset.rv = "leaving";
}, { threshold: [0, 0.01, enter, 0.3] });
```

- **Other line draws:**
  - `.nav-link::after`: gold underline, scaleX over 220 ms.
  - `.card-gold::before`: 2px top rule drawn on hover or focus-within over 500 ms.
- **Pooled observers:** `src/lib/carousel/observe.ts` shares one IntersectionObserver per option set. The carousels use it.

## 3. Desktop nav with photo previews: not in this repo

There's no photo-preview mega-menu here, and no open or close delays. You'll need another reference or a fresh design for that part. What exists is `src/components/NavTreatments.tsx`, a simple disclosure:
- The label is a link; a separate chevron `<button>` carries `aria-expanded` and `aria-controls`.
- `onMouseEnter` opens it and `onMouseLeave` closes it, both with no delay.
- An `openedByHover` ref stops the click that follows a hover from closing the menu.
- It closes on Escape, on an outside `mousedown`, or on `onBlur` when `relatedTarget` is outside the wrapper.
- The panel uses `.pop-in` (200 ms, -6px).

**Header:** `src/components/site/SiteHeader.tsx`.
- `scrollY > 8` compacts the bar: it gains a gold hairline and a shadow over 300 ms.
- The active-section indicator is an rAF scroll check against a line at 35% of the viewport height.

```tsx
onMouseEnter={() => { openedByHover.current = true; setOpen(true); }}
onMouseLeave={() => { openedByHover.current = false; setOpen(false); }}
onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false); }}
```

## 4. Mobile navigation

- **File:** `SiteHeader.tsx`, lines 81–115 and 250–350. Shown below `xl` (1280px).
- **Layout:** a drop-down panel under the header, not a side sheet.
  - Backdrop: `fade-in fixed inset-x-0 bottom-0 top-16 bg-navy-950/30`.
  - Panel: `role="dialog" aria-modal`, `pop-in fixed inset-x-0 top-16 max-h-[calc(100dvh-4rem)] overflow-y-auto`.
- **Behaviour:**
  - Focus moves to the first link on open.
  - Tab is trapped in a loop that includes the menu button. Escape closes and returns focus to the button.
  - A `matchMedia("(min-width:1280px)")` listener closes the menu when the viewport grows to desktop.
  - Tap targets are `min-h-[44px]` to `[52px]`.
- **Scroll lock:** `src/lib/use-body-scroll-lock.ts` sets `overflow:hidden` and pads by the scrollbar width.
- **Safe areas:** handled on the fixed bottom elements, not the menu. Examples are `pb-[calc(0.625rem+env(safe-area-inset-bottom))]` and `bottom-[calc(5.5rem+env(safe-area-inset-bottom))]`. Header height is the token `--header-h` (64px, or 84px at ≥1024px), and `scroll-margin-top`/`scroll-padding-top` use `calc(var(--header-h) + 12–16px)`.

## 5. Assistant/chat widget

- **Files:** `src/components/GiuliaChat.tsx` (panel), `src/components/FloatingActions.tsx` (launcher and nudge), `src/components/GiuliaProvider.tsx` (context), `src/components/giulia/GiuliaConcierge.tsx` (scripted flow; a unit test enforces "no AI dependency"), and `src/components/GiuliaFullChat.tsx` (full-page version using `env(safe-area-inset-top/bottom)`).
- **Panel:**
  - It stays mounted. When closed it's `inert` and `aria-hidden`.
  - Open/close transition: 340 ms `ease-premium`, from `translate-x-2 translate-y-4 scale-[0.97] opacity-0` to none, with `origin-bottom-right`. Under `motion-reduce` it falls back to opacity only.
  - Escape closes it. The body remounts on each open (`key={session}`), so nothing typed survives a close.
- **Layout:** it's a floating card everywhere, not a bottom sheet.
  - Mobile: `w-[calc(100vw-2rem)]`, at `bottom-[calc(9.5rem+env(safe-area-inset-bottom))]`, above the CTA bar and the floating buttons.
  - Desktop (`sm`/`md`): `w-[380px]` at `bottom-24`.
  - Height has two states and grows over 300 ms once the user engages:

```
compact: max-h-[min(430px,55dvh,calc(100dvh-9.5rem-var(--header-h)-1rem-env(safe-area-inset-bottom)))] md:max-h-[min(500px,…)]
deep:    max-h-[min(620px,calc(100dvh-9.5rem-var(--header-h)-1rem-env(safe-area-inset-bottom)))]
```

- **Launcher nudge:**
  - `[data-nudge]` triggers an avatar scale to 1.05 (1400 ms) and a gold ring fading out (1500 ms).
  - First slot at 8 s, then every 30 s, at most 2 per page load.
  - A slot is skipped if the chat is open, a dialog is open, the tab is hidden, the cookie choice is pending, the shared cooldown is running, or the launcher is hovered or focused.
  - Never runs under reduced motion.
- **Voice/speech:** none. There's no SpeechRecognition or speechSynthesis anywhere in `src`.

## 6. Fixed CTAs and how overlays avoid each other

The modal priority you asked about is a pure scheduler plus DOM-attribute signals. There's no event-bus library.

**Policy and timing:** `src/lib/giulia-session.ts`.
- Constants:
  - `AUTO_FORM_DELAY_MS` 5000 (first page) / `AUTO_FORM_LATER_DELAY_MS` 60000 (later pages).
  - `GIULIA_PAGE_DELAY_MS` 45000.
  - `PROACTIVE_COOLDOWN_MS` 40000.
  - `CONSENT_SETTLE_MS` 1200 and `GIULIA_SETTLE_MS` 1000.
- `autoOpenBlocker()` returns the first matching blocker, in priority order: submitted → used → once → excluded page → early → cooldown → consent → form popup → dialog → typing → hidden tab → at the form.
- `readPageState()` detects open dialogs with `[aria-modal="true"], header [aria-expanded="true"]` or `html[data-dialog-open]`.

**Timer:** `src/lib/popup-scheduler.ts`.
- One timer at a time, aimed at the next moment anything can change.
- Polls every 500 ms (`POLL_MS`) while something is in the way.
- An attempt that lands in the cooldown is dropped, not queued. Only a later scroll can retry it (`ACTIVITY_CHECK_MS` 550).
- Time and the DOM are injected, so it's unit-tested with fake timers (`tests/unit/popup-scheduler.test.ts`).

**Wiring:** `src/components/PopupCoordinator.tsx`.
- One scheduler per pathname, stopped on route change.
- `pageshow.persisted` (back/forward cache) counts as a fresh page entry.
- It listens for the `CONSENT_CHANGE_EVENT` window event (`src/lib/consent/config`, dispatched by `ConsentManager`).

**DOM signals between components:**
- `Dialog.tsx` keeps a reference count in `html[data-dialog-open]`. Elements marked `[data-hide-under-dialog]` (CTA bar, floating buttons) hide via CSS.
- The cookie notice hides while the chat is open: `html:has([data-testid="giulia-panel"][aria-hidden="false"]) [data-consent-notice]{visibility:hidden}`.
- `ConsentManager` sets the CSS variable `--consent-notice-h` with a ResizeObserver. The footer and full chat pad by it.
- `useFormFocusActive` (`src/lib/use-form-focus.ts`): focusing a field inside `[data-hide-floating]` slides the CTA bar away (`translate-y-full`) and fades the floating buttons (`inert`).

**Z-index ladder:**
- CTA bar and floating buttons: `z-40`.
- Cookie notice: `z-[42]`.
- Chat: `z-[45]`.
- Header: `z-50`.
- Dialogs: `z-[80]`.

**Mobile CTA bar:** `src/components/site/MobileCtaBar.tsx`, `md:hidden`, with safe-area bottom padding.

```css
html[data-dialog-open] [data-hide-under-dialog] { visibility:hidden; opacity:0; pointer-events:none; }
```

## 7. Rails, FAQ accordion and count-up

**Rails:** `src/components/ui/SnapRow.tsx`, `src/lib/carousel/useSnapCarousel.ts` and `useAutoAdvance.ts`.
- Native scroll-snap: `flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none]`, slides are `snap-start`.
- Inert `aria-hidden` clones make it loop.
- Arrow keys move between slides, and a visible pause button covers WCAG 2.2.2.
- Auto-advance (`HOME_CAROUSEL_INTERVAL_MS` = 1000) runs only when all of these hold:
  - ≥35% of the row is in view (`PLAY_RATIO`).
  - The tab is visible and reduced motion is off.
  - No mouse hover, no keyboard focus inside, no touch.
  - At least 4 s since the last interaction (`CAROUSEL_RESUME_MS`).
  - `isMotionHeld()` is false (no dialog open, no element with `[data-motion-hold]`).
- Under reduced motion, scrolling uses `behavior:"instant"`.

**FAQ:** `src/components/site/FaqAccordion.tsx`.
- Buttons carry `aria-expanded`/`aria-controls`; panels are labelled regions. Only one item is open at a time.
- Height uses the grid-rows trick, 300 ms. Content fades and moves over 500 ms. A 3px gold left accent marks the open item.

```tsx
className={`grid transition-[grid-template-rows,visibility] duration-300 ease-premium motion-reduce:transition-none
  ${isOpen ? "visible grid-rows-[1fr]" : "invisible grid-rows-[0fr]"}`}
```

**Count-up:** `src/components/ui/CountUp.tsx`.
- Server and first render show the final value; screen readers always get the final value.
- Before first paint, a layout effect locks `minWidth` to the final width and resets the digits to the start value. Years start from target − 18.
- Observer threshold 0.6. Runs once at 1600 ms with easeOutCubic (`1-(1-k)^3`) via rAF.
- Skipped under reduced motion or without IntersectionObserver.

## 8. Overflow protection, responsive guards and tests

- **Gutter tokens** (`globals.css` lines 104–117):
  - `--gutter`: 1.25rem → 1.5rem at ≥640px → 2.5rem at ≥1024px.
  - `.container-page { padding-inline: var(--gutter); max-width: calc(77.5rem + 2*var(--gutter)) }` (1240px content).
  - `.container-reading`: 50rem.
  - Headings use `text-wrap: balance`; paragraphs use `pretty`.
- **Viewport-bounded fixed UI:** `100dvh`, `calc(100vw-2rem)`, and `min(...)` clamps that subtract `--header-h` and the safe-area insets.
- **Playwright:** `playwright.config.ts` has desktop 1440×900 and Pixel 7 390×844 projects, plus an optional iPhone 13 WebKit project (`PW_WEBKIT`). `tests/e2e/site.spec.ts` checks:
  - `document.documentElement.scrollWidth <= innerWidth` across many viewports.
  - "No buttons or links are cut off at 320px" (line 1084): scrolls each page, then flags any `main`/`footer` link or button outside the viewport unless an ancestor scrolls horizontally (`overflowX:auto`).
  - Thread overflow: `scrollWidth - clientWidth <= 1`.
  - Popup fits the mobile viewport, including the submit button.
  - Cookie notice clears the WhatsApp and Giulia buttons and the CTA bar.
  - Reduced motion is tested with `emulateMedia({reducedMotion:"reduce"})` or a new context with `reducedMotion:"reduce"`.

## 9. Reduced-motion handling

- **CSS** (`globals.css` lines 534–548): one `@media (prefers-reduced-motion: reduce)` block turns off every keyframe class.
  - The curtain is forced to `scaleY(0)`.
  - `.reveal` is forced visible.
  - Images get a 250 ms opacity fade only, with `transform` and `clip-path` set to none.
- **Other CSS:** smooth scrolling is enabled only under `no-preference`, and `.img-zoom` hover runs only under `(hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)`.
- **JS:** `src/lib/carousel/useReducedMotion.ts` uses `useSyncExternalStore` with a server snapshot of `false`. Carousels, nudges, count-up and parallax all check it (or `matchMedia` directly).
- **Tailwind:** `motion-reduce:` utilities on the chat panel and FAQ.

## 10. Section rhythm

- **Spacing:** `.section { padding-block: clamp(3.5rem, 2.25rem + 4.2vw, 7.5rem) }` (56 → 120px). `.section-tight`: `clamp(3rem, 2rem + 3vw, 5.5rem)`.
- **Backgrounds** alternate between white and warm tints: `bg-white`, `bg-surface` (pearl `#f7f5ef`), `bg-ivory` (`#fbf8f2`), `bg-sage` (`#f1f5f0`). A few dark sections (`bg-navy-900 #132a32`; footer `navy-950`) ground the page.
- **Shared component:** `src/components/site/RevealSection.tsx` takes `bg: "white" | "surface"`, so consecutive sections can alternate.
- **Contrast notes:** documented in the token header comment (`globals.css` lines 5–28).