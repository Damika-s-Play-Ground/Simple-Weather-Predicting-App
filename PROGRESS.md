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
