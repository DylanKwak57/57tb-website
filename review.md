# Valentine Products Review

Review-fix cycle 1: removed duplicate raw Valentine pouch stacks and replaced them with generated grouped hero imagery and HTML detail sections. Legacy product list/detail rendering is now isolated from Valentine behavior: legacy cards use object-cover, English primary copy, Thai secondary copy, and legacy details render `← BELLISTA` with the original image stack/footer.

Final local verification passed:

- `npm test`: 4 application-logic tests.
- `npm run validate:products`: exact Valentine asset sets, dimensions, budgets, catalog identity, legacy metadata guard.
- `npx tsc --noEmit`.
- `npm run build`: 76 static pages and 54 product detail routes.
- `npm run verify:products`: all 54 routes, image decode, legacy/Valentine content guards.
- `npm run test:e2e`: 5 Chromium tests covering list visibility, formula initial/partial/complete/reset, locale fallback, metadata, L.P.P facts, 404, 360 px overflow, dark theme, reduced motion, and JavaScript-disabled neutral table.
- `git diff --check`.

Visual evidence was captured after the final build at 390 px and 1440 px for both Valentine pages, including a 390 px dark-theme Magic page. No existing product asset changed.
