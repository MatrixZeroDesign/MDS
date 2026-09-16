import { type DocsLocale, translate } from "../i18n";
import { PieChart } from "@matrixzero/charts";

export default function Example({ locale = "en", motion = true }: { locale?: DocsLocale; motion?: boolean }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	return (
		<PieChart
			motion={motion}
			title={t("流量组成", "Traffic distribution")}
			data={[
				{ label: t("对话", "Chat"), value: 42800 },
				{ label: t("代码", "Code"), value: 24600 },
				{ label: t("搜索", "Search"), value: 18300 },
			]}
			labels={{
				dataTable: t("查看数据", "View data"),
				category: t("类别", "Category"),
				value: t("请求", "Requests"),
				total: t("合计", "Total"),
			}}
		/>
	);
}
