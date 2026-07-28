# E02 — Vite migration

**Goal:** replace EOL react-scripts with Vite + Vitest: fast builds, native ESM
tests, kills the 69 CRA-transitive audit vulns, unblocks TS/router/PWA epics.
**Phase:** M0. **Depends on:** nothing. **Libraries:** vite, @vitejs/plugin-react,
vitest, jsdom.

- [x] [E02-001] (M) Add vite, @vitejs/plugin-react, vitest, jsdom devDeps — AC: `npx vite --version` works.
- [x] [E02-002] (S) Move `public/index.html` to root with `<script type="module" src="/src/index.jsx">`, drop `%PUBLIC_URL%` — AC: `vite dev` serves the app shell.
- [x] [E02-003] (S) `vite.config.js` with `base: "/Simple-Weather-Predicting-App/"` + react plugin — AC: built asset URLs carry the sub-path.
- [x] [E02-004] (S) Vitest config block (jsdom env, globals, setupFiles, css) — AC: `vitest run` discovers all suites.
- [x] [E02-005] (M) Rename all JSX-containing `.js` files to `.jsx` — AC: esbuild parses every source file.
- [x] [E02-006] (S) Swap `process.env.REACT_APP_OWM_KEY` → `import.meta.env.VITE_OWM_KEY` in src — AC: no `process.env` reference remains in src.
- [x] [E02-007] (S) Update `.env`, `.env.example`, README for the `VITE_OWM_KEY` name — AC: docs show only the new name.
- [x] [E02-008] (S) CI maps `VITE_OWM_KEY: ${{ secrets.REACT_APP_OWM_KEY }}` (no GitHub secret rename needed) — AC: build step env uses the new var.
- [x] [E02-009] (M) Port all 5 test suites `jest.*` → `vi.*` — AC: 35 tests green under `vitest run`.
- [x] [E02-010] (S) Key-guard tests use `vi.stubEnv` instead of mutating `process.env` — AC: missing-key test passes with env stubbing.
- [x] [E02-011] (S) Rewrite npm scripts: dev/build/preview/test/test:watch/lint — AC: each script runs.
- [x] [E02-012] (S) Remove react-scripts, web-vitals, reportWebVitals.js, unused logo.svg — AC: `npm ls react-scripts` empty; app boots.
- [x] [E02-013] (M) ESLint 9 flat config (js recommended + react-hooks + prettier) replacing CRA's package.json eslintConfig — AC: `npm run lint` passes with 0 warnings.
- [x] [E02-014] (S) `.gitignore` adds `dist/`; drop `homepage` + `browserslist` fields — AC: `git status` clean after build.
- [x] [E02-015] (S) CI build/publish switches to `dist/` — AC: deploy step publishes `./dist`.
- [x] [E02-016] (S) Manual `deploy` script targets `dist` — AC: `gh-pages -d dist` configured.
- [x] [E02-017] (S) Verify sub-path correctness in output — AC: `dist/index.html` references `/Simple-Weather-Predicting-App/assets/...`.
- [x] [E02-018] (S) Move testing libraries from dependencies to devDependencies — AC: prod deps are react, react-dom, axios, react-gauge-chart only.
- [x] [E02-019] (S) Update AUTOLOOP.md gate commands (`vitest run`, `vite build`, main bundle glob `dist/assets/*.js`) — AC: runbook matches reality.
- [x] [E02-020] (L) Post-deploy verification: `gh run watch` green + live smoke + re-record `size:` baseline in ledger — AC: live site renders weather on the new toolchain.
- [x] [E02-021] (M) Replace react-gauge-chart with a hand-rolled SVG gauge (its missing prop-types import breaks Rolldown; also removes the last 3 prod vulns and ~30 KB) — AC: gauge renders 20 segments + clamped needle, dep gone.
