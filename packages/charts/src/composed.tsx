import {
	Area,
	Bar,
	CartesianGrid,
	ComposedChart as RComposedChart,
	Line,
	ReferenceLine,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import {
	ChartTip,
	DataTable,
	Frame,
	Legend,
	Plot,
	axisFormatter,
	colorOf,
	defaultFormatter,
	finite,
	plotHeight,
	pointMarker,
	type ChartDatum,
	type ChartLabels,
	type ChartPointShape,
	type ChartSeries,
} from "./shared.js";

interface ComposedSeriesBase extends ChartSeries {
	/** Bind the series to a configured y-axis. Defaults to the first axis. */
	yAxisId?: string;
}

export interface ComposedLineSeries extends ComposedSeriesBase {
	type: "line";
	smooth?: boolean;
	strokeWidth?: number;
}

export interface ComposedAreaSeries extends ComposedSeriesBase {
	type: "area";
	smooth?: boolean;
	stackId?: string;
	fillOpacity?: number;
}

export interface ComposedBarSeries extends ComposedSeriesBase {
	type: "bar";
	stackId?: string;
	maxBarSize?: number;
}

export type ComposedChartSeries = ComposedLineSeries | ComposedAreaSeries | ComposedBarSeries;

export interface ChartXAxis {
	dataKey?: string;
	label?: string;
	minTickGap?: number;
	valueFormatter?: (value: string | number) => string;
}

export interface ChartYAxis {
	id: string;
	position?: "left" | "right";
	label?: string;
	width?: number;
	min?: number | "auto";
	max?: number | "auto";
	valueFormatter?: (value: number) => string;
}

export interface ComposedChartProps {
	title: string;
	description?: string;
	data: readonly ChartDatum[];
	series: readonly ComposedChartSeries[];
	xAxis?: ChartXAxis;
	yAxes?: readonly ChartYAxis[];
	height?: number;
	motion?: boolean;
	locale?: string;
	labels?: ChartLabels;
	formatValue?: (value: number) => string;
}

const defaultAxis: ChartYAxis = { id: "primary", position: "left" };

/** Layer bar, line and area series on shared axes without exposing the rendering vendor. */
export function ComposedChart({
	title,
	description,
	data,
	series,
	xAxis,
	yAxes = [defaultAxis],
	height = 240,
	motion = true,
	locale,
	labels,
	formatValue,
}: ComposedChartProps) {
	const axes = yAxes.length ? yAxes : [defaultAxis];
	const axisIds = new Set(axes.map((axis) => axis.id));
	if (axisIds.size !== axes.length) throw new RangeError("ComposedChart y-axis ids must be unique");
	if (series.some((item) => item.key === "label"))
		throw new RangeError('ComposedChart series cannot use the reserved key "label"');
	if (new Set(series.map((item) => item.key)).size !== series.length)
		throw new RangeError("ComposedChart series keys must be unique");
	if (series.some((item) => item.yAxisId && !axisIds.has(item.yAxisId)))
		throw new RangeError("ComposedChart series must reference a configured y-axis");

	const primaryAxisId = axes[0].id;
	const normalizedSeries = series.map((item) => ({ ...item, yAxisId: item.yAxisId ?? primaryAxisId }));
	const layerOrder = { area: 0, bar: 1, line: 2 } as const;
	const renderedSeries = [...normalizedSeries].sort((a, b) => layerOrder[a.type] - layerOrder[b.type]);
	const sanitized: ChartDatum[] = data.map((datum) => ({
		...datum,
		...Object.fromEntries(series.map((item) => [item.key, finite(datum[item.key]) ? datum[item.key] : null])),
		label: datum.label,
	}));
	const empty = !series.length || !sanitized.some((datum) => series.some((item) => finite(datum[item.key])));
	const format = formatValue ?? defaultFormatter(locale);
	const hasNegative = (axisId: string) =>
		sanitized.some((datum) =>
			normalizedSeries.some(
				(item) => item.yAxisId === axisId && finite(datum[item.key]) && (datum[item.key] as number) < 0,
			),
		);
	const marker = (item: ComposedLineSeries | ComposedAreaSeries, index: number, active = false) => {
		const shape: ChartPointShape | "none" | undefined = item.pointShape;
		if (!active && (shape === "none" || (!shape && sanitized.length !== 1))) return false;
		return pointMarker(!shape || shape === "none" ? "circle" : shape, colorOf(item, index), active);
	};

	return (
		<Frame title={title} description={description}>
			<Legend series={series} />
			{empty ? (
				<div className="mds-chart-empty" style={{ minHeight: plotHeight(height) }}>
					{labels?.empty ?? "No data"}
				</div>
			) : (
				<Plot height={height} motion={motion} signature={JSON.stringify([sanitized, series, axes])}>
					<ResponsiveContainer width="100%" height="100%" minWidth={0}>
						<RComposedChart
							data={sanitized}
							margin={{ top: 16, right: 16, bottom: 4, left: 0 }}
							accessibilityLayer
							aria-label={title}
						>
							<CartesianGrid vertical={false} stroke="var(--mds-border)" strokeOpacity={0.65} strokeDasharray="3 4" />
							<XAxis
								dataKey={xAxis?.dataKey ?? "label"}
								label={xAxis?.label ? { value: xAxis.label, position: "insideBottom", offset: -2 } : undefined}
								tickLine={false}
								axisLine={false}
								tick={{ fill: "var(--mds-muted)", fontSize: 11 }}
								minTickGap={xAxis?.minTickGap ?? 24}
								interval="preserveStartEnd"
								tickMargin={10}
								tickFormatter={xAxis?.valueFormatter}
							/>
							{axes.map((axis) => (
								<YAxis
									key={axis.id}
									yAxisId={axis.id}
									orientation={axis.position ?? "left"}
									label={
										axis.label
											? {
													value: axis.label,
													angle: axis.position === "right" ? 90 : -90,
													position: axis.position === "right" ? "insideRight" : "insideLeft",
												}
											: undefined
									}
									domain={[axis.min ?? "auto", axis.max ?? "auto"]}
									tickLine={false}
									axisLine={false}
									width={axis.width ?? 48}
									tick={{ fill: "var(--mds-muted)", fontSize: 11 }}
									tickFormatter={axis.valueFormatter ?? axisFormatter(locale)}
								/>
							))}
							{axes
								.filter((axis) => hasNegative(axis.id))
								.map((axis) => (
									<ReferenceLine key={axis.id} yAxisId={axis.id} y={0} stroke="var(--mds-muted)" strokeOpacity={0.55} />
								))}
							<Tooltip
								isAnimationActive={false}
								filterNull={false}
								content={<ChartTip format={format} missing={labels?.missing} series={series} />}
								cursor={{ stroke: "var(--mds-muted)", strokeOpacity: 0.35, strokeDasharray: "3 3" }}
							/>
							{renderedSeries.map((item) => {
								const index = series.findIndex((seriesItem) => seriesItem.key === item.key);
								const color = colorOf(item, index);
								if (item.type === "area")
									return (
										<Area
											key={item.key}
											type={item.smooth ? "monotone" : "linear"}
											dataKey={item.key}
											name={item.label}
											yAxisId={item.yAxisId}
											stackId={item.stackId}
											stroke={color}
											fill={color}
											fillOpacity={item.fillOpacity ?? 0.13}
											strokeWidth={2}
											dot={marker(item, index)}
											activeDot={marker(item, index, true)}
											connectNulls={false}
											isAnimationActive={false}
										/>
									);
								if (item.type === "bar")
									return (
										<Bar
											key={item.key}
											dataKey={item.key}
											name={item.label}
											yAxisId={item.yAxisId}
											stackId={item.stackId}
											fill={color}
											maxBarSize={item.maxBarSize ?? 32}
											radius={item.stackId || hasNegative(item.yAxisId) ? 0 : [3, 3, 0, 0]}
											isAnimationActive={false}
										/>
									);
								return (
									<Line
										key={item.key}
										type={item.smooth ? "monotone" : "linear"}
										dataKey={item.key}
										name={item.label}
										yAxisId={item.yAxisId}
										stroke={color}
										strokeWidth={item.strokeWidth ?? 2}
										dot={marker(item, index)}
										activeDot={marker(item, index, true)}
										connectNulls={false}
										isAnimationActive={false}
									/>
								);
							})}
						</RComposedChart>
					</ResponsiveContainer>
				</Plot>
			)}
			<DataTable title={title} data={sanitized} series={series} labels={labels} format={format} />
		</Frame>
	);
}
