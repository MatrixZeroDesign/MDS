import { BarChart } from "@matrixzero/charts";

export default function Example() {
	return (
		<BarChart
			title="请求量 Requests"
			locale="zh-CN"
			data={[
				{ label: "Mon", requests: 120 },
				{ label: "Tue", requests: null },
				{ label: "Wed", requests: 180 },
			]}
			series={[{ key: "requests", label: "请求 Requests" }]}
			labels={{
				dataTable: "查看数据 View data",
				category: "日期 Day",
				empty: "暂无数据 No data",
				missing: "缺失 Missing",
			}}
		/>
	);
}
