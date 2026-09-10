import { DonutChart } from "@matrixzero/charts";

export default function Example() {
	return (
		<DonutChart
			title="流量组成 Traffic mix"
			data={[
				{ label: "Chat", value: 64 },
				{ label: "Code", value: 36 },
			]}
			labels={{
				dataTable: "查看数据 View data",
				category: "类别 Category",
				value: "请求 Requests",
				total: "合计 Total",
				empty: "暂无数据 No data",
			}}
		/>
	);
}
