# Ananta Corporation — Current Site Audit

Audited 2026-11-02, before the premium redesign. Covers the local repo (`~/Websites/Ananta-Corporation`, branch
`revamp/homepage-premium-supplier`, HEAD `d450e33`), the deployed Vercel project and the original first-party
site.

## 0. What exists where

| Thing | Location | Notes |
|---|---|---|
| Local repo | `~/Websites/Ananta-Corporation` | Next.js 16.2.6 App Router, React 19.2, Tailwind v4, next-intl 4 (en only, no prefix), `motion` 12, `lenis` |
| Git remote | `github.com/sarang4497/Ananta-Corp` | `main` + this branch. The working tree was clean at the start. |
| Vercel project | `ss-projects-44dd51eb/ananta-corp` (`prj_oWZRbN2YwtDsbmwm0cXKN3GzjIoY`) | Production = **https://ananta-corp.vercel.app**. Last production deploy was 152 days ago, so the two newest commits (logo, homepage revamp) were **never deployed**. There was no `.vercel/` link in the repo; it is now linked with `vercel link --project ananta-corp`. |
| Custom domain | `www.anantacorporation.com` | **Not** on this Vercel account. It serves the owner's ORIGINAL site, built by a third party (credited as `nisargkavi.in`). This redesign must not touch it. `src/config.ts` already uses it as the canonical origin, meaning this codebase is meant to replace that site later. |
| Original-site crawl | `docs/ananta-full-site.md` | A full recursive crawl from 2026-06-03 (41 URLs). Re-checked against the live site on 2026-11-02: same sitemap, same claims. **This is the primary first-party source.** |

## 1. Routes (redesign codebase)

`/`, `/products`, `/products/[category]` (6), `/products/[category]/[sub]` (10), `/products/[category]/[sub]/[slug]`
(20), `/decor` (156-décor library), `/about`, `/partners`, `/contact`, `/privacy`, `/terms`, the localized 404,
`/sitemap.xml`, `/robots.txt`, and the APIs `/api/chat`, `/api/lead`, `/api/verify`, `/api/transcribe`.

Product slugs are identical to the original site's URLs. The original-site URLs that do **not** exist here are:
`/about-us`, `/categories`, `/privacy-policy`, `/term-of-use`, and `/products/doors` (a dead link on the original
site). Redirects are needed so no SEO is lost when the domain moves.

## 2. Homepage sections (before)

The homepage had 13 stacked sections: Hero → trust strip → who-we-serve → 6 category cards → solutions → 4 USP
cards → process → 6 featured product cards → brand cards → "project proof" → 6 testimonial cards → FAQ →
CTA band. The page is **13,609 px tall at 390 px** and 6,031 px at 1440 px (live deploy). Nearly every block is
the same white rounded card with a shadow. Each product card repeats two full-width buttons.

## 3. Product taxonomy and data

`src/data/products.ts` holds 6 categories, 10 subcategories and 20 products: 2 Duroply plywood, 3 Action TESA MDF
(interior, exterior, HDHMR), 1 Moist Master HMR, 5 prelam décor SKUs, 1 Duro flush door and 8 Tenon smart locks.
`src/data/decors.ts` holds 156 Action TESA prelam décors, with self-hosted AVIF swatches (30 MB on disk).

The product copy in the data file is mostly first-party, but it was **embellished**: invented feature bullets, "ready
stock for immediate bulk dispatch" on every SKU, and generated smart-lock descriptions. It also carries
manufacturer claims that fail verification (see `ANANTA_CONTENT_TRUTH.md`).

## 4. Brands

There are three brands. Duroply and Action TESA are described as "authorized distributor" (first-party wording).
Tenon Smart Lock is described as a supplied brand. Logo files:
- `brands/action-tesa.png`: 2139×832, good.
- `brands/duroply.png`: 127×44, low-resolution. The manufacturer's own site only publishes a 150×50 PNG.
- `brands/tenon-smart-lock.png`: 151×31, low-resolution. The manufacturer publishes a 400×139 white logo.

## 5. Images

| Class | Files | Use |
|---|---|---|
| FIRST PARTY (Ananta studio renders, Ananta logo watermark at the top) | `categories/*.jpg/png` (928×1152) | Good material visuals. The watermark must be cropped out. |
| FIRST PARTY (interior "application" renders, no people) | `hero/plywood-slider.png` (1200×546, warm wood living room), `hero/mdf-slider.png` (kitchen), `hero/door-slider.jpg` (door) | Best atmosphere images; the warm wood interior is the hero candidate. |
| BRAND-SUPPLIED / PRODUCT CUTOUT | `products/*` (32 files) | Many are manufacturer marketing images with **models in hard hats** and printed warranty badges. The clean slab, swatch and lock renders are fine. |
| BRAND-SUPPLIED décor swatches | `decor/*.avif` (156) | Originally hot-linked from actiontesa.com. Excellent for a finish wall. |
| LOGO | `logo/Ananta-Logo.png` (1563² mark), `logo/ananta-mark.png`, `brands/*` | Must never be used as photography. |
| DOCUMENT/SCREENSHOT | none | |
| STOCK people | inside manufacturer product shots | Must never be presented as Ananta staff. |

There are **no real warehouse, workshop or project photos** anywhere in the repo or on the original site. The
original site's `/images/projects/flush-door-*.jpeg` and Instagram gallery were never downloaded.

## 6. Forms, WhatsApp and chat

- **WhatsApp:** `wa.me/918320052838`, defined once in `src/lib/whatsapp.ts`. The floating green button had a fixed
  `bottom: 6.5rem` and sat on top of content. The product pages already prefill the product name.
- **Chat widget (blue button):** a working AI assistant (`/api/chat`, Anthropic SDK, knowledge files in
  `src/content/knowledge/*.md`, a 3-message cap, then it redirects to WhatsApp/contact). `ANTHROPIC_API_KEY` is set
  in Vercel Production. Its launcher is a second 56 px circle at bottom-right, so two competing chat bubbles were
  stacked on top of the content. Its knowledge files repeat the unsafe claims ("German technology", "CARB",
  "10-year warranty").
- **Contact form:** `ContactLeadForm` posts name, phone, email, quantity, product and message to `/api/lead`. The
  route validates the email and `console.log`s the lead. It emails the team **only if** `RESEND_API_KEY` and
  `LEAD_NOTIFY_TO` are set, and **they are not set in Vercel**. So a "success" reaches only the server logs. This is
  a real server acceptance, but nobody is notified.
- **Testimonials:** 6. The quote text, names and roles are first-party. The current redesign **added an invented
  "location" and "project" to each one** (for example "Ahmedabad", "Residential interiors").

## 7. SEO, metadata, structured data and analytics

- Per-page `generateMetadata`; canonical and hreflang through `buildAlternates`; sitemap with all 41 routes;
  robots allows all.
- **No JSON-LD** in the redesign. The original site has Organization/LocalBusiness and WebSite JSON-LD
  (`foundingDate: 2020`, `postalCode: 382405`, `openingHours: Mo-Sa 09:00-19:00`, and the description "leading
  supplier").
- No analytics anywhere.
- Canonical URLs point to `https://www.anantacorporation.com` while the site is served from `ananta-corp.vercel.app`.
  This is intentional for the planned domain move and must be kept.

## 8. Mobile, accessibility and performance (before)

- Mobile: vertical bloat, card-on-card stacks, two floating circles over text, a 5-line hero H1, and a mobile
  footer about 900 px tall.
- Accessibility: reasonable baseline (labels, aria on buttons). The `motion` reveals render `opacity:0` server-side
  for every animated block, so content is invisible without JS and before hydration.
- Performance: three Google fonts (Geist, Geist Mono, Inter 600); a permanently animated full-page `GradientMesh`;
  `lenis` smooth scroll on every page; an infinite sheen animation on buttons; décor AVIFs served unoptimized at
  full size.

## 9. Duplicated or unused material

- `components/ui/{GradientText,Marquee,Pill,Stat,Card}`, `home/ImagePlaceholder`, `home/ProjectProof`
  (invented project types), and the root `public/*.svg` Next.js scaffold files.
- The same "Get Price on WhatsApp" CTA appeared about 14 times on the homepage.

## 10. Content classification (summary; full register in ANANTA_CONTENT_TRUTH.md)

- **Factual and first-party:** the name, GSTIN, phone, email, address (with the PIN conflict), the 6 categories, 20
  products, 156 décors, the three brands, the "Authorized distributor of Duroply, Action Tesa" wording, "Trusted
  Since 2020", "11,000 sq. ft. of warehouse and workshop space", "End-to-end: Material Supply + Custom Furniture",
  "Bulk orders & contractor partnerships", the 6 testimonials, the product FAQs and thickness selectors.
- **Ambiguous or conflicting:** "decades of experience" and "15+ years of combined experience" vs "Since 2020"; PIN
  382405 vs 382425; "Fast & reliable delivery across the country"; CNC (mentioned only inside a testimonial);
  opening hours (only in the original JSON-LD, never shown to visitors).
- **Fabricated in the previous redesign:** "Founded in 2024" (the hero and trust strip contradict "Since 2020"),
  "Fast Gujarat Delivery", "GST Billing Available" as a trust badge, the "Project Proof" project types, the
  testimonial locations and project tags, the global "CARB E1 & E2" and "German Technology" badges, and "Certified
  Materials".
- **Do not change:** product URLs/slugs, GSTIN, phone, email, WhatsApp number, testimonial wording, and brand logos
  (no recolouring).
