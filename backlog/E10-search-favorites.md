# E10 — Search, location & favorites UX

**Goal:** typo-proof, fast city selection: debounced geocoding autocomplete
with a keyboard-accessible combobox, plus pinned favorite cities.
**Phase:** M1. **Depends on:** E02. **APIs:** OWM Geocoding
(`/geo/1.0/direct`, free tier, same key).

## Autocomplete

- [x] [E10-001] (S) `useDebouncedValue` hook (default 300 ms) — AC: unit-tested with fake timers.
- [x] [E10-002] (M) `src/api/geocoding.js`: `fetchCitySuggestions(q)` → up to 5 `{name, state, country, lat, lon}` — AC: unit-tested mapping, empty for short/blank queries.
- [x] [E10-003] (S) `searchCoords(lat, lon, label)` action on useWeather (coords query beats name ambiguity) — AC: hook fetches by lat/lon.
- [x] [E10-004] (M) Suggestion dropdown under the city input (fetches at ≥2 chars debounced) — AC: suggestions render with "City, State, CC" labels.
- [x] [E10-005] (M) ARIA combobox pattern (role=combobox, aria-expanded, listbox+option, aria-activedescendant) — AC: roles/relations correct in tests.
- [x] [E10-006] (M) Keyboard nav: ArrowDown/ArrowUp move, Enter selects, Escape closes — AC: covered by tests.
- [x] [E10-007] (S) Click-outside and blur close the listbox — AC: covered by a test.
- [x] [E10-008] (S) Selecting a suggestion fetches by coordinates and fills the input — AC: integration test green.

## Favorites

- [x] [E10-020] (M) `useFavorites` hook: pin/unpin `{name, lat, lon}`, persisted, capped at 8 — AC: unit-tested.
- [x] [E10-021] (S) Star button on the weather card header toggling the current city — AC: aria-pressed reflects state.
- [x] [E10-022] (S) Favorite chips row (before recents) fetching by stored coords — AC: click loads the city.
- [x] [E10-023] (S) Tests: pin → chip appears → unpin → gone; persistence across remount — AC: green.
