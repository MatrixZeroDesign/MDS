import { LineChart as RLineChart, Line } from "recharts";
import { CartesianChart, colorOf, type RenderChartProps, type LineAreaChartProps } from "./shared.js";
function renderChart({ common, axes, series, smooth, stacked, hasNegative, marker }: RenderChartProps) {
	return (
		<RLineChart {...common}>
			{axes}
			{series.map((s, i) => (
				<Line
					key={s.key}
					type={smooth ? "monotone" : "linear"}
					dataKey={s.key}
					name={s.label}
					stroke={colorOf(s, i)}
					strokeWidth={2}
					dot={marker(s, i)}
					activeDot={marker(s, i, true)}
					connectNulls={false}
					isAnimationActive={false}
				/>
			))}
		</RLineChart>
	);
}
export const LineChart = (props: LineAreaChartProps) => (
	<CartesianChart {...props} kind="line" renderChart={renderChart} />
);
