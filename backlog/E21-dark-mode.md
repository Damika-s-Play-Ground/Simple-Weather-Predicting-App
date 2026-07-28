# E21 — Dark mode & theming

**Goal:** tri-state theme (system/light/dark) with persisted preference,
no-flash boot, dark values for every semantic token and sky theme.
**Phase:** M1. **Depends on:** E06 tokens. **Libraries:** none.

- [x] [E21-001] (M) Dark overrides for all semantic tokens under `[data-theme="dark"]` — AC: surfaces/text/actions/feedback/skeleton have dark values.
- [x] [E21-002] (S) Dark variants for the 7 sky themes + default + main (static gradients, animation off in dark) — AC: every background class has a dark rule.
- [x] [E21-003] (M) `useTheme` hook: tri-state (system/light/dark) persisted in localStorage, resolves system via matchMedia with live change listener — AC: covered by hook tests.
- [x] [E21-004] (S) Hook applies `data-theme` on `<html>` and syncs `<meta name="theme-color">` — AC: meta content differs between modes.
- [x] [E21-005] (S) No-flash inline boot script in index.html sets `data-theme` before first paint — AC: script reads localStorage + prefers-color-scheme with try/catch.
- [x] [E21-006] (S) Theme toggle button (cycles system → light → dark, shows current mode, aria-label) — AC: keyboard accessible, state announced.
- [x] [E21-007] (S) matchMedia mock in test setup — AC: full suite runs with components using matchMedia.
- [x] [E21-008] (M) Tests: default resolution, cycle + persistence, explicit dark applies attr + meta — AC: ≥4 new assertions green.
