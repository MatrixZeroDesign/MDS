# Integration guide

Applies to React 19, @matrixzero/ui 0.1.0-alpha.14, @matrixzero/icons 0.1.0-alpha.4 and @matrixzero/charts 0.1.0-alpha.4. Pin these versions when reproducing examples. This is an alpha API; inspect the installed declarations before upgrading.

## Install

Install from the public npm registry; no project-level registry configuration is required:

```sh
npm install --save-exact @matrixzero/ui@0.1.0-alpha.14 @matrixzero/icons@0.1.0-alpha.4
# Optional charts
npm install --save-exact @matrixzero/charts@0.1.0-alpha.4
```

React and react-dom 19 must also be installed. Packages and documentation are public; AI tools may also use a local checkout of docs/.

## Required application root

```tsx
import { ThemeProvider } from "@matrixzero/ui";
import "@matrixzero/ui/styles.css";
import "@matrixzero/ui/themes/mt0.css";
// Only when charts are used
import "@matrixzero/charts/styles.css";

export function App() {
	return (
		<ThemeProvider brand="mt0" mode="system">
			Your application
		</ThemeProvider>
	);
}
```

Every component example assumes these styles and a surrounding ThemeProvider. Examples are complete React modules with imports and local state; render them inside this root. Do not import all example files into production.

## Controlled state

Use value + onValueChange for Select, radio groups, segmented controls, tabs and ChoiceMenu; checked + onCheckedChange for Checkbox and Switch; open + onOpenChange for overlays. Native Input, Textarea, NativeSelect and Slider use onChange events. Use defaultValue/defaultChecked/defaultOpen for uncontrolled state; do not mix controlled and uncontrolled ownership. Reset controlled state explicitly when the form resets.

## Public utilities

- `cx(...parts: (string | undefined | false)[]): string` joins class names; it does not resolve conflicting styles.
- `useFieldProps(props?)` connects a custom control to Field context. Forward the returned id, aria-describedby, aria-invalid, required and disabled to the actual focusable input, not its wrapper.
- `usePortalContainer(): HTMLElement | null` returns the current ThemeProvider portal node. It is initially null; render custom portals only after it exists. Do not fall back to document.body and lose theme scope.

Prefer the built-in controls and overlays; these helpers are extension points, not requirements for normal usage.

## Color families and appearance

`ThemeProvider palette="mono"` selects the monochrome family. Other presets are `mint`, `blue`, `violet`, `rose` and `amber`. Palette and `mode` are independent: each family supports light, dark and system. Nested roots inherit palette; set `palette={null}` to restore that root's brand tokens. Inline token overrides still take precedence. Success, warning, danger and information colors keep their semantic roles.

## Forms

Use `Form` with `Field` and controls. Native validation runs on submit; native `action`, `method`, `onSubmit` and `onReset` remain available. For managed async submission, provide `onSubmitAsync`; `FormSubmit` reads its pending state. A rejected promise displays the localized `submitErrorMessage`. Use `errors` and matching `Field.error` for application validation, with stable `fieldId` values for focus navigation.

With an external form library, use its native `onSubmit` handler and pass `submitting` yourself. Do not add `onSubmitAsync` to a handler that calls `preventDefault`. The MDS `useFormStatus` hook reads MDS Form state; it is distinct from React DOM's hook of the same name.

## Tabs and SegmentedControl

Tabs use underlined navigation for associated panels. SegmentedControl selects one value and owns the segmented appearance, with size and shape options. In alpha.10, remove alpha.9’s variant/size/shape props from Tabs; use SegmentedControl for mode and billing-cycle selection.

## Product scenarios

Showcase offers 12 bilingual business and consumer scenarios. New scenes include interactions, source and component inventories. State remains in the current demo; no messages, payments, bookings or audio playback are performed.
