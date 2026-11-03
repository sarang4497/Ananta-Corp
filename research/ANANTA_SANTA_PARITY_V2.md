# Ananta V2 — Santa Caterina Parity

| Pattern | Santa reference | Ananta V2 | Status |
|---|---|---|---|
| Hero motion | CSS-only line-mask stagger, photo curtain, settle, rise | Same choreography (CSS, plays pre-hydration): line-mask headline, curtain + 1.12→1 settle on photo, staggered rise of copy/CTAs/logos/counts, desktop parallax | PARITY |
| Image reveals | `data-rv-mask` clip-path inset + scale | `data-reveal="image"` (inset 18%→0, 950ms mask easing, scale settle) | PARITY |
| Line draws / masks | `.rv-rule`, eyebrow draw | `data-reveal="line"`, `mask`, eyebrow hairline | PARITY |
| Rich nav | Simple disclosure (no photo previews) | Hover-intent mega panels with live photo previews, keyboard + Escape | EXCEEDS |
| Interactive demos | Scripted concierge | Material Selector, Compare, Requirement Builder, Sheet Helper, Finish Explorer (shortlist + enlarge) | EXCEEDS |
| Assistant | Floating card, scripted, no AI | Deterministic guide; desktop side panel, mobile bottom sheet; next-step actions on every answer | PARITY+ |
| Voice | None | Web Speech `en-IN` → editable transcript (never auto-sent); optional read-aloud via speechSynthesis (never autoplays) | EXCEEDS |
| Fixed CTA | Mobile CTA bar + floating buttons | Mobile 5-action utility bar + desktop rail in reserved gutter | PARITY |
| Modal coordination | Scheduler + `data-dialog-open` | Dock hides on overlap / typing / menu / chat / search; no auto popups at all | PARITY (simpler by design) |
| Responsive QA | scrollWidth + 320px cut-off checks | `findMeaningfulOverflow` (scroll width, clipped text, line-clamp, fixed-height clipping) × 27 routes × 11 widths + open overlays | EXCEEDS |
| Mobile rails | Snap carousels | Snap rails for products, testimonials, chips | PARITY |
| Section rhythm | white / pearl / sage / navy | white / surface-blue / navy / warm white / image-led / interactive | PARITY |
| Overflow guard | No global hack | No global overflow-x hack; per-component fixes | PARITY |
| Reduced motion | One block disables all | Same; everything visible instantly; tested | PARITY |
