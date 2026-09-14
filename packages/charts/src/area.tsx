import { AreaChart as RAreaChart, Area } from "recharts";
import { CartesianChart, colorOf, type RenderChartProps, type LineAreaChartProps } from "./shared.js";
function renderChart({ common, axes, series, smooth, stacked, hasNegative, marker }: RenderChartProps) {
	return (
		<RAreaChart {...common} stackOffset="sign" baseValue={0}>
			{axes}
			{series.map((s, i) => (
				<Area
					key={s.key}
					type={smooth ? "monotone" : "linear"}
					dataKey={s.key}
					name={s.label}
					stroke={colorOf(s, i)}
					fill={colorOf(s, i)}
					fillOpacity={0.13}
					strokeWidth={2}
					stackId={stacked ? "total" : undefined}
					dot={marker(s, i)}
					activeDot={marker(s, i, true)}
					connectNulls={false}
					isAnimationActive={false}
				/>
			))}
		</RAreaChart>
	);
}
export const AreaChart = (props: LineAreaChartProps) => (
	<CartesianChart {...props} kind="area" renderChart={renderChart} />
);
