# Ananta Corporation — Content Truth Register

The provenance register for every important public claim. Visitors never see the citations; this file is the
internal record. Last verified 2026-11-02.

**Sources**
- **A1:** the original first-party site https://www.anantacorporation.com/ (re-fetched 2026-11-02; full crawl in
  `docs/ananta-full-site.md`).
- **A2:** the original site's own JSON-LD (Organization/LocalBusiness) on the same pages.
- **M-DP:** Duroply official: https://www.duroply.in/faq.php, /plywood-blockboards.php, /flush-doors.php.
- **M-AT:** Action TESA official: https://www.actiontesa.com/products/plain-mdf-boards/,
  /products/plain-hdhmr-boards/, /products/moist-master/, /prelaminated-boards/.
- **M-TN:** Tenon official: https://www.tenonlock.com/ (Guangdong Ap Tenon Sci.&Tech.). It has no India product data.
- **D:** computed at build time from `src/data/*.ts` (the catalogue itself).

**Status key:** VERIFIED (a manufacturer or computed source confirms it) · FIRST-PARTY (Ananta's own published
claim, not independently verified) · CONFLICTING · UNSUPPORTED/REMOVED · NEEDS OWNER CONFIRMATION.

## 1. Company-level claims

| Claim | Source | Type | Status | Where it may be used |
|---|---|---|---|---|
| Ananta Corporation, Ahmedabad, Gujarat | A1 footer, contact page | first-party | FIRST-PARTY | everywhere |
| GSTIN 24ACDFA7104Q1ZB | A1 footer | first-party | FIRST-PARTY | footer, contact, about |
| Phone / WhatsApp +91 83200 52838 | A1 contact page, wa.me links | first-party | FIRST-PARTY | everywhere |
| Email info@anantacorporation.com | A1 | first-party | FIRST-PARTY | everywhere |
| Address: 293/2, Godown No. 17, Nanukaka Estate, Opp. Sub Station, Pirana Road, Piplaj, Ahmedabad, Gujarat **382405** | A1 footer (382405) + A2 `postalCode: 382405` + contact page | first-party | **CONFLICTING**: the A1 mobile menu says **382425** | The site publishes **382405 only**: it appears three times in visible copy plus the structured data, against one mobile-menu mention of 382425. The owner must confirm it. |
| "Authorized distributor of Duroply, Action Tesa" | A1 homepage hero; partners meta says "Authorized supplier/dealer" | first-party | FIRST-PARTY, **not independently verified** (neither duroply.in nor actiontesa.com publishes a dealer list naming Ananta) | Hero label "Authorized distributor" next to the two logos; partners page. Never "exclusive", "official Gujarat" or "leading". Tenon is described only as "supplied", never "authorized". |
| Supplies Tenon Smart Lock products | A1 partners page and all 8 lock pages | first-party | FIRST-PARTY | brand pages, smart-lock category |
| "Trusted Since 2020" | A1 home and about feature tile; A2 `foundingDate: "2020"` | first-party | FIRST-PARTY (consistent in two places) | "Since 2020" in the proof row and about page |
| "Decades of experience in plywood manufacturing excellence" | A1 home and about | first-party | **CONFLICTING** with 2020; Ananta is a distributor, not a manufacturer | **REMOVED** |
| "Over 15 years of combined industry experience" / "15+ years" | A1 about page and meta | first-party | **CONFLICTING / ambiguous** (team experience vs company age) | **REMOVED**; NEEDS OWNER CONFIRMATION |
| "11,000 sq. ft. of warehouse and workshop space" | A1 about page ("Ready Stock Infrastructure") | first-party | FIRST-PARTY | Operations section, about page, count-up figure |
| Ready-to-dispatch inventory / ready stock | A1 about page; testimonials 1–2 | first-party | FIRST-PARTY | Operations copy, no quantities attached |
| "End-to-end: Material Supply + Custom Furniture" | A1 announcement bar | first-party | FIRST-PARTY | Capabilities, custom furniture section |
| "Custom Sizes & Designs — tailored solutions" | A1 feature tile | first-party | FIRST-PARTY | Custom furniture section |
| "Bulk orders & contractor partnerships available" | A1 announcement bar | first-party | FIRST-PARTY | Project-teams audience path, CTA |
| "Fast & reliable delivery available across the country" / "Express Delivery Available!" | A1 announcement bar, slider | first-party | FIRST-PARTY but unquantified and broad | **Not used as a headline claim.** The site says only "delivery arranged as per location & availability" (A1 product pages). |
| CNC machining | A1 testimonial (Ketanbhai Shah) only | customer statement | **NEEDS OWNER CONFIRMATION** as a capability | Only inside that quoted testimonial; the process copy says "cutting & machining to drawing" without naming equipment |
| "100% quality checked" | A1 testimonial only | customer statement | Customer quote | only inside the quote |
| Technical Expertise / Design + Execution Support / Fast Logistics Network | A1 about, "What Sets Us Apart" | first-party | FIRST-PARTY | About page (paraphrased tightly), Why Ananta |
| Serves interior designers, architects, builders, contractors, furniture manufacturers, project execution teams | A1 home ("Trusted Material Partner" block) and meta | first-party | FIRST-PARTY | Audience entry points |
| "Wide Product Range — from Marine, BWR to Decorative Laminates" | A1 feature tile | first-party | **UNSUPPORTED by the catalogue**: no marine, BWR or decorative-laminate SKUs are listed | **REMOVED** |
| "All Plywood Weather Resistant" | A1 feature tile | first-party | **UNSUPPORTED / overstated** (MR plywood is for interior use per A1's own FAQ) | **REMOVED** |
| "Termite, Borer, Fungus & Water Resistant" (global tile) | A1 feature tile | first-party | Product-specific at best | **REMOVED** as a global claim; termite/borer kept only on Moist Master and Duro Door (M-AT, M-DP verified) |
| "Premium Quality Plywood — advanced technology" | A1 feature tile | first-party | vague | **REMOVED** |
| "German Technology" (global badge) | previous redesign's trust strip | — | **REMOVED** globally; kept only on Action TESA MDF and HDHMR product pages, attributed to Action TESA |
| "CARB E1 & E2" (global badge) | previous redesign's trust strip | — | **REMOVED** everywhere (see §2) |
| "Certified Materials" badge | previous redesign | — | **REMOVED** |
| "Founded in 2024" | previous redesign (hero + trust strip) | fabricated | **REMOVED** (it contradicted 2020) |
| "Fast Gujarat Delivery", "GST Billing Available" badges | previous redesign | fabricated | **REMOVED** |
| "Project Proof" project types (residential, modular kitchen, office) | previous redesign | fabricated | **REMOVED** |
| Opening hours Mo–Sa 09:00–19:00 | A2 JSON-LD only, never shown to visitors | first-party structured data | NEEDS OWNER CONFIRMATION | **Not published** on the site or in the new JSON-LD |
| Instagram @anantacorporation1, Facebook share link | A1 footer | first-party | FIRST-PARTY | footer, JSON-LD `sameAs` |

## 2. Product-level claims

| Product | Claim | Source | Status | Use |
|---|---|---|---|---|
| Duroply MR plywood | MR grade, conforms to IS 303 | A1 + M-DP faq ("IS 303 refers to MR Grade plywood"; plywood page "Conforms to IS 303") | VERIFIED | Product spec row "IS 303", attributed to Duroply |
| Duroply MR plywood | urea formaldehyde bonding | A1 | FIRST-PARTY (not stated by Duroply) | product page description only |
| Duroply MR plywood | thicknesses 6/8/12/16/18 mm; 4–25 mm range; 8 × 4 ft | A1 size selector + FAQ | FIRST-PARTY | spec table |
| Duroply BWP plywood | conforms to IS 710 | A1 + M-DP ("Conforms to IS 710") | VERIFIED | spec row, attributed |
| Duroply BWP plywood | phenol formaldehyde bonding | A1 | FIRST-PARTY | description only |
| Duroply BWP plywood | 9/12/19 mm; 4–25 mm; 8 × 4 ft | A1 | FIRST-PARTY | spec table |
| Duro flush door | conforms to IS 2202, BWP grade | M-DP flush-doors ("Available in BWP Grade conforming to IS 2202") + A1 | VERIFIED | spec row |
| Duro flush door | "100% boiling water proof" | A1 | **UNSUPPORTED** (Duroply says "available in BWP Grade") | **REMOVED** → "BWP grade" |
| Duro flush door | termite treated | M-DP ("specially treated for termite resistance") + A1 | VERIFIED | spec row |
| Duro flush door | solid block-board core, seasoned hardwood battens | A1 only; not on duroply.in | NEEDS OWNER CONFIRMATION | **REMOVED** from the spec table |
| Duro flush door | sizes Custom, 48×96, 36×93, 33×93, 33×90, 33×80, 30×80; 30/35 mm | A1 selector + FAQ | FIRST-PARTY | spec table |
| Action TESA MDF (interior and exterior) | built with German technology, homogeneous | M-AT plain-mdf ("built with German technology… homogeneous structure") + A1 | VERIFIED, applies to Action TESA MDF | product pages only, worded "Action TESA states…" |
| Action TESA MDF | complies with IS 12406 | M-AT plain-mdf ("complies with IS 12406:2025") | VERIFIED (manufacturer enrichment of a listed product) | spec row on the MDF product pages |
| Interior MDF | "CARB certified E1 & E2 grade" | A1 | **CONFLICTING wording**: Action TESA treats CARB and EN 13986 E1/E2 as separate standards, for MDF generally, not this grade | **REMOVED** |
| Exterior MDF | "CARB E2 certification" | A1 | **UNSUPPORTED** for this grade | **REMOVED** |
| Exterior MDF | "weather-resistant outdoor use" | A1 | **CONTRADICTED** (M-AT: MR grade suits "covered, non-wet exposure, not direct rain or standing water") | **REMOVED** → "moisture-resistant grade for covered, humid, semi-outdoor areas" (matches A1's own FAQ, which recommends a protective coating outdoors) |
| HDHMR | German mat-forming technology | M-AT plain-hdhmr | VERIFIED | product page, attributed |
| HDHMR | density over 850 kg/m³ | M-AT ("density of over 850 kg/m³") + A1 | VERIFIED | spec row |
| HDHMR | 10-year warranty | A1 | **CONTRADICTED** (M-AT asset suggests 15 years; there is no warranty text) | **REMOVED** from copy; the manufacturer image with the 10-year badge is no longer displayed |
| HDHMR | thicknesses | A1 size selector (3, 5.5, 7.5, 11, 16.75, 18, 25 mm) vs A1 FAQ (8, 12, 16, 18, 25 mm) | **CONFLICTING** | The size-selector values are shown (the page's own stock selector); the FAQ thickness answer is left out |
| Moist Master HMR | HMR particle board, density above 750 kg/m³ | M-AT moist-master | VERIFIED | spec row |
| Moist Master HMR | termite and borer resistance | M-AT + A1 FAQ | VERIFIED | spec row |
| Moist Master HMR | melamine-fortified resin | A1 only (M-AT icons say "Technical-Grade-Urea") | NEEDS OWNER CONFIRMATION | **REMOVED** |
| Prelam particle board | factory melamine laminate on both sides, no separate lamination needed | A1 FAQ | FIRST-PARTY | prelam pages |
| Prelam particle board | 9/11/17/25 mm | A1 selector | FIRST-PARTY | spec table |
| Prelam décors | 156 codes and names | A1 décor catalogue; swatch files hosted on actiontesa.com `/wp-content/uploads/2025/11/` | FIRST-PARTY + manufacturer asset provenance; the codes were not found in M-AT page text | décor library, finish wall; count computed from data |
| Prelam | "over 50 designs" | A1 FAQ | **CONFLICTING** with the 156-entry catalogue | not used; the computed count is shown |
| Smart locks (7 of 8) | any feature or spec | A1 says "No description available" | none | only the product name and "specifications on request" |
| Sliding Fingerprint Door Lock | touch-activated, OLED screen, automatic closing, keyless, for interior sliding doors | A1 | FIRST-PARTY | its product page |

## 3. Computed numbers (never hard-coded)

| Figure | Computation |
|---|---|
| Products (20) | `PRODUCTS.length` |
| Categories (6) | `CATEGORIES.length` |
| Brands (3) | unique `PRODUCTS[].brand` |
| Prelam décors (156) | `DECORS.length` |
| Per-category, per-brand and per-application counts | filters over `PRODUCTS` |

## 4. Testimonials

All 6 are copied verbatim from A1 (home + about): quote, name and role. The previous redesign's added
"location" and "project" fields were deleted. The only location kept is the one A1 itself prints ("Interior
Contractor, Ahmedabad"). There are no stars, no "Google review" styling and no photos (initials only).

## 5. Application mappings (material selector, audience paths)

Every mapping comes from A1 product copy or FAQ answers:
- MR plywood: furniture, wardrobes, bed frames, shelving, wall partitions (A1 FAQ). Not for sink cabinets (A1 FAQ).
- BWP plywood: kitchens, bathrooms, sink cabinets, exterior furniture (A1 FAQ).
- Interior MDF: furniture, kitchen cabinets, wardrobes, decorative wall panels, shelving, display units; painted,
  laminated and veneered finishes (A1 FAQ).
- Exterior MDF: semi-outdoor and high-humidity areas such as covered balconies, bathrooms, exterior wall panelling
  (A1 FAQ).
- HDHMR: modular kitchens, wardrobes, bathroom vanities, commercial furniture (A1 about + FAQ).
- Moist Master HMR: modular kitchen carcasses, wardrobe interiors, bathroom furniture, commercial furniture (A1).
- Prelam: wardrobes, office furniture, modular kitchens, commercial interiors (A1). High-moisture zones → HMR/HDHMR
  (A1 FAQ).
- Flush door: bedrooms, bathrooms, main doors, residential and commercial interiors (A1).
- Smart locks: main door, interior doors, sliding doors, by product name only (A1).
