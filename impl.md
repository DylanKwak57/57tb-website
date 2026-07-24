# Valentine Products Implementation

## 2026-07-24 Formula Finder desktop alignment

- Moved the existing hair-condition help link below the shared two-column fieldset grid without changing its href or Thai copy.
- Added `md`-scoped flex/grid stretch behavior to equalize the two fieldsets and their four option cards only at desktop widths; mobile remains naturally content-driven.
- Added stable Formula Finder-only test identifiers and Playwright geometry coverage for 1440 px equality and 390 px compact, no-overflow behavior.
- Changed files are `src/components/products/ValentineFormulaFinder.tsx`, `tests/products.e2e.ts`, and these project records only. Legacy products, product content, and assets are untouched.
- Root verification: `npm test` passed 5/5; `npm run validate:products`, `npx tsc --noEmit`, `npm run build` (76 pages), `npm run verify:products` (54 routes), `npm run test:e2e` (8/8), and `git diff --check` passed. Playwright initially reused an unrelated stale static server; stopping that server allowed its configured static server and browser suite to complete. Manual Chromium measurements at 1440 px and 2048 px show a 0 px fieldset height delta and 0 px delta across all four cards; at 390 px, document `scrollWidth` equals 390 px and the cards remain naturally content-driven.

## Final Multi Perm terminology correction — 2026-07-23

- Changed the grouped Thai, English, and Korean product names to the authoritative Multi Perm system names while preserving the existing URL slug and individual pouch label names.
- Replaced narrowed Step 1 wording with the approved H1/D1 Multi Perm roles, added the exact headline, explanation, and three supported uses to grouped copy, hero alt text, and the gallery accessibility label, and changed the Stage 1 display to `MULTI PERM CREAM`.
- Rebuilt all 70 Shopee source JPEGs and regenerated the corresponding 70 website gallery WebPs from those corrected images. Production has not been updated.

- Added a backward-compatible product union, locale fallback helpers, and Valentine-only asset metadata.
- Added a server product list with a narrow client card payload and a keyboard-accessible Magic selector.
- Added Thai-first summaries, metadata, noindex detail pages, and compact grouped WebP assets generated from the approved clean cutouts.
- Added complete editorial HTML sections for Magic and L.P.P instead of repeating raw pouch images.
- Preserved the legacy root asset resolver and legacy status footer behavior.
- Added Playwright coverage for the list, formula states, locale fallback, metadata, 360 px overflow, dark mode, reduced motion, JavaScript-disabled fallback, and extensionless 404 handling.

## 2026-07-23 correction: Shopee visual gallery and catalog card proportions

- Added `src/data/valentine-gallery.ts` as the ordered 8-main plus 6-detail manifest and `ValentineShopeeGallery` as the Valentine-only interactive gallery.
- Magic defaults to H1 and exposes accessible H1, D1, C2, and L2 pressed controls; selecting one renders only that product's 14 WebP images. L.P.P renders its independent 14-image gallery.
- Updated the deterministic asset script to import all 70 approved Shopee JPGs at their original 1080×1080 or 1080×1350 dimensions into the two Valentine product directories.
- Applied `h-full` and a Valentine-only content minimum height to equalize the two catalog cards while leaving legacy card classes and content behavior unchanged.

## 2026-07-24 correction: Thai Multi Perm heading typography

- Replaced the three-break oversized heading with a responsive two-line hierarchy.
- Applied the explicit Plus Jakarta Sans and Noto Sans Thai stack so Latin and Thai glyphs use the intended loaded fonts.
- Added fluid heading sizes with fixed phrase boundaries to prevent Thai words from splitting inside the narrow hero column.
- Added 390 px and 1440 px browser assertions for line count, font stack, and overflow.

## 2026-07-24 correction: company product guide wording and source-layout refresh

- Regenerated the 70 Valentine gallery WebPs with `scripts/generate-valentine-assets.py`; Magic keeps its four selectable 14-image sets and L.P.P keeps its independent 14-image set. Root-level hero/thumb assets and the 16 legacy product records/assets were not changed.
- Replaced the visible `Shopee visual guide` label with `PROFESSIONAL PRODUCT GUIDE`, changed the section reference to `professional-product-guide-title`, and revised the Thai copy for a professional company product page.
- Extended the Valentine Playwright gallery scenario to require the new label and prohibit visible case-insensitive `Shopee` text within `#main-content` for both products.
- Kept the previously committed responsive two-line Thai hero heading and its `var(--font-jakarta), var(--font-noto-thai)` font stack unchanged.

## 2026-07-24 review-fix cycle 1: content-fit source card

- Ran `scripts/generate-valentine-assets.py` after the listing renderer replaced the non-L.P.P `desc-02` fixed white rectangle with an audited `การใช้งาน` chip and badge `1`.
- Regenerated exactly 70 gallery WebPs: four Magic product sets and one L.P.P set, each with eight main and six detail images. The script left root hero/thumb outputs and all 16 legacy product records/assets unchanged.
- The existing company guide label and no-visible-Shopee browser guard remain unchanged.

## 2026-07-24 review-fix cycle 2: final Valentine visual safeguards

- Reduced the second fixed hero phrase to `clamp(1.125rem, 5.3vw, 2rem)` while retaining `whitespace-nowrap`, so the intended two-line hierarchy fits a 320 px document.
- Added a Valentine-only explicit `var(--font-jakarta), var(--font-noto-thai), sans-serif` heading style to product-detail and `#professional-product-guide-title` headings; no global heading token or legacy product component changed.
- Added browser assertions for document-level width at 320, 360, 390, and 1440 px, Range client-rect single-line checks for both hero spans, and the 4:5 detail-gallery image ratio alongside the square main ratio.
- Extended `scripts/verify-products.mjs` to remove scripts, styles, and markup before rejecting visible case-insensitive `Shopee` in every generated Valentine route.
- Regenerated exactly 70 Valentine gallery WebPs with `scripts/generate-valentine-assets.py`. Hero/thumb outputs and legacy assets were not regenerated.
