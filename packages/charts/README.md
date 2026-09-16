# @matrixzero/charts

Theme-aware charts for **Matrix Design System**, independently installable from the core UI package. Built on Recharts, with MDS typography, semantic theme colors, exact-value tooltips and accessible data tables.

The package includes responsive line, area, bar, donut, pie, scatter and composed Cartesian charts. Every chart exposes a figure title, localized labels, reduced-motion support and an accessible representation of its data.

## Installation

Install compatible versions of `@matrixzero/ui`, `@matrixzero/charts`, React and React DOM from the public npm registry. React 19 is required. Charts are not included in the core UI bundle.

```tsx
import { LineChart } from "@matrixzero/charts";
import "@matrixzero/ui/styles.css";
import "@matrixzero/charts/styles.css";

<LineChart
	title="Requests"
	description="Daily observations"
	locale="zh-CN"
	data={[
		{ label: "Mon", requests: 1240 },
		{ label: "Tue", requests: null },
		{ label: "Wed", requests: 1830 },
	]}
	series={[{ key: "requests", label: "Requests" }]}
	labels={{
		dataTable: "View data",
		category: "Day",
		empty: "No data",
		missing: "Missing",
	}}
/>;
```

Render charts inside the MDS root/provider used by your application. Import the UI stylesheet before the chart stylesheet. All CSS is scoped to `.mds-root`; charts do not change page scrolling or load fonts remotely.

## Components

| Component       | Use                                               |
| --------------- | ------------------------------------------------- |
| `LineChart`     | Trends and observations, including gaps           |
| `AreaChart`     | Magnitude relative to zero; optional `stacked`    |
| `BarChart`      | Grouped comparisons; optional `stacked`           |
| `DonutChart`    | Nonnegative parts of a whole, with a center total |
| `PieChart`      | Nonnegative parts of a whole                      |
| `ScatterChart`  | Relationship between two numeric dimensions       |
| `ComposedChart` | Bar, line and area series on shared or dual axes  |

`ComposedChart` uses a discriminated `series` array rather than exposing Recharts primitives. Each series declares `type: "bar" | "line" | "area"` and can bind to a configured axis with `yAxisId`. Bar and area series can use independent `stackId` values, so grouped, stacked and overlaid series can coexist. The first y-axis is the default for series without an explicit binding.

```tsx
const compactCurrency = (value: number) => `$${Math.round(value / 1000)}k`;
const percent = (value: number) => `${(value * 100).toFixed(1)}%`;

<ComposedChart
	title="Revenue and conversion"
	data={[
		{ label: "Jan", revenue: 184000, conversion: 3.2 },
		{ label: "Feb", revenue: 216000, conversion: 3.8 },
	]}
	yAxes={[
		{ id: "revenue", position: "left", valueFormatter: compactCurrency },
		{ id: "conversion", position: "right", valueFormatter: percent },
	]}
	series={[
		{ type: "bar", key: "revenue", label: "Revenue", yAxisId: "revenue" },
		{
			type: "line",
			key: "conversion",
			label: "Conversion",
			yAxisId: "conversion",
			valueFormatter: percent,
		},
	]}
/>;
```

Cartesian charts share `CartesianChartProps`: `title`, optional `description`, `data`, `series`, `height`, `motion`, `locale`, `labels`, `formatValue`, `formatAxisValue`, and `stacked`. `stacked` affects area and bar charts only. A datum has a category `label` plus numeric or null values keyed by the series. Series keys must be unique and cannot use the reserved `label` key. A series can supply `color` to override its theme color.

Donut data contains `{ label, value, color? }` entries. The same display props apply, except `series`, `stacked` and `formatAxisValue`. `labels.value` names the table's value column; optional `labels.total` adds a translated label under the center total.

Pie data uses the same shape as donut data. Scatter data contains `{ label, x, y }` points; invalid coordinates are omitted and an empty message is shown when no finite points remain.

Default chart height is 240 pixels, with a minimum of 180 pixels. The container must have a nonzero width. Layout is responsive, including 320-pixel viewports. Long tables scroll independently and are keyboard focusable.

## Data integrity and accessibility

- Chart marks reveal with a local 220ms opacity transition on entry and dataset changes. Tooltips appear with a 120ms fade. No geometry, numeric-value interpolation, background movement or tooltip-position animation is used: committed data and exact totals update immediately. `motion={false}` disables these effects; `prefers-reduced-motion: reduce` also removes them, including an in-progress dataset transition. Keyboard focus is preserved across updates.
- Lines use straight segments. Null, nonnumeric and nonfinite Cartesian values remain missing; lines and areas do not bridge those gaps. All-zero Cartesian datasets are real data, not empty states.
- Positive and negative stacked values are accumulated separately. Negative datasets show a zero reference line. Stacked missing values depend on Recharts' stacking model; inspect the accompanying exact data table for completeness and prefer unstacked charts when gaps are significant.
- Donut values must be finite and nonnegative, and their sum must be finite. Invalid input throws `RangeError`; validate external data before rendering or provide an error boundary. Empty and all-zero donut datasets show the supplied empty message, not a misleading full ring.
- Axes use localized compact values. Tooltips and tables use `formatValue` (localized numbers with up to two fractional digits by default). Supply `formatAxisValue` to customize only the axis, and `formatValue` when units or additional precision matter.
- Every figure is named by its title; its description is associated with the figure. Recharts' keyboard accessibility layer is enabled. Every figure also includes a native expandable data table with column and row headers; missing data is explicitly labelled. This table is the reliable alternative for users who cannot distinguish colors or navigate an SVG chart.
- All visible default strings can be overridden through `labels`. Font inheritance covers both Latin and CJK text. Colors use `--mds-chart-1` through `--mds-chart-6`; override these tokens or provide per-series colors for domain-specific palettes. For more than six series, supply distinguishable colors and consider splitting the chart.

## Validation

The repository checks TypeScript, production builds, package installation and browser behavior. Dedicated chart checks cover responsive layout, exact-value tables, changing datasets, invalid donut input and missing-value rendering. Review charts in both themes and languages when changing tokens.
