import { BarChart as RBarChart, Bar } from "recharts";
import { CartesianChart, colorOf, type RenderChartProps, type CartesianChartProps } from "./shared.js";
function renderChart({ common, axes, series, smooth, stacked, hasNegative, marker }: RenderChartProps) {
	return (
		<RBarChart {...common} stackOffset="sign" barGap={4} barCategoryGap="24%">
			{axes}
			{series.map((s, i) => (
				<Bar
					key={s.key}
					dataKey={s.key}
					name={s.label}
					fill={colorOf(s, i)}
					maxBarSize={32}
					radius={stacked || hasNegative ? 0 : [3, 3, 0, 0]}
					stackId={stacked ? "total" : undefined}
					isAnimationActive={false}
				/>
			))}
		</RBarChart>
	);
}
export const BarChart = (props: CartesianChartProps) => (
	<CartesianChart {...props} kind="bar" renderChart={renderChart} />
);
