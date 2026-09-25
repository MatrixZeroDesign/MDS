---
name: mds
description: Build React interfaces with Matrix Design System components, themes, icons, charts, accessibility patterns, and internationalization. Use when creating or reviewing UI that imports @matrixzero packages.
metadata:
  version: 1
  source: https://github.com/MatrixZeroDesign/MDS
---

# Matrix Design System

Use public `@matrixzero/*` package APIs. Do not copy component implementations into an application. Read [references/components.md](references/components.md) when choosing components or composing an application shell, and [references/examples.md](references/examples.md) when starting an integration.

## Build with MDS

1. Import `@matrixzero/ui/styles.css` once and wrap the MDS surface in `ThemeProvider`.
2. Prefer the most specific MDS component for the interaction. Use native HTML inside MDS layout primitives when the library has no matching behavior.
3. Use `Field` for labels, descriptions, errors, required state, and disabled state. Do not create placeholder-only labels.
4. Use semantic tokens such as `var(--mds-text)`, `var(--mds-surface)`, `var(--mds-border)`, and `var(--mds-accent)`. Do not hard-code light or dark surface colors.
5. Let `ThemeProvider` control mode, density, direction, shape, and scaling. Avoid component-local overrides that break those settings.
6. Use logical CSS properties (`margin-inline-start`, `padding-block`) so RTL layouts work without separate CSS.
7. Keep visible product text in the application's i18n catalog. Pass translated accessible names to icon-only controls, progress indicators, and landmarks.

## Composition rules

- Keep related controls close and separate groups with the MDS spacing rhythm. Use `Container` and `Grid` to constrain wide layouts.
- Match control sizes in the same row. Avoid full-width buttons unless the layout or narrow viewport requires them.
- Use `Dialog` for focused decisions, `SideSheet` for contextual editing, `Popover` for brief non-modal content, and `DropdownMenu` for actions.
- Use `NavDrawer` for expanded navigation and `NavRail` for compact navigation. Preserve item order and icon position when switching.
- Communicate loading, success, warning, and error with text or semantics as well as color.
- Keep animation local, short, and compatible with reduced motion.

## Verify

Check keyboard access, visible focus, accessible names, light and dark themes, compact and comfortable density, narrow viewports, and RTL. Prefer user-visible behavior tests over implementation snapshots.

For current APIs and live examples, use the MDS documentation and its `llms.txt` index: https://matrixzerodesign.github.io/MDS/llms.txt
