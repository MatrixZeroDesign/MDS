import { type DocsLocale, translate } from "../i18n";
import { ScatterChart } from "@matrixzero/charts";

export default function Example({ locale = "en", motion = true }: { locale?: DocsLocale; motion?: boolean }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	return (
		<ScatterChart
			motion={motion}
			title={t("延迟与流量", "Latency and traffic")}
			data={[
				{ label: "A", x: 12, y: 180 },
				{ label: "B", x: 18, y: 240 },
				{ label: "C", x: 27, y: 310 },
				{ label: "D", x: 36, y: 420 },
			]}
			labels={{ category: t("观测值", "Observations"), empty: t("暂无数据", "No data") }}
		/>
	);
}
