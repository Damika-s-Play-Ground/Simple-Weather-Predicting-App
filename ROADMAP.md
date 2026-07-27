# Roadmap — auto/level-up

Incremental improvements to the Create React App weather app. One focused item per iteration.

## Correctness & security
- [x] Fix mixed-content bug: weather icon `src` uses http:// — switch to https:// (currently fails on GitHub Pages). _Switched icon URL to https://; also repaired the broken test suite (mocked axios + react-gauge-chart ESM deps, real render assertion) so `CI=true npm test` passes._
- [x] Move the hardcoded OpenWeather API key out of App.js into `.env` as REACT_APP_OWM_KEY read via process.env; add `.env.example`; document setup in README; note the exposed key must be rotated. _App.js now reads process.env.REACT_APP_OWM_KEY; added .env.example, gitignored .env, and a README setup + key-rotation warning._
- [x] Request `units=metric` from the API and drop the manual Kelvin math scattered in the component. _Added &units=metric to the request; temperature now arrives in Celsius, so removed the -273.15 conversions in the header and gauge helper._

## UX & resilience
- [x] Replace alert() with an inline styled error message; add loading and empty states. _Replaced alert() with an inline role="alert" error box; added loading ("Loading weather…") and empty states inside an aria-live weather section; allData is now null until first load._
- [x] Trim/guard empty searches. _fetchData now trims input and short-circuits blank searches with a "Please enter a city name." message; also URL-encodes the city to handle spaces/special chars safely._
- [x] Add backgrounds for snow, thunderstorm, mist/fog, drizzle with a sensible default. _Added thunderstorm/snowy/drizzle/misty background classes + a default-sky fallback; reordered matching so specific conditions win over the generic "rain" substring._

## Features
- [x] °C/°F unit toggle. _Added a unit state + accessible °C/°F toggle (aria-pressed); temperature is stored in Celsius and converted for display, so switching units needs no refetch._
- [x] "Use my location" via the Geolocation API. _Added a "📍 Use my location" button; refactored fetch into a shared fetchByQuery helper reused by city and lat/lon lookups, with graceful errors for unsupported/denied geolocation._
- [x] Recent-searches / favorite cities in localStorage. _Successful lookups are saved to localStorage (deduped, capped at 5, most-recent first) and rendered as clickable chips under the form; storage errors are ignored gracefully._
- [ ] 5-day forecast section.

## Code quality
- [ ] Split App.js into components (SearchForm, WeatherCard, Gauge, Footer) + an API module + a useWeather hook.
- [ ] Add Prettier + ESLint and format the codebase.
- [ ] Write real tests: render, search happy-path, error path.
- [ ] Add a GitHub Actions workflow running build + tests on push/PR.

## Polish
- [ ] Accessibility: labels, alt text, keyboard focus, aria-live for results/errors.
- [ ] Responsive pass + loading skeletons.
- [ ] Refresh README (features, env setup, screenshots).
