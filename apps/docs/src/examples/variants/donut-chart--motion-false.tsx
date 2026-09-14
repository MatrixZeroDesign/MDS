import { type DocsLocale, translate } from "../../i18n";
import { DonutChart } from "@matrixzero/charts";

export default function Example({ locale = "en", motion = false }: { locale?: DocsLocale; motion?: boolean }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	// Deterministic synthetic data for documentation, not production metrics.
	return (
		<DonutChart
			motion={motion}
			title={t("流量组成", "Traffic mix")}
			data={[
				{ label: t("对话", "Chat"), value: 42800 },
				{ label: t("代码", "Code"), value: 24600 },
				{ label: t("搜索", "Search"), value: 18300 },
				{ label: t("图像", "Images"), value: 12700 },
				{ label: t("文档", "Documents"), value: 9600 },
				{ label: t("语音", "Audio"), value: 7400 },
				{ label: t("自动化", "Automation"), value: 5100 },
				{ label: t("其他", "Other"), value: 2800 },
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
