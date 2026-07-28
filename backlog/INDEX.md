# Backlog Index — epic router

Read by every firing (see `AUTOLOOP.md` §2.2). Rows are in **execution order**.
Statuses: `ACTIVE` (being executed), `QUEUED (authored)` (file complete, waiting),
`QUEUED (unauthored)` (file not yet written — authoring firing needed),
`DONE`, `CONTINUOUS` (never closes).

Maintenance rule: after editing this table, verify the edit landed with a
`grep` assert — silent regex misses caused drift once (BUG-003).

| Epic | File                    | Status              | Done/Total | Phase      | Notes                                |
| ---- | ----------------------- | ------------------- | ---------- | ---------- | ------------------------------------ |
| E00  | E00-bugs.md             | CONTINUOUS          | 3/3        | —          | Always drained first                 |
| E01  | E01-ci-hardening.md     | DONE                | 30/30      | M0         |                                      |
| E02  | E02-vite-migration.md   | DONE                | 21/21      | M0         | CRA removed; audit 69→0              |
| E04  | E04-testing-infra.md    | ACTIVE              | 4/31       | M0–M1      | MSW, Playwright, axe, RTL majors     |
| E06  | E06-design-system.md    | DONE                | 19/19      | M0–M1      | Tokens + primitives + split styles   |
| E03  | E03-typescript.md       | QUEUED (unauthored) | 0/~80      | M0–M1      | Leaf-first, allowJs                  |
| E21  | E21-dark-mode.md        | DONE                | 8/8        | M1         | Tri-state, no-flash, dark skies      |
| E09  | E09-data-layer.md       | QUEUED (authored)   | 0/20       | M1         | Provider abstraction + Open-Meteo    |
| E10  | E10-search-favorites.md | DONE                | 12/12      | M1         | Combobox autocomplete + favorites    |
| E11  | E11-forecast-depth.md   | QUEUED (unauthored) | 0/~60      | M2         | SVG charts, day details              |
| E12  | E12-environmental.md    | QUEUED (unauthored) | 0/~45      | M2         | AQI (OWM), UV (Open-Meteo)           |
| E13  | E13-astronomy.md        | QUEUED (unauthored) | 0/~35      | M2         | Client-side math, zero API           |
| E15  | E15-routing-shell.md    | QUEUED (unauthored) | 0/~45      | M2–M3      | react-router v7, HashRouter          |
| E14  | E14-radar-maps.md       | QUEUED (unauthored) | 0/~55      | M2         | Leaflet + RainViewer (free)          |
| E05  | E05-a11y.md             | QUEUED (unauthored) | 0/~60      | M3         | WCAG 2.2 AA deep pass                |
| E08  | E08-pwa-offline.md      | QUEUED (unauthored) | 0/~50      | M3         | vite-plugin-pwa, offline paint       |
| E16  | E16-settings.md         | QUEUED (unauthored) | 0/~40      | M3         | Context + localStorage, no state lib |
| E17  | E17-i18n.md             | QUEUED (unauthored) | 0/~40      | M3         | Intl APIs, OWM lang param            |
| E07  | E07-performance.md      | QUEUED (unauthored) | 0/~50      | M4         | Budgets, code split, Lighthouse      |
| E18  | E18-motion-delight.md   | QUEUED (unauthored) | 0/~45      | M4         | Animated icons, particles            |
| E19  | E19-insights.md         | QUEUED (unauthored) | 0/~40      | M4         | Advisory rules, NWS optional         |
| E20  | E20-docs-dx.md          | QUEUED (unauthored) | 0/~25      | Continuous | ADRs, architecture doc               |

Target total: ~1,015 items + E00/audit replenishment over time.
Completed so far: E01 (30) + E02 (21) + E06 (19) + E21 (8) + E10 (12) + E00 (3)
= **93 items** across 10 execution firings.
