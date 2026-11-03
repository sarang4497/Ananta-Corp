# Ananta V2 — Technology Preservation Audit

Decision scale: KEEP AS-IS · KEEP + RESTYLE · KEEP + EXTEND · REFACTOR · REPLACE.
No capability is REPLACE. Every V2 surface reads from the same data modules.

| Capability | Current implementation | What works well | Must be preserved | Can improve | Decision |
|---|---|---|---|---|---|
| Catalogue data | `src/data/products.ts` (20 products, 6 categories, 9 subs), sourced, unknowns omitted | Single typed source, helpers, every value sourced | Types, slugs, URLs, sourcing rules | USP derivation, spec/size consistency (MR 4–25 vs 6–18) | KEEP + EXTEND (`src/data/usps.ts` derived, no new facts) |
| Counts | `src/data/stats.ts` computed | No hard-coded numbers | Computed counts everywhere | Décor duplicate makes 156 → 155 | KEEP + fix data |
| Verified claims | `site.ts` tagged, `claims.test.ts` BANNED, attribution tests | Blocks regressions mechanically | All bans + attribution rules | Remove stale `knowledge` special case | KEEP AS-IS |
| Filtering | `CatalogBrowser` facets w/ live counts + URL sync | Real faceted search | URL params, counts | Visual polish, compare entry | KEEP + RESTYLE |
| Routing | next-intl typed pathnames, `generateStaticParams`, `notFound()` | Static, typed | All existing URLs | + /tools, /blog | KEEP + EXTEND |
| Old-URL redirects | `next.config.ts` 5 permanent | Correct | All | — | KEEP AS-IS |
| SEO metadata | `buildAlternates`, JSON-LD helpers, sitemap | Canonical + hreflang everywhere | No ratings/offers in JSON-LD | Article + FAQPage schema | KEEP + EXTEND |
| WhatsApp context | `WA.*`, `whatsappUrl`, `[data-wa-context]` | Product-specific messages | Number, message honesty | Size/finish/qty/city via `lib/quote.ts` | KEEP + EXTEND |
| Size selector | `EnquiryBox` sizes → WA message | Exact A1 sizes | Data | Feed quote context + enquiry form | KEEP + EXTEND |
| Material selector | `SELECTOR` + `MaterialSelector` | Only catalogue picks, reasoned | Data + logic | Dedicated tool page, faster UI | KEEP + EXTEND |
| Board comparison | `compare()` (overlap-only, ≥4 rows) | Never compares unknowns | Engine | Shareable URL, card "Compare" | KEEP + EXTEND |
| Décor library | 156 swatches, type filter, search | Real data | Codes/names/images | Shortlist, enlarge, dedupe | KEEP + EXTEND |
| Images | next/image WebP, custom sizes | Optimised | Pipeline | Lazy mega-menu imagery | KEEP AS-IS |
| Motion | `RevealObserver` + `html.js` gate + reduced-motion | No-JS safe, a11y safe | Gate + reduced-motion | Santa mask/curtain/stagger | KEEP + EXTEND |
| Accessibility | Focus management in menus, aria-pressed, 44px | Solid | All | Search dialog + voice a11y | KEEP + EXTEND |
| Overflow guards | `tests/e2e/overflow-guard.ts` | Catches clipping, not just scrollWidth | All 5 checks; no global overflow-x hack | New routes/overlays | KEEP + EXTEND |
| Assistant | `lib/assistant/guide.ts` deterministic + `ChatPanel` lazy | No network, tested (45) | Determinism, zero API | Voice, blog/tool/app intents, bottom sheet | KEEP + EXTEND |
| Forms / backend | `/api/lead` + Resend REST, honest copy | Never fakes success | Honesty, honeypot, validation | Quote-context prefill | KEEP + EXTEND |
| Analytics | None | Privacy-safe by absence | Nothing to send | — | KEEP AS-IS (none added) |
| Deploy | Vercel project `ananta-corp` | Works | Same project | — | KEEP AS-IS |
| Git history | linear commits on revamp branches | — | Don't rewrite | new branch `revamp/v2-century-santa` | KEEP |
