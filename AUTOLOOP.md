# AUTOLOOP — Autonomous Level-Up Runbook

This file is the complete operating manual for the autonomous modernization
loop. A fresh agent session with zero chat history must be able to execute one
correct iteration after reading only this file. The repo is the only memory.

**Firing prompt (never changes):**

> Read AUTOLOOP.md in /Users/damikaanupama/Simple-Weather-Predicting-App and
> execute exactly one iteration of the level-up loop.

**Restart after session death / cron expiry:** the user says "continue the
level-up loop"; the agent re-registers an hourly session cron (off-minute,
e.g. `37 * * * *`) with the firing prompt above, then executes one iteration.

---

## 1. State model

| File                  | Role                                                    |
| --------------------- | ------------------------------------------------------- |
| `backlog/INDEX.md`    | Epic router: execution order, status, done/total counts |
| `backlog/E00-bugs.md` | Priority-interrupt lane — always drained first          |
| `backlog/E##-*.md`    | One file per epic; checkbox items with stable IDs       |
| `PROGRESS.md`         | Append-only ledger; one line per completed item/firing  |
| `AUTOLOOP.md`         | This runbook (edit only via a backlog item)             |

- **Iteration counter** = last `it###` in `PROGRESS.md` + 1. Never remembered,
  always derived.
- **Item format:** `- [ ] [E05-012] (S) description — AC: one testable clause.`
  IDs are permanent (never renumbered/reused; deletions leave gaps). Size:
  S ≈ ≤15 min, M ≈ ≤45 min, L = a full firing.
- Optional markers: `[!blocked: reason]`, `[deferred→E05-091]` when split.

## 2. Per-firing protocol

### 2.1 Preflight (abort → recovery §5 if any fails)

1. `git fetch origin` — require clean tree and `HEAD == origin/main`
   (local ahead & green → push first; remote ahead → `git pull --ff-only`;
   dirty tree → §5.6).
2. `gh run list -L1 --branch main` — if the last run failed, THIS firing is a
   fix/revert firing (§5.2). Do not pick new work.
3. Disk: `df -h /` needs >2 GB free (else §5.4).

### 2.2 Pick

1. `backlog/E00-bugs.md` has an unchecked item → take it (always wins).
2. Else: first ACTIVE epic in `INDEX.md` → first `- [ ]` line in that file.
3. No ACTIVE epic with open items → promote the first QUEUED **authored** epic
   to ACTIVE.
4. **Authoring buffer rule:** if fewer than 2 fully-authored epics are queued
   ahead of the ACTIVE one, this firing is an AUTHORING firing instead
   (§6). Also check the cadence table (§3.2) — audit firings preempt normal
   picks.

**Batching:** 1 L item, OR 2–3 M items (same epic), OR a sweep of 5–15 S items
(same epic, same concern). Never mix epics in a batch. Anything touching
dependencies, `.github/workflows/`, or build config rides ALONE.

### 2.3 Implement → Verify → Record → Push

1. Implement each item with its tests written alongside.
2. **Gates (blocking, every firing):**
   `npx prettier --write .` → `npm test` (vitest run) → `npm run lint` → `npm run build`.
3. Record: flip `[ ]`→`[x]` in the epic file (no prose notes), bump the
   INDEX.md counter, append one ledger line per item (§4). Every INDEX/epic
   edit must be verified with a grep assert — silent misses caused BUG-003.
4. Commit per logical item — Conventional Commits + trailer
   `Backlog: E05-012` (S-sweeps may share one commit listing all IDs).
   The firing's last commit includes the backlog/ledger updates.
5. **One `git push origin main` per firing.** Push = production deploy.
6. Risky classes (see §7): stay and `gh run watch` to completion, then run the
   live smoke (§3.3) in the SAME firing.
7. End-state check: clean tree, gates green, pushed, ledger written. A green
   no-op is a valid firing; a red anything is not.

### 2.4 Guardrails

- **Time box 45 min.** At the limit: current item committable-green in ≤5 more
  minutes → finish it; otherwise `git restore . && git clean -fd` back to the
  last green commit, mark the item `[!blocked: <reason>]`, end the firing.
- **Scope box:** real diff exceeding ~2× the size class or touching >12
  unexpected files → stop, split the item into sub-items in the epic file,
  take only the first.
- Never leave uncommitted work between firings. Committed or discarded.

## 3. Quality gates

### 3.1 Every firing (blocking)

prettier --write (then clean), `npm test`, `npm run lint`, `npm run build`.

### 3.2 Cadence (on the derived iteration counter)

| When `it % N == 0` | Gate                                                                                                                                                    | On failure                     |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| 5                  | Live smoke (§3.3); gzip size of main JS bundle (dist/assets/index-\*.js) vs last `size:` ledger entry — >10% unexplained growth                         | File `BUG-` item in E00        |
| 10                 | `npm audit --omit=dev` (high/critical); a11y spot-check of live page; refresh `asset/` screenshots                                                      | File items in E00/E05/E11 lane |
| 24                 | Push a notification to the user: iteration count, cron-expiry countdown, restart one-liner                                                              | —                              |
| 25                 | AUDIT firing (no feature work): Lighthouse pass, dead-code scan, INDEX-vs-reality count check, re-audit whole app, author new items into E00/audit lane | —                              |

### 3.3 Live smoke (headless browser)

Load https://Damika-s-Play-Ground.github.io/Simple-Weather-Predicting-App/,
wait for the weather card, assert a temperature and icon render, search a city,
assert zero console errors. Record `smoke:pass|fail|skip(reason)` in the ledger.

## 4. Ledger format (PROGRESS.md)

One pipe-delimited line, append-only:

```
2026-07-28T14:05Z | it041 | E05-012 | 9f3ab21 | aria-labels on unit toggle | gates:fmt,test(38),build | smoke:skip
```

Special line kinds: `HEALTH:` (environment problems), `size: <bytes-gzip>`
(bundle baseline), `pending: <what>` (unresolved risk the next preflight must
check). The loop only ever reads `tail -30 PROGRESS.md`.

## 5. Failure playbook (mechanical — no judgment calls)

1. **Broken mid-firing, not committed:** fix within the time box or discard
   (`git restore . && git clean -fd`), mark `[!blocked]`, end green. A
   twice-blocked item gets split or moved to E00 with an investigation note.
2. **Pushed but CI red:** this firing = revert firing. `git revert <sha(s)>`
   (NEVER reset/force-push), push, confirm CI green, file
   `BUG-###: reland E##-### (reverted in <sha>)` in E00.
3. **OWM API / live site down:** dev work proceeds (tests are mocked); log
   `smoke:skip(site-down)`. Three consecutive skips → notify the user.
4. **Disk full / env broken:** `npm cache clean --force`, delete `build/`;
   still broken → end as a green no-op with a `HEALTH:` ledger line; if even
   committing fails, notify the user and stop.
5. **Bug discovered mid-unrelated-work:** fix <5 min AND gets a test → fold in
   as its own commit with a retroactive checked E00 item. Otherwise file it in
   E00 and stay on task.
6. **Dirty tree at preflight:** if the diff is obviously a finished green unit,
   complete its record/commit steps; if ambiguous at all, discard and
   re-derive from PROGRESS.md.

## 6. Authoring firings

- Author exactly ONE epic file per authoring firing (30–100 items), after
  exploring the relevant code/docs. Items must meet the granularity bar:
  one commit, ≤~150 LOC, independently shippable, one-clause AC.
- Epic template header: goal, phase, dependencies, libraries/APIs (free-tier
  only — no card-required APIs), then the item list.
- Update INDEX.md status to QUEUED (authored) with the real count.
- Authoring firings are markdown-only; gates still run; the push may skip
  deploy (fine).

## 7. Risky change classes (extra verification, always ride alone)

| Class                                                            | Extra requirement                                                                                    |
| ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `.github/workflows/*`                                            | `gh run watch` the triggered run to full completion incl. deploy; quote prior content in commit body |
| Dependency majors / migrations (Vite, TS, react-scripts removal) | Staged L items, each independently green AND deployable; live smoke same firing                      |
| `homepage`/base path, routing, manifest, service worker          | Mandatory same-firing live smoke                                                                     |
| Deploy step / gh-pages                                           | As workflows + verify the live URL serves the new bundle hash                                        |

**Pre-push checklist:** gates green; `git diff origin/main..HEAD --stat` shows
only expected files; `git diff origin/main..HEAD | grep -inE 'appid=[a-f0-9]{16,}|api[_-]?key\s*[:=]\s*["'"'"'][a-f0-9]'` finds nothing;
`homepage` + `publish_dir` untouched unless the item is about them; ledger
updated; ONE push.

## 8. Conventions (give every stateless firing the same taste)

- JavaScript now, TypeScript as E03 lands (leaf-first, `allowJs`). No new
  runtime dependency without a backlog item that names it.
- Tests live next to code (`X.test.js`), mock network at the boundary, no
  skipped tests committed.
- Styling: plain CSS today → design tokens + CSS Modules as E06 lands. New
  styles must use tokens once `src/styles/tokens.css` exists.
- Comments explain constraints, not narration. Prettier settles format wars.
- Commit messages: Conventional Commits, imperative, body explains why,
  `Backlog:` trailer always.
- User-facing strings: sentence case; a11y required (labels, roles,
  focus-visible, reduced-motion) — not optional polish.

## 9. Program map

Milestones: **M0** foundation (E01 CI, E02 Vite, E04 testing, E06 tokens-start)
→ **M1** modernization (E03 TS, E06-finish, E21 dark mode, E09 data layer,
E10 search/favorites) → **M2** data & views (E11 forecast, E12 environmental,
E13 astronomy, E15 routing, E14 maps) → **M3** maturity (E05 a11y, E08 PWA,
E16 settings, E17 i18n) → **M4** polish (E07 perf, E18 motion, E19 insights).
E20 docs is continuous. Key orderings: Vite → Vitest → TS → router; tokens →
dark mode → redesign/motion; provider abstraction (E09) → every data card.

Scope bounds: free-tier APIs only (OWM 2.5 + Geocoding + Air Pollution,
Open-Meteo, RainViewer, OSM tiles), static site, no backend, no card-required
APIs (One Call 3.0 excluded), key stays a restricted public free-tier key.
