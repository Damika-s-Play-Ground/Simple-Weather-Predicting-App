# Progress ledger (append-only)

Format: `UTC | it### | itemID | sha | short description | gates:... | smoke:...`
Special lines: `HEALTH:`, `size: <gzip bytes>`, `pending: <risk>`.
The loop reads only the tail. Do not edit existing lines.

---

2026-07-28T03:44Z | it001 | seed | 5744a3a | scaffold loop machinery, author E01 (30 items), freeze ROADMAP | gates:fmt,test(35),build | smoke:skip(seed)
size: 168843
2026-07-28T04:04Z | it002 | E02-001..021 | a94b62c | CRA->Vite+Vitest migration, SVG gauge, axios bump; audit 69->0, CI+smoke verified | gates:fmt,test(37),lint,build | smoke:pass
size: 65871
2026-07-28T04:08Z | it003 | E01-001..030 | 3cc3689 | CI hardening sweep (29 done, 019 obsolete) | gates:fmt,test(37),lint,build | smoke:pending-ci
2026-07-28T04:15Z | it004 | E06-001..013 | 17e9f8b | design tokens foundation, App.css migrated | gates:fmt,test(37),lint,build | smoke:n/a
2026-07-28T04:15Z | it005 | E21-001..008 | 3b1dbfd | tri-state dark mode, dark sky variants, no-flash | gates:fmt,test(41),lint,build | smoke:pending-ci
2026-07-28T04:28Z | it006 | BUG-001,BUG-002 | 001f66f | artifact actions bump, footer flow fix | gates:fmt,test(41),lint,build | smoke:n/a
2026-07-28T04:28Z | it007 | E10-001..023 | b83a62b | geocoding autocomplete combobox + favorites | gates:fmt,test(53),lint,build | smoke:pending-ci
2026-07-28T04:30Z | it007 | smoke | 6a39810 | live smoke: autocomplete+favorites verified on prod, screenshots refreshed | gates:ci-green | smoke:pass
size: 67401
2026-07-28T04:37Z | it008 | authoring:E04 | 462a79a | authored E04 (32 items); buffer now 1 authored epic queued | gates:fmt,test(53),lint,build | smoke:n/a
2026-07-28T18:34Z | it009 | E06-020..025,PRs | dd4f40f | merged 2 dependabot PRs, superseded 5 in one deps commit, CSS componentization, authored E09 | gates:fmt,test(53),lint,build | smoke:pending-ci
2026-07-28T19:53Z | it010 | E06-024,BUG-003 | 9ef6fc6 | App.css split to styles/{base,components,themes}; INDEX regenerated from files (93 done) | gates:fmt,test(53),lint,build,audit(0),ci-green | smoke:pass size-check:67391-vs-67401-ok a11y:console-clean screenshots:refreshed
size: 67391
