# Progress ledger (append-only)

Format: `UTC | it### | itemID | sha | short description | gates:... | smoke:...`
Special lines: `HEALTH:`, `size: <gzip bytes>`, `pending: <risk>`.
The loop reads only the tail. Do not edit existing lines.

---

2026-07-28T03:44Z | it001 | seed | 5744a3a | scaffold loop machinery, author E01 (30 items), freeze ROADMAP | gates:fmt,test(35),build | smoke:skip(seed)
size: 168843
