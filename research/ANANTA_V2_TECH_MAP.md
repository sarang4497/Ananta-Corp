# Ananta Corporation V2 technical map (branch `revamp/v2-century-santa`, read-only audit)

Overall the existing tech is solid and worth keeping. The data layer is typed and every value has a source. Site counts are computed, never typed in. A unit test blocks banned claims. The assistant is deterministic and makes no network calls. The contact dock moves out of the way when it would cover content. The lead form only shows success after the server confirms. The motion system works without JavaScript and respects reduced motion, and there is an overflow test across 20 routes × 11 widths.

## 1. Data

### `src/data/products.ts` (651 lines)
Exact types (lines 16–90):
```ts
export type Brand = 'Duroply' | 'Action TESA' | 'Tenon Smart Lock';
export type CategorySlug = 'plywood' | 'mdf' | 'high-moisture-resistant-board-moist-master' | 'pre-laminated-particle-board' | 'flush-door' | 'smart-locks';
export type Exposure = 'dry' | 'humid' | 'wet';
export type Application = 'kitchens' | 'wardrobes' | 'furniture' | 'wet-zones' | 'panelling' | 'commercial' | 'doors';
export type Category = { slug: CategorySlug; key: string; image: string; subs: {slug: string; key: string}[] };
export type Standard = { label: string; by: 'Duroply' | 'Action TESA'; detail?: string };
export type Product = {
  slug: string; name: string; short: string; brand: Brand; category: CategorySlug; subcategory: string;
  summary: string; about: string; specs: [string, string][]; sizes: string[]; sizesLabel?: string; sizesNote?: string;
  standards: Standard[]; exposure?: Exposure; applications: Application[]; uses: string[]; notFor?: string;
  faqs: {q: string; a: string}[]; cardImage: string; images: string[]; decorCode?: string; specsOnRequest?: boolean;
};
```
- **Size:** 20 products, 6 categories, 9 subcategories (`CATEGORIES`, lines 92–136):
  - plywood: moisture-resistant, boiling-water-proof
  - mdf: interior-grade, exterior-grade, hdhmr
  - HMR: moist-master
  - prelam: boards
  - flush-door: door
  - smart-locks: locks
- **Products per category:** 2 plywood, 3 MDF, 1 HMR, 5 prelam (built by the `prelam()` factory, line 151), 1 flush door, 8 smart locks (built by `lock()`, line 187).
- **Products per brand:** Duroply 3, Action TESA 9, Tenon 8.
- **Spec fields:** there are no dedicated thickness, grade, standard or density fields. They sit as free-text label/value rows in `specs`. Labels used: `Grade`, `Bonding resin`, `Sheet size`, `Thickness range`, `Board`, `Construction`, `Finishes`, `Density`, `Surface`, `Treatment`, `Exposure`, `Décor`, `Standard sizes`, `Thickness`, `Brand`, `Type`, `Access`, `Display`, `Closing`.
  - Density is only on HDHMR and Moist Master.
  - Standards (all attributed): IS 303, IS 710, IS 2202, IS 12406, "German technology", density.
- **How full the data is:**
  - The 7 plywood/MDF/HMR/door products are rich: 3–5 spec rows and 2 FAQs each.
  - The 5 prelam products share 3 template spec rows, sizes 9/11/17/25 MM, 2–3 FAQs and `exposure:'dry'`.
  - The 8 locks have `sizes:[]`, `standards:[]`, `faqs:[]`, no `exposure` and `specsOnRequest:true`. Only `sliding-fingerprint-door-lock` (line 577) has real specs.
  - Flush door has no `exposure`.
  - `sizes` holds strings: `'9 MM'` for boards, `'30x80'`/`'Custom'` for the door.
  - There are no `usps` or `highlights` fields. The nearest equivalents are `uses`, `notFor` and `CATEGORY_COPY.key`.
- **Helpers** (lines 609–651): `categoryBySlug`, `productsByCategory`, `productsBySubcategory`, `productByPath`, `categoryHref`, `subcategoryHref`, `productHref`, `productPath`, `relatedProducts`.

### `src/data/decors.ts`
```ts
export type DecorType = 'solid' | 'woodgrain' | 'fabric' | 'stone' | 'texture';
export type Decor = {code: string; name: string; image: string; type: DecorType};
```
- 156 entries: woodgrain 81, solid 38, fabric 19, texture 12, stone 6. Grouping is by `type` only; there is no colour/hue field.
- **Defect:** code `1141 Night Grey` appears twice (lines 39–40, two different images). The site's "156 décors" count therefore includes a duplicate.

### `src/data/stats.ts`
- `STATS` = `{products, categories, brands, decors, sizeOptions}`, all computed from the data.
- Count helpers: `countByCategory`, `countByBrand`, `countByApplication`, `decorCountByType`. Also `BRANDS` and `thicknessesFor(slug)`.
- **Compare engine:** `FIELDS` extractors (Brand, Type, Exposure, Density, Bonding resin, Construction, Surface, Standard/property, Thickness options, Best for).
  - `COMPARABLE` = products that are not `specsOnRequest` and have at least 5 known fields.
  - `compare(a,b)` returns only rows both products have, and returns `null` if fewer than 4 overlap.

### `src/content/categories.ts`
- `CATEGORY_COPY: Record<CategorySlug, {name, short, what, bestFor, key, brands: Brand[], seoTitle, seoDescription}>`
- `SUB_NAMES: Record<string,string>`

### `src/content/site.ts` (every line tagged with its source)
- **`COMPANY`** (lines 15–33):
  - Address: 293/2, Godown No. 17, Nanukaka Estate, Opp. Sub Station, Pirana Road, Piplaj, Ahmedabad, Gujarat **382405**. Note: 382425 is a known conflict that still needs owner confirmation.
  - Phone `+91 83200 52838` / `tel:+918320052838`, email `info@anantacorporation.com`, GSTIN `24ACDFA7104Q1ZB`, `since:'2020'`, `facility:'11,000 sq. ft.'`, Instagram, Facebook, `mapsQuery`.
  - The WhatsApp number is not here; it is in `src/lib/whatsapp.ts` (`918320052838`).
- **`BRAND_ASSETS`** (36–64): logo, w/h, slug, `relation`, `supplies`. Duroply and TESA are "Authorized distributor"; Tenon is "Supplied range".
- **Other exports:** `HERO`, `APPLICATIONS` (7), `EXPOSURE_LABEL`, `AUDIENCES` (4).
- **`SELECTOR`** (135–255): 5 applications (kitchen, wardrobe, bathroom, office, doors) → 2–3 zones each `{exposure, picks: slug[], why}`.
- **`TESTIMONIALS`**: 6 quotes, verbatim `{quote, name, role}`.
- **`OPERATIONS`** (4 steps), `CUSTOM_FLOW`, and `WA` preset messages (`default`, `custom`, `product(name)`, `category(name)`, `decor(code,name)`, `project`).

## 2. Claim-safety architecture
- **Where claims live:** company claims in `src/content/site.ts`. Product claims only in `products.ts` `standards[]`, always naming the manufacturer.
- **Registers:** `research/ANANTA_CONTENT_TRUTH.md` (each claim with its source) and `research/ANANTA_FINAL_CLAIM_AUDIT.md` (statuses: VERIFIED_FIRST_PARTY, VERIFIED_MANUFACTURER, OWNER_CLAIM, REMOVED, OMITTED_PENDING_CONFIRMATION).
- **What `tests/unit/claims.test.ts` scans:** `src/app`, `src/components`, `src/content`, `src/data`, `src/lib` and `messages/en.json`, with comments stripped first.
- **`BANNED` patterns (lines 21–36):**
  - `decades of experience`
  - `15+? years`
  - `founded in 2024`
  - `CARB`
  - `\bE1\b|\bE2\b`
  - `10[- ]year warranty`
  - `100% (boiling )?water ?proof|100% BWP`
  - `weather[- ]resistant`
  - `melamine-fortified`
  - `certified materials`
  - `same[- ]day|within 24 hours`
  - Superlatives: `best in india`, `world-class`, `unmatched`, `game-changing`, `revolutionary`, `industry leader`, `leading supplier`, `largest stock`
  - `exclusive distributor|official (gujarat )?distributor`
  - `aggregateRating|ratingValue`
- **Other checks in the same file:** "german technology" may appear only in `products.ts` (lines 51–58); Tenon's `relation` must not match `/authori/` (lines 60–64).
- **Stale code:** the test still special-cases `src/content/knowledge` (line 44), but that directory no longer exists.
- **`tests/unit/data.test.ts` also checks:** counts are computed, slugs are unique, every image exists, standard attributions match the brand, locks have no specs, the HDHMR warranty image is not used, selector picks exist, the 6 original testimonials, and a single postal code.

## 3. Components (`src/components/**`, 37 files)

**site/**
- **Header.tsx (289 lines)** — used in layout.
  - Desktop only (≥1080px, the `nav:` breakpoint): a navy utility bar with phone and email, then a sticky 64px bar.
  - Three panels: **Products mega menu** (300px category list with counts, a live preview of image, brands, what, best-for and sub/product chips, and a Tools column linking Décor library, `/#selector`, `/#compare`), **Brands** (3 logo cards), **Capabilities** (4 items, exported as `CAPABILITIES`).
  - Opens on hover after 140ms, on click, or by keyboard. Escape returns focus. Closes on route change.
  - **There is no search.** CTAs: phone icon and "Request price" WhatsApp button.
- **MobileMenu.tsx (185)** — rendered inside Header.
  - Full-height sheet for screens under 1080px. Accordion sections: products (thumbnails + counts), brands, capabilities.
  - Call and WhatsApp pinned at the bottom. Scroll lock, focus handling, Escape. Sets `html[data-menu-open]`.
- **ContactDock.tsx (173)** — layout. The only fixed contact UI on the site.
  - Phones under 768px: a 60px bottom bar (WhatsApp price, Call, Ask assistant), safe-area aware.
  - 768px and up: a vertical icon rail in the reserved `--side` gutter.
  - Hides (and becomes inert) when it overlaps any `[data-dock-hide]` element, while the user is typing, or when the menu or chat is open.
  - Reads the WhatsApp prefill from the page's `[data-wa-context]`. Opens chat by dispatching the `open-bella` event.
- **Footer.tsx** — layout; marks itself `data-dock-hide`.
- **Logo.tsx** `{className, variant}`.
- **BrandLogo.tsx** `{brand, height, onDark, className}` — used by Header, Hero, BrandsBand, ProductTile, CategoryView, and the about, partners and product pages.

**chat/**
- **ChatWidget.tsx** — layout. Listens for `open-bella` (optional `detail.message`), lazy-loads the panel (`dynamic(..., {ssr:false})`), keeps it mounted after first open, and sets `html[data-chat-open]`.
- **ChatOverlay.tsx** `{open, onClose, children}` — the overlay container.
- **ChatPanel.tsx** `{onClose, initialMessage}` — the conversation UI. Fully deterministic: calls `respond()` locally.
- **ChatMarkdown.tsx** `{text}` and **BellaAvatar.tsx** `{size, className}`.
- **`src/lib/assistant/guide.ts`:**
  - Types: `Action {label, kind:'ask'|'link'|'external', value}` and `Reply {intent, text, actions}`.
  - Matching: `normalise()` plus Levenshtein fuzzy matching (exact match required for words under 5 characters).
  - Detection via alias tables for products, categories and brands.
  - `respond()` checks intents in order: gstin, hours, address, email, whatsapp, phone, standards, price, stock, delivery, custom, decor-code (any 4-digit token), decor, compare (uses `compare()`), selector, sizes, range, brands, greeting, thanks, fallback.
  - Exports `MENU`/`GUIDE_CHIPS`.

**home2/** (all used on the homepage `/`)
- Homepage section order: Hero, RangeIndex, MaterialLibrary, FinishWall, BrandsBand, AudiencePaths, [MaterialSelector + CompareTool], Operations, CustomFurniture, Voices.
- Hero (uses Parallax); RangeIndex (CountUp stats).
- MaterialLibrary: category filter rail plus ProductTile grid.
- **FinishWall:** two marquee rows of décor swatches (every 4th item, offsets 0 and 2), family counts, link to `/decor`.
- BrandsBand; AudiencePaths (4 audience tabs).
- **MaterialSelector:** `SELECTOR` app → zone `aria-pressed` buttons, exposure meter, ProductTiles, WhatsApp.
- **CompareTool:** two `<select>`s over `COMPARABLE` (defaults MR vs BWP); renders `compare()` rows or a "not comparable" message.
- Operations and `CustomFurniture` (also on /about); `Voices {exclude}` (also on /about).

**catalog2/**
- **CatalogBrowser** — `/products`.
  - Search over name, brand, summary, uses and decorCode.
  - Toggle filters: category, brand, app, exposure, with counts that update for each facet.
  - Filters sync to the URL with `?q&category&brand&app&exposure` via `replaceState`.
  - On phones the secondary filters sit in a `<details>`; on large screens the sidebar is sticky.
- **CategoryView** `{cat, sub?, products, crumbs}` — category and subcategory pages (sub chips, SpecMatrix, FaqList).
- **SpecMatrix** `{products}`.
- **DecorLibrary** — `/decor`. Search by name or code, filter by type with counts, `?type=`/`?q=` deep links, WhatsApp per décor.
- **ProductTile** `{product, size?:'sm'|'md', priority?, className?}`.
- **Gallery** `{images, name}`; **EnquiryBox** `{name, sizes, sizesLabel, sizesNote}` (size picker feeds the WhatsApp message); **FaqList** `{items}`; **Breadcrumbs** `{items: Crumb[]}`; **PageIntro** `{crumbs, eyebrow, title, lead, aside, children}`.

**Other**
- **contact/ContactLeadForm** — `/contact`.
- **PolicyPage** `{eyebrow, title, updated, sections}` — privacy and terms.
- **ui/Button.tsx** — exports `buttonClassName`, `Button` and `WhatsAppIcon`. `<Button>` itself is never rendered; only `buttonClassName` (ChatPanel) and `WhatsAppIcon` (15 files) are used.
- **motion/** — see section 6.

## 4. Routes, redirects, SEO
- **Routes:** all under `src/app/[locale]/`: `/`, `/products`, `/products/[category]`, `/products/[category]/[sub]`, `/products/[category]/[sub]/[slug]`, `/decor`, `/about`, `/partners`, `/contact`, `/privacy`, `/terms`, plus a not-found page. API: `src/app/api/lead/route.ts`.
- **i18n** (`src/i18n/routing.ts`): `en` only, `localePrefix:'as-needed'`, typed `pathnames`.
- **`src/proxy.ts`:** next-intl middleware; matcher excludes `api`, `_next`, `_vercel` and any path containing a dot.
- **Redirects** (`next.config.ts:15–23`, all permanent):
  - `/about-us` → `/about`
  - `/categories` → `/products`
  - `/privacy-policy` → `/privacy`
  - `/term-of-use` → `/terms`
  - `/products/doors` → `/products/flush-door`
- **Images config:** WebP only, custom `imageSizes`.
- **Sitemap and robots:** `src/app/sitemap.ts` lists the 8 static pages plus all categories, subcategories and products, with hreflang. `robots.ts`. Site URL is set in `src/config.ts`: `https://www.anantacorporation.com`.
- **Metadata:** `src/lib/metadata.ts` `buildAlternates(href, locale)` sets canonical, languages and x-default. Every page uses it.
- **JSON-LD** (`src/lib/jsonld.ts`):
  - `organizationJsonLd()` (Organization + LocalBusiness, GSTIN as `vatID`, no hours or ratings) is injected in the layout head.
  - `productJsonLd(p,url)` (no offers) and `breadcrumbJsonLd(items)` are used on product pages (lines 63–64).
- Every dynamic route has `generateStaticParams` and calls `notFound()` for unknown values.

## 5. Lead pipeline
- **Email really is sent**, via the Resend REST API (raw `fetch`, no SDK; `lead.ts:115–133`), but only if `RESEND_API_KEY` is set.
- **Environment variables:** `RESEND_API_KEY`, `LEAD_NOTIFY_TO` (comma-separated; default `info@anantacorporation.com`), `LEAD_EMAIL_FROM` or `RESEND_FROM` (default `onboarding@resend.dev`, which only delivers to the Resend account owner). Documented in `.env.example`.
- **Flow** (`route.ts`):
  1. Validate. The `website` honeypot field returns a quiet `{ok:true,id:'ignored'}`.
  2. Always log `[lead:received]` with the full lead.
  3. Attempt the email, then log `[lead:email-sent | -not-configured | -failed]`.
  4. Respond `{ok, id, email: 'sent'|'not-configured'|'failed'}`.
- **Storage:** none. The Vercel logs are the only record.
- **`LeadInput` fields:** name, phone, email (all three required; phone needs at least 8 digits), company, product, size, category, quantity, city, message, source, page, website.
- **Form UI:** `ContactLeadForm.tsx:95` says "sent to the team" only when `email==='sent'`, otherwise "Enquiry received".
- **EnquiryBox** on product pages is WhatsApp plus a call link; it does not post to the API.
- **WhatsApp builder** (`src/lib/whatsapp.ts`): `whatsappUrl(message: string = WHATSAPP_MESSAGE): string` → `https://wa.me/918320052838?text=…`. Messages come from `WA.*` in `site.ts`.

## 6. Motion infrastructure
- **`RevealObserver`** (layout): one IntersectionObserver for every `[data-reveal]` element (`up`, `fade`, `mask`, `line`; stagger with `--d`).
  - Reveals elements already on screen immediately, sweeps on scroll, rescans when the DOM changes, and reveals everything before print.
  - Under reduced motion it reveals everything at once.
- **Hidden start states only apply under `html.js`**, which an inline head script sets (`layout.tsx:49,59`). Without JavaScript, all content is visible.
- **`Parallax {children, depth=24}`** and **`CountUp {value}`** are both switched off under reduced motion.
- **`globals.css` (453 lines):**
  - `@theme` colours: bg `#fff`, bg-soft `#f5f6f8`, bg-warm `#f3f1ec`, surface-blue `#eef2fb`, indigo `#1e40af`, blue `#1d4ed8`, navy `#0b1a3c`, navy-2 `#12255a`, orange `#f97316` (light `#fb923c`, deep `#ea580c`, ink `#c2410c`), ink `#121a2f`, muted `#566176`, steel `#8a93a6`, line/border rgba, wa `#1fa855`.
  - Other `@theme` tokens: radius xs–lg (3/5/8/12px), shadows card/lift/glow, `--breakpoint-nav:1080px`.
  - `:root` layout tokens: `--gutter: clamp(16px,4vw,40px)`, `--side` (at least 76px from 768px up, to reserve the dock rail), `--container:1360px`, `--header-h:64px`, `--dock-h` (60px + safe area on phones).
  - Motion tokens: `--mo-ease`, `--mo-fast 160ms`, `--mo-reveal 640ms`, `--mo-image 1000ms`.
  - Utility classes: `.shell` and `.shell-wide` (1600px), `@utility rail` (snap scroller), `.t-display/.t-h2/.t-h3/.t-lead/.t-label`, `.bg-grid(-dark)`, `.pb-dock`, `.tile-lift`, `.tile-zoom`, `.arrow-nudge`.
  - Keyframes: `hero-rise`, `hero-wipe`, `hero-drift`, `chat-pulse`, `chat-wave`, `chat-rise`, `marquee-x` (90s, pauses on hover/focus).
  - Reduced-motion block (lines 425–453) forces everything visible and sets durations to 0.001ms globally.

## 7. Tests and scripts
- **`playwright.config.ts`:** projects desktop 1440×900 and mobile Pixel 7 390×844. The webServer runs `npm run build && npx next start -p 3300` (240s timeout, reuses an existing server); `PW_BASE_URL` skips it.
- **e2e specs:**
  - `site.spec`: every route returns 200 with one h1, title, canonical and description; 404 page; redirects; JSON-LD has no ratings or offers; hero logos; content visible with reduced motion and without JS; fast-scroll reveals.
  - `nav.spec`: mega-menu hover, preview, keyboard and Escape; brand logos; mobile sheet.
  - `dock.spec`: dock visible, hides at the footer, the enquiry box and while typing, never overlaps on desktop, hides when the assistant opens.
  - `conversion.spec`: WhatsApp context and size; form success only after the API answers ok; honest "received" copy; failure and required-field cases; selector; compare. The API is mocked.
  - `assistant.spec`: zero API calls; fallback; `/api/chat` must return 404.
  - `responsive.spec`: `ROUTES` (20, in `routes.ts`) × `WIDTHS` (320, 360, 375, 390, 393, 414, 430, 768, 1024, 1280, 1440), desktop project only.
- **`overflow-guard.ts`:** `findMeaningfulOverflow(page)` checks five things:
  1. Document scroll width is not wider than the viewport.
  2. No element sits outside the viewport after its clipping ancestors.
  3. No text is cut by an overflow-hidden or clip ancestor.
  4. No line-clamp truncates text.
  5. No fixed-height box clips its own text.

  It skips aria-hidden, inert, sr-only, real scrollers and `[data-overflow-ok]`. Related helpers: `assertNoMeaningfulOverflow` and `revealWholePage`.
- **Unit tests (vitest):** `claims`, `data`, `assistant` (pure function, no fetch, no AI code left), `lead` (validation, email body, not-configured, failure, route).
- **Scripts:**
  - `screens.mjs` (`npm run screens`): full-page screenshots for given BASE, WIDTHS and ROUTES.
  - `shot.mjs`: viewport screenshot.
  - `probe.mjs`: evaluate JS at a URL and width.
  - `find-overflow.mjs`: quick 390px overflow scan.
  - `contact-sheet.mjs` and `tall-sheet.mjs`: QA image sheets.
  - `weight.mjs`: transfer size per resource type.

## 8. Defects and risks
- **Page gutters are consistent.** `shell` is used 42 times and `shell-wide` once. Edge-to-edge rails use `-mx-[var(--side)] px-[var(--side)]` the same way in CatalogBrowser:65, DecorLibrary:58, MaterialLibrary:104 and 125, Voices:45, the product page at line 211, and partners:82.
- **`px-*` counts in components and app:** px-3 21, px-4 15, px-3.5 10, px-2.5 9, px-5 8, px-2 3, px-6 2, px-1.5 2, lg:px-0 5, sm:px-0 3, sm:px-5, sm:px-4 and lg:px-4 once each. These are all internal padding on controls and chips, not page gutters.
  - Button padding drifts: `Button.tsx:24–25` uses `md px-5` / `lg px-6`, but roughly 8 CTAs repeat their own button classes instead (Footer:43/49, Operations:104, about:140, not-found:22, EnquiryBox:51/55, ContactLeadForm:174), and `<Button>` itself is never rendered.
- **`whitespace-nowrap` (10):**
  - Lower risk: Button.tsx:17 (every button), CatalogBrowser:79, CategoryView:84, DecorLibrary:68 (these three are chips in rails), Logo:17, ContactDock:154 and 166 (tooltips).
  - Higher risk: **Hero.tsx:118** (inside a fixed `h-14` link at line 115), **MaterialLibrary:153**, **AudiencePaths:48**.
- **`truncate` (6):** ProductTile:58, ChatPanel:77–78, Header:101 (utility bar), FinishWall:73 (décor names), products/page.tsx:43 (category short names). **No `line-clamp` anywhere.**
- **Fixed heights:** most are `min-h-*`. Hard heights: Header `h-16`/`h-8`, ContactDock `h-[60px]`, Hero:115 `h-14`, BrandsBand:37 `h-16`, partners:54 `h-24`, Gallery `h-16`/`h-20` (thumbnails), ContactLeadForm `h-28`, Operations `h-[31px]`.
- **`overflow-hidden`** appears 29 times across 16 files: Hero 4, Operations 4, CategoryView 3, FinishWall 3, about 3, and others. Mostly on image frames.
- **Data issues:**
  - Duplicate décor `1141` makes the 156 count 1 too high, and gives a **duplicate React key** at `DecorLibrary.tsx:86` (`key={d.code}`).
  - The spec rows and size lists disagree. MR's spec says "4–25 mm" but its sizes are 6–18 mm. HDHMR's spec rows have no thickness while its sizes list does.
  - Flush door and locks have no `exposure`, so the exposure filter silently leaves them out.
- **Lead storage:** there is none apart from logs. If Resend is not configured, the console log is the only copy of the lead.
- **Pending owner confirmations:** postal code 382405 vs 382425; CNC capability; opening hours; flush-door core construction.
- **Dead code:** the `src/content/knowledge` special case in claims.test.ts:44,54 and the unused `Button` component.