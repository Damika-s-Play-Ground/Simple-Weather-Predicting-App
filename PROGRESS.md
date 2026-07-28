# Progress ledger (append-only)

Format: `UTC | it### | itemID | sha | short description | gates:... | smoke:...`
Special lines: `HEALTH:`, `size: <gzip bytes>`, `pending: <risk>`.
The loop reads only the tail. Do not edit existing lines.

---
