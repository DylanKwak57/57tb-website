# Valentine Products Implementation

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
