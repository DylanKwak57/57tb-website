# Project Memory

- 2026-07-23: Added two noindex Valentine products: Magic Straight System and L.P.P Treatment.
- Valentine uses compact root-level `hero.webp` and `thumb.webp`; legacy public assets retain their original root chunk paths.
- Magic uses label-only neutral Stage 1 and Stage 2 selection, with no manufacturer pairing recommendation. Legacy title, `← BELLISTA`, English primary list copy, thumbnails, and footer are isolated from Valentine rendering.
- Passed: unit tests, product validation, TypeScript, 76-page build, 54-route static verification, and 5 Playwright browser tests. Existing product public assets have a zero-file diff.
- PR #1 merged at `1e8f18624e194ee668570f493e1233800bfaacbe` and deployed to `https://57tb.art` on 2026-07-23. Production smoke checks passed for the list, both Valentine products, locale variants, representative legacy products, 404 behavior, metadata, mobile interaction, and horizontal overflow.
