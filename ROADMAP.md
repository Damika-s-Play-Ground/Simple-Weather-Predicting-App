# Roadmap — auto/level-up

Incremental improvements to the Create React App weather app. One focused item per iteration.

## Correctness & security

- [x] Fix mixed-content bug: weather icon `src` uses http:// — switch to https:// (currently fails on GitHub Pages). _Switched icon URL to https://; also repaired the broken test suite (mocked axios + react-gauge-chart ESM deps, real render assertion) so `CI=true npm test` passes._
- [x] Move the hardcoded OpenWeather API key out of App.js into `.env` as REACT*APP_OWM_KEY read via process.env; add `.env.example`; document setup in README; note the exposed key must be rotated. \_App.js now reads process.env.REACT_APP_OWM_KEY; added .env.example, gitignored .env, and a README setup + key-rotation warning.*
- [x] Request `units=metric` from the API and drop the manual Kelvin math scattered in the component. _Added &units=metric to the request; temperature now arrives in Celsius, so removed the -273.15 conversions in the header and gauge helper._

## UX & resilience

- [x] Replace alert() with an inline styled error message; add loading and empty states. _Replaced alert() with an inline role="alert" error box; added loading ("Loading weather…") and empty states inside an aria-live weather section; allData is now null until first load._
- [x] Trim/guard empty searches. _fetchData now trims input and short-circuits blank searches with a "Please enter a city name." message; also URL-encodes the city to handle spaces/special chars safely._
- [x] Add backgrounds for snow, thunderstorm, mist/fog, drizzle with a sensible default. _Added thunderstorm/snowy/drizzle/misty background classes + a default-sky fallback; reordered matching so specific conditions win over the generic "rain" substring._

## Features

- [x] °C/°F unit toggle. _Added a unit state + accessible °C/°F toggle (aria-pressed); temperature is stored in Celsius and converted for display, so switching units needs no refetch._
- [x] "Use my location" via the Geolocation API. _Added a "📍 Use my location" button; refactored fetch into a shared fetchByQuery helper reused by city and lat/lon lookups, with graceful errors for unsupported/denied geolocation._
- [x] Recent-searches / favorite cities in localStorage. _Successful lookups are saved to localStorage (deduped, capped at 5, most-recent first) and rendered as clickable chips under the form; storage errors are ignored gracefully._
- [x] 5-day forecast section. _Added a parallel /forecast fetch collapsed into up to 5 daily min/max cards (midday icon), rendered as a strip below current conditions and honoring the °C/°F toggle._

## Code quality

- [x] Split App.js into components (SearchForm, WeatherCard, Gauge, Footer) + an API module + a useWeather hook. _Extracted src/api/weather.js, src/hooks/useWeather.js, src/utils/format.js, and SearchForm/WeatherCard/Gauge/Footer components; App.js is now ~55 lines of composition with no behavior change._
- [x] Add Prettier + ESLint and format the codebase. _CRA already ships ESLint (react-app); added Prettier + eslint-config-prettier, a .prettierrc.json + .prettierignore, format/format:check scripts, extended eslintConfig with "prettier", and formatted the whole repo._
- [x] Write real tests: render, search happy-path, error path. _Added 4 tests: form render, default-city mount fetch, typed-city search, and failed-lookup inline error; axios is mocked per-URL. Also hardened SearchForm to read the input via e.currentTarget.elements.city._
- [x] Add a GitHub Actions workflow running build + tests on push/PR. _Added .github/workflows/ci.yml: runs tests + build on every push/PR to main and auto-deploys the built app to the gh-pages branch on push to main (REACT_APP_OWM_KEY provided via repo secret)._

## Polish

- [x] Accessibility: labels, alt text, keyboard focus, aria-live for results/errors. _Added a visually-hidden label for the city input, role="search" on the form, aria-hidden decorative emoji (pin/heart), aria-labels on recent chips, and a visible :focus-visible outline; results/errors already use aria-live + role="alert" and icons have descriptive alt text._
- [x] Responsive pass + loading skeletons. _Replaced the "Loading…" text with a shimmering WeatherSkeleton (reduced-motion aware, sr-only announcement); made the layout mobile-friendly — min-height instead of clipped 100vh, scrollable, wrapping form, and a fluid weather card with a small-screen media query._
- [x] Refresh README (features, env setup, screenshots). _Documented all new features, fixed the repo/live-app URLs (Damika-Anupama → Damika-s-Play-Ground), and added a Deployment section._

## Enhancements (round 2)

Added after the seed backlog was completed — re-audit of remaining worthwhile work.

- [x] Guard against out-of-order/stale responses so a slow earlier search can't overwrite a newer one. _useWeather now tags each request with a monotonic id (useRef) and ignores results from any superseded request; added a test that resolves an older request after a newer one and asserts the newer city stays._
- [x] Unit-test the pure helpers (buildDailyForecast, getWeatherBackground, displayTemperature, dayName). _Added src/utils/format.test.js and src/api/weather.test.js: 11 focused unit tests covering background precedence, temp clamping/conversion, weekday formatting, and forecast aggregation/cap (16 tests total across the suite)._
- [x] Show "feels like" temperature and sunrise/sunset in the weather card. _buildCurrent now surfaces feels_like, sunrise, sunset, and the location timezone; WeatherCard shows "Feels Like" (honoring the unit toggle) and localized Sunrise · Sunset via a new formatTime helper (UTC + city offset), all guarded for payloads without them._
- [x] Persist the user's unit (°C/°F) preference in localStorage. _unit initializes from localStorage and is written back on change; added a test that presets "F" and asserts the card loads in Fahrenheit, plus localStorage.clear() in beforeEach for test isolation._
- [x] Add a "Clear" control for recent searches. _Added a clearRecentSearches action (empties state + removes the localStorage key) exposed via useWeather and a "Clear" button next to the chips; covered by a test that clicks Clear and asserts the chips and storage key are gone._
- [x] Bump CI off deprecated Node 20 action runtime (setup-node version). _Upgraded actions/checkout and actions/setup-node from v4 to v5 (Node 24 runtime) and bumped the build's node-version from 20 to 22 (current LTS), clearing the Node 20 deprecation warning._
