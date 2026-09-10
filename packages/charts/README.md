# @matrixzero/charts

Theme-aware charts for **Matrix Design System**, independently installable from the core UI package. Built on Recharts, with MDS typography, semantic theme colors, exact-value tooltips and accessible data tables.

## Installation

Configure the private registry using the repository documentation, then install compatible versions of `@matrixzero/ui`, `@matrixzero/charts`, React and React DOM. React 19 is required. Charts are not included in the core UI bundle.

```tsx
import { LineChart } from "@matrixzero/charts";
import "@matrixzero/ui/styles.css";
import "@matrixzero/charts/styles.css";

<LineChart
	title="Requests / 请求量"
	description="Daily observations · 每日采样"
	locale="zh-CN"
	data={[
		{ label: "Mon", requests: 1240 },
		{ label: "Tue", requests: null },
		{ label: "Wed", requests: 1830 },
	]}
	series={[{ key: "requests", label: "Requests / 请求量" }]}
	labels={{
		dataTable: "查看数据",
		category: "日期",
		empty: "暂无数据",
		missing: "缺失值",
	}}
/>;
```

Render charts inside the MDS root/provider used by your application. Import the UI stylesheet before the chart stylesheet. All CSS is scoped to `.mds-root`; charts do not change page scrolling or load fonts remotely.

## Components

| Component    | Use                                               |
| ------------ | ------------------------------------------------- |
| `LineChart`  | Trends and observations, including gaps           |
| `AreaChart`  | Magnitude relative to zero; optional `stacked`    |
| `BarChart`   | Grouped comparisons; optional `stacked`           |
| `DonutChart` | Nonnegative parts of a whole, with a center total |

Cartesian charts share `CartesianChartProps`: `title`, optional `description`, `data`, `series`, `height`, `locale`, `labels`, `formatValue`, `formatAxisValue`, and `stacked`. `stacked` affects area and bar charts only. A datum has a category `label` plus numeric or null values keyed by the series. Series keys must be unique and cannot use the reserved `label` key. A series can supply `color` to override its theme color.

Donut data contains `{ label, value, color? }` entries. The same display props apply, except `series`, `stacked` and `formatAxisValue`. `labels.value` names the table's value column; optional `labels.total` adds a translated label under the center total.

Default chart height is 240 pixels, with a minimum of 180 pixels. The container must have a nonzero width. Layout is responsive, including 320-pixel viewports. Long tables scroll independently and are keyboard focusable.

## Data integrity and accessibility

- No data-drawing, value-interpolation or tooltip movement animations. Changing datasets shows the actual new values immediately, including with reduced motion enabled.
- Lines use straight segments. Null, nonnumeric and nonfinite Cartesian values remain missing; lines and areas do not bridge those gaps. All-zero Cartesian datasets are real data, not empty states.
- Positive and negative stacked values are accumulated separately. Negative datasets show a zero reference line. Stacked missing values depend on Recharts' stacking model; inspect the accompanying exact data table for completeness and prefer unstacked charts when gaps are significant.
- Donut values must be finite and nonnegative, and their sum must be finite. Invalid input throws `RangeError`; validate external data before rendering or provide an error boundary. Empty and all-zero donut datasets show the supplied empty message, not a misleading full ring.
- Axes use localized compact values. Tooltips and tables use `formatValue` (localized numbers with up to two fractional digits by default). Supply `formatAxisValue` to customize only the axis, and `formatValue` when units or additional precision matter.
- Every figure is named by its title; its description is associated with the figure. Recharts' keyboard accessibility layer is enabled. Every figure also includes a native expandable data table with column and row headers; missing data is explicitly labelled. This table is the reliable alternative for users who cannot distinguish colors or navigate an SVG chart.
- All visible default strings can be overridden through `labels`. Font inheritance covers both Latin and CJK text. Colors use `--mds-chart-1` through `--mds-chart-6`; override these tokens or provide per-series colors for domain-specific palettes. For more than six series, supply distinguishable colors and consider splitting the chart.

## Validation

The repository checks TypeScript, production builds, package installation and browser behavior. Dedicated chart checks cover responsive layout, exact-value tables, changing datasets, invalid donut input and missing-value rendering. Review charts in both themes and languages when changing tokens.
