# Valentine Products

## 2026-07-24 Formula Finder desktop alignment

- Objective: make the two Formula Finder fieldsets and all H1/D1/C2/L2 option cards equal height at desktop widths, while retaining compact content-driven mobile cards.
- Root cause: the hair-condition help link lived only in the Step 1 grid item, causing an asymmetric grid row and preventing the two fieldsets from sharing the same usable card height.
- Scope: only Formula Finder layout, its Playwright geometry coverage, and these project records change. Legacy products, product content, and assets remain untouched.
- Verification completed at the root: `npm test` passed 5/5; `npm run validate:products`, `npx tsc --noEmit`, `npm run build` (76 pages), `npm run verify:products` (54 routes), `npm run test:e2e` (8/8), and `git diff --check` passed. Playwright passed after an unrelated stale static server it was configured to reuse was stopped. Manual Chromium checks confirm 0 px fieldset and option-card deltas at 1440 px and 2048 px; at 390 px, `scrollWidth` equals 390 px and card heights remain content-driven.

Approved design: `/Users/dylanmacm5pro/.gstack/projects/DylanKwak57-57tb-website/dylanmacm5pro-main-design-20260723-135207.md`.

Boundary: add only the Valentine Magic Straight System and L.P.P Treatment. Existing 16 products, public assets, navigation, sitemap, pricing, inventory, and purchase flows remain unchanged. Magic is a neutral two-stage selection guide, not a recommendation engine.

## Final Multi Perm terminology correction — 2026-07-23

Valentine H1/D1/C2/L2 is `Valentine Professional น้ำยา Multi Perm`: a professional multi-perm chemical system usable for digital perm, volume straightening (volume magic), and rebonding. Its Thai headline is `น้ำยา Multi Perm 2 ขั้นตอน สำหรับช่างมืออาชีพ`; its explanation is `น้ำยายืดผมและน้ำยาดัดผมอเนกประสงค์สำหรับงานซาลอน`; its use line is `ใช้ได้ทั้งดัดดิจิตอล ยืดวอลลุ่ม (วอลลุ่มเมจิก) และรีบอนดิ้ง`. Its stable route remains `/products/valentine-magic-straight-system`; official individual pouch names remain unchanged. This correction is prepared locally only and has not updated production.

## 2026-07-23 correction: Shopee visual gallery and catalog card proportions

- Preserve the existing Valentine hero, Thai structured content, formula finder, metadata, and noindex behavior.
- Add all 70 approved Shopee source images as ordered WebP gallery assets. Magic loads one selected set of 14 images at a time; L.P.P loads its 14-image set.
- Equalize only the two Valentine catalog cards at mobile and desktop, without modifying the 16 legacy product cards or assets.

## 2026-07-24 correction: Thai Multi Perm heading typography

- Limit the change to the Multi Perm hero heading and its regression guards.
- Use the loaded Thai-capable font stack instead of the Latin-only heading stack.
- Replace automatic word wrapping with two intentional phrases: `น้ำยา Multi Perm` and `2 ขั้นตอน สำหรับช่างมืออาชีพ`.
- Keep both phrases on one line at 390 px and 1440 px without horizontal overflow; preserve all product copy, imagery, galleries, and legacy products.

## 2026-07-24 correction: company product guide wording and source-layout refresh

- Preserve the already-correct two-line Thai Multi Perm heading and its Noto Sans Thai stack.
- Regenerate only the 70 Valentine gallery WebPs after the listing generator's Thai title/card layout correction; do not alter the hero/thumb outputs or any of the 16 legacy product records/assets.
- Replace customer-visible Shopee gallery wording and its accessibility identifier with `PROFESSIONAL PRODUCT GUIDE` and natural Thai company-page explanatory copy.
- Add browser coverage requiring the company page main content to contain the new label and no visible `Shopee` text.

## 2026-07-24 review-fix cycle 1: content-fit source card

- Regenerate the same 70 Valentine gallery WebPs after replacing the non-L.P.P source `desc-02` fixed white card with its audited content-fit card.
- Preserve the company-facing `PROFESSIONAL PRODUCT GUIDE` wording, all hero/thumb outputs, and the 16 legacy product records/assets.
- Browser E2E is a required release gate and passed all 7 Chromium scenarios after regeneration.

## 2026-07-24 review-fix cycle 2: final Valentine visual safeguards

- Keep the Magic hero at exactly two non-wrapping phrases while fitting the second line at 320 px through 1440 px; document-level overflow and per-span visual-line coverage are required.
- Apply the loaded Noto Thai fallback only to Valentine detail and professional-guide headings, leaving the 16 legacy product heading token unchanged.
- Regenerate exactly 70 Valentine gallery WebPs from the rebuilt 70 source JPEGs. Preserve hero/thumb files and all legacy assets.
- Require static generated Valentine HTML to have no visible case-insensitive `Shopee` after scripts, styles, and tags are removed. Keep the browser guard and add a 4:5 detail-gallery ratio assertion.

## 2026-07-24 systemic Valentine gallery alignment

- Regenerate the Valentine galleries from the source renderer's family-wide alignment correction instead of applying another single-image exception.
- Replace only the generated Valentine gallery WebPs. Keep all product data, page components, hero/thumb files, and the 16 legacy product assets unchanged.
- Release gates: exact 70-asset validation, 76-page production build, 54-route static verification, eight Chromium scenarios, decoded desktop/mobile gallery images, and no horizontal overflow.
