# E01 — CI/CD hardening

**Goal:** make the pipeline a real safety net before the Vite migration: local
gates become a strict subset of CI, deploys get health-checked, and supply
chain/scanning basics land.
**Phase:** M0. **Depends on:** nothing. **Libraries/APIs:** GitHub Actions
features only (free).

Notes: items referencing bundle paths say "main JS bundle" — the concrete glob
moves from `build/static/js/main.*.js` to `dist/assets/*.js` when E02 lands;
adapt at execution time.

- [ ] [E01-001] (S) Add a `format:check` step to CI (before tests) — AC: CI fails on an unformatted file.
- [ ] [E01-002] (S) Add an explicit `npx eslint src --max-warnings=0` CI step — AC: a lint warning fails CI independently of the build step.
- [ ] [E01-003] (S) Add a `concurrency` group cancelling superseded runs per ref — AC: two rapid pushes cancel the first in-flight run.
- [ ] [E01-004] (S) Add `timeout-minutes: 15` to every job — AC: all jobs carry a timeout.
- [ ] [E01-005] (M) Split the single job into `test` and `deploy` jobs (`deploy` has `needs: test`, gated to push on main) — AC: PR runs show no deploy job.
- [ ] [E01-006] (S) Upload `build/` as a run artifact from the test job (7-day retention) — AC: artifact downloadable from any run.
- [ ] [E01-007] (M) Post-deploy health check: retry-curl the live URL until HTTP 200 and the served `index.html` references the freshly built main JS hash (5 tries, 15 s apart) — AC: deploy job fails on stale/broken publish.
- [ ] [E01-008] (S) Append deployed URL + commit SHA to `GITHUB_STEP_SUMMARY` after successful deploy — AC: run summary shows a clickable live link.
- [ ] [E01-009] (M) Bundle-size report step: print gzipped main JS bundle size to the job summary — AC: size visible in every run summary.
- [ ] [E01-010] (S) Bundle budget check: fail the test job if gzipped main JS bundle exceeds 200 KB — AC: threshold is a single env var at the top of the workflow.
- [ ] [E01-011] (M) Coverage in CI: run tests with `--coverage` and print the text summary to the job summary — AC: coverage table appears in run summary.
- [ ] [E01-012] (S) Set a conservative coverage floor (50% statements) in the Jest config — AC: CI fails below the floor.
- [ ] [E01-013] (M) Add `.github/dependabot.yml` (npm weekly + github-actions weekly, grouped minor/patch) — AC: valid config with two ecosystems.
- [ ] [E01-014] (M) Add a CodeQL workflow (javascript, push/PR + weekly cron) — AC: CodeQL run completes green.
- [ ] [E01-015] (S) Add `npm audit --omit=dev --audit-level=high` as a `continue-on-error` report step with output in the job summary — AC: audit result visible per run (non-blocking until E02 kills the CRA vulns).
- [ ] [E01-016] (S) Secret-leak guard step: grep the checkout for hardcoded OWM key patterns (`appid=[a-f0-9]{16,}` outside docs) — AC: a planted key in src fails CI.
- [ ] [E01-017] (S) Add `workflow_dispatch` trigger — AC: manual "Run workflow" button available.
- [ ] [E01-018] (S) Add `.nvmrc` (22) and package.json `engines.node >=22` — AC: CI reads the version from `.nvmrc`.
- [ ] [E01-019] (S) Cache the CRA babel/terser cache dir (`node_modules/.cache`) keyed on lockfile — AC: second consecutive run restores the cache.
- [ ] [E01-020] (S) Skip the deploy job for markdown-only pushes (paths check on the diff) — AC: a backlog-only commit runs tests but not deploy.
- [ ] [E01-021] (S) Add a PR template with a checklist (tests added, a11y considered, bundle impact) — AC: template appears on new PRs.
- [ ] [E01-022] (S) Add bug + feature issue templates — AC: templates offered on "New issue".
- [ ] [E01-023] (S) Add CI status badge + live-site link badge to the README header — AC: badges render and link correctly.
- [ ] [E01-024] (S) Add MIT `LICENSE` and a license badge — AC: LICENSE file at root, badge in README.
- [ ] [E01-025] (S) Add `.editorconfig` matching Prettier (2-space, LF, UTF-8, final newline) — AC: file present and consistent with `.prettierrc.json`.
- [ ] [E01-026] (S) Add `SECURITY.md` (key rotation steps, how to report) — AC: file exists and README links to it.
- [ ] [E01-027] (S) Conventional-Commits check on pushed commit subjects (regex step, warn-only annotation) — AC: non-conforming subject produces a run annotation.
- [ ] [E01-028] (S) Add `public/404.html` mirroring index (gh-pages deep-link groundwork for E15) — AC: built output contains 404.html.
- [ ] [E01-029] (S) README link-check step (`continue-on-error`, summary output) — AC: a broken README link is reported in the summary.
- [ ] [E01-030] (M) Nightly scheduled CI run (cron, no deploy) to catch bit-rot between pushes — AC: scheduled run visible, deploy job skipped for schedule events.
