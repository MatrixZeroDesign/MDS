import { languageTag, type DocsLocale, translate } from "../../i18n";
import { AreaChart } from "@matrixzero/charts";

export default function Example({
	locale = "en",
	motion = false,
	stacked = false,
}: {
	locale?: DocsLocale;
	motion?: boolean;
	stacked?: boolean;
}) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	// Deterministic synthetic data for documentation, not production metrics.
	return (
		<AreaChart
			stacked={stacked}
			motion={motion}
			title={t("每日渠道请求量", "Daily requests by channel")}
			locale={languageTag(locale)}
			data={Array.from({ length: 60 }, (_, i) => ({
				label: new Intl.DateTimeFormat(languageTag(locale), {
					month: "short",
					day: "numeric",
					timeZone: "UTC",
				}).format(new Date(Date.UTC(2026, 0, i + 1))),
				web: Math.round(2400 + i * 18 + Math.sin(i * 0.33) * 650 + (i % 7 < 2 ? -380 : 180)),
				mobile: Math.round(1700 + i * 12 + Math.cos(i * 0.24) * 420 + (i % 7 < 2 ? 240 : -80)),
				api: Math.round(1200 + i * 21 + Math.sin(i * 0.47) * 320),
			}))}
			series={[
				{ key: "web", label: t("网页端", "Web") },
				{ key: "mobile", label: t("移动端", "Mobile") },
				{ key: "api", label: "API" },
			]}
			labels={{
				dataTable: t("查看数据", "View data"),
				category: t("日期", "Day"),
				empty: t("暂无数据", "No data"),
				missing: t("缺失", "Missing"),
			}}
		/>
	);
}
