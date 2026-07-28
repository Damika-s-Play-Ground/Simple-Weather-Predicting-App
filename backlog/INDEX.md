# Backlog Index — epic router

Read by every firing (see `AUTOLOOP.md` §2.2). Rows are in **execution order**.
Statuses: `ACTIVE` (being executed), `QUEUED (authored)` (file complete, waiting),
`QUEUED (unauthored)` (file not yet written — authoring firing needed),
`DONE`, `CONTINUOUS` (never closes).

| Epic | File                    | Status              | Done/Total | Phase      | Notes                                |
| ---- | ----------------------- | ------------------- | ---------- | ---------- | ------------------------------------ |
| E00  | E00-bugs.md             | CONTINUOUS          | 0/0        | —          | Always drained first                 |
| E01  | E01-ci-hardening.md     | DONE                | 30/30      | M0         |                                      |
| E02  | E02-vite-migration.md   | QUEUED (unauthored) | 0/~40      | M0         | Staged, always-green                 |
| E04  | E04-testing-infra.md    | QUEUED (unauthored) | 0/~90      | M0         | Vitest, RTL 16, MSW, Playwright      |
| E06  | E06-design-system.md    | QUEUED (unauthored) | 0/~120     | M0–M1      | Tokens → CSS Modules → primitives    |
| E03  | E03-typescript.md       | QUEUED (unauthored) | 0/~80      | M0–M1      | Leaf-first, allowJs                  |
| E21  | E21-dark-mode.md        | QUEUED (unauthored) | 0/~45      | M1         | Needs E06 semantic tokens            |
| E09  | E09-data-layer.md       | QUEUED (unauthored) | 0/~55      | M1         | Provider abstraction + Open-Meteo    |
| E10  | E10-search-favorites.md | QUEUED (unauthored) | 0/~55      | M1         | Geocoding autocomplete, favorites    |
| E11  | E11-forecast-depth.md   | QUEUED (unauthored) | 0/~60      | M2         | SVG charts, day details              |
| E12  | E12-environmental.md    | QUEUED (unauthored) | 0/~45      | M2         | AQI (OWM), UV (Open-Meteo)           |
| E13  | E13-astronomy.md        | QUEUED (unauthored) | 0/~35      | M2         | Client-side math, zero API           |
| E15  | E15-routing-shell.md    | QUEUED (unauthored) | 0/~45      | M2–M3      | react-router v7, HashRouter          |
| E14  | E14-radar-maps.md       | QUEUED (unauthored) | 0/~55      | M2         | Leaflet + RainViewer (free)          |
| E05  | E05-a11y.md             | QUEUED (unauthored) | 0/~60      | M3         | WCAG 2.2 AA deep pass                |
| E08  | E08-pwa-offline.md      | QUEUED (unauthored) | 0/~50      | M3         | vite-plugin-pwa, offline paint       |
| E16  | E16-settings.md         | QUEUED (unauthored) | 0/~40      | M3         | Context + localStorage, no state lib |
| E17  | E17-i18n.md             | QUEUED (unauthored) | 0/~40      | M3         | Intl APIs, OWM lang param            |
| E07  | E07-performance.md      | QUEUED (unauthored) | 0/~50      | M4         | Budgets, fetch, SVG gauge            |
| E18  | E18-motion-delight.md   | QUEUED (unauthored) | 0/~45      | M4         | Animated icons, particles            |
| E19  | E19-insights.md         | QUEUED (unauthored) | 0/~40      | M4         | Advisory rules, NWS optional         |
| E20  | E20-docs-dx.md          | QUEUED (unauthored) | 0/~25      | Continuous | ADRs, architecture doc               |

Target total: ~1,015 items + E00/audit replenishment over time.
