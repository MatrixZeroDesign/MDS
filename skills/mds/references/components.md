# Component selection

## Forms and actions

Use `Button` for labeled actions and `IconButton` for icon-only actions. Use `Field` with `Input`, `Textarea`, `Select`, `NativeSelect`, `Checkbox`, `RadioGroup`, `Switch`, or `Slider`. Choose `SegmentedControl` for a small, mutually exclusive view or mode switch; use `Tabs` when each option reveals a distinct content panel.

## Navigation

Use `Navbar` for top-level application navigation, `NavDrawer` for a labeled side menu, and `NavRail` for a compact icon-first side menu. Use `ScrollNavigator` for long reading surfaces and `Pagination` for discrete result pages.

## Overlays

Use `Dialog` for modal confirmation or focused input, `SideSheet` for longer contextual tasks, `Popover` for anchored supporting content, `Tooltip` for a short label, and `Spotlight` for command search. MDS overlays inherit the nearest `ThemeProvider`; do not portal them manually.

## Feedback and display

Use `Callout` for inline guidance, `Banner` for page-wide messages, and `Toast` for transient results. Use `Progress` for linear work, `Spinner` for compact indeterminate waiting, and `Skeleton` only when the layout is predictable. Use `Card`, `List`, `Table`, and `DataTable` according to information density and interaction needs.

## Packages

- `@matrixzero/ui`: components, themes, layout, and CSS tokens.
- `@matrixzero/icons`: interface icons that inherit `currentColor`.
- `@matrixzero/brand-icons`: brand marks; follow each brand owner's usage rules.
- `@matrixzero/charts`: accessible charts with tabular fallbacks.
