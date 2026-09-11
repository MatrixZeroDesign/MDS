import { DonutChart } from "@matrixzero/charts";

export default function Example({ locale = "en", motion = true }: { locale?: "zh" | "en"; motion?: boolean }) {
	const t = (zh: string, en: string) => (locale === "zh" ? zh : en);
	return (
		<DonutChart
			motion={motion}
			title={t("流量组成", "Traffic mix")}
			data={[
				{ label: "Chat", value: 64 },
				{ label: "Code", value: 36 },
			]}
			labels={{
				dataTable: t("查看数据", "View data"),
				category: t("类别", "Category"),
				value: t("请求", "Requests"),
				total: t("合计", "Total"),
				empty: t("暂无数据", "No data"),
			}}
		/>
	);
}
