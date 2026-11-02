# Ananta Corporation — Redesign Decisions

**Direction:** "Architectural material intelligence," not an online plywood shop. The catalogue itself carries
the proof of range, shown through real products, real counts, real brand logos and real décors. There are no
unsupported claims.

## 1. Visual system
- **Palette (an evolution of the existing brand, not a rebrand).**
  - PRIMARY BLUE: `#1E40AF`, the existing token, with a brighter interactive step `#1D4ED8`.
  - DEEP NAVY: `#0B1A3C`, used for the brands band, the footer and the utility bar.
  - SOFT BLUE SURFACE: `#EEF2FB`.
  - WHITE.
  - WARM OFF-WHITE: `#F3F1EC`, for the tools band.
  - Cool neutral: `#F5F6F8`.
  - ORANGE: `#F97316` / `#EA580C`, with `#C2410C` for orange text so it meets contrast (AA).
  - GRAPHITE ink: `#121A2F`. MUTED STEEL: `#566176`.
  - Orange is limited to the primary price CTA, small labels, indicator lines and the selected state.
- **Form:** 3–12 px radii instead of 16–24 px pills; hairline borders instead of shadow stacks; a technical
  hairline grid behind product staging; mono technical labels.
- **Section rhythm:** split hero → hairline index row → soft-grey library → white full-bleed swatch wall → navy
  brands band → white editorial tabs → warm technical tools band → image-led operations → soft-blue custom
  furniture block → editorial quote → navy footer. No two adjacent sections share an architecture.

## 2. Typography
- One family: **Geist** (already shipped) plus **Geist Mono** for technical labels. Inter was dropped, so the site
  loads one font fewer.
- `clamp()` scale: display 2.1 → 4 rem (three lines on a phone), H2 1.6 → 2.75 rem, body 15–18 px, mono labels
  11.5 px.

## 3. Homepage architecture
1. **Hero:** proof eyebrow (Ahmedabad · Since 2020), specifier headline, brand and range sub-line, CTA pair
   (Explore products = primary, WhatsApp = secondary and hidden on phones because the contact bar covers it).
   "Authorized distributor" sits next to the **official Duroply and Action TESA logos**. On the right is the warm
   wood interior (Ananta's own render), with layered plates: real décor swatches and an HDHMR card showing its
   density > 850 kg/m³ (attributed). Below it, a 6-category index.
2. **Range index:** products, categories, décors and brands, all computed from the data, plus 11,000 sq. ft. and
   2020 (A1). All count up.
3. **Material library:** three ways in (category, brand, application), with real counts. Desktop has a sticky
   navigator and a 4-column matrix; phones have a chip rail and a swipeable tile rail.
4. **Finish wall:** two slow, opposite-direction rows of real swatches with codes, and family counts linking into
   `/decor`.
5. **Brands (navy):** logos on white plates, the relationship as stated (Tenon = "Supplied range"), computed
   product counts and category links.
6. **Who sources here:** tabs for interior designers, furniture manufacturers, architects & specifiers, and
   contractors & project teams, each mapped to real categories.
7. **Tools:** the Material Selector and the Compare tool.
8. **Ready stock + Why Ananta:** the facility figure, a collage of material renders (there are no warehouse photos,
   so none were invented), a stock → selection → custom sizes → dispatch line that draws in, and three A1
   differentiators as rows.
9. **Custom furniture:** the 5-step made-to-drawing flow, with the customer's own CNC testimonial.
10. **Customer voices:** one large quote plus a rail; verbatim, initials only.
11. **Footer:** a conversion row ("Send your material list") and a restrained navy footer.

## 4. Product discovery
- `/products` is a filterable library: search, plus Category / Brand / Application / Exposure filters. Each
  filter shows live counts and is backed by data, and the filters sync to the URL so a filtered view can be
  shared.
- Category pages answer WHAT IT IS / BEST FOR / KEY POINT / RANGE. They add a grade sub-nav, compact tiles, a
  **spec matrix for specifiers** (verified values only) and first-party FAQs.
- Product tiles show a staged image (cut-outs on a technical grid, materials full-bleed), the **real brand logo**,
  the verified type, one line, and a WhatsApp price action. A phone shows about 4 tiles per screen.
- Product pages: breadcrumb; gallery (manufacturer imagery is captioned); logo; H1; summary; exposure and standard
  chips; **a size selector that writes the chosen size into the WhatsApp message**; the spec table; standards "as
  stated by {manufacturer}"; used-for / not-for; about; FAQ; a brand link; related products; Product and
  BreadcrumbList JSON-LD (no offers or ratings).

## 5. Interactive tools (deterministic, no AI)
- **Material Selector:** application → zone → exposure meter → recommended products → a WhatsApp message prefilled
  with the selection. Every mapping comes from Ananta's own FAQ and product copy (`src/content/site.ts`).
- **Compare:** rows appear only when both products have a stored value. If fewer than 4 rows overlap, the pair is
  declared not comparable. Smart locks are never offered, because they have no published specs.
- **Audience paths and the library facets** use the same data.

## 6. Motion system
- A single `RevealObserver` drives every `[data-reveal]` (up / fade / mask / line). Content is visible by default.
  The hidden start state only exists under `html.js`, which an inline head script sets, so there is no hidden
  content without JS. Reduced motion shows everything with no animation.
- Hero choreography is pure CSS: a staggered text rise, a navy wipe that uncovers the image (the image is painted
  immediately, which keeps LCP safe), drifting material plates, and a gentle rAF parallax.
- The count-up is server-rendered with the final value. Width is reserved, so there is no layout shift. It only
  runs on verified or computed numbers.
- Other details: the process line draws in, tiles lift on hover, buttons scale slightly on press, and the swatch
  wall pauses on hover or focus.
- Removed: Lenis smooth scroll, the ambient animated gradient mesh, the infinite button sheen and `motion` (about
  60 KB of JS).

## 7. Navigation
- Desktop: a sticky header with a utility bar (A1 announcement lines, phone, email).
  - **Products** mega menu: category list with counts, a live preview (image, what, best for, grades), and tools
    links.
  - **Brands** panel: logos, relationship and counts.
  - **Capabilities** panel: material supply, ready stock, custom furniture, project support, each with a real
    anchor.
  - Panels open on 140 ms hover intent and close after 180 ms; they also open by click or keyboard, and Escape
    returns focus.
- Mobile: a full-height sheet with large rows, a category grid with thumbnails and counts, brands, capabilities,
  about, contact and the address. Call and WhatsApp are pinned to the bottom. Scroll is locked while it is open,
  and it closes on navigation.

## 8. Conversion system and floating controls
- Hierarchy: **Get price (orange, one per view)** → Explore (blue) → contextual WhatsApp (outline/text).
- **ContactDock** is the only floating control:
  - Phones: a bottom bar with "Price on WhatsApp", Call and Ask, safe-area aware.
  - ≥768: a vertical icon rail that sits inside a **reserved side gutter** (`--side` = max(gutter, 76 px)), so it
    can never cover content (an E2E test checks this at 1024, 1280 and 1440).
  - It steps aside over the footer, over in-page product CTAs and the contact form (`data-dock-hide`), while the
    visitor is typing, and while the menu or the assistant is open.
  - The WhatsApp text adapts to the page (`data-wa-context`: product, category or décor).
- The assistant keeps its function (AI answers from the corrected knowledge base, a 3-message cap, then a handoff
  to WhatsApp or contact). Its separate blue bubble was removed, and it now opens from the dock.

## 9. Mobile system
- 16 px gutter; clamped type; horizontal rails for the library, related products, testimonials, filters and
  categories; native `<details>` for FAQs and the footer groups; no 900 px cards.
- The homepage dropped from 13,609 px to about 10,500 px at 390 px, while carrying far more product information.

## 10. Performance
- Fonts: 2 families instead of 3.
- JS: `motion`, `lenis`, `leaflet`, `react-leaflet` and `recharts` were removed from the dependencies. The chat
  panel stays code-split.
- Images: next/image with AVIF/WebP, small `imageSizes` for swatches and logos, and lazy loading below the fold.
  Only the hero image has priority. The category renders were re-encoded as about 50 KB WebP crops.
- Only transform and opacity are animated; there are no layout animations.

## 11. Deliberately preserved
- Every product URL and slug, plus 308 redirects for the original site's `/about-us`, `/categories`,
  `/privacy-policy`, `/term-of-use` and `/products/doors`.
- The phone, WhatsApp number, email, GSTIN and address (PIN 382405; the conflict is documented), Instagram and
  Facebook.
- All 6 testimonials verbatim, the 156 décors, the A1 mission and vision, the logo and its wordmark, and the
  blue/orange identity.
- The `/api/lead` contract, the assistant and its APIs, next-intl routing, canonical URLs to
  www.anantacorporation.com, and the sitemap and robots.

See `ANANTA_CONTENT_TRUTH.md` for provenance and `ANANTA_FINAL_CLAIM_AUDIT.md` for the public claim audit.
