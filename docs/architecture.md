# Theme and component boundaries

## Layers

1. Foundation tokens: font stacks, sizes, spacing, motion durations and curves.
2. Semantic tokens: backgrounds, surfaces, text, muted text, borders, focus, emphasis and status.
3. Components: semantic tokens define states and typography; callers use constrained APIs.
4. Compositions: Field, CheckField and EmptyState share structure.
5. Product: data, routes, permissions, persistence and business table columns stay in MT0.

The first release keeps a single `@matrixzero/ui` package. Split packages only when independent consumers and release cycles justify it.

## Theme contract

`ThemeProvider` brand is selected explicitly. `mode` is `light`, `dark` or `system`; `density` is `comfortable` or `compact`. System mode uses a media query, and SSR never accesses `window` or `localStorage`. Themes are not loaded over the network.

`styles.css` supplies semantic defaults and `themes/mt0.css` is an optional MT0 brand layer. OEM modules define their own CSS and assets; the base package contains no vendor logos or proprietary fonts and never falls back to MT0 branding when OEM configuration is missing.

Every custom brand reviews these tokens in both modes:

| Category          | CSS tokens                                                                     |
| ----------------- | ------------------------------------------------------------------------------ |
| Surfaces and text | `--mds-bg`, `--mds-surface`, `--mds-soft`, `--mds-text`, `--mds-muted`         |
| Status            | `--mds-accent`, `--mds-tint`, `--mds-success`, `--mds-warning`, `--mds-danger` |
| Interaction       | `--mds-border`, `--mds-focus`, `--mds-overlay`, `--mds-shadow`                 |
| Typography        | `--mds-font-latin`, `--mds-font-cjk`, `--mds-font-mono`                        |

Unknown brands retain foundation defaults and are not validated configurations. Product builds must reject unknown brand profiles.

## Style isolation

All styles are scoped by `.mds-root`. Text, tables, inputs and overlays bind to semantic colors. Multiple ThemeProviders can coexist, and portals enter their own provider container. React 19 remains a peer dependency; callers provide accessible labels and copy.

## Why Select and ChoiceMenu are separate

An early modal dropdown locked global scrolling and could shift the background. Select uses a Radix listbox plus a native form bridge for submission, required validation and reset. NativeSelect preserves the platform picker and legacy `option` and `onChange` API. ChoiceMenu is a non-modal selection menu for filters and preferences.

Do not disguise a menu as a combobox with hand-written ARIA roles. Search and large-data virtualization require a separate design and test plan.

## Initial boundaries

MT0 pages and final OEM assets are outside this release. Showcase save, create and export actions are local demonstrations. Date pickers, file uploads, virtual tables and a data-visualization library are not built in. New components need a demonstrated business use, composition rules and accessible behavior.

## Color contract

The interface uses warm-white and ink-gray neutrals with teal-green actions. `--mds-text` is for body and neutral contrast; actions, selected states and progress use `--mds-accent`, while button and checkmark content uses `--mds-on-accent`. Accent hover and pressed values preserve foreground contrast in both themes.

Status uses paired tokens for success, warning, danger and info. `--mds-tint` is a selected background, not a page background. Custom brands check accent, on-accent, tint and interaction states together.

Data categories use `--mds-data-1` through `--mds-data-6` and do not imply status semantics. Charts may override them with `--mds-chart-1` through `--mds-chart-6`. Default contrast checks require body and action text at least 4.5:1 and focus and chart lines at least 3:1.
