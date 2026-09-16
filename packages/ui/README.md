# @matrixzero/ui

Matrix Design System (MDS / Matrix UI) provides React 19 components, bilingual typography, light and dark themes, and local micro-interactions for multi-brand products.

Public release, licensed under MIT.

## Installation and usage

Install and pin a version from the public npm registry:

```sh
npm install --save-exact @matrixzero/ui@0.1.0-alpha.12
```

```tsx
import { ThemeProvider, Button, Field, Input } from "@matrixzero/ui";
import "@matrixzero/ui/styles.css";
import "@matrixzero/ui/themes/mt0.css";

export function Settings() {
	return (
		<ThemeProvider brand="mt0" mode="system">
			<Field label="Workspace name" required>
				<Input name="workspace" defaultValue="Engineering" />
			</Field>
			<Button variant="primary">Save</Button>
		</ThemeProvider>
	);
}
```

CSS is imported separately; consumer Tailwind configuration is not required. React and React DOM are peer dependencies.

## Core conventions

- ThemeProvider controls `brand`, `mode` (light/dark/system), and `density` (comfortable/compact) without changing the host page theme.
- Import the mt0 theme explicitly; the default neutral values contain no vendor branding or font assets.
- Field associates labels, descriptions, and validation with Input / Select / Textarea. Pass an explicit ID to Field and do not assign a conflicting ID to the inner control.
- Select uses the themed listbox with `options`/`onValueChange`, submission, reset, and required validation. Use NativeSelect for the legacy option-children/onChange API. ChoiceMenu is a non-modal filter menu with menuitemradio semantics and controlled `value`/`onValueChange`.
- Overlays render inside the current ThemeProvider container and retain its theme. Avoid `transform`/`filter`/`contain:paint` on ThemeProvider ancestors.
- Fonts use local Latin and CJK fallback stacks; micro-interactions follow `prefers-reduced-motion`.
- Consumers provide all copy and business behavior.

The complete API is provided by the published TypeScript declarations. See the [MDS repository](https://github.com/MatrixZeroDesign/MDS) for usage examples, design boundaries, tests, and release guidance.

## Layout and notices

Callout provides persistent contextual notes; Banner provides dismissible page-level notices. Card composes Header, Title, Description, Content and Footer. Container constrains maxWidth and inline gutter with optional centering. Grid handles fixed or responsive equal-width columns, Divider separates adjacent groups, and Typography applies the shared type scale independently from document semantics. Each has a complete usage guide and type-checked example in the docs portal.

Accessibility: keep control outlines on --mds-control-border and decorative dividers on --mds-border. Default text pairs target 4.5:1; essential control/focus outlines target 3:1. Validate your own token overrides, keyboard interaction and content composition.

Direction: set `dir="rtl"` or `dir="ltr"` on `ThemeProvider`, independently of `lang`. Nested roots inherit direction unless overridden. Radix keyboard behavior and portals share this direction. `SideSheetContent` supports logical `start`/`end` (default `end`) and physical `left`/`right`; `NavDrawer` opens at `start`.

## Toast notifications

Place one `ToastProvider` and `Toaster` inside the `ThemeProvider`. Descendants call `useToast().toast({ title, description, tone, duration })`; the returned ID can be passed to `dismiss(id)`. `clear()` removes all notifications. The default duration is 5000ms; use `Infinity` for a notification that requires dismissal.

Notifications stack at the inline end of the viewport. Hover or keyboard focus expands the stack and pauses timers; F8 focuses the notification region. Pass localized `label` and `closeLabel` to the provider/viewport. Keep critical validation beside the relevant field. See the complete Toast example and API in the documentation portal.
