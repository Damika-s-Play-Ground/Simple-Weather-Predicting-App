# E00 — Bugs & regressions (priority-interrupt lane)

Always drained before any other epic (AUTOLOOP.md §2.2). Items land here from
failed gates, live-smoke failures, reverts awaiting reland, and audit findings.

Format: `- [ ] [BUG-###] (S|M|L) description — repro/AC: one clause.`
IDs are sequential and never reused.

- [x] [BUG-001] (S) actions/upload-artifact@v4 targets deprecated Node 20 (runner warning) — AC: bump upload/download-artifact to a current major after verifying the tag exists; warning gone from run logs.
- [x] [BUG-002] (S) Fixed footer overlaps card content at page bottom (seen in dark-mode screenshot) — AC: footer sits in normal flow after the card; nothing overlapped.
- [x] [BUG-003] (S) INDEX.md status updates silently no-op'd since it002 (regex vs prettier column re-alignment) — fixed by regenerating the table from epic files; INDEX edits must now grep-assert (rule added to INDEX header).
