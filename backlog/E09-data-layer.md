# E09 — Data layer & provider abstraction

**Goal:** isolate weather data behind a provider interface with caching and
resilient fetching; add Open-Meteo (free, no key) as a second provider for
data OWM's free tier lacks (UV, true 1-hour resolution).
**Phase:** M1. **Depends on:** E02. **APIs:** OWM 2.5 + Geocoding + Air
Pollution (existing key), Open-Meteo (no key). One Call 3.0 stays excluded.

## Fetch foundation

- [ ] [E09-001] (M) `src/api/http.js`: fetch wrapper with 10 s AbortSignal timeout, JSON parse guard, typed errors — AC: unit-tested (ok, http-error, timeout, bad-JSON).
- [ ] [E09-002] (S) Typed error taxonomy `{kind: "network"|"notfound"|"config"|"ratelimit"|"server"}` — AC: wrapper maps status codes to kinds.
- [ ] [E09-003] (M) Migrate `api/weather.js` from axios to the wrapper — AC: behavior identical; suites green.
- [ ] [E09-004] (S) Migrate `api/geocoding.js` off axios — AC: no axios import remains.
- [ ] [E09-005] (S) Remove the axios dependency — AC: `npm ls axios` empty; bundle shrinks.
- [ ] [E09-006] (M) Update all test mocks from axios to fetch stubbing (or MSW if E04-010 landed first) — AC: suites green without axios mocks.
- [ ] [E09-007] (S) useWeather maps error kinds to distinct user messages (notfound vs network vs ratelimit) — AC: message assertions per kind.

## Provider interface

- [ ] [E09-010] (M) Define `WeatherProvider` contract + normalized `WeatherSnapshot` shape in `src/api/provider.js` (JSDoc typedefs until E03) — AC: documented contract consumed by useWeather.
- [ ] [E09-011] (M) Wrap current OWM current+forecast+hourly mapping as `owmProvider` — AC: useWeather depends only on the contract.
- [ ] [E09-012] (M) `openMeteoProvider`: current + daily via Open-Meteo forecast API (no key) — AC: adapter unit tests with fixture payloads.
- [ ] [E09-013] (S) Open-Meteo hourly (true 1-h resolution) mapped to the hourly shape — AC: 24 slots at 1-h steps.
- [ ] [E09-014] (S) Provider selection seam (`getProvider(name)`, default OWM) — AC: unit-tested; settings wire-up deferred to E16.
- [ ] [E09-015] (S) Geocoding fallback: Open-Meteo geocoding when OWM key missing — AC: autocomplete works keyless.

## Caching & resilience

- [ ] [E09-020] (M) In-memory TTL cache (10 min) keyed by provider+query — AC: second identical call within TTL does not hit the network (unit-tested with fake timers).
- [ ] [E09-021] (S) sessionStorage persistence of the cache with schema version — AC: reload within TTL paints without a request.
- [ ] [E09-022] (M) Retry with backoff (2 retries, jitter) on network/5xx/429 — AC: unit-tested with fake timers.
- [ ] [E09-023] (S) `lastUpdated` reflects cache age (stale badge groundwork for E08) — AC: cached loads keep the original timestamp.
- [ ] [E09-024] (S) Refresh action bypasses the cache — AC: forced fetch test.

## Icons

- [ ] [E09-030] (M) Self-host the ~18 OWM icon codes as local SVGs under `src/assets/icons/` — AC: no openweathermap.org img hotlinks.
- [ ] [E09-031] (S) Icon component mapping code → asset with alt text — AC: WeatherCard/hourly/forecast use it.
