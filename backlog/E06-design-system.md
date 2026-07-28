# E06 — Design system & tokens

**Goal:** replace hardcoded CSS literals with a tokenized system (primitives +
semantic tokens) that makes dark mode (E21) and the redesign epics possible.
**Phase:** M0–M1. **Depends on:** E02. **Libraries:** plain CSS custom
properties (no Tailwind — keeps diffs granular).

## Foundation

- [x] [E06-001] (M) Create `src/styles/tokens.css` with color primitives (blue/gray scales, feedback colors) — AC: `:root` defines the primitive palette.
- [x] [E06-002] (S) Semantic surface/text tokens (`--surface`, `--surface-raised`, `--text-primary`, `--text-secondary`, `--text-inverse`) — AC: semantic layer references primitives only.
- [x] [E06-003] (S) Accent/action tokens (`--accent`, `--accent-hover`, `--accent-contrast`, `--muted-action`, `--muted-action-hover`) — AC: buttons derive from these.
- [x] [E06-004] (S) Feedback tokens (`--danger-bg/-fg/-border`, `--info-fg`) — AC: error styles derive from these.
- [x] [E06-005] (S) Spacing scale `--space-1..8` (4 px base) — AC: scale defined and documented inline.
- [x] [E06-006] (S) Radius (`--radius-sm/md/lg/pill`) and shadow (`--shadow-1/2`) scales — AC: defined in tokens.css.
- [x] [E06-007] (S) Type scale (`--text-xs..--text-3xl`) + font-stack token — AC: defined in tokens.css.
- [x] [E06-008] (S) Focus-ring token (`--focus-ring`) consumed by the global focus-visible rule — AC: focus outline uses the token.
- [x] [E06-009] (M) Import tokens.css before App.css and migrate ALL color literals in App.css to tokens — AC: no raw hex/rgba in component rules (weather-theme gradients exempt until their own items).
- [x] [E06-010] (S) Migrate spacing/radius/font-size literals in form + button rules to tokens — AC: form section uses tokens only.
- [x] [E06-011] (S) Migrate weather card, hourly strip, forecast rules to tokens — AC: card region uses tokens only.
- [x] [E06-012] (S) Migrate chips, unit toggle, updated-row, error/status rules to tokens — AC: remaining component rules use tokens only.
- [x] [E06-013] (S) Delete dead/duplicated CSS comment headers ("Enhanced …", "(existing CSS rules)") and merge duplicate selectors — AC: each selector appears once.

## Componentization (later batches)

- [x] [E06-020] (M) Extract `Chip` styles into a shared `.chip` block used by recents + clear — AC: one chip class, two modifiers.
- [x] [E06-021] (M) Extract `.card` surface block shared by weather section + future cards — AC: weather-section composes `.card`.
- [x] [E06-022] (S) Extract `.btn` base + `.btn-primary/.btn-muted/.btn-ghost` modifiers — AC: all buttons compose `.btn`.
- [x] [E06-023] (S) Normalize icon sizes via `--icon-sm/md/lg` — AC: img sizing uses tokens.
- [ ] [E06-024] (M) [deferred: next E06 batch] Split App.css into `styles/base.css`, `styles/components.css`, `styles/themes.css` — AC: App.css deleted, imports ordered.
- [x] [E06-025] (S) Document the token system in `docs/design-tokens.md` — AC: every token listed with purpose.
