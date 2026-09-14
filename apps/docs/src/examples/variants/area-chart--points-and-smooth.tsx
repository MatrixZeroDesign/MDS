import { type DocsLocale, translate } from "../../i18n";
import { AreaChart } from "@matrixzero/charts";

export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	// Deterministic sample observations. Both charts use exactly the same data.
	const data = Array.from({ length: 16 }, (_, i) => ({
		label: String(i + 1),
		web: Math.round(120 + i * 4 + Math.sin(i * 0.8) * 35),
		mobile: Math.round(85 + i * 3 + Math.cos(i * 0.65) * 24),
		desktop: Math.round(50 + i * 2 + Math.sin(i * 0.9) * 18),
		other: Math.round(20 + i + Math.cos(i * 0.7) * 10),
	}));
	return (
		<div style={{ display: "grid", gap: 32, width: "100%" }}>
			{[false, true].map((smooth) => (
				<AreaChart
					key={String(smooth)}
					title={smooth ? t("平滑曲线", "Smooth curves") : t("直线连接", "Straight segments")}
					description={t("16 个观测点 · 四种数据点形状", "16 observations · four marker shapes")}
					data={data}
					smooth={smooth}
					pointShape="circle"
					locale={locale}
					series={[
						{ key: "web", label: t("网页端", "Web"), pointShape: "circle" },
						{ key: "mobile", label: t("移动端", "Mobile"), pointShape: "square" },
						{ key: "desktop", label: t("桌面端", "Desktop"), pointShape: "diamond" },
						{ key: "other", label: t("其他", "Other"), pointShape: "triangle" },
					]}
					labels={{ dataTable: t("查看数据", "View data"), category: t("日期", "Day"), missing: t("缺失", "Missing") }}
				/>
			))}
		</div>
	);
}
