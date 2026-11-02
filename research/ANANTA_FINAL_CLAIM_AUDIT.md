# Ananta Corporation — Final Claim Audit

Generated 2026-11-02 before deployment. Every high-risk public claim on the redesigned site, with its page, its
source and its status. Sources are defined in `ANANTA_CONTENT_TRUTH.md`:
- **A1:** anantacorporation.com, Ananta's own site.
- **A2:** that site's JSON-LD.
- **M-DP:** duroply.in.
- **M-AT:** actiontesa.com.
- **D:** computed from the catalogue data.

This audit is enforced automatically by `tests/unit/claims.test.ts`, which scans all public source, the data,
the chat knowledge and the messages for removed or banned claims, and by the data tests in
`tests/unit/data.test.ts`.

**Statuses:** VERIFIED_FIRST_PARTY · VERIFIED_MANUFACTURER · OWNER_CLAIM · REMOVED · OMITTED_PENDING_CONFIRMATION

## A. Company-level claims

| Topic | Copy (as published) | Page(s) | Source | Status |
|---|---|---|---|---|
| Distributor status | "Authorized distributor" + Duroply and Action TESA logos | Home hero, header Brands panel, /partners, /about, product brand link | A1 hero: "Authorized distributor of Duroply, Action Tesa". Neither manufacturer lists dealers publicly. | OWNER_CLAIM (A1 wording kept, never strengthened: no "exclusive", "official" or "leading") |
| Tenon relationship | "Supplied range" / "Also supplying" | Brands band, /partners, /about | A1 partners page and lock pages | VERIFIED_FIRST_PARTY (never called "authorized") |
| Founding year | "Since 2020", "Supplying since 2020" (count-up) | Home hero eyebrow, range index, /about, footer | A1 "Trusted Since 2020" + A2 foundingDate 2020 | VERIFIED_FIRST_PARTY |
| Experience | "decades of experience", "15+ years" | — | A1 (conflicts with 2020) | REMOVED |
| "Founded in 2024" | — | — | previous redesign, fabricated | REMOVED |
| Warehouse size | "11,000 sq. ft. of warehouse and workshop space" | Range index, Operations, /about, header Capabilities | A1 about, "Ready Stock Infrastructure" | VERIFIED_FIRST_PARTY |
| Ready stock | "supplied from ready stock in Ahmedabad", "Ready-to-dispatch inventory" | Hero, Operations | A1 about ("Ready-to-dispatch inventory") | VERIFIED_FIRST_PARTY (no quantities, no "always in stock") |
| Delivery | "Delivery arranged as per location & availability" | Product enquiry box, Operations, /about, assistant | A1 product pages, verbatim | VERIFIED_FIRST_PARTY |
| Delivery speed / reach | "Fast & reliable delivery across the country", "Express Delivery", "Fast Gujarat Delivery" | — | A1 announcement bar (vague) / previous redesign | REMOVED (not used as a claim) |
| Response time | "we respond the same day" | — | previous redesign and chat strings | REMOVED |
| Custom furniture | "Material supply + custom furniture", "custom sizes and designs, and furniture made to your drawings" | Header utility bar, Capabilities, Custom section, /about, assistant | A1 announcement bar + "Custom Sizes & Designs" | VERIFIED_FIRST_PARTY |
| CNC machining | Only inside Ketanbhai Shah's verbatim testimonial ("…using CNC machines…") | Home Custom section | A1 testimonial | OMITTED_PENDING_CONFIRMATION as a company capability; the customer quote is kept verbatim |
| Bulk orders | "Bulk orders & contractor partnerships available" | Utility bar, audience paths, /about#support | A1 announcement bar | VERIFIED_FIRST_PARTY |
| Technical expertise / design + execution support / logistics network | Three rows in "Why Ananta" | Home Operations, /about | A1 about, "What Sets Us Apart" | VERIFIED_FIRST_PARTY (tightened, meaning unchanged) |
| Team background | "experience across electronics, mechanical engineering and construction" | /about | A1 about | VERIFIED_FIRST_PARTY |
| Mission / vision | Quoted mission and vision | /about | A1 about | VERIFIED_FIRST_PARTY ("trusted" removed from the vision) |
| Global badges | "German Technology", "CARB E1 & E2", "Certified Materials", "Wide range: Marine, BWR, Decorative Laminates", "All plywood weather resistant", global "Termite/Borer/Fungus/Water resistant" | — | previous redesign / A1 tiles | REMOVED |
| Address | 293/2, Godown No. 17, Nanukaka Estate, Opp. Sub Station, Pirana Road, Piplaj, Ahmedabad, Gujarat **382405** | Footer, /contact, mobile menu, JSON-LD, privacy | A1 footer + A2 postalCode | VERIFIED_FIRST_PARTY. 382425 (an A1 mobile-menu variant) appears **nowhere**. Owner confirmation recommended. |
| Phone / WhatsApp / email / GSTIN | +91 83200 52838 · info@anantacorporation.com · 24ACDFA7104Q1ZB | Header, footer, dock, /contact | A1 | VERIFIED_FIRST_PARTY |
| Opening hours | — | — | Only in A2 JSON-LD, never visible on A1 | OMITTED_PENDING_CONFIRMATION (not on any page and not in the JSON-LD; the assistant says hours aren't published) |
| Ratings / reviews | — | — | none | REMOVED / never added (no aggregateRating, no stars, no "Google review" styling) |
| Testimonials | 6 quotes, names and roles, verbatim | Home, /about | A1 home + about | VERIFIED_FIRST_PARTY (the invented location/project tags were removed) |
| Range depth | 20 products · 6 categories · 3 brands · 156 décors (and per-category, brand, application and family counts) | Home, header, catalogue, footer | D (computed from data at build time) | VERIFIED_FIRST_PARTY |

## B. Product-level, high-risk claims

| Product | Copy | Page | Source | Status |
|---|---|---|---|---|
| Duroply MR | "IS 303 — as stated by Duroply" | MR product page, plywood matrix, compare | M-DP faq + plywood page | VERIFIED_MANUFACTURER |
| Duroply MR | "Bonding resin: urea formaldehyde", "MR — moisture resistant", "Not for direct water / sink cabinets" | MR page | A1 | VERIFIED_FIRST_PARTY |
| Duroply BWP | "IS 710 — as stated by Duroply" | BWP page, matrix | M-DP | VERIFIED_MANUFACTURER |
| Duroply BWP | "BWP — boiling water proof", "phenol formaldehyde", "for kitchens, sink units, bathroom vanities" | BWP page, selector | A1 | VERIFIED_FIRST_PARTY |
| Plywood | "Marine-adjacent use" | — | knowledge base | REMOVED |
| Duro Door | "BWP grade · IS 2202 — as stated by Duroply", "Termite treatment" | Flush door page, category key line | M-DP flush-doors | VERIFIED_MANUFACTURER |
| Duro Door | "100% boiling water proof" | — | A1 | REMOVED (Duroply says "available in BWP Grade") |
| Duro Door | "solid block-board core, seasoned hardwood battens" | — | A1 only | OMITTED_PENDING_CONFIRMATION |
| Duro Door | sizes 30×80 … 48×96, custom; 30/35 mm; 7×3 and 8×4 ft | Flush door page | A1 | VERIFIED_FIRST_PARTY |
| Action TESA Interior/Exterior MDF | "German technology — homogeneous structure (as stated by Action TESA)", "IS 12406 (Action TESA)" | Those two product pages, compare | M-AT plain-mdf | VERIFIED_MANUFACTURER (product pages only, attributed) |
| Interior MDF | "CARB certified E1 & E2" | — | A1 (wording conflicts with M-AT) | REMOVED |
| Exterior MDF | "CARB E2" | — | A1 | REMOVED |
| Exterior MDF | "weather-resistant outdoor use" | — | A1 (contradicted) | REMOVED → "covered, humid and semi-outdoor areas · Not for direct rain or standing water" (A1 FAQ + M-AT) |
| HDHMR | "Density over 850 kg/m³ (Action TESA)", "German mat-forming technology (Action TESA)" | HDHMR page, hero plate, matrix, compare | M-AT plain-hdhmr | VERIFIED_MANUFACTURER |
| HDHMR | "10-year warranty" (text, and the manufacturer image with the 10-year badge) | — | A1 (M-AT points to 15 years) | REMOVED (no warranty duration published; the image is no longer displayed) |
| HDHMR | thicknesses 3 / 5.5 / 7.5 / 11 / 16.75 / 18 / 25 mm | HDHMR page | A1 size selector (the FAQ list conflicts) | VERIFIED_FIRST_PARTY (selector values used) |
| Moist Master | "Density above 750 kg/m³", "Termite & borer resistance" (Action TESA) | Moist Master page, category key line | M-AT moist-master | VERIFIED_MANUFACTURER |
| Moist Master | "melamine-fortified resin" | — | A1 only (M-AT says otherwise) | REMOVED |
| Prelam | "factory melamine laminate on both faces — no separate lamination", 9/11/17/25 mm | Prelam pages, finish wall | A1 FAQ / selector | VERIFIED_FIRST_PARTY |
| Prelam | 156 décor codes and names | /decor, finish wall | A1 catalogue; swatch files hosted on actiontesa.com | VERIFIED_FIRST_PARTY (count computed) |
| Prelam | "over 50 designs" | — | A1 FAQ (conflicts with the catalogue) | REMOVED |
| Smart locks (7) | name, brand, "specifications on request" only | Lock pages | A1 ("No description available") | VERIFIED_FIRST_PARTY (the generated feature copy was removed) |
| Sliding Fingerprint Door Lock | touch-activated, OLED screen, automatic closing, keyless | Its page | A1 | VERIFIED_FIRST_PARTY |
| Fire resistance | — | — | not claimed anywhere | none |

## C. Images that carry claims

Manufacturer product photos are shown only in product galleries, with the caption "Manufacturer imagery". Some
include the manufacturer's own printed badges, for example Duroply packaging warranty seals. Ananta's copy never
restates those badges. The HDHMR "10 years warranty" image is excluded entirely because Action TESA's own material
contradicts it.

## D. Assistant

- The assistant is **fully deterministic**. `src/lib/assistant/guide.ts` builds every reply from verified data (the
  catalogue, brand data, company facts and the selector mappings), using a typo-tolerant intent router.
- The AI route (`/api/chat`), the knowledge base and the Anthropic SDK were removed, so the assistant makes no
  model or API calls (checked by `tests/unit/assistant.test.ts` and `tests/e2e/assistant.spec.ts`).
- It never states prices, stock quantities, warranty periods, delivery times, CNC capability or opening hours.
- Unknown input gets a fixed fallback with topic buttons, WhatsApp and contact.

**Result:** zero unsupported public claims. Items needing the owner are listed as OMITTED_PENDING_CONFIRMATION
or OWNER_CLAIM.
