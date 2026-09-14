import { useEffect, useId, useRef } from "react";
import type { ReactNode, ReactElement } from "react";
import {
	ResponsiveContainer,
	PieChart as RPieChart,
	Pie,
	Cell,
	CartesianGrid,
	XAxis,
	YAxis,
	Tooltip,
	ReferenceLine,
} from "recharts";

export type ChartDatum = { label: string; [key: string]: string | number | null };
export type ChartPointShape = "circle" | "square" | "diamond" | "triangle";
export interface ChartSeries {
	key: string;
	label: string;
	color?: string;
	/** Override the chart point shape for this series. */
	pointShape?: ChartPointShape | "none";
}
export interface ChartLabels {
	dataTable?: string;
	category?: string;
	empty?: string;
	missing?: string;
	total?: string;
}
export interface CartesianChartProps {
	title: string;
	description?: string;
	data: readonly ChartDatum[];
	series: readonly ChartSeries[];
	height?: number;
	/** Local opacity transitions; respects prefers-reduced-motion. Default true. */
	motion?: boolean;
	locale?: string;
	labels?: ChartLabels;
	formatValue?: (value: number) => string;
	/** Axis-only formatting; tooltips and the data table always use formatValue. */
	formatAxisValue?: (value: number) => string;
	stacked?: boolean;
}
export interface LineAreaChartProps extends CartesianChartProps {
	/** Monotone interpolation; missing values remain gaps. Default false. */
	smooth?: boolean;
	/** Default hides markers except for a single observation. */
	pointShape?: ChartPointShape | "none";
}
function pointMarker(shape: ChartPointShape, color: string, active = false) {
	return ({ cx, cy }: { cx?: number; cy?: number }) => {
		if (!finite(cx) || !finite(cy)) return <g />;
		const r = active ? 5 : 3.5;
		return (
			<g
				transform={`translate(${cx} ${cy})`}
				fill={color}
				stroke="var(--mds-surface)"
				strokeWidth={1.5}
				aria-hidden="true"
				data-point-shape={shape}
			>
				{shape === "circle" ? (
					<circle r={r} />
				) : shape === "square" ? (
					<rect x={-r} y={-r} width={r * 2} height={r * 2} rx={0.7} />
				) : shape === "diamond" ? (
					<path d={`M 0 ${-r * 1.3} L ${r * 1.3} 0 L 0 ${r * 1.3} L ${-r * 1.3} 0 Z`} />
				) : (
					<path d={`M 0 ${-r * 1.35} L ${r * 1.2} ${r} L ${-r * 1.2} ${r} Z`} />
				)}
			</g>
		);
	};
}
const colors = Array.from({ length: 6 }, (_, i) => `var(--mds-chart-${i + 1})`);
export const colorOf = (series: { color?: string }, index: number) => series.color ?? colors[index % colors.length];
const finite = (value: unknown): value is number => typeof value === "number" && Number.isFinite(value);
const defaultFormatter = (locale?: string) => {
	const formatter = new Intl.NumberFormat(locale, { maximumFractionDigits: 2 });
	return (value: number) => formatter.format(value);
};
const axisFormatter = (locale?: string) => {
	const formatter = new Intl.NumberFormat(locale, { notation: "compact", maximumFractionDigits: 1 });
	return (value: number) => formatter.format(value);
};
const plotHeight = (height: number) => (finite(height) ? Math.max(180, height) : 240);

function DataTable({
	title,
	data,
	series,
	labels,
	format,
}: {
	title: string;
	data: readonly ChartDatum[];
	series: readonly ChartSeries[];
	labels?: ChartLabels;
	format: (n: number) => string;
}) {
	return (
		<details className="mds-chart-data">
			<summary>{labels?.dataTable ?? "View data"}</summary>
			<div
				className="mds-chart-data-scroll"
				tabIndex={0}
				role="region"
				aria-label={`${title} — ${labels?.dataTable ?? "View data"}`}
			>
				<table aria-label={title}>
					<thead>
						<tr>
							<th scope="col">{labels?.category ?? "Category"}</th>
							{series.map((s) => (
								<th scope="col" key={s.key}>
									{s.label}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{data.map((datum, i) => (
							<tr key={i}>
								<th scope="row">{datum.label}</th>
								{series.map((s) => (
									<td key={s.key}>
										{finite(datum[s.key]) ? (
											format(datum[s.key] as number)
										) : (
											<span aria-label={labels?.missing ?? "Missing value"}>—</span>
										)}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</details>
	);
}
function ChartTip({
	active,
	payload,
	label,
	format,
	missing,
}: {
	active?: boolean;
	payload?: readonly {
		name?: string | number;
		value?: unknown;
		color?: string;
		payload?: { label?: string; fill?: string };
	}[];
	label?: unknown;
	format: (n: number) => string;
	missing?: string;
}) {
	if (!active || !payload?.length) return null;
	const heading = typeof label === "string" || typeof label === "number" ? label : payload[0]?.payload?.label;
	return (
		<div className="mds-chart-tooltip">
			{heading != null && <strong>{heading}</strong>}
			{payload.map((point, i) => (
				<div key={i}>
					<span>
						<i aria-hidden="true" style={{ background: point.color ?? point.payload?.fill }} />
						{point.name}
					</span>
					<b>{finite(point.value) ? format(point.value) : <span aria-label={missing ?? "Missing value"}>—</span>}</b>
				</div>
			))}
		</div>
	);
}
function Legend({ series }: { series: readonly ChartSeries[] }) {
	return (
		<ul className="mds-chart-legend">
			{series.map((s, i) => (
				<li key={s.key}>
					<i aria-hidden="true" style={{ background: colorOf(s, i) }} />
					{s.label}
				</li>
			))}
		</ul>
	);
}
function Frame({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
	const id = useId();
	return (
		<figure className="mds-chart" aria-labelledby={id} aria-describedby={description ? `${id}-description` : undefined}>
			<figcaption>
				<h3 id={id}>{title}</h3>
				{description && <p id={`${id}-description`}>{description}</p>}
			</figcaption>
			{children}
		</figure>
	);
}
const markSelector = ".recharts-line, .recharts-area, .recharts-bar, .recharts-pie";
function Plot({
	children,
	height,
	signature,
	motion,
	donut = false,
}: {
	children: ReactNode;
	height: number;
	signature: string;
	motion: boolean;
	donut?: boolean;
}) {
	const root = useRef<HTMLDivElement>(null);
	const previous = useRef(signature);
	useEffect(() => {
		const changed = previous.current !== signature;
		previous.current = signature;
		if (!motion || !changed) return;
		const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
		if (preference.matches) return;
		// Animate only opacity of the committed observations, preserving keyboard focus and exact geometry.
		const animations = Array.from(root.current?.querySelectorAll(markSelector) ?? []).map((mark) =>
			mark.animate([{ opacity: 0.45 }, { opacity: 1 }], {
				duration: 220,
				easing: "cubic-bezier(0.2, 0, 0, 1)",
			}),
		);
		const cancel = () => animations.forEach((animation) => animation.cancel());
		preference.addEventListener("change", cancel);
		return () => {
			cancel();
			preference.removeEventListener("change", cancel);
		};
	}, [signature, motion]);
	return (
		<div
			ref={root}
			className={`mds-chart-plot${donut ? " mds-chart-donut" : ""}`}
			data-motion={motion ? "on" : "off"}
			onPointerDownCapture={(event) => {
				if (event.pointerType === "mouse" && event.button === 0 && (event.target as Element).closest("svg"))
					event.preventDefault();
			}}
			style={{ height: plotHeight(height) }}
		>
			{children}
		</div>
	);
}
export function CartesianChart({
	renderChart,
	kind,
	title,
	description,
	data,
	series,
	height = 240,
	motion = true,
	locale,
	labels,
	formatValue,
	formatAxisValue,
	stacked = false,
	smooth = false,
	pointShape,
}: LineAreaChartProps & { kind: "line" | "area" | "bar"; renderChart: (props: RenderChartProps) => ReactElement }) {
	const format = formatValue ?? defaultFormatter(locale);
	const sanitized: ChartDatum[] = data.map((d) => ({
		...Object.fromEntries(series.map((s) => [s.key, finite(d[s.key]) ? d[s.key] : null])),
		label: d.label,
	}));
	const empty = !series.length || !sanitized.some((d) => series.some((s) => finite(d[s.key])));
	const hasNegative = sanitized.some((d) => series.some((s) => finite(d[s.key]) && (d[s.key] as number) < 0));
	const common = {
		data: sanitized,
		margin: { top: 16, right: 16, bottom: 4, left: 0 },
		accessibilityLayer: true,
		"aria-label": title,
	};
	const axes = (
		<>
			<CartesianGrid vertical={false} stroke="var(--mds-border)" strokeOpacity={0.65} strokeDasharray="3 4" />
			<XAxis
				dataKey="label"
				tickLine={false}
				axisLine={false}
				tick={{ fill: "var(--mds-muted)", fontSize: 11 }}
				minTickGap={24}
				interval="preserveStartEnd"
				tickMargin={10}
			/>
			<YAxis
				tickLine={false}
				axisLine={false}
				width={48}
				tick={{ fill: "var(--mds-muted)", fontSize: 11 }}
				tickFormatter={formatAxisValue ?? axisFormatter(locale)}
			/>
			{hasNegative && <ReferenceLine y={0} stroke="var(--mds-muted)" strokeOpacity={0.55} />}
			<Tooltip
				isAnimationActive={false}
				filterNull={false}
				content={<ChartTip format={format} missing={labels?.missing} />}
				cursor={
					kind === "bar"
						? { fill: "var(--mds-hover)", stroke: "none" }
						: { stroke: "var(--mds-muted)", strokeOpacity: 0.35, strokeDasharray: "3 3" }
				}
			/>
		</>
	);
	const marker = (s: ChartSeries, i: number, active = false) => {
		const shape = s.pointShape ?? pointShape;
		if (!active && (shape === "none" || (!shape && sanitized.length !== 1))) return false;
		return pointMarker(!shape || shape === "none" ? "circle" : shape, colorOf(s, i), active);
	};
	const chart = renderChart({ common, axes, series, smooth, stacked, hasNegative, marker });
	return (
		<Frame title={title} description={description}>
			<Legend series={series} />
			{empty ? (
				<div className="mds-chart-empty" style={{ minHeight: plotHeight(height) }}>
					{labels?.empty ?? "No data"}
				</div>
			) : (
				<Plot height={height} motion={motion} signature={JSON.stringify([sanitized, series, stacked, kind])}>
					<ResponsiveContainer width="100%" height="100%" minWidth={0}>
						{chart}
					</ResponsiveContainer>
				</Plot>
			)}
			<DataTable title={title} data={sanitized} series={series} labels={labels} format={format} />
		</Frame>
	);
}
export interface DonutChartProps {
	title: string;
	description?: string;
	data: readonly { label: string; value: number; color?: string }[];
	height?: number;
	/** Local opacity transitions; respects prefers-reduced-motion. Default true. */
	motion?: boolean;
	locale?: string;
	labels?: ChartLabels & { value?: string };
	formatValue?: (value: number) => string;
}
/** Nonnegative finite values only. Invalid data is rejected instead of silently changing totals. */
export function DonutChart({
	title,
	description,
	data,
	height = 240,
	motion = true,
	locale,
	labels,
	formatValue,
}: DonutChartProps) {
	if (data.some((d) => !finite(d.value) || d.value < 0))
		throw new RangeError("DonutChart values must be finite and nonnegative");
	const format = formatValue ?? defaultFormatter(locale),
		empty = !data.some((d) => d.value > 0);
	const total = data.reduce((sum, d) => sum + d.value, 0);
	if (!finite(total)) throw new RangeError("DonutChart total must be finite");
	return (
		<Frame title={title} description={description}>
			<Legend series={data.map((d, i) => ({ key: String(i), label: d.label, color: colorOf(d, i) }))} />
			{empty ? (
				<div className="mds-chart-empty" style={{ minHeight: plotHeight(height) }}>
					{labels?.empty ?? "No data"}
				</div>
			) : (
				<Plot height={height} motion={motion} signature={JSON.stringify(data)} donut>
					<ResponsiveContainer width="100%" height="100%" minWidth={0}>
						<RPieChart accessibilityLayer aria-label={title}>
							<Pie
								data={data.map((d, i) => ({ ...d, fill: colorOf(d, i) }))}
								dataKey="value"
								nameKey="label"
								cx="50%"
								cy="50%"
								innerRadius="60%"
								outerRadius="82%"
								paddingAngle={data.filter((d) => d.value > 0).length > 1 ? 2 : 0}
								stroke="var(--mds-surface)"
								isAnimationActive={false}
							>
								{data.map((d, i) => (
									<Cell key={i} fill={colorOf(d, i)} />
								))}
							</Pie>
							<Tooltip isAnimationActive={false} content={<ChartTip format={format} />} />
						</RPieChart>
					</ResponsiveContainer>
					<div className="mds-chart-total" aria-hidden="true">
						<strong title={format(total)}>{format(total)}</strong>
						{labels?.total && <span>{labels.total}</span>}
					</div>
				</Plot>
			)}
			<DataTable
				title={title}
				data={data.map((d) => ({ label: d.label, value: d.value }))}
				series={[{ key: "value", label: labels?.value ?? "Value" }]}
				labels={labels}
				format={format}
			/>
		</Frame>
	);
}

export interface RenderChartProps {
	common: {
		data: ChartDatum[];
		margin: { top: number; right: number; bottom: number; left: number };
		accessibilityLayer: boolean;
		"aria-label": string;
	};
	axes: ReactElement;
	series: readonly ChartSeries[];
	smooth: boolean;
	stacked: boolean;
	hasNegative: boolean;
	marker: (
		series: ChartSeries,
		index: number,
		active?: boolean,
	) => false | ((props: { cx?: number; cy?: number }) => ReactElement);
}
