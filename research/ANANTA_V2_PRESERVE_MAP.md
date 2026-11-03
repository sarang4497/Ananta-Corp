# Ananta V2 — Preserve Map

| Preserved element | Where | Why it stays |
|---|---|---|
| White / blue `#1E40AF` / orange `#F97316` palette + navy proof sections | `globals.css @theme` | It is Ananta's logo identity; orange reserved for accents/CTAs mirrors the Century "brand colour only for action" principle without borrowing red |
| Product data structure + sourcing rules | `src/data/products.ts` | Single verified source; every V2 surface (nav, search, cards, USPs, assistant, blog) derives from it |
| Verified claim system | `site.ts`, `claims.test.ts`, `ANANTA_FINAL_CLAIM_AUDIT.md` | Prevents re-introduction of CARB/E1/E2, German-tech-global, decades, warranties, same-day |
| Filterable catalogue | `CatalogBrowser` | Live facet counts + URL state already beat the reference's "Find Product" button |
| Product detail data + size selector | `EnquiryBox`, product page | Exact sizes per product feed WhatsApp — becomes the quote context |
| Contextual WhatsApp | `WA`, `whatsappUrl`, `data-wa-context` | Product-specific prefill is stronger than Century's generic modal |
| Material selector | `SELECTOR`, `MaterialSelector` | Reasoned, catalogue-only recommendations |
| Board comparison | `compare()` | Overlap-only rows = no invented specs |
| Old URL redirects | `next.config.ts` | SEO equity from anantacorporation.com |
| Motion infra + reduced motion | `RevealObserver`, `html.js` gate | Content visible without JS and under reduced motion (tested) |
| Verified testimonials (6) | `TESTIMONIALS` | Verbatim, sourced; restyled only |
| SEO helpers + JSON-LD | `lib/metadata.ts`, `lib/jsonld.ts` | Canonicals, no fake ratings/offers |
| Product imagery | `public/images/**` | Watermark-free, cropped from Ananta's own assets |
| Contact dock collision logic | `ContactDock` | Hides on overlap/typing/menu/chat — Santa-grade modal coordination already |
| Lead honesty | `/api/lead`, `ContactLeadForm` | Success shown only when the server confirms |
