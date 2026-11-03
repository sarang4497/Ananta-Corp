# Ananta V2 — Decision Matrix

| Area | Current Ananta | Century reference | Santa reference | Best approach for Ananta | Why |
|---|---|---|---|---|---|
| Header | Navy utility + 64px bar | 2-row ~135px, search + call block | 64→84px, hairline on scroll | 2-tier: slim utility (GSTIN/phone/email/WA) + ~88px white main bar with large logo, 6 menus, inline search, Get Price | Established-brand weight without Century's icon clutter |
| Navigation | Products/Brands/Capabilities mega | 6-col product mega, image panels | simple disclosure | Products (photo preview per category, counts), Brands (logos+counts), Applications, Tools, Resources | Data-driven, richer than both |
| Hero | Image + CTA | Carousel | Mask + curtain + stagger | Single strong interior image, Santa curtain/mask/stagger, brand logos, real counts | Carousels dilute; Santa choreography is premium |
| Products | Library grid | 4-up packshots | — | Category universe with counts + featured rail | Show breadth via computed data |
| Product cards | Image/name | Horizontal card, chips, Know More / Enquire | rv-frame reveal | Card: image, brand logo, name, category, 2–4 verified USP chips, Compare, Details, Get price | One consistent primary CTA |
| Specifications | Spec rows | Spec table | — | Visual spec blocks (thickness, size, grade, standard, density, exposure) + full table | Scannable; only sourced values |
| USPs | None | Tabbed icon USPs | — | Derived chips + per-category "Key attributes" tabs | Verified attributes only |
| Search | Catalogue page only | Inline header field | — | Header inline trigger + ⌘K dialog / mobile sheet; deterministic index over products, categories, brands, applications, tools, posts | Local, instant, no AI |
| Filters | Facets + counts + URL | "Find Product" | — | Keep Ananta's | Already stronger |
| Comparison | 2 selects | — | — | Keep engine; shareable `?a=&b=`; Compare from cards/product pages | Extend, don't duplicate |
| Material selector | Homepage only | Room tiles | demo polish | /tools/material-selector + homepage demo, same component | One component |
| Blogs | None | Blog carousel | — | /blog hub + 8–12 grounded articles linked to live product cards | Content depth |
| Tools | Anchors | Tools mega + tab bar | — | /tools hub: Selector, Compare, Requirement Builder, Sheet Helper, Finish Explorer | Interactive only |
| Assistant | Deterministic text | none | Floating card, nudge rules | Keep engine; side panel desktop, bottom sheet mobile; next-step actions | Extend |
| Voice | None | Mic in search (Century) | none | Mic in assistant: Web Speech `en-IN`, editable transcript, optional read-aloud | Owner requirement; deterministic |
| Forms | Honest lead form | Auto modal | Scheduled popups | No auto popups; contact form prefilled from quote context | Respectful + higher intent |
| WhatsApp | Contextual | FAB | — | Keep contextual; unify via `lib/quote.ts` | Strongest current flow |
| Mobile navigation | Sheet + accordions | Left drawer accordions | Drop panel | Keep sheet; photo rows, Get Price pinned | Already good |
| Footer | Basic | Dark 4-col | navy | Navy footer: Products/Brands/Applications/Resources/Company/Contact + legal strip; mobile accordions | Full IA |
| Motion | Reveal infra | none | Rich | Santa curtains, masks, line draws on Ananta infra | Premium pacing |
| Responsive system | `--gutter` clamp + `.shell` | — | `--gutter` tokens | One gutter token set, enforced; overflow guard on all routes | Zero clipping |
