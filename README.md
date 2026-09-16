# Matrix Design System

MDS is the React design system for Matrix products. It provides bilingual typography guidance, independent themes, accessible components, and restrained micro-interactions. The component package is **@matrixzero/ui**, presented as **Matrix UI**.

UI is currently **0.1.0-alpha.12**, Icons is **0.1.0-alpha.5**, Charts is **0.1.0-alpha.4**, and Brand Icons is **0.1.0-alpha.1**. These packages are ready for product development.

Documentation site: [Matrix Design System](https://matrixzerodesign.github.io/MDS/). It includes interactive components, installation and API guides, charts, and a searchable icon catalog.

## Repository structure

- `packages/icons`: 381 independently drawn SVG icons with accessible names and 16/20/24px sizing.
- `packages/brand-icons`: 386 optically normalized AI, product, vehicle, payment, networking, data, and Web3 brand icons.
- `packages/charts`: Line, area, bar, donut, and stacked charts with accessible data tables.
- `packages/ui`: The single source for component implementations, CSS tokens, and explicit brand themes.
- `apps/docs`: A bilingual showcase site that uses the published package APIs, including the component gallery and MT0 scenarios.
- `tests`: Browser interaction, accessibility, theme, and layout regression coverage.
- `scripts`: Package builds, installation checks, and publishing.
- `docs`: Design decisions, theme contracts, and maintenance guidance.

## Local development

Node.js 22 LTS、npm 10。

```sh
npm ci
npm run dev
# http://127.0.0.1:4173
```

After changing a package, run `npm run build:packages`; the showcase reloads the built output so development and installed export paths stay consistent.

```sh
npm run typecheck
npm run build
npx playwright install chromium
npm test
npm run test:package
# Full validation:
npm run check
```

Browser tests cover real interactions and Axe WCAG checks; they do not replace manual assistive-technology review. Fonts use an explicit system stack, so glyphs can vary across platforms. Commercial fonts are never bundled without authorization.

## Installation

Packages are published to the public npm registry; consumers need no additional registry configuration.

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
			<Field label="工作区名称 / Workspace name" required>
				<Input name="workspace" defaultValue="Engineering" />
			</Field>
			<Button variant="primary">保存 Save</Button>
		</ThemeProvider>
	);
}
```

The packages do not depend on consumer Tailwind configuration. React and React DOM are peer dependencies, so a second React copy is not bundled. ESM and type declarations ship with each package, and CSS must be imported explicitly.

## Components

- Forms: Button, IconButton, SegmentedControl, RadioCardGroup / RadioCard, Field, Input, Textarea, Select, Checkbox, CheckField, Switch, RadioGroup, RadioItem, Slider.
- Overlays: ChoiceMenu, DropdownMenu and its parts, Dialog and its parts, Tooltip / TooltipProvider.
- Display: Avatar, Badge, List / ListItem, Table, Pagination, Steps.
- Feedback: Alert, EmptyState, Progress, Skeleton.
- Application shell: Navbar, NavRail / NavItem / NavLink, NavDrawer and its parts.
- Side panels: SideSheet and its parts.
- Expandable regions: Collapse / CollapseTrigger / CollapseContent.
- Navigation: Tabs / TabList / Tab / TabPanel, Accordion and its parts.
- Themes: ThemeProvider, ThemeMode, ThemeStyle.

`Select` is the themed form listbox using `options`/`onValueChange`, with submission, reset, and required validation. `NativeSelect` explicitly provides the legacy option-children/onChange native API. `ChoiceMenu` is a non-modal selection menu for filters and preferences with real `menuitemradio` semantics; it is not a combobox. A searchable combobox remains a separate design.

Field associates the label, description, error, required, and disabled states. Pass an explicit ID to Field when needed; do not assign a conflicting ID to the inner control. Non-MDS controls can integrate through `useFieldProps`.

All overlays render in the current ThemeProvider portal container and retain its brand and appearance tokens. Menus do not lock scrolling by default (ChoiceMenu is always non-modal; set `modal={false}` when using DropdownMenu); a truly modal Dialog uses Radix focus and scroll locking. Avoid `transform`/`filter`/`contain:paint` on ThemeProvider ancestors because they change fixed-overlay positioning.

## Releases and upgrades

详见 [发布规范](docs/releasing.md)、[主题与组件边界](docs/architecture.md)、[动效规范](docs/motion.md)。

Preview packages use the `next` dist-tag and stable packages use `latest`. Consumers pin versions and upgrade through an MR; MT0 dependencies never change silently. Creating the independent repository does not mean MT0 has completed its migration.

## Sources and design references

- We reuse the interaction foundation from [Radix Primitives](https://www.radix-ui.com/primitives/docs/overview/introduction); MDS owns visual design, composition, and theme boundaries.
- [shadcn shared UI packages](https://ui.shadcn.com/docs/monorepo) informed the independent package organization; this project publishes compiled CSS so consumers do not scan package source.
- We reference the clarity and restraint of [OpenAI UI guidelines](https://developers.openai.com/plugins/concepts/ui-guidelines); MDS is an independent implementation and does not claim to use ChatGPT internal code.
- [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/) provides public package distribution and build provenance.

MDS uses the MIT License; third-party dependencies retain their own licenses.

## Usage and AI guides / 组件使用文档

See [documentation maintenance and source](docs/README.md), [integration](docs/guides/integration.md), and [design guidance](docs/guides/design-and-accessibility.md). The [portal](https://matrixzerodesign.github.io/MDS/docs/) includes 45 component guides with type-checked examples; AI clients can start at [llms.txt](https://matrixzerodesign.github.io/MDS/llms.txt).
