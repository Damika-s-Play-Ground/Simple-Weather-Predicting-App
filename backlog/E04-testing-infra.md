# E04 — Testing & quality infrastructure

**Goal:** upgrade from "ported to Vitest" (done in E02) to a modern, layered
test stack: current Testing Library majors, network-level mocking with MSW,
Playwright E2E smoke against the built app, automated a11y checks, and higher
coverage floors.
**Phase:** M0–M1. **Depends on:** E02 (done). **Libraries:** msw,
@playwright/test, vitest-axe (or axe-core), Testing Library v16/v14/v6.

## Library upgrades

- [x] [E04-001] (M) Upgrade @testing-library/jest-dom 5 → 6 and switch setup to the `/vitest` entry — AC: suite green on v6 matchers.
- [x] [E04-002] (M) Upgrade @testing-library/react 13 → 16 — AC: suite green; no deprecated API warnings.
- [x] [E04-003] (L) Upgrade @testing-library/user-event 13 → 14 and migrate all suites to the async `userEvent.setup()` API — AC: no direct `userEvent.<action>` static calls remain.
- [x] [E04-004] (S) Replace `fireEvent.keyDown` combobox navigation in App tests with v14 `user.keyboard` — AC: keyboard-nav test uses userEvent only.
- [ ] [E04-005] (S) Add eslint-plugin-testing-library (flat config, recommended rules for test files) — AC: lint passes with the plugin active.

## MSW (network-level mocking)

- [ ] [E04-010] (M) Add msw devDep and `src/test/server.js` with default handlers for /weather (q + lat/lon), /forecast, /geo/1.0/direct — AC: server exports handlers reused across suites.
- [ ] [E04-011] (S) Wire server lifecycle into setupTests (listen/resetHandlers/close) — AC: suites run with MSW active.
- [ ] [E04-012] (M) Migrate App.test.jsx from axios `vi.mock` to MSW handlers — AC: no axios mock factory in App tests.
- [ ] [E04-013] (M) Migrate useWeather + api tests to MSW (per-test handler overrides for deferred/stale-response scenarios) — AC: no `vi.mock("axios")` anywhere.
- [ ] [E04-014] (M) Error-path handler tests: 404 city, 500 server, network error — AC: each surfaces the correct inline message.
- [ ] [E04-015] (S) 429 rate-limit handler test documenting current behavior — AC: assertion matches implemented handling.
- [ ] [E04-016] (S) Shared fixtures module `src/test/fixtures.js` (weather/forecast/geo builders) deduplicating App/hook copies — AC: fixtures imported, duplicates deleted.

## Playwright E2E

- [ ] [E04-020] (M) Add @playwright/test + config running against `vite preview` (webServer) — AC: `npx playwright test` runs locally.
- [ ] [E04-021] (M) Route-interception API mocks in E2E (no real key needed in CI) — AC: specs pass with network blocked.
- [ ] [E04-022] (M) Smoke spec: load app → card renders → search a city → card updates — AC: green headless.
- [ ] [E04-023] (S) Spec: °C/°F choice survives reload — AC: green.
- [ ] [E04-024] (S) Spec: theme toggle cycles and persists across reload — AC: green.
- [ ] [E04-025] (M) Spec: autocomplete keyboard flow (type → arrows → enter → coords fetch) — AC: green.
- [ ] [E04-026] (S) Spec: favorite pin/unpin round-trip — AC: green.
- [ ] [E04-027] (M) CI job `e2e` (chromium only, needs test job artifact) — AC: E2E runs on push, red fails the pipeline.
- [ ] [E04-028] (S) Failure artifacts: traces + screenshots uploaded on E2E failure — AC: artifact present on a forced failure, then revert.

## Accessibility automation

- [ ] [E04-030] (M) Add vitest-axe helper + first axe test on the default view — AC: zero violations or violations filed as E00 items.
- [ ] [E04-031] (S) Axe test: dark-mode view — AC: zero violations (contrast included).
- [ ] [E04-032] (S) Axe test: combobox open state with options — AC: zero violations.
- [ ] [E04-033] (S) Axe test: error + loading (skeleton) states — AC: zero violations.

## Coverage & quality

- [ ] [E04-040] (M) Cover useWeather geolocation paths (success, denied, unsupported browser) — AC: branch coverage of useMyLocation 100%.
- [ ] [E04-041] (S) Cover refresh() no-op before first load and clearRecentSearches storage-error path — AC: lines covered.
- [ ] [E04-042] (S) Render tests for WeatherSkeleton and Footer — AC: components covered.
- [ ] [E04-043] (S) Raise coverage thresholds to 85/85/80/85 after gap-fill — AC: CI green at new floor.
- [ ] [E04-044] (S) Strengthen the stale-response test to also assert forecast/hourly are from the newer response — AC: assertions added.
- [ ] [E04-045] (S) Audit for data-testid usage; replace with role/label queries where feasible — AC: remaining testids justified in a comment.
