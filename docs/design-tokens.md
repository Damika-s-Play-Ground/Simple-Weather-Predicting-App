# Design tokens

Defined in `src/styles/tokens.css`. Two layers: **primitives** (raw values,
never referenced by component CSS) and **semantic tokens** (what components
consume). Dark mode overrides only the semantic layer under
`[data-theme="dark"]`; component CSS never branches on theme.

## Primitives

| Token                          | Purpose                       |
| ------------------------------ | ----------------------------- |
| `--blue-100/300/500/600/800`   | Brand blue scale (sky → deep) |
| `--gray-0/100/200/500/700/800` | Neutral scale                 |
| `--red-50/200/700`             | Error feedback scale          |

## Semantic — surfaces & text

| Token                                | Purpose                                    |
| ------------------------------------ | ------------------------------------------ |
| `--page-gradient-from/-to`           | Default page background gradient stops     |
| `--surface`                          | Card background                            |
| `--surface-raised`                   | Nested tiles (hourly slots, forecast days) |
| `--surface-chip`                     | Chips and floating controls                |
| `--surface-solid`                    | Opaque popovers (autocomplete listbox)     |
| `--border-inverse`                   | Borders on colored/gradient backgrounds    |
| `--text-primary/-secondary/-inverse` | Body, muted, and on-color text             |
| `--info-fg`                          | Informational accents (precipitation %)    |

## Semantic — actions & feedback

| Token                                             | Purpose                        |
| ------------------------------------------------- | ------------------------------ |
| `--accent`, `--accent-hover`, `--accent-contrast` | Primary action colors          |
| `--muted-action`, `--muted-action-hover`          | Secondary action colors        |
| `--toggle-bg`, `--toggle-bg-hover`                | Segmented-toggle resting state |
| `--danger-bg/-fg/-border`                         | Inline error presentation      |
| `--focus-ring`                                    | Keyboard focus outline         |
| `--skeleton-base/-highlight`                      | Loading shimmer stops          |

## Scales

| Token                    | Values                            |
| ------------------------ | --------------------------------- |
| `--space-1..8`           | 4 / 8 / 12 / 16 / 20 / 24 / 32 px |
| `--radius-sm/md/lg/pill` | 6 / 8 / 10 / 14 px                |
| `--shadow-1/2/card/icon` | Elevation levels                  |
| `--icon-sm/md`           | 40 / 50 px image sizes            |
| `--text-xs..xl`          | 11–18 px type scale               |

## CSS primitives built on tokens

| Class                                      | Purpose                                        |
| ------------------------------------------ | ---------------------------------------------- |
| `.card`                                    | Elevated surface (compose with layout classes) |
| `.btn` + `.btn-primary/.btn-muted/.btn-sm` | Button base + variants                         |
| `.chip` + `.chip--solid/.chip--ghost`      | Pill chips (favorites, recents, clear)         |

Rules: new component CSS must use semantic tokens (no raw hex/rgba); new
surfaces compose `.card`/`.chip`/`.btn` rather than restyling from scratch.
