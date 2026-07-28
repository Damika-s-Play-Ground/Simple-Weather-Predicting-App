# E00 — Bugs & regressions (priority-interrupt lane)

Always drained before any other epic (AUTOLOOP.md §2.2). Items land here from
failed gates, live-smoke failures, reverts awaiting reland, and audit findings.

Format: `- [ ] [BUG-###] (S|M|L) description — repro/AC: one clause.`
IDs are sequential and never reused.

- [ ] [BUG-001] (S) actions/upload-artifact@v4 targets deprecated Node 20 (runner warning) — AC: bump upload/download-artifact to a current major after verifying the tag exists; warning gone from run logs.
