import { languageTag, type DocsLocale, translate } from "../i18n";
import { BarChart } from "@matrixzero/charts";

export default function Example({
	locale = "en",
	motion = true,
	stacked = false,
}: {
	locale?: DocsLocale;
	motion?: boolean;
	stacked?: boolean;
}) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	// Deterministic synthetic data for documentation, not production metrics.
	return (
		<BarChart
			stacked={stacked}
			motion={motion}
			title={t("月度渠道用量", "Monthly usage by channel")}
			locale={languageTag(locale)}
			data={Array.from({ length: 12 }, (_, i) => ({
				label: new Intl.DateTimeFormat(languageTag(locale), { month: "short", timeZone: "UTC" }).format(
					new Date(Date.UTC(2026, i, 1)),
				),
				web: Math.round(24000 + i * 1800 + Math.sin(i * 0.8) * 6500),
				mobile: Math.round(17000 + i * 1200 + Math.cos(i * 0.7) * 4200),
				api: Math.round(12000 + i * 2100 + Math.sin(i * 1.3) * 3200),
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
