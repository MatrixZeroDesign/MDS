import { ArrowRight } from "@matrixzero/icons";
import { type DocsLocale, translate } from "./i18n";
import { ComponentDocs } from "./ComponentDocs";
import { useState, useEffect, type ReactElement } from "react";
import { LineChart, AreaChart, BarChart, DonutChart } from "@matrixzero/charts";
import { Button, SegmentedControl } from "@matrixzero/ui";
import "@matrixzero/charts/styles.css";
import { appPath, routePath } from "./router";
function ChartExample({ kind, children, locale }: { kind: string; children: ReactElement; locale: DocsLocale }) {
	const [status, setStatus] = useState("");
	const code = `import { ${kind} } from '@matrixzero/charts';
import '@matrixzero/charts/styles.css';

export default function Example() {
  return <${kind} {...${JSON.stringify(children.props, null, 2)}} />;
}`;
	return (
		<section className="docs-card">
			{children}
			<a href={appPath(`/charts/${kind.replace("Chart", "").toLowerCase()}-chart`)}>
				Chart API <ArrowRight size={"1em"} className="docs-symbol" />
			</a>
			<details className="docs-code">
				<summary>{translate(locale, "样例代码", "Example code")}</summary>
				<Button
					size="sm"
					onClick={async () => {
						try {
							await navigator.clipboard.writeText(code);
							setStatus(translate(locale, "已复制", "Copied"));
						} catch {
							setStatus(translate(locale, "请手动复制代码", "Please copy the code manually"));
						}
					}}
				>
					{translate(locale, "复制代码", "Copy code")}
				</Button>
				<pre>
					<code>{code}</code>
				</pre>
				<p role="status">{status}</p>
			</details>
		</section>
	);
}
export function ChartsPage({ locale }: { locale: DocsLocale }) {
	const [detail, setDetail] = useState(routePath().split("/")[2]);
	useEffect(() => {
		const sync = () => setDetail(routePath().split("/")[2]);
		window.addEventListener("popstate", sync);
		return () => window.removeEventListener("popstate", sync);
	}, []);
	const t = (zh: string, en: string) => translate(locale, zh, en),
		[range, setRange] = useState("week");
	const values = range === "week" ? [1240, 1830, 1520, 2210, 1940, 2480, 2120] : [540, 760, 910, 880, 1160, 1450, 1240];
	const data = values.map((value, i) => ({
		label: range === "week" ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i] : `${i * 3}:00`,
		requests: value,
		blocked: Math.round(value * 0.12),
	}));
	const series = [
		{ key: "requests", label: t("请求量", "Requests") },
		{ key: "blocked", label: t("检测命中", "Detections") },
	];
	const labels = {
		missing: t("缺失", "Missing"),
		total: t("总计", "Total"),
		dataTable: t("查看数据", "View data"),
		category: t("时间", "Time"),
		empty: t("暂无数据", "No data"),
		value: t("请求量", "Requests"),
	};
	if (detail) return <ComponentDocs locale={locale} />;
	return (
		<>
			<div className="docs-row">
				<p className="docs-muted">
					{t(
						"独立安装 @matrixzero/charts；基础 UI 包不依赖图表库。切换时间范围可体验局部淡入，自动尊重减少动态效果设置。",
						"Install @matrixzero/charts separately; the base UI package does not depend on the chart engine. Switch ranges to see local fades, with reduced-motion support.",
					)}
				</p>
				<SegmentedControl
					label={t("图表时间范围", "Chart range")}
					value={range}
					onValueChange={setRange}
					options={[
						{ value: "week", label: t("近7天", "7 days") },
						{ value: "day", label: t("近24小时", "24 hours") },
					]}
				/>
			</div>
			<div className="docs-grid" style={{ marginTop: 24 }}>
				<ChartExample kind="LineChart" locale={locale}>
					<LineChart
						title={t("调用趋势 · 折线图", "Request trend · Line")}
						description={t("请求 / 时间", "Requests over time")}
						data={data}
						series={series}
						locale={locale}
						labels={labels}
					/>
				</ChartExample>
				<ChartExample kind="AreaChart" locale={locale}>
					<AreaChart
						title={t("请求总量 · 面积图", "Request volume · Area")}
						data={data}
						series={series.slice(0, 1)}
						locale={locale}
						labels={labels}
					/>
				</ChartExample>
				<ChartExample kind="BarChart" locale={locale}>
					<BarChart
						title={t("每日比较 · 柱状图", "Daily comparison · Bar")}
						data={data}
						series={series}
						locale={locale}
						labels={labels}
					/>
				</ChartExample>
				<ChartExample kind="DonutChart" locale={locale}>
					<DonutChart
						title={t("应用占比 · 环形图", "Application mix · Donut")}
						data={[
							{ label: t("对话服务", "Chat"), value: 64 },
							{ label: t("知识检索", "Knowledge"), value: 24 },
							{ label: t("代码助手", "Code"), value: 12 },
						]}
						locale={locale}
						labels={labels}
					/>
				</ChartExample>
				<ChartExample kind="BarChart" locale={locale}>
					<BarChart
						title={t("堆叠比较", "Stacked comparison")}
						stacked
						data={data}
						series={series}
						locale={locale}
						labels={labels}
					/>
				</ChartExample>
				<ChartExample kind="BarChart" locale={locale}>
					<BarChart
						title={t("正负值与缺失数据", "Positive, negative and missing values")}
						stacked
						data={[
							{ label: "Mon", requests: 120, blocked: -40 },
							{ label: "Tue", requests: -70, blocked: 30 },
							{ label: "Wed", requests: null, blocked: 0 },
						]}
						series={series}
						locale={locale}
						labels={labels}
					/>
				</ChartExample>
				<ChartExample kind="LineChart" locale={locale}>
					<LineChart
						title={t("空数据状态", "Empty data state")}
						data={[]}
						series={series}
						locale={locale}
						labels={labels}
					/>
				</ChartExample>
			</div>
		</>
	);
}
