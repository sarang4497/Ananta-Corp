# Ananta V2 — Current Site Audit (pre-rebuild, 2026-11-03)

Basis: repo `b54e626` (= live https://ananta-corp.vercel.app), full technical map in
`ANANTA_V2_TECH_MAP.md`, baseline tests: typecheck ✔, 134 unit ✔, build ✔ (40 static pages), Playwright 313 passed /
225 skipped (desktop+mobile projects; responsive matrix 20 routes × 11 widths).

Verdicts: **KEEP** (works, leave alone) · **IMPROVE** (keep the system, restyle/extend) · **REBUILD** (same data/contract,
new UI) · **REMOVE**.

| Area | Current state | Problem observed | Verdict |
|---|---|---|---|
| Header (desktop) | Navy utility bar + 64px sticky white bar, ≥1080px | Compressed "startup" bar; no search; logo small; only Products/Brands/Capabilities | **REBUILD** UI on the existing open/close/keyboard logic (140ms hover-intent, Escape, route-close are good) |
| Mega navigation | Products panel w/ category list + live preview, brands panel, capabilities | Good mechanism; thin content — no applications, resources or tools menu, no photo-led layout | **IMPROVE** (extend to Products / Brands / Applications / Tools / Resources) |
| Mobile navigation | Full-height sheet, accordions, scroll-lock, focus, Escape, call/WA pinned | Works; visual weight and gutter alignment weak | **IMPROVE** |
| Search | Only inside `/products` (CatalogBrowser) | No site-wide search at all | **REBUILD → new** site search over shared index |
| Hero | Image + headline + CTA + brand logos, CSS rise/wipe | Fixed `h-14` + nowrap link (Hero:115–118) risks clipping; motion is basic | **REBUILD** with Santa mask/stagger/curtain |
| Product universe | RangeIndex with computed counts + CountUp | Good truth; presentation light | **IMPROVE** |
| Product cards (ProductTile) | Image, brand, name, truncate | `truncate` on names (ProductTile:58); no USPs, no compare, no get-price | **REBUILD** card on same props |
| USPs | None — attributes buried in spec rows | Under-presented product depth | **NEW** derived `usps.ts` from verified specs/standards/exposure |
| Product detail pages | Gallery, specs, sizes (EnquiryBox), FAQ, related | Paragraph-heavy; no visual spec blocks, no compare, no related guide | **REBUILD** layout, **KEEP** data + JSON-LD |
| Filters (CatalogBrowser) | Search + 4 facets w/ live counts, URL-synced | Strong | **KEEP + RESTYLE** |
| Material selector | SELECTOR data → zones → picks, WhatsApp | Strong logic, only on homepage | **KEEP + EXTEND** (own /tools page, homepage demo) |
| Comparison | `compare()` only rows both have, ≥4 overlap | Strong truth logic; two selects only; not shareable; no compare from cards | **KEEP + EXTEND** (URL-shareable, card entry points) |
| Finish wall / Décor library | 156 décors, type filter, search, WA per décor | Duplicate `1141` code (count + React key bug); no shortlist/enlarge | **IMPROVE** (fix dup, add shortlist/enlarge) |
| Brands | Logos, relation (authorised vs supplied) | Good claim-safe | **KEEP + RESTYLE** with computed counts |
| Trust / Why Ananta | Operations steps, facility, GSTIN in footer | Generic grid feel | **IMPROVE** with real proof only |
| Testimonials | 6 verbatim | Good | **KEEP**, restyle (hero quote + rail, no stars) |
| About / Contact / Partners | Sourced facts | Plain layout; contact form ignores product context | **IMPROVE**; contact gets quote-context prefill |
| Assistant | Deterministic `respond()` + chips, lazy panel | Good; no voice, no blog/tools/application intents | **KEEP + EXTEND** (voice in, optional speech out, new intents) |
| WhatsApp | `WA.*` presets + `[data-wa-context]` dock prefill | Good contextual flow | **KEEP**, unify via `lib/quote.ts` |
| Forms / leads | Resend if `RESEND_API_KEY`, honest success copy | Truthful | **KEEP** (re-check env at deploy) |
| Contact dock | Phone bottom bar + desktop rail, hides on overlap | Strong collision logic | **KEEP + IMPROVE** (bottom utility: Products/Search/WhatsApp/Ask) |
| Footer | Columns, GSTIN | Thin IA | **IMPROVE** (Products/Brands/Applications/Resources/Company/Contact/Legal) |
| Blogs / resources | None | Hard requirement unmet | **NEW** /blog + 8–12 posts |
| Tools hub | `/#selector`, `/#compare` anchors only | Tools hidden | **NEW** /tools + /tools/[tool] |
| Mobile gutters | Shared `--gutter: clamp(16px,4vw,40px)` via `.shell` (42 uses) | System exists; components drift on internal padding; `--side` 76px tablet reserve | **KEEP token system**, enforce `.shell` everywhere |
| Text clipping | 10 `whitespace-nowrap`, 6 `truncate`, several hard heights | Hero:118, MaterialLibrary:153, AudiencePaths:48 high-risk | **FIX** — release-blocking |
| Overflow guard | `findMeaningfulOverflow` (5 checks) × 20 routes × 11 widths | Strong | **KEEP + EXTEND** to new routes + open overlays |
| Motion | RevealObserver (`html.js` gate), Parallax, CountUp, reduced-motion block | Sound infra, modest choreography | **KEEP infra, EXTEND** with Santa mask/curtain/line/rv-frame |
| SEO | canonical/alternates helper, Org+LocalBusiness, Product, Breadcrumb JSON-LD, sitemap | Good | **KEEP**, add Article/FAQ JSON-LD |
| Claims | `claims.test.ts` BANNED list + attribution tests | Strong | **KEEP** (blocks every new surface) |
| Performance | WebP, next/image, lazy chat panel | Good | **KEEP**; lazy-load search + mega imagery |

Release blockers carried into V2: no site search, no blog, no voice, compressed header, clipping risks above, décor
duplicate.
