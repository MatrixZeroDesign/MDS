# 0.1.0-alpha.13

- Add `CircularProgress` with determinate and indeterminate states, accessible value text, responsive sizing, and reduced-motion behavior.
- Add `leadingIcon` and `trailingIcon` slots to `Button` with consistent spacing and automatic icon sizing.

# 0.1.0-alpha.12

- Add automatic SegmentedControl overflow arrows, single-line options, edge fades, and accessible scroll labels.
- Preserve selected indicators and keyboard navigation when scrolling in LTR and RTL layouts.
- Use a single surface for modal navigation drawers so inactive items stay transparent.

# 0.1.0-alpha.11

- Added Typography, Grid and Divider for type hierarchy, responsive rule grids and horizontal or vertical content separation.
- Navbar and NavDrawer heights, padding and item rhythm now follow global density.
- Toaster now supports `placement="inline"` for actionable notices inside panels or content regions.
- Added DateField, DatePicker, TimeField and TimePicker with custom inputs and themed popovers.
- Added AudioPlayer and Spinner, and refined Slider progress and volume usage.
- Multicolor theme surfaces now follow the selected palette; Atmosphere follows brand colors by default, while docs use a monochrome theme.

# 0.1.0-alpha.10

- Tabs are now underlined content navigation; alpha.9 segmented, size and shape options were removed. Use SegmentedControl for pill and segmented selection with its size and shape options.
- Migration: keep content panels in Tabs without those options; use SegmentedControl for single-value choices such as billing cycles and modes.

# 0.1.0-alpha.9

- Tabs added segmented styles, sizes and corner options with sliding indicators, RTL, keyboard and reduced-motion support. Home and docs now use the real component API.

# Changelog

## 0.1.0-alpha.8

- ThemeProvider added six inheritable palettes; docs follow the system by default and persist manual mode locally.

- Added Form, FormSubmit, FormErrorSummary and a submission-state hook while preserving native form behavior and async error focus.
- Switch supports custom checkedIcon and uncheckedIcon thumb icons.
- Documentation API pages now group properties by component.

- SegmentedControl uses a continuously sliding selection background sized to content, with RTL, keyboard and reduced-motion support.

- EmptyState added thumbnail and thumbnailSize for uncropped images, illustrations and icons while preserving the legacy icon usage.
- Documentation provides image and size choices alongside source and accessibility guidance.

## 0.1.0-alpha.7

- Added ToastProvider, Toaster and useToast with stacked notices, hover or focus expansion, timer pause, manual dismissal, persistence and actions.
- Table distinguishes column and row headers, fixes incomplete row header backgrounds and standardizes heading spacing and row separators.

- ChoiceMenu uses a compact pill toolbar, aligns the menu and trigger edges, and differs from the form Select; the current value is an accessible description.

- ThemeProvider supports dir=ltr/rtl and passes direction to Radix interactions and overlays; nested roots inherit or override it.
- SideSheet added start/end with end as default; NavDrawer opens from start. RTL switches and native selectors were corrected.

## 0.1.0-alpha.6

- Banner defaults to a compact top strip with horizontal title and body, distinct from an inline Callout; narrow screens retain full content and dismiss action.

## 0.1.0-alpha.5

- Added AvatarGroup with three sizes, overlapping avatars, localized overflow counts and a dedicated docs example.

- Added the Atmosphere gradient surface with iris, mint and peach light/dark palettes; no continuous animation is used.
- Button added contrast semantics and a pill shape for prominent actions in both themes.
- Added welcome-card and feature-dialog composition examples with keyboard and gradient contrast checks.

## 0.1.0-alpha.4

- Select now uses a themed listbox with the options/onValueChange API; the native implementation remains NativeSelect. Form submission, required validation, reset, keyboard use and themed overlays are supported.
- Added Callout, Banner, Card compositions and Container with complete guides and examples.
- Added distinguishable control-boundary tokens, fixed placeholder contrast and expanded light/dark and keyboard checks.

- Updated the icons dependency to 0.1.0-alpha.3 so installs receive the corrected Webhook glyph.

## 0.1.0-alpha.1

- Established the initial Matrix Design System components and bilingual typography rules.
- Added scoped light, dark and system themes, density and the mt0 brand entry point.
- Covered forms, overlays, navigation, lists, avatars, tables, steps and feedback components.
- Added IconButton, SegmentedControl and card-wide interactive RadioCard.
- Added Navbar, collapsible NavRail, mobile NavDrawer, SideSheet and standalone Collapse.
- Added local 120–240ms motion and reduced-motion support.
- Added a live component site, browser interaction and accessibility tests, and tarball installation checks.

## 0.1.0-alpha.2

- Updated to the expanded Icons 0.1.0-alpha.2 while preserving the existing component API.

## 0.1.0-alpha.3

- Added warm-white and teal-green colors with independent text, accent and on-accent values for both themes.
- Primary buttons, checks, switches, navigation, tabs and progress use action accents; status messages use paired foreground and background colors.
- Added info, status-background, on-accent, hover/pressed and data-1…6 semantic tokens.
