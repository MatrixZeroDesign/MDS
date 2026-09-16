import { ComposedChart } from "@matrixzero/charts";
import { languageTag, type DocsLocale, translate } from "../i18n";

export default function Example({ locale = "en", motion = true }: { locale?: DocsLocale; motion?: boolean }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	const currency = new Intl.NumberFormat(languageTag(locale), {
		style: "currency",
		currency: "USD",
		notation: "compact",
		maximumFractionDigits: 1,
	});
	const percent = new Intl.NumberFormat(languageTag(locale), {
		style: "percent",
		maximumFractionDigits: 1,
	});
	return (
		<ComposedChart
			motion={motion}
			title={t("收入与转化率", "Revenue and conversion")}
			description={t(
				"柱形和折线共享分类轴并使用独立数值轴。",
				"Bars and a line share categories and use separate value axes.",
			)}
			locale={languageTag(locale)}
			height={300}
			data={[
				{ label: t("一月", "Jan"), revenue: 184000, conversion: 0.032 },
				{ label: t("二月", "Feb"), revenue: 216000, conversion: 0.038 },
				{ label: t("三月", "Mar"), revenue: 208000, conversion: 0.041 },
				{ label: t("四月", "Apr"), revenue: 252000, conversion: 0.046 },
				{ label: t("五月", "May"), revenue: 271000, conversion: 0.043 },
				{ label: t("六月", "Jun"), revenue: 296000, conversion: 0.051 },
			]}
			yAxes={[
				{
					id: "revenue",
					position: "left",
					label: t("收入", "Revenue"),
					valueFormatter: (value) => currency.format(value),
				},
				{
					id: "conversion",
					position: "right",
					label: t("转化率", "Conversion"),
					min: 0,
					valueFormatter: (value) => percent.format(value),
				},
			]}
			series={[
				{
					type: "bar",
					key: "revenue",
					label: t("收入", "Revenue"),
					yAxisId: "revenue",
					valueFormatter: (value) => currency.format(value),
				},
				{
					type: "line",
					key: "conversion",
					label: t("转化率", "Conversion"),
					yAxisId: "conversion",
					valueFormatter: (value) => percent.format(value),
					smooth: true,
					pointShape: "circle",
				},
			]}
			labels={{
				dataTable: t("查看数据", "View data"),
				category: t("月份", "Month"),
				empty: t("暂无数据", "No data"),
				missing: t("缺失", "Missing"),
			}}
		/>
	);
}
