import { AreaChart } from "@matrixzero/charts";

export default function Example({
	locale = "en",
	motion = true,
	stacked = false,
}: {
	locale?: "zh" | "en";
	motion?: boolean;
	stacked?: boolean;
}) {
	const t = (zh: string, en: string) => (locale === "zh" ? zh : en);
	return (
		<AreaChart
			stacked={stacked}
			motion={motion}
			title={t("请求量", "Requests")}
			locale={locale === "zh" ? "zh-CN" : "en"}
			data={[
				{ label: "Mon", requests: 120 },
				{ label: "Tue", requests: null },
				{ label: "Wed", requests: 180 },
			]}
			series={[{ key: "requests", label: t("请求", "Requests") }]}
			labels={{
				dataTable: t("查看数据", "View data"),
				category: t("日期", "Day"),
				empty: t("暂无数据", "No data"),
				missing: t("缺失", "Missing"),
			}}
		/>
	);
}
