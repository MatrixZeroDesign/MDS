import {
	CartesianGrid,
	ResponsiveContainer,
	Scatter,
	ScatterChart as RScatterChart,
	Tooltip,
	XAxis,
	YAxis,
	ZAxis,
} from "recharts";
import { ChartTip, Frame, Legend, Plot, colorOf, type ChartLabels, type ChartSeries } from "./shared.js";

export interface ScatterDatum {
	label: string;
	x: number | null;
	y: number | null;
}

export interface ScatterChartProps {
	title: string;
	description?: string;
	data: readonly ScatterDatum[];
	series?: readonly ChartSeries[];
	height?: number;
	motion?: boolean;
	locale?: string;
	labels?: ChartLabels;
	formatValue?: (value: number) => string;
}

export function ScatterChart({
	title,
	description,
	data,
	height = 240,
	motion = true,
	labels,
	formatValue,
}: ScatterChartProps) {
	const points = data.filter((point) => Number.isFinite(point.x) && Number.isFinite(point.y));
	const format =
		formatValue ?? ((value: number) => new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(value));
	return (
		<Frame title={title} description={description}>
			<Legend series={[{ key: "points", label: labels?.category ?? "Observations", color: colorOf({}, 0) }]} />
			{points.length === 0 ? (
				<div className="mds-chart-empty" style={{ minHeight: Math.max(180, height) }}>
					{labels?.empty ?? "No data"}
				</div>
			) : (
				<Plot height={height} motion={motion} signature={JSON.stringify(points)}>
					<ResponsiveContainer width="100%" height="100%" minWidth={0}>
						<RScatterChart accessibilityLayer aria-label={title} margin={{ top: 16, right: 16, bottom: 4, left: 0 }}>
							<CartesianGrid stroke="var(--mds-border)" strokeOpacity={0.65} strokeDasharray="3 4" />
							<XAxis
								type="number"
								dataKey="x"
								name="X"
								tickLine={false}
								axisLine={false}
								tick={{ fill: "var(--mds-muted)", fontSize: 11 }}
							/>
							<YAxis
								type="number"
								dataKey="y"
								name="Y"
								tickLine={false}
								axisLine={false}
								width={48}
								tick={{ fill: "var(--mds-muted)", fontSize: 11 }}
							/>
							<ZAxis range={[56, 56]} />
							<Tooltip isAnimationActive={false} content={<ChartTip format={format} />} />
							<Scatter
								name={labels?.category ?? "Observations"}
								data={points}
								fill={colorOf({}, 0)}
								isAnimationActive={false}
							/>
						</RScatterChart>
					</ResponsiveContainer>
				</Plot>
			)}
		</Frame>
	);
}
